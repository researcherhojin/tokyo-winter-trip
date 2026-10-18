import { spawnSync } from 'node:child_process'
const command=process.platform==='win32'?'npm.cmd':'npm'
for(const step of ['test','spellcheck','security:scan']){
 console.log(`\nChecking: ${step}`)
 const result=spawnSync(command,['run',step],{stdio:'inherit'})
 if(result.error){console.error(result.error.message);process.exit(1)}
 if(result.status!==0)process.exit(result.status??1)
}
console.log('\nAll local checks passed. Browser and deployment verification are separate.')
