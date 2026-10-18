import { catalogResponse } from '../../../server/catalogResponse'
export function onRequest({request}:{request:Request}):Response { return catalogResponse(request,'preparation') }
