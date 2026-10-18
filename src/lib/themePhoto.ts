import { photoById } from './photos'
import type { ThemeSpot } from '../data/themes'

export function themePhotoId(spot:ThemeSpot):string|undefined {
 const id=spot.photoId??spot.evidence?.photoId??spot.placeId
 return id&&photoById[id]?id:undefined
}

const gapText={
 location:{title:'촬영 위치 확인 필요',detail:'공유 게시물의 정확한 촬영 위치가 확인되면 사진을 찾습니다.'},
 store:{title:'매장 확인 필요',detail:'정확한 매장·지점이 확인되면 사진을 찾습니다.'},
 product:{title:'제품 확인 필요',detail:'정확한 제품명·규격이 확인되면 사진을 찾습니다.'},
 rights:{title:'공개 사용 가능한 사진 없음',detail:'재사용 허가된 사진을 찾지 못했습니다. 공식 사진은 원문에서 확인하세요.'},
}
/** Why a candidate has no photo: an unidentified target, or no reusable photo of an identified one. */
export function photoGap(spot:ThemeSpot):{title:string;detail:string}|undefined {
 if(themePhotoId(spot))return undefined
 return gapText[spot.photoGap??(spot.kind==='unresolved'?'store':'rights')]
}

/** Stand-in photos for candidates with no exact photo. They never count as an archived representative photo. */
export function themeReferencePhotoId(spot:ThemeSpot):string|undefined {
 if(themePhotoId(spot))return undefined
 const id=spot.referencePhotoId
 return id&&photoById[id]?.reference?id:undefined
}

/** Card frames are 4:3 and never crop, so lead with the photo that fills the frame best. An exact photo is never moved behind a stand-in, and in the night theme a night lead stays a night photo. */
export function cardPhotoOrder(ids:string[],nightOnly=false):string[] {
 const fill=(id:string)=>{const p=photoById[id];if(!p?.width||!p.height)return 0;const r=p.width/p.height;return Math.min(r/(4/3),(4/3)/r)}
 const first=ids[0]
 if(!first)return ids
 const exactFirst=!photoById[first]?.reference
 const dark=(id:string)=>['night','blue-hour'].includes(photoById[id]?.timeOfDay??'')
 const best=ids.filter(id=>(!exactFirst||!photoById[id]?.reference)&&(!nightOnly||dark(id)===dark(first))).reduce((a,b)=>fill(b)>fill(a)+.1?b:a,first)
 return best===first?ids:[best,...ids.filter(id=>id!==best)]
}
