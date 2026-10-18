import details from './itineraryDetails.json'
export interface StopGuide {
 purpose:string
 steps:string[]
 checks:string[]
 next:string
 sources:{title:string;url:string}[]
 checkedAt:string
}
export const itineraryDetails:Record<string,StopGuide>=details
