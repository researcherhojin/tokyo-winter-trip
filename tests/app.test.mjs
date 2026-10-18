import test, { afterEach } from 'node:test'
const openWindows = new Set()
afterEach(()=>{for(const dom of openWindows)dom.window.close();openWindows.clear()})
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { build, createServer } from 'vite'
import react from '@vitejs/plugin-react'
const asset=(await readdir('output/test-build/assets')).find(p=>p.endsWith('.js'))
const bundle=await readFile(`output/test-build/assets/${asset}`,'utf8')
const places=JSON.parse(await readFile('src/data/places.json','utf8'))
const delay=()=>new Promise(r=>setTimeout(r,35))
/** Theme and checklist screens are lazy-loaded; wait until their loading placeholder is replaced (max ~1s). */
async function settle(doc){for(let i=0;i<50&&doc.querySelector('.screen-loading');i++)await new Promise(r=>setTimeout(r,20))}
let mapBuild
async function mapBundle(){
 mapBuild ??= build({configFile:false,plugins:[react()],logLevel:'silent',define:{'import.meta.env.VITE_GOOGLE_MAPS_API_KEY':JSON.stringify('TEST_ONLY_NOT_A_REAL_KEY')},build:{write:false,rolldownOptions:{output:{codeSplitting:false}}}}).then(result=>result.output.find(x=>x.type==='chunk'&&x.isEntry).code)
 return mapBuild
}
async function app(url='https://tokyo.test/?day=1',storage,code=bundle,setup){
 const dom=new JSDOM('<div id="root"></div>',{url,runScripts:'outside-only',pretendToBeVisual:true})
 openWindows.add(dom)
 const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false}
 if(storage)w.localStorage.setItem('tokyo-2026-checklist-v1',storage)
 w.fetch=async()=>{throw Error('Network unavailable in isolated test')}
 setup?.(w);w.eval(code);await delay();await settle(w.document);return {dom,w,doc:w.document,click:async(label)=>{const el=[...w.document.querySelectorAll('button')].find(e=>e.textContent.includes(label));assert.ok(el,`button ${label}`);el.click();await delay();await settle(w.document)}}
}
test('all required locations have unique IDs, coordinates and source provenance',()=>{
 assert.equal(places.length,15);assert.equal(new Set(places.map(p=>p.id)).size,15)
 for(const p of places){assert.ok(p.position.lat>35&&p.position.lat<36);assert.ok(p.position.lng>139&&p.position.lng<141);assert.ok(p.coordinateSource.startsWith('https://'));assert.equal(p.checkedAt,'2026-10-17');assert.ok(p.address);assert.ok(p.positionNote)}
})
test('no-key app renders itinerary without requesting Google Maps',async()=>{const {dom,doc}=await app();assert.match(doc.body.textContent,/오다이바·도쿄타워/);assert.match(doc.body.textContent,/Google 지도 연결 전/);assert.equal(doc.querySelectorAll('script[src*="maps.googleapis.com"]').length,0);dom.window.close()})
test('all five dates filter the map and schedule, preserving deep links',async()=>{const {dom,doc,w,click}=await app();for(let i=1;i<=5;i++){await click(`Day ${i}`);assert.equal(w.location.search,`?day=${i}`);assert.equal(doc.querySelectorAll('.day-schedule').length,1);assert.equal(doc.querySelector('.day-pill').textContent,`Day ${i}`);const expected=[5,3,5,6,5][i-1];assert.equal(doc.querySelectorAll('.diagram-stop').length,expected)}dom.window.close()})
test('all-days view covers fifteen places and returns to a single day',async()=>{const {dom,doc,click}=await app();await click('전체 일정');assert.equal(doc.querySelectorAll('.day-schedule').length,5);assert.match(doc.querySelector('.map-footer').textContent,/방문 장소 14곳 \+ 숙소/);await click('Day 3');assert.equal(doc.querySelectorAll('.day-schedule').length,1);dom.window.close()})
test('deep links hydrate selected date and all-days state',async()=>{for(const value of ['3','all']){const {dom,doc}=await app(`https://tokyo.test/?day=${value}`);assert.equal(doc.querySelectorAll('.day-schedule').length,value==='all'?5:1);if(value==='3')assert.match(doc.querySelector('.day-heading').textContent,/해리포터·이케부쿠로/);dom.window.close()}})
test('screen URLs survive reopening, and back/forward restores screen and date',async()=>{
 const {w,doc,click}=await app('https://tokyo.test/?day=3')
 await click('테마 탐색');assert.equal(new URL(w.location.href).searchParams.get('view'),'themes')
 const reopened=await app(w.location.href);assert.ok(reopened.doc.querySelector('.theme-page'))
 await click('준비 체크');assert.ok(doc.querySelector('.checklist-page'))
 w.history.back();await delay();await delay();assert.ok(doc.querySelector('.theme-page'))
 w.history.back();await delay();await delay();assert.equal(doc.querySelector('.day-pill').textContent,'Day 3')
 w.history.forward();await delay();await delay();assert.ok(doc.querySelector('.theme-page'))
 const length=w.history.length;await click('테마 탐색');assert.equal(w.history.length,length)
})
test('place dialog shows sources, correct floor and restores close action',async()=>{const {dom,doc,click}=await app('https://tokyo.test/?day=3');await click('STAR WARS STORE by BENELIC');assert.ok(doc.querySelector('dialog').open);assert.match(doc.querySelector('dialog').textContent,/本館6F/);assert.ok(doc.querySelector('dialog a[href*="google.com/maps/search"]'));doc.querySelector('[aria-label="장소 상세 닫기"]').click();await delay();assert.equal(doc.querySelector('dialog'),null);dom.window.close()})
test('transit and walking URLs include origin and destination without API key',async()=>{const {dom,doc}=await app('https://tokyo.test/?day=all');const links=[...doc.querySelectorAll('.transit a')];assert.ok(links.length>=15);const modes=new Set();for(const a of links){const u=new URL(a.href);assert.equal(u.searchParams.get('api'),'1');assert.ok(u.searchParams.get('origin'));assert.ok(u.searchParams.get('destination'));assert.equal(u.searchParams.has('key'),false);modes.add(u.searchParams.get('travelmode'))}assert.ok(modes.has('transit'));assert.ok(modes.has('walking'));dom.window.close()})
test('uncertain booking and optional stop remain explicit',async()=>{const {dom,doc}=await app('https://tokyo.test/?day=3');assert.match(doc.body.textContent,/합의됨 · 결제 미확인/);assert.match(doc.body.textContent,/약속 미확정|시간·장소·식당 예약 모두 미확정/);assert.match(doc.querySelector('.timeline-dot.optional').parentElement.textContent,/MEGA TOKYO/);dom.window.close()})
test('guide links are day-specific and summarize practical information',async()=>{const {dom,doc,click}=await app();await click('방문 가이드');assert.match(doc.querySelector('.resources').textContent,/오다이바/);await click('Day 5');assert.match(doc.querySelector('.resources').textContent,/츠키지/);assert.ok(doc.querySelector('.resources a[href*="tsukiji.or.jp"]'));dom.window.close()})
test('mobile map and itinerary view controls work',async()=>{const {dom,doc}=await app();const buttons=doc.querySelectorAll('.mobile-switch button');buttons[1].click();await delay();assert.ok(doc.querySelector('.travel-workspace.mobile-map'));buttons[0].click();await delay();assert.ok(doc.querySelector('.travel-workspace.mobile-list'));dom.window.close()})
test('checklist persists locally across navigation without changing source booking',async()=>{const {dom,doc,w,click}=await app('https://tokyo.test/?day=3');await click('준비 체크');const box=doc.querySelector('input[type="checkbox"]');box.click();await delay();assert.equal(JSON.parse(w.localStorage.getItem('tokyo-2026-checklist-v1')).flight,true);await click('여행 지도');assert.match(doc.body.textContent,/결제 미확인/);await click('준비 체크');assert.equal(doc.querySelector('input[type="checkbox"]').checked,true);dom.window.close()})
test('malformed local storage recovers and disabled storage explains limitation',async()=>{const {dom,doc,w,click}=await app(undefined,'{invalid');await click('준비 체크');assert.equal(doc.querySelectorAll('input[type="checkbox"]:checked').length,0);Object.defineProperty(w.Storage.prototype,'setItem',{value:()=>{throw Error('blocked')}});doc.querySelector('input[type="checkbox"]').click();await delay();assert.match(doc.body.textContent,/이번 화면에서만 유지/);dom.window.close()})
test('travel support persists visit state, advances next stop and exposes delay and essential actions',async()=>{
 const {doc,w,click}=await app('https://tokyo.test/?day=3')
 const summary=doc.querySelector('.today-focus > summary');assert.match(summary.textContent,/08:00/)
 const first=doc.querySelector('.visit-control select');first.value='done';first.dispatchEvent(new w.Event('change',{bubbles:true}));await delay()
 assert.match(summary.textContent,/09:00/);assert.ok(Object.values(JSON.parse(w.localStorage.getItem('tokyo-2026-visits-v1'))).includes('done'))
 const second=doc.querySelectorAll('.visit-control select')[1];second.value='skipped';second.dispatchEvent(new w.Event('change',{bubbles:true}));await delay()
 assert.match(summary.textContent,/10:00/)
 summary.click();await click('지연·피로 시');assert.match(doc.querySelector('.today-focus').textContent,/MEGA TOKYO부터 줄이세요/)
 const origin=doc.querySelector('[aria-label="다음 일정 길찾기 출발지"]');origin.value='lodging';origin.dispatchEvent(new w.Event('change',{bubbles:true}));await delay()
 const route=new URL(doc.querySelector('.today-focus a[href*="maps/dir"]').href);assert.equal(route.searchParams.get('destination'),places.find(p=>p.id==='harry').mapQuery)
 await click('필수 정보');assert.ok(doc.querySelector('.essentials-dialog').open);assert.match(doc.querySelector('.essentials-dialog').textContent,/11:00–12:00/);assert.match(doc.querySelector('.essentials-dialog').textContent,/결제는 별도 확인/)
 doc.querySelector('[aria-label="필수 정보 닫기"]').click();await delay();assert.equal(doc.querySelector('dialog'),null)
 await click('Day 4');await click('Day 3');assert.equal(doc.querySelector('.visit-control select').value,'done')
})
test('every theme candidate carries individual research and safe photo source links',async()=>{
 const {doc,click}=await app('https://tokyo.test/?view=themes&day=1')
 await click('도쿄타워를 담는 곳')
 assert.equal(doc.querySelectorAll('.theme-card-detail-open').length,7)
 doc.querySelector('[data-spot="akabanebashi-photo"] .theme-card-detail-open').click();await delay()
 assert.equal(doc.querySelectorAll('dialog.theme-card-detail .official-evidence').length,1)
 assert.ok(doc.querySelector('.official-evidence a[href^="https://"]'))
 doc.querySelector('[aria-label="방문 정보 닫기"]').click();await delay()
 await click('책방·음악·산책');assert.match(doc.querySelector('[data-spot="kioi-seido"]').textContent,/일반 공개를 하지 않는/)
 assert.equal(doc.querySelectorAll('img[src^="http"]').length,0)
})
test('mock Maps integration creates numbered markers, refits dates and selects places',async()=>{
 const code=await mapBundle()
 const calls={maps:0,markers:[],fits:0};
 class MapMock{constructor(){calls.maps++}fitBounds(){calls.fits++}panTo(){}setZoom(){}}
 class Bounds{extend(){}}
 class Marker{constructor(options){this.map=options.map;calls.markers.push(options)}}
 const {dom,doc,click}=await app(undefined,undefined,code,w=>{w.google={maps:{importLibrary:async name=>name==='maps'?{Map:MapMock}:name==='core'?{LatLngBounds:Bounds}:name==='marker'?{AdvancedMarkerElement:Marker}:Promise.reject(new Error('Unexpected library: '+name))}}});await delay();assert.ok(calls.maps>=1);assert.ok(calls.markers.some(m=>m.content.textContent==='1'));assert.ok(doc.querySelector('.google-map.visible'));const first=calls.fits;await click('Day 4');assert.ok(calls.fits>first);const last=calls.markers.at(-1);last.content.click();await delay();assert.ok(doc.querySelector('dialog'));dom.window.close()
})
test('a delayed catalog coordinate revision replaces existing map pins and bounds',async()=>{
 const loader=await createServer({configFile:false,cacheDir:'node_modules/.vite-test-app',optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},logLevel:'silent'})
 let catalog
 try{catalog=structuredClone((await loader.ssrLoadModule('/src/shared/catalog.ts')).catalogData.trip)}finally{await loader.close()}
 const odaiba=catalog.places.find(place=>place.id==='odaiba');odaiba.position={lat:35.6305,lng:139.7735}
 let release
 const response=new Promise(resolve=>{release=resolve})
 const markers=[];let fits=0
 class MapMock{fitBounds(){fits++}panTo(){}}
 class Bounds{extend(){}}
 class Marker{constructor(options){Object.assign(this,options);markers.push(this)}}
 const {doc}=await app(undefined,undefined,await mapBundle(),w=>{
  w.fetch=async path=>{if(path==='/api/catalog/trip')return response;throw Error('Unavailable')}
  w.google={maps:{importLibrary:async name=>name==='maps'?{Map:MapMock}:name==='core'?{LatLngBounds:Bounds}:{AdvancedMarkerElement:Marker}}}
 })
 await delay();const original=markers.find(marker=>marker.title===odaiba.name);assert.ok(original)
 const before=fits
 release({ok:true,headers:{get:()=> 'application/json'},json:async()=>({resource:'trip',schemaVersion:1,source:'maintained-catalog',data:catalog})})
 await delay();await delay()
 assert.equal(original.map,null)
 assert.ok(markers.some(marker=>marker.title===odaiba.name&&marker.position.lat===35.6305&&marker.map))
 assert.ok(fits>before);assert.ok(doc.querySelector('.google-map.visible'))
})

