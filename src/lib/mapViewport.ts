export interface MapPadding { top:number; right:number; bottom:number; left:number }
export function mapPadding(width:number,height:number,mode:'map'|'list'='list',expanded=false,desktop=width>800):MapPadding {
 // Desktop host is the map column beside the docked list, so only the toolbar (top) and controls (right) need room.
 if(desktop)return {top:72,right:72,bottom:80,left:56}
 const covered=mode==='map'?132:expanded?height-180:Math.round(height*.65)+16
 return {top:Math.min(144,Math.round(height*.24)),right:32,bottom:Math.max(32,Math.min(covered,height-240)),left:32}
}
