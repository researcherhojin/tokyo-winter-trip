import { readFile,writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'

const manifest=JSON.parse(await readFile('src/data/photos.json','utf8'))
const review=JSON.parse(await readFile('src/data/photoReview.json','utf8'))
const loader=await createServer({configFile:false,cacheDir:'node_modules/.vite-photo-archive',optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},logLevel:'silent'})
try {
 const {travelThemes}=await loader.ssrLoadModule('/src/data/themes.ts')
 const {themePhotoId,themeReferencePhotoId}=await loader.ssrLoadModule('/src/lib/themePhoto.ts')
 const unavailable={}
 for(const file of ['extraItemPhotos','newPlacePhotos','archiveFoodPhotos','archiveProductPhotos','archivePlacePhotos','archiveProductRightsReview','photoReview']){
  try {Object.assign(unavailable,JSON.parse(await readFile(`src/data/${file}.json`,'utf8')).unavailable??{})}
  catch(error){if(error.code!=='ENOENT')throw error}
 }
 const assets={}
 for(const [id,photo] of Object.entries(manifest)){
  if(Object.hasOwn(review.excludedPhotos,id))throw Error('Rejected photo returned to public manifest: '+id)
  if(!photo.author||!photo.license||!photo.licenseUrl||!photo.source)throw Error('Photo provenance incomplete: '+id)
  const bytes=await readFile('public'+photo.src)
  if(bytes.length<1000)throw Error('Photo file incomplete: '+id)
  assets[id]={...photo,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}
 }
 const candidates=travelThemes.flatMap(theme=>theme.spots.map(spot=>{
  const primary=themePhotoId(spot)
  const reference=themeReferencePhotoId(spot)
  if(reference&&!assets[reference]?.reference)throw Error('Reference photo lacks its label: '+reference)
  const photoIds=[...new Set([primary,...spot.photoIds??[]].filter(Boolean))]
  for(const id of photoIds)if(!assets[id])throw Error('Candidate references missing asset: '+id)
  const missing=unavailable[spot.id]
  return {themeId:theme.id,theme:theme.title,id:spot.id,name:spot.name,status:primary?'archived':reference?'reference-photo':spot.kind==='unresolved'||spot.photoGap?'needs-identification':'reference-only',blocker:primary?null:spot.kind==='unresolved'||spot.photoGap?'identification':'reuse-rights',referencePhotoId:reference??null,photoIds,sourcePage:spot.evidence?.photoPageUrl??spot.officialUrl??spot.visitorInfo?.sourceUrl??null,scope:primary?assets[primary].viewEvidence??assets[primary].caption:typeof missing==='string'?missing:missing?.reason??'정확한 장소·상품과 사진 사용 조건을 함께 확인해야 합니다.'}
 }))
 const archived=candidates.filter(item=>item.status==='archived').length
 const referenced=candidates.filter(item=>item.status==='reference-photo').length
 const archive={generatedAt:new Date().toISOString(),complete:archived===candidates.length,summary:{themes:travelThemes.length,candidates:candidates.length,withPhotos:archived,referencePhotos:referenced,pending:candidates.length-archived,assets:Object.keys(assets).length},excludedPhotos:review.excludedPhotos,candidates,assets}
 await writeFile('public/photos/archive.json',JSON.stringify(archive,null,2)+'\n')
 const lines=['# 사진 아카이브 현황','',`후보 ${candidates.length}개 중 ${archived}개 실제 사진 연결 · 실제 사진 미확보 ${candidates.length-archived}개(그중 비슷한 참고 사진 표시 ${referenced}개) · 보관 사진 ${Object.keys(assets).length}장`,'','모든 사진을 확보한 상태가 아닙니다. 지점·상품·촬영 위치가 확인되지 않은 사진은 대표·갤러리·공개 자산에서 제외했습니다. 실제 시설의 과거 사진은 촬영 시점을 표시하며 현재 운영과 구분합니다. 파일 경로·원문·저자·라이선스·파일 크기·SHA-256은 [공개 아카이브](../public/photos/archive.json)에 기록합니다. 아래 표는 현재 앱 카탈로그에서 자동 생성합니다.','','## 제외한 사진','','| 사진 ID | 제외 이유 |','| --- | --- |',...Object.entries(review.excludedPhotos).map(([id,reason])=>`| ${id} | ${reason} |`),'','## 미확보 후보','','| 테마 | 장소·상품 | 확인할 원문 | 남은 확인 |','| --- | --- | --- | --- |']
 const cell=text=>String(text??'').replaceAll('|','/').replaceAll('\n',' ')
 for(const item of candidates.filter(item=>item.status!=='archived'))lines.push(`| ${cell(item.theme)} | ${cell(item.name)} | ${item.sourcePage?`[사진 원문](${item.sourcePage})`:'원문 식별 필요'} | ${cell(item.scope)} |`)
 lines.push('','## 비슷한 참고 사진','','실제 후보의 사진이 아닙니다. 화면에 「비슷한 참고 사진」 표시와 차이를 함께 보여주며 위 미확보 수에 포함합니다.','','| 테마 | 장소·상품 | 참고 사진 | 실제와 다른 점 |','| --- | --- | --- | --- |')
 for(const item of candidates.filter(item=>item.referencePhotoId)){const photo=assets[item.referencePhotoId];lines.push(`| ${cell(item.theme)} | ${cell(item.name)} | [${cell(photo.caption)}](${photo.source}) | ${cell(photo.reference.difference)} |`)}
 lines.push('','## 연결된 후보','','| 테마 | 장소·상품 | 사진 |','| --- | --- | --- |')
 for(const item of candidates.filter(item=>item.status==='archived'))lines.push(`| ${cell(item.theme)} | ${cell(item.name)} | ${item.photoIds.map(id=>`[${cell(assets[id].caption)}](${assets[id].source})`).join(' / ')} |`)
 await writeFile('docs/PHOTO_ARCHIVE.md',lines.join('\n')+'\n')
 const licenses=Object.entries(assets).map(([id,photo])=>`- **${id}** — ${photo.caption}. © ${photo.author}. [${photo.license}](${photo.licenseUrl}) · [원본](${photo.source}) · 파일: ${photo.src.split('/').at(-1)}`)
 await writeFile('public/photos/LICENSE.md','# 장소 사진 출처와 재사용 조건\n\n촬영 당시 모습이며 현재 운영을 보장하지 않습니다. 미리보기는 화면에서 자르고 전체 사진은 원본 비율로 표시합니다.\n\n'+licenses.join('\n')+'\n')
 console.log(JSON.stringify(archive.summary))
} finally {await loader.close()}
