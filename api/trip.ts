import { env } from 'node:process'
import { tripResponse } from '../server/tripResponse.ts'
export default {
 fetch(request:Request):Promise<Response>|Response{
  if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}})
  return tripResponse(env.NOTION_API_TOKEN)
 }
}
