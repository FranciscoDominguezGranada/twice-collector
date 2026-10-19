/* ================= mascot.js ================= */
// =====================================================================================
//  MASCOTAS · personajes originales del juego (una por miembro): gota de peluche con brote de estrella.
//  Arte vectorial propio; el color de cada una es el de su miembro en el juego. No son personajes oficiales.
// =====================================================================================
(function(){
const COL={nayeon:['#8fd3ea','#e8607a','NY'],jeongyeon:['#8fe03c','#e8607a','JY'],momo:['#ff9bbd','#e8607a','MO'],sana:['#a77be2','#e8607a','SA'],jihyo:['#ffd236','#e8607a','JH'],mina:['#4fd9c9','#e8607a','MI'],dahyun:['#f1ecf7','#e8607a','DH'],chaeyoung:['#ee3b46','#e8607a','CY'],tzuyu:['#3b78e0','#e8607a','TZ']};
const key=n=>String(n||'').toLowerCase().replace(/[^a-z]/g,'');
function mix(h,t,a){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(h),B=p(t);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*a).toString(16).padStart(2,'0')).join('')}
const color=n=>(COL[key(n)]||['#ff9bc2'])[0];
const STAR='M0 -9L2.6 -3 9 -2.6 4.2 1.6 5.6 8 0 4.6 -5.6 8 -4.2 1.6 -9 -2.6 -2.6 -3Z';
function eyes(m){const y=57,L=36,R=64,ink='#2a1d30';
 if(m==='sleep'||m==='tired')return`<path d="M30 ${y}Q${L} ${y+5} 42 ${y}M58 ${y}Q${R} ${y+5} 70 ${y}" stroke="${ink}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
 if(m==='happy')return`<path d="M30 ${y+2}Q${L} ${y-7} 42 ${y+2}M58 ${y+2}Q${R} ${y-7} 70 ${y+2}" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 if(m==='sick')return`<path d="M31 ${y-4}l10 8m0-8l-10 8M59 ${y-4}l10 8m0-8l-10 8" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
 const e=x=>`<ellipse cx="${x}" cy="${y}" rx="6.2" ry="8" fill="${ink}"/><circle cx="${x-2}" cy="${y-3}" r="2.4" fill="#fff"/><circle cx="${x+2}" cy="${y+3}" r="1.1" fill="#fff"/>`;
 return e(L)+e(R)+(m==='sad'||m==='hungry'?`<path d="M${L-2} ${y+10}q-2 6 0 8" stroke="#6fc4ff" stroke-width="2" fill="none" stroke-linecap="round"/>`:'')}
function mouth(m){const y=70,c='#7a3a48';
 if(m==='happy')return`<path d="M44 ${y-1}Q50 ${y+8} 56 ${y-1}Z" fill="#8b2a3a"/>`;
 if(m==='sad'||m==='hungry'||m==='sick')return`<path d="M45 ${y+4}Q50 ${y-1} 55 ${y+4}" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
 if(m==='sleep')return`<ellipse cx="50" cy="${y+2}" rx="2" ry="1.6" fill="${c}"/>`;
 return`<path d="M45 ${y}Q47.5 ${y+3.4} 50 ${y}Q52.5 ${y+3.4} 55 ${y}" stroke="${c}" stroke-width="1.9" fill="none" stroke-linecap="round"/>`}
function hat(o){
 if(o==='party')return`<path d="M50 -18L36 18L64 18Z" fill="#ff5fa2" stroke="#b22a6a" stroke-width="1.5"/><circle cx="50" cy="-19" r="4" fill="#ffd23f"/><circle cx="44" cy="8" r="2.2" fill="#fff"/><circle cx="55" cy="0" r="2.2" fill="#fff"/>`;
 if(o==='witch')return`<ellipse cx="50" cy="18" rx="30" ry="6" fill="#2a1040"/><path d="M50 -22L36 18L64 18Z" fill="#3b1d6b"/><rect x="38" y="10" width="24" height="4" fill="#ffd23f"/>`;
 if(o==='santa')return`<path d="M32 20Q50 -20 68 20Z" fill="#e0243a"/><rect x="30" y="17" width="40" height="8" rx="4" fill="#fff"/><circle cx="66" cy="-2" r="5" fill="#fff"/>`;
 return''}
function bodyAcc(o){
 if(o==='jacket')return`<path d="M30 80Q50 96 70 80L72 100Q50 108 28 100Z" fill="#2b2a33" opacity=".92"/><path d="M50 88L50 104" stroke="#fff" stroke-width="2"/>`;
 if(o==='gala')return`<path d="M38 84l12 7 12-7-4 14H42z" fill="#ffc23d"/><circle cx="50" cy="89" r="3" fill="#fff6c0"/>`;
 if(o==='cake')return`<g transform="translate(70 92)"><rect x="0" y="6" width="22" height="10" rx="2" fill="#fcc89b"/><rect x="0" y="6" width="22" height="4" fill="#ff8cc0"/><rect x="10" y="-4" width="2.4" height="10" fill="#fff"/><path d="M11.2 -9q2 3 0 5q-2-2 0-5z" fill="#ffb02e"/></g>`;
 return''}
function formAcc(f,c){
 if(f==='legend'||f==='star')return`<path d="M38 0l5 8 7-9 7 9 5-8 2 14H36z" fill="#ffc23d" stroke="#b8860b" stroke-width="1.4"/>`;
 if(f==='dancer')return`<text x="82" y="22" font-size="20" fill="${c}">♪</text>`;
 if(f==='dreamer')return`<path d="M80 6a10 10 0 1 0 8 14a8 8 0 1 1-8-14z" fill="#7a8bff"/>`;
 if(f==='rebel')return`<path d="M16 38Q50 22 84 38L84 45Q50 31 16 45Z" fill="#d33"/>`;
 if(f==='idol')return`<g transform="translate(82 78) rotate(20)"><rect x="-3" y="0" width="6" height="16" rx="3" fill="#888"/><circle cx="0" cy="-3" r="7" fill="#ddd" stroke="#666" stroke-width="1.4"/></g>`;
 return''}
