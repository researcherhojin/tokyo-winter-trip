export async function browserAudit(page,photos){
 const assert=(condition,message)=>{if(!condition)throw Error(message)}
 const errors=[];page.on('pageerror',error=>errors.push(error.message))
 await page.setViewportSize({width:1440,height:1000})
 await page.goto('http://127.0.0.1:5173/?day=1')
 await page.locator('.map-panel[aria-busy="false"]').waitFor()
 const maps=await page.locator('.google-map.visible').count()>0
 assert(maps||(await page.locator('.map-connection').innerText()).includes('Google 지도 연결 전'),'Map initialization failed')
 const dayCounts=[]
 for(let day=1;day<=5;day++){
  await page.getByRole('button',{name:new RegExp('^Day '+day+',')}).click()
  await page.waitForFunction(({selector,count})=>document.querySelectorAll(selector).length===count,{selector:maps?'.google-pin':'.diagram-stop',count:[5,3,5,6,5][day-1]},{timeout:15000})
  const count=await page.locator(maps?'.google-pin':'.diagram-stop').count()
  assert(count===[5,3,5,6,5][day-1],'Incorrect day '+day+' markers')
  dayCounts.push(count)
 }
 await page.getByRole('button',{name:'전체 일정',exact:true}).click();if(maps)await page.waitForFunction(()=>document.querySelectorAll('.google-pin').length===15)
 assert(maps?await page.locator('.google-pin').count()===15:(await page.locator('.map-footer').innerText()).includes('방문 장소 14곳 + 숙소'),'Incorrect all-days markers')
 assert(!/강산|유식|호진/.test(await page.locator('body').innerText()),'Traveler identities are visible')
 const loaded=await page.evaluate(async sources=>Promise.all(sources.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=src}))),Object.values(photos).map(photo=>photo.src))
 assert(loaded.every(Boolean),'A local place photo failed to decode')
 await page.getByRole('button',{name:/^Day 4,/}).click()
 const selected=page.getByRole('button',{name:/^Day 4,/});await selected.hover()
 const hover=await selected.evaluate(el=>({foreground:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor}))
 const textAudit=await page.evaluate(()=>{
  const rgb=s=>(s.match(/[0-9.]+/g)||[]).map(Number)
  const luminance=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0)
  const ratios=[];const failures=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node
  while((node=walker.nextNode())){
   const el=node.parentElement
   if(!el||!node.textContent.trim()||el.closest('.google-map,script,style,.sr-only')||!el.checkVisibility())continue
   const style=getComputedStyle(el);let parent=el;let bg
   while(parent){const color=rgb(getComputedStyle(parent).backgroundColor);if(color.length===3||color[3]===1){bg=color;break}parent=parent.parentElement}
   const a=luminance(rgb(style.color)),b=luminance(bg??[255,255,255]);const ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);ratios.push(ratio)
   if(ratio<4.5)failures.push({text:node.textContent.trim().slice(0,40),ratio})
  }
  const targets=[...document.querySelectorAll('button,a,summary')].filter(el=>el.checkVisibility()&&!el.closest('.google-map')&&!el.classList.contains('skip-link')).map(el=>({text:el.textContent.trim().slice(0,30),width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})).filter(box=>box.width<43.5||box.height<43.5)
  return {minContrast:Math.round(Math.min(...ratios)*100)/100,failures,smallTargets:targets}
 })
 assert(!textAudit.failures.length,'Application text contrast failed: '+JSON.stringify(textAudit.failures))
 assert(!textAudit.smallTargets.length,'Application touch targets failed: '+JSON.stringify(textAudit.smallTargets))
 await page.mouse.move(0,0);await page.waitForTimeout(1800)
 await page.screenshot({path:'output/playwright/audit-after-desktop.png'})
 const viewports=[]
 for(const width of [1024,768,390,320]){
  await page.setViewportSize({width,height:844})
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
  assert(!overflow,'Horizontal overflow at '+width)
  const font=await page.locator('.stop-note').first().evaluate(el=>getComputedStyle(el).fontSize)
  assert(parseFloat(font)>=16,'Small body text at '+width)
  viewports.push({width,overflow,bodyFont:font})
  if(width===390){
   const layout=await page.locator('.itinerary-panel').boundingBox()
   const first=await page.locator('.place-title').first().boundingBox()
   assert(layout.y>190&&layout.y<400,'Mobile map preview is missing')
   assert(first.y+first.height<760,'First mobile place is below the sheet')
   await page.screenshot({path:'output/playwright/audit-after-mobile.png'})
   await page.getByRole('button',{name:'일정 펼치기',exact:true}).click()
   assert((await page.locator('.itinerary-panel').boundingBox()).y<240,'Mobile sheet did not expand')
   await page.getByRole('button',{name:'지도와 함께 보기',exact:true}).click()
  }
 }
 await page.setViewportSize({width:390,height:844})
 await page.getByRole('button',{name:'숙소 주소와 길찾기 보기'}).click()
 const text=await page.locator('dialog').innerText();assert(text.includes('新橋5丁目29')&&/대표점|건물 입구/.test(text),'Lodging precision missing')
 const modal=await page.locator('dialog').boundingBox();assert(modal.x>0&&modal.x+modal.width<390,'Dialog not centered')
 await page.screenshot({path:'output/playwright/lodging-detail.png'})
 await page.locator('dialog').evaluate(el=>el.scrollTop=el.scrollHeight)
 const close=await page.getByRole('button',{name:'장소 상세 닫기'}).boundingBox();assert(close.y>=modal.y&&close.y+close.height<=modal.y+modal.height,'Close action outside modal')
 await page.keyboard.press('Escape');assert(await page.locator('dialog').count()===0,'Escape did not close the dialog')
 await page.getByRole('group',{name:'모바일 보기'}).getByRole('button',{name:'지도',exact:true}).click()
 await page.waitForTimeout(1000);await page.screenshot({path:'output/playwright/audit-mobile-map.png'})
 await page.getByRole('button',{name:'준비 체크',exact:true}).click();await page.locator('.prep-task').first().waitFor()
 assert(!/강산|유식|호진/.test(await page.locator('body').innerText()),'Checklist identities are visible')
 await page.locator('.prep-exchange > summary').click()
 await page.locator('.yen-exchange button').waitFor({state:'visible'})
 await page.waitForFunction(()=>document.querySelector('.yen-exchange button').disabled===false)
 const liveExchange=await page.locator('.exchange-rate').count()?await page.locator('.yen-exchange').innerText():'upstream unavailable; fallback shown'
 assert(await page.locator('.saved-spot').count()===0,'Discovery candidate should not appear in preparation')
 await page.locator('.preparation-guide summary').click()
 assert((await page.locator('.preparation-guide').innerText()).includes('갤럭시·안드로이드'),'Device guidance missing')
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844})
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Preparation page overflow')
 }
 await page.setViewportSize({width:390,height:844})
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(250)
 await page.screenshot({path:'output/playwright/preparation-exchange.png'})
 await page.route('**/api.frankfurter.dev/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({date:'2026-10-16',base:'JPY',quote:'KRW',rate:8.58})}))
 await page.getByRole('button',{name:'엔화 환율 새로고침'}).click()
 await page.getByText('858',{exact:false}).first().waitFor()
 await page.getByRole('spinbutton',{name:'환산할 엔화 금액'}).fill('2000')
 assert((await page.locator('.exchange-total').innerText()).includes('17,160'),'Yen conversion failed')
 await page.route('**/api.frankfurter.dev/**',route=>route.abort())
 await page.getByRole('button',{name:'엔화 환율 새로고침'}).click()
 await page.getByText('환율을 불러오지 못했습니다.',{exact:false}).waitFor()
 assert((await page.locator('.yen-exchange').innerText()).includes('이전 조회값'),'Previous rate freshness is not explicit')
 await page.unroute('**/api.frankfurter.dev/**')
 await page.getByRole('button',{name:'테마 탐색',exact:true}).click();await page.locator('.theme-intro').waitFor()
 await page.getByRole('button',{name:/도쿄타워를 담는 곳/}).first().click();assert(await page.locator('.theme-spot').count()===7,'Tokyo Tower theme candidates are missing')
 await page.locator('.theme-spot-top button').first().click()
 assert(await page.locator('.theme-spot-top button').first().getAttribute('aria-pressed')==='true','Theme saving failed')
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:844})
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Theme page overflow at '+width)
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(250)
  if(width===1440)await page.screenshot({path:'output/playwright/themes-desktop.png'})
  if(width===390)await page.screenshot({path:'output/playwright/themes-mobile.png'})
 }
 await page.getByRole('button',{name:/철길이 있는 도쿄/}).click()
 assert(await page.locator('.theme-spot').count()===1,'Rail theme filter failed')
 for(const [label,count] of [['도쿄의 밤',12],['먹고 싶은 곳',2],['캐릭터·굿즈',11]]){
  await page.getByRole('button',{name:new RegExp(label)}).click()
  assert(await page.locator('.theme-spot').count()===count,'Theme count failed: '+label)
 }
 await page.locator('[data-spot="character-harry"] .theme-card-detail-open').click()
 await page.locator('[data-spot="character-harry"] .theme-place-preview').click()
 assert((await page.locator('dialog').innerText()).includes('해리포터'),'Character place detail failed')
 await page.keyboard.press('Escape')
 await page.getByRole('button',{name:/도쿄의 밤/}).click()
 assert((await page.locator('.theme-page').innerText()).includes('17:00–22:00'),'Winter event hours missing')
 await page.getByRole('button',{name:/근교 당일치기/}).click()
 assert(await page.locator('.theme-spot').count()===7,'Day trip candidates missing')
 assert(await page.locator('.theme-intro .secondary-button').count()===0,'Day trip was assigned to an existing day')
 await page.getByRole('searchbox',{name:'전체 테마 검색'}).fill('토리코로루')
 assert(await page.locator('.theme-spot').count()===1,'Cross-theme search failed')
 await page.locator('.theme-spot .photo-main').first().waitFor()
 await page.locator('.theme-spot .theme-card-detail-open').click()
 await page.locator('.theme-spot .theme-references summary').click()
 assert(await page.locator('.theme-spot .theme-references a[href*="ginza.jp/shop/873"]').isVisible(),'Reference link hidden')
 await page.screenshot({path:'output/playwright/cafe-source-search.png'})
 await page.keyboard.press('Escape')
 await page.getByRole('searchbox',{name:'전체 테마 검색'}).fill('')
 await page.getByRole('button',{name:/약국 관심 품목/}).click()
 assert(await page.locator('.theme-spot').count()===7,'Pharmacy interest list missing')
 assert(await page.locator('.theme-actions').count()===0,'Product interest was converted into a map place')
 await page.getByRole('button',{name:/카페·디저트/}).click()
 assert(await page.locator('.theme-spot').count()===8,'Dessert source was expanded with a fabricated seventh item')
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844})
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Expanded theme navigation overflow')
 }
 await page.getByRole('button',{name:/철길이 있는 도쿄/}).click()
 assert(await page.getByRole('button',{name:/일정 보기/}).count()===0,'Theme page should not link to a day itinerary')
 await page.setViewportSize({width:390,height:844})
 if(maps){
  await page.route('**/maps/api/js?**',route=>route.abort())
  await page.reload();await page.getByRole('button',{name:'여행 지도',exact:true}).click();await page.getByRole('group',{name:'모바일 보기'}).getByRole('button',{name:'지도',exact:true}).click()
  await page.locator('.map-panel[aria-busy="false"]').waitFor()
  assert((await page.locator('.map-connection').innerText()).includes('불러오지 못했습니다'),'Blocked SDK did not show a recoverable error')
  assert(await page.locator('.day-schedule').count()>0,'Blocked SDK removed itinerary')
  await page.unroute('**/maps/api/js?**');await page.reload();await page.getByRole('group',{name:'모바일 보기'}).getByRole('button',{name:'지도',exact:true}).click();await page.locator('.google-map.visible').waitFor();await page.locator('.google-pin').first().waitFor()
 }
 assert(!errors.length,'Page errors: '+errors.join('; '))
 return {target:'local Vite',maps:maps?'live Google Maps':'not configured',dayCounts,allPlaces:15,photosDecoded:loaded.length,hover,textAudit,viewports,mobileSheet:'preview and expansion passed',liveExchange,exchangeConversionAndFailure:'mocked response passed',themes:'11 themes, 78 entries; save, character detail and responsive checks passed',modalCentered:true,modalCloseAfterScroll:true,blockedSdkRecovery:maps?'passed':'not run without key',pageErrors:errors}
}
