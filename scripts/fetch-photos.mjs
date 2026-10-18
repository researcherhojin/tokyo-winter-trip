import { mkdir, writeFile } from 'node:fs/promises'
const files={
 harry:['Warner Bros Studio Tour Tokyo 2024-11-03.jpg','워너 브라더스 스튜디오 투어 도쿄 · 2024년 사진'],
 narita:['Narita Airport Terminal 2 exterior.jpg','나리타공항 제2터미널 외관'],
 tsukiji:['Tsukiji Outer Market -04.jpg','츠키지 장외시장 거리'],
 starwars:['Ikebukuro PARCO 2017-10-26.jpg','이케부쿠로 PARCO 외관 · 스타워즈 매장 내부 아님'],
 skypokemon:['Pokémon Center am Tokio Skytree (2024).jpg','포켓몬센터 스카이트리 타운 · 2024년 사진'],
 tower:['Tokyo Tower 2023.jpg','도쿄타워 외관'],
 shinbashi:['JR Shimbashi Station (2019-05-04) 02.jpg','신바시역 외관'],
 odaiba:['Odaiba close up - 2025 Jan 14 01-27PM.jpeg','오다이바 전경 · 공원 근접 사진 아님'],
 yomiuri:['Yomiuriland-20100411.jpg','요미우리랜드 전경 · 포케파크 개장 전 사진'],
 mega:['Sunshine City 2012.JPG','선샤인시티 전경 · 포켓몬센터 내부 아님'],
 sensoji:['Sensoji 2023.jpg','센소지 경내'],
 skytree:['Tokyo Skytree 2014 Ⅲ.jpg','도쿄 스카이트리 외관'],
 akihabara:['Sotokanda, Akihabara Electric Town at night 20231114.png','아키하바라 거리'],
 ginza:['Ginza-WAKO at night.jpg','긴자 와코 야경']
}
const api=new URL('https://commons.wikimedia.org/w/api.php')
api.search=new URLSearchParams({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'960',titles:Object.values(files).map(v=>'File:'+v[0]).join('|')})
const response=await fetch(api,{headers:{'User-Agent':'TokyoTravelMap/1.0 (local educational travel planner)'}})
if(!response.ok)throw Error('Metadata HTTP '+response.status)
const data=await response.json();const pages=Object.values(data.query.pages)
const strip=s=>(s??'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').trim()
await mkdir('public/photos',{recursive:true});const manifest={}
for(const [id,[file,caption]] of Object.entries(files)){
 const item=pages.find(p=>p.title==='File:'+file)?.imageinfo?.[0];if(!item)throw Error('Missing '+file)
 const meta=item.extmetadata;const license=strip(meta.LicenseShortName?.value)
 if(!/^(CC BY|CC0|Public domain)/.test(license))throw Error('Review license: '+license)
 const url=item.thumburl??item.url;const img=await fetch(url);if(!img.ok)throw Error('Image HTTP '+img.status+' '+id)
 const extension=new URL(url).pathname.split('.').at(-1).toLowerCase();const local='/photos/'+id+'.'+extension
 await writeFile('public'+local,Buffer.from(await img.arrayBuffer()))
 manifest[id]={src:local,alt:caption,caption,author:strip(meta.Artist?.value).split('\n')[0],license,licenseUrl:meta.LicenseUrl?.value||'https://creativecommons.org/publicdomain/mark/1.0/',source:item.descriptionurl}
 console.log(id+': '+license)
}
await writeFile('src/data/photos.json',JSON.stringify(manifest,null,2)+'\n')
