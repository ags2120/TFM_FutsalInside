/*
 * Seed dataset exporter.
 *
 * Reads the Angular mocks, applies the agreed resolutions, builds a conflict-free
 * matchday calendar, and writes canonical JSON consumed by the Laravel seeders.
 *
 * Every invariant is asserted; a violation aborts rather than emitting bad data.
 */
const fs = require('fs');
const path = require('path');
const m = require('./bundle.cjs');

const cat = (...n) => n.flatMap((x) => m[x] ?? []);
const fail = (msg) => {
  throw new Error('INVARIANT VIOLATION: ' + msg);
};
const assert = (cond, msg) => {
  if (!cond) fail(msg);
};

/* ------------------------------------------------------------------ *
 * Kickoff slots — Decision #1
 * ------------------------------------------------------------------ */
const SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

/* Valid `match_statistics.type` keys, in schema order.
 *
 * This is a validation mirror, not a definition. The single source of truth is
 * `App\Enums\MatchStatisticType`; keep both sides in sync when adding a metric.
 * Frontend mocks already carry the canonical keys, so no mapping is needed here.
 */
const STAT_TYPES = new Set([
  'possession',
  'shots',
  'shots_on_target',
  'corners',
  'fouls',
  'yellow_cards',
  'red_cards',
]);

const LIVE_OFFSET = 0; // the matchday happening "now"
const PAST_STEP = -7; // one matchday per week, backwards
const FUTURE_STEP = 7; // one matchday per week, forwards
const UEFA_LAG = 1; // continental mid-week night, avoiding domestic weekends

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */
const competitions = cat('COMPETITIONS', 'COMPETITION_BRAZIL', 'COMPETITION_ITALY', 'COMPETITION_UEFA');
const teams = cat('MOCK_TEAMS', 'MOCK_TEAMS_BRAZIL', 'MOCK_TEAMS_ITALY', 'MOCK_TEAMS_UEFA');
const standings = cat('MOCK_STANDINGS', 'MOCK_STANDINGS_BRAZIL', 'MOCK_STANDINGS_ITALY', 'MOCK_STANDINGS_UEFA');
const matches = cat('MOCK_ALL_MATCHES', 'MOCK_ALL_MATCHES_BRAZIL', 'MOCK_ALL_MATCHES_ITALY', 'MOCK_ALL_MATCHES_UEFA');
/* Career mocks are Record<playerId, CareerEntry[]>, not arrays. */
const careerRecords = [
  'MOCK_PLAYER_CAREER', 'MOCK_PLAYER_CAREER_BRAZIL',
  'MOCK_PLAYER_CAREER_ITALY', 'MOCK_PLAYER_CAREER_UEFA',
].flatMap((name) => Object.entries(m[name] ?? {}).flatMap(([playerId, entries]) =>
  entries.map((e) => ({ ...e, playerId: Number(playerId) }))));

/* Player sources kept separate so a duplicate id can be detected, not silently
 * overwritten. Order matters: domestic first, UEFA last (the suspect set). */
const playerSources = [
  { file: 'players.mock', data: cat('MOCK_PLAYERS'), comp: 2 },
  { file: 'players-brazil.mock', data: cat('MOCK_PLAYERS_BRAZIL'), comp: 3 },
  { file: 'players-italy.mock', data: cat('MOCK_PLAYERS_ITALY'), comp: 4 },
  { file: 'players-uefa.mock', data: cat('MOCK_PLAYERS_UEFA'), comp: 5 },
];

const playerStatSources = [
  { file: 'player-statistics.mock', data: cat('MOCK_PLAYER_STATISTICS'), comp: 2 },
  { file: 'player-statistics-brazil.mock', data: cat('MOCK_PLAYER_STATISTICS_BRAZIL'), comp: 3 },
  { file: 'player-statistics-italy.mock', data: cat('MOCK_PLAYER_STATISTICS_ITALY'), comp: 4 },
  { file: 'player-statistics-uefa.mock', data: cat('MOCK_PLAYER_STATISTICS_UEFA'), comp: 5 },
];