const VB='-10 -26 120 146';
function svg(name,o={}){
 const [c,,ini]=COL[key(name)]||['#ff9bc2','#e8607a','?'],dk=mix(c,'#000000',.3),lt=mix(c,'#ffffff',.55),ln=mix(c,'#000000',.45),id='m'+key(name);
 const st=o.stage||'adult',m=o.mood||'ok',b=(o.frame||0)%2?0:-2;
 const defs=`<defs><radialGradient id="${id}" cx=".35" cy=".28" r=".95"><stop offset="0" stop-color="${lt}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${dk}"/></radialGradient></defs>`;
 if(st==='egg')return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">${defs}<g transform="translate(0 ${b*.5})"><ellipse cx="50" cy="64" rx="34" ry="44" fill="url(#${id})" stroke="${ln}" stroke-width="2"/><g fill="#fff" opacity=".85"><path transform="translate(38 50) scale(.9)" d="${STAR}"/><path transform="translate(62 72) scale(.7)" d="${STAR}"/><path transform="translate(44 88) scale(.55)" d="${STAR}"/></g><ellipse cx="38" cy="36" rx="8" ry="14" fill="#fff" opacity=".35" transform="rotate(25 38 36)"/></g></svg>`;
 const S={baby:.62,child:.78,teen:.9,adult:1}[st]||1,hatOn=['party','witch','santa'].includes(o.outfit),crown=o.form==='legend'||o.form==='star';
 let g=`<g transform="translate(50 106) scale(${S}) translate(-50 -106) translate(0 ${b})">
  <ellipse cx="36" cy="105" rx="10" ry="5.5" fill="${dk}" stroke="${ln}" stroke-width="1.4"/><ellipse cx="64" cy="105" rx="10" ry="5.5" fill="${dk}" stroke="${ln}" stroke-width="1.4"/>
  <g transform="rotate(${m==='happy'||m==='call'?-30:-8} 14 74)"><ellipse cx="11" cy="80" rx="7" ry="10" fill="url(#${id})" stroke="${ln}" stroke-width="1.5"/></g><g transform="rotate(${m==='happy'||m==='call'?30:8} 86 74)"><ellipse cx="89" cy="80" rx="7" ry="10" fill="url(#${id})" stroke="${ln}" stroke-width="1.5"/></g>
  ${hatOn||crown?'':`<path d="M50 16Q50 6 50 4" stroke="${ln}" stroke-width="2.2" fill="none"/><g transform="translate(50 -2) scale(1.1)"><path d="${STAR}" fill="#ffd84a" stroke="#b8860b" stroke-width="1.2"/></g>`}
  <path d="M50 14C75 14 89 40 89 68C89 91 71 104 50 104C29 104 11 91 11 68C11 40 25 14 50 14Z" fill="url(#${id})" stroke="${ln}" stroke-width="1.9"/>
  <ellipse cx="50" cy="86" rx="22" ry="15" fill="#ffffff" opacity=".45"/><text x="50" y="92" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-weight="800" font-size="14" fill="${dk}" opacity=".75">${ini}</text>
  <ellipse cx="29" cy="68" rx="5.5" ry="4" fill="#ff7ea6" opacity=".5"/><ellipse cx="71" cy="68" rx="5.5" ry="4" fill="#ff7ea6" opacity=".5"/>
  ${eyes(m)}${mouth(m)}${bodyAcc(o.outfit)}<g>${hat(o.outfit)}</g>${formAcc(o.form,c)}</g>`;
 let extra='';
 if(m==='sleep')extra+=`<text x="78" y="10" font-size="18" fill="#6a6aa8" font-weight="700">z</text><text x="88" y="-2" font-size="12" fill="#6a6aa8" font-weight="700">z</text>`;
 if(o.sick||m==='sick')extra+=`<g transform="translate(12 12)"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#d33" stroke-width="1.5"/><path d="M-5 0h10M0 -5v10" stroke="#d33" stroke-width="3"/></g>`;
 for(let k=0;k<(o.poop||0)&&k<3;k++)extra+=`<g transform="translate(${6+k*14} 112)"><path d="M0 0q-6 0-6-4q0-3 4-4q-2-3 2-5q4 0 3 4q4 1 3 5q0 4-6 4z" fill="#8a5a3a" stroke="#4a2c1a" stroke-width="1"/></g>`;
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">${defs}${g}${extra}</svg>`}
const cache={};
function toCanvas(cv,sv){const draw=im=>{const x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.drawImage(im,0,0,cv.width,cv.height)};
 cv.__mk=sv;if(cache[sv]&&cache[sv].complete&&cache[sv].naturalWidth)return draw(cache[sv]);
 const im=new Image();im.onload=()=>{cache[sv]=im;const ks=Object.keys(cache);if(ks.length>60)delete cache[ks[0]];if(cv.__mk===sv)draw(im)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(sv)}
const html=(name,o={})=>`<span class="mascot" style="display:inline-block;width:${o.size||80}px;aspect-ratio:120/146">${svg(name,o)}</span>`;
window.MASCOT={svg,html,color,toCanvas};
})();
;
/* ================= gifs.js ================= */
// =====================================================================================
//  GIFS / CLIPS DE LA ÉPOCA · sin claves ni cuentas: solo APIs abiertas (Wikimedia Commons, Kpop Wiki y TWICE Wiki).
//  Todo el mundo ve los mismos clips: el orden es estable (por URL) y la elección depende solo del id de la carta.
//  Un clip solo se asigna a un álbum si:
//    1) su nombre de archivo nombra ese álbum (p. ej. «TWICE Feel Special Nayeon.gif»), o
//    2) (Commons) su fecha de captura/subida cae dentro de la era del álbum coreano: desde su lanzamiento hasta el siguiente.
//  Si una carta no tiene clip de SU época, no se muestra ninguno (no se rellena con GIF de otra era).
// =====================================================================================
(function(){
const KEY='twiceGifEra1',TTL=7*864e5,sleep=ms=>new Promise(r=>setTimeout(r,ms));
let st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}st.a=st.a||{};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const COMMONS='https://commons.wikimedia.org/w/api.php';
const APIS=[[COMMONS,'commons'],['https://kpop.fandom.com/api.php','fandom'],['https://twice.fandom.com/api.php','fandom']];
const albs=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const KR=()=>albs().filter(a=>a.market==='KR').sort((x,y)=>x.release.v<y.release.v?-1:1);
// era (ventana de fechas) de cada álbum coreano
function windows(){const L=KR(),w={};L.forEach((a,i)=>{const s=ym(a.release.v),n=L[i+1]?ym(L[i+1].release.v):s+12;w[a.title]=[s,n]});return w}
function albumForTitle(t){let best=null;albs().forEach(a=>{const na=norm(a.title);if(na.length>=4&&hasAlb(t,na)&&(!best||na.length>norm(best.title).length))best=a});return best}
function albumForDate(y,m){const W=windows(),v=y*12+m;return Object.keys(W).find(t=>v>=W[t][0]&&v<W[t][1])||null}
function dateOf(t,meta){const s=[(meta&&meta.DateTimeOriginal&&meta.DateTimeOriginal.value)||'',(meta&&meta.DateTime&&meta.DateTime.value)||'',t].join(' ');
 let m=/(20[12]\d)[-_.\/ ]?(0[1-9]|1[0-2])[-_.\/ ]?([0-3]\d)/.exec(s)||/(20[12]\d)[-_.\/](0[1-9]|1[0-2])/.exec(s);return m?[+m[1],+m[2]]:null}
async function query(api,kind,q){
 const p=new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',gsrnamespace:'6',gsrlimit:'50',gsrsearch:q,prop:'imageinfo',iiprop:kind==='commons'?'url|size|mime|extmetadata':'url|size|mime',iiurlwidth:'420'});
 if(kind==='commons')p.set('iiextmetadatafilter','DateTimeOriginal|DateTime|LicenseShortName|Artist');
 const j=await(await fetch(api+'?'+p)).json();return Object.values((j.query||{}).pages||{})}
function take(page,kind,out,seen){const ii=(page.imageinfo||[])[0];if(!ii)return;const t=page.title.toLowerCase(),mime=ii.mime||'';
 const isGif=mime==='image/gif',isVid=/^video\//.test(mime)||/application\/ogg/.test(mime);if(!isGif&&!isVid)return;if(!isTw(t)&&kind!=='commons')return;if(!isTw(t)&&!/twice/i.test(JSON.stringify((ii.extmetadata||{}).Artist||'')))return;
 if(seen[t])return;seen[t]=1;if(ii.size&&ii.size>8e6)return;
 const ms=members.filter(m=>hasA(t,m));if(ms.length>1&&ms.length<5)return;const mem=ms.length===1?ms[0]:null;
 let alb=albumForTitle(t);if(!alb&&kind==='commons'){const d=dateOf(t,ii.extmetadata);if(d){const ti=albumForDate(d[0],d[1]);alb=ti&&catAlbumByTitle(ti)}}
 if(!alb)return;
 const lic=((ii.extmetadata||{}).LicenseShortName||{}).value||(kind==='commons'?'Wikimedia Commons':'Fandom');
 out.push({al:alb.title,m:mem,c:{src:isGif?(ii.thumburl||ii.url):ii.url,gif:isGif?1:0,source:ii.descriptionurl||'',license:lic,author:'',era:alb.title}})}
let busy=false;
async function warm(force){if(busy)return;busy=true;try{
 const fresh=!force&&st.t&&Date.now()-st.t<TTL&&Object.keys(st.a).length;if(fresh)return;
 const found=[],seen={};let ok=0;
 const jobs=[];albs().forEach(a=>{jobs.push(`TWICE "${a.title}" gif`);jobs.push(`TWICE "${a.title}"`)});members.forEach(m=>{jobs.push(`TWICE ${m} gif`);jobs.push(`TWICE ${m} concert`)});jobs.push('TWICE gif','TWICE concert','TWICE fansign','TWICE fanmeeting');
 for(const q of jobs){for(const[api,kind]of APIS){try{const ps=await query(api,kind,q+(kind==='commons'?' filetype:video|bitmap':''));ok++;ps.forEach(p=>take(p,kind,found,seen))}catch(e){}await sleep(110)}}
 if(!ok)return;// sin conexión: no se pisa lo que ya hubiese
 const A={};found.sort((x,y)=>x.c.src<y.c.src?-1:1).forEach(f=>{const e=A[f.al]=A[f.al]||{m:{},g:[]};if(f.m)(e.m[f.m]=e.m[f.m]||[]).push(f.c);else e.g.push(f.c)});
 st.a=A;st.t=Date.now();persist();if(window.UI&&['collection','albums','binder','packs','home'].includes(UI.cur)&&!document.querySelector('.packscene,.modal-bg')){UI.keepScroll=true;UI.route()}
 }finally{busy=false}}
// clips que corresponden a la carta: SU álbum (no el año, no otra era)
function eraClips(card){if(!card||card.game)return[];const al=card.era_album||card.album,e=st.a[al];if(!e)return[];
 if(card.member&&card.member!=='TWICE')return e.m[card.member]||[];return e.g||[]}
window.GIFERA={warm,clips:eraClips,count:()=>Object.values(st.a).reduce((s,e)=>s+e.g.length+Object.values(e.m).reduce((x,l)=>x+l.length,0),0),albums:()=>Object.keys(st.a).length};
// las cartas solo muestran clips de su época
clipCands=function(card){return eraClips(card)};
videoFor=function(card){if(card.kind==='cover')return null;const L=clipCands(card).filter(v=>{const r=focus['v:'+v.src];return!r||r.ok!==false});if(!L.length)return null;
 const ok=L.filter(v=>(focus['v:'+v.src]||{}).ok),P=ok.length?ok:L;return P[hash(card.id)%P.length]};
setTimeout(()=>warm(false),2500);
})();
;
/* ================= cromos.js ================= */
// =====================================================================================
//  CROMOS · identidad visual por colección + CROMOS ESPECIALES + sobre de cromos realista
//  · Cada álbum tiene su tema (colores, patrón, escudo = su portada). Los marcos de las cartas, el álbum y el sobre lo usan.
//  · Cromos especiales (3 por álbum): AEROPUERTO, FAN MEETING Y EVENTOS, EN CONCIERTO. No salen en sobres: se DESBLOQUEAN
//    pegando photocards en la página de su álbum (3 / 6 / las 9). Son contenido del juego; la foto se busca en Wikimedia Commons
//    por tipo y fecha de la era (sin claves) y, si no hay ninguna, se muestra «foto pendiente» (o la que pongas tú).
// =====================================================================================
(function(){
const esc=DS.esc,sleep=ms=>new Promise(r=>setTimeout(r,ms));
// ---------- tema por colección ----------
const PATS=typeof PAT!=='undefined'?PAT:{};const PK=Object.keys(PATS);
function themeOf(title){const pal=typeof PAL!=='undefined'&&PAL[title],h=hash(title);
 const c1=pal?pal[0]:`hsl(${h%360},72%,60%)`,c2=pal?pal[1]:`hsl(${(h+48)%360},62%,30%)`,pat=pal?pal[2]:PK[h%PK.length];
 return{c1,c2,pat,css:`--a1:${c1};--a2:${c2};--pat:${PATS[pat]||'none'}`}}
const mixed=t=>`color-mix(in srgb,${t.c1} 42%,${t.c2})`;
window.CROMO={theme:themeOf};
// ---------- marco de cada carta según su colección ----------
function albumCards(title){const a=catAlbumByTitle(title);if(window.BINDER&&a)return BINDER.cardsOf(a);return data.cards.filter(c=>c.album===title&&!c.ext)}
const _f=faceHTML;window.faceHTML=faceHTML=function(card,small,live){let h=_f(card,small,live);if(!card||card.game||card.ext||!card.album)return h;
 const t=themeOf(card.album),cv=typeof covers!=='undefined'&&covers[card.album],mi=Math.max(1,albumCards(card.album).findIndex(x=>x.id===card.id)+1);
 h=h.replace('<div class="pc ','<div class="pc ac ').replace('style="--ty:',`style="${esc(t.css)};--ty:`);
 h=h.replace('<div class="tag">',`${cv?`<div class="crest" style="background-image:url('${esc(covS(cv,100))}')"></div>`:''}<div class="tag">`);
 h=h.replace('<div class="cap">',`<div class="cap"><i class="cno">${String(mi).padStart(2,'0')}</i>`);
 return h};

// ---------- cromos especiales ----------
const KINDS={
 airport:{n:'Tira fotográfica',short:'TIRA DE FOTOS',ico:'🎞️',rar:'SR',need:5,rew:{coins:100,cp:15},desc:'Cuatro fotos de las miembros de este álbum en tira de cabina, siempre con las fotos de tu colección.',lab:'Tira de fotos'},
 event:{n:'Line-up del álbum',short:'LINE-UP',ico:'🧩',rar:'SSR',need:10,rew:{coins:200,tickets:1,cp:30},desc:'Las nueve integrantes del álbum juntas en un mosaico 3×3, con el título de la era.',lab:'Line-up'},
 concert:{n:'Polaroid de la era',short:'POLAROID',ico:'📸',rar:'UR',need:19,rew:{gems:2,cp:60},desc:'Instantánea de grupo con la portada del álbum. Se desbloquea completando la página.',lab:'Polaroid'}};
const KORDER=['airport','event','concert'];
const albs=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const S=()=>{data.sp=data.sp||{owned:{},img:{}};data.sp.owned=data.sp.owned||{};data.sp.img=data.sp.img||{};return data.sp};
const spId=(a,k)=>`sp:${a.id}:${k}`;
function specialsOf(a){return KORDER.map(k=>({id:spId(a,k),kind:k,album:a.title,aid:a.id,year:(a.release.v||'').slice(0,4),rarity:KINDS[k].rar,name:`${KINDS[k].n}`,sub:`${a.title} · ${(a.release.v||'').slice(0,4)}`,need:KINDS[k].need}))}
const ownedSp=id=>!!S().owned[id];
const placedN=a=>{const b=data.bind||{placed:{}};return albumCards(a.title).filter(c=>b.placed&&b.placed[c.id]).length};
function check(a,silent){const n=placedN(a),got=[];specialsOf(a).forEach(sp=>{if(!ownedSp(sp.id)&&n>=sp.need){S().owned[sp.id]=Date.now();got.push(sp);stat('special',1);const K=KINDS[sp.kind];setTimeout(()=>{ECO.reward(K.rew,`Cromo especial: ${K.n} · ${a.title}`)},silent?0:600);if(!silent)setTimeout(()=>DS.toast(`¡Nuevo cromo especial! ${K.ico} ${K.n} · ${esc(a.title)}`,'🌟'),300)}});if(got.length)save();return got}
// ---------- fotos de los especiales: Commons (sin clave), por tipo y fecha de la era ----------
const KEY='twiceSpImg1',TTL=7*864e5;let st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}st.p=st.p||{};
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const KR=()=>albs().filter(a=>a.market==='KR').sort((x,y)=>x.release.v<y.release.v?-1:1);
function eraOf(a){const L=KR();if(a.market==='KR')return a.title;const v=ym(a.release.v);let r=L[0];L.forEach(x=>{if(ym(x.release.v)<=v)r=x});return r?r.title:null}
function albumForDate(y,m){const L=KR(),v=y*12+m;let r=null;L.forEach((a,i)=>{const s=ym(a.release.v),e=L[i+1]?ym(L[i+1].release.v):s+12;if(v>=s&&v<e)r=a.title});return r}
function dateOf(t,meta){const s=[(meta&&meta.DateTimeOriginal&&meta.DateTimeOriginal.value)||'',(meta&&meta.DateTime&&meta.DateTime.value)||'',t].join(' ');const m=/(20[12]\d)[-_.\/ ]?(0[1-9]|1[0-2])[-_.\/ ]?([0-3]\d)/.exec(s)||/(20[12]\d)[-_.\/](0[1-9]|1[0-2])/.exec(s);return m?[+m[1],+m[2]]:null}
function kindOf(t){if(KINDS.airport.kw.test(t))return'airport';if(KINDS.concert.kw.test(t))return'concert';if(KINDS.event.kw.test(t))return'event';return null}
async function search(q){const p=new URLSearchParams({action:'query',format:'json',origin:'*',generator:'search',gsrnamespace:'6',gsrlimit:'50',gsrsearch:q+' filetype:bitmap',prop:'imageinfo',iiprop:'url|size|mime|extmetadata',iiurlwidth:'700',iiextmetadatafilter:'DateTimeOriginal|DateTime|LicenseShortName|Artist|ImageDescription'});
 const j=await(await fetch('https://commons.wikimedia.org/w/api.php?'+p)).json();return Object.values((j.query||{}).pages||{})}
let busy=false;
async function warm(force){return;if(busy)return;busy=true;try{if(!force&&st.t&&Date.now()-st.t<TTL&&Object.keys(st.p).length)return;
 const seen={},P={};let ok=0;const qs=[];KORDER.forEach(k=>KINDS[k].q.forEach(q=>qs.push(q)));KR().forEach(a=>{qs.push(`TWICE ${a.title}`,`TWICE ${(a.release.v||'').slice(0,4)} airport`,`TWICE ${(a.release.v||'').slice(0,4)} concert`)});
 for(const q of qs){let ps=[];try{ps=await search(q);ok++}catch(e){await sleep(120);continue}
  ps.forEach(pg=>{const ii=(pg.imageinfo||[])[0];if(!ii||!/^image\/(jpeg|png|webp)$/.test(ii.mime||''))return;if((ii.width||0)<600)return;const m=ii.extmetadata||{},desc=((m.ImageDescription||{}).value||'').replace(/<[^>]+>/g,' '),t=(pg.title+' '+desc).toLowerCase();
   if(!isTw(t)||seen[ii.url])return;const k=kindOf(t);if(!k)return;
   let al=null;const d=dateOf(pg.title,m);if(d)al=albumForDate(d[0],d[1]);if(!al)return;seen[ii.url]=1;
   const lic=((m.LicenseShortName||{}).value||'Wikimedia Commons'),au=((m.Artist||{}).value||'').replace(/<[^>]+>/g,'').slice(0,60);
   ((P[al]=P[al]||{})[k]=P[al][k]||[]).push({u:ii.thumburl||ii.url,s:ii.descriptionurl||'',l:lic,a:au,w:ii.width,h:ii.height})});
  await sleep(110)}
 if(!ok)return;Object.values(P).forEach(o=>Object.values(o).forEach(l=>l.sort((x,y)=>x.u<y.u?-1:1)));st.p=P;st.t=Date.now();persist();
 if(window.UI&&['binder','albums','collection'].includes(UI.cur)&&!document.querySelector('.modal-bg')){UI.keepScroll=true;UI.route()}}finally{busy=false}}
const vidOf=sp=>null; // v22.22: los especiales ya no dependen de vídeos externos: usan las fotos de tu colección
function photoOf(sp){const o=S().img[sp.id];if(o)return{url:o,src:'Tu imagen',conf:'own'};const v=vidOf(sp);if(v)return{conf:'video',v,url:`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,alt:`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`};return null}
// escena ilustrada con las mascotas del juego (siempre disponible, sin depender de fotos externas)
const lv=(m,x,b,w,o={})=>`<span class="lv" style="--x:${x};--b:${b};--w:${w}">${MASCOT.svg(m.name,Object.assign({stage:'adult',mood:'happy'},o))}</span>`;
function scene(sp){const M=CATALOG.members,h=hash(sp.id),pick=n=>{const o=[];for(let i=0;o.length<n&&i<30;i++){const m=M[(h+i*4+i)%M.length];if(!o.includes(m))o.push(m)}return o},P=pick(3);let x='';
 if(sp.kind==='airport'){const pol=(m,l,r,t)=>`<div class="pol" style="--l:${l};--r:${r}deg;--t:${t}"><div class="pol-i">${lv(m,16,-2,68)}</div><i>${esc(m.name)}</i></div>`;
  x=`<div class="sc-flash"></div>${pol(P[0],5,-7,10)}${pol(P[1],36,3,6)}${pol(P[2],66,9,14)}<div class="sc-vf"></div>`}
 else if(sp.kind==='event'){x=`<div class="sc-bunt"></div><div class="sc-bal b1">♪</div><div class="sc-bal b2">♫</div><div class="sc-bal b3">♪</div><div class="sc-conf"></div>${lv(P[0],6,19,22)}${lv(P[1],38,17,25,{mood:'happy'})}${lv(P[2],72,19,22)}<div class="sc-table"></div>`}
 else{x=`<div class="sc-beams"></div><div class="sc-stage"></div>${M.map((m,i)=>lv(m,2+i*10.6,13,10.5,{mood:'happy'})).join('')}${lv(P[0],37,21,25,{form:'idol'})}<div class="sc-sticks">${'<i></i>'.repeat(14)}</div>`}
 return`<div class="spc-ph scene sc-${sp.kind}">${x}</div>`}
// ---------- cara del cromo especial (apaisado, con foil) ----------

// ---------- composiciones con las fotos del álbum (siempre hay foto: ver photohub) ----------
const phUrl=cd=>{try{return(photoFor(cd)||{}).url||null}catch(e){return null}};
const mains=a=>albumCards(a.title).filter(c=>!c.kind&&c.v!=='b').slice(0,9);
const tile=(u,cls='')=>u?`<i class="fr ${cls}" data-src="${esc(u)}" data-fu="${esc(u)}"></i>`:`<i class="fr none ${cls}"></i>`;

// Tira fotográfica: fotos ESPECIALES de una sola miembro, distintas de las de las cartas y de las de otras tiras (se reservan del resto del fondo de fotos)
const _stripC={};
function stripPhotos(a,h,mainUs){const key=a?a.title:'_';if(_stripC[key]&&_stripC[key].every(Boolean)&&_stripC[key].sig===PH.count())return _stripC[key];
 const nk=u=>PH.nk?PH.nk(u):u,used=new Set();
 try{data.cards.forEach(c=>{const u=phUrl(c);if(u)used.add(nk(u))})}catch(e){}
 Object.keys(_stripC).forEach(k=>{if(k!==key)(_stripC[k]||[]).forEach(u=>u&&used.add(nk(u)))});
 const mem=(a&&mains(a).map(c=>c.member).filter(Boolean))||[],names=[...new Set(mem)],t=a&&a.release&&a.release.v?+String(a.release.v).slice(0,4)*12:0;
 const ym=p=>p.ym||0;let best=[];
 for(let k=0;k<Math.max(1,names.length);k++){const m=names[(h+k)%Math.max(1,names.length)];if(!m)continue;
  const P=(PH.pool(m)||[]).filter(p=>!used.has(nk(p.u))).sort((x,y)=>(t?Math.abs(ym(x)-t)-Math.abs(ym(y)-t):0)||(x.u<y.u?-1:1));
  if(P.length>=4){best=P.slice(0,4).map(p=>p.u);break}if(P.length>best.length)best=P.map(p=>p.u)}
 const out=best.slice(0,4);
 if(out.length<4){const rest=(mainUs||[]).filter(u=>u&&!out.includes(u));while(out.length<4&&rest.length)out.push(rest.shift())}
 while(out.length<4)out.push(out[0]||null);
 out.sig=PH.count();_stripC[key]=out;return out}
function comp(sp,a){const cs=a?mains(a):[],us=cs.map(phUrl),cv=typeof covers!=='undefined'&&covers[sp.album],h=hash(sp.id);
 if(sp.kind==='airport'){const us4=stripPhotos(a,h,us);return`<div class="spc-ph sp3 strip"><div class="sp-strip">${us4.map(u=>tile(u)).join('')}</div><b class="sp-st">★</b></div>`}
 if(sp.kind==='event')return`<div class="spc-ph sp3 lineup"><div class="sp-grid">${cs.map((c,i)=>`<div>${tile(us[i])}<small>${esc(c.member)}</small></div>`).join('')}</div></div>`;
 const g=(typeof groupFor==='function'&&a?groupFor(sp.album):null)||cv||us.find(Boolean);
 return`<div class="spc-ph sp3 pola"><div class="pl-img">${tile(g)}${cv?`<i class="pl-cov" style="background-image:url('${esc(covS(cv,120))}')"></i>`:''}</div><div class="pl-cap">${esc(sp.album)} · ${sp.year}</div></div>`}
function faceSp(sp,o={}){const K=KINDS[sp.kind],a=catAlbumByTitle(sp.album),t=themeOf(sp.album),own=ownedSp(sp.id),ph=own?photoOf(sp):null,cv=typeof covers!=='undefined'&&covers[sp.album],n=a?placedN(a):0,v=vidOf(sp);
 if(!own)return`<div class="spc sp-${sp.kind} locked ${o.cls||''}" data-sp="${sp.id}" style="${esc(t.css)}"><div class="spc-in"><div class="spc-lock"><b>🔒</b><span>${K.ico} ${K.n}</span><small>Pega ${sp.need} cromos de este álbum · ${Math.min(n,sp.need)}/${sp.need}</small><i class="spc-bar"><u style="width:${Math.min(100,Math.round(n/sp.need*100))}%"></u></i></div></div></div>`;
 const fb=`<div class="spc-ph fb">${cv?`<div class="fb-cov" style="background-image:url('${esc(covS(cv,400))}')"></div>`:''}<div class="fb-in"><span>${K.ico}</span><small>${v?'':'vídeo oficial pendiente'}</small></div></div>`;
 const media=ph&&ph.conf==='own'?`<div class="spc-ph" data-src="${esc(ph.url)}" data-fu="${esc(ph.url)}"></div>`:comp(sp,a);
 return`<div class="spc sp-${sp.kind} r-${sp.rarity} ${v?'has-v':''} ${o.cls||''}" data-sp="${sp.id}" style="${esc(t.css)}"><div class="spc-in">${media}<i class="spc-holo"></i><i class="spc-gl"></i>${v?'<i class="spc-play">▶</i>':''}
  <div class="spc-rib">${K.ico} ${K.short}</div><div class="spc-plate"><b>${esc(v?v.t:K.n)}</b><small>${esc(sp.album)} · ${sp.year}</small></div></div></div>`}
// ---- visor a pantalla completa de un cromo especial: la composición en grande y cada foto ampliable ----
function viewSpecial(sp,a,onClose){const K=KINDS[sp.kind],t=themeOf(sp.album),o=S().img[sp.id];document.querySelectorAll('.splb').forEach(x=>x.remove());
 const el=document.createElement('div');el.className='splb sp-'+sp.kind;el.style.cssText=t.css;
 el.innerHTML=`<header><div><b>${K.ico} ${K.n}</b><small>${esc(sp.album)} · ${sp.year} · cromo especial del juego</small></div><button class="x" data-x aria-label="Cerrar">✕</button></header>
  <div class="splb-st"><div class="splb-art">${o?`<div class="spc-ph" data-src="${esc(o)}"></div>`:comp(sp,a)}</div></div>
  <footer><span class="small">${o?'Tu imagen':'Toca una foto para verla en grande'}</span><button class="btn sm" data-opt>⚙ Opciones</button></footer><div class="splb-zoom" hidden><img alt=""></div>`;
 document.body.appendChild(el);IC.scan(el);const close=()=>{el.remove();document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape'){const z=el.querySelector('.splb-zoom');if(!z.hidden)z.hidden=true;else close()}};document.addEventListener('keydown',kd);
 el.querySelector('[data-x]').onclick=close;el.querySelector('[data-opt]').onclick=()=>{close();openSpecial(sp.id,onClose,true)};
 const z=el.querySelector('.splb-zoom');z.onclick=()=>{z.hidden=true};
 el.querySelector('.splb-art').addEventListener('click',async e=>{const f=e.target.closest('[data-fu]');if(!f)return;const u=await IC.load(f.dataset.fu).catch(()=>null);if(u){z.querySelector('img').src=u;z.hidden=false}})}
function openSpecial(id,onClose,opts){const [,aid,kind]=id.split(':'),a=CAT_IDX.album[aid];if(!a)return;const sp=specialsOf(a).find(x=>x.kind===kind),K=KINDS[kind],own=ownedSp(id),ph=own?photoOf(sp):null,n=placedN(a);
 if(own&&!opts)return viewSpecial(sp,a,onClose);
 const body=`<div class="cd"><div class="cd-card" style="width:min(100%,420px)">${faceSp(sp,{cls:'big'})}</div><div class="cd-info vstack"><div class="row"><span class="tag-r ${sp.rarity}">${sp.rarity}</span><span class="chip game">CROMO ESPECIAL · contenido del juego</span></div>
  <h3 style="font-size:22px;margin:0">${K.ico} ${K.n}</h3><div class="small">${esc(a.title)} · Era ${sp.year}</div>
  <table class="kv"><tr><th>Cómo se consigue</th><td>${kind==='concert'?`Completando la página (${sp.need}/${sp.need})`:`Pegando ${sp.need} cromos de este álbum`}</td></tr><tr><th>Recompensa</th><td>${Object.entries(K.rew).map(([k,v])=>({coins:'🪙',tickets:'🎟️',gems:'💎',cp:'✨'})[k]+' '+v).join(' · ')}</td></tr><tr><th>Qué es</th><td>${K.desc}</td></tr><tr><th>Tu progreso</th><td>${Math.min(n,sp.need)}/${sp.need}${own?' · <b style="color:var(--ok)">CONSEGUIDO</b>':''}</td></tr>
  ${ph&&ph.conf==='video'?`<tr><th>Vídeo oficial</th><td>${esc(ph.v.t)}<br><small>Canal: ${esc(ph.v.c)}</small></td></tr>`:''}</table>
  <p class="small">${own?(ph&&ph.conf==='video'?'Imagen oficial del vídeo. Pulsa «Ver fragmento» para reproducir un trozo desde YouTube (el momento exacto es aproximado) o ábrelo completo. También puedes poner tu propia imagen.':ph&&ph.conf==='own'?'Estás usando tu propia imagen.':'Composición hecha con las fotos de tu colección. Si prefieres, pon tu propia imagen.'):'Este cromo está bloqueado: no se consigue con sobres, se desbloquea al avanzar en la página del álbum.'}</p>
  ${own&&ph&&ph.conf==='video'?`<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn pri sm" id="spplay">▶ Ver fragmento</button></div>`:''}
  ${own?`<div class="vstack" style="gap:6px"><button class="btn sm" id="spflip">↻ Ver dorso</button><input class="inp" id="spu" type="url" placeholder="https://…/foto.jpg" style="width:100%"><div class="row"><button class="btn sm" id="spok">Usar enlace</button><label class="btn sm">📁 Subir archivo<input id="spf" type="file" accept="image/*" hidden></label>${S().img[id]?'<button class="btn sm" id="sprm">Quitar mi imagen</button>':''}</div></div>`:''}</div></div>`;
 const m=DS.modal({id:'sp',title:`${K.n} · ${esc(a.title)}`,cls:'lg',body});IC.scan(m);
 const done=()=>{save();m._close();openSpecial(id,onClose);if(onClose)onClose()};
 const pb=m.querySelector('#spplay');if(pb)pb.onclick=()=>{const v=ph.v,[a0,a1]=K.clip,watch=`https://www.youtube.com/watch?v=${v.id}&t=${a0}s`;
  // El vídeo se reproduce SIEMPRE dentro del cromo (nunca se abre otra pestaña sola).
  const box=m.querySelector('.cd-card'),org=location.protocol==='file:'?'':`&origin=${encodeURIComponent(location.origin)}`;
  box.innerHTML=`<div class="spvid"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?start=${a0}&end=${a1}&autoplay=1&rel=0&modestbranding=1&playsinline=1${org}" title="${esc(v.t)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>${location.protocol==='file:'?'<p class="small" style="margin:8px 0 0;text-align:center;opacity:.8">Si ves un error de YouTube, abre la web con INICIAR (YouTube no deja reproducir desde un archivo abierto con doble clic).</p>':''}`;pb.disabled=true};
 const fb=m.querySelector('#spflip');if(fb){let back=false;const w=m.querySelector('.cd-card');fb.onclick=()=>{back=!back;w.innerHTML=back?spBack(sp):faceSp(sp,{cls:'big'});fb.textContent=back?'↻ Ver frente':'↻ Ver dorso';IC.scan(w)}}
 const ok=m.querySelector('#spok');if(ok)ok.onclick=()=>{const u=m.querySelector('#spu').value.trim();if(!/^https?:\/\//.test(u))return DS.toast('Pega un enlace http(s) a una imagen','⚠️');S().img[id]=u;done()};
 const f=m.querySelector('#spf');if(f)f.onchange=async e=>{const fl=e.target.files[0];if(!fl)return;try{S().img[id]=await AlbumArt.fromFile(fl);done()}catch(x){DS.toast('No se pudo leer ese archivo','⚠️')}};
 const rm=m.querySelector('#sprm');if(rm)rm.onclick=()=>{delete S().img[id];done()}}
window.SPCR={KINDS,of:specialsOf,owned:ownedSp,check,face:faceSp,open:openSpecial,warm,photo:photoOf,placedN,count:()=>Object.keys(S().owned).length,total:()=>albs().length*3};

// ---------- DORSO ESPECÍFICO DE CADA CROMO ----------
//  Cada dorso lleva el tema de SU colección (colores, patrón, portada), el color de SU integrante, su nº dentro del álbum,
//  su serie (A / B / grupo), su rareza y un código de barras propio generado a partir de su id.
function bars(seed){let x=seed>>>0,o='',w=0;for(let i=0;i<30;i++){x=(Math.imul(x,1664525)+1013904223)>>>0;const bw=1+(x>>>28)%3,gap=1+(x>>>24)%2;o+=`<rect x="${w}" y="0" width="${bw}" height="20" fill="#fff"/>`;w+=bw+gap}return`<svg class="pb-bc" viewBox="0 0 ${w} 20" preserveAspectRatio="none">${o}</svg>`}
const memCol=n=>((typeof TY!=='undefined'&&TY[n])||[,'#ffc23d'])[1];
function backOf(c){
 if(c.game)return`<div class="pcb2 game" style="--mc:${memCol(c.member)}"><div class="pb-in"><div class="pb-wm">★</div><div class="pb-top"><b>TWICE</b><span>GAME SPECIAL</span></div><div class="pb-name">${esc(c.name||c.member)}</div><div class="pb-alb">Contenido del juego</div><div class="pb-foot">${bars(hash(c.id))}<small>ONCE · TWICE COLLECTOR</small></div></div></div>`;
 const t=themeOf(c.album),cv=typeof covers!=='undefined'&&covers[c.album],L=albumCards(c.album),no=Math.max(1,L.findIndex(x=>x.id===c.id)+1),tot=L.length||19,isG=c.kind==='group',isB=c.v==='b',
  yr=(albumMap[c.album]||'').slice(0,4),R=(typeof rarityInfo!=='undefined'&&rarityInfo[c.rarity])||{stars:1},col=isG?'#ffd23f':memCol(c.member),ser=isG?'FOTO DE GRUPO':isB?'SERIE B':'SERIE A';
 return`<div class="pcb2 r-${c.rarity}" style="${esc(t.css)};--mc:${col}"><div class="pb-in"><div class="pb-wm">${isG?'×9':esc(c.member[0])}</div>
  <div class="pb-top"><b>TWICE</b><span>${ser}</span></div>
  <div class="pb-cov"${cv?` style="background-image:url('${esc(covS(cv,300))}')"`:''}>${cv?'':`<small>${esc(c.album)}</small>`}</div>
  <div class="pb-name">${isG?'TWICE':esc(c.member)}</div><div class="pb-alb">${esc(c.album)} · ${yr}</div>
  <div class="pb-meta"><span>Nº ${String(no).padStart(2,'0')}/${tot}</span><span>${'★'.repeat(R.stars||1)} ${c.rarity}</span></div>
  <div class="pb-foot">${bars(hash(c.id))}<small>ONCE · TWICE COLLECTOR</small></div></div></div>`}
window.cardBackHTML=backOf;
window.pcBack=pcBack=function(c){return backOf(c)};
const _bk=(c)=>`<div class="pc ac pcbk r-${c.rarity}" style="${esc(themeOf(c.album||'').css)}"><div class="in">${backOf(c)}</div></div>`;
// ficha de carta: la carta se puede girar para ver su dorso
if(typeof showDetail==='function'){const _sd=showDetail;
 window.openCard=window.showDetail=showDetail=function(id){_sd(id);const c=data.cards.find(x=>x.id===id),box=document.getElementById('cdc');if(!c||!box||!data.owned[id]||c.game)return;
  const front=box.innerHTML;box.innerHTML=`<div class="cflip"><div class="cflip-in"><div class="cflip-f">${front}</div><div class="cflip-b">${_bk(c)}</div></div></div>`;
  const fl=box.querySelector('.cflip'),btn=document.createElement('button');btn.className='btn sm';btn.textContent='↻ Ver dorso';btn.onclick=()=>{fl.classList.toggle('flipped');btn.textContent=fl.classList.contains('flipped')?'↻ Ver frente':'↻ Ver dorso'};
  fl.onclick=()=>btn.click();const row=document.querySelector('.cd-info .row:last-child');if(row)row.appendChild(btn);IC.scan(box)}}
// cromos especiales: su propio dorso
function spBack(sp){const K=KINDS[sp.kind],t=themeOf(sp.album);return`<div class="spc spb sp-${sp.kind}" style="${esc(t.css)}"><div class="spc-in"><div class="spb-i">${K.ico}</div><b>CROMO ESPECIAL</b><span>${K.n}</span><small>${esc(sp.album)} · Era ${sp.year}</small><div class="pb-foot">${bars(hash(sp.id))}<small>ONCE · TWICE COLLECTOR</small></div></div></div>`}
// la foto de grupo no se rellena con fotos de otra época (>36 meses): mejor «foto pendiente»
if(typeof groupFor==='function'){const _g=groupFor;groupFor=function(al){const u=_g(al);if(!u)return u;const e=typeof fdm!=='undefined'&&fdm[al];if(e&&(e.g||[]).includes(u))return u;
 const l=(typeof gGrp!=='undefined'&&gGrp.l||[]).concat(typeof grp!=='undefined'&&grp.l||[]),it=l.find(x=>x.url===u),t=ym(albumMap[al]||'');return it&&it.ym&&t&&Math.abs(it.ym-t)>36?null:u}}

// ---------- sobre de cromos realista (foil con crimpado, sello y letra pequeña) ----------
if(window.Envelope3D){const _eh=Envelope3D.html;
 Envelope3D.html=function(p,o={}){let q=p;if(p&&p.kind==='album'&&CAT_IDX.album[p.album]){const t=themeOf(CAT_IDX.album[p.album].title);q={...p,theme:[mixed(t),t.c2]}}
  let h=_eh.call(Envelope3D,q,o);const n=(o&&o.cards)||p.cards||5,yr=p.kind==='album'&&CAT_IDX.album[p.album]?(CAT_IDX.album[p.album].release.v||'').slice(0,4):p.kind==='era'?p.year:'';
  return h.replace('<i class="crimp b"></i>',`<i class="crimp b"></i><i class="foil"></i><i class="seam"></i><div class="ft-seal"><b>${n}</b><span>CROMOS</span></div><div class="ft-ser">${yr?`SERIE ${yr}`:'EDICIÓN ONCE'}</div><div class="ft-bar"><i></i><small>TWICE COLLECTOR</small></div>`)}}
setTimeout(()=>warm(false),4000);
})();
;
/* ================= binder.js ================= */
// =====================================================================================
//  ÁLBUM DE CROMOS · cada álbum del catálogo = una página con 9 huecos numerados (1 por integrante, mismo orden siempre).
//  · Las photocards se PEGAN solas en su hueco al conseguirlas (animación de pegatina). Modo manual opcional: bandeja + tocar/arrastrar.
//  · Una carta solo cabe en el hueco de su integrante y de su álbum (la era la marca el álbum, no el año).
//  · Recompensas: álbum completo y era (año) completa. Se conserva todo lo ya colocado (data.bind.placed).
// =====================================================================================
(function(){
const PREW={album:{coins:500,tickets:1,cp:60},year:{gems:5,cp:120}};
const esc=DS.esc;
const B=()=>{const b=data.bind=data.bind||{placed:{},inbox:[],auto:true,claims:{}};
 if(!b.v2){b.v2=1;b.auto=true;b.inbox=[];save()}   // nueva dinámica: las cartas se pegan solas (las pendientes se pegan al abrir el álbum)
 b.seen=b.seen||{};b.placed=b.placed||{};b.claims=b.claims||{};b.inbox=b.inbox||[];return b};
const albums=()=>catVisibleAlbums().filter(a=>a.physical!==false);
// siempre el mismo orden de integrantes → el nº de hueco es estable (01 Nayeon … 09 Tzuyu)
// 19 cromos por álbum, siempre en este orden: Serie A (01–09) · Serie B (10–18) · Foto de grupo (19)
function cardsOf(a){const all=data.cards.filter(c=>c.album===a.title&&!c.ext),M=CATALOG.members,
 A=M.map(m=>all.find(c=>c.member===m.name&&c.v!=='b'&&!c.kind)),B=M.map(m=>all.find(c=>c.member===m.name&&c.v==='b')),G=all.find(c=>c.kind==='group');return[...A,...B,G].filter(Boolean)}
function pagesOf(a){return[cardsOf(a)]}
const placed=id=>!!B().placed[id];
function onNew(ids){const b=B();ids.forEach(id=>{if(b.auto)place(id,true);else if(!b.inbox.includes(id)&&!b.placed[id])b.inbox.push(id)});save()}
// pegar: solo en su hueco (la photocard pertenece a ese álbum e integrante)
function place(id,silent){const b=B(),c=data.cards.find(x=>x.id===id);if(!c||!data.owned[id]||b.placed[id])return false;b.placed[id]=Date.now();b.inbox=b.inbox.filter(x=>x!==id);stat('placed');if(!silent)SND.sfx('place');
 const a=catAlbumByTitle(c.album);if(a){checkRewards(a,silent);if(window.SPCR)SPCR.check(a,silent)}save();return true}
function checkRewards(a,silent){const b=B(),cl=b.claims,give=(k,r,why)=>{if(cl[k])return;cl[k]=Date.now();if(silent)ECO.reward(r,why);else setTimeout(()=>ECO.reward(r,why),700)};
 if(cardsOf(a).every(c=>placed(c.id))){give('a:'+a.id,PREW.album,`Álbum completo: ${a.title}`);stat('albumsDone');stat('page');stat('pages')}
 const y=a.release.v.slice(0,4),ys=albums().filter(x=>x.release.v.startsWith(y));if(ys.every(x=>cardsOf(x).every(c=>placed(c.id))))give('y:'+y,PREW.year,`Era ${y} completa`)}
function stickAll(){const b=B();let n=0;Object.keys(data.owned).forEach(id=>{if(data.owned[id]&&!b.placed[id]){const c=data.cards.find(x=>x.id===id);if(c&&!c.ext&&place(id,true))n++}});return n}
window.BINDER={onNew,place,pagesOf,cardsOf,stickAll};

// ---------- estilos (propios: prefijo cr-) ----------
if(!document.getElementById('cr-css')){const s=document.createElement('style');s.id='cr-css';s.textContent=`
.cr-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.cr-head h2{margin:0}
.cr-sum{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin:0 0 14px}
.cr-sum b{font-size:1.15em;color:var(--apr)}
.cr-era{margin:22px 0 10px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.cr-era h3{margin:0;font:800 20px Fredoka,Poppins,sans-serif;font-style:italic;text-transform:uppercase;letter-spacing:.02em}
.cr-era small{color:var(--mute)}
.cr-idx{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.cr-tile{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:12px;background:#efe6d2;color:#2b1a33;box-shadow:0 6px 14px #0007;transition:transform .2s var(--ease)}
.cr-tile:hover,.cr-tile:focus-visible{transform:translateY(-3px) rotate(-.5deg)}
.cr-tile .ct-art{aspect-ratio:1;border-radius:6px;background:var(--pat,none),linear-gradient(145deg,var(--a1),var(--a2));position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;font:700 13px Poppins;color:#fff;padding:6px;box-shadow:inset 0 0 0 2px #fff8}
.cr-tile .ct-cov{position:absolute;inset:14%;border-radius:4px;background:#1b0d22 center/cover;box-shadow:0 5px 12px #000a;border:2px solid #fff}
.cr-tile .ct-dots{position:absolute;left:6px;right:6px;bottom:5px;display:grid;gap:3px}
.cr-tile .ct-dots i{height:6px;border-radius:3px;background:#0005}
.cr-tile .ct-dots i.on{background:#ffd23f;box-shadow:0 0 6px #ffd23f}
.cr-tile.done{box-shadow:0 6px 14px #0007,0 0 0 3px var(--ok)}
.cr-tile b{font:800 12.5px/1.15 Poppins;text-transform:uppercase;letter-spacing:.01em}
.cr-tile small{color:#6b5870;font-weight:600}
.cr-tile .ct-new{position:absolute;top:6px;right:6px;background:#e63946;color:#fff;border-radius:99px;font:700 10px Poppins;padding:2px 7px;z-index:2}
/* ---- página de álbum de cromos (estilo álbum de fútbol) ---- */
.cr-book{display:grid;grid-template-columns:1fr;border-radius:6px 16px 16px 6px;overflow:hidden;box-shadow:0 18px 44px #000b,0 0 0 1px #0006;background:#efe6d2;position:relative}
.cr-book::before{content:'';position:absolute;left:0;top:0;bottom:0;width:14px;z-index:5;background:repeating-linear-gradient(180deg,#0000 0 22px,#2b1a3355 22px 24px),linear-gradient(90deg,#00000055,#ffffff30 60%,#0000);pointer-events:none}
@media(min-width:900px){.cr-book.spread{grid-template-columns:minmax(270px,.8fr) 1.7fr}.cr-book.spread::before{display:none}}
.cr-left{padding:22px 20px 20px 28px;display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center;color:#fff;background:var(--pat,none),linear-gradient(160deg,var(--a1),var(--a2) 70%);position:relative}
.cr-left::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#0000 55%,#0006);pointer-events:none}
.cr-left>*{position:relative;z-index:1}
.cr-band{align-self:stretch;background:#fff;color:#2b1a33;font:800 12px Poppins;letter-spacing:.2em;padding:5px 8px;border-radius:3px;transform:rotate(-1deg);box-shadow:0 3px 8px #0005}
.cr-left .cr-cov{width:min(100%,230px);aspect-ratio:1;border-radius:6px;background:#1b0d22 center/cover;box-shadow:0 12px 28px #000b;border:4px solid #fff;transform:rotate(1.5deg)}
.cr-left h3{margin:0;font:800 clamp(22px,3vw,28px)/1.05 Fredoka,Poppins,sans-serif;font-style:italic;text-transform:uppercase;text-shadow:0 3px 0 #0006}
.cr-left .cr-meta{font:600 13px Poppins;text-shadow:0 1px 3px #0008}
.cr-ring{--p:0;width:92px;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#ffd23f calc(var(--p)*1%),#ffffff40 0);position:relative}
.cr-ring::before{content:"";position:absolute;inset:8px;border-radius:50%;background:#2b1a33}
.cr-ring b{position:relative;font:800 20px Fredoka}
.cr-page{padding:18px 18px 18px 30px;color:#2b1a33;background:
 repeating-linear-gradient(0deg,#0000 0 31px,#7a5d7614 31px 32px),
 radial-gradient(120% 80% at 50% 0,#fffaf0,#efe6d2)}
.cr-page-t{display:flex;justify-content:space-between;align-items:center;margin:0 0 14px;padding:6px 12px;border-radius:4px;background:linear-gradient(90deg,color-mix(in srgb,var(--a2) 70%,#000),color-mix(in srgb,var(--a2) 40%,#000));color:#fff;font:800 12px Poppins;letter-spacing:.14em;text-transform:uppercase;box-shadow:0 3px 8px #0004}
.cr-sec{margin:16px 0 10px;font:800 11px Poppins;letter-spacing:.16em;color:#2b1a33;display:flex;align-items:center;gap:8px}.cr-sec::after{content:'';flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--a2) 0 5px,#0000 5px 9px);opacity:.7}
.cr-slots.one{grid-template-columns:minmax(0,190px);justify-content:center}
.cr-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,2.2vw,20px);max-width:560px;margin:0 auto}
.cr-slot{position:relative;aspect-ratio:2/3;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s var(--ease)}
.cr-slot.empty{background:#fbf7ee;border:2px solid var(--a2);box-shadow:inset 0 0 0 3px #fbf7ee,inset 0 0 0 4px #7a5d7633;overflow:hidden;color:#2b1a33}
.cr-slot.empty::before{content:'';position:absolute;inset:8% 10% 22%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'%3E%3Ccircle cx='50' cy='40' r='20' fill='%232b1a33' fill-opacity='.11'/%3E%3Cpath d='M10 130c0-34 17-52 40-52s40 18 40 52z' fill='%232b1a33' fill-opacity='.11'/%3E%3C/svg%3E") center/contain no-repeat}
.cr-slot.empty:hover{transform:scale(1.03)}
.cr-slot .cr-n{position:absolute;top:5px;left:5px;min-width:26px;box-sizing:border-box;line-height:1.15;text-align:center;padding:2px 6px;border-radius:99px;background:color-mix(in srgb,var(--a2) 62%,#000);border:2px solid #fff;font:800 12px Poppins;color:#fff;z-index:4;box-shadow:0 2px 5px #0006}
.cr-slot.full .cr-n{top:auto;left:50%;bottom:5px;transform:translateX(-50%);padding:1px 6px;font-size:11px}
.cr-slot.empty .cr-pl{position:absolute;left:0;right:0;bottom:0;padding:5px 4px 6px;background:color-mix(in srgb,var(--a2) 62%,#000);color:#fff;text-shadow:0 1px 2px #0009;text-align:center;display:flex;flex-direction:column;gap:1px}
.cr-slot.empty .cr-m{font:800 clamp(9px,1.6vw,12px) Poppins;letter-spacing:.06em;text-transform:uppercase}
.cr-slot.empty .cr-r{font:700 9px Poppins;letter-spacing:.1em;opacity:.85}
.cr-slot.empty .cr-i{display:none}
.cr-slot.full{filter:drop-shadow(0 6px 8px #0007);transform:rotate(var(--rot,0deg))}
.cr-slot.full>.pc{margin:0;max-width:none;width:100%;box-shadow:0 0 0 3px #ffffffe6,0 3px 8px #0006}
.cr-slot.full:hover{transform:rotate(0deg) scale(1.05);z-index:2}
.cr-slot.ready{animation:crp 1.2s ease-in-out infinite}
.cr-slot.ready.empty{border-color:#e63946}
@keyframes crp{50%{box-shadow:0 0 0 5px #e6394666}}
.cr-slot.fresh{animation:crin .9s var(--ease) both}
@keyframes crin{0%{transform:translateY(-60px) rotate(-12deg) scale(1.35);opacity:0;filter:brightness(2)}55%{transform:translateY(0) rotate(var(--rot,0deg)) scale(1.04);opacity:1}100%{transform:rotate(var(--rot,0deg)) scale(1)}}
.cr-slot.nope{animation:crno .35s}
@keyframes crno{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.cr-sp-t{margin:22px 0 10px;display:flex;align-items:center;gap:10px;font:800 13px Poppins;letter-spacing:.14em;text-transform:uppercase;color:#2b1a33}
.cr-sp-t::before,.cr-sp-t::after{content:'';flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--a2) 0 6px,#0000 6px 10px)}
.cr-sps{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;max-width:640px;margin:0 auto}
.cr-tray{margin:0 0 12px;padding:10px;border-radius:12px;background:var(--panel);border:1px solid var(--line)}
.cr-tray .inrow{display:flex;gap:8px;overflow-x:auto;padding:6px 0;align-items:center}
.cr-tray .inb{flex:0 0 70px;cursor:grab}
.cr-tray .inb.sel{outline:3px solid var(--mag);border-radius:8px}
.cr-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px;flex-wrap:wrap}
.cr-nav .mid{color:var(--mute);font-size:13px;text-align:center;flex:1}
.cr-sw{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--mute)}
@media(max-width:899px){.cr-left{flex-direction:row;text-align:left;padding:12px 12px 12px 24px;gap:12px;flex-wrap:wrap}.cr-band{flex-basis:100%}.cr-left .cr-cov{width:78px;flex:none;border-width:3px}.cr-left>div:nth-of-type(3){flex:1;min-width:0}.cr-left h3{font-size:18px}.cr-ring{width:60px;flex:none}.cr-ring b{font-size:14px}.cr-ring::before{inset:6px}.cr-page{padding:14px 12px 14px 24px}}
`;document.head.appendChild(s)}

window.COLTABS=(on)=>{const T=[['binder','📒 Álbum de cromos'],['collection/album','💿 Cartas por álbum'],['collection/member','👤 Integrantes'],['collection/era','🕘 Eras'],['collection/special','🎴 Especiales'],['collection/dups','⧉ Duplicadas'],['collection/wish','♡ Wishlist']];
 return`<div class="seg coltabs" id="cm">${T.map(([k,l])=>`<button data-t="${k}" class="${on===k?'on':''}" onclick="UI.go('#/${k}')">${l}</button>`).join('')}</div>`};
const TYc=m=>(TY[m]||[,'#ff5fa2'])[1];
const era=a=>a.release.v.slice(0,4);
// ---------- premios del gacha: viven en la pagina de su album ----------
const gOwn=id=>{if(typeof capS==='undefined')return false;const C=capS();return !!((C.owned||{})[id]||C.test)};
function gachaRow(a){if(typeof capIdx==='undefined'||typeof MEM==='undefined')return'';const i=capIdx(a.title);if(i<0)return'';
 const hasMv=!!(window.MVS&&MVS[a.id]&&MVS[a.id].concert);
 const t=(id,ic,lab)=>`<button class="cx pz${gOwn(id)?'':' lock'}" ${gOwn(id)?`data-gp="${id}"`:''} title="${gOwn(id)?'Ver premio':'Aún no lo has sacado del gacha'}"><i class="cdx" style="display:flex;align-items:center;justify-content:center;font-size:26px">${gOwn(id)?ic:'🔒'}</i><b>${lab}</b></button>`;
 const ids=['d'+i,'g'+i,...MEM.map((m,mi)=>`k${i}_${mi}`),...(hasMv?['m'+i]:[])],n=ids.filter(gOwn).length;
 return`<div class="cr-sp-t">🎰 Premios del gacha · ${n}/${ids.length}</div><div class="caprow cr-gp"><div class="capgrid">
  ${t('d'+i,'💿','Álbum')}${t('g'+i,'🛍️','Merch')}${MEM.map((m,mi)=>t(`k${i}_${mi}`,'📷',m.n)).join('')}${hasMv?t('m'+i,'▶️','MV'):''}</div></div>`}
function gachaWire(c,again){c.querySelectorAll('[data-gp]').forEach(b=>b.onclick=()=>window.GACHA&&GACHA.open(b.dataset.gp,again));
 if(typeof capThumb==='function')c.querySelectorAll('.stx[data-k]').forEach(async el=>{if(el.closest('.lock'))return;const r=await capThumb(el.dataset.k);if(r&&r.png)el.style.backgroundImage=`url('${r.png}')`;else el.classList.add('nopic')})}
function gachaClips(){return''}
// ---------- índice: eras → álbumes ----------
function binderIndex(c){albums().forEach(a=>SPCR.check(a,true));const b=B(),inb=b.inbox.filter(id=>data.owned[id]&&!b.placed[id]),L=albums(),tot=L.reduce((s,a)=>s+cardsOf(a).length,0),got=L.reduce((s,a)=>s+cardsOf(a).filter(x=>placed(x.id)).length,0);
 const yrs=[...new Set(L.map(era))];
 c.innerHTML=`<div class="phead"><div><h2>Colección</h2></div>${COLTABS('binder')}</div><div class="cr-head"><h2 style="font-size:18px">Álbum de cromos</h2><label class="cr-sw"><input type="checkbox" ${b.auto?'checked':''} id="crAuto"> Pegar las cartas nuevas automáticamente</label></div>
 <div class="cr-sum"><span><b>${got}</b> / ${tot} cromos pegados</span><span><b>${L.filter(a=>cardsOf(a).every(x=>placed(x.id))).length}</b> / ${L.length} páginas completas</span>${inb.length?`<button class="btn pri sm" id="crAll">📥 Pegar ${inb.length} cartas pendientes</button>`:''}</div>
 ${yrs.map(y=>{const ya=L.filter(a=>era(a)===y),cs=ya.flatMap(cardsOf),n=cs.filter(x=>placed(x.id)).length;return`<div class="cr-era"><h3>Era ${y}</h3><small>${n}/${cs.length} · ${ya.length} página${ya.length>1?'s':''}${n===cs.length?' · ✓ era completa':''}</small></div>
 <div class="cr-idx">${ya.map(a=>{const cs2=cardsOf(a),n2=cs2.filter(x=>placed(x.id)).length,u=covers[a.title]?covS(covers[a.title],300):'',fresh=cs2.some(x=>(b.placed[x.id]||0)>(b.seen[a.id]||0)&&Date.now()-b.placed[x.id]<864e5*3);
  const th=CROMO.theme(a.title),spn=SPCR.of(a).filter(x=>SPCR.owned(x.id)).length;
  return`<button class="cr-tile ${n2===cs2.length?'done':''}" style="${esc(th.css)}" onclick="go19('#/binder/${a.id}')"><div class="ct-art">${u?`<div class="ct-cov" data-src="${u}"></div>`:esc(a.title)}${fresh?'<span class="ct-new">NUEVO</span>':''}<span class="ct-dots" style="grid-template-columns:repeat(${cs2.length},1fr)">${cs2.map(x=>`<i class="${placed(x.id)?'on':''}"></i>`).join('')}</span></div><b>${esc(a.title)}</b><small>${n2}/${cs2.length} · ★${spn}/3</small></button>`}).join('')}</div>`}).join('')}${gachaClips()}`;
 gachaWire(c,()=>binderIndex(c));c.querySelector('#crAuto').onchange=e=>{b.auto=e.target.checked;if(b.auto)stickAll();save();binderIndex(c)};
 const all=c.querySelector('#crAll');if(all)all.onclick=()=>{stickAll();SND.sfx('place');binderIndex(c)}}
// ---------- una página (álbum) ----------
function slotHTML(cd,i,a,b){const pl=placed(cd.id),ow=!!data.owned[cd.id],R=CATALOG.rarities[cd.rarity],rot=((hash(cd.id)%5)-2)*.8,fresh=pl&&(b.placed[cd.id]||0)>(b.seen[a.id]||0)&&Date.now()-b.placed[cd.id]<864e5*3;
 const num=`<span class="cr-n">${String(i+1).padStart(2,'0')}</span>`;
 if(pl)return`<div class="cr-slot full${fresh?' fresh':''}" style="--rot:${rot}deg" data-id="${cd.id}" title="${esc(cd.member)} · ${cd.rarity}">${num}${faceHTML(cd,true)}</div>`;
 return`<div class="cr-slot empty${ow?' ready':''}" data-id="${cd.id}" style="--mc:${TYc(cd.member)}" title="${esc(cd.member)}${cd.v==='b'?' (B)':cd.kind==='group'?' (grupo)':''} · ${cd.rarity}${ow?' · ¡la tienes! pégala':' · te falta'}">${num}<div class="cr-pl"><span class="cr-m">${cd.kind==='group'?'TWICE · GRUPO':esc(cd.member)+(cd.v==='b'?' · B':'')}</span><span class="cr-r">${ow?'¡LA TIENES! PÉGALA':cd.rarity}</span></div></div>`}
const diagHTML=a=>{try{const d=PH.report()[a.title];return d?`<div class="cr-meta" title="Fotos de la misma sesión (principal) y otras sesiones distintas (secundaria)">📷 Principal ${d.principal}/${d.total}${d.clave?' · sesión «'+d.clave+'»':''} · Secundaria ${d.secundaria}/${d.total}</div>`:''}catch(e){return''}};
function binderPage(c,a,emb){if(window.PH&&PH.fix)PH.fix(a.title);else if(window.PH&&PH.deep)PH.deep(a.title);const b=B(),cs=cardsOf(a),n=cs.filter(x=>placed(x.id)).length,wide=emb?c.clientWidth>=760:matchMedia('(min-width:900px)').matches,L=albums(),ix=L.findIndex(x=>x.id===a.id),prev=L[ix-1],next=L[ix+1];
 const inb=b.inbox.filter(id=>{const cd=data.cards.find(x=>x.id===id);return cd&&cd.album===a.title&&data.owned[id]&&!b.placed[id]});
 const u=covers[a.title]?covS(covers[a.title],600):'';
 const th=CROMO.theme(a.title);if(!emb)SPCR.check(a,false);
 const left=`<div class="cr-left"><div class="cr-band">TWICE · ${esc(a.type)} · ${era(a)}</div><div class="cr-cov" ${u?`data-src="${u}"`:''}></div><div><h3>${esc(a.title)}</h3>${diagHTML(a)}<div class="cr-meta">${esc(a.type)} · Era ${era(a)}</div><div class="cr-meta" style="margin-top:4px">${n===cs.length?'¡Página completa! 🎉':`Te faltan ${cs.length-n} cromo${cs.length-n>1?'s':''}`}</div></div><div class="cr-ring" style="--p:${Math.round(n/cs.length*100)}"><b>${n}/${cs.length}</b></div></div>`;
 const page=`<div class="cr-page"><div class="cr-page-t"><span>${esc(a.title)}</span><span>Nº 01 – ${String(cs.length).padStart(2,'0')}</span></div>
  ${[['SERIE A · Nº 01–09',x=>!x.v&&!x.kind,''],['SERIE B · Nº 10–18 · otra foto de cada una',x=>x.v==='b',''],['FOTO DE GRUPO · Nº 19',x=>x.kind==='group',' one']].map(([t,f,cl])=>{const L=cs.filter(f);return L.length?`<div class="cr-sec">${t}</div><div class="cr-slots${cl}">${L.map(cd=>slotHTML(cd,cs.indexOf(cd),a,b)).join('')}</div>`:''}).join('')}<div class="cr-sp-t">★ Cromos especiales</div><div class="cr-sps">${SPCR.of(a).map(sp=>SPCR.face(sp)).join('')}</div>${gachaRow(a)}</div>`;
 c.classList.toggle('emb',!!emb);
 c.innerHTML=`${emb?'':`<div class="cr-head"><button class="btn sm" onclick="go19('#/binder')">◀ Álbum de cromos</button><h2>${esc(a.title)}</h2><span></span></div>`}
 ${inb.length?`<div class="cr-tray"><b>Toca una carta y luego su hueco (o arrástrala)</b><div class="inrow" id="tray">${inb.map(id=>{const cd=data.cards.find(x=>x.id===id);return`<div class="inb drag" draggable="true" data-id="${id}">${faceHTML(cd,true)}</div>`}).join('')}<button class="btn sm" id="placeAll">Pegar todas</button></div></div>`:''}
 <div class="cr-book${wide&&!emb?' spread':''}" style="${esc(th.css)}">${emb?'':left}${page}</div>
 ${emb?'':`<div class="cr-nav"><button class="btn sm" ${prev?`onclick="go19('#/binder/${prev.id}')"`:'disabled'}>◀ ${prev?esc(prev.title):''}</button><span class="mid">${ix+1} / ${L.length} · ${wide?'← → para cambiar de álbum · ':''}toca un hueco para ver la carta</span><button class="btn sm" ${next?`onclick="go19('#/binder/${next.id}')"`:'disabled'}>${next?esc(next.title):''} ▶</button></div>`}`;
 IC.scan(c);gachaWire(c,()=>binderPage(c,a,emb));
 b.seen[a.id]=Date.now();save();
 window._crNav=d=>{const t=d>0?next:prev;if(t)go19('#/binder/'+t.id)};
 let sel=null;
 const doPlace=(id,slot)=>{if(!slot||slot.dataset.id!==id){slot&&slot.classList.add('nope');setTimeout(()=>slot&&slot.classList.remove('nope'),400);toast('Esa carta va en el hueco de su integrante');return}
  place(id);binderPage(c,a,emb)};
 c.querySelectorAll('.inb.drag').forEach(el=>{el.ondragstart=e=>e.dataTransfer.setData('text/plain',el.dataset.id);el.onclick=()=>{sel=el.dataset.id;c.querySelectorAll('.inb').forEach(x=>x.classList.toggle('sel',x===el))}});
 c.querySelectorAll('.spc').forEach(s=>{s.onclick=()=>SPCR.open(s.dataset.sp,()=>binderPage(c,a,emb))});
 c.querySelectorAll('.cr-slot').forEach(s=>{s.ondragover=e=>{e.preventDefault()};s.ondrop=e=>{e.preventDefault();doPlace(e.dataTransfer.getData('text/plain'),s)};
  s.onclick=()=>{const id=s.dataset.id;if(sel&&s.classList.contains('empty')){doPlace(sel,s);sel=null}else if(s.classList.contains('ready'))doPlace(id,s);else showDetail(id)};
  s.oncontextmenu=e=>{e.preventDefault();COL.wish(s.dataset.id);toast(COL.state(s.dataset.id).wish?'Añadida a tu wishlist':'Quitada de la wishlist')}});
 const pa=c.querySelector('#placeAll');if(pa)pa.onclick=()=>{inb.forEach(id=>place(id,true));SND.sfx('place');binderPage(c,a,emb)}}
addEventListener('keydown',e=>{if(!location.hash.startsWith('#/binder/')||e.target.matches('input,textarea'))return;if(e.key==='ArrowLeft'&&window._crNav)_crNav(-1);if(e.key==='ArrowRight'&&window._crNav)_crNav(1)});
window.BINDER.mount=(c,a,o={})=>{if(B().auto)stickAll();binderPage(c,a,!!o.embedded)};
window.binderRoute=(c,id)=>{if(B().auto)stickAll();const a=id&&CAT_IDX.album[id];if(a)binderPage(c,a,false);else binderIndex(c)};
UI.view('albums',{skin:'collection',render(c,args){setTimeout(()=>UI.go('#/binder'+(args[0]&&CAT_IDX.album[args[0]]?'/'+args[0]:'')),0)}});
UI.view('binder',{skin:'collection',render(c,args){window.binderRoute(c,args[0])}});
// photocards ya conseguidas antes de existir el álbum → se pegan solas (sin perder nada)
B();if(data.bind.auto)stickAll();
})();
;
/* ================= collection2.js ================= */
// =====================================================================================
//  COLECCIÓN · descubrimiento visual por álbum · integrante · era · especiales · duplicadas · wishlist
//  (sustituye al filtro desplegable heredado; todo es TWICE: no existe selector de grupo)
// =====================================================================================
(function(){
const esc=DS.esc,RK=Object.keys(CATALOG.rarities);
const MODES=[['album','💿 Álbumes'],['member','👤 Integrantes'],['era','🕘 Eras'],['special','🎴 Especiales'],['dups','⧉ Duplicadas'],['wish','♡ Wishlist']];
let CF={state:'all',rar:''};
const photo=()=>data.cards.filter(c=>!c.ext),game=()=>data.cards.filter(c=>c.game),own=c=>!!data.owned[c.id];
const albumsV=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const cardsOfAlb=a=>photo().filter(c=>c.album===a.title);
const apply=cs=>cs.filter(c=>(CF.state==='all'||(CF.state==='own'?own(c):!own(c)))&&(!CF.rar||c.rarity===CF.rar));
function cardHTML(c){const o=own(c),d=o?Math.max(0,(data.duplicates[c.id]||1)-1):0,w=data.col&&data.col.wish&&data.col.wish[c.id];
 return`<button class="cw ${o?'':'miss'}" data-c="${c.id}" data-tip="${esc(c.name)}">${o?faceHTML(c,true):`<div class="pc locked"><div class="in">${window.cardBackHTML?cardBackHTML(c):backHTML(c.album)}</div></div>`}<span class="cwt"><b>${esc(c.member)}</b><span class="tag-r ${c.rarity}">${c.rarity}</span></span>${d?`<span class="cdup">×${d+1}</span>`:''}${w?'<span class="cwish">♥</span>':''}</button>`}
const grid=cs=>cs.length?`<div class="cgrid">${cs.map(cardHTML).join('')}</div>`:DS.empty('🃏','No hay cartas con esta combinación.',{label:'Ver todas',go:"COLL.reset()"});
function bar(){return`<div class="row cbar"><div class="seg">${[['all','Todas'],['own','Tengo'],['miss','Faltan']].map(([k,l])=>`<button data-s="${k}" class="${CF.state===k?'on':''}">${l}</button>`).join('')}</div><div class="seg">${[['','Todas'],...RK.map(r=>[r,r])].map(([k,l])=>`<button data-r="${k}" class="${CF.rar===k?'on':''}">${l}</button>`).join('')}</div></div>`}
const sec=(title,sub,cs,link)=>{const n=cs.filter(own).length;return`<section class="csec"><div class="sec-head"><h3>${title} <small class="mute">${sub||''}</small></h3><div class="row"><span class="chip ${n===cs.length&&cs.length?'off':''}">${n}/${cs.length}</span>${link||''}</div></div>${DS.bar(n,cs.length||1)}${grid(apply(cs))}</section>`};
function overview(){const all=photo(),n=all.filter(own).length,pct=all.length?n/all.length*100:0,as=albumsV(),done=as.filter(a=>cardsOfAlb(a).every(own)).length,mm=CATALOG.members.filter(m=>all.filter(c=>c.member===m.name).every(own)).length,yrs=[...new Set(as.map(a=>a.release.v.slice(0,4)))],ed=yrs.filter(y=>as.filter(a=>a.release.v.startsWith(y)).every(a=>cardsOfAlb(a).every(own))).length,sp=game().filter(own).length;
 return`<div class="card flat covw"><div class="cvring" style="--p:${pct.toFixed(0)}"><b>${pct.toFixed(0)}%</b><span>${n}/${all.length}</span></div><div class="gridx" style="--min:120px;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));flex:1">${[[n+' / '+all.length,'Photocards'],[done+' / '+as.length,'Álbumes'],[mm+' / 9','Integrantes completas'],[ed+' / '+yrs.length,'Eras completas'],[sp+' / '+game().length,'Especiales del juego']].map(([a,b])=>`<div class="kp2"><b>${a}</b><span>${b}</span></div>`).join('')}</div></div>`}
function album(c,arg){const as=albumsV();if(arg&&CAT_IDX.album[arg]){const a=CAT_IDX.album[arg];return`<div class="row spb"><button class="btn ghost sm" onclick="UI.go('#/collection/album')">◀ Todos los álbumes</button><div class="row"><button class="btn sm" onclick="UI.go('#/albums/${a.id}')">💿 Ver álbum 3D</button><button class="btn sm" onclick="UI.go('#/packs/${encodeURIComponent('album:'+a.id)}')">🎁 Ver sobres</button></div></div>${bar()}${sec(esc(a.title),(a.release.v||'').slice(0,4),cardsOfAlb(a))}`}
 return`<div class="gridx g-auto" style="--min:150px">${as.map(a=>{const cs=cardsOfAlb(a),n=cs.filter(own).length,u=covers[a.title]?covS(covers[a.title],300):'';return`<a class="alt" href="#/collection/album/${a.id}"><div class="aart" ${u?`data-src="${u}"`:''}>${u?'':`<span>${esc(a.title)}</span>`}${n===cs.length?'<i class="done">✓</i>':''}</div><b>${esc(a.title)}</b><small>${(a.release.v||'').slice(0,4)}</small>${DS.bar(n,cs.length||9)}<small>${n}/${cs.length}</small></a>`}).join('')}</div>`}
function member(c,arg){const m=arg&&CAT_IDX.member[arg];if(!m)return`<div class="gridx g-auto" style="--min:130px">${CATALOG.members.map(m=>{const cs=photo().filter(c=>c.member===m.name),n=cs.filter(own).length;return`<a class="mt" href="#/collection/member/${m.id}" style="--mc:${(TY[m.name]||[,'#ff5fa2'])[1]}"><i>${m.name[0]}</i><b>${m.name}</b><small>${m.hangul}</small>${DS.bar(n,cs.length||1)}<small>${n}/${cs.length}</small></a>`}).join('')}</div>`;
 const cs=photo().filter(c=>c.member===m.name),as=albumsV().sort((a,b)=>a.release.v<b.release.v?-1:1);
 return`<div class="row spb"><button class="btn ghost sm" onclick="UI.go('#/collection/member')">◀ Integrantes</button><button class="btn sm" onclick="UI.go('#/packs/${encodeURIComponent('member:'+m.id)}')">🎁 Sobres de ${m.name}</button></div><h2 style="margin-top:12px">${m.name} <small class="mute" style="font-size:.5em">${m.hangul}</small></h2>${DS.bar(cs.filter(own).length,cs.length)}${bar()}${as.map(a=>{const x=cs.filter(c=>c.album===a.title);return x.length?`<section class="csec"><div class="sec-head"><h3>${esc(a.title)} <small class="mute">${a.release.v.slice(0,4)}</small></h3><a href="#/albums/${a.id}">Ver álbum ▸</a></div>${grid(apply(x))}</section>`:''}).join('')}`}
function era(c,arg){const as=albumsV(),yrs=[...new Set(as.map(a=>a.release.v.slice(0,4)))];if(arg&&yrs.includes(arg)){const l=as.filter(a=>a.release.v.startsWith(arg));return`<div class="row spb"><button class="btn ghost sm" onclick="UI.go('#/collection/era')">◀ Eras</button><button class="btn sm" onclick="UI.go('#/packs/${encodeURIComponent('era:'+arg)}')">🎁 Sobres de la era</button></div><h2 style="margin-top:12px">Era ${arg}</h2>${bar()}${l.map(a=>sec(esc(a.title),a.type,cardsOfAlb(a),`<a href="#/albums/${a.id}">Ver álbum ▸</a>`)).join('')}`}
 return`<div class="gridx g-auto" style="--min:160px">${yrs.map(y=>{const l=as.filter(a=>a.release.v.startsWith(y)),cs=l.flatMap(cardsOfAlb),n=cs.filter(own).length;return`<a class="mt era" href="#/collection/era/${y}"><i>${y.slice(2)}</i><b>Era ${y}</b><small>${l.map(a=>a.title).slice(0,2).join(' · ')}${l.length>2?' +'+(l.length-2):''}</small>${DS.bar(n,cs.length||1)}<small>${n}/${cs.length}</small></a>`}).join('')}</div>`}
const special=()=>{const g=game();return`<div class="card flat" style="margin-bottom:12px"><span class="chip game">GAME SPECIAL</span> <span class="small">Cartas exclusivas del juego (eventos, cumpleaños, Mi Idol). No son photocards oficiales.</span></div>${bar()}${grid(apply(g))}`};
const fusePanel=()=>{const T=['N','R','SR','SSR'];return`<div class="card fuse"><div class="fuse-h"><b>⚗️ Fusión de duplicados</b><span class="small">Junta duplicadas de una rareza y consigue 1 carta de la siguiente (se prefiere una que aún no tengas). El resultado es definitivo.</span></div><div class="fuse-g">${T.map(r=>{const h=COL.fuseHave(r),n=COL.FUSE[r],ok=h>=n;return`<div class="fuse-r ${ok?'ok':''}"><span class="fr-a r-${r}">${r}</span><i>→</i><span class="fr-a r-${COL.NEXT[r]}">${COL.NEXT[r]}</span><div class="fuse-b"><i style="width:${Math.min(100,h/n*100)}%"></i></div><small>${Math.min(h,n)}/${n}</small><button class="btn sm ${ok?'pri':''}" data-fuse="${r}" ${ok?'':'disabled'}>Fusionar</button></div>`}).join('')}</div></div>`};
function fuseGo(r){const x=COL.fuse(r);if(!x)return;SND.sfx&&SND.sfx('place');UI.keepScroll=true;UI.route();const m=DS.modal({id:'fuse',title:'Fusión completada',cls:'sm',body:`<div style="text-align:center"><p class="small">${x.used} duplicadas ${r} → ${COL.NEXT[r]}</p><div style="width:min(44%,150px);margin:6px auto 10px">${faceHTML(x.card,false,true)}</div><div class="row" style="justify-content:center"><span class="chip ${x.isNew?'acc':''}">${x.isNew?'¡NUEVA!':'Repetida'}</span><span class="chip">${esc(x.card.member)} · ${esc(x.card.album)}</span></div></div>`,actions:'<button class="btn pri" onclick="DS.closeModal(\'fuse\')">Genial</button>'});IC.scan(document.body)}
const dups=()=>{const d=photo().concat(game()).filter(c=>own(c)&&(data.duplicates[c.id]||1)>1);return fusePanel()+(d.length?`<div class="row spb"><span class="small">${d.reduce((s,c)=>s+data.duplicates[c.id]-1,0)} duplicadas · ✨ al convertir: ${d.reduce((s,c)=>s+(data.duplicates[c.id]-1)*COL.DUST_OF[c.rarity],0)}</span><button class="btn pri sm" onclick="COL.dustAll();UI.route()">Convertir duplicados en ✨</button></div>${grid(d)}`:DS.empty('⧉','No tienes cartas duplicadas.',{label:'Ver sobres',go:"UI.go('#/packs')"}))};
const wish=()=>{const w=data.cards.filter(c=>data.col&&data.col.wish&&data.col.wish[c.id]);return w.length?grid(w):DS.empty('♡','Tu wishlist está vacía. Marca cartas con ♡ desde su ficha.',{label:'Explorar la colección',go:"UI.go('#/collection/album')"})};
UI.view('collection',{skin:'collection',render(c,args){const mode=MODES.some(m=>m[0]===args[0])?args[0]:'album',arg=args[1];
 const body={album,member,era,special,dups,wish}[mode](c,arg);
 c.innerHTML=`<div class="phead"><div><h2>Colección</h2></div>${COLTABS('collection/'+mode)}</div>${overview()}<div class="vstack" style="margin-top:var(--s4)">${body}</div>`;
 IC.scan(c);
 const re=()=>{UI.keepScroll=true;UI.route()};c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{CF.state=b.dataset.s;re()});c.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{CF.rar=b.dataset.r;re()});
 c.querySelectorAll('[data-fuse]').forEach(b=>b.onclick=()=>fuseGo(b.dataset.fuse));
 c.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>openCard(b.dataset.c))}});
window.COLL={reset(){CF={state:'all',rar:''};UI.route()}};
})();
;