test('Notion payment evidence is distinguished from confirmed reservations',async()=>{const {dom,doc,click}=await app('https://tokyo.test/?day=2');assert.match(doc.body.textContent,/티켓 원문 확인/);await click('준비 체크');assert.match(doc.body.textContent,/11\/11 확정 예정/);assert.equal(doc.querySelector('input[type="checkbox"]').checked,false);dom.window.close()})

test('blocked SDK script reports network failure and can be retried',async()=>{
 const code=await mapBundle()
 const {dom,w,doc,click}=await app(undefined,undefined,code)
 const first=doc.querySelector('script[data-tokyo-maps]');assert.ok(first)
 const u=new URL(first.src);assert.equal(u.searchParams.get('key'),'TEST_ONLY_NOT_A_REAL_KEY');assert.equal(u.searchParams.get('loading'),'async');assert.equal(u.searchParams.has('auth_referrer_policy'),false)
 first.dispatchEvent(new w.Event('error'));await delay()
 assert.match(doc.querySelector('.map-connection').textContent,/지도 요청을 불러오지 못했습니다/)
 assert.ok(doc.querySelector('.day-schedule'))
 await click('다시 연결')
 const second=doc.querySelector('script[data-tokyo-maps]');assert.ok(second);assert.notEqual(second,first)
 second.dispatchEvent(new w.Event('error'));await delay();dom.window.close()
})
test('authentication failure is distinct from browser request blocking',async()=>{
 const {dom,w,doc}=await app(undefined,undefined,await mapBundle())
 assert.equal(typeof w.gm_authFailure,'function');w.gm_authFailure();await delay()
 assert.match(doc.querySelector('.map-connection').textContent,/Google 지도 인증을 확인/)
 assert.match(doc.querySelector('.map-connection').textContent,/새로고침/)
 assert.ok(doc.querySelector('.transit a[href*="google.com/maps/dir"]'));dom.window.close()
})
test('map resizes after mobile visibility change without recreating the instance',async()=>{
 let callback;let fits=0;let maps=0
 class MapMock{constructor(){maps++}fitBounds(){fits++}panTo(){}}
 class Bounds{extend(){}}
 class Marker{constructor(options){this.map=options.map}}
 const {dom,w,doc}=await app(undefined,undefined,await mapBundle(),w=>{
  w.ResizeObserver=class{constructor(cb){callback=cb}observe(){}disconnect(){}}
  w.google={maps:{importLibrary:async name=>name==='maps'?{Map:MapMock}:name==='core'?{LatLngBounds:Bounds}:name==='marker'?{AdvancedMarkerElement:Marker}:Promise.reject(new Error('Unexpected library: '+name))}}
 })
 await delay();const original=fits;assert.ok(callback);callback([{contentRect:{width:390,height:600}}]);await delay();assert.ok(fits>original);assert.equal(maps,1)
 doc.querySelectorAll('.mobile-switch button')[1].click();await delay();assert.ok(doc.querySelector('.travel-workspace.mobile-map'));assert.equal(maps,1);dom.window.close()
})

