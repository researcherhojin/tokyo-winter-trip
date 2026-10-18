import type { ThemeSpot } from '../data/themes'

const weekday:Record<string,string>={'12/11':'금','12/12':'토','12/13':'일','12/14':'월','12/15':'화'}
export interface TripClosure {date:string;day:string;label:string;certainty:'official'|'secondary'}
/** Closures that fall on the trip dates, kept as explicit audited data rather than parsed from free text. */
export function tripClosuresFor(spot:ThemeSpot):TripClosure[] {
 const list=spot.closures??[]
 return list.map(item=>({...item,day:weekday[item.date]??'',certainty:item.certainty==='official'?'official':'secondary'}))
}
const japaneseAreas:[RegExp,string][]=[[/中央区銀座/,'주오구 긴자'],[/墨田区押上/,'스미다구 오시아게'],[/港区芝公園/,'미나토구 시바코엔'],[/台東区浅草/,'다이토구 아사쿠사'],[/港区台場/,'미나토구 다이바'],[/稲城市矢野口/,'이나기시 야노쿠치'],[/練馬区春日町/,'네리마구 가스가초']]
/** Short area line for a card: ward/city and neighborhood without block numbers or building notes. */
export function areaLabel(spot:ThemeSpot):string|undefined {
 if(spot.kind==='product')return undefined
 const head=spot.address.split('·')[0].trim()
 if(/좌표/.test(head))return '공유 좌표 기준 위치'
 if(/확인 필요|미확인|→/.test(head))return '위치 확인 필요'
 const japanese=japaneseAreas.find(([pattern])=>pattern.test(head))
 if(japanese)return japanese[1]
 if(/^(도쿄도|가나가와현|지바현|치바현)\s/.test(head))return head.replace(/^(도쿄도|가나가와현|지바현|치바현)\s*/,'').split(/\s+/).filter(part=>!/^\d|[0-9]-|초메$/.test(part)).slice(0,2).join(' ')||undefined
 return /\d/.test(head)||head.length>24?undefined:head
}