const teamStatSources = [
  { file: 'team-statistics.mock', data: cat('MOCK_TEAM_STATISTICS'), comp: 2 },
  { file: 'team-statistics-brazil.mock', data: cat('MOCK_TEAM_STATISTICS_BRAZIL'), comp: 3 },
  { file: 'team-statistics-italy.mock', data: cat('MOCK_TEAM_STATISTICS_ITALY'), comp: 4 },
  { file: 'team-statistics-uefa.mock', data: cat('MOCK_TEAM_STATISTICS_UEFA'), comp: 5 },
];

/* ------------------------------------------------------------------ *
 * Resolution 1 — player id collisions
 *
 * The UEFA file redeclares 24 players that already exist domestically, and for
 * 16 of them the two rows are *different people*. A real player does not gain a
 * second identity by entering a continental competition, so the domestic
 * declaration is canonical and the UEFA declaration is discarded. The player's
 * statistics row from the UEFA file is kept, attributed to competition 5.
 * ------------------------------------------------------------------ */
const canonicalPlayers = new Map();
const discardedPlayers = [];

for (const src of playerSources) {
  for (const p of src.data) {
    const existing = canonicalPlayers.get(p.id);
    if (!existing) {
      canonicalPlayers.set(p.id, { ...p, _src: src.file });
      continue;
    }
    const samePerson = `${existing.firstName} ${existing.lastName}` === `${p.firstName} ${p.lastName}`;
    discardedPlayers.push({ id: p.id, file: src.file, name: p.name, samePerson });
  }
}

const players = [...canonicalPlayers.values()].sort((a, b) => a.id - b.id);
const playerIds = new Set(players.map((p) => p.id));

/* ------------------------------------------------------------------ *
 * Resolution 2 — statistics duplicates, via competition_id assignment
 * ------------------------------------------------------------------ */
const playerStats = [];
for (const src of playerStatSources) {
  for (const s of src.data) {
    assert(playerIds.has(s.playerId), `player-statistics ${src.file} -> unknown player ${s.playerId}`);
    playerStats.push({ ...s, competitionId: src.comp, _src: src.file });
  }
}

const psSeen = new Set();
for (const s of playerStats) {
  const k = `${s.playerId}|${s.season}|${s.competitionId}`;
  assert(!psSeen.has(k), `player_statistics duplicate key ${k}`);
  psSeen.add(k);
}

/* ------------------------------------------------------------------ *
 * team_statistics: derived from standings, enriched from the stats files
 * ------------------------------------------------------------------ */
const teamStatByKey = new Map();
for (const src of teamStatSources) {
  for (const t of src.data) {
    teamStatByKey.set(`${src.comp}|${t.teamId}`, { ...t, competitionId: src.comp, _src: src.file });
  }
}

const standingsByComp = new Map();
for (const s of standings) {
  if (!standingsByComp.has(s.competitionId)) standingsByComp.set(s.competitionId, []);
  standingsByComp.get(s.competitionId).push(s);
}

/* Possession and shots-per-match are team-level, season-independent metrics, so
 * a club's figures from one competition remain valid in another. Collect them
 * per team to backfill competitions that have no stats file of their own
 * (notably LNFS 2026/2027, which shares its ten clubs with 2025/2026). */
const teamAverages = new Map();
for (const src of teamStatSources) {
  for (const t of src.data) {
    if (!teamAverages.has(t.teamId)) {
      teamAverages.set(t.teamId, {
        avgBallPossession: t.avgBallPossession ?? 0,
        avgShotsPerMatch: t.avgShotsPerMatch ?? 0,
      });
    }
  }
}

/* Finished fixtures per (competition, team) — used to derive clean sheets for
 * in-season competitions, whose P is far smaller than a full 18/38-game season. */
