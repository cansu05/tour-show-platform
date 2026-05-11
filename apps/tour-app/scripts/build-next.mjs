import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nextCli = path.resolve(scriptDir, '../../../node_modules/next/dist/bin/next');
const result = spawnSync(process.execPath, [nextCli, 'build'], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    NEXT_PRIVATE_BUILD_WORKER: '0'
  }
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
