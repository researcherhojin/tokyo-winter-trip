// Google official direct script loading and importLibrary; no Routes/Places APIs.
// https://developers.google.com/maps/documentation/javascript/load-maps-js-api
export type Position = { lat: number; lng: number }
export interface Bounds { extend(position: Position): void }
export interface MapInstance { fitBounds(bounds: Bounds, padding?: number | {top:number;right:number;bottom:number;left:number}): void; panTo(position: Position): void; setZoom(zoom: number): void }
export interface Marker { map: MapInstance | null; zIndex?: number }
export interface MapsLibrary { Map: new (element: HTMLElement, options: Record<string, unknown>) => MapInstance }
// LatLngBounds belongs to the core library, not maps.
export interface CoreLibrary { LatLngBounds: new () => Bounds }
export interface MarkerLibrary { AdvancedMarkerElement: new (options: { map: MapInstance; position: Position; content: HTMLElement; title: string; zIndex?: number }) => Marker }
interface GoogleMaps {
 importLibrary(name: 'maps'): Promise<MapsLibrary>
 importLibrary(name: 'core'): Promise<CoreLibrary>
 importLibrary(name: 'marker'): Promise<MarkerLibrary>
 event?: { clearInstanceListeners(instance: MapInstance): void }
}
declare global {
 interface Window {
  google?: { maps: GoogleMaps }
  initTokyoMap?: () => void
  gm_authFailure?: () => void
 }
}
export type MapFailure = 'network' | 'timeout' | 'auth' | 'initialization'
export class MapLoadError extends Error {
 readonly reason: MapFailure
 constructor(reason: MapFailure) { super(`Google Maps: ${reason}`); this.reason = reason }
}
let pending: Promise<void> | undefined
let authFailed = false
export function assertMapAuthorization() { if (authFailed) throw new MapLoadError('auth') }
export function loadGoogleMaps(key: string): Promise<void> {
 if (authFailed) return Promise.reject(new MapLoadError('auth'))
 if (window.google?.maps.importLibrary) return Promise.resolve()
 if (pending) return pending
 pending = new Promise((resolve, reject) => {
  const script = document.createElement('script')
  const fail = (reason: MapFailure) => { window.clearTimeout(timer); script.remove(); pending = undefined; reject(new MapLoadError(reason)) }
  // Leave time for slower mobile connections instead of treating a diagnostic ping as failure.
  const timer = window.setTimeout(() => fail('timeout'), 30000)
  window.initTokyoMap = () => { window.clearTimeout(timer); resolve() }
  window.gm_authFailure = () => {
   authFailed = true
   window.dispatchEvent(new Event('tokyo-map-auth-error'))
   fail('auth')
  }
  script.onerror = () => fail('network')
  script.async = true
  script.dataset.tokyoMaps = 'true'
  script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key: key.trim(), loading: 'async', callback: 'initTokyoMap', v: 'quarterly', language: 'ko', region: 'JP' })}`
  document.head.appendChild(script)
 })
 return pending
}