const finishedFixtures = new Map();
for (const mt of matches.filter((x) => x.status === 'finished')) {
  for (const side of ['homeTeam', 'awayTeam']) {
    const t = mt[side];
    const k = `${mt.competition.id}|${t.id}`;
    if (!finishedFixtures.has(k)) finishedFixtures.set(k, { played: 0, clean: 0 });
    const rec = finishedFixtures.get(k);
    rec.played++;
    if (side === 'awayTeam' && mt.homeScore === 0) rec.clean++;
  }
}

const teamStats = [];
for (const [compId, rows] of standingsByComp) {
  for (const s of rows) {
    const key = `${compId}|${s.team.id}`;
    const extra = teamStatByKey.get(key);
    const own = finishedFixtures.get(key);

    const matchesPlayed = s.played;
    const wins = s.won;
    const draws = s.drawn;
    const losses = s.lost;
    const goalsFor = s.goalsFor;
    const goalsAgainst = s.goalsAgainst;
    const goalsDifference = goalsFor - goalsAgainst;
    const points = wins * 3 + draws;

    assert(goalsDifference === s.goalDifference, `comp ${compId} team ${s.team.id} goalDifference`);
    assert(points === s.points, `comp ${compId} team ${s.team.id} points ${points} != ${s.points}`);
    assert(wins + draws + losses === matchesPlayed, `comp ${compId} team ${s.team.id} W+D+L != played`);

    // Clean sheets: prefer the season's own stats file (clamped to the season
    // length), otherwise derive a lower bound from the finished fixtures that
    // actually exist for this competition.
    let cleanSheets;
    let cleanSheetsSource;
    if (extra) {
      cleanSheets = Math.min(extra.cleanSheets, matchesPlayed);
      cleanSheetsSource = extra._src;
    } else if (own && own.played > 0) {
      cleanSheets = Math.min(own.clean, matchesPlayed);
      cleanSheetsSource = 'derived-from-fixtures';
    } else {
      cleanSheets = 0;
      cleanSheetsSource = 'none';
    }

    const averages = extra ?? teamAverages.get(s.team.id) ?? null;

    teamStats.push({
      teamId: s.team.id,
      competitionId: compId,
      season: compId === 1 ? '2026/2027' : '2025/2026',
      matchesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalsDifference,
      points,
      form: (s.form ?? []).join(''),
      cleanSheets,
      avgPossession: averages?.avgBallPossession ?? 0,
      avgShotsPerMatch: averages?.avgShotsPerMatch ?? 0,
      _derivedFrom: 'standings',
      _enrichedFrom: extra?._src ?? (averages ? 'team-level fallback' : null),
      _cleanSheetsFrom: cleanSheetsSource,
    });
  }
}

const tsSeen = new Set();
for (const t of teamStats) {
  const k = `${t.teamId}|${t.season}|${t.competitionId}`;
  assert(!tsSeen.has(k), `team_statistics duplicate key ${k}`);
  tsSeen.add(k);
  assert(t.cleanSheets <= t.matchesPlayed, `clean_sheets > matches_played for ${k}`);
  assert(t.form === '' || /^[WDL]{1,5}$/.test(t.form), `bad form "${t.form}" for ${k}`);
}

/* ------------------------------------------------------------------ *
 * Resolution 3 — matchday calendar (Decision #1)
 * ------------------------------------------------------------------ */

/* Split each competition's fixtures by intent, then first-fit them into rounds
 * so that no team appears twice in the same round. */
const fixturesByComp = new Map();
for (const mt of matches) {
  if (!fixturesByComp.has(mt.competition.id)) fixturesByComp.set(mt.competition.id, []);
  fixturesByComp.get(mt.competition.id).push(mt);
}

