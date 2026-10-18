/** Refresh only development pages restored from BFCache, whose Vite HMR socket is stale. */
export function refreshDevelopmentPageOnRestore(target: Window, reload = () => target.location.reload()) {
 const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) reload() }
 target.addEventListener('pageshow', onPageShow)
 return () => target.removeEventListener('pageshow', onPageShow)
}
