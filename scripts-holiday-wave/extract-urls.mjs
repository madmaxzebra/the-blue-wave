import fs from 'fs'
const h = fs.readFileSync('tmp-sambil-zara.html', 'utf8')
const urls = [...h.matchAll(/https?:[^"'\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0])
const unique = [...new Set(urls)]
console.log('total urls', unique.length)
const large = unique.filter((u) => /w_([5-9]\d{2,}|[1-9]\d{3,})/.test(u) || /fit\/w_2/.test(u))
console.log(large.join('\n'))
