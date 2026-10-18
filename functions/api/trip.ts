import { tripResponse } from '../../server/tripResponse'
interface Context { env: { NOTION_API_TOKEN?: string } }
export async function onRequestGet({env}:Context):Promise<Response>{return tripResponse(env.NOTION_API_TOKEN)}
