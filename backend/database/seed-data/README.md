# Seed data generator

Generates the canonical JSON datasets the Laravel seeders read from
`database/seeders/data/*.json`.

The source of truth is the Angular mock layer in `frontend/src/app/core/mocks/`.
These scripts bundle that TypeScript into CommonJS, then resolve the mock data
into database-shaped rows.

| File | Purpose |
| --- | --- |
| `entry.ts` | Re-exports the frontend mock barrel; the esbuild input. |
| `export.cjs` | Builds `database/seeders/data/*.json` and asserts invariants. |
| `inspect.cjs` | Prints a read-only report of the raw mocks (diagnostics only). |
| `bundle.cjs` | esbuild output. Generated, not committed. |

## Regenerating

Run from the `frontend/` directory, so esbuild resolves from its `node_modules`:

```sh
cd ../frontend
npx esbuild ../backend/database/seed-data/entry.ts \
  --bundle --platform=node --format=cjs \
  --outfile=../backend/database/seed-data/bundle.cjs
cd ../backend
node database/seed-data/export.cjs
```

Then apply the result:

```sh
php artisan migrate:fresh --seed
```

## What the export resolves

The raw mocks are not directly insertable. `export.cjs` corrects them and
fails loudly rather than emitting data that breaks an invariant:

- **Player identity** — 190 mock declarations collapse to 166 players. The UEFA
  file redeclares 24 of them; 8 are the same person, 16 are different people
  with a reused ID. The domestic declaration always wins.
- **Schedules** — the mock calendar double-books clubs (same team twice in a
  day, and across competitions) and puts every match in one kickoff slot.
  Fixtures are regrouped into matchdays of at most five games, drawn from
  `18:00`–`21:00`, with a club never playing twice in a day.
- **Live fixtures** — a match in progress is always dated today. In-progress
  fixtures that cannot be placed without a club conflict are demoted to
  finished results rather than dated in the future.
- **Career stints** — stints are forced to be sequential, so no player holds
  two stints on one date and none is zero-length.
- **Statistics** — `team_statistics` is derived from the standings mock and
  enriched from the per-team files; `goals_difference` and `points` are
  recomputed. `player_statistics.rating` carries the player's average rating.
- **Derived values** — `radarAttributes` and `averageRating` are intentionally
  not emitted; they are computed at read time.
- **Statistic keys** — mocks already carry the canonical API keys
  (`possession`, `shots_on_target`, …) rather than display labels, so
  mock data and API data share one shape. `export.cjs` asserts each key against
  `App\Enums\MatchStatisticType` and rejects anything unknown. Display strings
  live only in the frontend.

## Invariants asserted before writing

Foreign keys resolve; every match is scheduled exactly once; no club plays
twice in a day; no competition fields two fixtures in one slot; no duplicate
`(match_id, type)` or `(player_id, season, competition_id)` keys; career
stints are sequential and non-zero-length; every statistic key is a case of
`MatchStatisticType`.

`database/seeders/DatabaseSeeder.php` re-checks row counts and referential
integrity after seeding, and `tests/Feature/DatabaseSeederTest.php` locks the
guarantees in place.
