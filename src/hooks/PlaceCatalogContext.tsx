import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { placeById } from '../data/trip'
import type { Place } from '../data/trip'
const PlaceCatalogContext=createContext<Record<string,Place>>(placeById)
export function PlaceCatalogProvider({places,children}:{places:Place[];children:ReactNode}) {
 const value=useMemo(()=>Object.fromEntries(places.map(place=>[place.id,place])),[places])
 return <PlaceCatalogContext.Provider value={value}>{children}</PlaceCatalogContext.Provider>
}
export const usePlaces=()=>useContext(PlaceCatalogContext)
