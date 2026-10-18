// Full-app sweep for the tokyo-detail-audit skill: every screen × 1440·1024·390·320, reports overflow, <44px targets, broken images, internal wording, repeated text, clipped text, off-screen controls.
// Run: bash ~/.codex/skills/playwright/scripts/playwright_cli.sh -s=tokyo-measure run-code "$(cat scripts/full-sweep.js)"
async (page) => {
 const internal='Self-published|Commons 설명|직접 시각|검색 요약|타베로그|2차 자료|2차 사이트|보도 기준|안내 매체|예년|\\(추정\\)|원문 403|공식 색인|undefined|null|NaN|\\[object'
 const check=()=>page.evaluate(source=>{
  const vis=e=>e.checkVisibility&&e.checkVisibility()
  const scope=document.querySelector('dialog[open]')??document
  const issues=[]
  if(document.documentElement.scrollWidth>innerWidth+1)issues.push('hOverflow '+document.documentElement.scrollWidth)
  const small=[...scope.querySelectorAll('button,a,summary,select')].filter(e=>vis(e)&&!e.closest('.google-map,.skip-link')&&!e.classList.contains('skip-link')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.height<43.5||r.width<43.5)}).map(e=>(e.textContent.trim()||e.getAttribute('aria-label')||e.tagName).slice(0,20))
  if(small.length)issues.push('small:'+[...new Set(small)].slice(0,5).join('|'))
  const broken=[...scope.querySelectorAll('img')].filter(i=>vis(i)&&i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop());if(broken.length)issues.push('broken:'+broken.join(','))
  const bad=new RegExp(source);const leaks=[...scope.querySelectorAll('*')].filter(e=>e.children.length===0&&vis(e)&&bad.test(e.textContent)).map(e=>e.textContent.trim().slice(0,30));if(leaks.length)issues.push('text:'+leaks.slice(0,3).join('|'))
  const leaves=[...scope.querySelectorAll('p,span,strong,small,h2,h3,dd,li,a,button,figcaption')].filter(e=>vis(e)&&e.textContent.trim().length>3&&!e.closest('.google-map'))
  for(let i=1;i<leaves.length;i++){const a=leaves[i-1],b=leaves[i];if(!a.contains(b)&&!b.contains(a)&&a.textContent.trim()===b.textContent.trim()&&a.textContent.trim().length>8){issues.push('dupText:'+a.textContent.trim().slice(0,30));break}}
  const clipped=leaves.filter(e=>!e.classList.contains('sr-only')&&e.children.length===0&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).textOverflow!=='ellipsis'&&getComputedStyle(e).overflowX!=='visible').map(e=>e.textContent.trim().slice(0,20));if(clipped.length)issues.push('clipped:'+clipped.slice(0,3).join('|'))
  const offscreen=[...scope.querySelectorAll('button,a,h2,h3,p')].filter(e=>vis(e)&&!e.closest('.google-map,.theme-gallery-track,.theme-toolbar-actions,.date-tabs,.theme-tabs')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left<-1)}).map(e=>e.textContent.trim().slice(0,20));if(offscreen.length)issues.push('offscreen:'+offscreen.slice(0,3).join('|'))
  return issues
 },internal)
 const out={}
 const go=async(url)=>{await page.goto('http://127.0.0.1:5173'+url);await page.waitForTimeout(1200)}
 for(const width of [1440,1024,390,320]){
  await page.setViewportSize({width,height:900})
  for(const d of ['1','2','3','4','5','all']){await go('/?day='+d);out[`${width} day${d}`]=await check()
   if(d==='2'){await page.evaluate(()=>document.querySelectorAll('.stop-details').forEach(x=>x.open=true));out[`${width} day2-guides`]=await check()}}
  await go('/?day=1');await page.getByRole('button',{name:'필수 정보',exact:true}).click();await page.waitForTimeout(400);out[`${width} essentials`]=await check();await page.keyboard.press('Escape')
  await go('/?day=1');await page.locator('.place-title').nth(2).click();await page.waitForTimeout(500);out[`${width} placeDetail`]=await check();await page.keyboard.press('Escape')
  await go('/?view=checklist');out[`${width} checklist`]=await check()
  await page.evaluate(()=>document.querySelectorAll('.prep-action-guide').forEach(x=>x.open=true));out[`${width} checklist-open`]=await check()
  await go('/?view=themes')
  const tabs=page.locator('.theme-sidebar button, .theme-tabs button').filter({hasText:/\d+\s*$/}).filter({hasNotText:'저장'})
  const n=await tabs.count()
  for(let i=0;i<n;i++){const t=tabs.nth(i);if(!await t.isVisible())continue;const name=(await t.innerText()).replace(/\s*\d+\s*$/,'');await t.click();await page.waitForTimeout(300);out[`${width} theme:${name}`]=await check()}
  await page.locator('.theme-image-open').first().click();await page.waitForTimeout(400);out[`${width} photoDialog`]=await check();await page.keyboard.press('Escape')
 }
 const failing=Object.fromEntries(Object.entries(out).filter(([,v])=>v.length))
 return JSON.stringify({screens:Object.keys(out).length,failing})
}