test('a failed bounds constructor preserves the itinerary and offers map retry',async()=>{
 const {dom,doc}=await app(undefined,undefined,await mapBundle(),w=>{
  class MapMock{fitBounds(){}panTo(){}}
  class FailedBounds{constructor(){throw new Error('Bounds constructor failed')}}
  class Marker{}
  // Match the official SDK exports: maps has Map; core alone has LatLngBounds.
  const libraries={maps:{Map:MapMock},core:{LatLngBounds:FailedBounds},marker:{AdvancedMarkerElement:Marker}}
  w.google={maps:{importLibrary:async name=>{assert.ok(name in libraries);return libraries[name]}}}
 })
 await delay();assert.match(doc.querySelector('.map-connection').textContent,/지도를 표시하지 못했습니다/)
 assert.ok(doc.querySelector('.day-schedule'));assert.ok(doc.querySelector('.transit a'));assert.match(doc.body.textContent,/다시 연결/);dom.window.close()
})

test('development BFCache restore refreshes a stale HMR page, normal navigation does not',async()=>{
 const {refreshDevelopmentPageOnRestore}=await import('../src/lib/pageLifecycle.ts')
 const dom=new JSDOM('',{url:'https://tokyo.test/'})
 let reloads=0
 const dispose=refreshDevelopmentPageOnRestore(dom.window,()=>reloads++)
 dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow',{persisted:false}));assert.equal(reloads,0)
 dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow',{persisted:true}));assert.equal(reloads,1)
 dispose();dom.window.dispatchEvent(new dom.window.PageTransitionEvent('pageshow',{persisted:true}));assert.equal(reloads,1)
 dom.window.close()
})

