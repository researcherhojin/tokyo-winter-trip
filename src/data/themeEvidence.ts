/** Evidence now lives on each spot record in src/data/spots/*.json; this module only defines its shape. */
export interface ThemeEvidence {
 summary:string
 officialUrl:string|null
 photoPageUrl:string|null
 checkedAt:string
 photoNote:string
 verificationNote:string
 photoId?:string
 highlight?:string
}
