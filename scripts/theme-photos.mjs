import { readFile, writeFile } from 'node:fs/promises'
const clean=value=>(value??'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').trim()
const query=async parameters=>{
 const response=await fetch('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',...parameters}),{headers:{'User-Agent':'TokyoTravelMap/1.0 (local travel planner)'}})
 if(!response.ok)throw Error('Commons metadata HTTP '+response.status)
 return response.json()
}
const terms=process.argv.slice(3).length?process.argv.slice(3):['Enoshima','Kamakurakokomae','Chiba Urban Monorail','Tower Hall Funabori','Starbucks Reserve Roastery Tokyo','Jinbocho']
if(process.argv[2]==='find'){
 for(const term of terms){
  const result=await query({generator:'search',gsrsearch:term+' filetype:bitmap',gsrnamespace:'6',gsrlimit:'3',prop:'imageinfo',iiprop:'extmetadata'})
  console.log(JSON.stringify({term,files:Object.values(result.query?.pages??{}).map(page=>({title:page.title,license:page.imageinfo?.[0].extmetadata?.LicenseShortName?.value}))}))
 }
}else{
 const selected=JSON.parse(await readFile('scripts/theme-photo-selection.json','utf8'))
 const manifest=JSON.parse(await readFile('src/data/photos.json','utf8'))
 for(const [id,{file,caption}]of Object.entries(selected)){
  const result=await query({titles:'File:'+file,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960'})
  const info=Object.values(result.query?.pages??{})[0]?.imageinfo?.[0]
  if(!info)throw Error('Missing Commons image '+id)
  const license=clean(info.extmetadata.LicenseShortName?.value)
  if(!/^(CC BY|CC0|Public domain)/.test(license))throw Error('License review required '+id)
  const response=await fetch(info.thumburl??info.url)
  if(!response.ok)throw Error('Commons image HTTP '+response.status)
  const extension=new URL(info.thumburl??info.url).pathname.split('.').at(-1).toLowerCase()
  const src='/photos/'+id+'.'+extension
  await writeFile('public'+src,Buffer.from(await response.arrayBuffer()))
  manifest[id]={src,alt:caption,caption,author:clean(info.extmetadata.Artist?.value).split('\n')[0],license,licenseUrl:info.extmetadata.LicenseUrl?.value??'https://creativecommons.org/publicdomain/mark/1.0/',source:info.descriptionurl}
  console.log(id+': '+license)
 }
 await writeFile('src/data/photos.json',JSON.stringify(manifest,null,2)+'\n')
 const lines=Object.entries(manifest).map(([id,photo])=>'- **'+id+'** — '+photo.caption+'. © '+photo.author+'. ['+photo.license+']('+photo.licenseUrl+') · [원본]('+photo.source+') · 파일: '+photo.src.split('/').at(-1))
 await writeFile('public/photos/LICENSE.md','# 장소 사진 출처와 재사용 조건\n\n기존 사진은 2026-10-17, 추가 테마 사진은 2026-10-18 Wikimedia Commons 메타데이터로 라이선스를 확인했습니다. 원본 파일은 아래 라이선스로 제공하며 화면에서 표시 영역에 맞춰 자릅니다. 촬영 시점과 현장 모습은 다를 수 있습니다.\n\n'+lines.join('\n')+'\n')
}
