import { catalogPaths, validateCatalogEnvelope } from '../shared/catalogContract'
import type { CatalogData, CatalogResource } from '../shared/catalogContract'
import { places } from '../data/trip'

/** `baseline` is the bundled copy the reply is checked against; screens pass only their own resource. */
export async function fetchCatalog<K extends CatalogResource>(resource: K, baseline: CatalogData<K>, signal?: AbortSignal): Promise<CatalogData<K>> {
 const response = await fetch(catalogPaths[resource], {signal, headers:{Accept:'application/json'}})
 if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw Error('Catalog unavailable')
 const value: unknown = await response.json()
 if (!validateCatalogEnvelope(value,resource,baseline,places)) throw Error('Invalid catalog')
 return value.data
}
