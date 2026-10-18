import { catalogData } from '../src/shared/catalog'
import type { CatalogResource } from '../src/shared/catalog'

/** Framework-neutral handler shared by local Vite and both deployment adapters. */
export function catalogResponse(request: Request, resource: CatalogResource): Response {
 const headers = { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'public, max-age=60, stale-while-revalidate=300', 'X-Content-Type-Options':'nosniff', Allow:'GET, HEAD' }
 if (!['GET','HEAD'].includes(request.method)) return Response.json({error:'읽기 전용 API입니다.'},{status:405,headers})
 return new Response(request.method==='HEAD'?null:JSON.stringify({schemaVersion:1,resource,source:'maintained-catalog',data:catalogData[resource]}),{headers})
}