test('traveler identities are omitted from all visible schedules and checklist',async()=>{const {dom,doc,click}=await app('https://tokyo.test/?day=all');assert.doesNotMatch(doc.body.textContent,/강산|유식|호진|담당/);await click('준비 체크');assert.doesNotMatch(doc.body.textContent,/강산|유식|호진|담당/);dom.window.close()})

test('lodging has its own address-region detail instead of the station location',async()=>{
 const {dom,doc}=await app();doc.querySelector('.lodging-bar').click();await delay()
 assert.match(doc.querySelector('dialog').textContent,/新橋5丁目29/)
 assert.match(doc.querySelector('dialog').textContent,/건물 입구|대표점/)
 assert.ok(doc.querySelector('dialog a[href*="travelmode=walking"]'));dom.window.close()
})
test('licensed photos resolve locally and carry visible provenance',async()=>{
 const photos=JSON.parse(await readFile('src/data/photos.json','utf8'))
 assert.ok(Object.keys(photos).length>=13)
 for(const photo of Object.values(photos)){assert.ok((await readFile('public'+photo.src)).length>1000);assert.ok(/^https:\/\/commons.wikimedia.org\/wiki\/File:/.test(photo.source)||photo.source.startsWith('https://unsplash.com/photos/')||/^https:\/\/www.flickr.com\/photos\/[a-zA-Z0-9_@-]+\/\d+\/?$/.test(photo.source));assert.ok(/^CC/.test(photo.license)||['Unsplash License','Public domain'].includes(photo.license));assert.ok(photo.author)}
 const {dom,doc}=await app('https://tokyo.test/?day=4');assert.ok(doc.querySelector('.place-preview img[alt]'));assert.ok(doc.querySelector('.photo-credit a[href*="creativecommons.org"]'));dom.window.close()
})
test('live Notion timetable updates on focus; failed refresh keeps the last valid revision',async()=>{
 let revision=0
 const live=()=>({enabled:true,version:1,lastEditedAt:'2026-10-17T12:00:00Z',fetchedAt:'2026-10-17T12:00:01Z',days:[1,2,3,4,5].map(id=>({id,rows:[{time:revision?'15:45–17:30':'15:15–16:50',title:'오다이바 해변공원',note:'필수: 해변 산책 · 예약 미확인'}]}))})
 const {dom,doc,w}=await app(undefined,undefined,bundle,w=>{w.fetch=async()=>{if(revision===2)throw Error('offline');return{ok:true,headers:{get:()=> 'application/json'},json:async()=>live()}}})
 assert.match(doc.querySelector('.stop-time').textContent,/15:15/);assert.match(doc.querySelector('.itinerary-footnote').textContent,/자동 반영/)
 revision=1;w.dispatchEvent(new w.Event('focus'));await delay();assert.match(doc.querySelector('.stop-time').textContent,/15:45/)
 revision=2;w.dispatchEvent(new w.Event('focus'));await delay();assert.match(doc.querySelector('.stop-time').textContent,/15:45/);assert.match(doc.querySelector('.itinerary-footnote').textContent,/갱신 지연/);dom.window.close()
})
test('HTML sync failures retain the last timetable with a delay label; disabled sync restores the base',async()=>{
 let mode='live'
 const live={enabled:true,version:1,lastEditedAt:'2026-10-18T00:00:00Z',fetchedAt:'2026-10-18T00:00:01Z',days:[1,2,3,4,5].map(id=>({id,rows:[{time:'15:45',title:'오다이바 동기화 검증',note:'계획'}]}))}
 const {w,doc}=await app(undefined,undefined,bundle,w=>{w.fetch=async()=>({ok:true,headers:{get:()=>mode==='html'?'text/html':'application/json'},json:async()=>mode==='disabled'?{enabled:false}:live})})
 assert.match(doc.body.textContent,/오다이바 동기화 검증/)
 mode='html';w.dispatchEvent(new w.Event('focus'));await delay()
 assert.match(doc.body.textContent,/오다이바 동기화 검증/);assert.match(doc.querySelector('.itinerary-footnote').textContent,/갱신 지연/)
 mode='disabled';w.dispatchEvent(new w.Event('focus'));await delay()
 assert.doesNotMatch(doc.body.textContent,/오다이바 동기화 검증/);assert.match(doc.querySelector('.itinerary-footnote').textContent,/기본 일정/)
})

