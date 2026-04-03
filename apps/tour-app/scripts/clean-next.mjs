import {existsSync, rmSync} from 'node:fs';
import {join} from 'node:path';

const targets = ['.next'];

for (const target of targets) {
  const full = join(process.cwd(), target);
  if (!existsSync(full)) {
    console.log(`[clean-next] skip: ${target} not found`);
    continue;
  }

  let removed = false;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      rmSync(full, {recursive: true, force: true, maxRetries: 3, retryDelay: 150});
      removed = true;
      console.log(`[clean-next] removed: ${target}`);
      break;
    } catch (error) {
      console.warn(`[clean-next] attempt ${attempt} failed for ${target}:`, error?.message || error);
    }
  }

  if (!removed) {
    process.exitCode = 1;
  }
}
