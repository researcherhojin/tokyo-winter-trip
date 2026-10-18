/** Re-checks the user's requests in docs/INTENTS.md on every qa:browser run, so a fixed request cannot silently regress. */
export async function intentAudit(page) {
 const assert=(condition,message)=>{if(!condition)throw Error(message)}
 const internal=/Self-published|Commons 설명|직접 시각|검색 요약|타베로그|2차 자료|2차 사이트|보도 기준|안내 매체|예년|\(추정\)|원문 403|공식 색인/
 const report={}
 const themes=async()=>page.locator('.theme-sidebar button, .theme-tabs button').filter({hasText:/\d+\s*$/}).filter({hasNotText:'저장'})
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900})
  await page.goto('http://127.0.0.1:5173/?view=themes')
  await page.locator('.theme-spot').first().waitFor()
  const tabs=await themes()
  const count=await tabs.count()
  const offsets=new Set(),toolbars=new Set(),leaks=[],tags=[]
  for(let i=0;i<count;i++){
   if(!await tabs.nth(i).isVisible())continue
   await tabs.nth(i).click()
   await page.waitForTimeout(250)
   // #28 identical theme frame: cards start at the same offset below the title, toolbar height fixed.
   const frame=await page.evaluate(()=>{const q=s=>document.querySelector(s);return {card:Math.round(q('.theme-spot').getBoundingClientRect().top-q('.theme-intro').getBoundingClientRect().top),bar:Math.round(q('.theme-toolbar').getBoundingClientRect().height)}})
   offsets.add(frame.card);toolbars.add(frame.bar)
   // #2, #24 official-only wording and no internal notes, even with every card section opened.
   leaks.push(...await page.evaluate(async source=>{const bad=new RegExp(source);const sleep=ms=>new Promise(r=>setTimeout(r,ms));const panels=[...document.querySelectorAll('.theme-panel')].map(p=>[p,p.hidden]);panels.forEach(([p])=>p.hidden=false);const leaf=(root,tag)=>[...root.querySelectorAll('*')].filter(e=>e.children.length===0&&bad.test(e.textContent)).map(e=>tag(e)+': '+e.textContent.trim().slice(0,40));const found=leaf(document.querySelector('.theme-content'),e=>e.closest('[data-spot]')?.dataset.spot??'header');for(const button of document.querySelectorAll('.theme-card-detail-open')){const id=button.closest('[data-spot]').dataset.spot;button.click();await sleep(20);const dialog=document.querySelector('dialog.theme-card-detail[open]');if(dialog){dialog.querySelectorAll('details').forEach(d=>d.open=true);found.push(...leaf(dialog,()=>id+' (정보 창)'));dialog.querySelector('header button').click();await sleep(10)}}panels.forEach(([p,hidden])=>p.hidden=hidden);return found},internal.source))
   // #43 no tag row on cards (closure dates live in 방문 정보·출처).
   tags.push(...await page.evaluate(()=>[...document.querySelectorAll('.theme-spot-flags, .theme-spot .trip-closures')].map(f=>f.closest('[data-spot]').dataset.spot)))
  }
  assert(offsets.size===1,`Theme frames differ at ${width}: ${[...offsets]}`)
  assert(toolbars.size===1,`Theme toolbar heights differ at ${width}: ${[...toolbars]}`)
  assert(!leaks.length,'Internal or non-official wording visible: '+leaks.slice(0,5).join(' / '))
  assert(!tags.length,'Tag row should not appear on cards: '+tags.join(', '))
  report['themes'+width]={themes:count,cardOffset:[...offsets][0],toolbar:[...toolbars][0]}
 }
 // #35 switching themes at the narrowest width never widens the page (card grid column was sized by content).
 await page.setViewportSize({width:320,height:800})
 await page.goto('http://127.0.0.1:5173/?view=themes')
 await page.locator('.theme-spot').first().waitFor()
 const narrowTabs=await themes()
 for(let i=0;i<await narrowTabs.count();i++){await narrowTabs.nth(i).click();await page.waitForTimeout(200);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'Theme switch overflowed at 320px: tab '+i)}
 report.narrowThemes='no overflow at 320'
 // #37 card columns: 3 on a ~1280px window, 4 on a wide (~1920px) window.
 for(const [width,want] of [[1286,3],[1920,4]]){await page.setViewportSize({width,height:900});await page.waitForTimeout(200);const cols=await page.evaluate(()=>getComputedStyle(document.querySelector('.theme-spots')).gridTemplateColumns.split(' ').length);assert(cols===want,`Theme cards at ${width}px should be ${want} columns, got ${cols}`)}
 report.columns='3 at 1286, 4 at 1920'
 // #7 and the photo-dialog fix: one caption, credit without the repeated qualifier, no internal notes.
 await page.setViewportSize({width:1440,height:900})
 await page.goto('http://127.0.0.1:5173/?view=themes')
 await page.getByRole('button',{name:/캐릭터·굿즈/}).first().click()
 await page.locator('[data-spot="character-yomiuri"] .theme-image-open').first().click()
 const dialog=await page.locator('.theme-photo-dialog-caption').evaluate((node,source)=>{const text=[...node.querySelectorAll('p,span,a,summary')].filter(e=>e.checkVisibility()).map(e=>e.textContent.trim());const caption=node.querySelector('.photo-dialog-title').textContent.trim();return {captionCount:text.filter(t=>t.includes(caption.split(' · ').at(-1))).length,leak:new RegExp(source).test(node.textContent)}},internal.source)
 assert(dialog.captionCount===1,'Photo caption repeated in the dialog')
 assert(!dialog.leak,'Photo dialog shows internal verification notes')
 await page.keyboard.press('Escape')
 // #42 anime cards: no relation chip and no scene-comparison button (user removed both).
 await page.getByRole('button',{name:/애니 속 도쿄/}).first().click()
 await page.waitForTimeout(250)
 assert(!await page.locator('.theme-scene-link, .theme-relation').count(),'Anime cards should not show relation chips or scene comparison')
 // #17 docked trip panel never overlaps the map; #27 transit links stay on the heading row.
 const trip=[]
 for(const width of [1440,390])for(const day of [1,2,3,4,5]){
  await page.setViewportSize({width,height:900})
  await page.goto(`http://127.0.0.1:5173/?day=${day}`)
  await page.locator('.day-schedule').first().waitFor()
  const state=await page.evaluate(()=>{const panel=document.querySelector('.itinerary-panel').getBoundingClientRect(),map=document.querySelector('.map-column').getBoundingClientRect();const misaligned=[...document.querySelectorAll('.transit-heading')].filter(h=>{const a=h.querySelector('a');if(!a)return false;const s=h.querySelector('strong').getBoundingClientRect(),r=a.getBoundingClientRect();return Math.abs((s.top+s.height/2)-(r.top+r.height/2))>14}).length;return {overlap:innerWidth>900&&panel.right>map.left+1,misaligned}})
  assert(!state.overlap,`Trip panel overlaps the map on day ${day}`)
  assert(!state.misaligned,`Transit link wrapped on day ${day} at ${width}`)
  trip.push(`${width}/${day}`)
 }
 report.trip=trip.length
 report.photoDialog='one caption, no internal notes'
 report.anime='no chips, no scene button'
 return report
}
