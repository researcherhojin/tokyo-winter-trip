/** Lists theme records whose official check is older than N days (default 30), so they can be re-verified before departure. Run: npm run stale -- 30 */
import { readdir, readFile } from 'node:fs/promises'
const days=Number(process.argv[2]??30)
const today=new Date(process.env.STALE_TODAY??Date.now())
const rows=[]
for(const name of (await readdir('src/data/spots')).filter(file=>file.endsWith('.json')&&file!=='index.json')){
 const theme=JSON.parse(await readFile('src/data/spots/'+name,'utf8'))
 for(const spot of theme.spots){
  const checked=[spot.visitorInfo?.checkedAt,spot.evidence?.checkedAt].filter(Boolean).sort()[0]
  const age=checked?Math.floor((today-new Date(checked+'T00:00:00+09:00'))/86400000):Infinity
  if(age>=days)rows.push({theme:theme.id,id:spot.id,name:spot.name,checked:checked??'없음',age})
 }
}
rows.sort((a,b)=>b.age-a.age)
console.log(rows.length?rows.map(row=>`${row.checked}\t${row.age}일\t${row.theme}\t${row.name}`).join('\n'):`확인일이 ${days}일보다 오래된 레코드 없음`)
console.log(`\n${rows.length}건 · 기준 ${days}일`)
