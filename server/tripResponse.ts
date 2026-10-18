import { readNotionTrip } from './notion.ts'
import type { LiveTrip } from './notion.ts'
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
let cache:{token:string;data:LiveTrip;expires:number}|undefined
let pending:{token:string;promise:Promise<LiveTrip>}|undefined
export async function tripResponse(token?:string):Promise<Response>{
 if(!token)return Response.json({enabled:false},{headers})
 try{
  if(cache?.token===token&&cache.expires>Date.now())return Response.json(cache.data,{headers})
  if(!pending||pending.token!==token)pending={token,promise:readNotionTrip(token)}
  const current=pending
  try{const data=await current.promise;cache={token,data,expires:Date.now()+60000};return Response.json(data,{headers})}
  finally{if(pending===current)pending=undefined}
 }catch{return Response.json({enabled:true,error:'일정을 새로 확인하지 못했습니다. 마지막으로 확인한 일정을 유지합니다.'},{status:502,headers})}
}
