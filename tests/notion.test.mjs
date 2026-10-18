import test from 'node:test'
import assert from 'node:assert/strict'
import { readNotionTrip, NOTION_PAGE_ID, omitTravelerNames } from '../server/notion.ts'
import { isLiveTrip, applyLiveTrip } from '../src/lib/liveTrip.ts'
const rich=text=>[{plain_text:text}]
test('live timetable validation rejects broken nested rows and impossible times without throwing',()=>{
 const valid=()=>({enabled:true,version:1,lastEditedAt:'2026-10-18T00:00:00Z',fetchedAt:'2026-10-18T00:00:01Z',days:[1,2,3,4,5].map(id=>({id,rows:[{time:'21:00 이후',title:'숙소 복귀',note:'계획'}]}))})
 assert.equal(isLiveTrip(valid()),true)
 for(const mutate of [v=>v.days[0]=null,v=>v.days[0].rows=[null],v=>v.days[0].rows[0].time='99:99',v=>v.days[0].rows[0].time='12:75',v=>v.days[0].rows[0].time='12:00 garbage',v=>v.fetchedAt='invalid',v=>v.days[1].id=1]){
  const value=valid();mutate(value);assert.equal(isLiveTrip(value),false)
 }
})
function fixture(missing=false){
 const paths=[]
 const request=async(url,options)=>{
  assert.equal(options.headers.Authorization,'Bearer TEST_ONLY_TOKEN')
  const parsed=new URL(url);const path=parsed.pathname.slice(4);paths.push(path)
  let body
  if(path==='pages/'+NOTION_PAGE_ID)body={last_edited_time:'2026-10-17T12:00:00Z'}
  else if(path==='blocks/'+NOTION_PAGE_ID+'/children'){
   const ids=parsed.searchParams.has('start_cursor')?[3,4,5]:[1,2]
   body={results:ids.filter(id=>!missing||id!==5).map(id=>({id:'day-'+id,type:'toggle',toggle:{rich_text:rich(id+'일차 · 담당자')}})),has_more:!parsed.searchParams.has('start_cursor'),next_cursor:'cursor-2'}
  }else if(/^blocks\/day-\d\/children$/.test(path)){
   body={results:[{id:path.split('/')[1].replace('day','table'),type:'table',table:{has_column_header:true}},{id:'private-file',type:'file',has_children:true}],has_more:false}
  }else if(/^blocks\/table-\d\/children$/.test(path))body={results:[{type:'table_row',table_row:{cells:[rich('시간'),rich('일정'),rich('메모')]}},{type:'table_row',table_row:{cells:[rich('10:00–14:30'),rich('해리포터 스튜디오'),rich('합의 · 결제 미확인')]}}],has_more:false}
  else throw Error('Unexpected traversal '+path)
  return Response.json(body)
 }
 return {request,paths}
}
test('Notion reader follows pagination, exports all five day tables and skips attachments',async()=>{
 const {request,paths}=fixture();const trip=await readNotionTrip('TEST_ONLY_TOKEN',request)
 assert.equal(trip.days.length,5);assert.equal(trip.days[2].rows[0].time,'10:00–14:30');assert.equal(paths.length,13)
 assert.equal(paths.some(path=>path.includes('private-file')),false);assert.equal(JSON.stringify(trip).includes('TEST_ONLY_TOKEN'),false);assert.ok(isLiveTrip(trip))
 const updated=applyLiveTrip(trip.days.map(d=>({id:d.id})),trip);assert.equal(updated[2].stops[0].place,'harry');assert.equal(updated[2].stops[0].booking,undefined);assert.match(updated[2].stops[0].note,/결제 미확인/)
})
test('missing day tables and unauthorized upstream responses reject the update',async()=>{
 await assert.rejects(readNotionTrip('TEST_ONLY_TOKEN',fixture(true).request),/Missing day/)
 await assert.rejects(readNotionTrip('TEST_ONLY_TOKEN',async()=>Response.json({},{status:401})),/Notion request failed/)
 assert.equal(isLiveTrip({enabled:true,version:1,days:[]}),false)
})
test('source identity scrubber omits names from schedule text',()=>{
 assert.doesNotMatch(omitTravelerNames('김유식 담당 · 이강산님 · 이호진 · 강산 · 유식 · 호진'),/강산|유식|호진/)
})

