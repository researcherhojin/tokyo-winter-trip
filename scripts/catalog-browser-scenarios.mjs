export async function catalogBrowserAudit(page) {
 const assert=(condition,message)=>{if(!condition)throw Error(message)}
 const errors=[];page.on('pageerror',error=>errors.push(error.message))
 const catalogs={};const http=[]
 for(const resource of ['trip','themes','preparation']) {
  const path='/api/catalog/'+resource
  const response=await page.request.get('http://127.0.0.1:5173'+path)
  assert(response.ok(),'Read API failed: '+resource)
  const body=await response.json();catalogs[resource]=body
  assert(body.resource===resource&&body.schemaVersion===1,'Invalid live contract: '+resource)
  const write=await page.request.post('http://127.0.0.1:5173'+path)
  assert(write.status()===405,'API accepted writes: '+resource)
  http.push({resource,get:response.status(),post:write.status()})
 }
 // Distinct values prove each screen consumes HTTP data, rather than only fetching it.
 const altered=structuredClone(catalogs)
 altered.trip.data.places.find(place=>place.id==='lodging').guide.overview='API로 전달한 숙소 상세 검증 문장입니다.'
 altered.themes.data.themes.find(theme=>theme.id==='december-tokyo').spots[0].name='API로 전달한 테마 장소'
 altered.preparation.data.checklist[0].title='API로 전달한 준비 항목'
 altered.preparation.data.checklist.push({id:'browser-added-item',group:'추가 확인',title:'API 추가 준비 항목',note:'갱신된 목록에서도 체크 상태를 복원합니다.'})
 await page.route('**/api/catalog/*',route=>{
  const resource=new URL(route.request().url()).pathname.split('/').at(-1)
  return route.fulfill({contentType:'application/json',body:JSON.stringify(altered[resource])})
 })
 await page.setViewportSize({width:1440,height:1000})
 await page.goto('http://127.0.0.1:5173/?day=1')
 const mapStyle=await page.evaluate(()=>{
  const panel=document.querySelector('.itinerary-panel'),button=document.querySelector('.date-tabs .selected'),heading=document.querySelector('.day-heading h1')
  return {width:panel.getBoundingClientRect().width,radius:getComputedStyle(panel).borderRadius,selection:getComputedStyle(button).backgroundColor,title:getComputedStyle(heading).fontSize}
 })
 await page.getByRole('button',{name:'숙소 주소와 길찾기 보기'}).click()
 await page.getByText('API로 전달한 숙소 상세 검증 문장입니다.',{exact:true}).waitFor()
 await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'테마 탐색',exact:true}).click();await page.locator('.theme-intro').waitFor()
 await page.getByText('API로 전달한 테마 장소',{exact:true}).waitFor()
 const themeStyle=await page.evaluate(()=>{
  const panel=document.querySelector('.theme-sidebar'),button=document.querySelector('.theme-tabs .selected'),heading=document.querySelector('.theme-intro h2')
  return {width:panel.getBoundingClientRect().width,radius:getComputedStyle(panel).borderRadius,selection:getComputedStyle(button).backgroundColor,title:getComputedStyle(heading).fontSize}
 })
 assert(Math.abs(themeStyle.width-224)<1,'Theme sidebar should be 224px');
 // The trip list is docked like Google Maps (no radius); selection and title tokens stay shared with themes.
 assert(['selection','title'].every(key=>mapStyle[key]===themeStyle[key]),'Shared panel tokens differ: '+JSON.stringify({mapStyle,themeStyle}))
 assert(new URL(page.url()).searchParams.get('view')==='themes','Theme URL missing')
 await page.reload()
 await page.getByText('API로 전달한 테마 장소',{exact:true}).waitFor()
 await page.goBack()
 await page.locator('.day-schedule').first().waitFor()
 await page.goForward()
 await page.getByText('API로 전달한 테마 장소',{exact:true}).waitFor()
 await page.getByRole('button',{name:'준비 체크',exact:true}).click();await page.locator('.prep-task').first().waitFor()
 await page.locator('.preparation-aside').waitFor()
 const prepStyle=await page.evaluate(()=>{const panel=document.querySelector('.preparation-aside'),card=document.querySelector('.preparation-primary');return {width:panel.getBoundingClientRect().width,radius:getComputedStyle(panel).borderRadius,cardRadius:getComputedStyle(card).borderRadius,bar:document.querySelector('.prep-content-bar').getBoundingClientRect().height}})
 assert(Math.abs(prepStyle.width-224)<1&&prepStyle.radius===themeStyle.radius&&prepStyle.cardRadius===themeStyle.radius&&Math.abs(prepStyle.bar-54)<2,'Preparation workspace differs from themes: '+JSON.stringify(prepStyle))
 await page.goBack()
 await page.getByText('API로 전달한 테마 장소',{exact:true}).waitFor()
 await page.getByRole('button',{name:'준비 체크',exact:true}).click();await page.locator('.prep-task').first().waitFor()
 await page.getByText('API로 전달한 준비 항목',{exact:true}).waitFor()
 const box=page.locator('input[type="checkbox"]').first();await box.check()
 const extraTab=page.getByRole('tab',{name:/추가 확인/});await extraTab.click()
 await page.getByLabel('API 추가 준비 항목').check()
 await page.reload()
 await page.getByText('API로 전달한 준비 항목',{exact:true}).waitFor()
 assert(new URL(page.url()).searchParams.get('view')==='checklist','Checklist URL missing')
 assert(await page.locator('input[type="checkbox"]').first().isChecked(),'Device checklist did not persist')
 await extraTab.click();await page.getByText('API 추가 준비 항목',{exact:true}).waitFor()
 assert(await page.getByLabel('API 추가 준비 항목').isChecked(),'API-added checklist item did not persist')
 await page.getByLabel('API 추가 준비 항목').uncheck()
 await page.locator('input[type="checkbox"]').first().uncheck()
 await page.unroute('**/api/catalog/*')
 const failures=[]
 for(const mode of ['offline','malformed']) {
  await page.route('**/api/catalog/*',route=>mode==='offline'?route.abort():route.fulfill({contentType:'application/json',body:'{"schemaVersion":1,"data":null}'}))
  await page.goto('http://127.0.0.1:5173/?day=1')
  await page.locator('.day-schedule').first().waitFor()
  await page.getByRole('button',{name:'숙소 주소와 길찾기 보기'}).click()
  assert(await page.locator('.detail-plan li').count()>=2,'Fallback place guide missing')
  await page.keyboard.press('Escape')
  await page.getByRole('button',{name:'테마 탐색',exact:true}).click();await page.locator('.theme-intro').waitFor()
  await page.getByRole('button',{name:/도쿄타워를 담는 곳/}).first().click()
  assert(await page.locator('.theme-spot').count()===7,'Fallback themes missing')
  await page.getByRole('button',{name:'준비 체크',exact:true}).click();await page.locator('.prep-task').first().waitFor()
  const prepTabs=page.locator('.prep-tabs [role=tab]');let boxes=0
  for(let i=0;i<await prepTabs.count();i++){await prepTabs.nth(i).click();boxes+=await page.locator('input[type="checkbox"]').count()}
  assert(boxes===catalogs.preparation.data.checklist.length,'Fallback checklist missing')
  failures.push({mode,trip:true,themes:true,preparation:true})
  await page.unroute('**/api/catalog/*')
 }
 await page.goto('http://127.0.0.1:5173/?day=1')
 const layouts=[]
 for(const screen of ['테마 탐색','준비 체크']) {
  await page.getByRole('button',{name:screen,exact:true}).click()
  for(const width of [1440,768,390,320]) {
   await page.setViewportSize({width,height:900})
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),screen+' overflow '+width)
   if(width===1440||width===390){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`output/playwright/unified-${screen==='테마 탐색'?'themes':'preparation'}-${width}.png`,fullPage:width===1440})}
   layouts.push({screen,width,overflow:false})
  }
 }
 await page.setViewportSize({width:390,height:844})
 await page.getByRole('button',{name:'여행 지도',exact:true}).click()
 await page.getByRole('button',{name:'숙소 주소와 길찾기 보기'}).click()
 await page.locator('.detail-source-list a').first().waitFor()
 assert(await page.locator('.detail-section').count()===5,'Detailed place sections missing')
 await page.screenshot({path:'output/playwright/unified-place-detail.png'})
 await page.keyboard.press('Escape')
 assert(!errors.length,'Catalog screen exceptions: '+errors.join('; '))
 return {http,httpValuesRendered:{trip:true,themes:true,preparation:true},failureFallback:failures,checklistReload:'passed',addedChecklistReload:'passed',screenReloadAndHistory:'passed',sharedPanelStyles:{map:mapStyle,themes:themeStyle},layouts,placeGuideSections:5,pageErrors:errors}
}