function firstFitRounds(fixtures) {
  const rounds = [];
  const ordered = [...fixtures].sort((a, b) => a.id - b.id);
  for (const fx of ordered) {
    const teamsOf = [fx.homeTeam.id, fx.awayTeam.id];
    let placed = false;
    for (const round of rounds) {
      const busy = new Set();
      for (const f of round) {
        busy.add(f.homeTeam.id);
        busy.add(f.awayTeam.id);
      }
      if (!teamsOf.some((t) => busy.has(t))) {
        round.push(fx);
        placed = true;
        break;
      }
    }
    if (!placed) rounds.push([fx]);
  }
  return rounds;
}

function splitByIntent(round) {
  const inProgress = round.filter((f) => f.status === 'live' || f.status === 'halftime');
  const finished = round.filter((f) => f.status === 'finished');
  const scheduled = round.filter((f) => f.status === 'scheduled');
  return { inProgress, finished, scheduled };
}

/* Assign day offsets. A competition gets one live round at LIVE_OFFSET, past
 * rounds stepping back a week, future rounds stepping forward a week. Rounds
 * that mix intents (because first-fit may pack them together) are split so that
 * the live round holds at most one matchday's worth of games. */
const schedule = [];
const bookedByDay = new Map(); // dayOffset -> Set(teamId), for cross-competition clashes

function claimDay(offset, teamIds, competitionId) {
  if (!bookedByDay.has(offset)) bookedByDay.set(offset, new Map());
  const day = bookedByDay.get(offset);
  for (const t of teamIds) {
    if (day.has(t)) {
      // A club may appear in several competitions, but not twice on one day.
      return false;
    }
  }
  for (const t of teamIds) day.set(t, competitionId);
  return true;
}

const competitionOrder = [...fixturesByComp.keys()].sort((a, b) => a - b);

for (const compId of competitionOrder) {
  const fixtures = fixturesByComp.get(compId);
  const isContinental = compId === 5;
  const rounds = firstFitRounds(fixtures);

  const pastRounds = [];
  const futureRounds = [];
  const liveCandidates = [];

  for (const round of rounds) {
    const { inProgress, finished, scheduled } = splitByIntent(round);
    if (inProgress.length > 0) liveCandidates.push(inProgress);
    if (finished.length > 0) pastRounds.push(finished);
    if (scheduled.length > 0) futureRounds.push(scheduled);
  }

  // The live round is always played "now". Anything that cannot be placed today
  // without double-booking a club is demoted to a finished result on the
  // preceding matchday, because a match dated in the future must never be
  // reported as in progress.
  const liveRound = liveCandidates.shift() ?? [];
  let demotedLive = 0;
  if (liveRound.length > 0) {
    if (claimDay(LIVE_OFFSET, liveRound.flatMap((f) => [f.homeTeam.id, f.awayTeam.id]), compId)) {
      schedule.push({ compId, offset: LIVE_OFFSET, kind: 'live', fixtures: liveRound });
    } else {
      for (const fx of liveRound) {
        fx.status = 'finished';
        fx.minute = null;
      }
      demotedLive = liveRound.length;
      pastRounds.push(liveRound);
    }
  }

  // Further in-progress rounds (a competition's live set spilled past one
  // matchday) cannot also be "now", so they are demoted to results as well.
  for (const extra of liveCandidates) {
    for (const fx of extra) {
      fx.status = 'finished';
      fx.minute = null;
    }
    demotedLive += extra.length;
    pastRounds.push(extra);
  }

  pastRounds.sort((a, b) => b[0].id - a[0].id);

  // Continental competitions play mid-week so their past and future rounds
  // never collide with a domestic matchday involving the same clubs.
  const base = isContinental ? LIVE_OFFSET + UEFA_LAG : LIVE_OFFSET;

  if (demotedLive > 0) {
    console.log(`  comp ${compId}: ${demotedLive} in-progress match(es) demoted to finished results`);
  }

  // past, walking backwards
  let pastOffset = base;
  for (const round of pastRounds) {
    pastOffset += PAST_STEP;
    schedule.push({ compId, offset: pastOffset, kind: 'finished', fixtures: round });
  }

  // future, walking forwards
  let futureOffset = base;
  for (const round of futureRounds) {
    futureOffset += FUTURE_STEP;
    schedule.push({ compId, offset: futureOffset, kind: 'scheduled', fixtures: round });
  }
}

