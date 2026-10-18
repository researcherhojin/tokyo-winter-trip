/** The single supported key variable. No process.env or alternative spelling. */
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
