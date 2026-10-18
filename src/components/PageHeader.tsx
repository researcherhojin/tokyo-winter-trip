import type { ReactNode } from 'react'

/** Shared heading for the trip's browsing and preparation workspaces. */
export default function PageHeader({title,description,children}:{title:string;description:string;children?:ReactNode}) {
 return <header className="page-heading"><div><p className="page-trip-dates">도쿄 여행 · 2026년 12월 11–15일</p><h1>{title}</h1><p className="page-description">{description}</p></div>{children&&<div className="page-heading-action">{children}</div>}</header>
}