/* Assign kickoff slots inside each matchday. Matches in a round are sorted by
 * id and given consecutive slots from a rotating start, so a round is spread
 * across the evening rather than all kicking off together. */
function assignSlots(fixtures, compId, roundIndex) {
  const ordered = [...fixtures].sort((a, b) => a.id - b.id);
  const n = ordered.length;
  // Every competition in this dataset fields exactly 10 teams, so a single
  // matchday can hold at most 5 fixtures. This is the invariant behind
  // Decision #1: fixtures must not pile onto one matchday.
  const MAX_GAMES_PER_ROUND = 5;
  assert(n <= MAX_GAMES_PER_ROUND, `matchday of ${n} matches exceeds ${MAX_GAMES_PER_ROUND} (comp ${compId})`);
  assert(n <= SLOTS.length, `matchday of ${n} matches exceeds ${SLOTS.length} slots (comp ${compId})`);

  const start = (roundIndex * 2) % SLOTS.length;
  const usable = start + n <= SLOTS.length ? start : 0;

  // No team may share a slot with itself; within a validated round each team
  // appears once, so consecutive slots are safe. Assert it regardless.
  const used = new Map();
  ordered.forEach((fx, i) => {
    const slot = SLOTS[usable + i];
    for (const t of [fx.homeTeam.id, fx.awayTeam.id]) {
      assert(!used.has(t), `team ${t} double-booked in comp ${compId} matchday at ${slot}`);
      used.set(t, slot);
    }
    fx._kickoff = slot;
  });
  return ordered;
}

const out = [];
let roundIndex = 0;
for (const entry of schedule.sort((a, b) => a.offset - b.offset || a.compId - b.compId)) {
  const ordered = assignSlots(entry.fixtures, entry.compId, roundIndex);
  for (const fx of ordered) {
    fx._dayOffset = entry.offset;
    fx._roundKind = entry.kind;
  }
  out.push(entry);
  roundIndex++;
}

/* Every fixture must land in exactly one matchday, otherwise it would be
 * silently dropped from the output. */
const scheduledIds = new Set();
for (const entry of out) {
  for (const fx of entry.fixtures) {
    assert(!scheduledIds.has(fx.id), `match ${fx.id} scheduled in more than one matchday`);
    scheduledIds.add(fx.id);
  }
}
for (const mt of matches) {
  assert(scheduledIds.has(mt.id), `match ${mt.id} was never scheduled`);
}

/* Global assertion: no team plays twice on the same day, anywhere. */
const teamsPerDay = new Map();
for (const entry of out) {
  for (const fx of entry.fixtures) {
    const k = `${fx._dayOffset}|${fx.homeTeam.id}`;
    assert(!teamsPerDay.has(k), `team ${fx.homeTeam.id} plays twice on day ${fx._dayOffset}`);
    teamsPerDay.set(k, true);
    const k2 = `${fx._dayOffset}|${fx.awayTeam.id}`;
    assert(!teamsPerDay.has(k2), `team ${fx.awayTeam.id} plays twice on day ${fx._dayOffset}`);
    teamsPerDay.set(k2, true);
  }
}

/* A team must not play two matches on the same calendar day even if they were
 * placed in different competitions on the same offset. Already covered above
 * because the key includes only the day offset, not the competition. */

/* ------------------------------------------------------------------ *
 * Emit
 * ------------------------------------------------------------------ */
/* Output lands next door in the seeder datasets, which is what the Laravel
 * seeders read via SeedsFromJson. */
const outDir = path.resolve(__dirname, '../seeders/data');
fs.mkdirSync(outDir, { recursive: true });

const write = (name, data) => {
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(data, null, 2) + '\n');
  return data.length;
};

