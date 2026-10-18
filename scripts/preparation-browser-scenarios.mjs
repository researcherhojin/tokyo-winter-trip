export async function preparationAudit(page) {
 const assert=(condition,message)=>{if(!condition)throw Error(message)}
 const storageKey='tokyo-2026-checklist-v1'
 await page.goto('http://127.0.0.1:5173/?view=checklist')
 await page.locator('.prep-filter').waitFor()
 const original=await page.evaluate(key=>localStorage.getItem(key),storageKey)
 const errors=[]
 const onError=error=>errors.push(error.message)
 page.on('pageerror',onError)
 try {
  await page.evaluate(key=>localStorage.removeItem(key),storageKey)
  await page.reload()
  await page.locator('.prep-filter').waitFor()
  await page.waitForTimeout(300)
  // #44 one stage per tab: collect every tab's tasks.
  const tabs=page.locator('.prep-tabs [role=tab]')
  assert(await tabs.count()===3,'Preparation should have three actionable stages')
  const titles=[]
  for(let i=0;i<3;i++){await tabs.nth(i).click();assert(await page.locator('.prep-group-heading h3').count()===1,'A tab should show one stage only');titles.push(...await page.locator('.prep-task strong').allTextContents())}
  assert(titles.length===17,'Preparation baseline must retain 17 preparation tasks')
  await tabs.first().click()
  assert(titles.findIndex(title=>title.startsWith('신바시 숙소'))<titles.findIndex(title=>title.startsWith('새 숙소 확정 후')),'New lodging must be confirmed before old booking cancellation')
  assert(titles.findIndex(title=>title.startsWith('Suica 지원'))<titles.findIndex(title=>title.startsWith('Suica 등록'))&&titles.findIndex(title=>title.startsWith('Suica 등록'))<titles.findIndex(title=>title.startsWith('익스프레스')),'Suica setup prerequisites are out of order')
  const firstTab=await page.locator('.prep-task').count()
  await page.getByRole('button',{name:/^미완료/}).click()
  await page.locator('.prep-task label').first().click()
  assert(await page.locator('.prep-task').count()===firstTab-1,'Completed task remains in incomplete filter')
  await page.reload()
  await page.locator('.prep-task input:checked').waitFor()
  assert(await page.locator('.prep-task input:checked').count()===1,'Check did not survive reload')
  await page.getByRole('button',{name:/^미완료/}).click()
  await page.locator('.prep-priority-list button').first().click()
  await page.waitForFunction(()=>document.activeElement?.tagName==='INPUT')
  assert(await page.getByRole('button',{name:/^전체/}).getAttribute('aria-pressed')==='true','Priority did not restore all filter')
  await page.locator('.prep-storage > summary').click()
  const upload=page.getByLabel('체크리스트 백업 JSON 불러오기')
  const state=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),storageKey)
  const before=await state()
  for(const invalid of ['[]','{"harry":"true"}','{"unknown-id":true}']) {
   await upload.setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(invalid)})
   await page.getByText('현재 체크는 변경하지 않았습니다.',{exact:false}).waitFor()
   assert(JSON.stringify(await state())===JSON.stringify(before),'Invalid backup changed existing checks')
  }
  await upload.setInputFiles({name:'partial.json',mimeType:'application/json',buffer:Buffer.from('{"harry":true}')})
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)||'{}').harry===true,storageKey)
  const merged=await state()
  assert(Object.entries(before).every(([id,value])=>merged[id]===value),'Partial backup erased earlier checks')
  const downloadEvent=page.waitForEvent('download')
  await page.getByRole('button',{name:'체크 상태 백업',exact:true}).click()
  const download=await downloadEvent
  assert(download.suggestedFilename()==='tokyo-checklist.json','Backup download missing')
  for(let i=0;i<3;i++){await tabs.nth(i).click();for(const checkbox of await page.locator('.prep-task input').all())await checkbox.check()}
  await page.getByRole('button',{name:/^미완료/}).click()
  await page.getByText('모든 항목을 체크했어요',{exact:true}).waitFor()
  assert(await page.locator('.prep-task').count()===0,'Completed checklist did not show empty state')
  await page.getByRole('button',{name:'전체 목록 보기',exact:true}).click()
  assert(await page.locator('.prep-task').count()>0,'All list failed after empty state')
  await page.evaluate(key=>localStorage.removeItem(key),storageKey)
  await page.reload()
  await page.locator('.prep-filter').waitFor()
  const layouts=[]
  for(const width of [1440,768,390,320]) {
   await page.setViewportSize({width,height:1000})
   await page.evaluate(()=>window.scrollTo(0,0))
   await page.waitForTimeout(200)
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,small:[...document.querySelectorAll('.prep-filter button,.prep-priority-list button,.prep-action-guide summary')].filter(el=>el.getBoundingClientRect().height<44).length}))
   assert(!result.overflow&&!result.small,'Preparation responsive or target size failure at '+width)
   layouts.push({width,...result})
   await page.screenshot({path:`output/playwright/preparation-detail-${width}.png`,fullPage:width===1440})
  }
  await page.locator('.prep-action-guide > summary').first().click()
  const links=await page.locator('.prep-action-guide[open] a').evaluateAll(nodes=>nodes.map(el=>({url:el.href,height:el.getBoundingClientRect().height})))
  assert(links.length>0&&links.every(link=>link.url.startsWith('https://')&&link.height>=44),'Preparation evidence links unavailable or too small')
  assert(!await page.locator('.prep-exchange').evaluate(el=>el.open),'Reference exchange should be collapsed initially')
  assert(errors.length===0,'Preparation page errors')
  return {tasks:titles.length,stages:3,prerequisiteOrder:'passed',filter:'passed',priorityFocus:'passed',reload:'passed',invalidBackup:'state preserved',partialBackup:'merged',download:'passed',completedState:'passed',layouts,pageErrors:errors}
 } finally {
  page.off('pageerror',onError)
  await page.evaluate(({key,value})=>value===null?localStorage.removeItem(key):localStorage.setItem(key,value),{key:storageKey,value:original})
 }
}
