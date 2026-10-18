import { execFileSync } from 'node:child_process'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { browserAudit } from './browser-scenarios.mjs'
import { catalogBrowserAudit } from './catalog-browser-scenarios.mjs'
import { travelSupportAudit } from './travel-browser-scenarios.mjs'
import { themePhotoAudit } from './theme-photo-scenarios.mjs'
import { preparationAudit } from './preparation-browser-scenarios.mjs'
import { intentAudit } from './intent-scenarios.mjs'
const cli=process.env.PLAYWRIGHT_CLI??path.join(homedir(),'.codex/skills/playwright/scripts/playwright_cli.sh')
if(!existsSync(cli))throw Error('Playwright CLI missing. Set PLAYWRIGHT_CLI to its installed wrapper path.')
const response=await fetch('http://127.0.0.1:5173/').catch(()=>null)
if(!response?.ok)throw Error('Start npm run dev on 127.0.0.1:5173 before the browser audit.')
await mkdir('output/playwright',{recursive:true})
const run=args=>execFileSync('bash',[cli,'--session','tokyo-audit',...args],{encoding:'utf8',timeout:90000,maxBuffer:2*1024*1024})
try{
 run(['open','http://127.0.0.1:5173/','--browser','chrome'])
 const photos=JSON.parse(await readFile('src/data/photos.json','utf8'))
 const result=run(['run-code',`async(page)=>(${browserAudit.toString()})(page,${JSON.stringify(photos)})`])
 const json=result.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!json)throw Error('Browser audit did not return a report. Inspect the ignored Playwright artifacts.')
 const report=JSON.parse(json)
 const catalogResult=run(['run-code',`async(page)=>(${catalogBrowserAudit.toString()})(page)`])
 const catalogJson=catalogResult.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!catalogJson)throw Error('Catalog browser audit did not return a report.')
 report.catalog=JSON.parse(catalogJson)
 const supportResult=run(['run-code',`async(page)=>(${travelSupportAudit.toString()})(page)`])
 const supportJson=supportResult.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!supportJson)throw Error('Travel support audit did not return a report.')
 report.travelSupport=JSON.parse(supportJson)
 const photoResult=run(['run-code',`async(page)=>(${themePhotoAudit.toString()})(page)`])
 const photoJson=photoResult.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!photoJson)throw Error('Theme photo audit did not return a report.')
 report.themePhotos=JSON.parse(photoJson)
 const preparationResult=run(['run-code',`async(page)=>(${preparationAudit.toString()})(page)`])
 const preparationJson=preparationResult.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!preparationJson)throw Error('Preparation browser audit did not return a report.')
 report.preparation=JSON.parse(preparationJson)
 const intentResult=run(['run-code',`async(page)=>(${intentAudit.toString()})(page)`])
 const intentJson=intentResult.match(/### Result\s*\n([^\n]+)/)?.[1]
 if(!intentJson)throw Error('Intent audit did not return a report.')
 report.intents=JSON.parse(intentJson)
 await writeFile('output/playwright/design-audit.json',JSON.stringify(report,null,2)+'\n')
 console.log(JSON.stringify(report,null,2))
} catch(error){
 // Raw CLI errors can include SDK request URLs. Do not reprint them into shared logs.
 try{const info=run(['run-code',`async(page)=>{await page.screenshot({path:'output/playwright/audit-failure.png'});return {markers:await page.locator('.google-pin').count(),state:await page.locator('.map-panel').getAttribute('aria-busy'),url:page.url()}}`]);const snapshot=info.match(/### Result\s*\n([^\n]+)/)?.[1];if(snapshot)console.error('Failure state: '+snapshot)}catch{}
 console.error('Browser audit failed. Inspect .playwright-cli locally; do not share full map request URLs.')
 console.error(error.status!==undefined?'CLI exit status: '+error.status:'Audit error: '+error.message)
 const detail=String(error.stdout??'').match(/### Error\s*\n([\s\S]*?)(?=\n###|$)/)?.[1]
 if(detail)console.error(detail.replace(/AIza[0-9A-Za-z_-]{35}/g,'[redacted]').replace(/([?&]key=)[^&\s]+/g,'$1[redacted]').slice(0,2000))
 process.exitCode=1
} finally {try{run(['close'])}catch{console.error('Could not close the audit browser session.')}}
