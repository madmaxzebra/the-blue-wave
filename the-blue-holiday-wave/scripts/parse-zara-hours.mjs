import fs from 'fs'
const h = fs.readFileSync('tmp-zara-store.html', 'utf8')
const idx = h.indexOf('"openingHours":{"schedule"')
const chunk = h.slice(idx, idx + 2500)
const end = chunk.indexOf('},"sections"')
const jsonStr = '{' + chunk.slice(0, end) + '}'
const data = JSON.parse(jsonStr)
console.log(JSON.stringify(data, null, 2))
const addr = h.match(/"address":"([^"]+)"/)
console.log('address', addr?.[1])
