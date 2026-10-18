import { catalogResponse } from '../../server/catalogResponse.ts'
export default { fetch(request:Request):Response { return catalogResponse(request,'themes') } }
