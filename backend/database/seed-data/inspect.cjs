const m = require('./bundle.cjs');
const cat = (...n) => n.flatMap((x) => m[x] ?? []);
const matches = cat('MOCK_ALL_MATCHES', 'MOCK_ALL_MATCHES_BRAZIL', 'MOCK_ALL_MATCHES_ITALY', 'MOCK_ALL_MATCHES_UEFA');

const byStatus = (s) => matches.filter((x) => x.status === s);

console.log('=== in-progress (live + halftime) ===');
const inprog = matches.filter((x) => x.status === 'live' || x.status === 'halftime');
console.log('count:', inprog.length);
console.log('by competition:', JSON.stringify(inprog.reduce((a, x) => ({ ...a, [x.competition.id]: (a[x.competition.id] ?? 0) + 1 }), {})));
console.log('by date:', JSON.stringify(inprog.reduce((a, x) => ({ ...a, [x.date]: (a[x.date] ?? 0) + 1 }), {})));
const teamUse = new Map();
for (const x of inprog) for (const t of [x.homeTeam.id, x.awayTeam.id]) teamUse.set(t, (teamUse.get(t) ?? 0) + 1);
console.log('appearances per team:', JSON.stringify([...teamUse].sort((a, b) => a - b)));
console.log('distinct teams involved:', teamUse.size);
console.log('\nfixtures (id | status | home vs away | date):');
for (const x of inprog.sort((a, b) => a.id - b.id)) {
  console.log(`  ${x.id} | ${x.status.padEnd(8)} | ${String(x.homeTeam.shortName).padEnd(4)} vs ${String(x.awayTeam.shortName).padEnd(4)} | ${x.date} | min=${x.minute} | ev=${(x.events ?? []).length} | stats=${(x.statistics ?? []).length}`);
}

console.log('\n=== finished ===');
const fin = byStatus('finished');
console.log('count:', fin.length);
console.log('by competition:', JSON.stringify(fin.reduce((a, x) => ({ ...a, [x.competition.id]: (a[x.competition.id] ?? 0) + 1 }), {})));
console.log('by date:', JSON.stringify(fin.reduce((a, x) => ({ ...a, [x.date]: (a[x.date] ?? 0) + 1 }), {}), null, 1));
const fu = new Map();
for (const x of fin) for (const t of [x.homeTeam.id, x.awayTeam.id]) fu.set(t, (fu.get(t) ?? 0) + 1);
console.log('finished per team:', JSON.stringify([...fu].sort((a, b) => a - b)));

console.log('\n=== scheduled ===');
const sch = byStatus('scheduled');
console.log('count:', sch.length);
console.log('by competition:', JSON.stringify(sch.reduce((a, x) => ({ ...a, [x.competition.id]: (a[x.competition.id] ?? 0) + 1 }), {})));
console.log('by date:', JSON.stringify(sch.reduce((a, x) => ({ ...a, [x.date]: (a[x.date] ?? 0) + 1 }), {})));
console.log('scheduled have events?', sch.filter((x) => (x.events ?? []).length > 0).length, '| stats?', sch.filter((x) => (x.statistics ?? []).length > 0).length);
console.log('scheduled have minute?', sch.filter((x) => x.minute != null).length);
