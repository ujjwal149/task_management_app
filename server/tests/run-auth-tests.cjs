const { execFileSync } = require('node:child_process');
const url = process.env.TEST_DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith('_test')) {
  throw new Error('Set TEST_DATABASE_URL to a disposable PostgreSQL database whose name ends in _test');
}
const env = { ...process.env, DATABASE_URL: url };
for (const args of [['prisma', 'migrate', 'deploy'], ['prisma', 'generate']]) {
  execFileSync('npx', args, { env, stdio: 'inherit' });
}
execFileSync('npm', ['run', 'build'], { env, stdio: 'inherit' });
execFileSync(process.execPath, ['--test', '--test-timeout=60000', 'tests/auth.test.cjs'], { env, stdio: 'inherit' });
