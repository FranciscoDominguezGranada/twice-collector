/* ================= photohub.js ================= */
// =====================================================================================
//  PHOTOHUB · siempre hay foto. Reúne fotos de cada integrante desde varias fuentes abiertas y elige la más cercana a la era:
//    1) galerías de la era (Fandom: Kpop Wiki / TWICE Wiki)  2) Wikimedia Commons  3) Wikipedia (en/es/ko)  4) Openverse
//  Orden de preferencia: misma era → era cercana (±2 años) → cualquier foto de esa integrante.  Lo que no es de su era se marca con «≈».
//  (Bias Room es una app cerrada y sin API pública; eBay/Amazon/Google Imágenes no se pueden consultar desde el navegador: ver «Cambiar imagen».)
// =====================================================================================
(function(){
const PK='twicePH3',NAMES=CATALOG.members.map(m=>m.name),enc=encodeURIComponent,sleep=ms=>new Promise(r=>setTimeout(r,ms));
let st={};try{st=JSON.parse(localStorage.getItem(PK))||{}}catch(e){}st.pool=st.pool||{};st.t=st.t||{};
const persist=()=>{try{localStorage.setItem(PK,JSON.stringify(st))}catch(e){}};
const QUERY={Nayeon:'Nayeon TWICE',Jeongyeon:'Jeongyeon TWICE',Momo:'Momo Hirai TWICE',Sana:'Sana Minatozaki TWICE',Jihyo:'Jihyo TWICE',Mina:'Mina Myoui TWICE',Dahyun:'Dahyun TWICE',Chaeyoung:'Chaeyoung TWICE',Tzuyu:'Tzuyu TWICE'};
// ---- selección de foto: SIEMPRE por álbum/fecha de lanzamiento, nunca por azar ----
//  1) foto de la galería de ESE álbum (era exacta)  2) la más cercana en el tiempo (±12 meses = «near»; hasta ±36 = «approx»)
//  3) solo si no hay nada fechado y el ajuste «mostrar aproximadas» está activo: foto sin fecha («any»)
//  La elección se GUARDA por carta (st.pick): una carta no cambia de foto cada vez que llegan fotos nuevas; solo se sustituye si aparece una de mejor categoría.
const RANK={era:3,near:2,approx:1,any:0};
// MODO ESTRICTO (por defecto): una carta solo puede llevar una foto de la galería de SU álbum. Nada de fotos de otras épocas.
const strict=()=>data.strictPhotos!==false;
// misma imagen aunque cambie el tamaño de la miniatura o los parámetros
const fileName=u=>{try{const p=decodeURIComponent(String(u||'').replace(/[?#].*$/,'')).split('/').filter(Boolean);const ok=x=>/\.(jpe?g|png|webp|gif)$/i.test(x);for(let i=p.length-1;i>=0;i--){if(ok(p[i])&&!/^\d+px-/i.test(p[i]))return p[i].toLowerCase()}for(let i=p.length-1;i>=0;i--){if(ok(p[i]))return p[i].replace(/^\d+px-/i,'').toLowerCase()}return String(u).toLowerCase()}catch(e){return String(u||'').toLowerCase()}};
// misma imagen aunque cambie el servidor, la miniatura o los parámetros: se compara por nombre de archivo
const nk=u=>{const f=fileName(u);return /\.(jpe?g|png|webp|gif)$/.test(f)?'f:'+f.replace(/[\s_]+/g,'_'):String(u||'').toLowerCase()};
// huellas visuales (dHash) de las fotos descargadas: detectan la MISMA foto subida con otro nombre
const HK='twicePHash',BK='twicePHbad';let HS={},BAD=new Set();try{HS=JSON.parse(localStorage.getItem(HK)||'{}');BAD=new Set(JSON.parse(localStorage.getItem(BK)||'[]'))}catch(e){}
const BADNAME=/chibi|fan[ _-]?art|fanart|drawing|sketch|doodle|illustrat|cartoon|anime|screenshot|screencap|capture|vlive|v[ _-]?live|lightstick|light[ _-]?stick|logo|signature|autograph|ticket|poster|banner|icon|emoji|sticker|tweet|twitter|instagram|weibo|wallpaper|lockscreen|collage|meme|\bgif\b|pixel|render\b|transparent|\bedit\b|ibispaint|\bart\b|commission/i;
const hSave=()=>{try{localStorage.setItem(HK,JSON.stringify(HS));localStorage.setItem(BK,JSON.stringify([...BAD]))}catch(e){}};
async function dhash(src){try{const im=new Image();await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=src;setTimeout(j,8000)});const c=document.createElement('canvas');c.width=9;c.height=8;const x=c.getContext('2d');x.drawImage(im,0,0,9,8);const d=x.getImageData(0,0,9,8).data;let h='',bits=0,v=0;for(let y=0;y<8;y++)for(let i=0;i<8;i++){const g=k=>d[(y*9+k)*4]*.3+d[(y*9+k)*4+1]*.59+d[(y*9+k)*4+2]*.11;v=(v<<1)|(g(i)>g(i+1)?1:0);if(++bits===4){h+=v.toString(16);bits=0;v=0}}return h}catch(e){return null}}
const ham=(a,b)=>{let n=0;for(let i=0;i<a.length;i++){let x=parseInt(a[i],16)^parseInt(b[i],16);while(x){n+=x&1;x>>=1}}return n};
const albYM=t=>ym(albumMap[t]||'');
const _pc={};
function pool(name){const F=typeof fdm!=='undefined'?fdm:{},sig=(F._t||0)+'/'+Object.keys(F).length+'/'+((data.local||[]).length)+'|'+((typeof imgPool!=='undefined'?imgPool:{})[name]||[]).length+'|'+(st.pool[name]||[]).length+'|'+BAD.size;if(_pc[name]&&_pc[name].sig===sig)return _pc[name].v;
 const out=[];
 Object.entries(typeof fdm!=='undefined'?fdm:{}).forEach(([al,e])=>{if(al[0]==='_'||!e||!e.m)return;const y=albYM(al);(e.m[name]||[]).forEach(u=>out.push({u,al,ym:y||null,s:'Fandom (galería de la era)'}))});
 (data.local||[]).forEach(p=>{if(p.m===name)out.push({u:p.u,al:p.al,ym:albYM(p.al)||null,s:'Tus fotos importadas'})});
 ((typeof imgPool!=='undefined'?imgPool:{})[name]||[]).forEach(p=>out.push({u:p.url,al:null,ym:p.ym||null,s:'Wikimedia Commons'}));
 (st.pool[name]||[]).forEach(p=>out.push({u:p.u,al:null,ym:p.ym||(p.y?p.y*12+6:null),s:p.s}));
 const seen={};const v=out.filter(p=>p.u&&!BAD.has(nk(p.u))&&!BADNAME.test(fileName(p.u))&&!seen[nk(p.u)]&&(seen[nk(p.u)]=1));_pc[name]={sig,v};return v}
// lista ordenada de candidatas: foto del álbum (era) → cercanas en fecha (≤12 meses «near», ≤36 «approx») → sin fecha («any», solo si se permite)
function ranked(card){const P=pool(card.member);if(!P.length)return[];const h=hash(card.id.replace(/-b$/,'')),t=albYM(card.album)||(card.year?+card.year*12+6:0),out=[];
 const rot=(L,k)=>L.length?L.slice(k%L.length).concat(L.slice(0,k%L.length)):[];
 rot(P.filter(p=>p.al===card.album).sort((x,y)=>x.u<y.u?-1:1),h).forEach(p=>out.push({url:p.u,conf:'era',source:p.s}));
 if(strict())return out;
 if(t){const D=P.filter(p=>p.ym&&p.al!==card.album).map(p=>({p,d:Math.abs(p.ym-t)})).filter(x=>x.d<=36).sort((x,y)=>x.d-y.d||(x.p.u<y.p.u?-1:1));
  if(D.length){const m=D[0].d,top=D.filter(x=>x.d<=m+2),rest=D.filter(x=>x.d>m+2);rot(top,h).concat(rest).forEach(x=>out.push({url:x.p.u,conf:x.d<=12?'near':'approx',source:x.p.s}))}}
 if(data.showApprox!==false)rot(P.filter(p=>!p.ym).sort((x,y)=>x.u<y.u?-1:1),h).forEach(p=>out.push({url:p.u,conf:'any',source:p.s}));
 return out}
// La foto elegida se guarda por carta. NINGUNA foto se repite en toda la app: ni entre Serie A y B, ni entre integrantes, ni entre álbumes.
function pickIn(card,used){if(card.kind==='group')return null;
 const c=ranked(card).filter(x=>!used.has(nk(x.url)))[0]||null;st.pk=st.pk||{};const old=st.pk[card.id];
 if(old&&!used.has(nk(old.u))&&(!strict()||old.c==='era')&&(!c||RANK[old.c]>=RANK[c.conf])&&(data.showApprox!==false||RANK[old.c]>=2))return{url:old.u,conf:old.c,source:old.s};
 if(!c){if(old){delete st.pk[card.id]}return null}
 st.pk[card.id]={u:c.url,c:c.conf,s:c.source};clearTimeout(pick._t);pick._t=setTimeout(persist,1500);return c}
let _all=null;
// «sesión» de una foto: nombre de archivo sin integrante, álbum ni numeración (p. ej. «Page Two Concept»)
const STOP=/(photo|teaser|image|img|pic|picture|version|ver|official|hd|scaled|twice|group|member)/g;
function shootKey(u,m,al){if(/redd\.it|redditmedia/.test(u))return 'zzreddit';if(/^local:/.test(u))return 'zzlocal';let f=fileName(u).replace(/\.(jpe?g|png|webp|gif)$/,'');(ALIAS[m]||[m.toLowerCase()]).forEach(a=>{if(/^[a-z]+$/.test(a))f=f.replace(new RegExp(a,'g'),' ')});
 const na=norm(al||'');f=f.replace(/[\s_\-.()]+/g,'');if(na&&f.includes(na))f=f.replace(na,'');f=f.replace(STOP,'').replace(/[0-9]+/g,'').replace(/[\s_\-.()]+/g,'');return f||'x'}
const rankKey=k=>/concept/.test(k)?0:/teaser/.test(k)?1:/photobook|photo/.test(k)?3:2;
const fnum=(a,b)=>fileName(a).localeCompare(fileName(b),undefined,{numeric:true});
function assignAlbum(al,all,used,map,diag){const M=NAMES,A=all.filter(c=>c.v!=='b'),B=all.filter(c=>c.v==='b');
 const gal=n=>pool(n).filter(p=>p.al===al).map(p=>p.u).sort(fnum);
 const G={},K={};M.forEach(n=>{G[n]=gal(n).filter(u=>!used.has(nk(u)));K[n]={};G[n].forEach(u=>{const k=shootKey(u,n,al);(K[n][k]=K[n][k]||[]).push(u)})});
 // sesión principal = la que cubre a más integrantes (prefiere «concept», luego «teaser»)
 const cov={};M.forEach(n=>Object.keys(K[n]).forEach(k=>cov[k]=(cov[k]||0)+1));
 const order=Object.keys(cov).sort((x,y)=>cov[y]-cov[x]||rankKey(x)-rankKey(y)||(x<y?-1:1));const main=order[0]||null;
 const take=(c,u,conf,line)=>{if(!u)return;map[c.id]={url:u,conf,source:'Fandom (galería de la era)',line};used.add(nk(u))};
 const mainOf={};
 A.forEach(c=>{const n=c.member;let u=null;
  if(main&&K[n][main])u=K[n][main].find(x=>!used.has(nk(x)));
  if(!u){for(const k of order){if(K[n][k]){u=K[n][k].find(x=>!used.has(nk(x)));if(u)break}}}
  if(u){mainOf[n]=shootKey(u,n,al);take(c,u,'era','A')}else map[c.id]=null});
 // línea secundaria: fotos distintas (photobooks, teasers, otras sesiones); no hace falta cohesión
 B.forEach(c=>{const n=c.member;let u=null;
  const rest=G[n].filter(x=>!used.has(nk(x)));
  u=rest.find(x=>shootKey(x,n,al)!==mainOf[n])||rest[0]||null;
  if(u){take(c,u,'era','B');return}
  if(data.relaxB===true){const t=albYM(al);const near=pool(n).filter(p=>p.al!==al&&p.ym&&t&&Math.abs(p.ym-t)<=12&&!used.has(nk(p.u))).sort((x,y)=>Math.abs(x.ym-t)-Math.abs(y.ym-t)||fnum(x.u,y.u))[0];
   if(near){take(c,near.u,'near','B');return}}
  map[c.id]=null});
 if(diag)diag[al]={clave:main,principal:A.filter(c=>map[c.id]).length,secundaria:B.filter(c=>map[c.id]).length,total:M.length}}
// SIEMPRE hay foto: si el álbum no tiene suficientes, se busca la más cercana en el tiempo en cualquier fuente (galerías de otros álbumes, Commons, Wikipedia, Openverse); como último recurso, la portada del álbum
function fallbackFor(c,used){const P=pool(c.member),t=albYM(c.album)||(c.year?+c.year*12+6:0),cv=(typeof covers!=='undefined'&&covers[c.album])||null;
 const sc=p=>p.al===c.album?-1:(p.ym&&t?Math.abs(p.ym-t):9999);
 const L=P.filter(p=>!used.has(nk(p.u))).sort((x,y)=>sc(x)-sc(y)||(x.u<y.u?-1:1)),p=L[0];   // NUNCA se repite una foto
 if(p){const d=sc(p);return{url:p.u,conf:p.al===c.album?'era':d<=12?'near':d<=36?'approx':'any',source:p.s}}
 return cv?{url:cv,conf:'cover',source:'Portada del álbum (buscando foto)',reuse:true}:null}
function allPicks(){const sig=NAMES.reduce((n,x)=>n+pool(x).length+',','')+(data.showApprox!==false)+strict()+data.cards.length+'|'+((typeof fdm!=='undefined'&&fdm._t)||0)+'|'+BAD.size+(data.relaxB===true);if(_all&&_all.sig===sig)return _all;
 const used=new Set(),map={},grp={},byAl={},order=[],diag={};
 data.cards.forEach(c=>{if(c.ext)return;if(!byAl[c.album]){byAl[c.album]=[];order.push(c.album)}byAl[c.album].push(c)});
 order.forEach(al=>{assignAlbum(al,byAl[al].filter(c=>!c.kind),used,map,diag);
  const g=(((typeof fdm!=='undefined'?fdm:{})[al]||{}).g||[]).find(u=>!used.has(nk(u))&&!BAD.has(nk(u)));if(g){grp[al]=g;used.add(nk(g))}});
 // segunda pasada: lo que no tiene foto en su álbum se rellena DESPUÉS de que todos los álbumes hayan cogido las suyas (así un álbum no se come las fotos de otro)
 order.forEach(al=>{byAl[al].filter(c=>!c.kind).forEach(c=>{if(map[c.id])return;const r=fallbackFor(c,used);if(r){map[c.id]=r;if(!r.reuse)used.add(nk(r.url))}})});
 return _all={sig,map,grp,diag,order}}
function pick(card){if(card.kind==='group')return null;const m=allPicks().map;return card.id in m?m[card.id]:pickIn(card,new Set())}
const _gfPrev=typeof groupFor==='function'?groupFor:null;
if(_gfPrev)groupFor=function(al){return allPicks().grp[al]||_gfPrev(al)||(typeof covers!=='undefined'&&covers[al])||null};
// búsqueda a fondo de UN álbum (al abrir su página): fotos de cada integrante en las wikis de fans, solo si el nombre del archivo lleva el álbum y la integrante
const deepBusy={};
async function deep(al){if(!al||typeof wsearch!=='function'||typeof fdm==='undefined'||deepBusy[al])return;const o=fdm[al]=fdm[al]||{m:{},g:[]};o.m=o.m||{};o.g=o.g||[];
 if(o.d&&o.v===3&&Date.now()-o.d<7*864e5)return;deepBusy[al]=1;let n=0;const na=norm(al);
 try{for(const m of NAMES){if((o.m[m]||[]).length>=8)continue;
  for(const api of WIKIS)for(const qx of ['TWICE '+al+' '+m,m+' '+al+' photobook',m+' '+al+' teaser concept']){let ps=[];try{ps=await wsearch(api,qx)}catch(e){continue}
   for(const p of ps){const ii=(p.imageinfo||[])[0];if(!ii)continue;const t=p.title.toLowerCase(),u=ii.thumburl||ii.url;
    if(!/\.(jpe?g|png|webp)$/.test(t)||!hasAlb(t,na)||/logo|tracklist|album ?art|cover|jacket|lightstick|poster/.test(t)||BADNAME.test(t))continue;
    const ms=members.filter(x=>hasA(t,x));if(ms.length!==1||ms[0]!==m)continue;const l=o.m[m]=o.m[m]||[];if(!l.some(x=>nk(x)===nk(u))){l.push(u);n++}}
   await sleep(140)}}
  try{if(window.SRC)n+=await Promise.race([SRC.album(al,o),sleep(60000)])||0}catch(e){}
  o.d=Date.now();o.v=3;if(n)fdm._t=Math.max(Date.now(),(fdm._t||0)+1);try{localStorage.setItem('twiceFandom',JSON.stringify(fdm))}catch(e){}if(n)changed()}finally{deepBusy[al]=0}}
// ---- fotos LISTAS: descargadas y guardadas en el dispositivo. Un sobre solo reparte cartas con la foto ya lista (nunca «imagen pendiente»). ----
const OKK='twicePHok';let okS=new Set();try{okS=new Set(JSON.parse(localStorage.getItem(OKK)||'[]'))}catch(e){}
const okSave=()=>{try{localStorage.setItem(OKK,JSON.stringify([...okS]))}catch(e){}};
const urlOf=c=>{try{if(c.kind==='group')return groupFor(c.album)||null;if(c.kind==='cover')return(typeof covers!=='undefined'&&covers[c.album])||null;if(c.kind)return null;return(photoFor(c)||{}).url||null}catch(e){return null}};
const ready=c=>{if(!c||c.game||c.ext)return true;if(c.kind!=='group'&&c.kind!=='cover'){const r=pick(c);if(r&&r.conf==='cover')return false}const u=urlOf(c);return !!u&&okS.has(nk(u))};
const failQ=[];let nFail=0;
async function cacheCards(cs,onP){let d=0,n=0;failQ.length=0;const q=cs.slice(),w=async()=>{while(q.length){const c=q.shift(),u=urlOf(c);if(u){if(okS.has(nk(u)))n++;else{let s=null;try{s=await IC.load(u)}catch(e){}if(!s)failQ.push(u);if(s){okS.add(nk(u));n++;try{queueImg(u,false)}catch(e){}if(!HS[nk(u)]&&/^blob:|^data:/.test(s)){const hh=await dhash(s);if(hh)HS[nk(u)]=hh}}}}d++;if(onP)onP(d,cs.length)}};
 await Promise.all([w(),w(),w(),w()]);okSave();if(n>0&&navigator.onLine!==false&&failQ.length){failQ.forEach(u=>BAD.add(nk(u)));_all=null;nFail+=failQ.length;hSave()}return n}
const albCards=al=>data.cards.filter(c=>c.album===al&&!c.ext&&!c.game);
let prepBusy=false;
async function prepare(albums,onP){const L=[...new Set(albums)].filter(Boolean);let i=0,n=0;
 for(const al of L){if(onP)onP(i,L.length,al);try{await Promise.race([deep(al),sleep(40000)])}catch(e){}_all=null;n+=await cacheCards(albCards(al));for(let r=0;r<5;r++){const f0=nFail;if(!dedupe()&&nFail===f0)break;n+=await cacheCards(albCards(al))}i++;if(onP)onP(i,L.length,al)}hSave();return n}
async function fix(al){if(!al)return;try{await Promise.race([deep(al),sleep(40000)])}catch(e){}_all=null;await cacheCards(albCards(al));for(let r=0;r<5;r++){const f0=nFail;if(!dedupe()&&nFail===f0)break;await cacheCards(albCards(al))}hSave();changed()}
// si dos fotos elegidas son visualmente la misma (aunque tengan nombres distintos), se descarta la segunda y se elige otra
function dedupe(){const P=allPicks(),seen=[];let bad=0;for(const al of P.order){for(const c of data.cards.filter(c=>c.album===al&&!c.kind&&!c.ext)){const r=P.map[c.id];if(!r)continue;const k=nk(r.url),h=HS[k];if(!h)continue;if(seen.some(x=>x.k===k))continue;if(seen.some(x=>ham(x.h,h)<=4)){BAD.add(k);bad++}else seen.push({k,h})}}
 if(bad){hSave();_all=null}return bad}
async function prepareAll(onP){if(prepBusy)return 0;prepBusy=true;try{
 if(typeof loadFandom==='function'&&typeof fdm!=='undefined'&&!fdm._n)try{await loadFandom(true)}catch(e){}
 if(typeof loadCovers==='function')try{await loadCovers(false)}catch(e){}
 try{await Promise.race([warm(false),sleep(45000)])}catch(e){}
 const order=[];data.cards.forEach(c=>{if(!c.ext&&!c.game&&!order.includes(c.album))order.push(c.album)});return await prepare(order,onP)}finally{prepBusy=false}}
const readyCount=()=>{const cs=data.cards.filter(c=>!c.ext&&!c.game);return{n:cs.filter(ready).length,t:cs.length}};
// cualquier foto de una integrante (juegos, avatar, sobres de integrante)
function any(name,k=0){const P=pool(name);return P.length?P[(k+hash(name))%P.length].u:null}
// ---- fuentes ----
async function wikipedia(name){const out=[];for(const lang of['en','es']){try{const j=await(await fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${enc(QUERY[name])}&gsrlimit=6&prop=pageimages&piprop=thumbnail&pithumbsize=900`)).json();
  Object.values((j.query||{}).pages||{}).forEach(p=>{if(p.thumbnail&&p.title.toLowerCase().includes(name.toLowerCase().slice(0,5)))out.push({u:p.thumbnail.source,y:null,s:'Wikipedia'})})}catch(e){}await sleep(150)}return out}
async function openverse(name){try{const j=await(await fetch(`https://api.openverse.org/v1/images/?q=${enc(QUERY[name])}&page_size=24&mature=false`)).json();
  return(j.results||[]).filter(r=>/twice/i.test(r.title+' '+(r.tags||[]).map(t=>t.name).join(' '))&&r.thumbnail&&r.width>=500).map(r=>({u:r.thumbnail,y:(+String(r.created_on||'').slice(0,4))||null,s:'Openverse'})).slice(0,10)}catch(e){return[]}}
let timer=0;const changed=()=>{clearTimeout(timer);timer=setTimeout(()=>{persist();if(window.UI&&!document.querySelector('.packscene,.modal-bg')&&['collection','albums','home','packs','binder'].includes(UI.cur)){UI.keepScroll=true;UI.route()}},2500)};
let warming=false;
async function warm(force){if(warming)return;warming=true;try{
 const todo=NAMES.filter(n=>force||!(st.t[n]&&Date.now()-st.t[n]<7*864e5&&(st.pool[n]||[]).length));
 const worker=async()=>{while(todo.length){const name=todo.shift();const [w,o]=await Promise.all([wikipedia(name),openverse(name)]);const got=[...w,...o];if(got.length){st.pool[name]=got;changed()}st.t[name]=Date.now();persist()}};
 await Promise.all([worker(),worker(),worker()]);
 if(typeof loadImages==='function'&&!Object.keys(typeof imgPool!=='undefined'?imgPool:{}).length)try{await loadImages(false);changed()}catch(e){}
 if(typeof loadFandom==='function')try{await loadFandom(!!force);changed()}catch(e){}
 }finally{warming=false}}
// ---- photoFor: SIEMPRE devuelve foto si existe alguna de esa integrante ----
const _prev=photoFor;
window.photoFor=photoFor=function(card){if(card.ext)return _prev(card);const r=pick(card);return r?{url:r.url,conf:r.conf,source:r.source,d:0}:null};
if(data.photoAny==null){data.photoAny=1;data.showApprox=true;save()}
window.PH={nk,refresh:()=>{_all=null;Object.keys(_pc).forEach(k=>delete _pc[k])},fix,report:()=>allPicks().diag,pool,pick,any,warm,deep,strict,ready,prepare,prepareAll,readyCount,count:()=>NAMES.reduce((s,n)=>s+pool(n).length,0),counts:()=>Object.fromEntries(NAMES.map(n=>[n,pool(n).length]))};
if(data.phv!==3){data.phv=3;data.strictPhotos=false;save()}
// las fotos importadas viven en la base de datos del dispositivo: se hidratan con data-src
const _fhL=faceHTML;faceHTML=window.faceHTML=function(){let h=_fhL.apply(this,arguments);return typeof h==='string'&&h.includes('src="local:')?h.replace(/ src="(local:[^"]+)"/g,' data-src="$1"'):h};
(window.requestIdleCallback||(f=>setTimeout(f,1800)))(()=>warm(false),{timeout:4000});
setTimeout(()=>{if(navigator.onLine!==false)prepareAll().catch(()=>{})},7000);
})();
;
/* ================= sources.js ================= */
// v22.23 · Fuentes de fotos ampliadas: galerías COMPLETAS de las wikis de fans (sesiones enteras), Reddit (r/twice) y fotos propias importadas.
// Pinterest / Instagram / Tumblr no tienen acceso público desde un navegador (login, sin CORS, términos de uso): para esas, usa «Importar mis fotos».
(function(){
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),enc=encodeURIComponent;
const J=async u=>{const r=await fetch(u);if(!r.ok)throw 0;return r.json()};
const okFile=t=>/\.(jpe?g|png|webp)$/i.test(t);
const SKIP=/logo|tracklist|album ?art|cover|jacket|lightstick|poster|icon|flag|banner|button|template|signature|autograph|ticket|chibi|fan[ _-]?art|fanart|drawing|sketch|screenshot|screencap|capture|wallpaper|lockscreen|collage|meme|vlive|weibo|tweet|instagram|twitter/i;
const addTo=(o,m,u)=>{const l=o.m[m]=o.m[m]||[];const k=PH.nk(u);if(!l.some(x=>PH.nk(x)===k)){l.push(u);return 1}return 0};
// ---- 1) wikis de fans: páginas del álbum + subpáginas de galería → todas las imágenes con nombre de archivo ----
async function wikiAlbum(api,al,o){let n=0;const na=norm(al);
 let titles=[];try{const j=await J(`${api}?action=query&format=json&origin=*&list=search&srnamespace=0&srlimit=8&srsearch=${enc('TWICE '+al)}`);titles=((j.query||{}).search||[]).map(x=>x.title).filter(t=>norm(t).includes(na))}catch(e){return 0}
 titles=[...new Set(titles.flatMap(t=>[t,t+'/Gallery',t+'/Concept Photos',t+'/Photos']))].slice(0,24);if(!titles.length)return 0;
 let files=[];for(let i=0;i<titles.length;i+=8){try{const j=await J(`${api}?action=query&format=json&origin=*&prop=images&imlimit=500&titles=${enc(titles.slice(i,i+8).join('|'))}`);
   Object.values((j.query||{}).pages||{}).forEach(p=>(p.images||[]).forEach(im=>files.push(im.title)))}catch(e){}await sleep(120)}
 files=[...new Set(files)].filter(t=>okFile(t)&&!SKIP.test(t));
 for(let i=0;i<files.length;i+=40){let ps=[];try{const j=await J(`${api}?action=query&format=json&origin=*&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=900&titles=${enc(files.slice(i,i+40).join('|'))}`);ps=Object.values((j.query||{}).pages||{})}catch(e){continue}
  for(const p of ps){const ii=(p.imageinfo||[])[0];if(!ii||!/^image\/(jpeg|png|webp)/.test(ii.mime||'image/jpeg'))continue;if((ii.width||999)<380||(ii.height||999)<380)continue;
   const t=p.title.toLowerCase(),u=ii.thumburl||ii.url,ms=members.filter(x=>hasA(t,x));
   if(ms.length===1)n+=addTo(o,ms[0],u);else if(ms.length>=3||(isTw(t)&&!ms.length)){o.g=o.g||[];if(!o.g.some(x=>PH.nk(x)===PH.nk(u))){o.g.push(u);n++}}}
  await sleep(120)}
 return n}
// ---- 2) Reddit r/twice (JSON público): fotos que la comunidad titula con integrante + álbum ----
async function reddit(al,o){let n=0;const na=norm(al);
 for(const m of members){let L=[];try{const j=await J(`https://www.reddit.com/r/twice/search.json?q=${enc(m+' '+al)}&restrict_sr=1&sort=relevance&limit=40&raw_json=1`);L=((j.data||{}).children||[]).map(c=>c.data)}catch(e){continue}
  for(const d of L){if(!d||d.over_18)continue;const t=(d.title||'').toLowerCase(),nt=norm(t);if(!hasA(t,m)||!nt.includes(na))continue;if(members.filter(x=>hasA(t,x)).length!==1)continue;
   let u=/\.(jpe?g|png|webp)(\?|$)/i.test(d.url||'')&&/redd\.it|redditmedia/.test(d.url)?d.url:null;
   if(!u&&d.post_hint==='image'&&d.preview&&d.preview.images&&d.preview.images[0]&&d.preview.images[0].source)u=d.preview.images[0].source.url;
   if(u){const w=(d.preview&&d.preview.images&&d.preview.images[0]&&d.preview.images[0].source||{}).width||999;if(w>=500)n+=addTo(o,m,u)}}
  await sleep(250)}
 return n}
window.SRC={async album(al,o){let n=0;for(const api of WIKIS){try{n+=await wikiAlbum(api,al,o)}catch(e){}}try{n+=await reddit(al,o)}catch(e){}return n}};
// ---- 3) fotos propias (Pinterest, Instagram, Tumblr, tu galería…): se importan, se reducen y se guardan en el dispositivo ----
const resize=f=>new Promise(res=>{const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const k=Math.min(1,1000/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>res(b),'image/jpeg',.88)};im.onerror=()=>{URL.revokeObjectURL(u);res(null)};im.src=u});
window.PHOTO_IMPORT=async function(files,onP){data.local=data.local||[];const albs=[...new Set(data.cards.filter(c=>!c.ext&&!c.game).map(c=>c.album))].sort((a,b)=>norm(b).length-norm(a).length);let ok=0,skip=0,i=0;
 for(const f of files){i++;if(onP)onP(i,files.length);const t=f.name.toLowerCase(),nt=norm(f.name.replace(/\.[a-z0-9]+$/i,''));
  const al=albs.find(a=>nt.includes(norm(a))),ms=members.filter(m=>hasA(t,m));if(!al||ms.length!==1){skip++;continue}
  const b=await resize(f);if(!b){skip++;continue}const key='local:'+Date.now().toString(36)+'_'+i+'_'+f.name.replace(/[^a-z0-9._-]/gi,'_');
  try{await IC.put('img:'+key,b)}catch(e){skip++;continue}data.local.push({u:key,al,m:ms[0]});ok++}
 save();try{PH.refresh&&PH.refresh()}catch(e){}return{ok,skip}};
})();
;
/* ================= albumart.js ================= */
// =====================================================================================
//  ALBUMART · portada y contraportada de cada álbum (solo exterior). Siempre hay imagen:
//   portada:      tu imagen → Cover Art Archive (Internet Archive) → Discogs (si hay token) → iTunes/Deezer → generada
//   contraportada:tu imagen → Cover Art Archive → Discogs (si hay token) → generada con el tracklist real y el código de barras real
//  eBay / Amazon / Google Imágenes no se pueden consultar desde una web sin servidor: busca la imagen allí y pégala con «Cambiar imagen».
// =====================================================================================
(function(){
const enc=encodeURIComponent,sleep=ms=>new Promise(r=>setTimeout(r,ms)),K='twiceAArt2',O='twiceAOvr',TK='twiceTracks';
const J=(k)=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch(e){return{}}},W=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let cache=J(K),ovr=J(O),trk=J(TK);const mem={};
// ---- MusicBrainz (1 petición/s) ----
const MB='https://musicbrainz.org/ws/2/';let last=0;
async function mb(u){const w=Math.max(0,1150-(Date.now()-last));if(w)await sleep(w);last=Date.now();const r=await fetch(u,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('MB '+r.status);return r.json()}
const lq=s=>s.replace(/([+\-&|!(){}\[\]^"~*?:\\\/])/g,'\\$1');
async function fromCAA(a){const out={};const j=await mb(MB+'release-group?fmt=json&limit=10&query='+enc(`releasegroup:"${lq(a.title)}" AND artist:twice`)),n=catNorm(a.title);
 const cand=(j['release-groups']||[]).filter(g=>(g['artist-credit']||[]).some(c=>/twice/i.test(c.name||(c.artist||{}).name||''))).map(g=>({g,s:catNorm(g.title)})),ay=+(a.release.v||'').slice(0,4)||null,okY=(o,t)=>{const y=+String(o.g['first-release-date']||'').slice(0,4);return !y||!ay||Math.abs(y-ay)<=t},
 g=(cand.find(o=>o.s===n&&okY(o,2))||cand.find(o=>o.s.startsWith(n)&&!/^\d/.test(o.s.slice(n.length))&&okY(o,1))||{}).g;if(!g)return out;
 const rj=await mb(MB+'release?fmt=json&limit=100&release-group='+g.id),rels=(rj.releases||[]);
 out.barcode=(rels.find(r=>/^\d{12,13}$/.test(r.barcode||''))||{}).barcode||null;
 const withArt=rels.filter(r=>((r['cover-art-archive']||{}).count||0)>0).sort((x,y)=>(y['cover-art-archive'].back?1:0)-(x['cover-art-archive'].back?1:0)||y['cover-art-archive'].count-x['cover-art-archive'].count);
 for(const r of withArt.slice(0,2)){try{const cj=await(await fetch('https://coverartarchive.org/release/'+r.id)).json(),im=(cj.images||[]),pick=t=>{const x=im.find(i=>(i.types||[]).includes(t));if(!x)return null;const th=x.thumbnails||{};return th['1200']||th.large||x.image};
  if(!out.front)out.front=pick('Front');if(!out.back)out.back=pick('Back');if(out.front&&out.back)break}catch(e){}}
 if(out.front)out.frontSrc='Cover Art Archive';if(out.back)out.backSrc='Cover Art Archive';return out}
async function fromDiscogs(a){const tok=localStorage.getItem('twiceDiscogs');if(!tok)return{};try{const j=await(await fetch(`https://api.discogs.com/database/search?type=release&artist=TWICE&release_title=${enc(a.title)}&per_page=5&token=${enc(tok)}`)).json();
 for(const r of(j.results||[]).slice(0,3)){const d=await(await fetch(`https://api.discogs.com/releases/${r.id}?token=${enc(tok)}`)).json(),im=(d.images||[]);const fr=im.find(i=>i.type==='primary')||im[0],bk=im.filter(i=>i.type==='secondary')[1]||im[1];
  if(fr)return{front:fr.uri,back:bk&&bk.uri,frontSrc:'Discogs',backSrc:bk?'Discogs':null}}}catch(e){}return{}}
// ---- tracklist real (iTunes / Deezer) para la contraportada generada ----
let jn=0;const jsonp=u=>new Promise((res,rej)=>{const cb='__aa'+(jn++),s=document.createElement('script'),t=setTimeout(()=>{window[cb]=()=>{};s.remove();rej()},8000);window[cb]=d=>{clearTimeout(t);window[cb]=()=>{};s.remove();res(d)};s.onerror=()=>{clearTimeout(t);rej()};s.src=u+(u.includes('?')?'&':'?')+'callback='+cb;document.head.appendChild(s)});
async function tracksFor(title){if(trk[title])return trk[title];const id=(typeof albIds!=='undefined'?albIds:{})[title];if(!id)return[];let l=[];try{
 if(id.startsWith('it:')){const j=await jsonp('https://itunes.apple.com/lookup?entity=song&limit=60&id='+id.slice(3));l=(j.results||[]).filter(x=>x.wrapperType==='track').sort((a,b)=>(a.discNumber-b.discNumber)||(a.trackNumber-b.trackNumber)).map(x=>({n:x.trackName,p:x.previewUrl||''}))}
 else{const j=await jsonp('https://api.deezer.com/album/'+id.slice(3)+'/tracks?output=jsonp');l=(j.data||[]).map(x=>({n:x.title,p:x.preview||''}))}}catch(e){}
 if(l.length){trk[title]=l;W(TK,trk)}return l}
// ---- EAN-13 real ----
const L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'],G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'],R=L.map(s=>s.replace(/./g,c=>c==='0'?'1':'0')),P=['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
function ean(code){const d=code.padStart(13,'0').split('').map(Number),p=P[d[0]];let s='101';for(let i=1;i<7;i++)s+=(p[i-1]==='L'?L:G)[d[i]];s+='01010';for(let i=7;i<13;i++)s+=R[d[i]];return s+'101'}
// ---- imágenes generadas (siempre hay algo) ----
const hue=t=>[...t].reduce((h,c)=>(h*31+c.charCodeAt(0))%360,0);
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function genFront(a){const c=cv(600,600),x=c.getContext('2d'),h=hue(a.title),g=x.createLinearGradient(0,0,600,600);g.addColorStop(0,`hsl(${h},65%,58%)`);g.addColorStop(1,`hsl(${(h+50)%360},55%,22%)`);x.fillStyle=g;x.fillRect(0,0,600,600);
 for(let k=0;k<5;k++){x.strokeStyle=`hsla(${(h+k*30)%360},90%,85%,.3)`;x.lineWidth=16;x.beginPath();x.arc(300,330,60+k*44,0,7);x.stroke()}
 x.fillStyle='#fff';x.textAlign='center';x.font='700 84px Fredoka,Poppins,sans-serif';x.fillText('TWICE',300,150);x.font=`700 ${a.title.length>16?40:54}px Fredoka,Poppins,sans-serif`;x.fillText(a.title,300,540);return c.toDataURL('image/jpeg',.85)}
function genBack(a,tracks,barcode,dom){const w=600,ar=catPackaging(a).ar>1?1:Math.max(.7,catPackaging(a).ar),h=Math.round(w/ar),c=cv(w,h),x=c.getContext('2d'),hh=hue(a.title);
 const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,dom||`hsl(${hh},40%,26%)`);g.addColorStop(1,'#0c0612');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<9;i++){x.beginPath();x.arc(w*.8,h*.18,40+i*26,0,7);x.stroke()}
 x.fillStyle='#fff';x.textAlign='left';x.font='700 44px Fredoka,Poppins,sans-serif';x.fillText('TWICE',36,78);x.font='600 26px Poppins,sans-serif';x.fillStyle='#ffd9c2';x.fillText(a.title.length>30?a.title.slice(0,29)+'…':a.title,36,116);
 x.font='500 19px Poppins,sans-serif';x.fillStyle='#fff';const T=(tracks&&tracks.length?tracks:[{n:'Tracklist no disponible'}]).slice(0,16),cols=T.length>8?2:1,per=Math.ceil(T.length/cols);
 T.forEach((t,i)=>{const col=Math.floor(i/per),row=i%per,xx=36+col*270,yy=170+row*30;x.fillStyle='#ff8cc0';x.fillText(String(i+1).padStart(2,'0'),xx,yy);x.fillStyle='#fff';const n=t.n.length>(cols>1?20:34)?t.n.slice(0,cols>1?19:33)+'…':t.n;x.fillText(n,xx+34,yy)});
 if(barcode){const bits=ean(barcode),bw=2.4,bx=w-36-bits.length*bw-14,by=h-134;x.fillStyle='#fff';x.fillRect(bx-8,by-10,bits.length*bw+30,112);x.fillStyle='#000';for(let i=0;i<bits.length;i++)if(bits[i]==='1')x.fillRect(bx+8+i*bw,by,bw,84);x.font='500 14px monospace';x.textAlign='center';x.fillStyle='#000';x.fillText(barcode.replace(/^(\d)(\d{6})(\d{6})$/,'$1 $2 $3'),bx-8+(bits.length*bw+30)/2,by+100)}
 x.textAlign='left';x.font='400 12px Poppins,sans-serif';x.fillStyle='#ffffffaa';x.fillText('Contraportada generada con los datos del álbum',36,h-18);return c.toDataURL('image/jpeg',.88)}
// ---- API ----
function get(a){const c=cache[a.id]||{},o=ovr[a.id]||{},m=mem[a.id]||{};
 const cov=(typeof covers!=='undefined'?covers:{})[a.title]?covS(covers[a.title],600):null;
 const front=o.front||c.front||cov||(m.gf||(m.gf=genFront(a))),frontSrc=o.front?'Tu imagen':c.front?c.frontSrc:cov?'Portada digital (iTunes/Deezer)':'Generada';
 const scanF=!!(o.front||c.front);
 const back=o.back||c.back||(m.gb||(m.gb=genBack(a,trk[a.title],c.barcode,m.dom))),backSrc=o.back?'Tu imagen':c.back?c.backSrc:'Generada con el tracklist'+(c.barcode?' y el código de barras reales':''),backGen=!(o.back||c.back);
 return{front,back,frontSrc,backSrc,backGen,scanFront:scanF,scanBack:!backGen,barcode:c.barcode||null}}
const inflight={};
function load(a){if(inflight[a.id])return inflight[a.id];return inflight[a.id]=(async()=>{const c=cache[a.id];const fresh=c&&c.t&&Date.now()-c.t<14*864e5;
 if(!fresh){let r={};try{r=await fromCAA(a)}catch(e){}if(!r.front||!r.back){const d=await fromDiscogs(a);r={...d,...r,front:r.front||d.front,frontSrc:r.front?r.frontSrc:d.frontSrc,back:r.back||d.back,backSrc:r.back?r.backSrc:d.backSrc}}
  cache[a.id]={front:r.front||null,back:r.back||null,frontSrc:r.frontSrc||null,backSrc:r.backSrc||null,barcode:r.barcode||null,t:Date.now()};W(K,cache)}
 await tracksFor(a.title);delete (mem[a.id]||{}).gb;sync();return get(a)})().finally(()=>{delete inflight[a.id]})}
function setOverride(a,which,url){ovr[a.id]=ovr[a.id]||{};if(url)ovr[a.id][which]=url;else delete ovr[a.id][which];W(O,ovr)}
// reducir una imagen subida (archivo) a ≤900 px y guardarla como dataURL
function fromFile(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,900/Math.max(im.width,im.height)),c=cv(Math.round(im.width*k),Math.round(im.height*k));c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85))};im.onerror=rej;im.src=fr.result};fr.onerror=rej;fr.readAsDataURL(file)})}
function dims(url){return new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth/i.naturalHeight);i.onerror=()=>r(null);i.src=url})}
// ---- UNA sola portada por álbum: lo que ve el álbum 3D (tu imagen > Cover Art Archive) es también lo que usan dorsos de cartas, fundas vacías, sobres y álbum de cromos ----
function sync(){if(typeof covers==='undefined')return;catVisibleAlbums().forEach(a=>{const u=(ovr[a.id]||{}).front||(cache[a.id]||{}).front;if(u)covers[a.title]=u});try{localStorage.setItem('twiceCovers2',JSON.stringify(covers))}catch(e){}}
window.__syncCovers=sync;sync();
window.AlbumArt={get,load,setOverride:(a,w,u)=>{setOverride(a,w,u);sync()},fromFile,dims,tracksFor,genBack,sync};
// precarga suave de las portadas de los álbumes que tienes
setTimeout(async()=>{const mine=catVisibleAlbums().filter(a=>a.physical!==false&&data.cards.some(c=>c.album===a.title&&data.owned[c.id])).slice(0,8);for(const a of mine){await load(a).catch(()=>{});await sleep(300)}},6000);
})();
;
