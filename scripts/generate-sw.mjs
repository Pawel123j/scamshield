import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const hash = createHash('sha256');
function scan(path) {
  for (const item of readdirSync(path, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const full = join(path, item.name);
    if (item.isDirectory()) scan(full);
    else if (full !== 'public/sw.js') hash.update(full).update(readFileSync(full));
  }
}
for (const dir of ['app', 'components', 'lib', 'hooks', 'data', 'public']) scan(dir);
hash.update(readFileSync('package-lock.json'));
const template = readFileSync('scripts/sw-template.js', 'utf8');
hash.update(template);
writeFileSync('public/sw.js', template.replace('__BUILD_VERSION__', hash.digest('hex').slice(0,16)));
