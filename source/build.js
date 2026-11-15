// Construit l'application installable (PWA) dans <repo>/docs à partir de declic-code.html.
const fs=require('fs');const path=require('path');const {chromium}=require('playwright');
const out=process.argv[2];if(!out)throw new Error('usage: node build.js <dossier de sortie>');
fs.mkdirSync(out,{recursive:true});
const page=fs.readFileSync(path.join(__dirname,'declic-code.html'),'utf8');
const head=`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Apprends JavaScript, Python et C# par leçons de 3 minutes, avec des mini-jeux.">
<meta name="theme-color" content="#f1f4fb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1226" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Déclic Code">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
</head>
<body>
`;
fs.writeFileSync(path.join(out,'index.html'),head+page+'\n</body>\n</html>\n');
fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({
  name:'Déclic Code',short_name:'Déclic Code',
  description:'Apprends JavaScript, Python et C# par leçons de 3 minutes, avec des mini-jeux.',
  lang:'fr',dir:'ltr',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',
  background_color:'#f1f4fb',theme_color:'#141a33',categories:['education'],
  icons:[
    {src:'icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
    {src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
    {src:'icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]
},null,2)+'\n');
const version='declic-code-'+require('crypto').createHash('sha1').update(page).digest('hex').slice(0,10);
fs.writeFileSync(path.join(out,'sw.js'),`// Service worker : rend l'application utilisable sans internet.
const CACHE='${version}';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!font)return;
  if(font){ // polices : cache d'abord
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));return res;})).catch(()=>Response.error()));
    return;
  }
  // fichiers de l'application : réseau d'abord (pour recevoir les mises à jour), cache si hors-ligne
  e.respondWith(fetch(r).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}
    return res;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||caches.match('index.html'))));
});
`);
// Icônes : fond bleu nuit plein cadre (compatible « maskable »), accolades jaunes.
const svg=(pad)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<rect width="512" height="512" fill="#141a33"/>
<g transform="translate(256 256) scale(${pad}) translate(-256 -256)" fill="none" stroke="#f2c230" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
<path d="M196 112c-44 0-56 22-56 60v36c0 30-12 48-40 48 28 0 40 18 40 48v36c0 38 12 60 56 60"/>
<path d="M316 112c44 0 56 22 56 60v36c0 30 12 48 40 48-28 0-40 18-40 48v36c0 38-12 60-56 60"/>
<circle cx="256" cy="256" r="20" fill="#f2c230" stroke="none"/>
</g></svg>`;
(async()=>{
  const br=await chromium.launch();
  for(const [name,size,pad] of [['icon-512.png',512,1],['icon-192.png',192,1],['apple-touch-icon.png',180,0.9],['icon-maskable-512.png',512,0.72]]){
    const pg=await br.newPage({viewport:{width:size,height:size}});
    await pg.setContent('<style>html,body{margin:0}svg{display:block;width:'+size+'px;height:'+size+'px}</style>'+svg(pad));
    await pg.screenshot({path:path.join(out,name)});await pg.close();}
  await br.close();console.log('built',out,version);
})();
