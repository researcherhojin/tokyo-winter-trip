import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { tripResponse } from './server/tripResponse'
import type { CatalogResource } from './src/shared/catalog'
export default defineConfig(({mode})=>({
 cacheDir:'node_modules/.vite-dev',
 server:{port:5173,strictPort:true},
 // The DOM tests evaluate one script; their build keeps every screen in one chunk while the real build lazy-loads screens.
 build:process.env.SINGLE_BUNDLE?{rolldownOptions:{output:{codeSplitting:false}}}:{},
 optimizeDeps:{entries:['index.html']},
 plugins:[react(),{
 name:'travel-read-api',
 configureServer(server){
  // Keep private Notion configuration inside Vite's server process.
  const token=loadEnv(mode,process.cwd(),'NOTION_API_TOKEN').NOTION_API_TOKEN
  server.middlewares.use(async(req,res,next)=>{
   const path=req.url?.split('?')[0]
   const resources:Record<string,CatalogResource>={'/api/catalog/trip':'trip','/api/catalog/themes':'themes','/api/catalog/preparation':'preparation'}
   const resource=path?resources[path]:undefined
   if(!resource&&path!=='/api/trip')return next()
   const request=new Request('http://127.0.0.1'+req.url,{method:req.method})
   // Load through the dev module graph so edited catalog data is served without restarting the server.
   const catalog=resource?await server.ssrLoadModule('/server/catalogResponse.ts') as typeof import('./server/catalogResponse'):undefined
   const response=resource&&catalog?catalog.catalogResponse(request,resource):req.method==='GET'?await tripResponse(token):new Response(null,{status:405,headers:{Allow:'GET'}})
   res.statusCode=response.status
   response.headers.forEach((value,key)=>res.setHeader(key,value))
   res.end(await response.text())
  })
 }
}]}))
