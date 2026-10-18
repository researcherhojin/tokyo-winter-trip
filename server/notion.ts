// Only the five daily timetables are exported. Attachments and payment sections are never traversed.
export const NOTION_PAGE_ID = '3cd6d10a-f85a-802c-ab35-dae642ee3500'
interface RichText { plain_text?: string; text?: { content?: string } }
interface Block { id: string; type: string; has_children?: boolean; toggle?: {rich_text?: RichText[]}; bulleted_list_item?: {rich_text?: RichText[]}; table?: {has_column_header?: boolean}; table_row?: {cells: RichText[][]} }
interface BlockList { results: Block[]; has_more: boolean; next_cursor?: string }
export interface LiveRow { time: string; title: string; note: string }
export interface LiveTrip { enabled: true; version: 1; lastEditedAt: string; fetchedAt: string; days: {id:number;rows:LiveRow[]}[] }
const plain=(texts:RichText[]=[])=>texts.map(t=>t.plain_text??t.text?.content??'').join('')
// Keep source wording while omitting identities already present in the original travel notes.
export const omitTravelerNames=(text:string)=>text.replace(/(?:김유식|이강산|이호진|강산|유식|호진)(?:님)?(?:\s*담당)?/g,'일행').replace(/바롬님(?:과|의)?/g,'').replace(/\s{2,}/g,' ').trim()
export async function readNotionTrip(token:string,request:typeof fetch=fetch):Promise<LiveTrip>{
 let requests=0
 let lastStarted=0
 const signal=AbortSignal.timeout(12000)
 async function get(path:string){
  if(++requests>30)throw Error('Notion traversal limit')
  if(request===fetch){const pause=Math.max(0,350-(Date.now()-lastStarted));if(pause)await new Promise(resolve=>setTimeout(resolve,pause));lastStarted=Date.now()}
  const response=await request('https://api.notion.com/v1/'+path,{headers:{Authorization:'Bearer '+token,'Notion-Version':'2022-06-28'},signal})
  if(!response.ok)throw Error('Notion request failed')
  return response.json()
 }
 async function children(id:string):Promise<Block[]>{
  const results:Block[]=[];let cursor:string|undefined
  do{const page:BlockList=await get(`blocks/${id}/children?page_size=100${cursor?'&start_cursor='+encodeURIComponent(cursor):''}`);results.push(...page.results);if(page.has_more&&!page.next_cursor)throw Error('Invalid pagination');cursor=page.has_more?page.next_cursor:undefined}while(cursor)
  return results
 }
 const page=await get('pages/'+NOTION_PAGE_ID)
 if(typeof page.last_edited_time!=='string')throw Error('Missing revision')
 const root=await children(NOTION_PAGE_ID);const days:LiveTrip['days']=[]
 for(let id=1;id<=5;id++){
  // Read direct timetable bullets only. Nested maps, references and evidence remain untouched.
  const candidates=root.filter(b=>b.type==='toggle'&&new RegExp('^'+id+'일차').test(plain(b.toggle?.rich_text).trim()))
  let rows:LiveRow[]|undefined
  for(const block of candidates){
   let nested=await children(block.id)
   // The compact reading view is separate from the full timetable. Follow this one named
   // section only, never arbitrary map, candidate, booking or attachment toggles.
   const detailed=nested.find(b=>b.type==='toggle'&&plain(b.toggle?.rich_text).trim()==='시간표·교통 상세')
   if(detailed)nested=await children(detailed.id)
   const bullets=nested.filter(b=>b.type==='bulleted_list_item'&&/^\d{2}:\d{2}/.test(plain(b.bulleted_list_item?.rich_text).trim()))
   if(bullets.length){
    rows=bullets.map(b=>{
     const text=plain(b.bulleted_list_item?.rich_text).trim()
     const match=text.match(/^((?:[01]\d|2[0-3]):[0-5]\d(?:[–—-](?:[01]\d|2[0-3]):[0-5]\d)?(?: 이후)?) · ([^\n]+)\n([\s\S]+)$/)
     if(!match)throw Error('Unsupported timetable bullet')
     return {time:match[1],title:omitTravelerNames(match[2]),note:omitTravelerNames(match[3])}
    })
   }else{
    // Preserve compatibility with the previous three-column layout.
    const table=nested.find(b=>b.type==='table');if(!table)continue
    const raw=await children(table.id)
    rows=raw.filter(b=>b.type==='table_row').slice(table.table?.has_column_header?1:0).map(b=>{
     const cells=b.table_row?.cells??[];if(cells.length!==3)throw Error('Expected three columns')
     return {time:plain(cells[0]).trim(),title:omitTravelerNames(plain(cells[1])),note:omitTravelerNames(plain(cells[2]))}
    })
   }
   if(!rows.length||rows.length>40||rows.some(r=>!/^\d{2}:\d{2}/.test(r.time)||!r.title||[r.time,r.title,r.note].some(v=>v.length>2000)))throw Error('Unsupported timetable')
   break
  }
  if(!rows)throw Error('Missing day table')
  days.push({id,rows})
 }
 return {enabled:true,version:1,lastEditedAt:page.last_edited_time,fetchedAt:new Date().toISOString(),days}
}
