import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve(process.argv[2] ?? 'evaluation-results.json');
const run = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', 'tests/evaluation.test.ts'], {
  stdio: 'inherit',
  env: { ...process.env, SCAM_EVALUATION_OUTPUT: output },
});
if (run.error) throw run.error;
if (run.signal) throw new Error(`Evaluation interrupted by ${run.signal}`);
const report = JSON.parse(readFileSync(output, 'utf8'));
console.log(`${report.expectedBandMatches}/${report.total} expected risk bands on a synthetic development set; NOT real-world accuracy.`);
console.table(report.confusion);
console.log('Known or newly observed mismatches:', report.results.filter(item => !item.matches).map(item => item.id).join(', '));
console.log(`Full report: ${output}`);
process.exitCode = run.status ?? 1;
