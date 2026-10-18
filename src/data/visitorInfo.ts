import { placeById } from './trip'
import type { ThemeSpot } from './themes'
export interface VisitorInfo {hours:string;closed:string;admission:string;checkedAt:string;sourceUrl:string|null;note?:string}
export function visitorInfoFor(spot:ThemeSpot):VisitorInfo {
 if(spot.visitorInfo)return spot.visitorInfo
 const place=spot.placeId?placeById[spot.placeId]:undefined
 if(place)return {hours:place.hours,closed:'방문일 임시 휴업·운영 캘린더 확인',admission:place.booking,checkedAt:place.checkedAt,sourceUrl:place.url}
 const product=spot.kind==='product'
 return {hours:product?'판매점별 영업시간·상품 재고 확인':'공식 운영시간 확인 필요',closed:product?'판매점별 휴무 확인':'공식 정기휴무 안내 미확인',admission:product?'가격·판매 기간은 제품별 확인':'이용 조건 공식 확인 필요',checkedAt:'2026-10-18',sourceUrl:spot.evidence?.officialUrl??spot.officialUrl??null}
}