const parseMarketValue = (raw) => {
  if (raw == null) return null;
  const s = String(raw).replace(/[^\d.,KkMm]/g, '');
  const num = parseFloat(s.replace(',', '.'));
  if (Number.isNaN(num)) return null;
  if (/[Kk]/.test(s)) return Math.round(num * 1e3);
  if (/[Mm]/.test(s)) return Math.round(num * 1e6);
  return Math.round(num);
};

const outCompetitions = competitions.map((c) => ({
  id: c.id,
  name: c.name,
  country: c.country,
  season: c.season,
  logo_url: c.logoUrl || null,
}));

const outTeams = [];
const seenTeamIds = new Set();
for (const t of teams) {
  if (seenTeamIds.has(t.id)) continue; // 6 ids are referenced by a second, partial literal
  seenTeamIds.add(t.id);
  outTeams.push({
    id: t.id,
    name: t.name,
    short_name: t.shortName,
    country: t.country,
    league: t.league ?? null,
    badge_url: t.badgeUrl || null,
    venue: t.venue ?? null,
    founded_year: t.founded ?? null,
    coach: t.coach ?? null,
    titles: t.titles ?? 0,
    stadium_capacity: t.stadiumCapacity ?? null,
  });
}

const teamComp = new Set();
for (const s of standings) teamComp.add(`${s.competitionId}|${s.team.id}`);
const outTeamCompetition = [...teamComp]
  .map((k) => {
    const [competitionId, teamId] = k.split('|').map(Number);
    return { team_id: teamId, competition_id: competitionId };
  })
  .sort((a, b) => a.competition_id - b.competition_id || a.team_id - b.team_id);

const outPlayers = players.map((p) => {
  assert(p.team && p.team.id != null, `player ${p.id} has no team`);
  return {
    id: p.id,
    name: p.name,
    first_name: p.firstName,
    last_name: p.lastName,
    photo_url: p.photoUrl || null,
    birth_date: p.birthDate ?? null,
    nationality: p.nationality,
    height: p.height ?? null,
    weight: p.weight ?? null,
    dominant_foot: p.dominantFoot ?? null,
    position: p.position,
    shirt_number: p.shirtNumber ?? null,
    market_value: parseMarketValue(p.marketValue),
    team_id: p.team.id,
  };
});

const outMatches = matches
  .slice()
  .sort((a, b) => a.id - b.id)
  .map((mt) => {
    const evts = mt.events ?? [];
    const stats = mt.statistics ?? [];
    let status = mt.status;
    if (mt._roundKind === 'live') status = mt.status === 'halftime' ? 'halftime' : 'live';
    return {
      id: mt.id,
      competition_id: mt.competition.id,
      team_home_id: mt.homeTeam.id,
      team_away_id: mt.awayTeam.id,
      status,
      day_offset: mt._dayOffset,
      kickoff: mt._kickoff,
      home_score: mt.homeScore ?? 0,
      away_score: mt.awayScore ?? 0,
      minute: status === 'live' || status === 'halftime' ? (mt.minute ?? null) : null,
      venue: mt.venue ?? null,
      referee: mt.referee ?? null,
      attendance: mt.attendance ?? null,
      mvp_player_id: mt.mvpPlayer ? mt.mvpPlayer.id : null,
    };
  });

/* Events and statistics are emitted as their own flat tables carrying an
 * explicit match_id, rather than duplicated inside each match record. */
const outEvents = [];
const outMatchStats = [];
for (const mt of matches) {
  for (const e of mt.events ?? []) {
    outEvents.push({
      match_id: mt.id,
      event_type: e.type,
      minute: e.minute,
      player_id: e.player.id,
      team_id: e.team.id,
      assist_player_id: e.assistPlayer ? e.assistPlayer.id : null,
      description: null,
    });
  }
  for (const s of mt.statistics ?? []) {
    assert(STAT_TYPES.has(s.type), `unknown match_statistics type "${s.type}"`);
    outMatchStats.push({
      match_id: mt.id,
      type: s.type,
      home_value: s.homeValue,
      away_value: s.awayValue,
    });
  }
}
assert(new Set(outEvents.map((e) => e.match_id)).size <= outMatches.length, 'event match_ids out of range');
const msSeen = new Set();
for (const s of outMatchStats) {
  const k = `${s.match_id}|${s.type}`;
  assert(!msSeen.has(k), `match_statistics duplicate key ${k}`);
  msSeen.add(k);
}

