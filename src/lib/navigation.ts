export type PageView = 'trip' | 'themes' | 'checklist'
export function readNavigation() {
 const query = new URLSearchParams(location.search)
 const value = query.get('day')
 const number = Number(value)
 const day = value === 'all' ? 0 : Number.isInteger(number) && number >= 1 && number <= 5 ? number : 1
 const view = query.get('view')
 const page: PageView = view === 'themes' || view === 'checklist' ? view : 'trip'
 return {day, page}
}
export function writeNavigation(page: PageView, day: number) {
 const url = new URL(location.href)
 url.searchParams.set('day', day ? String(day) : 'all')
 if (page === 'trip') url.searchParams.delete('view')
 else url.searchParams.set('view', page)
 if (url.href !== location.href) history.pushState(null, '', url)
}