test('yen reference rate validates response, converts amount and preserves its date',async()=>{
 const {doc,w,click}=await app(undefined,undefined,bundle,w=>{w.fetch=async()=>({ok:true,json:async()=>({date:'2026-10-16',base:'JPY',quote:'KRW',rate:8.58})})})
 await click('준비 체크');await delay()
 assert.match(doc.querySelector('.exchange-rate').textContent,/858/)
 assert.match(doc.querySelector('.yen-exchange').textContent,/2026-10-16/)
 assert.match(doc.querySelector('.exchange-total').textContent,/85,800/)
 const input=doc.querySelector('[aria-label="환산할 엔화 금액"]')
 Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(input,'2000');input.dispatchEvent(new w.Event('input',{bubbles:true}));await delay()
 assert.match(doc.querySelector('.exchange-total').textContent,/17,160/)
 assert.match(doc.querySelector('.yen-exchange').textContent,/실시간 시세가 아닙니다/)
})

test('bad or unavailable exchange data does not fabricate a rate or break checklist',async()=>{
 for(const result of [{ok:false},{ok:true,json:async()=>({date:'today',base:'USD',quote:'KRW',rate:-1})}]){
  const {doc,click}=await app(undefined,undefined,bundle,w=>{w.fetch=async()=>result})
  await click('준비 체크');await delay()
  assert.match(doc.querySelector('.yen-exchange').textContent,/불러오지 못했습니다/)
  assert.equal(doc.querySelector('.exchange-rate'),null)
  assert.ok(doc.querySelector('input[type="checkbox"]'))
 }
})