const outPlayerStats = playerStats.map((s) => ({
  player_id: s.playerId,
  competition_id: s.competitionId,
  season: s.season,
  matches_played: s.matchesPlayed,
  goals: s.goals,
  assists: s.assists,
  yellow_cards: s.yellowCards,
  red_cards: s.redCards,
  minutes_played: s.minutesPlayed,
  expected_goals: s.expectedGoals,
  expected_assists: s.expectedAssists,
  pass_accuracy: s.passAccuracy,
  shot_accuracy: s.shotAccuracy,
  defensive_actions: s.defensiveActions,
  goal_participation: s.goalParticipation,
  saves: s.saves ?? 0,
  blocks: s.blocks ?? 0,
  steals: s.steals ?? 0,
  // Player.averageRating is derived from player_statistics.rating (decision
  // #5). The frontend keeps a single overall average per player, so it is
  // carried onto each of that player's season rows.
  rating: canonicalPlayers.get(s.playerId)?.averageRating ?? null,
}));

const outTeamStats = teamStats.map((t) => ({
  team_id: t.teamId,
  competition_id: t.competitionId,
  season: t.season,
  matches_played: t.matchesPlayed,
  wins: t.wins,
  draws: t.draws,
  losses: t.losses,
  goals_for: t.goalsFor,
  goals_against: t.goalsAgainst,
  goals_difference: t.goalsDifference,
  points: t.points,
  form: t.form,
  clean_sheets: t.cleanSheets,
  avg_possession: t.avgPossession,
  avg_shots_per_match: t.avgShotsPerMatch,
}));

/* Career entries: no entry in the mocks carries an endDate, so the most recent
 * start date per player is treated as the current (open) stint. */
const careersByPlayer = new Map();
for (const e of careerRecords) {
  careersByPlayer.set(`${e.playerId}|${e.team.id}|${e.startDate}`, e);
}
const byPlayer = new Map();
for (const e of careersByPlayer.values()) {
  if (!byPlayer.has(e.playerId)) byPlayer.set(e.playerId, []);
  byPlayer.get(e.playerId).push(e);
}
const outCareers = [];
let droppedOverlappingStints = 0;
for (const [playerId, entries] of byPlayer) {
  assert(playerIds.has(playerId), `career entry references unknown player ${playerId}`);

  // A career must read as strictly sequential stints. The UEFA career file
  // redeclares some players with a start date identical to their domestic one
  // (they belong to the discarded duplicate person), which would otherwise
  // yield a zero-length stint. When stints collide on start date, the one
  // matching the retained player's current club wins, matching the player
  // resolution decision.
  const currentTeamId = canonicalPlayers.get(playerId)?.team?.id ?? null;
  const sorted = entries
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const kept = [];
  for (const e of sorted) {
    const last = kept[kept.length - 1];
    if (last && e.startDate <= last.startDate) {
      const challengerWins = e.team.id === currentTeamId && last.team_id !== currentTeamId;
      if (challengerWins) {
        kept[kept.length - 1] = { ...e, team_id: e.team.id };
      }
      droppedOverlappingStints += 1;
      continue;
    }
    kept.push({ ...e, team_id: e.team.id });
  }

  kept.forEach((e, i) => {
    // The mocks carry no endDate at all. A stint is treated as closed once the
    // next one begins, so the final stint stays open (NULL).
    const next = kept[i + 1];
    outCareers.push({
      player_id: playerId,
      team_id: e.team_id,
      start_date: e.startDate,
      end_date: next ? next.startDate : null,
      matches_played: e.matchesPlayed,
      goals: e.goals,
    });
  });
}

