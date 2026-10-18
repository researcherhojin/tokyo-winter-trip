import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
const skip=new Set(['node_modules','.git','output','.playwright-cli'])
const patterns=[new RegExp('AI'+'za[0-9A-Za-z_-]{35}'),/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/gh[pousr]_[A-Za-z0-9]{30,}/,/(?:ntn_|secret_)[A-Za-z0-9]{20,}/]
let count=0;const hits=[]
async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(skip.has(e.name)||e.name.startsWith('.env')||e.name.endsWith('.tsbuildinfo'))continue;const file=path.join(dir,e.name);if(e.isDirectory())await scan(file);else{const content=await readFile(file,'utf8');count++;if(patterns.some(p=>p.test(content)))hits.push(file)}}}
await scan('.')
if((await readFile('.env.example','utf8')).trim()!=='VITE_GOOGLE_MAPS_API_KEY=')hits.push('.env.example must be empty')
const ignored=await readFile('.gitignore','utf8');if(!ignored.includes('.env.local'))hits.push('.env.local ignore missing')
if(existsSync('.git')){
 const tracked=execFileSync('git',['ls-files'],{encoding:'utf8'}).split('\n');if(tracked.some(p=>p.startsWith('.env')&&p!=='.env.example'))hits.push('tracked environment file')
 console.log('Git tracked environment files checked. Remote history is outside this local scan.')
}else console.log('No .git directory or GitHub remote configured. Remote GitHub history not verified.')
if(hits.length){console.error('Possible secrets or configuration issues in:',hits.join(', '));process.exitCode=1}else console.log(`PASS: scanned ${count} project/build files; no key/token patterns. .env.example empty; .env.local ignored.`)
