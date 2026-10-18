import { days, places, checklist } from '../data/trip'
import { travelThemes } from '../data/themes'
import { suicaGuide, preparationSources, yoyogiSpot } from '../data/preparation'
import { validateCatalogEnvelope } from './catalogContract'
import type { CatalogData, CatalogEnvelope, CatalogResource, CatalogShape } from './catalogContract'
export type { CatalogData, CatalogEnvelope, CatalogResource, CatalogShape } from './catalogContract'
export { catalogPaths } from './catalogContract'

/** Every bundled catalog, for the server routes and tests. Client screens import only their own data. */
export const catalogData: CatalogShape = {
 trip: { days, places },
 themes: { themes: travelThemes },
 preparation: { checklist, suicaGuide, preparationSources, yoyogiSpot },
}
export function isCatalogEnvelope<K extends CatalogResource>(value: unknown, resource: K): value is CatalogEnvelope<K> {
 return validateCatalogEnvelope(value,resource,catalogData[resource] as CatalogData<K>,places)
}