test('shared travel tips remain Korean, actionable and explicitly unconfirmed',async()=>{
 const {doc,click}=await app('https://tokyo.test/?day=3')
 assert.match(doc.querySelector('.reservation-reminder').textContent,/일반 입장 예약제 종료/)
 await click('스타워즈 스토어');assert.match(doc.querySelector('dialog').textContent,/원하는 디자인으로 꾸미는 체험형 굿즈 코너/)
 doc.querySelector('[aria-label="장소 상세 닫기"]').click();await delay();await click('준비 체크')
 await click('교통·입장 준비');assert.match(doc.body.textContent,/Suica 등록·충전/)
 assert.equal(doc.querySelector('.saved-spot'),null)
 assert.equal(doc.querySelectorAll('input[type="checkbox"]').length,5)
 assert.match(doc.querySelector('[role="tablist"]').textContent,/0\/6.*0\/5.*0\/6/)
 assert.match(doc.querySelector('.preparation-guide').textContent,/갤럭시·안드로이드/)
})

test('photo themes preserve shared positions and save candidates without day links',async()=>{
 const {doc,w,click}=await app()
 await click('테마 탐색')
 assert.equal(doc.querySelector('.theme-tabs .selected').textContent.startsWith('12월 도쿄에서 할 일'),true)
 await click('도쿄타워를 담는 곳')
 assert.equal(doc.querySelectorAll('.theme-spot').length,7)
 doc.querySelector('[data-spot="fudanotsuji-photo"] .theme-card-detail-open').click();await delay()
 assert.match(doc.querySelector('dialog.theme-card-detail').textContent,/공유 좌표 35.645238/)
 doc.querySelector('[aria-label="방문 정보 닫기"]').click();await delay()
 const save=doc.querySelector('[data-spot="akabanebashi-photo"] .theme-spot-top button');save.click();await delay()
 assert.equal(save.getAttribute('aria-pressed'),'true')
 assert.ok(JSON.parse(w.localStorage.getItem('tokyo-2026-theme-saves-v1')).includes('akabanebashi-photo'))
 const direction=new URL(doc.querySelector('.theme-actions a:nth-child(2)').href)
 assert.equal(direction.searchParams.get('origin'),'東京都港区新橋5丁目29')
 assert.equal(direction.searchParams.get('travelmode'),'transit')
 assert.equal(direction.searchParams.has('key'),false)
 await click('철길이 있는 도쿄');assert.equal(doc.querySelectorAll('.theme-spot').length,1)
 assert.doesNotMatch(doc.querySelector('.theme-intro').textContent,/일정 보기/)
 await click('도쿄타워를 담는 곳');assert.equal(doc.querySelector('[data-spot="akabanebashi-photo"] .theme-spot-top button').getAttribute('aria-pressed'),'true')
})