/* No player may hold two stints on the same day, and no stint may be
 * zero-length: both would break the sequential-stint invariant above. */
const careerStartKeys = new Set();
for (const c of outCareers) {
  const k = `${c.player_id}|${c.start_date}`;
  assert(!careerStartKeys.has(k), `overlapping career stints for player ${c.player_id} on ${c.start_date}`);
  careerStartKeys.add(k);
  assert(
    c.end_date === null || c.end_date > c.start_date,
    `zero-length career stint for player ${c.player_id} starting ${c.start_date}`,
  );
  assert(teams.some((t) => t.id === c.team_id), `career entry references unknown team ${c.team_id}`);
}

const counts = {
  competitions: write('competitions.json', outCompetitions),
  teams: write('teams.json', outTeams),
  team_competition: write('team_competition.json', outTeamCompetition),
  players: write('players.json', outPlayers),
  player_statistics: write('player_statistics.json', outPlayerStats),
  matches: write('matches.json', outMatches),
  match_events: write('match_events.json', outEvents),
  match_statistics: write('match_statistics.json', outMatchStats),
  team_statistics: write('team_statistics.json', outTeamStats),
  career_entries: write('career_entries.json', outCareers),
};

console.log('written to', outDir);
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(20)} ${v}`);

console.log('\ndiscarded duplicate player declarations:', discardedPlayers.length,
  '(' + discardedPlayers.filter((d) => d.samePerson).length + ' same person,',
  discardedPlayers.filter((d) => !d.samePerson).length + ' different person)');

console.log('\nmatchday calendar:');
const byDay = new Map();
for (const mt of outMatches) {
  if (!byDay.has(mt.day_offset)) byDay.set(mt.day_offset, []);
  byDay.get(mt.day_offset).push(mt);
}
for (const [off, list] of [...byDay].sort((a, b) => a[0] - b[0])) {
  const st = list.reduce((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {});
  console.log(`  day ${String(off).padStart(4)}: ${String(list.length).padStart(2)} matches  ${JSON.stringify(st)}  slots ${[...new Set(list.map((x) => x.kickoff))].sort().join(',')}`);
}
console.log('\nper competition x day:');
const grid = new Map();
for (const mt of outMatches) {
  const k = `${mt.competition_id}|${mt.day_offset}`;
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(mt);
}
const compNames = Object.fromEntries(competitions.map((c) => [c.id, c.season]));
for (const [k, list] of [...grid].sort((a, b) => Number(a[0].split('|')[0]) - Number(b[0].split('|')[0]) || a[0].split('|')[1] - b[0].split('|')[1])) {
  const [c, off] = k.split('|');
  const st = list.reduce((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {});
  const teamsUsed = new Set(list.flatMap((x) => [x.team_home_id, x.team_away_id]));
  console.log(`  comp ${c} (${compNames[c]}) day ${String(off).padStart(4)}: ${String(list.length).padStart(2)} games, ${String(teamsUsed.size).padStart(2)}/10 teams  ${JSON.stringify(st)}  ${[...new Set(list.map((x) => x.kickoff))].sort().join(',')}`);
}

console.log('\nmax games in any single competition matchday:', Math.max(...[...grid.values()].map((l) => l.length)));
const maxPerDay = Math.max(...[...byDay].map(([, l]) => l.length));
console.log('max matches on any single calendar day (all competitions):', maxPerDay);
console.log('live matches total:', outMatches.filter((x) => x.status === 'live' || x.status === 'halftime').length);
console.log('per-competition live:', JSON.stringify(outMatches.filter((x) => x.status === 'live' || x.status === 'halftime').reduce((a, x) => ({ ...a, [x.competition_id]: (a[x.competition_id] ?? 0) + 1 }), {})));
console.log('\ncareer entries: raw', careerRecords.length, '-> deduped', outCareers.length);
console.log('open (current) stints:', outCareers.filter((c) => c.end_date === null).length);
