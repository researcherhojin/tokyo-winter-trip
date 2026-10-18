import { useState } from 'react'
import { photoById,placePhoto,placePhotoIds } from '../lib/photos'
import { ThemeGallery } from './ThemeImage'
import type { Photo } from '../lib/photos'

/** Same rule as theme cards: the whole photo over a blurred fill, never cropped. */
function WholeImage({photo,width,height,onError}:{photo:Photo;width:number;height:number;onError:()=>void}) {
 const [loaded,setLoaded] = useState(false)
 return <span className={`place-image photo-whole ${loaded?'is-loaded':''}`}>
  <img className="photo-fill" src={photo.src} alt="" aria-hidden="true" loading="lazy" decoding="async"/>
  <img className="photo-main" src={photo.src} alt={photo.alt} title={photo.caption} width={width} height={height} loading="lazy" decoding="async" ref={img=>{if(img?.complete&&img.naturalWidth&&!loaded)setLoaded(true)}} onLoad={()=>setLoaded(true)} onError={onError}/>
 </span>
}
export function PlaceThumbnail({placeId,photoId}:{placeId:string;photoId?:string}) {
 const [failed,setFailed] = useState(false)
 const photo = photoId ? photoById[photoId] : placePhoto(placeId)
 if (!photo || failed) return <span className="thumbnail-empty">위치 보기</span>
 return <span className="place-thumbnail"><WholeImage photo={photo} width={160} height={160} onError={() => setFailed(true)}/>{photo.reference&&<span className="place-thumbnail-tag">참고</span>}</span>
}
/** Author and license links. `qualifier` repeats the caption's date/scope part, so callers that already show the caption pass qualifier={false}. */
export function PhotoCredit({placeId,photoId,compact=false,qualifier:showQualifier=true}:{placeId:string;photoId?:string;compact?:boolean;qualifier?:boolean}) {
 const photo = photoId ? photoById[photoId] : placePhoto(placeId)
 if (!photo) return null
 const qualifier = photo.caption.includes(' · ') ? photo.caption.split(' · ').slice(1).join(' · ') : ''
 return <div className={`photo-provenance ${compact?'credit-compact':''}`}>
  {showQualifier && qualifier && <span className="photo-qualifier">{qualifier}</span>}
  <span className="photo-credit"><a href={photo.source} target="_blank" rel="noreferrer">© {photo.author || 'Wikimedia Commons'}</a><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></span>
 </div>
}
export default function PlacePhoto({placeId}:{placeId:string}) {
 const [failed,setFailed] = useState(false)
 const photo = placePhoto(placeId)
 const ids = placePhotoIds(placeId)
 if (!photo || failed) return null
 if (ids.length>1) return <div className="place-photo place-gallery"><ThemeGallery photoIds={ids}/></div>
 return <figure className="place-photo"><div className="place-photo-frame"><WholeImage photo={photo} width={960} height={600} onError={() => setFailed(true)}/>{photo.reference&&<span className="photo-reference-badge">{photo.reference.label}</span>}</div><figcaption>{photo.reference&&<span className="photo-reference-note">{photo.reference.difference}</span>}<span>{photo.caption}</span><PhotoCredit qualifier={false} placeId={placeId}/></figcaption></figure>
}
