/** Contact sheet for photo review: node scripts/contact-sheet.mjs <out.html> <file:label> ...  then screenshot it with Playwright. */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
const [out,...items]=process.argv.slice(2)
if(!out||!items.length){console.error('usage: node scripts/contact-sheet.mjs out.html image.jpg:label ...');process.exit(1)}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))
const cells=items.map(item=>{const i=item.lastIndexOf(':');const [file,label]=i>0?[item.slice(0,i),item.slice(i+1)]:[item,item];return `<figure><div><img src="file://${esc(resolve(file))}"></div><figcaption>${esc(label)}</figcaption></figure>`}).join('')
writeFileSync(out,`<!doctype html><meta charset="utf-8"><style>body{margin:12px;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}figure{margin:0}div{aspect-ratio:4/3;background:#222;display:grid;place-items:center}img{max-width:100%;max-height:100%;object-fit:contain}figcaption{padding:4px 0}</style>${cells}`)
console.log(out)