test('night, winter, restaurant and character themes retain source boundaries',async()=>{
 const {doc,click}=await app();await click('테마 탐색')
 for(const [name,count] of [['도쿄의 밤',12],['먹고 싶은 곳',2],['캐릭터·굿즈',11]]){
  await click(name);assert.equal(doc.querySelectorAll('.theme-spot').length,count)
 }
 doc.querySelector('[data-spot="character-harry"] .theme-card-detail-open').click();await delay()
 doc.querySelector('[data-spot="character-harry"] .theme-place-preview').click();await delay();assert.match(doc.querySelector('dialog').textContent,/해리포터/)
 doc.querySelector('[aria-label="장소 상세 닫기"]').click();await delay()
 await click('먹고 싶은 곳');assert.match(doc.querySelector('.theme-page').textContent,/かめ幸/)
 assert.ok(doc.querySelector('.theme-card-detail-open'))
 assert.match(doc.querySelector('.theme-page').textContent,/평점을 수집하거나 높은 순으로 정렬한 목록은 아닙니다/)
 await click('도쿄의 밤');assert.match(doc.querySelector('[data-spot="keyakizaka"]').textContent,/17:00–22:00/)
})

test('shared candidates can be searched and saved across themes without inventing map positions',async()=>{
 const {doc,w,click}=await app();await click('테마 탐색')
 const input=doc.querySelector('[aria-label="전체 테마 검색"]')
 const search=async value=>{Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new w.Event('input',{bubbles:true}));await delay()}
 await search('토리코로루');assert.equal(doc.querySelectorAll('.theme-spot').length,1)
 doc.querySelector('.theme-card-detail-open').click();await delay()
 assert.match(doc.querySelector('dialog.theme-card-detail').textContent,/화요일 휴무/)
 doc.querySelector('[aria-label="방문 정보 닫기"]').click();await delay()
 assert.ok(doc.querySelector('.theme-spot img[src*="tricolore"]'))
 doc.querySelector('.theme-spot-top button').click();await delay();await search('')
 const saved=doc.querySelector('.theme-tools > button');saved.click();await delay()
 assert.equal(doc.querySelectorAll('.theme-spot').length,1)
 await click('약국 관심 품목');assert.equal(doc.querySelectorAll('.theme-spot').length,7)
 assert.equal(doc.querySelectorAll('.theme-actions').length,0)
 assert.ok(doc.querySelector('.theme-references a[href*="pmda.go.jp"]'))
 await click('근교 당일치기');assert.match(doc.querySelector('.theme-page').textContent,/왕복1회/)
 assert.equal(doc.querySelectorAll('.theme-intro .secondary-button').length,0)
 assert.equal(doc.querySelector('article[data-spot="off-season"]'),null)
 await search('없는 장소 검색');assert.ok(doc.querySelector('.theme-empty'))
})

test('old theme saves survive merged collections and the visible list defaults to Korean name order',async()=>{
 const {doc,w,click}=await app('https://tokyo.test/?view=themes',undefined,bundle,w=>w.localStorage.setItem('tokyo-2026-theme-saves-v1',JSON.stringify(['character-mega','subculture-mega','roppongi-night'])))
 const names=[...doc.querySelectorAll('.theme-spot h3')].map(el=>el.textContent)
 assert.deepEqual(names,[...names].sort(new Intl.Collator('ko',{numeric:true,sensitivity:'base'}).compare))
 assert.equal(doc.querySelector('[aria-label="장소 정렬"]').value,'name')
 await click('저장한 항목');assert.equal(doc.querySelectorAll('.theme-spot').length,2)
 assert.ok(doc.querySelector('[data-spot="subculture-mega"]'));assert.ok(doc.querySelector('[data-spot="keyakizaka"]'))
 doc.querySelector('[data-spot="subculture-mega"] .theme-spot-top button').click();await delay()
 assert.deepEqual(JSON.parse(w.localStorage.getItem('tokyo-2026-theme-saves-v1')),['keyakizaka'])
})
