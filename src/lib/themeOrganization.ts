import type { ThemeSpot, TravelTheme } from '../data/themes'
import { themePhotoId } from './themePhoto'

const aliases:Record<string,string>={
 'character-mega':'subculture-mega',
 'character-skypokemon':'subculture-skypokemon',
 'roppongi-night':'keyakizaka',
}
export const canonicalSpotId=(id:string)=>aliases[id]??id
const retiredSpotIds=new Set(['cat-bookshop','jazz-bar','times-parking','off-season','treasure-cafe'])
export const normalizeThemeSaves=(ids:string[])=>[...new Set(ids.map(canonicalSpotId))].filter(id=>!retiredSpotIds.has(id))

function mergeSpot(primary:ThemeSpot,other:ThemeSpot):ThemeSpot {
 const combine=(...values:(string|undefined)[])=>[...new Set(values.filter((value):value is string=>!!value))].join('\n\n')
 const photos=[...new Set([primary.photoId,...primary.photoIds??[],other.photoId,...other.photoIds??[]].filter((id):id is string=>!!id))].filter(id=>id!==primary.photoId)
 const references=[...primary.references??[],...other.references??[]]
 for(const spot of [primary,other])if(spot.officialUrl)references.push({title:'공식 안내',url:spot.officialUrl})
 return {...primary,note:combine(primary.note,other.note),details:combine(primary.details,other.details),photoIds:photos,references:[...new Map(references.map(item=>[item.url,item])).values()]}
}

/** Combine overlapping collections after enrichment so photos and source evidence survive. */
export function consolidateThemes(themes:TravelTheme[]):TravelTheme[] {
 themes=themes.map(theme=>({...theme,spots:theme.spots.filter(spot=>!retiredSpotIds.has(spot.id))}))
 const characters=themes.find(theme=>theme.id==='characters')
 const winter=themes.find(theme=>theme.id==='winter-lights')
 return themes.filter(theme=>!['characters','winter-lights'].includes(theme.id)).map(theme=>{
  if(theme.id==='subculture'&&characters){
   const spots=new Map(theme.spots.map(spot=>[spot.placeId??spot.id,spot]))
   for(const spot of characters.spots){const key=spot.placeId??spot.id;const existing=spots.get(key);spots.set(key,existing?mergeSpot(existing,spot):spot)}
   return {...theme,title:'캐릭터·굿즈',description:'해리포터·포켓몬·스타워즈부터 치이카와·닌텐도까지. 체험과 굿즈 매장을 한곳에서 비교하세요.',spots:[...spots.values()],references:[...theme.references??[],...characters.references??[]]}
  }
  if(theme.id==='night-view'&&winter){
   const keyakizaka=winter.spots.find(spot=>spot.id==='keyakizaka')
   if(!keyakizaka)return theme
   const roppongi=theme.spots.find(spot=>spot.id==='roppongi-night')
   const merged=roppongi?mergeSpot(keyakizaka,roppongi):keyakizaka
   return {...theme,description:'도쿄의 야경과 겨울 일루미네이션을 모았습니다. 야외 산책과 유료 전망대를 구분해 골라보세요.',spots:[...theme.spots.filter(spot=>!['roppongi-night','keyakizaka'].includes(spot.id)),merged],references:[...theme.references??[],...winter.references??[]],caution:[theme.caution,winter.caution].filter(Boolean).join('\n')||undefined}
  }
  return theme
 })
}

export type ThemeSort='name'|'photo'
const names=new Intl.Collator('ko',{numeric:true,sensitivity:'base'})
export function sortThemeEntries<T extends {spot:ThemeSpot}>(entries:T[],sort:ThemeSort):T[] {
 return [...entries].sort((a,b)=>{
  if(sort==='photo'){const difference=Number(!!themePhotoId(b.spot))-Number(!!themePhotoId(a.spot));if(difference)return difference}
  return names.compare(a.spot.name,b.spot.name)||names.compare(a.spot.address,b.spot.address)||names.compare(a.spot.id,b.spot.id)
 })
}
