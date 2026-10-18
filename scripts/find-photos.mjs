for(const q of ['intitle:Studio intitle:Tokyo filetype:bitmap','intitle:Toshimaen intitle:Studio filetype:bitmap']){
 const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:q,gsrnamespace:'6',gsrlimit:'3',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'800'})
 const data=await(await fetch(url)).json();console.log(JSON.stringify({q,pages:Object.values(data.query?.pages??{}).map(p=>({title:p.title,url:p.imageinfo?.[0].descriptionurl,license:p.imageinfo?.[0].extmetadata.LicenseShortName?.value}))}))
}