test('vertical daily timetables export the same fields without traversing maps or evidence',async()=>{
 const original=fixture();const paths=[]
 const request=async(url,options)=>{
  paths.push(new URL(url).pathname)
  if(/\/blocks\/day-\d\/children/.test(url))return Response.json({has_more:false,results:[
   {id:'intro',type:'paragraph'},
   {id:'row',type:'bulleted_list_item',bulleted_list_item:{rich_text:rich('10:00–14:30 · 해리포터 스튜디오\n합의 · 결제 미확인')}},
   {id:'late',type:'bulleted_list_item',bulleted_list_item:{rich_text:rich('21:00 이후 · 신바시 귀환\n이강산님: 실제 열차 재확인')}},
   {id:'private-map',type:'toggle',has_children:true,toggle:{rich_text:rich('지도·구간별 길찾기')}},
   {id:'private-file',type:'file',has_children:true},
  ]})
  return original.request(url,options)
 }
 const trip=await readNotionTrip('TEST_ONLY_TOKEN',request)
 assert.equal(paths.length,8);assert.equal(trip.days.length,5)
 assert.deepEqual(trip.days[0].rows[0],{time:'10:00–14:30',title:'해리포터 스튜디오',note:'합의 · 결제 미확인'})
 assert.equal(trip.days[0].rows[1].time,'21:00 이후');assert.doesNotMatch(trip.days[0].rows[1].note,/강산/)
 assert.equal(paths.some(path=>/private-|table-/.test(path)),false)
 assert.ok(isLiveTrip(trip))
})

test('malformed timed bullets reject the revision rather than publishing a partial itinerary',async()=>{
 for(const text of ['25:00 · 방문\n미확인','10:00 · 방문','10:00 · \n메모']){
  const original=fixture()
  const request=async(url,options)=>/\/blocks\/day-\d\/children/.test(url)?Response.json({has_more:false,results:[{id:'row',type:'bulleted_list_item',bulleted_list_item:{rich_text:rich(text)}}]}):original.request(url,options)
  await assert.rejects(readNotionTrip('TEST_ONLY_TOKEN',request),/Unsupported timetable bullet/)
 }
})

test('compact two-column reading view uses only the explicitly named full timetable',async()=>{
 const original=fixture();const paths=[]
 const request=async(url,options)=>{
  const path=new URL(url).pathname.slice(4);paths.push(path)
  if(/^blocks\/day-\d\/children$/.test(path))return Response.json({has_more:false,results:[
   {id:'compact-table',type:'table',table:{has_column_header:false}},
   {id:'full-'+path.split('/')[1],type:'toggle',has_children:true,toggle:{rich_text:rich('시간표·교통 상세')}},
   {id:'private-evidence',type:'toggle',has_children:true,toggle:{rich_text:rich('항공권·결제 증빙')}},
  ]})
  if(/^blocks\/full-day-\d\/children$/.test(path))return Response.json({has_more:false,results:[
   {id:'row',type:'bulleted_list_item',bulleted_list_item:{rich_text:rich('10:00–14:30 · 해리포터 스튜디오\n결제 미확인 · 관람4~5시간 계획')}},
  ]})
  return original.request(url,options)
 }
 const trip=await readNotionTrip('TEST_ONLY_TOKEN',request)
 assert.equal(trip.days.length,5);assert.equal(paths.length,13)
 assert.equal(paths.some(p=>/compact-table|private-evidence/.test(p)),false)
 assert.match(trip.days[2].rows[0].note,/결제 미확인/)
 assert.ok(isLiveTrip(trip))
})

test('server endpoint stays disabled without a token and disallows mutation methods',async()=>{
 const {tripResponse}=await import('../server/tripResponse.ts')
 const disabled=await tripResponse();assert.deepEqual(await disabled.json(),{enabled:false});assert.equal(disabled.headers.get('Cache-Control'),'no-store')
 const {default:handler}=await import('../api/trip.ts')
 const response=await handler.fetch(new Request('https://tokyo.test/api/trip',{method:'POST'}));assert.equal(response.status,405);assert.equal(response.headers.get('Allow'),'GET')
})
