import test, { after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

const loader=await createServer({configFile:false,cacheDir:'node_modules/.vite-test-catalog',optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},logLevel:'silent'})
after(()=>loader.close())
const {catalogData,isCatalogEnvelope}=await loader.ssrLoadModule('/src/shared/catalog.ts')
test('merged themes retain sources and legacy saved candidates resolve to one place',async()=>{
 const {normalizeThemeSaves,consolidateThemes,sortThemeEntries}=await loader.ssrLoadModule('/src/lib/themeOrganization.ts')
 const themes=catalogData.themes.themes
 assert.equal(themes.some(theme=>['characters','winter-lights'].includes(theme.id)),false)
 const shops=themes.find(theme=>theme.id==='subculture')
 assert.equal(shops.spots.filter(spot=>spot.placeId==='mega').length,1)
 assert.ok(shops.spots.find(spot=>spot.placeId==='mega').references.length>0)
 const night=themes.find(theme=>theme.id==='night-view')
 assert.match(night.spots.find(spot=>spot.id==='keyakizaka').note,/17:00–22:00/)
 assert.deepEqual(normalizeThemeSaves(['character-mega','subculture-mega','roppongi-night']),['subculture-mega','keyakizaka'])
 assert.deepEqual(normalizeThemeSaves(['cat-bookshop','jazz-bar','times-parking','akabanebashi-photo']),['akabanebashi-photo'])
 const retired={id:'jazz-bar',name:'제거한 재즈바',address:'',query:'',note:'제거한 후보'}
 const stale=consolidateThemes([{id:'city-interests',title:'산책',description:'산책 후보',spots:[retired]}])
 assert.equal(stale[0].spots.length,0,'stale API content must not restore removed candidates')
 assert.deepEqual(consolidateThemes(themes),themes,'normalization must be idempotent for refreshed catalogs')
 const entries=[{spot:{name:'하늘',address:'',id:'a'}},{spot:{name:'가게',address:'',id:'b'}}]
 assert.deepEqual(sortThemeEntries(entries,'name').map(item=>item.spot.id),['b','a'])
 assert.equal(entries[0].spot.id,'a','sorting must not mutate API data')
})
test('night theme only uses individually reviewed night or blue-hour assets',async()=>{
 const {photoById}=await loader.ssrLoadModule('/src/lib/photos.ts')
 const night=catalogData.themes.themes.find(theme=>theme.id==='night-view')
 assert.equal(night.spots.length,12)
 for(const spot of night.spots){const photo=photoById[spot.photoId];assert.ok(photo,spot.id);assert.ok(['night','blue-hour'].includes(photo.timeOfDay),spot.id);assert.ok(photo.author);assert.ok(photo.license);assert.ok(photo.source)}
 const body=structuredClone({schemaVersion:1,resource:'themes',source:'maintained-catalog',data:catalogData.themes})
 body.data.themes.find(theme=>theme.id==='night-view').spots[0].photoId='odaiba'
 assert.equal(isCatalogEnvelope(body,'themes'),false,'daytime replacement must be rejected')
})
test('all candidate cards carry operating fields and museum closure dates remain explicit',()=>{
 for(const theme of catalogData.themes.themes)for(const spot of theme.spots){
  const info=spot.visitorInfo
  assert.ok(info?.hours,spot.id);assert.ok(info.closed,spot.id);assert.ok(info.admission,spot.id)
  assert.ok(info.sourceUrl===null||info.sourceUrl.startsWith('https://'),spot.id)
 }
 const architecture=catalogData.themes.themes.find(theme=>theme.id==='architecture')
 assert.equal(architecture.spots.length,10)
 for(const id of ['architecture-tnm','architecture-horyuji'])assert.match(architecture.spots.find(spot=>spot.id===id).visitorInfo.note,/12\/14.*12\/15/)
 const shops=catalogData.themes.themes.find(theme=>theme.id==='subculture')
 assert.equal(shops.spots.length,11)
 assert.ok(shops.spots.some(spot=>spot.id==='subculture-chiikawa-tokyo'))
 const body=structuredClone({schemaVersion:1,resource:'themes',source:'maintained-catalog',data:catalogData.themes})
 body.data.themes[0].spots[0].visitorInfo.hours={invalid:true}
 assert.equal(isCatalogEnvelope(body,'themes'),false)
})
test('all 32 itinerary stops have actionable guides and malformed lists are rejected',async()=>{
 const stops=catalogData.trip.days.flatMap(day=>day.stops)
 assert.equal(stops.length,32)
 for(const stop of stops){assert.ok(stop.guide.purpose);assert.ok(stop.guide.steps.length>=2);assert.ok(stop.guide.checks.length>=2);assert.ok(stop.guide.next);assert.ok(stop.guide.sources.every(source=>source.url.startsWith('https://')))}
 const body=structuredClone({schemaVersion:1,resource:'trip',source:'maintained-catalog',data:catalogData.trip})
 body.data.days[0].stops[0].guide.steps=[{}]
 assert.equal(isCatalogEnvelope(body,'trip'),false)
 const {applyLiveTrip}=await loader.ssrLoadModule('/src/lib/liveTrip.ts')
 const live={days:catalogData.trip.days.map(day=>({id:day.id,rows:day.stops.map(stop=>({time:stop.time,title:stop.title,note:stop.note}))}))}
 assert.ok(applyLiveTrip(catalogData.trip.days,live)[0].stops[0].guide)
 live.days[0].rows[0].title='전혀 다른 방문 계획'
 assert.equal(applyLiveTrip(catalogData.trip.days,live)[0].stops[0].guide,undefined)
})
test('unverified photo substitutions stay absent while identified views retain provenance',async()=>{
 const {photoById}=await loader.ssrLoadModule('/src/lib/photos.ts')
 for(const theme of catalogData.themes.themes){if(theme.coverPhotoId)assert.ok(photoById[theme.coverPhotoId],theme.id)}
 const spots=catalogData.themes.themes[0].spots
 const ids=['akabanebashi-photo','azabudai-photo'].map(id=>spots.find(spot=>spot.id===id).photoId)
 assert.equal(new Set(ids).size,2)
 for(const id of ids){assert.equal(photoById[id].fit,'contain');assert.ok(photoById[id].viewEvidence);assert.ok(photoById[id].source.startsWith('https://'))}
 const {themePhotoId}=await loader.ssrLoadModule('/src/lib/themePhoto.ts')
 assert.equal(themePhotoId(spots.find(spot=>spot.id==='shiba-seven-photo')),undefined)
 assert.equal(themePhotoId(spots.find(spot=>spot.id==='hamamatsu-deck-photo')),'more-hamamatsu-deck-photo-3')
 assert.equal(photoById['spot-hamamatsu-area'],undefined)
 assert.equal(themePhotoId(spots.find(spot=>spot.id==='fudanotsuji-photo')),'audit-fudanotsuji-bridge')
 for(const id of ['starwars','shinbashi','yomiuri','subculture-kiddy-building','new-food-nanaya-gelato'])assert.equal(photoById[id],undefined)
 assert.match(photoById.mega.caption,/실제 매장 입구/)
 const pokepark=catalogData.themes.themes.flatMap(theme=>theme.spots).find(spot=>spot.id==='character-yomiuri')
 assert.equal(themePhotoId(pokepark),'audit-place-pokepark-lab')
 assert.equal(photoById[themePhotoId(pokepark)].capturedAt,'2026-02-05')
 const {placePhoto}=await loader.ssrLoadModule('/src/lib/photos.ts')
 assert.equal(placePhoto('yomiuri').src,'/photos/audit-place-pokepark-lab.jpg')
 const {photoGap}=await loader.ssrLoadModule('/src/lib/themePhoto.ts')
 const all=catalogData.themes.themes.flatMap(theme=>theme.spots)
 for(const spot of all.filter(spot=>spot.photoGap))assert.equal(themePhotoId(spot),undefined,'stale gap entry: '+spot.id)
 const titles=all.filter(spot=>!themePhotoId(spot)).map(spot=>photoGap(spot).title)
 assert.equal(titles.length,28)
 assert.equal(titles.filter(title=>title.endsWith('확인 필요')).length,9)
 assert.equal(photoGap(pokepark),undefined)
 const {themeReferencePhotoId}=await loader.ssrLoadModule('/src/lib/themePhoto.ts')
 const review=(await import('../src/data/photoReview.json',{with:{type:'json'}})).default
 const referenced=all.filter(spot=>themeReferencePhotoId(spot))
 assert.equal(referenced.length,19)
 for(const spot of referenced){const photo=photoById[themeReferencePhotoId(spot)];assert.equal(themePhotoId(spot),undefined,spot.id);assert.ok(['비슷한 참고 사진','제조사 참고 사진','판매처 참고 사진'].includes(photo.reference.label),spot.id);assert.ok(photo.reference.difference.length>10,spot.id);assert.ok(!Object.hasOwn(review.excludedPhotos,themeReferencePhotoId(spot)))}
 for(const id of ['lawson-pasta']){const spot=all.find(spot=>spot.id===id);const ref=photoById[themeReferencePhotoId(spot)];assert.ok(ref?.reference,'product card needs a labelled stand-in: '+id);if(['taisho-patch','biofermin','nail-care','chlomy','hepalize','miyaflora','rohto-premium'].includes(id))assert.ok(['제조사 참고 사진','판매처 참고 사진'].includes(ref.reference.label),'medicine stand-in must not look like the product: '+id);assert.match(spot.evidence.photoPageUrl,/^https:\/\//,id)}
 const invalid=structuredClone({schemaVersion:1,resource:'themes',source:'maintained-catalog',data:catalogData.themes});invalid.data.themes[0].coverPhotoId='missing-photo'
 assert.equal(isCatalogEnvelope(invalid,'themes'),false)
})
test('all theme candidates include researched evidence, and malformed photo sources are rejected',()=>{
 const spots=catalogData.themes.themes.flatMap(theme=>theme.spots)
 assert.equal(spots.length,88)
 for(const spot of spots){assert.ok(spot.evidence.summary);assert.equal(spot.evidence.checkedAt,'2026-10-18');assert.ok(spot.evidence.verificationNote);assert.ok(spot.evidence.photoNote)}
 const body=structuredClone({schemaVersion:1,resource:'themes',source:'maintained-catalog',data:catalogData.themes})
 body.data.themes[0].spots[0].evidence.photoPageUrl='javascript:alert(1)'
 assert.equal(isCatalogEnvelope(body,'themes'),false)
})
test('next itinerary uses JST and explicit progress without marking past visits complete',async()=>{
 const {nextStop,jstNow,stopKey}=await loader.ssrLoadModule('/src/lib/travelProgress.ts')
 const day=catalogData.trip.days[2]
 assert.deepEqual(jstNow(new Date('2026-12-12T23:05:00Z')),{date:'2026-12-13',time:'08:05'})
 const status={[stopKey(day,day.stops[0])]:'done',[stopKey(day,day.stops[1])]:'skipped'}
 assert.equal(nextStop(day,status,{date:'2026-12-13',time:'09:30'}).stop.time,'10:00')
 assert.equal(nextStop(day,status,{date:'2026-12-14',time:'10:00'}).mode,'past')
 assert.equal(Object.keys(status).length,2)
 const {anchorReservations}=await loader.ssrLoadModule('/src/lib/reservationAnchors.ts')
 const altered=structuredClone(catalogData.trip.days);altered[1].stops[3].time='13:00';altered[2].stops[2].time='11:00'
 const result=anchorReservations(altered)
 assert.equal(result[1].stops[3].time,'11:00');assert.equal(result[2].stops[2].time,'10:00')
})
const {catalogResponse}=await loader.ssrLoadModule('/server/catalogResponse.ts')
const envelope=resource=>({schemaVersion:1,resource,source:'maintained-catalog',data:structuredClone(catalogData[resource])})
for (const resource of ['trip','themes','preparation']) {
 test(`${resource} read contract agrees across Vercel and Cloudflare adapters`,async()=>{
  const vercel=await loader.ssrLoadModule(`/api/catalog/${resource}.ts`)
  const cloudflare=await loader.ssrLoadModule(`/functions/api/catalog/${resource}.ts`)
  const request=new Request(`https://local.test/api/catalog/${resource}`)
  const first=vercel.default.fetch(request), second=cloudflare.onRequest({request})
  assert.equal(first.status,200)
  assert.match(first.headers.get('content-type'),/application\/json/)
  const body=await first.json()
  assert.deepEqual(body,await second.json())
  assert.ok(isCatalogEnvelope(body,resource))
  assert.equal(JSON.stringify(body).includes('NOTION_API_TOKEN'),false)
  assert.equal('checked' in body.data,false)
 })
 test(`${resource} rejects writes and provides HEAD without a body`,async()=>{
  for(const method of ['POST','PUT','PATCH','DELETE']) {
   const response=catalogResponse(new Request('https://local.test',{method}),resource)
   assert.equal(response.status,405)
   assert.equal(response.headers.get('allow'),'GET, HEAD')
  }
  const head=catalogResponse(new Request('https://local.test',{method:'HEAD'}),resource)
  assert.equal(head.status,200);assert.equal(await head.text(),'')
 })
}
test('catalog validation rejects partial schedules, unknown places and broken coordinates',()=>{
 for(const mutate of [body=>body.data.days.pop(),body=>body.data.days[0].id=1.5,body=>delete body.data.places[0].hours,body=>body.data.days[0].stops[0].place='unknown-place',body=>body.data.places[0].position.lat=999,body=>body.data.places.pop()]) {
  const body=envelope('trip');mutate(body);assert.equal(isCatalogEnvelope(body,'trip'),false)
 }
})
test('catalog validation rejects incomplete themes and preparation instead of dropping stored content',()=>{
 const theme=envelope('themes');theme.data.themes.pop();assert.equal(isCatalogEnvelope(theme,'themes'),false)
 const partial=envelope('themes');partial.data.themes[0].spots.pop();assert.equal(isCatalogEnvelope(partial,'themes'),false)
 const checks=envelope('preparation');checks.data.checklist.pop();assert.equal(isCatalogEnvelope(checks,'preparation'),false)
 const wrongLink=envelope('preparation');wrongLink.data.preparationSources[0].url='javascript:alert(1)';assert.equal(isCatalogEnvelope(wrongLink,'preparation'),false)
 const wrongVersion=envelope('themes');wrongVersion.schemaVersion=2;assert.equal(isCatalogEnvelope(wrongVersion,'themes'),false)
})
test('client rejects HTML fallback and HTTP errors, accepts the independently typed response',async()=>{
 const {fetchCatalog}=await loader.ssrLoadModule('/src/lib/catalogClient.ts')
 const original=globalThis.fetch
 try {
  globalThis.fetch=async()=>new Response('<html></html>',{headers:{'content-type':'text/html'}})
  await assert.rejects(fetchCatalog('themes',catalogData.themes),/unavailable/)
  globalThis.fetch=async()=>Response.json({error:'failed'},{status:502})
  await assert.rejects(fetchCatalog('trip',catalogData.trip),/unavailable/)
  globalThis.fetch=async()=>Response.json(envelope('preparation'))
  assert.deepEqual(await fetchCatalog('preparation',catalogData.preparation),catalogData.preparation)
 } finally {globalThis.fetch=original}
})
test('trip contract rejects guide values that would crash detail lists or React text nodes',()=>{
 const mutations=[
  place=>place.guide=null,
  place=>place.guide.visitPlan=null,
  place=>place.guide.visitPlan='not a list',
  place=>place.guide.tips=[{}],
  place=>place.guide.sources=[null],
  place=>place.guide.sources=[{title:'unsafe',url:'javascript:alert(1)'}],
  place=>place.guide.overview={unexpected:'object'},
  place=>place.hours=null,
 ]
 for(const mutate of mutations) {
  const body=envelope('trip');mutate(body.data.places[0]);assert.equal(isCatalogEnvelope(body,'trip'),false)
 }
})
test('theme contract rejects malformed optional fields before rendering cards, sources or date links',()=>{
 const mutations=[
  theme=>theme.references=null,
  theme=>theme.references={title:'not a list'},
  theme=>theme.references=[{title:{bad:true},url:'https://example.com'}],
  theme=>theme.day='1',
  theme=>theme.day=0,
  theme=>theme.caution={},
  theme=>theme.spots[0].photoIds='tower',
  theme=>theme.spots[0].photoIds=[null],
  theme=>theme.spots[0].references=[{title:'source',url:null}],
  theme=>theme.spots[0].details={},
  theme=>theme.spots[0].placeId=42,
  theme=>theme.spots[0].officialUrl='data:text/html,unsafe',
 ]
 for(const mutate of mutations) {
  const body=envelope('themes');mutate(body.data.themes[0]);assert.equal(isCatalogEnvelope(body,'themes'),false)
 }
})
test('trip stop optionals reject invalid React text and unsupported navigation values',()=>{
 for(const [key,value] of [['optional','false'],['booking',{}],['mode','driving'],['end','99:99'],['travelTime',{}],['from',null]]) {
  const body=envelope('trip');body.data.days[0].stops[0][key]=value;assert.equal(isCatalogEnvelope(body,'trip'),false)
 }
})
test('preparation contract rejects nested malformed guide and source lists',()=>{
 for(const mutate of [body=>body.data.suicaGuide[0].body={},body=>body.data.preparationSources[0].url=null,body=>body.data.yoyogiSpot.note={}]) {
  const body=envelope('preparation');mutate(body);assert.equal(isCatalogEnvelope(body,'preparation'),false)
 }
})
test('client rejects malformed nested detail data rather than publishing it to consumers',async()=>{
 const {fetchCatalog}=await loader.ssrLoadModule('/src/lib/catalogClient.ts')
 const original=globalThis.fetch
 try {
  const body=envelope('trip');body.data.places[0].guide.visitPlan=null
  globalThis.fetch=async()=>Response.json(body)
  await assert.rejects(fetchCatalog('trip',catalogData.trip),/Invalid catalog/)
 } finally {globalThis.fetch=original}
})
test('December events show only officially announced 2026 information',()=>{
 const december=catalogData.themes.themes.find(theme=>theme.id==='december-tokyo')
 assert.ok(december.spots.length>0)
 for(const spot of december.spots){
  const text=[spot.note,spot.details,spot.visitorInfo?.hours,spot.visitorInfo?.closed,spot.visitorInfo?.admission,spot.visitorInfo?.note,spot.evidence?.summary,spot.evidence?.verificationNote].join(' ')
  assert.doesNotMatch(text,/2025년|예년|추정|2차/,spot.id)
  assert.ok(spot.verified,spot.id)
 }
})
test('spot records keep one complete, officially sourced record per candidate',async()=>{
 const {readdir,readFile}=await import('node:fs/promises')
 const files=(await readdir('src/data/spots')).filter(name=>name.endsWith('.json')&&name!=='index.json')
 const {order}=JSON.parse(await readFile('src/data/spots/index.json','utf8'))
 assert.deepEqual([...files].map(name=>name.replace('.json','')).sort(),[...order].sort())
 const banned=/Self-published|검색 요약|타베로그|2차 자료|2차 사이트|보도 기준|안내 매체|예년|\(추정\)|원문 403|공식 색인/
 const seen=new Set()
 for(const name of files){
  const theme=JSON.parse(await readFile('src/data/spots/'+name,'utf8'))
  assert.ok(theme.id&&theme.title&&theme.description&&theme.spots.length,name)
  for(const spot of theme.spots){
   assert.ok(!seen.has(spot.id),'duplicate spot '+spot.id);seen.add(spot.id)
   for(const key of ['id','name','address','note','evidence','visitorInfo'])assert.ok(spot[key],`${spot.id} missing ${key}`)
   assert.match(spot.visitorInfo.checkedAt,/^\d{4}-\d{2}-\d{2}$/,spot.id)
   assert.match(spot.evidence.checkedAt,/^\d{4}-\d{2}-\d{2}$/,spot.id)
   // A candidate cites an official page, a trip place, or the user's own shared post (images: '공유 게시물 n번').
   if(spot.kind!=='unresolved')assert.ok(spot.evidence.officialUrl||spot.officialUrl||spot.placeId||spot.references?.length||/공유 게시물/.test(spot.images??''),`${spot.id} has no source`)
   const text=[spot.note,spot.details,spot.visitorInfo.hours,spot.visitorInfo.closed,spot.visitorInfo.admission,spot.visitorInfo.note,spot.evidence.summary,spot.evidence.verificationNote].join(' ')
   assert.doesNotMatch(text,banned,spot.id)
   for(const closure of spot.closures??[])assert.match(closure.date,/^12\/1[1-5]$/,spot.id)
  }
 }
})
