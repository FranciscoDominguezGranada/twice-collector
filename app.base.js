/* ================= catalog.js ================= */
// =====================================================================================
//  CATÁLOGO CANÓNICO (fuente única de verdad para sobres, gacha, colección y retos)
//  Cada dato sensible lleva estado:  verified = comprobado con fuente citada
//                                    likely   = conocido, pendiente de fuente (no inventado, pero sin cita)
//                                    unknown  = no verificable → no se muestra como cierto
//  Exactitud > cantidad: lo "unknown" se oculta de sobres y gacha.
//  Validar antes de publicar:  node tools/validate.js   (ver tools/README.txt)
// =====================================================================================
const CATALOG={
 version:'2026.10.04',
 sources:{
  sk_debut:'https://www.sportskeeda.com/us/k-pop/news-this-another-level-fans-go-gaga-twice-teases-collaboration-megan-thee-stallion-upcoming-album-strategy',
  kf_feel:'https://breezewiki.discard.no/kpop/wiki/Feel_Special',
  ebay_feel:'https://www.ebay.com/p/20046046739',
  kf_strategy:'https://kpop.fandom.com/wiki/Strategy',
  nme_strategy:'https://www.nme.com/reviews/album/twice-strategy-review-38',
  ta_ten:'https://www.tenasia.com/amp/2025101006034',
  mm_dive:'https://www.melodicmag.com/news/twice-announce-their-new-mini-album-strategy',
  ta_youth:'https://www.tenasia.com/amp/2024102195864'},
 // rarezas: configurables (peso = probabilidad relativa; fx = efectos de apertura/revelación)
 rarities:{
  N:  {weight:52,stars:1,name:'Normal',      color:'#9aa3ad',glow:'#cfd6de',fx:'none'},
  R:  {weight:28,stars:2,name:'Rare',        color:'#4aa3ff',glow:'#9fd0ff',fx:'spark'},
  SR: {weight:14,stars:3,name:'Super Rare',  color:'#b56bff',glow:'#dcb8ff',fx:'beam'},
  SSR:{weight:5, stars:4,name:'Special SR',  color:'#ffc23d',glow:'#ffe7a3',fx:'gold'},
  UR: {weight:1, stars:5,name:'Ultra Rare',  color:'#ff5fa2',glow:'#ffffff',fx:'rainbow'}},
 // reparto de rarezas dentro de cada álbum (1 carta por integrante): patrón fijo, no aleatorio
 rarityPattern:['UR','SSR','SR','SR','R','R','N','N','N'],groupRarity:'SSR',
 groups:[{id:'twice',name:'TWICE',hangul:'트와이스',agency:'JYP Entertainment',fandom:'ONCE',debut:{v:'2015-10-20',s:'verified',src:'sk_debut'}}],
 members:[
  {id:'nayeon',   group:'twice',name:'Nayeon',   hangul:'나연',birth:{v:'1995-09-22',s:'likely'},nat:{v:'KR',s:'likely'}},
  {id:'jeongyeon',group:'twice',name:'Jeongyeon',hangul:'정연',birth:{v:'1996-11-01',s:'likely'},nat:{v:'KR',s:'likely'}},
  {id:'momo',     group:'twice',name:'Momo',     hangul:'모모',birth:{v:'1996-11-09',s:'likely'},nat:{v:'JP',s:'likely'}},
  {id:'sana',     group:'twice',name:'Sana',     hangul:'사나',birth:{v:'1996-12-29',s:'likely'},nat:{v:'JP',s:'likely'}},
  {id:'jihyo',    group:'twice',name:'Jihyo',    hangul:'지효',birth:{v:'1997-02-01',s:'likely'},nat:{v:'KR',s:'likely'}},
  {id:'mina',     group:'twice',name:'Mina',     hangul:'미나',birth:{v:'1997-03-24',s:'likely'},nat:{v:'JP',s:'likely'}},
  {id:'dahyun',   group:'twice',name:'Dahyun',   hangul:'다현',birth:{v:'1998-05-28',s:'likely'},nat:{v:'KR',s:'likely'}},
  {id:'chaeyoung',group:'twice',name:'Chaeyoung',hangul:'채영',birth:{v:'1999-04-23',s:'likely'},nat:{v:'KR',s:'likely'}},
  {id:'tzuyu',    group:'twice',name:'Tzuyu',    hangul:'쯔위',birth:{v:'1999-06-14',s:'likely'},nat:{v:'TW',s:'likely'}}],
 // álbumes: id estable · title = título visible (no cambiar: lo usan las partidas guardadas)
 // market KR/JP/EN · type · release{v,s,src} · track{v,s} (canción principal) · format (edición física) · status (visibilidad)
 albums:[
  {id:'the-story-begins',title:'The Story Begins',market:'KR',type:'Mini 1',release:{v:'2015-10-20',s:'verified',src:'sk_debut'},track:{v:'Like Ooh-Ahh',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'page-two',title:'Page Two',market:'KR',type:'Mini 2',release:{v:'2016-04-25',s:'likely'},track:{v:'Cheer Up',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'twicecoaster-lane-1',title:'TWICEcoaster: Lane 1',market:'KR',type:'Mini 3',release:{v:'2016-10-24',s:'likely'},track:{v:'TT',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'twicecoaster-lane-2',title:'TWICEcoaster: Lane 2',market:'KR',type:'Especial',release:{v:'2017-02-20',s:'likely'},track:{v:'Knock Knock',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'signal',title:'Signal',market:'KR',type:'Mini 4',release:{v:'2017-05-15',s:'likely'},track:{v:'Signal',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'twicetagram',title:'Twicetagram',market:'KR',type:'Álbum 1',release:{v:'2017-10-30',s:'likely'},track:{v:'Likey',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'merry-and-happy',title:'Merry & Happy',market:'KR',type:'Repackage',release:{v:'2017-12-11',s:'likely'},track:{v:'Heart Shaker',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'what-is-love',title:'What Is Love?',market:'KR',type:'Mini 5',release:{v:'2018-04-09',s:'likely'},track:{v:'What Is Love?',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'summer-nights',title:'Summer Nights',market:'KR',type:'Especial',release:{v:'2018-07-09',s:'likely'},track:{v:'Dance the Night Away',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'yes-or-yes',title:'Yes or Yes',market:'KR',type:'Mini 6',release:{v:'2018-11-05',s:'likely'},track:{v:'Yes or Yes',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'the-year-of-yes',title:'The Year of Yes',market:'KR',type:'Especial',release:{v:'2018-12-12',s:'likely'},track:{v:'The Best Thing I Ever Did',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'fancy-you',title:'Fancy You',market:'KR',type:'Mini 7',release:{v:'2019-04-22',s:'likely'},track:{v:'Fancy',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'feel-special',title:'Feel Special',market:'KR',type:'Mini 8',release:{v:'2019-09-23',s:'verified',src:'kf_feel'},track:{v:'Feel Special',s:'verified',src:'kf_feel'},format:{v:'photobook',s:'verified',src:'ebay_feel'},
   contents:{v:['photobook 88p','CD','lyrics','5 photocards','gold photocard'],s:'verified',src:'ebay_feel'}},
  {id:'more-and-more',title:'More & More',market:'KR',type:'Mini 9',release:{v:'2020-06-01',s:'likely'},track:{v:'More & More',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'eyes-wide-open',title:'Eyes Wide Open',market:'KR',type:'Álbum 2',release:{v:'2020-10-26',s:'likely'},track:{v:"I Can't Stop Me",s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'taste-of-love',title:'Taste of Love',market:'KR',type:'Mini 10',release:{v:'2021-06-11',s:'likely'},track:{v:'Alcohol-Free',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'formula-of-love',title:'Formula of Love: O+T=<3',market:'KR',type:'Álbum 3',release:{v:'2021-11-12',s:'likely'},track:{v:'Scientist',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'between-1-and-2',title:'Between 1&2',market:'KR',type:'Mini 11',release:{v:'2022-08-26',s:'likely'},track:{v:'Talk that Talk',s:'likely'},format:{v:'box',s:'likely'}},
  {id:'ready-to-be',title:'Ready to Be',market:'KR',type:'Mini 12',release:{v:'2023-03-10',s:'likely'},track:{v:'Set Me Free',s:'likely'},format:{v:'digipack',s:'likely'}},
  {id:'with-you-th',title:'With YOU-th',market:'KR',type:'Mini 13',release:{v:'2024-02-23',s:'likely',note:'mes verificado (febrero 2024)',src:'ta_youth'},track:{v:'One Spark',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'strategy',title:'Strategy',market:'KR',type:'Mini 14',release:{v:'2024-12-06',s:'verified',src:'nme_strategy'},track:{v:'Strategy',s:'verified',src:'kf_strategy'},format:{v:'photobook',s:'likely'}},
  {id:'this-is-for',title:'THIS IS FOR',market:'KR',type:'Álbum 4',release:{v:'2025-07-11',s:'likely'},track:{v:'THIS IS FOR',s:'likely'},format:{v:'photobook',s:'likely'}},
  {id:'ten-the-story-goes-on',title:'TEN: The Story Goes On',market:'KR',type:'Especial',release:{v:'2025-10-10',s:'verified',src:'ta_ten'},track:{v:'ME+YOU',s:'verified',src:'ta_ten'},format:{v:'square',s:'likely'}},
  // Japón
  {id:'hashtwice',title:'#TWICE',market:'JP',type:'Recopilatorio',release:{v:'2017-06-28',s:'likely'},track:{v:null,s:'unknown'},format:{v:'jewel',s:'likely'}},
  {id:'candy-pop',title:'Candy Pop',market:'JP',type:'Single',release:{v:'2018-02-07',s:'likely'},track:{v:'Candy Pop',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'wake-me-up',title:'Wake Me Up',market:'JP',type:'Single',release:{v:'2018-05-16',s:'likely'},track:{v:'Wake Me Up',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'bdz',title:'BDZ',market:'JP',type:'Álbum JP 1',release:{v:'2018-09-12',s:'likely'},track:{v:'BDZ',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'hashtwice2',title:'#TWICE2',market:'JP',type:'Recopilatorio',release:{v:'2019-03-06',s:'likely'},track:{v:null,s:'unknown'},format:{v:'jewel',s:'likely'}},
  {id:'happy-happy',title:'Happy Happy',market:'JP',type:'Single',release:{v:'2019-07-17',s:'likely'},track:{v:'Happy Happy',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'breakthrough',title:'Breakthrough',market:'JP',type:'Single',release:{v:'2019-07-24',s:'likely'},track:{v:'Breakthrough',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'and-twice',title:'&TWICE',market:'JP',type:'Álbum JP 2',release:{v:'2019-11-20',s:'likely'},track:{v:'Fake & True',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'fanfare',title:'Fanfare',market:'JP',type:'Single',release:{v:'2020-07-08',s:'likely'},track:{v:'Fanfare',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'hashtwice3',title:'#TWICE3',market:'JP',type:'Recopilatorio',release:{v:'2020-09-16',s:'likely'},track:{v:null,s:'unknown'},format:{v:'jewel',s:'likely'}},
  {id:'better',title:'Better',market:'JP',type:'Single',release:{v:'2020-11-18',s:'likely'},track:{v:'Better',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'kura-kura',title:'Kura Kura',market:'JP',type:'Single',release:{v:'2021-05-12',s:'likely'},track:{v:'Kura Kura',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'perfect-world',title:'Perfect World',market:'JP',type:'Álbum JP 3',release:{v:'2021-07-28',s:'likely'},track:{v:'Perfect World',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'doughnut',title:'Doughnut',market:'JP',type:'Single',release:{v:'2021-12-15',s:'likely'},track:{v:'Doughnut',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'hashtwice4',title:'#TWICE4',market:'JP',type:'Recopilatorio',release:{v:'2022-03-16',s:'likely'},track:{v:null,s:'unknown'},format:{v:'jewel',s:'likely'}},
  {id:'celebrate',title:'Celebrate',market:'JP',type:'Álbum JP 4',release:{v:'2022-07-27',s:'likely'},track:{v:'Celebrate',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'hare-hare',title:'Hare Hare',market:'JP',type:'Single',release:{v:'2023-05-31',s:'likely'},track:{v:'Hare Hare',s:'likely'},format:{v:'jewel',s:'likely'}},
  {id:'dive',title:'DIVE',market:'JP',type:'Álbum JP 5',release:{v:'2024-07-17',s:'verified',src:'mm_dive'},track:{v:null,s:'unknown'},format:{v:'jewel',s:'likely'}},
  // Inglés (sencillos digitales: sin edición física de photocards)
  {id:'the-feels',title:'The Feels',market:'EN',type:'Sencillo digital',release:{v:'2021-10-01',s:'likely'},track:{v:'The Feels',s:'likely'},format:{v:null,s:'unknown'},physical:false},
  {id:'moonlight-sunrise',title:'Moonlight Sunrise',market:'EN',type:'Sencillo digital',release:{v:'2023-01-20',s:'likely'},track:{v:'Moonlight Sunrise',s:'likely'},format:{v:null,s:'unknown'},physical:false},
  {id:'i-got-you',title:'I Got You',market:'EN',type:'Sencillo digital',release:{v:'2024-02-02',s:'likely'},track:{v:'I Got You',s:'likely'},format:{v:null,s:'unknown'},physical:false},
  // sin poder verificar → ocultos (no se inventan)
  {id:'enemy',title:'ENEMY',market:'JP',type:'?',release:{v:null,s:'unknown'},track:{v:null,s:'unknown'},format:{v:null,s:'unknown'},status:'unknown'},
  {id:'hashtwice5',title:'#TWICE5',market:'JP',type:'Recopilatorio',release:{v:null,s:'unknown'},track:{v:null,s:'unknown'},format:{v:null,s:'unknown'},status:'unknown'},
  {id:'dance-again',title:'Dance Again',market:'?',type:'?',release:{v:null,s:'unknown'},track:{v:null,s:'unknown'},format:{v:null,s:'unknown'},status:'unknown'},
  // corrección: "One Spark" es la canción principal de With YOU-th, no un álbum
  {id:'one-spark',title:'One Spark',market:'KR',type:'(no es un álbum)',release:{v:null,s:'unknown'},track:{v:null,s:'unknown'},format:{v:null,s:'unknown'},status:'removed',note:'canción de With YOU-th'}],
 // versiones físicas: SOLO las comprobadas. Un álbum sin versiones verificadas muestra "versiones sin verificar".
 versions:[
  {id:'feel-special-a',album:'feel-special',name:'A',s:'verified',src:'kf_feel'},{id:'feel-special-b',album:'feel-special',name:'B',s:'verified',src:'kf_feel'},{id:'feel-special-c',album:'feel-special',name:'C',s:'verified',src:'kf_feel'},
  {id:'strategy-step1',album:'strategy',name:'Step 1',s:'verified',src:'kf_strategy'},{id:'strategy-step2',album:'strategy',name:'Step 2',s:'verified',src:'kf_strategy'},{id:'strategy-step3',album:'strategy',name:'Step 3',s:'verified',src:'kf_strategy'},
  ...['nayeon','jeongyeon','momo','sana','jihyo','mina','dahyun','chaeyoung','tzuyu'].map(m=>({id:'strategy-step4-'+m,album:'strategy',name:'Step 4 · '+m[0].toUpperCase()+m.slice(1),member:m,s:'verified',src:'kf_strategy'})),
  {id:'strategy-highlight',album:'strategy',name:'Highlight',s:'verified',src:'kf_strategy'},
  {id:'strategy-vinyl-peppermint',album:'strategy',name:'Peppermint Vinyl (Target)',format:'vinyl',s:'verified',src:'kf_strategy'},{id:'strategy-vinyl-sugarfrost',album:'strategy',name:'Sugar Frost Vinyl (TWICE Store)',format:'vinyl',s:'verified',src:'kf_strategy'},
  {id:'strategy-nemo-1',album:'strategy',name:'Platform Nemo · Step 1',format:'nemo',s:'verified',src:'kf_strategy'},{id:'strategy-nemo-2',album:'strategy',name:'Platform Nemo · Step 2',format:'nemo',s:'verified',src:'kf_strategy'},{id:'strategy-nemo-3',album:'strategy',name:'Platform Nemo · Step 3',format:'nemo',s:'verified',src:'kf_strategy'}]};

// ---------- utilidades del catálogo (sin duplicar datos: todo se deriva de aquí) ----------
const CAT_IDX={album:{},member:{}};CATALOG.albums.forEach(a=>{a.group=a.group||'twice';a.status=a.status||'active';CAT_IDX.album[a.id]=a});CATALOG.members.forEach(m=>CAT_IDX.member[m.id]=m);
const catNorm=s=>(s||'').toLowerCase().replace(/[^a-z0-9#&]+/g,'');
const catAlbumByTitle=t=>CATALOG.albums.find(a=>catNorm(a.title)===catNorm(t))||null;
const catVisibleAlbums=()=>CATALOG.albums.filter(a=>a.status==='active').sort((x,y)=>(x.release.v||'9999')<(y.release.v||'9999')?-1:1);
const catVersions=albumId=>CATALOG.versions.filter(v=>v.album===albumId);
const catEra=a=>a?a.id:null; // la "era" de una photocard es su álbum (comeback)
// photocards derivadas: 1 por integrante y álbum físico; la imagen solo cuenta como "oficial" si viene de una fuente verificada
function catPhotocards(albumId){const a=CAT_IDX.album[albumId];if(!a||a.physical===false||a.status!=='active')return[];
 const h=t=>{let x=2166136261;for(const c of t)x=Math.imul(x^c.charCodeAt(0),16777619);return x>>>0};const order=[...CATALOG.members].sort((p,q)=>h(albumId+p.id)-h(albumId+q.id));
 // 19 cromos por álbum: Serie A (1 por integrante) + Serie B (otra foto promocional de cada una, rareza distinta) + 1 foto de grupo
 const pat=CATALOG.rarityPattern,img={url:null,s:'unknown'};
 const A=CATALOG.members.map(m=>({id:`${albumId}--${m.id}`,album:albumId,era:catEra(a),member:m.id,version:null,rarity:pat[order.indexOf(m)],image:img}));
 const B=CATALOG.members.map(m=>({id:`${albumId}--${m.id}--b`,album:albumId,era:catEra(a),member:m.id,variant:'b',version:null,rarity:pat[(order.indexOf(m)+4)%pat.length],image:img}));
 const G={id:`${albumId}--group`,album:albumId,era:catEra(a),member:null,group:true,version:null,rarity:CATALOG.groupRarity||'SSR',image:img};
 return A.concat(B,[G])}

// ---------- packaging y procedencia (accesores; NO se inventan medidas) ----------
// type: photobook | digipack | jewel | box | square | magazine · dims = medidas oficiales (null = sin datos) · estimated = proporciones razonables
const PKG_TYPES={photobook:{name:'Photobook',material:'Tapa de cartón laminado con páginas',ar:.73,dr:.1},square:{name:'Funda cuadrada',material:'Cartón laminado',ar:1,dr:.08},box:{name:'Caja con funda',material:'Caja rígida de cartón',ar:.76,dr:.2},
 digipack:{name:'Digipack',material:'Cartón plegable mate/satinado',ar:1.12,dr:.05},jewel:{name:'CD en caja (jewel case)',material:'Plástico transparente con bandeja',ar:1.136,dr:.075},magazine:{name:'Revista',material:'Papel couché',ar:.78,dr:.04}};
function catPackaging(a){const f=a.format||{},t=PKG_TYPES[f.v]?f.v:null;if(!t)return{type:null,name:'Formato sin verificar',estimated:true,ar:.73,dr:.1,material:'',dims:null,s:'unknown'};const o=PKG_TYPES[t];
 return{type:t,name:o.name,material:o.material,ar:o.ar,dr:o.dr,dims:a.dims||null,estimated:!(a.dims&&a.dims.w),s:f.s||'unknown',verifiedFormat:f.s==='verified'}}
function catProv(a){const r=a.release||{},src=r.src?CATALOG.sources[r.src]:null;return{source:src?r.src:null,sourceUrl:src||null,verified:r.s==='verified',verificationDate:r.s==='verified'?CATALOG.version:null}}
const STATUS_LABEL={verified:'Verificado',likely:'Pendiente de fuente',unknown:'Desconocido'};
if(typeof module!=='undefined')module.exports={CATALOG,catPhotocards,catVisibleAlbums,catVersions,catPackaging,catProv,PKG_TYPES};
;
/* ================= shared.js ================= */
// ====================== DATOS COMPARTIDOS (sobres + gacha) ======================
const MEM=[
 {n:'Nayeon',c:'#5fc8ff',k:'나연'},{n:'Jeongyeon',c:'#b8e15a',k:'정연'},{n:'Momo',c:'#ff7eb6',k:'모모'},
 {n:'Sana',c:'#a77bff',k:'사나'},{n:'Jihyo',c:'#fcc89b',k:'지효'},{n:'Mina',c:'#6fe3c6',k:'미나'},
 {n:'Dahyun',c:'#f4f4f4',k:'다현'},{n:'Chaeyoung',c:'#ff4b4b',k:'채영'},{n:'Tzuyu',c:'#2f5bff',k:'쯔위'}];
// [título, año, canción principal, formato físico]
// formatos: photobook (libro grande), square (funda cuadrada), box (caja con funda), digipack (cartón plegable), jewel (CD japonés en caja de plástico)
// subconjunto del gacha: el ORDEN no se puede cambiar (las partidas guardan índices). Datos derivados del catálogo.
const GACHA_IDS=['the-story-begins','page-two','twicecoaster-lane-1','signal','twicetagram','what-is-love','yes-or-yes','fancy-you','feel-special','more-and-more','eyes-wide-open','taste-of-love','formula-of-love','between-1-and-2','ready-to-be','with-you-th','strategy','this-is-for','ten-the-story-goes-on','bdz','and-twice','celebrate'];
const ALB=GACHA_IDS.map(id=>{const a=CAT_IDX.album[id];return[a.title,+(a.release.v||'0').slice(0,4),a.track.v,a.format.v||'photobook',id]});
const FMT={photobook:{name:'Photobook',ar:.73,t:.09,open:'cover'},square:{name:'Funda cuadrada',ar:1,t:.075,open:'cover'},box:{name:'Caja con funda',ar:.76,t:.2,open:'box'},
 digipack:{name:'Digipack',ar:1.12,t:.05,open:'digi'},jewel:{name:'CD en caja (Japón)',ar:1.136,t:.07,open:'jewel'}};
const fmtOf=i=>FMT[ALB[i][3]]||FMT.photobook;
const normT=s=>(s||'').toLowerCase().replace(/[^a-z0-9#&]+/g,'');
// clave de guardado de la máquina (la app de sobres la lee para la colección unificada)
const CAP_KEY='twiceCapsuleStation_v1';
// ====================== PROGRESO COMPARTIDO: monedas, tickets, estadísticas, retos ======================
const MAIN_KEY='twiceGachaV3',ST_KEY='twiceStats';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function stLoad(){let s;try{s=JSON.parse(localStorage.getItem(ST_KEY))}catch(e){}s=s||{};s.total=s.total||{};s.ach=s.ach||{};s.tickets=s.tickets||0;
 if(s.day!==today()){s.day=today();s.d={};s.mis=null;s.spun=false}return s}
function stSave(s){try{localStorage.setItem(ST_KEY,JSON.stringify(s))}catch(e){}}
function stat(k,n=1){const s=stLoad();s.d[k]=(s.d[k]||0)+n;s.total[k]=(s.total[k]||0)+n;stSave(s);return s}
// monedero único (vive en la partida de los sobres)
function walletGet(){try{const d=JSON.parse(localStorage.getItem(MAIN_KEY));return d&&typeof d.coins==='number'?d.coins:null}catch(e){return null}}
function walletAdd(n){try{const d=JSON.parse(localStorage.getItem(MAIN_KEY));if(d){d.coins=(d.coins||0)+n;localStorage.setItem(MAIN_KEY,JSON.stringify(d));return d.coins}}catch(e){}return null}
// misiones del día (3, deterministas por fecha) y logros
const MISSIONS=[['packs',3,'Abre 3 sobres',150],['packs',6,'Abre 6 sobres',300],['spins',2,'Gira el gacha 2 veces',200],['puzzles',1,'Gana un puzzle o minijuego',200],['puzzles',3,'Gana 3 minijuegos',400],
 ['albums',1,'Abre un álbum del gacha',150],['songs',3,'Acierta 3 canciones en «Adivina la canción»',250],['scans',1,'Escanea un CD',300],['quiz',1,'Completa un quiz',150]];
function todaysMissions(s){if(!s.mis){let h=0;for(const c of s.day)h=(h*31+c.charCodeAt(0))>>>0;const pool=[...MISSIONS.keys()],pick=[];while(pick.length<3){const k=pool.splice(h%pool.length,1)[0];pick.push(k);h=(h*1103515245+12345)>>>0}s.mis=pick.map(k=>({k,claimed:false}));stSave(s)}return s.mis}
const ACH=[['packs',1,'Primer sobre',100],['packs',50,'50 sobres abiertos',800],['spins',10,'10 giros en el gacha',500],['albums',5,'5 álbumes abiertos',600],['puzzles',10,'10 minijuegos ganados',700],
 ['songs',20,'20 canciones acertadas',800],['scans',1,'Primer CD escaneado',500],['streak',7,'7 días seguidos',1500],['streak',30,'30 días seguidos',5000]];
// calendario: cumpleaños, aniversario y photoshoot de la semana
const BDAY=[[9,22],[11,1],[11,9],[12,29],[2,1],[3,24],[5,28],[4,23],[6,14]];
function specialPacks(now=new Date()){const out=[],y=now.getFullYear(),dd=(m,d)=>Math.round((new Date(y,m-1,d)-new Date(y,now.getMonth(),now.getDate()))/864e5);
 BDAY.forEach(([m,d],mi)=>{const k=dd(m,d);if(k>=-1&&k<=6)out.push({type:'bday',mi,title:`Cumpleaños de ${MEM[mi].n}`,sub:k===0?'¡Es hoy!':k>0?`Faltan ${k} días`:'Fue ayer',until:`${d}/${m}`})});
 const ka=dd(10,20);if(ka>=-3&&ka<=7)out.push({type:'anniv',title:`Aniversario de TWICE · ${y-2015} años`,sub:ka===0?'¡Hoy es el aniversario!':ka>0?`Faltan ${ka} días`:'Celebración',until:'20/10'});
 const wk=Math.floor((now-new Date(2015,9,19))/6048e5),ai=wk%ALB.length;out.push({type:'shoot',alb:ai,title:`Photoshoot · ${ALB[ai][0]}`,sub:'Cambia cada semana',until:'domingo'});
 out.push({type:'live',title:'En directo · concierto',sub:'Siempre disponible',until:''});return out}
;
/* ================= app.js ================= */
// v15: en navegador, iTunes/Deezer por JSONP si fetch falla por CORS
(function(){const F=window.fetch.bind(window);let n=0;
 const jp=u=>new Promise((res,rej)=>{const cb='__fj'+(n++),s=document.createElement('script');const t=setTimeout(()=>{window[cb]=()=>{};s.remove();rej(new Error('jsonp'))},9000);
  window[cb]=d=>{clearTimeout(t);window[cb]=()=>{};s.remove();res(d)};s.onerror=()=>{clearTimeout(t);s.remove();rej(new Error('jsonp'))};
  s.src=u+(u.includes('?')?'&':'?')+(u.includes('deezer.com')?'output=jsonp&':'')+'callback='+cb;document.head.appendChild(s)});
 window.fetch=function(u,o){const url=typeof u==='string'?u:(u&&u.url)||'';if(/^https:\/\/(itunes\.apple\.com|api\.deezer\.com)\//.test(url))return F(u,o).catch(()=>jp(url).then(d=>({ok:true,status:200,json:async()=>d})));return F(u,o)}})();
const members=['Nayeon','Jeongyeon','Momo','Sana','Jihyo','Mina','Dahyun','Chaeyoung','Tzuyu'];
// [álbum, 'AAAA-MM' de lanzamiento]. Meses de los álbumes con "~" son estimados: edítalos si hace falta.
const albumList=[['The Story Begins','2015-10'],['Page Two','2016-04'],['TWICEcoaster: Lane 1','2016-10'],['TWICEcoaster: Lane 2','2017-02'],['Signal','2017-05'],['Twicetagram','2017-10'],['Merry & Happy','2017-12'],['What Is Love?','2018-04'],['Summer Nights','2018-07'],['Yes or Yes','2018-11'],['The Year of Yes','2018-12'],['Fancy You','2019-04'],['Feel Special','2019-09'],['&TWICE','2019-07'],['More & More','2020-06'],['Eyes Wide Open','2020-10'],['Taste of Love','2021-06'],['Formula of Love: O+T=<3','2021-11'],['Celebrate','2022-09'],['Between 1&2','2022-08'],['Ready to Be','2023-03'],['DIVE','2024-01'],['With YOU-th','2024-02'],['Strategy','2024-07'],['THIS IS FOR','2025-07'],['ENEMY','2025-01'],['#TWICE','2017-06'],['#TWICE2','2019-06'],['#TWICE3','2020-06'],['#TWICE4','2022-06'],['#TWICE5','2025-06'],['Candy Pop','2018-06'],['Wake Me Up','2018-10'],['BDZ','2018-10'],['Happy Happy','2019-06'],['Breakthrough','2019-06'],['Fanfare','2020-06'],['Better','2020-06'],['Kura Kura','2021-06'],['Perfect World','2021-06'],['Doughnut','2021-06'],['Hare Hare','2023-06'],['Moonlight Sunrise','2023-06'],['I Got You','2024-06'],['One Spark','2024-06'],['Dance Again','2023-06'],['The Feels','2021-10']];
const albumMap=Object.fromEntries(albumList);
const ym=s=>{const m=/^(\d{4})-(\d{2})/.exec(s||'');return m?(+m[1])*12+(+m[2]):0};
const rarityInfo={N:{weight:52,stars:1,name:'Normal'},R:{weight:28,stars:2,name:'Rare'},SR:{weight:14,stars:3,name:'Super Rare'},SSR:{weight:5,stars:4,name:'Special SR'},UR:{weight:1,stars:5,name:'Ultra Rare'}};
const rKeys=Object.keys(rarityInfo),legacy={Common:'N',Rare:'R','Super Rare':'SR',Special:'SSR','Ultra Rare':'UR'};
const fixR=r=>rarityInfo[r]?r:(legacy[r]||'N');
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const $=q=>document.querySelector(q);
// ---------- Imágenes libres (Wikimedia Commons, CC/PD) con fecha para casar con la época ----------
let imgPool={};try{imgPool=JSON.parse(localStorage.getItem('twiceImgPool2')||'{}')}catch(e){}
const imgState={ok:0,fail:0,busy:false},okLic=/^(cc[ -]by|cc0|public domain|pd)/i;
const strip=h=>{const d=document.createElement('div');d.innerHTML=h||'';return(d.textContent||'').trim()};
async function search(q){const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=800&gsrsearch='+encodeURIComponent(q);const j=await(await fetch(u)).json();return Object.values((j.query||{}).pages||{})}
const ALIAS={Nayeon:['nayeon','나연'],Jeongyeon:['jeongyeon','정연'],Momo:['momo','모모'],Sana:['sana','사나'],Jihyo:['jihyo','지효'],Mina:['mina','미나'],Dahyun:['dahyun','다현'],Chaeyoung:['chaeyoung','채영'],Tzuyu:['tzuyu','쯔위']};
const hasA=(t,m)=>ALIAS[m].some(a=>/^[a-z]+$/.test(a)?new RegExp('(^|[^a-z])'+a+'([^a-z]|$)').test(t):t.includes(a)),isTw=t=>t.includes('twice')||t.includes('트와이스');
function titleDate(t){let m=/(?:^|[^0-9])((?:19|20)\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?([0-3]\d)(?!\d)/.exec(t);if(m)return[m[1],m[2]];m=/(?:^|[^0-9])(1[5-9]|2[0-6])(0[1-9]|1[0-2])([0-3]\d)(?!\d)/.exec(t);if(m)return['20'+m[1],m[2]];m=/(?:^|[^0-9])(20(?:1[5-9]|2[0-6]))(?!\d)/.exec(t);return m?[m[1],null]:null}
const dnum=d=>d?+d[0]*12+(d[1]?+d[1]:6):0,dstr=d=>d?(d[1]?d[0]+'-'+d[1]:d[0]):'';
async function openverse(m){const j=await(await fetch('https://api.openverse.org/v1/images/?page_size=20&q='+encodeURIComponent('TWICE '+m))).json();
  return(j.results||[]).map(r=>{const t=(r.title||'').toLowerCase();if(!hasA(t,m)||!isTw(t)||(r.width&&r.width<600))return null;const d=titleDate(t);return{url:r.url,source:r.foreign_landing_url||r.url,license:('CC '+(r.license||'').toUpperCase()+' '+(r.license_version||'')).trim(),author:r.creator||'Openverse',ym:dnum(d),date:dstr(d)}}).filter(Boolean)}
async function fetchMember(m){
  const all=[].concat(...await Promise.all(['TWICE '+m,'TWICE '+m+' concert',ALIAS[m][1]+' 트와이스'].map(q=>search(q).catch(()=>[])))),seen={},others=members.filter(x=>x!==m),out=[];
  for(const p of all){if(seen[p.title])continue;seen[p.title]=1;const ii=(p.imageinfo||[])[0];if(!ii||!ii.thumburl)continue;
    const t=p.title.toLowerCase(),md=ii.extmetadata||{},lic=(md.LicenseShortName||{}).value||'',desc=strip((md.ImageDescription||{}).value).toLowerCase();
    if(!/\.(jpe?g|png|webp)$/.test(t)||!hasA(t,m)||!isTw(t+' '+desc)||!okLic.test(lic)||others.some(o=>hasA(t,o))||ii.width<700||ii.height<700)continue;
    const dt=strip((md.DateTimeOriginal||md.DateTime||{}).value),mm=/(\d{4})-(\d{2})/.exec(dt),d=mm?[mm[1],mm[2]]:titleDate(t);
    out.push({url:ii.thumburl,source:ii.descriptionurl,license:lic,author:strip((md.Artist||{}).value)||'Wikimedia Commons',ym:dnum(d),date:dstr(d)})}
  if(out.length<6){try{out.push(...await openverse(m))}catch(e){}}
  return out.slice(0,60)}
async function loadImages(force){
  if(imgState.busy)return;imgState.busy=true;imgState.ok=imgState.fail=0;setStatus();
  for(const m of members){if(!force&&imgPool[m]&&imgPool[m].length){imgState.ok++;continue}
    try{const l=await fetchMember(m);if(l.length){imgPool[m]=l;imgState.ok++}else imgState.fail++}catch(e){imgState.fail++}}
  try{localStorage.setItem('twiceImgPool2',JSON.stringify(imgPool))}catch(e){}
  imgState.busy=false;setStatus()}
const imgText=()=>imgState.busy?'Cargando fotos…':`Fotos en línea: ${imgState.ok}/${members.length} miembros`+(imgState.fail?` · ${imgState.fail} sin resultados`:'');
function setStatus(){const n=$('#imgStatus');if(n)n.textContent=imgText()}
let vidPool={};try{vidPool=JSON.parse(localStorage.getItem('twiceVid')||'{}')}catch(e){}
async function vsearch(q){const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=30&prop=videoinfo&viprop=url%7Cextmetadata%7Cderivatives&gsrsearch='+encodeURIComponent(q+' filetype:video');const j=await(await fetch(u)).json();return Object.values((j.query||{}).pages||{})}
function vitem(p){const vi=(p.videoinfo||[])[0];if(!vi)return null;const md=vi.extmetadata||{},lic=(md.LicenseShortName||{}).value||'';if(!okLic.test(lic))return null;const d=(vi.derivatives||[]).filter(x=>/webm|mp4/.test(x.type||'')&&(x.height||9999)<=540).sort((a,b)=>(b.height||0)-(a.height||0));return{src:d.length?d[0].src:vi.url,source:vi.descriptionurl,license:lic,author:strip((md.Artist||{}).value)||'Wikimedia Commons'}}
async function loadVideos(){if(vidPool._t&&Date.now()-vidPool._t<5*864e5)return;const out={_t:Date.now()};
  try{out._group=(await vsearch('TWICE')).filter(p=>isTw(p.title.toLowerCase())).map(vitem).filter(Boolean).slice(0,6)}catch(e){}
  for(const m of members){try{out[m]=(await vsearch('TWICE '+m)).filter(p=>{const t=p.title.toLowerCase();return hasA(t,m)&&isTw(t)}).map(vitem).filter(Boolean).slice(0,4)}catch(e){}}
  vidPool=out;try{localStorage.setItem('twiceVid',JSON.stringify(out))}catch(e){}}
function videoFor(card){const l=(vidPool[card.member]&&vidPool[card.member].length?vidPool[card.member]:vidPool._group)||[];return l.length?l[hash(card.id)%l.length]:null}
// foto más cercana al mes de lanzamiento del álbum (+1 mes de promoción)
function photoFor(card){if(card.ext)return{url:card.image_url,source:localStorage.getItem('twiceSrc')||'#',license:'Fuente personal',author:'',date:'',d:0};const p=imgPool[card.member];
  if(!p||!p.length)return card.image_url?{url:card.image_url,source:card.source_url,license:card.source_license,author:card.source_author,date:'',d:99}:null;
  const t=ym(albumMap[card.album])+1,sc=p.map(x=>({x,d:x.ym?Math.abs(x.ym-t):999})),best=Math.min(...sc.map(s=>s.d)),c=sc.filter(s=>s.d<=best+2).map(s=>s.x),x=c[hash(card.id)%c.length];
  return{...x,d:best}}
// ---------- Datos ----------
function makeCards(){const cards=[];albumList.forEach(([album,rel])=>members.forEach((member,i)=>{cards.push({id:slug(album)+'-'+slug(member)+'-'+String(i+1).padStart(2,'0'),album,year:rel.slice(0,4),member,name:`${album} — ${member}`,rarity:randomRarity()})}));return cards}
function randomRarity(){let n=Math.random()*100;for(const r of rKeys){n-=rarityInfo[r].weight;if(n<=0)return r}return'N'}
let data=null;try{data=JSON.parse(localStorage.getItem('twiceGachaV3')||'null')}catch(e){}
if(!data||!data.cards)data={cards:makeCards(),owned:{},duplicates:{},packs:0,selectedAlbum:'RANDOM'};
data.cards.forEach(c=>c.rarity=fixR(c.rarity));
function save(){try{localStorage.setItem('twiceGachaV3',JSON.stringify(data))}catch(e){}updateStats()}
function updateStats(){const t=data.cards.length,o=Object.values(data.owned).filter(Boolean).length;$('#total').textContent=t;$('#owned').textContent=o;$('#missing').textContent=Math.max(0,t-o);$('#pct').textContent=t?Math.round(o/t*100)+'%':'0%'}
function pickCard(min){const pool=data.selectedAlbum==='RANDOM'?data.cards:data.cards.filter(c=>c.album===data.selectedAlbum);let r=randomRarity();if(rKeys.indexOf(r)<min)r=rKeys[min];let p=pool.filter(c=>c.rarity===r);if(!p.length)p=pool.filter(c=>rKeys.indexOf(c.rarity)>=min);if(!p.length)p=pool;return p[Math.floor(Math.random()*p.length)]}
function pull5(){const cs=[];for(let i=0;i<5;i++)cs.push({...pickCard(i===4?1:0)});
  // 5.ª carta garantizada R o superior; se registran todas al abrir para no perder nada
  cs.forEach(c=>{c.isNew=!data.owned[c.id];if(c.isNew)data.owned[c.id]=true;else data.duplicates[c.id]=(data.duplicates[c.id]||1)+1});return cs}
// ---------- Cartas ----------
function stars(r){return'★'.repeat(rarityInfo[r].stars)}
const PAL={'The Story Begins':['#f6e7f0','#7fc4e8','dots'],'Page Two':['#ffd1e1','#ff5f9e','stripes'],'TWICEcoaster: Lane 1':['#7fd6ff','#2f6bd6','rings'],'TWICEcoaster: Lane 2':['#ffd36b','#ff6f91','sun'],'Signal':['#2a2a2a','#c9e82a','grid'],'Twicetagram':['#ffb199','#ff0844','checker'],'Merry & Happy':['#e63946','#1d6b3f','dots'],'What Is Love?':['#ff9ec7','#3ec7b5','diag'],'Summer Nights':['#ffe066','#ff7a45','waves'],'Yes or Yes':['#ffd93d','#ff4f81','stripes'],'The Year of Yes':['#ffcf56','#d1306b','sun'],'Fancy You':['#ff7eb6','#6a3df0','dots'],'Feel Special':['#f0f0f0','#6b6b6b','grid'],'&TWICE':['#b79cff','#ff9ad5','rings'],'More & More':['#ff3d9a','#ffb703','diag'],'Eyes Wide Open':['#ff2a3d','#14070c','grid'],'Taste of Love':['#ff9a5a','#ff4f7b','waves'],'Formula of Love: O+T=<3':['#ffa3d1','#5aa9ff','checker'],'Celebrate':['#ffe28a','#ff8fb1','dots'],'Between 1&2':['#69d2ff','#7de3b0','waves'],'Ready to Be':['#7b3ff2','#ff6ad5','rings'],'DIVE':['#2a7de1','#7be0ff','waves'],'With YOU-th':['#ffe5a3','#ff9ec2','dots'],'Strategy':['#14082e','#8a4dff','grid'],'THIS IS FOR':['#ff6a3d','#ffd23d','sun'],'ENEMY':['#151515','#ff2a55','stripes']};
const PAT={dots:'radial-gradient(circle,#fff6 18%,transparent 20%) 0 0/22px 22px',stripes:'repeating-linear-gradient(135deg,#fff3 0 10px,transparent 10px 20px)',rings:'repeating-radial-gradient(circle at 72% 24%,#fff3 0 8px,transparent 8px 18px)',sun:'repeating-conic-gradient(from 0deg at 50% 72%,#fff3 0 8deg,transparent 8deg 16deg)',grid:'linear-gradient(#fff2 1px,transparent 1px) 0 0/18px 18px,linear-gradient(90deg,#fff2 1px,transparent 1px) 0 0/18px 18px',checker:'repeating-conic-gradient(#fff3 0 25%,transparent 0 50%) 0 0/28px 28px',diag:'repeating-linear-gradient(45deg,#fff3 0 6px,transparent 6px 14px)',waves:'radial-gradient(circle at 50% 100%,transparent 52%,#fff4 54% 60%,transparent 62%) 0 0/36px 26px'};
function backHTML(album){const h=hash(album),pk=Object.keys(PAT),p=PAL[album]||[`hsl(${h%360},75%,62%)`,`hsl(${(h+50)%360},65%,32%)`,pk[h%pk.length]],n=album.length,fs=n>16?12:n>11?15:n>7?19:24;
  return`<div class="back" style="background:${PAT[p[2]]},linear-gradient(155deg,${p[0]},${p[1]})"><img class="cov" decoding="async" src="covers/${slug(album)}.jpg" onerror="this.remove()"><span class="bl">TWICE</span><b class="bn" style="font-size:${fs}px">${esc(album)}</b><small>${esc((albumMap[album]||'').slice(0,4))}</small><u></u></div>`}
const TY={Nayeon:['STR','#ef4444'],Jeongyeon:['AGL','#3b82f6'],Momo:['TEQ','#22c55e'],Sana:['INT','#a855f7'],Jihyo:['PHY','#f5c518'],Mina:['INT','#a855f7'],Dahyun:['PHY','#f5c518'],Chaeyoung:['STR','#ef4444'],Tzuyu:['AGL','#3b82f6']};
function faceHTML(card,small,live){const p=photoFor(card),t=TY[card.member]||['TEQ','#22c55e'],alive=live&&(card.rarity==='SSR'||card.rarity==='UR'),v=live&&card.rarity==='UR'?videoFor(card):null;
  return`<div class="pc r-${card.rarity}${small?' sm':''}${alive?' alive':''}" style="--ty:${t[1]}"><div class="in">${p?`<img decoding="async" referrerpolicy="no-referrer" src="${esc(p.url)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`:''}<div class="ph" ${p?'style="display:none"':''}><span>${esc(card.member)}</span></div>${v?`<video class="live" muted loop playsinline autoplay preload="metadata" src="${esc(v.src)}" onloadedmetadata="try{this.currentTime=(this.duration||0)*.3}catch(e){}" onplaying="this.classList.add('on');this.closest('.pc').classList.add('hasv')" onerror="this.remove()"></video><span class="livebadge">● LIVE</span>`:''}<div class="shine"></div><div class="holo"></div><div class="glr"></div><div class="tag">${card.rarity}</div><div class="cap"><b>${esc(card.member)}</b><small>${esc(card.album)}</small></div></div></div>`}
function slot(card,owned){return owned?faceHTML(card):`<div class="pc locked"><div class="in">${backHTML(card.album)}</div></div>`}
function creditHTML(card){const vv=card.rarity==='UR'?videoFor(card):null,vc=vv?`<br><small>🎬 ${esc(vv.author).slice(0,40)} · <a href="${esc(vv.source)}" target="_blank" rel="noopener">${esc(vv.license)}</a></small>`:'';return creditHTML0(card)+vc}
function creditHTML0(card){if(card.ext)return'<small>Fuente personal importada</small>';const p=photoFor(card);if(!p)return'<small>Sin foto en línea todavía</small>';const near=p.date&&p.d<=6?'':' · ≈ la más cercana a esa época';return`<small>📷 ${esc(p.author).slice(0,50)} · <a href="${esc(p.source)}" target="_blank" rel="noopener">${esc(p.license)}</a>${p.date?' · 📅 '+esc(p.date):''}${near}</small>`}
function showDetail(id){const c=data.cards.find(x=>x.id===id);if(!c)return;const o=document.createElement('div');o.className='sheet';o.onclick=()=>o.remove();o.innerHTML=`<div class="detail">${faceHTML(c,false,true)}<h3>${esc(c.name)}</h3><p>${c.rarity} · ${rarityInfo[c.rarity].name}${data.duplicates[id]>1?' · x'+data.duplicates[id]:''}</p><p>Álbum: ${esc(c.album)} (${esc(albumMap[c.album]||'')})</p>${creditHTML(c)}</div>`;document.body.appendChild(o);startTilt()}
// ---------- Pantallas ----------
function tabs(){document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.tab)})}
const allAlbums=()=>{const k=albumList.map(a=>a[0]);data.cards.forEach(c=>{if(!k.includes(c.album))k.push(c.album)});return k};
function render(tab){const c=$('#content');({packs:renderPacks,collection:renderCollection,albums:renderAlbums,members:renderMembers,source:renderSource})[tab](c);updateStats()}
function packPhoto(album){const all=[];members.forEach(m=>(imgPool[m]||[]).forEach(x=>all.push(x)));if(!all.length)return null;if(album==='RANDOM')return all[Math.floor(Math.random()*all.length)];const t=ym(albumMap[album])+1,sc=all.filter(x=>x.ym).sort((a,b)=>Math.abs(a.ym-t)-Math.abs(b.ym-t));return sc[Math.floor(Math.random()*Math.min(3,sc.length))]||all[0]}
function packArt(album){const p=packPhoto(album),al=album==='RANDOM'?'':album,h=hash(album)%360,bk=backHTML(al||'TWICE');
  return`<div class="pk3d" id="pack" style="--h:${h}"><div class="pk-obj"><div class="pk-cards">${bk.repeat(3).replace(/class="back"/g,'class="back pkc"')}</div>
  <div class="pk-face pk-main"><div class="pk-art">${p?`<img src="${esc(p.url)}" referrerpolicy="no-referrer" onerror="this.remove()">`:bk}</div><div class="pk-logo">TWICE</div><div class="pk-name">${esc(al||'RANDOM PACK')}</div><div class="pk-sub">5 CARDS · ONCE COLLECTION</div><div class="crimp b"></div><div class="pk-foil"></div></div>
  <div class="pk-face pk-cap"><div class="crimp t"></div><div class="pk-foil"></div></div>
  <div class="pk-face pk-back"><span>TWICE</span></div><div class="pk-side l"></div><div class="pk-side r"></div></div>
  <div class="cutline"><i></i></div><div class="burst"></div></div>`}
function renderPacks(c){setTimeout(initCut,0);const sel=data.selectedAlbum;c.innerHTML=`<section class="hero">${packArt(sel)}<h2>${sel==='RANDOM'?'Sobre aleatorio':esc(sel)}</h2><p class="small">5 cartas · la última siempre R o mejor</p><p class="cuthint">Desliza el dedo por la línea para abrir ✂️</p><button class="open-btn" id="openBtn" onclick="autoCut()">ABRIR SOBRE</button><button class="secondary" onclick="render('albums')">ELEGIR ÁLBUM</button><p class="small">Sobres abiertos: ${data.packs}</p></section><section class="odds"><h3>Probabilidades</h3>${rKeys.map(r=>`<div><span class="dot r-${r}"></span>${r} <small>${stars(r)}</small><b>${rarityInfo[r].weight}%</b></div>`).join('')}</section>`}
let busy=false;
function initCut(){const pk=$('#pack');if(!pk)return;let x0=null,prog=0;
  pk.onpointerdown=e=>{if(busy)return;x0=e.clientX;try{pk.setPointerCapture(e.pointerId)}catch(_){}};
  pk.onpointermove=e=>{if(x0==null||busy)return;const w=pk.getBoundingClientRect().width;prog=Math.min(1,Math.abs(e.clientX-x0)/(w*.85));pk.style.setProperty('--cut',prog);if(prog>=1){x0=null;openPack3D()}};
  pk.onpointerup=pk.onpointercancel=()=>{if(x0==null)return;x0=null;if(prog<1)pk.style.setProperty('--cut',0)}}
function autoCut(){const pk=$('#pack');if(!pk||busy)return;busy=true;const t0=performance.now(),step=t=>{const p=Math.min(1,(t-t0)/450);pk.style.setProperty('--cut',p);if(p<1)requestAnimationFrame(step);else{busy=false;openPack3D()}};requestAnimationFrame(step)}
function openPack3D(){if(busy)return;busy=true;const pk=$('#pack');const cards=pull5();data.packs++;save();try{navigator.vibrate&&navigator.vibrate([20,30,40])}catch(e){}
  pk.classList.add('cut');sparks(pk.querySelector('.burst'),18,130);flash('#fff',.5);
  setTimeout(()=>pk.classList.add('rise'),380);setTimeout(()=>pk.classList.add('drop'),1150);setTimeout(()=>startStack(cards),1500)}
function tearPack(){if(busy)return;busy=true;const pk=$('#pack');if(!pk)return;const cards=pull5();data.packs++;save();try{navigator.vibrate&&navigator.vibrate(30)}catch(e){}
  pk.classList.add('shake');setTimeout(()=>{pk.classList.remove('shake');pk.classList.add('tear');flash('#fff',.9);sparks(pk.querySelector('.burst'),22,150)},800);setTimeout(()=>startStack(cards),1500)}
function flash(col,op){const f=document.createElement('div');f.className='flash';f.style.background=col;f.style.setProperty('--op',op);document.body.appendChild(f);setTimeout(()=>f.remove(),700)}
const front=cd=>faceHTML(cd,false,true)+(cd.isNew?'<span class="new">NEW</span>':'<span class="new dup">REPE</span>');function fill(k){const f=$('#ff'+k);if(f&&!f.innerHTML&&st&&st.cards[k])f.innerHTML=front(st.cards[k])}
let last=[];function startStack(cards){busy=false;last=cards;st={cards,i:0,flipped:false};
  $('#content').innerHTML=`<section class="opening"><div class="opening-head"><span>Sobre #${data.packs}</span><span id="cnt">1/5</span></div><div class="stack" id="stack">${cards.map((cd,k)=>`<div class="rc" id="rc${k}" style="--k:${k}" onclick="tapCard()"><div class="inner"><div class="face fb">${backHTML(cd.album)}</div><div class="face ff" id="ff${k}">${front(cd)}</div></div></div>`).join('')}</div><p class="hint" id="hint">Toca la carta para revelarla</p><div id="credit" class="credit"></div><button class="secondary" onclick="showResults()">SALTAR</button></section>`}
let st=null;
function tapCard(){if(!st||busy)return;const el=$('#rc'+st.i),cd=st.cards[st.i];
  if(!st.flipped){st.flipped=true;el.classList.add('flipped');startTilt();$('.opening').dataset.r=cd.rarity;setTimeout(()=>fx(el,cd.rarity),380);$('#hint').textContent=st.i<4?'Toca para la siguiente':'Toca para ver el resumen';$('#credit').innerHTML=creditHTML(cd)}
  else{el.classList.add('out');$('#stack').style.setProperty('--i',st.i+1);delete $('.opening').dataset.r;st.i++;st.flipped=false;$('#credit').innerHTML='';if(st.i>4){busy=true;setTimeout(()=>{busy=false;showResults()},420)}else{fill(st.i);fill(st.i+1);$('#cnt').textContent=(st.i+1)+'/5';$('#hint').textContent='Toca la carta para revelarla'}}}
function sparks(el,n,reach){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='sp';const a=Math.random()*6.28,d=reach*(.5+Math.random()*.8);s.style.cssText=`--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d}px;background:${['#ffe27a','#ff8ad0','#8ae4ff','#fff'][i%4]}`;el.appendChild(s);setTimeout(()=>s.remove(),900)}}
function splash(r){const d=document.createElement('div');d.className='splash k-'+r;d.textContent=r+'!';document.body.appendChild(d);setTimeout(()=>d.remove(),1300)}
function fx(el,r){const n=rKeys.indexOf(r);if(n>=2){sparks(el,5+n*4,70+n*30);const g=document.createElement('i');g.className='ring k-'+r;el.appendChild(g);setTimeout(()=>g.remove(),900)}
  if(n>=3){splash(r);const sk=$('#stack');if(sk){sk.classList.add('shk');setTimeout(()=>sk.classList.remove('shk'),500)}}
  if(n>=3)flash(n===4?'radial-gradient(#fff,#ffd36b)':'#ffe27a',n===4?.85:.5);if(n>=1)el.classList.add('pop');try{navigator.vibrate&&navigator.vibrate(n>=3?[40,40,80]:20)}catch(e){}}
function showResults(){st=null;busy=false;const cs=last,best=cs.reduce((a,c)=>rKeys.indexOf(c.rarity)>rKeys.indexOf(a.rarity)?c:a,cs[0]);
  $('#content').innerHTML=`<section class="results"><h2>Sobre completado ✦</h2><p class="small">Mejor carta: ${best.rarity} · ${esc(best.member)}</p><div class="mini-grid">${cs.map((c,k)=>`<div class="mg" style="--k:${k}" onclick="showDetail('${c.id}')">${faceHTML(c,true)}${c.isNew?'<span class="new">NEW</span>':'<span class="new dup">REPE</span>'}</div>`).join('')}</div><button class="open-btn" onclick="render('packs')">ABRIR OTRO</button><button class="secondary" onclick="render('collection')">VER COLECCIÓN</button></section>`}
function renderAlbums(c){c.innerHTML=`<h2>Álbumes</h2><p class="small">Elige de qué álbum quieres que salga el sobre.</p><div class="album-list"><button class="album random" onclick="selectAlbum('RANDOM')">🎲 Aleatorio <span>${data.cards.length} cartas</span></button>${albumList.map(a=>{const cs=data.cards.filter(x=>x.album===a[0]),o=cs.filter(x=>data.owned[x.id]).length;return`<button class="album" onclick="selectAlbum(${esc(JSON.stringify(a[0]))})"><span><b>${esc(a[0])}</b><small>${a[1]}</small></span><em>${o}/${cs.length}</em></button>`}).join('')}</div>`}
function selectAlbum(a){data.selectedAlbum=a;save();render('packs')}
function renderCollection(c){c.innerHTML=`<h2>Mi colección</h2><div class="filters"><select id="fa"><option>Todos los álbumes</option>${allAlbums().map(a=>`<option>${esc(a)}</option>`).join('')}</select><select id="fr"><option>Todas las rarezas</option>${rKeys.map(r=>`<option>${r}</option>`).join('')}</select><select id="fs"><option>Todas</option><option>Tengo</option><option>Faltan</option></select></div><div id="grid"></div>`;['#fa','#fr','#fs'].forEach(q=>$(q).onchange=drawCollection);drawCollection()}
function cardGrid(cs){return cs.map(c=>{const o=data.owned[c.id];return`<div class="gi" ${o?`onclick="showDetail('${c.id}')"`:''}>${slot(c,o)}${o&&data.duplicates[c.id]>1?`<span class="new dup">x${data.duplicates[c.id]}</span>`:''}</div>`}).join('')||'<p>No hay cartas con ese filtro.</p>'}
function drawCollection(){const a=$('#fa').value,r=$('#fr').value,s=$('#fs').value;$('#grid').innerHTML=cardGrid(data.cards.filter(c=>(a==='Todos los álbumes'||c.album===a)&&(r==='Todas las rarezas'||c.rarity===r)&&(s==='Todas'||(s==='Tengo')===!!data.owned[c.id])))}
function renderMembers(c){c.innerHTML='<h2>Miembros</h2>'+members.map(m=>{const cs=data.cards.filter(x=>x.member===m),o=cs.filter(x=>data.owned[x.id]).length;return`<button class="member-row" onclick="showMember(${esc(JSON.stringify(m))})"><div class="avatar">${m[0]}</div><div><b>${m}</b><p>${o}/${cs.length} conseguidas</p></div></button>`}).join('')}
function showMember(m){$('#content').innerHTML=`<button class="back-btn" onclick="render('members')">← Miembros</button><h2>${esc(m)}</h2><div class="grid">${cardGrid(data.cards.filter(x=>x.member===m))}</div>`}
// ---------- Copia de seguridad ----------
const WV=location.protocol==='file:';
function sheet(){const o=document.createElement('div');o.className='sheet';o.innerHTML='<div class="detail"><h3>Copia de seguridad</h3><p class="small">Copia este texto para guardar tu colección, o pega uno y pulsa Importar.</p><textarea id="bk"></textarea><button id="bkI" class="open-btn">Importar</button><button id="bkC" class="secondary">Cerrar</button></div>';document.body.appendChild(o);const t=o.querySelector('#bk');t.value=JSON.stringify(data);o.querySelector('#bkC').onclick=()=>o.remove();o.querySelector('#bkI').onclick=()=>{importText(t.value);o.remove()}}
function importText(txt){try{let d=JSON.parse(txt);if(Array.isArray(d))d={cards:d};if(!d||!Array.isArray(d.cards)||!d.cards.length||!d.cards.every(c=>c&&c.id&&c.album&&c.member&&c.rarity))throw 0;d.cards.forEach(c=>c.rarity=fixR(c.rarity));data={cards:d.cards,owned:d.owned||{},duplicates:d.duplicates||{},packs:+d.packs||0,selectedAlbum:d.selectedAlbum||'RANDOM'};save();render('packs')}catch{alert('JSON no válido')}}
$('#export').onclick=WV?sheet:()=>{const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='twice-gacha-database.json';a.click()};
$('#import').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{importText(r.result);e.target.value=''};r.readAsText(f)};
if(WV){const l=document.querySelector('footer label');if(l)l.hidden=true}
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const b=$('#install');b.hidden=false;b.onclick=()=>{dp.prompt();b.hidden=true}});
if('serviceWorker' in navigator&&!WV)void 0;

// ---------- Fuente externa de photocards (uso personal) ----------
function renderSource(c){const n=data.cards.filter(x=>x.ext).length;c.innerHTML=`<h2>Fuente de photocards</h2><p class="small">Uso personal. Pega la URL de una API o JSON que devuelva photocards (con imagen y, si puede ser, miembro y álbum).</p><input id="srcUrl" class="inp" placeholder="https://…" value="${esc(localStorage.getItem('twiceSrc')||'')}"><button class="secondary" onclick="testSource()">PROBAR URL</button><button class="open-btn" onclick="importSource()">IMPORTAR CARTAS</button><button class="secondary" onclick="clearSource()">QUITAR IMPORTADAS (${n})</button><pre id="srcOut" class="srcout"></pre>`}
const KI=['image','imageUrl','image_url','img','thumbnail','thumb','photo','picture','src','url','cover'];
function findArr(j,d=0){if(Array.isArray(j))return j;if(j&&typeof j==='object'&&d<3){for(const k of['items','data','results','cards','list','products','photocards','content','rows']){if(j[k]){const a=findArr(j[k],d+1);if(a)return a}}for(const v of Object.values(j)){const a=findArr(v,d+1);if(a&&a.length)return a}}return null}
function mapItem(it){if(!it||typeof it!=='object')return null;const strs=[],walk=(o,d)=>{if(typeof o==='string')strs.push(o);else if(o&&typeof o==='object'&&d<2)Object.values(o).forEach(v=>walk(v,d+1))};walk(it,0);
  let img=null;for(const k of KI){const v=it[k];if(typeof v==='string'&&/^(https?:)?\/\//.test(v)){img=v;break}}
  if(!img)img=strs.find(x=>/^(https?:)?\/\/\S+\.(jpe?g|png|webp)/i.test(x));if(!img)return null;if(img.startsWith('//'))img='https:'+img;
  const blob=strs.join(' ').toLowerCase(),member=members.find(m=>blob.includes(m.toLowerCase())),album=albumList.map(a=>a[0]).filter(a=>blob.includes(a.toLowerCase())).sort((a,b)=>b.length-a.length)[0];
  return{img,member,album}}
async function getSource(){const u=$('#srcUrl').value.trim();if(!u)throw new Error('Pon una URL');localStorage.setItem('twiceSrc',u);const j=await(await fetch(u)).json(),a=findArr(j);if(!a)throw new Error('No encuentro una lista de cartas en la respuesta');return a}
async function testSource(){const o=$('#srcOut');o.textContent='Probando…';try{const a=await getSource(),m=a.map(mapItem).filter(Boolean);o.textContent=`Elementos: ${a.length}\nCon imagen: ${m.length}\nCon miembro: ${m.filter(x=>x.member).length}\nCon álbum conocido: ${m.filter(x=>x.album).length}\n\nEjemplo:\n${JSON.stringify(a[0]).slice(0,500)}`}catch(e){o.textContent='Error: '+e.message}}
async function importSource(){const o=$('#srcOut');o.textContent='Importando…';try{const a=await getSource(),have=new Set(data.cards.map(c=>c.id));let n=0;for(const it of a.slice(0,2500)){const m=mapItem(it);if(!m||!m.member)continue;const id='x-'+hash(m.img).toString(36);if(have.has(id))continue;have.add(id);const al=m.album||'Otros (importadas)';data.cards.push({id,album:al,year:'',member:m.member,name:`${al} — ${m.member}`,rarity:randomRarity(),image_url:m.img,ext:1});n++}save();o.textContent=n?`Importadas ${n} cartas.`:'No se importó nada: las cartas necesitan imagen y nombre de miembro. Pulsa PROBAR URL para ver el formato.'}catch(e){o.textContent='Error: '+e.message}}
function clearSource(){data.cards=data.cards.filter(c=>!c.ext);Object.keys(data.owned).forEach(k=>{if(k.startsWith('x-'))delete data.owned[k]});save();render('source')}

// ---------- Inclinación: el móvil (giroscopio) o el dedo mueven brillo y holograma ----------
const tilt={x:0,y:0,tx:0,ty:0,raf:0,ptr:false,last:0},cl=v=>Math.max(-1,Math.min(1,v));
addEventListener('deviceorientation',e=>{if(e.gamma==null||tilt.ptr)return;tilt.last=performance.now();tilt.tx=cl(e.gamma/28);tilt.ty=cl(((e.beta||0)-50)/28);startTilt()});
function startTilt(){if(!tilt.raf)tilt.raf=requestAnimationFrame(tiltTick)}
function tiltTick(t){tilt.raf=0;const T=document.querySelectorAll('.rc.flipped:not(.out) .pc,.ffront .pc,.pk3d:not(.cut) .pk-obj');if(!T.length)return;
  if(!tilt.ptr&&t-tilt.last>1800){tilt.tx=Math.sin(t/900)*.6;tilt.ty=Math.cos(t/1300)*.4}   // balanceo suave si no hay sensor
  tilt.x+=(tilt.tx-tilt.x)*.16;tilt.y+=(tilt.ty-tilt.y)*.16;
  T.forEach(el=>{el.classList.add('tilt');const st=el.style;st.setProperty('--rx',(-tilt.y*15).toFixed(2)+'deg');st.setProperty('--ry',(tilt.x*15).toFixed(2)+'deg');st.setProperty('--sx',(-tilt.x*10).toFixed(1)+'px');st.setProperty('--sy',(tilt.y*10+6).toFixed(1)+'px');st.setProperty('--mx',(50+tilt.x*45).toFixed(1)+'%');st.setProperty('--my',(50+tilt.y*45).toFixed(1)+'%');st.setProperty('--bx',(50+tilt.x*50).toFixed(1)+'%');st.setProperty('--by',(50+tilt.y*50).toFixed(1)+'%')});
  startTilt()}
function ptrMove(e){const c=e.target.closest&&e.target.closest('.rc.flipped .pc,.ffront .pc');if(!c){return}const r=c.getBoundingClientRect();tilt.ptr=true;tilt.tx=cl((e.clientX-r.left-r.width/2)/(r.width/2));tilt.ty=cl((e.clientY-r.top-r.height/2)/(r.height/2));startTilt()}
addEventListener('pointermove',ptrMove);addEventListener('pointerdown',ptrMove);
['pointerup','pointercancel'].forEach(k=>addEventListener(k,()=>{tilt.ptr=false;tilt.last=performance.now();tilt.tx=tilt.ty=0}));

// ================= Portadas (iTunes / Deezer) + logo =================
const LOGO='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Logo_of_TWICE.svg/330px-Logo_of_TWICE.svg.png';
const logoHTML=c=>`<img class="${c}" src="${LOGO}" referrerpolicy="no-referrer" onerror="this.outerHTML='<span class=&quot;${c} txt&quot;>TWICE</span>'">`;
let covers={};try{covers=JSON.parse(localStorage.getItem('twiceCovers2')||'{}')}catch(e){}
const norm=x=>(x||'').toLowerCase().replace(/[^a-z0-9#&]+/g,'');
async function loadCovers(force){if(!force&&covers._t&&Date.now()-covers._t<7*864e5&&Object.keys(covers).length>15&&Object.keys(albIds).length)return;const list=[];
  try{const a=await(await fetch('https://itunes.apple.com/search?term=TWICE&entity=musicArtist&limit=10')).json(),ar=(a.results||[]).find(x=>(x.artistName||'').toUpperCase()==='TWICE');
    if(ar){const l=await(await fetch('https://itunes.apple.com/lookup?id='+ar.artistId+'&entity=album&limit=200')).json();(l.results||[]).forEach(x=>{if(x.collectionName&&x.artworkUrl100)list.push({n:norm(x.collectionName),u:x.artworkUrl100.replace(/\/\d+x\d+bb\./,'/600x600bb.'),id:'it:'+x.collectionId,y:+String(x.releaseDate||'').slice(0,4)||null})})}}catch(e){}
  try{const a=await(await fetch('https://api.deezer.com/search/artist?q=TWICE')).json(),ar=(a.data||[]).find(x=>(x.name||'').toUpperCase()==='TWICE');
    if(ar){const l=await(await fetch('https://api.deezer.com/artist/'+ar.id+'/albums?limit=200')).json();(l.data||[]).forEach(x=>{if(x.title&&(x.cover_xl||x.cover_big))list.push({n:norm(x.title),u:x.cover_xl||x.cover_big,id:'dz:'+x.id,y:+String(x.release_date||'').slice(0,4)||null})})}}catch(e){}
  const out={_t:Date.now()},ids={};for(const[al]of albumList){const n=norm(al),ry=+(albumMap[al]||'').slice(0,4)||null,sc=o=>(o.n===n?0:5)+(o.y&&ry?Math.abs(o.y-ry):2),h=list.filter(o=>o.n===n||(o.n.startsWith(n)&&!/^\d/.test(o.n.slice(n.length))&&!/remix|instrumental|karaoke|deluxe/.test(o.n.slice(n.length))&&(!o.y||!ry||Math.abs(o.y-ry)<=1))).sort((p,q)=>sc(p)-sc(q))[0];if(h){out[al]=h.u;ids[al]=h.id}}if(Object.keys(ids).length){albIds=ids;try{localStorage.setItem('twiceAlbIds',JSON.stringify(ids))}catch(e){}}
  if(Object.keys(out).length>1){covers=out;try{localStorage.setItem('twiceCovers2',JSON.stringify(out))}catch(e){}if(window.__syncCovers)__syncCovers()}}
function softRender(){const t=($('.tab.active')||{}).dataset;if(!t||busy||st||$('.sheet'))return;if(['packs','albums','collection'].includes(t.tab))render(t.tab)}
const _backPattern=backHTML;
backHTML=function(album){const cv=covers[album];if(!cv)return _backPattern(album);return`<div class="back cv"><img class="cov" src="${esc(cv)}" referrerpolicy="no-referrer" decoding="async"><i class="cvsh"></i>${logoHTML('lg')}<b class="bn">${esc(album)}</b><small>${esc((albumMap[album]||'').slice(0,4))}</small></div>`};
const coverImg=al=>covers[al]?`<img src="${esc(covS(covers[al],200))}" referrerpolicy="no-referrer" loading="lazy">`:backHTML(al);
packArt=function(album){const rnd=album==='RANDOM',wc=albumList.map(a=>a[0]).filter(a=>covers[a]),pick=()=>wc[Math.floor(Math.random()*wc.length)],al=rnd?(wc.length?pick():'TWICE'):album,cv=covers[al];
  const art=rnd?(wc.length>=4?`<div class="col4">${[0,1,2,3].map(()=>`<img src="${esc(covers[pick()])}" referrerpolicy="no-referrer">`).join('')}</div>`:(packPhoto('RANDOM')?`<img src="${esc(packPhoto('RANDOM').url)}" referrerpolicy="no-referrer">`:backHTML(al))):(cv?`<img src="${esc(cv)}" referrerpolicy="no-referrer">`:backHTML(al));
  return`<div class="pk3d" id="pack"><div class="pk-obj"><div class="pk-cards">${backHTML(al).repeat(3).replace(/class="back/g,'class="pkc back')}</div>
  <div class="pk-face pk-main">${cv?`<img class="pk-bg" src="${esc(cv)}" referrerpolicy="no-referrer">`:''}<i class="pk-tint"></i><div class="pk-art">${art}</div><div class="pk-logo">${logoHTML('plg')}</div><div class="pk-name">${esc(rnd?'RANDOM PACK':album)}</div><div class="pk-sub">5 CARDS · ONCE COLLECTION</div><div class="crimp b"></div><div class="pk-foil"></div></div>
  <div class="pk-face pk-cap"><div class="crimp t"></div><div class="pk-foil"></div></div>
  <div class="pk-face pk-back">${logoHTML('plg')}</div><div class="pk-side l"></div><div class="pk-side r"></div></div><div class="cutline"><i></i></div><div class="burst"></div></div>`};
creditHTML=function(){return''};
// ---- reverso de photocard ----
function pcBack(c){const cv=covers[c.album],no=members.indexOf(c.member)+1;return`<div class="pcb r-${c.rarity}"><div class="in">${cv?`<img class="pcb-bg" src="${esc(covS(cv,100))}" referrerpolicy="no-referrer">`:''}<div class="pcb-c">${logoHTML('pcb-lg')}${cv?`<img class="pcb-cv" src="${esc(cv)}" referrerpolicy="no-referrer">`:`<div class="pcb-cv">${_backPattern(c.album)}</div>`}<div class="pcb-m">${esc(c.member)}</div><div class="pcb-a">${esc(c.album)} · ${esc((albumMap[c.album]||'').slice(0,4))}</div><div class="pcb-r">${'★'.repeat(rarityInfo[c.rarity].stars)} ${c.rarity}</div><div class="pcb-ft"><span>No. ${String(no).padStart(2,'0')}/09</span><i class="pcb-bar"></i><span>ONCE</span></div></div></div></div>`}
showDetail=function(id){const c=data.cards.find(x=>x.id===id);if(!c)return;const o=document.createElement('div');o.className='sheet dsheet';
  o.innerHTML=`<button class="dclose">✕</button><div class="dwrap"><div class="flipc"><div class="fi"><div class="ffront">${faceHTML(c,false,true)}</div><div class="fback">${pcBack(c)}</div></div></div><div class="dinfo"><b>${esc(c.member)}</b><span>${esc(c.album)}</span>${data.duplicates[id]>1?`<span>x${data.duplicates[id]}</span>`:''}</div><p class="hint">Toca la carta para darle la vuelta</p></div>`;
  o.onclick=e=>{if(e.target===o||e.target.closest('.dclose'))o.remove()};o.querySelector('.flipc').onclick=e=>{e.currentTarget.classList.toggle('flip');try{navigator.vibrate&&navigator.vibrate(10)}catch(_){}};document.body.appendChild(o);startTilt()};
// ---- colección agrupada por álbum ----
drawCollection=function(){const a=$('#fa').value,r=$('#fr').value,s=$('#fs').value,cs=data.cards.filter(c=>(a==='Todos los álbumes'||c.album===a)&&(r==='Todas las rarezas'||c.rarity===r)&&(s==='Todas'||(s==='Tengo')===!!data.owned[c.id]));
  const g=allAlbums().map(al=>[al,cs.filter(c=>c.album===al)]).filter(x=>x[1].length);
  $('#grid').innerHTML=g.map(([al,l])=>{const all=data.cards.filter(c=>c.album===al),o=all.filter(c=>data.owned[c.id]).length;return`<section class="asec"><div class="ahead"><div class="ath">${coverImg(al)}</div><div><b>${esc(al)}</b><small>${esc(albumMap[al]||'')} · ${o}/${all.length} conseguidas</small><i class="abar"><u style="width:${o/all.length*100}%"></u></i></div></div><div class="grid">${cardGrid(l)}</div></section>`}).join('')||'<p>No hay cartas con ese filtro.</p>'};
// ---- álbumes por año con portadas ----
renderAlbums=function(c){const years={};[...albumList].sort((a,b)=>a[1]<b[1]?-1:1).forEach(a=>(years[a[1].slice(0,4)]=years[a[1].slice(0,4)]||[]).push(a));
  const tile=a=>{const cs=data.cards.filter(x=>x.album===a[0]),o=cs.filter(x=>data.owned[x.id]).length;return`<button class="atile${data.selectedAlbum===a[0]?' sel':''}" onclick="selectAlbum(${esc(JSON.stringify(a[0]))})"><div class="acv">${coverImg(a[0])}</div><b>${esc(a[0])}</b><small>${o}/${cs.length}</small><i class="abar"><u style="width:${o/cs.length*100}%"></u></i></button>`};
  c.innerHTML=`<h2>Álbumes</h2><p class="small">Toca un álbum para abrir sobres de ese álbum.</p><div class="agrid"><button class="atile rnd${data.selectedAlbum==='RANDOM'?' sel':''}" onclick="selectAlbum('RANDOM')"><div class="acv rndc">${logoHTML('alg')}</div><b>Aleatorio</b><small>${data.cards.length} cartas</small></button></div>${Object.entries(years).map(([y,l])=>`<section class="ysec"><h3>${y}</h3><div class="agrid">${l.map(tile).join('')}</div></section>`).join('')}`};
const _rs=renderSource;renderSource=function(c){_rs(c);c.insertAdjacentHTML('afterbegin',`<div class="srcbox"><p class="small" id="imgStatus">${imgText()}</p><button class="secondary" onclick="loadImages(true)">RECARGAR FOTOS</button><button class="secondary" onclick="loadCovers(true).then(()=>alert('Portadas: '+(Object.keys(covers).length-1)+'/'+albumList.length))">RECARGAR PORTADAS</button></div>`)};


// ================= v11 =================
let albIds={};try{albIds=JSON.parse(localStorage.getItem('twiceAlbIds')||'{}')}catch(e){}
const covS=(u,n)=>(u||'').replace(/\/\d+x\d+bb\./,`/${n}x${n}bb.`).replace(/\/\d+x\d+-(\d+-\d+-\d+-\d+\.jpg)$/,`/${n}x${n}-$1`);
// --- rarezas fijas por álbum: 1 UR, 1 SSR, 2 SR, 2 R, 3 N ---
if(!data.rv||data.rv<2){const R=['UR','SSR','SR','SR','R','R','N','N','N'],by={};data.cards.filter(c=>!c.ext&&!c.kind).forEach(c=>(by[c.album]=by[c.album]||[]).push(c));
  Object.entries(by).forEach(([al,l])=>l.sort((a,b)=>hash(al+a.member)-hash(al+b.member)).forEach((c,i)=>c.rarity=R[i%9]));data.rv=2;save()}
// --- precarga de imágenes ---
const imgC=new Map();
function preImg(u){if(!u)return Promise.resolve();const h=imgC.get(u);if(h)return h.p;const im=new Image();im.referrerPolicy='no-referrer';im.decoding='async';
  const p=new Promise(r=>{let d=0;const f=()=>{if(!d){d=1;r()}};im.onload=()=>{(im.decode?im.decode():Promise.resolve()).then(f,f)};im.onerror=()=>{imgC.delete(u);f()};setTimeout(f,9000)});
  im.src=u;imgC.set(u,{im,p});if(imgC.size>250)imgC.delete(imgC.keys().next().value);return p}
function gifSet(c){const p=imgPool[c.member];if(!p||p.length<2||c.ext)return[];const t=ym(albumMap[c.album])+1,m=photoFor(c);
  return p.filter(x=>x.url!==(m&&m.url)).map(x=>({x,d:x.ym?Math.abs(x.ym-t):999,h:hash(x.url+c.id)})).sort((a,b)=>a.d-b.d||a.h-b.h).slice(0,c.rarity==='UR'?3:2).map(s=>s.x.url)}
function cardUrls(c){const u=[],p=photoFor(c);if(p&&p.url)u.push(p.url);if(c.rarity==='SSR'||c.rarity==='UR')u.push(...gifSet(c));if(covers[c.album])u.push(covers[c.album]);return u}
let preloadCards=cs=>Promise.all([].concat(...cs.map(cardUrls)).map(preImg));
function pick5(){const cs=[];for(let i=0;i<5;i++)cs.push({...pickCard(i===4?1:0)});return cs}
function register(cs){cs.forEach(c=>{c.isNew=!data.owned[c.id];if(c.isNew)data.owned[c.id]=true;else data.duplicates[c.id]=(data.duplicates[c.id]||1)+1});return cs}
pull5=()=>register(pick5());
let nextPack=null;
function prepNext(){const al=data.selectedAlbum;if(!nextPack||nextPack.al!==al)nextPack={al,cards:pick5()};nextPack.ready=preloadCards(nextPack.cards);return nextPack}
const _rp=renderPacks;renderPacks=function(c){_rp(c);setTimeout(()=>{if($('#pack'))prepNext()},400)};
openPack3D=function(){if(busy)return;busy=true;const pk=$('#pack'),np=prepNext();nextPack=null;const cards=register(np.cards);data.packs++;save();
  try{navigator.vibrate&&navigator.vibrate([20,30,40])}catch(e){}
  const best=cards.reduce((a,c)=>rKeys.indexOf(c.rarity)>rKeys.indexOf(a.rarity)?c:a,cards[0]);playAlbum(data.selectedAlbum==='RANDOM'?best.album:data.selectedAlbum);
  let ok=false;const ready=np.ready.then(()=>ok=true);
  pk.classList.add('cut');sparks(pk.querySelector('.burst'),18,130);flash('#fff',.5);setTimeout(()=>pk.classList.add('rise'),380);
  setTimeout(async()=>{if(!ok){pk.classList.add('wait');const h=$('.cuthint');if(h){h.textContent='Preparando tus cartas…';h.style.opacity=1}await Promise.race([ready,new Promise(r=>setTimeout(r,10000))]);pk.classList.remove('wait')}
    pk.classList.add('drop');setTimeout(()=>startStack(cards),330)},1150)};
// --- "GIF" en SSR/UR: varias fotos del miembro alternándose + purpurina ---
const _face=faceHTML;faceHTML=function(card,small,live){let h=_face(card,small,live);
  if(live&&(card.rarity==='SSR'||card.rarity==='UR')){const g=gifSet(card);h=h.replace('<div class="ph"',(g.length?`<div class="gif n${g.length+1}">${g.map((u,i)=>`<img data-fu="${esc(u)}" src="${esc(u)}" referrerpolicy="no-referrer" decoding="async" style="animation-delay:${(i+1)*1.6}s">`).join('')}</div><span class="gifbadge">GIF</span>`:'')+'<i class="glit"></i><div class="ph"')}
  if(small)h=h.replace('<img decoding="async"','<img loading="lazy" decoding="async"');return h};
// --- música: preview de 30 s del álbum (iTunes / Deezer) ---
let prev={};try{prev=JSON.parse(localStorage.getItem('twicePrev')||'{}')}catch(e){}
const bgm=new Audio();bgm.loop=true;bgm.preload='auto';let bgmAl=null,musicOn=localStorage.getItem('twiceMusic')!=='0';
async function previewFor(al){if(prev[al])return prev[al];const id=albIds[al];if(!id)return null;let l=[];
  if(id.startsWith('it:')){const j=await(await fetch('https://itunes.apple.com/lookup?entity=song&limit=50&id='+id.slice(3))).json();l=(j.results||[]).filter(x=>x.previewUrl).map(x=>({t:x.trackName,u:x.previewUrl}))}
  else{const j=await(await fetch('https://api.deezer.com/album/'+id.slice(3)+'/tracks')).json();l=(j.data||[]).filter(x=>x.preview).map(x=>({t:x.title,u:x.preview}))}
  if(!l.length)return null;const n=norm(al),h=l.find(x=>norm(x.t)===n)||l.find(x=>norm(x.t).includes(n))||l[0],r={t:h.t,u:h.u};
  if(id.startsWith('it:')){prev[al]=r;try{localStorage.setItem('twicePrev',JSON.stringify(prev))}catch(e){}}return r}
function fadeTo(v,ms=500){return new Promise(res=>{const s=bgm.volume,t0=performance.now(),k=t=>{const p=Math.min(1,(t-t0)/ms);try{bgm.volume=s+(v-s)*p}catch(e){}p<1?requestAnimationFrame(k):res()};requestAnimationFrame(k)})}
async function playAlbum(al){if(!musicOn||!al||al==='RANDOM')return;if(bgmAl===al&&!bgm.paused)return;bgmAl=al;
  try{const p=await previewFor(al);if(!p||bgmAl!==al)return;if(!bgm.paused)await fadeTo(0,350);bgm.src=p.u;bgm.volume=0;await bgm.play();fadeTo(.45,900);nowPlaying(p.t,al)}catch(e){}}
function nowPlaying(t,al){let n=$('#np');if(!n){n=document.createElement('div');n.id='np';document.body.appendChild(n)}n.innerHTML=`<i>♪</i><span>${esc(t)}<small>${esc(al)}</small></span>`;n.classList.add('on');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('on'),3500)}
function toggleMusic(){musicOn=!musicOn;localStorage.setItem('twiceMusic',musicOn?'1':'0');const b=$('#mus');b.textContent=musicOn?'🔊':'🔇';b.classList.toggle('off',!musicOn);
  if(!musicOn)fadeTo(0,300).then(()=>bgm.pause());else{const a=bgmAl||(data.selectedAlbum!=='RANDOM'?data.selectedAlbum:albumList[11][0]);bgmAl=null;playAlbum(a)}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)bgm.pause();else if(musicOn&&bgm.src)bgm.play().catch(()=>{})});
document.body.insertAdjacentHTML('beforeend',`<button id="mus" class="${musicOn?'':'off'}" onclick="toggleMusic()">${musicOn?'🔊':'🔇'}</button>`);
const _sd=showDetail;showDetail=function(id){_sd(id);const c=data.cards.find(x=>x.id===id);if(c)playAlbum(c.album)};
const _sa=selectAlbum;selectAlbum=function(a){_sa(a);if(a!=='RANDOM')playAlbum(a)};
// --- foto grupal por álbum (Commons, horizontal, fecha cercana al lanzamiento) ---
let grp={};try{grp=JSON.parse(localStorage.getItem('twiceGroup')||'{}')}catch(e){}let grpMap=null;
async function loadGroup(force){if(!force&&grp._t&&Date.now()-grp._t<7*864e5&&(grp.l||[]).length)return;
  const qs=['TWICE group','TWICE members','트와이스','TWICE showcase','TWICE fansign','TWICE award','TWICE 2016','TWICE 2017','TWICE 2018','TWICE 2019','TWICE 2022','TWICE 2024'];
  const all=[].concat(...await Promise.all(qs.map(q=>search(q).catch(()=>[])))),seen={},l=[];
  for(const p of all){if(seen[p.title])continue;seen[p.title]=1;const ii=(p.imageinfo||[])[0];if(!ii||!ii.thumburl)continue;
    const t=p.title.toLowerCase(),md=ii.extmetadata||{},lic=(md.LicenseShortName||{}).value||'',desc=strip((md.ImageDescription||{}).value).toLowerCase();
    if(!/\.(jpe?g|png|webp)$/.test(t)||!okLic.test(lic)||ii.width<1000||ii.width<ii.height*1.25)continue;
    if(!(/(^|[^a-z])twice([^a-z]|$)/.test(t)||t.includes('트와이스'))||!/k-?pop|girl group|jyp|트와이스|once|showcase|concert|award|fan|music|stage|tour|20\d\d/.test(t+' '+desc))continue;
    const nm=members.filter(m=>hasA(t,m)).length;if((nm>0&&nm<7)||/logo|cover|poster|ticket|lightstick|album/.test(t))continue;
    const dt=strip((md.DateTimeOriginal||md.DateTime||{}).value),mm=/(\d{4})-(\d{2})/.exec(dt),d=mm?[mm[1],mm[2]]:titleDate(t);l.push({url:ii.thumburl,ym:dnum(d)})}
  grp={_t:Date.now(),l:l.slice(0,90)};grpMap=null;try{localStorage.setItem('twiceGroup',JSON.stringify(grp))}catch(e){}}
function groupFor(al){const l=grp.l||[];if(!l.length)return null;if(!grpMap){grpMap={};const use={};[...albumList].sort((a,b)=>a[1]<b[1]?-1:1).forEach(([a,r])=>{const t=ym(r)+1,b=l.map(x=>({x,s:(x.ym?Math.abs(x.ym-t):48)+(use[x.url]||0)*10})).sort((p,q)=>p.s-q.s)[0];grpMap[a]=b.x.url;use[b.x.url]=(use[b.x.url]||0)+1})}return grpMap[al]}
function showGroup(al){const g=groupFor(al);if(!g)return;const o=document.createElement('div');o.className='sheet dsheet';o.onclick=()=>o.remove();o.innerHTML=`<button class="dclose">✕</button><div class="gview"><img src="${esc(g)}" referrerpolicy="no-referrer"><b>TWICE · ${esc(al)}</b><small>${esc(albumMap[al]||'')}</small></div>`;document.body.appendChild(o);playAlbum(al)}
drawCollection=function(){const a=$('#fa').value,r=$('#fr').value,s=$('#fs').value,cs=data.cards.filter(c=>(a==='Todos los álbumes'||c.album===a)&&(r==='Todas las rarezas'||c.rarity===r)&&(s==='Todas'||(s==='Tengo')===!!data.owned[c.id]));
  const g=allAlbums().map(al=>[al,cs.filter(c=>c.album===al)]).filter(x=>x[1].length);
  $('#grid').innerHTML=g.map(([al,l])=>{const all=data.cards.filter(c=>c.album===al),o=all.filter(c=>data.owned[c.id]).length,gp=groupFor(al),cv=covers[al];
    return`<section class="asec"><div class="ahead bn2" ${gp?`onclick="showGroup(${esc(JSON.stringify(al))})"`:''}>${gp?`<img class="gph" src="${esc(gp)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:cv?`<img class="gph blur" src="${esc(covS(cv,100))}" loading="lazy" referrerpolicy="no-referrer">`:''}<i class="gsh"></i><div class="ath">${coverImg(al)}</div><div class="ainfo"><b>${esc(al)}</b><small>${esc(albumMap[al]||'')} · ${o}/${all.length} conseguidas</small><i class="abar"><u style="width:${o/all.length*100}%"></u></i></div></div><div class="grid">${cardGrid(l)}</div></section>`}).join('')||'<p>No hay cartas con ese filtro.</p>'};
// --- sobre estilo cromo real ---
packArt=function(album){const rnd=album==='RANDOM',wc=albumList.map(a=>a[0]).filter(a=>covers[a]),pick=()=>wc[Math.floor(Math.random()*wc.length)],al=rnd?(wc.length?pick():'TWICE'):album,cv=covers[al];
  const art=rnd?(wc.length>=4?`<div class="col4">${[0,1,2,3].map(()=>`<img src="${esc(covS(covers[pick()],300))}" referrerpolicy="no-referrer">`).join('')}</div>`:backHTML(al)):(cv?`<img src="${esc(cv)}" referrerpolicy="no-referrer">`:backHTML(al));
  return`<div class="pk3d v2" id="pack"><div class="pk-obj"><div class="pk-cards">${backHTML(al).repeat(3).replace(/class="back/g,'class="pkc back')}</div>
  <div class="pk-face pk-main">${cv?`<img class="pk-bg" src="${esc(covS(cv,100))}" referrerpolicy="no-referrer">`:''}<i class="pk-tint"></i><i class="pk-wr"></i>
   <div class="pk-lay"><div class="pk-rib">OFFICIAL PHOTOCARD PACK</div><div class="pk-art">${art}<i class="pk-win"></i></div><div class="pk-logo">${logoHTML('plg')}</div><div class="pk-name">${esc(rnd?'RANDOM PACK':album)}</div><div class="pk-sub">ONCE COLLECTION · ${rnd?'2015–2026':esc((albumMap[album]||'').slice(0,4))}</div></div>
   <div class="pk-badge"><b>5</b><span>CARDS</span></div><div class="crimp b"></div><div class="pk-foil"></div><i class="pk-gloss"></i></div>
  <div class="pk-face pk-cap"><div class="crimp t"></div><span class="pk-tear">✂ ABRIR AQUÍ</span><div class="pk-foil"></div><i class="pk-gloss"></i></div>
  <div class="pk-face pk-back">${logoHTML('plg')}<small>5 photocards · 1 R o superior garantizada</small></div><div class="pk-side l"></div><div class="pk-side r"></div></div><div class="cutline"><i></i></div><div class="burst"></div><i class="pk-floor"></i></div>`};


// ================= v12 =================
// --- 20 cartas por álbum: 9 miembros + 9 variantes + portada + grupal ---
if((data.rv||0)<3){const have=new Set(data.cards.map(c=>c.id)),R2=['SSR','SR','SR','R','R','R','N','N','N'],add=[];
  albumList.forEach(([al,rel])=>{const y=rel.slice(0,4),base=slug(al);
    members.map((m,i)=>[m,i]).sort((a,b)=>hash(al+a[0]+'b')-hash(al+b[0]+'b')).forEach(([m,i],k)=>{const id=base+'-'+slug(m)+'-'+String(i+1).padStart(2,'0')+'-b';if(!have.has(id))add.push({id,album:al,year:y,member:m,kind:'v',name:al+' — '+m+' (2)',rarity:R2[k]})});
    if(!have.has(base+'-portada'))add.push({id:base+'-portada',album:al,year:y,member:'Portada',kind:'cover',name:al+' — Portada',rarity:'SR'});
    if(!have.has(base+'-grupo'))add.push({id:base+'-grupo',album:al,year:y,member:'Grupal',kind:'group',name:al+' — Grupal',rarity:'UR'})});
  data.cards.push(...add);data.rv=3;save()}
// --- Getty Images (API propia del usuario) ---
let gKey=localStorage.getItem('gettyKey')||'',gClips={},gGrp={l:[]},gSt={n:0,c:0,g:0,err:'',busy:false};
try{gClips=JSON.parse(localStorage.getItem('twiceGClips')||'{}');gGrp=JSON.parse(localStorage.getItem('twiceGGrp')||'{"l":[]}')}catch(e){}
const gWait=ms=>new Promise(r=>setTimeout(r,ms));
async function gfetch(p){const r=await fetch('https://api.gettyimages.com/v3/'+p,{headers:{'Api-Key':gKey,'Accept':'application/json'}});if(!r.ok)throw new Error('Getty '+r.status+(r.status===401||r.status===403?' (clave no válida)':''));return r.json()}
const gF='&fields=id,title,caption,date_created,display_set,max_dimensions&page_size=40';
function gItem(it){const ds=it.display_sizes||[],pk=n=>{const x=ds.find(d=>d.name===n&&d.uri);return x&&x.uri},u=pk('comp')||pk('preview')||pk('thumb');if(!u)return null;
  const mm=/(\d{4})-(\d{2})/.exec(it.date_created||''),d=mm?[mm[1],mm[2]]:null,md=it.max_dimensions||{};
  return{u,id:it.id,t:((it.title||'')+' '+(it.caption||'')).toLowerCase(),ym:dnum(d),date:dstr(d),w:md.width||0,h:md.height||0}}
const gImgs=async q=>((await gfetch('search/images/editorial?phrase='+encodeURIComponent(q)+gF)).images||[]).map(gItem).filter(Boolean);
const gVids=async q=>((await gfetch('search/videos/editorial?phrase='+encodeURIComponent(q)+gF)).videos||[]).map(it=>{const x=gItem(it);return x&&/\.(mp4|webm)(\?|$)/i.test(x.u)?x:null}).filter(Boolean);
function gStatus(){return gSt.busy?'Buscando en Getty…':gKey?`Getty: ${gSt.n} fotos · ${gSt.c} clips · ${gSt.g} grupales`+(gSt.err?` · ${gSt.err}`:''):'Sin clave de Getty'}
async function loadGetty(force){if(!gKey||gSt.busy)return;if(!force&&gSt.t&&Date.now()-gSt.t<7*864e5)return;gSt.busy=true;gSt.err='';gSt.n=gSt.c=gSt.g=0;const upd=()=>{const n=$('#gStat');if(n)n.textContent=gStatus()};upd();
  const clips={},gl=[];
  try{
    for(const m of members){const others=members.filter(x=>x!==m);
      try{const l=(await gImgs('TWICE '+m)).filter(x=>isTw(x.t)&&hasA(x.t,m)&&!others.some(o=>hasA(x.t,o)));
        const old=(imgPool[m]||[]).filter(x=>!x.g);imgPool[m]=l.map(x=>({url:x.u,source:'https://www.gettyimages.com/detail/'+x.id,license:'Getty Images',author:'Getty Images',ym:x.ym,date:x.date,g:1})).concat(old);gSt.n+=l.length}catch(e){gSt.err=e.message;if(/401|403/.test(e.message))throw e}
      await gWait(260);upd();
      try{clips[m]=(await gVids('TWICE '+m)).filter(x=>isTw(x.t)&&hasA(x.t,m)).map(x=>({src:x.u,source:'https://www.gettyimages.com/detail/'+x.id,license:'Getty Images',author:'Getty Images'}));gSt.c+=clips[m].length}catch(e){gSt.err=e.message}
      await gWait(260)}
    for(const q of ['TWICE group','TWICE K-pop girl group','TWICE concert','TWICE press conference']){
      try{(await gImgs(q)).forEach(x=>{const n=members.filter(m=>hasA(x.t,m)).length;if(isTw(x.t)&&(n===0||n>=5)&&(!x.w||x.w>=x.h*1.25))gl.push({url:x.u,ym:x.ym,g:1})})}catch(e){gSt.err=e.message}await gWait(260)}
    try{clips._group=(await gVids('TWICE')).filter(x=>isTw(x.t)).map(x=>({src:x.u,source:'https://www.gettyimages.com/detail/'+x.id,license:'Getty Images',author:'Getty Images'}));gSt.c+=clips._group.length}catch(e){}
    const seen={};gGrp={l:gl.filter(x=>!seen[x.url]&&(seen[x.url]=1)).slice(0,60)};gSt.g=gGrp.l.length;gClips=clips;gSt.t=Date.now();
    try{localStorage.setItem('twiceImgPool2',JSON.stringify(imgPool));localStorage.setItem('twiceGClips',JSON.stringify(gClips));localStorage.setItem('twiceGGrp',JSON.stringify(gGrp))}catch(e){}
  }catch(e){gSt.err=e.message}
  gSt.busy=false;grpMap=null;upd();softRender()}
function gConnect(){gKey=($('#gKey').value||'').trim();localStorage.setItem('gettyKey',gKey);if(gKey)loadGetty(true);else{gSt.err='';const n=$('#gStat');if(n)n.textContent=gStatus()}}
const _rs2=renderSource;renderSource=function(c){_rs2(c);c.insertAdjacentHTML('afterbegin',`<div class="srcbox"><b>Getty Images</b><p class="small">Pega tu API Key de developer.gettyimages.com. Uso personal: las imágenes y clips son vistas previas con marca de agua.</p><input id="gKey" class="inp" placeholder="API Key de Getty" value="${esc(gKey)}"><button class="secondary" onclick="gConnect()">CONECTAR Y BUSCAR</button><p class="small" id="gStat">${gStatus()}</p></div>`)};
// --- clips cortos (GIF real): vídeo recortado en bucle de 3 s ---
function clipInit(v){const d=v.duration||0,len=Math.min(3,d>0?d/2:3),st=d>len*2?Math.min(d*.3,d-len-.5):0;v._s=st;v._e=st+len;try{v.currentTime=st}catch(e){}}
function clipLoop(v){if(v._e&&v.currentTime>=v._e){try{v.currentTime=v._s}catch(e){}}}
videoFor=function(card){const k=card.kind==='group'||card.kind==='cover'?'_group':card.member,l=((gClips[k]||[]).concat(vidPool[k]||[])),f=l.length?l:((gClips._group||[]).concat(vidPool._group||[]));return f.length?f[hash(card.id)%f.length]:null};
let vidTag=(v,g)=>v?`<video class="live" data-fv="${esc(v.src)}"${g?' data-g="1"':''} muted loop playsinline autoplay preload="auto" src="${esc(v.src)}" onloadedmetadata="clipInit(this)" ontimeupdate="clipLoop(this)" onplaying="this.classList.add('on');this.closest('.pc').classList.add('hasv')" onerror="this.remove()"></video><span class="livebadge">● GIF</span>`:'';
// --- fotos: la variante usa otra foto distinta de la carta base ---
const _pf=photoFor;photoFor=function(card){if(card.kind!=='v')return _pf(card);const base=_pf({...card,kind:null,id:card.id.replace(/-b$/,'')}),p=imgPool[card.member]||[];
  if(card.ext||p.length<2)return base;const t=ym(albumMap[card.album])+1,l=p.filter(x=>!base||x.url!==base.url).map(x=>({x,d:x.ym?Math.abs(x.ym-t):999})).sort((a,b)=>a.d-b.d).slice(0,8);
  return l.length?{...l[hash(card.id)%l.length].x,d:l[0].d}:base};
// --- cara de la carta (miembro / portada / grupal) ---
const KTY={cover:['♪','#ff5fa2'],group:['×9','#fcc89b']};
faceHTML=function(card,small,live){const k=card.kind,t=KTY[k]||TY[card.member]||['TEQ','#22c55e'],hi=card.rarity==='SSR'||card.rarity==='UR',alive=live&&hi,ld=small?' loading="lazy"':'';let inner='',nl=false;
  if(k==='cover'){const cv=covers[card.album];inner=cv?`<img class="cbg" decoding="async" referrerpolicy="no-referrer"${ld} src="${esc(covS(cv,100))}"><img class="cfg" decoding="async" referrerpolicy="no-referrer"${ld} src="${esc(small?covS(cv,300):cv)}">`:`<div class="cpat">${_backPattern(card.album)}</div>`}
  else if(k==='group'){const g=groupFor(card.album),v=alive?videoFor(card):null;inner=g?`<img class="cbg" decoding="async" referrerpolicy="no-referrer"${ld} src="${esc(g)}"><div class="gstrip"><img decoding="async" referrerpolicy="no-referrer"${ld} data-fu="${esc(g)}" data-g="1" src="${esc(g)}">${vidTag(v,1)}</div>`:`<div class="ph"><span>TWICE ×9</span></div>`}
  else{const p=photoFor(card),v=alive?videoFor(card):null,gs=alive&&!v?gifSet(card):[];
    inner=`${p?`<img decoding="async" referrerpolicy="no-referrer"${ld} data-fu="${esc(p.url)}" src="${esc(p.url)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`:''}<div class="ph" ${p?'style="display:none"':''}><span>${esc(card.member)}</span></div>${gs.length?`<div class="gif n${gs.length+1}">${gs.map((u,i)=>`<img data-fu="${esc(u)}" src="${esc(u)}" referrerpolicy="no-referrer" decoding="async" style="animation-delay:${(i+1)*1.6}s">`).join('')}</div>`:''}${vidTag(v)}`}
  return`<div class="pc r-${card.rarity}${small?' sm':''}${alive?' alive':''}${k?' k-'+k:''}" style="--ty:${t[1]}"><div class="in">${inner}${alive?'<i class="glit"></i>':''}<div class="shine"></div><div class="holo"></div><div class="glr"></div><div class="tag">${card.rarity}</div><div class="cap"><b>${esc(card.member)}</b><small>${esc(card.album)}</small></div></div></div>`};
cardUrls=function(c){const u=[];if(c.kind==='cover'){if(covers[c.album])u.push(covers[c.album])}else if(c.kind==='group'){const g=groupFor(c.album);if(g)u.push(g)}else{const p=photoFor(c);if(p&&p.url)u.push(p.url);if((c.rarity==='SSR'||c.rarity==='UR')&&!videoFor(c))u.push(...gifSet(c))}if(covers[c.album])u.push(covers[c.album]);return u};
function preVid(src){return new Promise(r=>{const v=document.createElement('video');v.muted=true;v.preload='auto';let d=0;const f=()=>{if(!d){d=1;r()}};v.onloadeddata=f;v.onerror=f;setTimeout(f,6000);v.src=src;window._pv=(window._pv||[]).concat(v).slice(-12)})}
preloadCards=cs=>Promise.all([].concat(...cs.map(cardUrls)).map(preImg).concat(cs.filter(c=>(c.rarity==='SSR'||c.rarity==='UR')&&c.kind!=='cover').map(c=>{const v=videoFor(c);return v?preVid(v.src):null}).filter(Boolean)));
// --- reverso ---
pcBack=function(c){const cv=covers[c.album],al=data.cards.filter(x=>x.album===c.album&&!x.ext),no=Math.max(1,al.findIndex(x=>x.id===c.id)+1),sub=c.kind==='cover'?'Portada del álbum':c.kind==='group'?'TWICE · las 9':c.member;
  return`<div class="pcb r-${c.rarity}"><div class="in">${cv?`<img class="pcb-bg" src="${esc(covS(cv,100))}">`:''}<div class="pcb-c">${logoHTML('pcb-lg')}${cv?`<img class="pcb-cv" src="${esc(cv)}" referrerpolicy="no-referrer">`:`<div class="pcb-cv">${_backPattern(c.album)}</div>`}<div class="pcb-m">${esc(sub)}</div><div class="pcb-a">${esc(c.album)} · ${esc((albumMap[c.album]||'').slice(0,4))}</div><div class="pcb-r">${'★'.repeat(rarityInfo[c.rarity].stars)} ${c.rarity}</div><div class="pcb-ft"><span>No. ${String(no).padStart(2,'0')}/${String(al.length).padStart(2,'0')}</span><i class="pcb-bar"></i><span>ONCE</span></div></div></div></div>`};
// --- grupales: Commons + Getty ---
groupFor=function(al){const l=(gGrp.l||[]).concat(grp.l||[]);if(!l.length)return null;if(!grpMap){grpMap={};const use={};[...albumList].sort((a,b)=>a[1]<b[1]?-1:1).forEach(([a,r])=>{const t=ym(r)+1,b=l.map(x=>({x,s:(x.ym?Math.abs(x.ym-t):48)+(use[x.url]||0)*10})).sort((p,q)=>p.s-q.s)[0];grpMap[a]=b.x.url;use[b.x.url]=(use[b.x.url]||0)+1})}return grpMap[al]};


// ================= v13 =================
// ---------- detección de caras (face-api, modelo tiny incluido en la app) ----------
let focus={};try{focus=JSON.parse(localStorage.getItem('twiceFocus')||'{}')}catch(e){}
let fST=0;const fSave=()=>{clearTimeout(fST);fST=setTimeout(()=>{const k=Object.keys(focus);if(k.length>1800)k.slice(0,k.length-1800).forEach(x=>delete focus[x]);try{localStorage.setItem('twiceFocus',JSON.stringify(focus))}catch(e){}},800)};
const loadJS=src=>new Promise((r,j)=>{const s=document.createElement('script');s.src=src;s.onload=r;s.onerror=j;document.head.appendChild(s)});
let FD=null;
function fdInit(){if(!FD)FD=(async()=>{await loadJS('face-api.js');await loadJS('fmodel.js');const fa=window.faceapi,tf=fa.tf;
  try{await tf.setBackend('webgl');await tf.ready()}catch(e){await tf.setBackend('cpu');await tf.ready()}
  const raw=Uint8Array.from(atob(FMODEL.b),c=>c.charCodeAt(0)).buffer;await fa.nets.tinyFaceDetector.loadFromWeightMap(tf.io.decodeWeights(raw,FMODEL.w));window.FMODEL=null;return fa})().catch(e=>{console.warn('FD',e);return null});return FD}
async function faces(src,w,h){const fa=await fdInit();if(!fa)return null;const r=await fa.detectAllFaces(src,new fa.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.45}));
  return r.map(d=>{const b=d.box;return{x:(b.x+b.width/2)/w,y:(b.y+b.height/2)/h,s:b.height/h}})}
function mkRec(f,a){const r={a,n:f.length};if(f.length){const m=f.reduce((p,q)=>p.s>q.s?p:q),xs=f.map(q=>q.x);Object.assign(r,{x:m.x,y:m.y,s:m.s,gx:(Math.min(...xs)+Math.max(...xs))/2,gy:f.reduce((p,q)=>p+q.y,0)/f.length})}return r}
const clamp=v=>Math.max(0,Math.min(1,v));
function posFor(r,boxA,g){if(!r||!r.n)return'';const cx=g?r.gx:r.x,cy=g?r.gy:r.y;let px=.5,py=.3;
  if(r.a>boxA){const f=boxA/r.a;px=clamp((cx-f/2)/(1-f))}else if(r.a<boxA){const f=r.a/boxA;py=clamp((cy-(g?.5:.4)*f)/(1-f))}return`${(px*100).toFixed(1)}% ${(py*100).toFixed(1)}%`}
function setPos(el,r){let A=el.dataset.g?16/9:2/3;try{const q=el.getBoundingClientRect();if(q.width>20&&q.height>20&&!el.dataset.g)A=q.width/q.height}catch(e){}const p=posFor(r,A,!!el.dataset.g);if(p){if(el.tagName==='IMG')el.style.objectPosition=p;else el.style.backgroundPosition=p}}
const fq=new Map();
function analyzeImg(url){if(!url)return Promise.resolve(null);if(focus[url])return Promise.resolve(focus[url]);if(fq.has(url))return fq.get(url);
  const p=(async()=>{const im=new Image();im.referrerPolicy='no-referrer';let bu=null;try{bu=await IC.load(url)}catch(e){}await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=bu||url;setTimeout(j,9000)});
    let f=null;try{f=await faces(im,im.naturalWidth,im.naturalHeight)}catch(e){try{const bm=await createImageBitmap(await(await fetch(url,{referrerPolicy:'no-referrer'})).blob()),c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;c.getContext('2d').drawImage(bm,0,0);f=await faces(c,c.width,c.height)}catch(e2){focus[url]={a:im.naturalWidth/im.naturalHeight,n:0,err:1};fSave();return null}}
    if(!f)return null;const r=mkRec(f,im.naturalWidth/im.naturalHeight);focus[url]=r;fSave();document.querySelectorAll('[data-fu]').forEach(el=>{if(el.dataset.fu===url)setPos(el,r)});return r})().catch(()=>null).finally(()=>fq.delete(url));
  fq.set(url,p);return p}
const seekTo=(v,t)=>new Promise(r=>{const f=()=>{v.removeEventListener('seeked',f);r()};v.addEventListener('seeked',f);try{v.currentTime=t}catch(e){r()}setTimeout(r,3000)});
// analiza un clip: busca el momento con la cara más grande (miembro) o con más caras (grupal)
async function analyzeClip(src,g){const k='v:'+src;if(focus[k])return focus[k];
  const v=document.createElement('video');v.muted=true;v.preload='auto';v.playsInline=true;
  try{await new Promise((r,j)=>{v.onloadeddata=r;v.onerror=j;v.src=src;setTimeout(j,9000)})}catch(e){return null}
  const d=v.duration||0,W=v.videoWidth,H=v.videoHeight;if(!W)return null;const c=document.createElement('canvas'),sc=Math.min(1,640/W);c.width=Math.round(W*sc);c.height=Math.round(H*sc);const ctx=c.getContext('2d');
  let best=null;try{for(const t of(d>1.5?[.12,.28,.44,.6,.76].map(x=>x*d):[0])){await seekTo(v,t);ctx.drawImage(v,0,0,c.width,c.height);const f=await faces(c,c.width,c.height);if(!f)return null;
    const big=f.length?Math.max(...f.map(q=>q.s)):0,sc2=g?f.length+big:big*(f.length<=2?1.2:1);if(!best||sc2>best.sc)best={sc:sc2,t,f}}}
  catch(e){focus[k]={err:1,n:0,ok:true};fSave();return focus[k]}
  const r=mkRec(best.f,W/H);r.t=best.t;r.d=d;const big=r.n?r.s:0;r.ok=g?r.n>=3:(r.n>=1&&big>=.14);
  focus[k]=r;fSave();v.removeAttribute('src');try{v.load()}catch(e){}return r}
// cola de análisis en segundo plano (prioridad a lo que se está viendo)
const fQ=[];let fBusy=false;
function queueImg(u,pri){if(!u||focus[u]||fQ.includes(u))return;pri?fQ.unshift(u):fQ.push(u);if(fQ.length>500)fQ.length=500;setTimeout(fRun,pri?0:2500)}
async function fRun(){if(fBusy)return;fBusy=true;while(fQ.length){const u=fQ.shift();await analyzeImg(u);await gWait(document.hidden?1500:80)}fBusy=false}
function focusPass(root){if(!root.querySelectorAll)return;root.querySelectorAll('img[data-fu],div[data-fu]').forEach(el=>{const r=focus[el.dataset.fu];if(r)setPos(el,r);else queueImg(el.dataset.fu,!!el.closest('.rc,.ffront,.dsheet'))});
  root.querySelectorAll('video[data-fv]').forEach(el=>{const r=focus['v:'+el.dataset.fv];if(r)setPos(el,r)})}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){focusPass(n);if(n.matches&&n.matches('img[data-fu],div[data-fu]'))focusPass(n.parentNode)}}))).observe(document.body,{childList:true,subtree:true});
clipInit=function(v){const r=focus['v:'+(v.dataset.fv||'')],d=v.duration||0;if(d&&d<=6){v._s=0;v._e=0}else{const len=3;const st=r&&r.t!=null?Math.max(0,Math.min(r.t-1,d-len)):(d>len*2?Math.min(d*.3,d-len-.5):0);v._s=st;v._e=st+len;try{v.currentTime=st}catch(e){}}if(r)setPos(v,r)};
// ---------- más bancos: Fandom (galerías por era) + GIPHY + Tenor ----------
let fdm={};try{fdm=JSON.parse(localStorage.getItem('twiceFandom')||'{}')}catch(e){}
const WIKIS=['https://kpop.fandom.com/api.php','https://twice.fandom.com/api.php'];
async function wsearch(api,q){const u=api+'?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=700&gsrsearch='+encodeURIComponent(q);const j=await(await fetch(u)).json();return Object.values((j.query||{}).pages||{})}
const hasAlb=(t,na)=>{const n=norm(t),i=n.indexOf(na);return i>=0&&!/\d/.test(n[i+na.length]||'')};
let fdBusy=false;
async function loadFandom(force){if(fdBusy||(!force&&fdm._t&&Date.now()-fdm._t<7*864e5))return;fdBusy=true;const out={_t:Date.now()};let n=0,dead=0;
  for(const[al]of albumList){const na=norm(al),o={m:{},g:[]};
    for(const api of WIKIS){let ps=[];try{ps=await wsearch(api,'TWICE '+al)}catch(e){dead++;continue}
      for(const p of ps){const ii=(p.imageinfo||[])[0];if(!ii)continue;const t=p.title.toLowerCase(),u=ii.thumburl||ii.url;
        if(!/\.(jpe?g|png|webp)$/.test(t)||!hasAlb(t,na)||/logo|tracklist|album ?art|cover|jacket|lightstick|poster/.test(t))continue;
        const ms=members.filter(m=>hasA(t,m));
        if(ms.length===1){const l=o.m[ms[0]]=o.m[ms[0]]||[];if(!l.includes(u)){l.push(u);n++}}
        else if((ms.length===0||ms.length>=7)&&ii.width>=ii.height*1.2&&!o.g.includes(u)){o.g.push(u);n++}}
      await gWait(120)}
    if(Object.keys(o.m).length||o.g.length)out[al]=o;const s=$('#bkStat');if(s)s.innerHTML=bankText()}
  out._n=n;if(n||!fdm._n)fdm=out;try{localStorage.setItem('twiceFandom',JSON.stringify(fdm))}catch(e){}fdBusy=false;grpMap=null;const s=$('#bkStat');if(s)s.innerHTML=bankText();softRender()}
const fandomFor=(al,m)=>((fdm[al]||{}).m||{})[m]||[];
const _pf3=photoFor;photoFor=function(card){if(!card.ext&&card.kind!=='cover'&&card.kind!=='group'){const f=fandomFor(card.album,card.member);
  if(f.length){const i=hash(card.id.replace(/-b$/,''))%f.length,j=card.kind==='v'&&f.length>1?(i+1+hash(card.id)%(f.length-1))%f.length:i;return{url:f[j],d:0,source:'Fandom',license:'',author:''}}}return _pf3(card)};
const _gf3=groupFor;groupFor=function(al){const g=(fdm[al]||{}).g||[];return g.length?g[hash(al)%g.length]:_gf3(al)};
let gyKey=localStorage.getItem('giphyKey')||'',tnKey=localStorage.getItem('tenorKey')||'',xClips={},xSt={busy:false,err:''};try{xClips=JSON.parse(localStorage.getItem('twiceXClips')||'{}')}catch(e){}
async function giphy(q){const j=await(await fetch('https://api.giphy.com/v1/gifs/search?api_key='+encodeURIComponent(gyKey)+'&limit=50&rating=pg-13&q='+encodeURIComponent(q))).json();if(j.meta&&j.meta.status>=400)throw new Error('GIPHY '+j.meta.status);
  return(j.data||[]).map(it=>{const im=it.images||{},mp=(im.original_mp4||{}).mp4||(im.original||{}).mp4||(im.fixed_height||{}).mp4;return mp?{src:mp,t:((it.title||'')+' '+(it.slug||'')).toLowerCase(),source:it.url,license:'GIPHY',author:'GIPHY'}:null}).filter(Boolean)}
async function tenor(q){const j=await(await fetch('https://tenor.googleapis.com/v2/search?limit=50&media_filter=mp4&contentfilter=medium&key='+encodeURIComponent(tnKey)+'&q='+encodeURIComponent(q))).json();if(j.error)throw new Error('Tenor '+(j.error.code||''));
  return(j.results||[]).map(it=>{const mp=((it.media_formats||{}).mp4||{}).url;return mp?{src:mp,t:((it.content_description||'')+' '+(it.title||'')+' '+(it.tags||[]).join(' ')).toLowerCase(),source:it.itemurl||'',license:'Tenor',author:'Tenor'}:null}).filter(Boolean)}
async function loadGifs(force){if(xSt.busy||(!gyKey&&!tnKey)||(!force&&xClips._t&&Date.now()-xClips._t<5*864e5))return;xSt.busy=true;xSt.err='';const out={_t:Date.now()};const upd=()=>{const s=$('#bkStat');if(s)s.innerHTML=bankText()};upd();
  const run=async q=>{let l=[];if(gyKey)try{l=l.concat(await giphy(q))}catch(e){xSt.err=e.message}if(tnKey)try{l=l.concat(await tenor(q))}catch(e){xSt.err=e.message}await gWait(200);return l};
  for(const m of members){const others=members.filter(x=>x!==m),l=await run('twice '+m.toLowerCase());out[m]=l.filter(x=>hasA(x.t,m)&&!others.some(o=>hasA(x.t,o))).slice(0,30);upd()}
  out._group=(await run('twice kpop')).concat(await run('twice group')).filter(x=>isTw(x.t)&&(()=>{const n=members.filter(m=>hasA(x.t,m)).length;return n===0||n>=5})()).slice(0,30);
  xClips=out;try{localStorage.setItem('twiceXClips',JSON.stringify(out))}catch(e){}xSt.busy=false;upd()}
// candidatos de clip: GIPHY/Tenor > Getty > Commons; sin clips de grupo en cartas individuales; se descartan los que no tienen la cara cerca
let clipCands=card=>{const k=card.kind==='group'?'_group':card.member;return[...(xClips[k]||[]),...(gClips[k]||[]),...(vidPool[k]||[])]};
videoFor=function(card){if(card.kind==='cover')return null;const L=clipCands(card).filter(v=>{const r=focus['v:'+v.src];return!r||r.ok!==false});if(!L.length)return null;
  const ok=L.filter(v=>(focus['v:'+v.src]||{}).ok),P=ok.length?ok:L;return P[hash(card.id)%P.length]};
async function ensureClip(card){for(let i=0;i<4;i++){const v=videoFor(card);if(!v)return;const r=focus['v:'+v.src]||await analyzeClip(v.src,card.kind==='group');if(!r||r.ok!==false)return preVid(v.src)}}
preloadCards=cs=>Promise.all([].concat(...cs.map(cardUrls)).map(preImg).concat(cs.map(c=>{const p=c.kind?null:photoFor(c);return p&&p.url?analyzeImg(p.url):c.kind==='group'?analyzeImg(groupFor(c.album)):null}).filter(Boolean)).concat(cs.filter(c=>(c.rarity==='SSR'||c.rarity==='UR')&&c.kind!=='cover').map(ensureClip)));
function bankText(){const fc=Object.keys(fdm).filter(k=>k[0]!=='_').length,cl=k=>Object.keys(xClips).filter(x=>x[0]!=='_').reduce((a,m)=>a+(xClips[m]||[]).length,0)+((xClips._group||[]).length);
  const commons=members.reduce((a,m)=>a+(imgPool[m]||[]).filter(x=>!x.g).length,0),getty=members.reduce((a,m)=>a+(imgPool[m]||[]).filter(x=>x.g).length,0);
  return`<table class="bk"><tr><td>Fandom (galerías por era)</td><td>${fdBusy?'buscando…':(fdm._n||0)+' fotos · '+fc+'/'+albumList.length+' álbumes'}</td></tr><tr><td>Wikimedia + Openverse</td><td>${commons} fotos</td></tr><tr><td>Getty</td><td>${gKey?getty+' fotos':'sin clave'}</td></tr><tr><td>GIPHY / Tenor (GIF)</td><td>${xSt.busy?'buscando…':(gyKey||tnKey)?cl()+' GIF':'sin clave'}${xSt.err?' · '+esc(xSt.err):''}</td></tr><tr><td>Caras analizadas</td><td>${Object.keys(focus).length}</td></tr></table>`}
function saveKeys(){gyKey=($('#gyKey').value||'').trim();tnKey=($('#tnKey').value||'').trim();localStorage.setItem('giphyKey',gyKey);localStorage.setItem('tenorKey',tnKey);loadGifs(true)}
const _rs3=renderSource;renderSource=function(c){_rs3(c);c.insertAdjacentHTML('afterbegin',`<div class="srcbox"><b>Bancos de imágenes</b><div id="bkStat">${bankText()}</div><input id="gyKey" class="inp" placeholder="API Key de GIPHY (GIF reales)" value="${esc(gyKey)}"><input id="tnKey" class="inp" placeholder="API Key de Tenor (opcional)" value="${esc(tnKey)}"><button class="secondary" onclick="saveKeys()">GUARDAR Y BUSCAR GIF</button><button class="secondary" onclick="loadFandom(true)">RECARGAR FANDOM</button><button class="secondary" onclick="focus={};localStorage.removeItem('twiceFocus');alert('Encuadres borrados: se recalcularán')">RECALCULAR ENCUADRES</button></div>`)};
// ---------- interfaz 90s ----------
const TITLES={packs:'C:\\TWICE\\SOBRES.EXE',collection:'C:\\TWICE\\COLECCION',albums:'C:\\TWICE\\ALBUMES',members:'C:\\TWICE\\MIEMBROS',source:'C:\\TWICE\\FUENTE.CFG'};
const _r13=render;render=function(t){_r13(t);const c=$('#content');if(c)c.dataset.t=TITLES[t]||'C:\\TWICE'};
function clock(){const n=$('#clk');if(n){const d=new Date();n.textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}}setInterval(clock,20000);


// ================= v14 =================
// ---------- GIF fijos para todos (sin claves): galerías GIF de Fandom, orden estable ----------
let fgif={};try{fgif=JSON.parse(localStorage.getItem('twiceFGif')||'{}')}catch(e){}
async function wsearchG(api,q){const u=api+'?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url%7Csize%7Cmime&iiurlwidth=360&gsrsearch='+encodeURIComponent(q);const j=await(await fetch(u)).json();return Object.values((j.query||{}).pages||{})}
let fgBusy=false;
async function loadFandomGifs(force){if(fgBusy||(!force&&fgif._t&&Date.now()-fgif._t<7*864e5))return;fgBusy=true;const out={_t:Date.now()};
  for(const m of members.concat(['TWICE'])){const l=[],seen={};
    for(const api of WIKIS)for(const q of(m==='TWICE'?['TWICE gif','TWICE members gif']:[m+' gif','TWICE '+m+' gif'])){let ps=[];try{ps=await wsearchG(api,q)}catch(e){continue}
      ps.sort((a,b)=>a.title<b.title?-1:1).forEach(p=>{const ii=(p.imageinfo||[])[0],t=p.title.toLowerCase();if(!ii||!/\.gif$/.test(t)||seen[t])return;seen[t]=1;
        const n=members.filter(x=>hasA(t,x)).length;if(m==='TWICE'){if(!isTw(t)||(n>0&&n<5))return}else if(!hasA(t,m)||n>1)return;
        l.push({src:ii.thumburl||ii.url,gif:1,source:ii.descriptionurl||'',license:'Fandom',author:''})});await gWait(130)}
    out[m==='TWICE'?'_group':m]=l.slice(0,24);const s=$('#bkStat');if(s)s.innerHTML=bankText()}
  fgif=out;try{localStorage.setItem('twiceFGif',JSON.stringify(out))}catch(e){}fgBusy=false;const s=$('#bkStat');if(s)s.innerHTML=bankText()}
// solo fuentes sin clave => mismos clips para todo el mundo (GIF de Fandom > vídeos de Wikimedia)
clipCands=function(card){const k=card.kind==='group'?'_group':card.member;return[...(fgif[k]||[]),...(vidPool[k]||[])]};
vidTag=function(v,g){if(!v)return'';if(v.gif)return`<img class="live gifimg" data-fu="${esc(v.src)}"${g?' data-g="1"':''} src="${esc(v.src)}" referrerpolicy="no-referrer" decoding="async" onload="this.classList.add('on');this.closest('.pc').classList.add('hasv')" onerror="this.remove()"><span class="livebadge">● GIF</span>`;
  return`<video class="live" data-fv="${esc(v.src)}"${g?' data-g="1"':''} muted loop playsinline autoplay preload="auto" src="${esc(v.src)}" onloadedmetadata="clipInit(this)" ontimeupdate="clipLoop(this)" onplaying="this.classList.add('on');this.closest('.pc').classList.add('hasv')" onerror="this.remove()"></video><span class="livebadge">● GIF</span>`};
ensureClip=async function(card){const g=card.kind==='group';for(let i=0;i<5;i++){const v=videoFor(card);if(!v)return;const k='v:'+v.src;
  if(!focus[k]){if(v.gif){const r=await analyzeImg(v.src);if(!r||r.err)return preImg(v.src);focus[k]={...r,ok:g?r.n>=3:(r.n>=1&&r.s>=.14)};fSave()}else{const r=await analyzeClip(v.src,g);if(!r)return preVid(v.src)}}
  if(focus[k].ok!==false)return v.gif?preImg(v.src):preVid(v.src)}};
bankText=function(){const fc=Object.keys(fdm).filter(k=>k[0]!=='_').length,gf=Object.keys(fgif).filter(k=>k!=='_t').reduce((a,k)=>a+(fgif[k]||[]).length,0),commons=members.reduce((a,m)=>a+(imgPool[m]||[]).length,0),vids=Object.keys(vidPool||{}).reduce((a,k)=>a+((vidPool[k]||[]).length||0),0);
  return`<table class="bk"><tr><td>Fandom · fotos por era</td><td>${fdBusy?'buscando…':(fdm._n||0)+' · '+fc+'/'+albumList.length+' álb.'}</td></tr><tr><td>Fandom · GIF</td><td>${fgBusy?'buscando…':gf}</td></tr><tr><td>Wikimedia/Openverse</td><td>${commons} fotos · ${vids} vídeos</td></tr><tr><td>Encuadres por cara</td><td>${Object.keys(focus).length}</td></tr></table>`};
renderSource=function(c){_rs(c);c.insertAdjacentHTML('afterbegin',`<div class="srcbox"><b>Bancos de imágenes</b><p class="small">Automático y sin claves: todo el mundo ve las mismas fotos y GIF.</p><div id="bkStat">${bankText()}</div><button class="secondary" onclick="loadFandom(true);loadFandomGifs(true)">RECARGAR FANDOM</button><button class="secondary" onclick="focus={};localStorage.removeItem('twiceFocus');alert('Encuadres borrados: se recalcularán')">RECALCULAR ENCUADRES</button></div>`)};
// ---------- monedas ----------
if(data.coins==null){data.coins=5;data.figs={};save()}if(!data.figs)data.figs={};
const _op14=openPack3D;openPack3D=function(){if(busy)return;data.coins=(data.coins||0)+1;_op14()};
// ---------- 3D (carga diferida) ----------
let T3=null;const ensure3D=()=>T3||(T3=(async()=>{if(!window.THREE)await loadJS('three.min.js');if(!THREE.RoomEnvironment)await loadJS('three-room.js');if(!window.Fig3D)await loadJS('fig3d.js');try{await document.fonts.load('60px VT323')}catch(e){}return Fig3D})());
const FVAR=['normal','stage','gold','holo'],FODDS={normal:55,stage:30,gold:11,holo:4},FCOL={normal:'#ff5fa2',stage:'#2a1630',gold:'#ffc94a',holo:'#bfe8ff'};
const figKey=(m,v)=>m+'|'+v;
function rollFig(){let r=Math.random()*100,v='normal';for(const k of FVAR){if(r<FODDS[k]){v=k;break}r-=FODDS[k]}return{m:members[Math.floor(Math.random()*members.length)],v}}
// ---------- pestaña Gacha ----------
function renderGacha(c){const own=Object.keys(data.figs).length,caps=Array.from({length:18},(_,i)=>{const a=['#ff5fa2','#fcc89b','#5fc8ff','#a77bff','#6fe3c6','#ffc94a','#ff4b4b','#b8e15a'][i%8];return`<i class="cp" style="--c:${a};left:${8+(i*37)%76}%;top:${16+((i*53)%58)}%;--r:${(i*47)%360}deg"></i>`}).join('');
  c.innerHTML=`<h2>Gashapon</h2><p class="small">Gira la manivela y consigue figuras 3D de las 9. Cada sobre abierto te da 1 moneda.</p>
  <div class="gmach" id="gm"><div class="gm-top">TWICE ✦ GACHA</div><div class="gm-dome"><div class="gm-glass"></div>${caps}<div class="gm-shine"></div></div>
   <div class="gm-body"><div class="gm-lcd"><span>MONEDAS</span><b id="gcoins">${data.coins||0}</b></div><button class="gm-crank" id="gcrank" aria-label="Girar"><i></i></button><div class="gm-slot"><i></i></div>
   <div class="gm-chute"><div class="gm-out" id="gout"></div></div><div class="gm-logo">${logoHTML('gm-lg')}</div></div><div class="gm-feet"><i></i><i></i></div></div>
  <button class="open-btn" id="gspin">GIRAR · 1 MONEDA</button><p class="hint" id="ghint">Probabilidades: Normal 55% · Escenario 30% · Oro 11% · Holo 4%</p>
  <h3>Mis figuras ${own}/${members.length*FVAR.length}</h3><div class="fgrid" id="fgrid">${members.map(m=>FVAR.map(v=>{const n=data.figs[figKey(m,v)];return`<button class="ftile v-${v}${n?'':' lock'}" data-m="${m}" data-v="${v}" ${n?`onclick="viewFig('${m}','${v}')"`:''}><div class="fimg">${n?'<span class="fload"></span>':'<span class="fq">?</span>'}</div><b>${n?m:'???'}</b><small>${Fig3DVarName(v)}${n>1?' ×'+n:''}</small></button>`}).join('')).join('')}</div>`;
  $('#gspin').onclick=$('#gcrank').onclick=spinGacha;
  ensure3D().then(F=>{document.querySelectorAll('.ftile:not(.lock)').forEach((t,i)=>setTimeout(()=>{const d=t.querySelector('.fimg');if(!d||!document.body.contains(t))return;try{d.innerHTML=`<img src="${F.thumb(t.dataset.m,t.dataset.v)}">`}catch(e){}},i*40))}).catch(()=>{})}
const Fig3DVarName=v=>({normal:'Normal',stage:'Escenario',gold:'Oro',holo:'Holo'})[v];
let gBusy=false;
function spinGacha(){if(gBusy)return;const gm=$('#gm');if((data.coins||0)<1){gm.classList.remove('nope');void gm.offsetWidth;gm.classList.add('nope');$('#ghint').textContent='Sin monedas: abre sobres para conseguir más 🪙';return}
  gBusy=true;data.coins--;const f=rollFig(),k=figKey(f.m,f.v),isNew=!data.figs[k];data.figs[k]=(data.figs[k]||0)+1;save();$('#gcoins').textContent=data.coins;ensure3D();
  try{navigator.vibrate&&navigator.vibrate([15,40,15,40,15])}catch(e){}gm.classList.add('spin');
  setTimeout(()=>{gm.classList.remove('spin');const o=$('#gout');o.innerHTML=`<div class="capsule v-${f.v}" style="--c:${FCOL[f.v]}"><i class="ct"></i><i class="cb"></i><span>TOCA</span></div>`;o.classList.add('drop');
    $('#ghint').textContent=f.v==='gold'||f.v==='holo'?'✨ ¡Cápsula especial! Tócala para abrirla':'Toca la cápsula para abrirla';
    o.querySelector('.capsule').onclick=e=>{const cp=e.currentTarget;cp.classList.add('open');flash(FCOL[f.v]==='#2a1630'?'#ff5fa2':FCOL[f.v],.7);sparks(o,22,150);
      setTimeout(()=>{o.innerHTML='';o.classList.remove('drop');gBusy=false;viewFig(f.m,f.v,isNew?'¡NUEVA FIGURA!':'Repetida (×'+data.figs[k]+')')},650)}},1300)}
function viewFig(m,v,banner){const o=document.createElement('div');o.className='sheet fsheet';
  o.innerHTML=`<button class="dclose">✕</button><div class="fwin"><div class="fbar">${esc(m.toUpperCase())}_${v.toUpperCase()}.3D</div>${banner?`<div class="fban v-${v}">${esc(banner)}</div>`:''}<div class="fstage v-${v}" id="fstage"><div class="floading">Cargando figura…</div></div><div class="finfo"><b>${esc(m)}</b><span class="fvar v-${v}">${Fig3DVarName(v)}</span></div><p class="hint">Arrastra para girar · pellizca para zoom · doble toque para centrar</p></div>`;
  document.body.appendChild(o);let view=null;
  o.onclick=e=>{if(e.target===o||e.target.closest('.dclose')){if(view)view.dispose();o.remove();if($('#fgrid'))render('gacha')}};
  ensure3D().then(F=>{const st=o.querySelector('#fstage');if(!st)return;st.innerHTML='';try{view=F.mount(st,m,v)}catch(e){st.innerHTML='<div class="floading">Tu móvil no soporta 3D (WebGL)</div>'}}).catch(()=>{const st=o.querySelector('#fstage');if(st)st.innerHTML='<div class="floading">No se pudo cargar el 3D</div>'})}
const _r14=render;render=function(t){if(t==='gacha'){const c=$('#content');renderGacha(c);updateStats();c.dataset.t='C:\\TWICE\\GASHAPON.EXE';return}_r14(t)};


// v15: la pestaña Gacha abre la Capsule Station (máquina 3D, álbumes, puzzles)
const _r15=render;render=function(t){if(t==='gacha'){location.href='capsule.html?app=1';return}_r15(t)};


// ================= v17: colección unificada (sobres + gacha) =================
const capS=()=>{try{return JSON.parse(localStorage.getItem(CAP_KEY))||{}}catch(e){return{}}};
const capIdx=al=>ALB.findIndex(a=>normT(a[0])===normT(al));
const capGo=q=>{location.href='capsule.html?app=1&'+q};
let capDB=null;const capThumb=k=>new Promise(r=>{try{const go=db=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)};if(capDB)return go(capDB);const o=indexedDB.open('twiceCap',1);o.onupgradeneeded=()=>o.result.createObjectStore('kv');o.onsuccess=()=>{capDB=o.result;go(capDB)};o.onerror=()=>r(null)}catch(e){r(null)}});
function capRow(al){const i=capIdx(al);if(i<0)return'';const C=capS(),own=id=>(C.owned||{})[id]||C.test,art=((C.cache||{}).alb||{})[i]?C.cache.alb[i].art:'',fm=FMT[ALB[i][3]]||FMT.photobook;
 const tile=(id,cls,inner,lab)=>`<button class="cx ${cls}${own(id)?'':' lock'}" ${own(id)?`onclick="capGo('open=${id}')"`:''}>${inner}<b>${lab}</b></button>`;
 return`<div class="caprow"><div class="caph"><span>🎰 Del gacha</span><small>${fm.name}</small></div><div class="capgrid">
  ${tile('d'+i,'cd',`<i class="cdx" style="${art&&own('d'+i)?`background-image:url('${art}')`:''}"></i>`,'Álbum')}${tile('v'+i,'vin',`<i class="vnx" style="${art&&own('v'+i)?`background-image:url('${art}')`:''}"></i>`,'Vinilo')}
  ${MEM.map((m,mi)=>tile(`s${i}_${mi}`,'std',`<i class="stx" data-k="stand:s${i}_${mi}"></i>`,m.n)).join('')}</div></div>`}
const _dc17=drawCollection;drawCollection=function(){_dc17();const g=$('#grid');if(!g)return;
 g.querySelectorAll('.asec').forEach(sec=>{const b=sec.querySelector('.ahead b');if(b&&!sec.querySelector('.caprow'))sec.querySelector('.ahead').insertAdjacentHTML('afterend',capRow(b.textContent))});
 g.querySelectorAll('.stx[data-k]').forEach(async el=>{if(el.closest('.lock'))return;const r=await capThumb(el.dataset.k);if(r&&r.png)el.style.backgroundImage=`url('${r.png}')`;else el.classList.add('nopic')})};
const _rc17=renderCollection;renderCollection=function(c){_rc17(c);const C=capS(),n=Object.keys(C.owned||{}).length;
 c.querySelector('h2').insertAdjacentHTML('afterend',`<div class="capbar"><button class="secondary" onclick="capGo('view=shelf')">📀 Expositor de CDs</button><button class="secondary" onclick="capGo('view=vitrina')">🪟 Vitrina de stands</button><button class="secondary" onclick="capGo('view=puzzles')">🧩 Puzzles</button><span class="small">${n} premios del gacha</span></div>`)};


// ================= v18: retos diarios, logros, ruleta y sobres especiales =================
const DR=[100,150,200,300,400,600,1000];
const ydate=()=>{const d=new Date(Date.now()-864e5);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const addCoins=n=>{data.coins=(data.coins||0)+n;save();updateStats()};
let SPECIAL=null;
function claimDaily(){const s=stLoad();if(s.last===today())return;s.streak=s.last===ydate()?(s.streak||0)+1:1;s.last=today();const k=(s.streak-1)%7,c=DR[k];if(k===6)s.tickets++;stSave(s);addCoins(c);toast(`+${c} monedas${k===6?' y 1 ticket especial':''}`);render('retos')}
function toast(t){let n=$('#np');if(!n){n=document.createElement('div');n.id='np';document.body.appendChild(n)}n.innerHTML=`<i>★</i><span>${t}</span>`;n.classList.add('on');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('on'),2600)}
const WHEEL=[50,100,'🎫',150,250,75,500,1000];
function spinWheel(){const s=stLoad();if(s.spun)return;const k=Math.floor(Math.random()*WHEEL.length),w=$('#wheel');s.spun=true;stSave(s);
 w.style.transform=`rotate(${360*6-(k*45)-22.5}deg)`;setTimeout(()=>{const p=WHEEL[k];const s2=stLoad();if(p==='🎫'){s2.tickets++;stSave(s2);toast('¡1 ticket de sobre especial!')}else{addCoins(p);toast(`+${p} monedas`)}render('retos')},4200)}
function claimMission(j){const s=stLoad(),ms=todaysMissions(s),M=MISSIONS[ms[j].k];if(ms[j].claimed||(s.d[M[0]]||0)<M[1])return;ms[j].claimed=true;stSave(s);addCoins(M[3]);toast(`Misión completada · +${M[3]}`);render('retos')}
function claimAch(j){const s=stLoad(),A=ACH[j],v=A[0]==='streak'?(s.streak||0):(s.total[A[0]]||0);if(s.ach[j]||v<A[1])return;s.ach[j]=1;stSave(s);addCoins(A[3]);toast(`Logro: ${A[2]} · +${A[3]}`);render('retos')}
function openSpecial(k){const sp=specialPacks()[k],s=stLoad();if(s.tickets>0){s.tickets--;stSave(s)}else if((data.coins||0)>=300)addCoins(-300);else{toast('Necesitas 1 ticket o 300 monedas');return}
 SPECIAL=sp;nextPack=null;data.selectedAlbum=sp.type==='shoot'?(albumList.find(a=>normT(a[0])===normT(ALB[sp.alb][0]))||['RANDOM'])[0]:'RANDOM';save();document.querySelector('[data-tab=packs]').click()}
const ICON={bday:'🎂',anniv:'🎉',shoot:'📸',live:'🎤'};
function renderRetos(c){const s=stLoad(),ms=todaysMissions(s),got=s.last===today(),k=got?((s.streak||1)-1)%7:(s.last===ydate()?(s.streak||0)%7:0);
 c.innerHTML=`<h2>Retos</h2><div class="rgrid">
 <section class="rcard"><h3>📅 Recompensa diaria</h3><div class="days">${DR.map((v,i)=>`<div class="day${i<k||(got&&i===k)?' done':''}${i===k&&!got?' now':''}"><b>Día ${i+1}</b><span>${v}${i===6?'+🎫':''}</span></div>`).join('')}</div><p class="small">Racha: ${s.streak||0} días · tickets: ${s.tickets}</p><button class="open-btn" ${got?'disabled':''} onclick="claimDaily()">${got?'VUELVE MAÑANA':'RECOGER'}</button></section>
 <section class="rcard"><h3>🎡 Ruleta del día</h3><div class="wheelw"><div class="wheel" id="wheel">${WHEEL.map((v,i)=>`<span style="--i:${i}">${v}</span>`).join('')}</div><i class="wptr"></i></div><button class="open-btn" ${s.spun?'disabled':''} onclick="spinWheel()">${s.spun?'MAÑANA OTRA VEZ':'GIRAR'}</button></section>
 <section class="rcard"><h3>🎯 Misiones de hoy</h3>${ms.map((x,j)=>{const M=MISSIONS[x.k],v=Math.min(M[1],s.d[M[0]]||0);return`<div class="mis"><span>${M[2]}</span><i class="abar"><u style="width:${v/M[1]*100}%"></u></i><small>${v}/${M[1]}</small><button class="secondary" ${x.claimed||v<M[1]?'disabled':''} onclick="claimMission(${j})">${x.claimed?'✓':'+'+M[3]}</button></div>`}).join('')}
  <div class="gobtns"><button class="secondary" onclick="capGo('view=puzzles')">🧩 Puzzles</button><button class="secondary" onclick="capGo('view=song')">🎵 Canciones</button><button class="secondary" onclick="capGo('view=scan')">📷 Escanear CD</button></div></section>
 <section class="rcard wide"><h3>✨ Sobres especiales</h3><p class="small">1 ticket o 300 monedas · tickets: ${s.tickets}</p><div class="sps">${specialPacks().map((sp,i)=>`<button class="spx t-${sp.type}" onclick="openSpecial(${i})"><b>${ICON[sp.type]} ${esc(sp.title)}</b><span>${esc(sp.sub)}</span><em>${sp.type==='bday'?'Solo '+MEM[sp.mi].n+' · SSR garantizada':sp.type==='anniv'?'Probabilidad de UR ×4':sp.type==='shoot'?'Cartas de esa era · SSR garantizada':'Todas SR o mejor'}</em></button>`).join('')}</div></section>
 <section class="rcard wide"><h3>🏆 Logros</h3>${ACH.map((A,j)=>{const v=A[0]==='streak'?(s.streak||0):(s.total[A[0]]||0);return`<div class="mis"><span>${A[2]}</span><i class="abar"><u style="width:${Math.min(1,v/A[1])*100}%"></u></i><small>${Math.min(v,A[1])}/${A[1]}</small><button class="secondary" ${s.ach[j]||v<A[1]?'disabled':''} onclick="claimAch(${j})">${s.ach[j]?'✓':'+'+A[3]}</button></div>`}).join('')}</section></div>`}
const _r18=render;render=function(t){if(t==='retos'){const c=$('#content');renderRetos(c);updateStats();c.dataset.t='C:\\TWICE\\RETOS.EXE';return}_r18(t)};
// sobres especiales: reglas de reparto
const _pc18=pickCard;pickCard=function(min){const sp=SPECIAL;if(!sp)return _pc18(min);let pool=data.cards.filter(c=>!c.ext);
 if(sp.type==='bday')pool=pool.filter(c=>c.member===MEM[sp.mi].n);if(sp.type==='shoot')pool=pool.filter(c=>normT(c.album)===normT(ALB[sp.alb][0]));if(!pool.length)return _pc18(min);
 let r=randomRarity();if(sp.type==='anniv'&&Math.random()<.04)r='UR';const floor=Math.max(min,sp.type==='live'?2:1,min>=1&&sp.type!=='anniv'&&sp.type!=='live'?3:0);if(rKeys.indexOf(r)<floor)r=rKeys[floor];
 let p=pool.filter(c=>c.rarity===r);if(!p.length)p=pool.filter(c=>rKeys.indexOf(c.rarity)>=floor);if(!p.length)p=pool;return p[Math.floor(Math.random()*p.length)]};
const _rp18=renderPacks;renderPacks=function(c){_rp18(c);const sps=specialPacks();
 if(SPECIAL)c.querySelector('.hero').insertAdjacentHTML('afterbegin',`<div class="spbanner t-${SPECIAL.type}">${ICON[SPECIAL.type]} SOBRE ESPECIAL · ${esc(SPECIAL.title)}</div>`);
 else c.querySelector('.hero').insertAdjacentHTML('afterbegin',`<button class="spbanner t-${sps[0].type}" onclick="document.querySelector('[data-tab=retos]').click()">${ICON[sps[0].type]} ${esc(sps[0].title)} · ${esc(sps[0].sub)} ▸</button>`)};
const _op18=openPack3D;openPack3D=function(){if(busy)return;stat('packs');const wasSp=!!SPECIAL;_op18();if(wasSp){SPECIAL=null;nextPack=null}};

save();tabs();render('packs');Promise.all([loadImages(false),loadCovers(false)]).then(softRender);setTimeout(()=>loadGroup(false).then(()=>{grpMap=null}),2500);setTimeout(()=>loadGetty(false),6000);setTimeout(()=>loadFandom(false),3000);setTimeout(()=>loadFandomGifs(false),5000);clock();setTimeout(loadVideos,4000);
{const t=new URLSearchParams(location.search).get('tab');if(t){const b=document.querySelector('[data-tab="'+t+'"]');if(b)setTimeout(()=>b.click(),0)}}
;
/* ================= data.js ================= */
// =====================================================================================
//  data.js · catálogo canónico → datos de la app · imágenes solo de su era · caché de imágenes
// =====================================================================================
(function(){
// ---------- 1. CATÁLOGO → datos de la app (sin duplicar) ----------
const VIS=catVisibleAlbums().filter(a=>a.physical!==false);
albumList.splice(0,albumList.length,...VIS.map(a=>[a.title,a.release.v.slice(0,7)]));
Object.keys(albumMap).forEach(k=>delete albumMap[k]);albumList.forEach(([t,r])=>albumMap[t]=r);
Object.entries(CATALOG.rarities).forEach(([k,r])=>{if(rarityInfo[k]){rarityInfo[k].weight=r.weight;rarityInfo[k].name=r.name;rarityInfo[k].stars=r.stars}});
// migración: solo photocards reales (1 por integrante y álbum físico activo); lo demás se archiva, no se borra
if((data.catV||'')!==CATALOG.version){const keep=new Set(),byKey={};data.cards.forEach(c=>{if(!c.ext&&!c.kind)byKey[catNorm(c.album)+'|'+c.member+(c.v==='b'?'|b':'')]=c});
 const cards=[];VIS.forEach(a=>catPhotocards(a.id).forEach(p=>{const isG=!!p.group,isB=p.variant==='b',m=isG?'TWICE':CAT_IDX.member[p.member].name,old=byKey[catNorm(a.title)+'|'+m+(isB?'|b':'')],
   no=String(CATALOG.members.findIndex(x=>x.id===p.member)+1).padStart(2,'0'),
   c=old||{id:isG?slug(a.title)+'-group':slug(a.title)+'-'+slug(m)+'-'+no+(isB?'-b':''),album:a.title,member:m};
  Object.assign(c,{album:a.title,year:a.release.v.slice(0,4),name:isG?`${a.title} — Grupal`:`${a.title} — ${m}${isB?' (B)':''}`,rarity:p.rarity,cat:p.id,era:p.era});delete c.kind;delete c.v;if(isG)c.kind='group';if(isB)c.v='b';cards.push(c);keep.add(c.id)}));
 data.cards.filter(c=>c.ext).forEach(c=>{cards.push(c);keep.add(c.id)});
 data.archived=data.archived||{};Object.keys(data.owned).forEach(id=>{if(!keep.has(id)&&data.owned[id]){data.archived[id]=data.owned[id];delete data.owned[id]}});
 data.cards=cards;data.catV=CATALOG.version;if(data.selectedAlbum!=='RANDOM'&&!albumMap[data.selectedAlbum])data.selectedAlbum='RANDOM';save()}
data.cards=data.cards.filter(c=>!c.ext||c.game);delete data.catV_x;
const albOf=c=>catAlbumByTitle(c.album);

// ---------- 2. IMÁGENES: solo de su era (o marcadas como aproximadas) ----------
const _pfOld=photoFor;
window.photoFor=photoFor=function(card){if(card.ext)return _pfOld(card);const f=typeof fandomFor==='function'?fandomFor(card.album,card.member):[];
 if(f.length)return{url:f[hash(card.id)%f.length],conf:'era',source:'Galería de la era (Fandom)',d:0};
 if(data.showApprox){const p=_pfOld(card);return p?{...p,conf:'approx'}:null}return null};
// GIF/clips: solo si el archivo es de ese álbum
if(typeof clipCands==='function'){const _cc=clipCands;clipCands=function(card){return _cc(card).filter(v=>catNorm(v.source||v.src).includes(catNorm(card.album)))}}

// ---------- 3. CACHÉ DE IMÁGENES (IndexedDB compartida con el gacha) ----------
const IC=(()=>{let db;const open=()=>db||(db=new Promise(r=>{const q=indexedDB.open('twiceCap',1);q.onupgradeneeded=()=>q.result.createObjectStore('kv');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}));
 const get=async k=>{const d=await open();if(!d)return null;return new Promise(r=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})};
 const put=async(k,v)=>{const d=await open();if(d)d.transaction('kv','readwrite').objectStore('kv').put(v,k)};
 const mem=new Map(),bad=new Set();let busy=0;const q=[];const slot=()=>new Promise(r=>busy<6?(busy++,r()):q.push(r)),free=()=>{const n=q.shift();n?n():busy--};
 const load=u=>{if(!u||u.startsWith('data:')||u.startsWith('blob:'))return Promise.resolve(u);if(bad.has(u))return Promise.resolve(null);if(mem.has(u))return mem.get(u);
  const p=(async()=>{let b=await get('img:'+u);if(!b){await slot();try{const r=await fetch(u,{mode:'cors',referrerPolicy:'no-referrer'});if(r.ok){b=await r.blob();if(/^image\//.test(b.type)&&b.size<3e6)put('img:'+u,b);else b=null}}catch(e){}finally{free()}}
   if(!b&&/^https?:/.test(u)&&!u.includes('wsrv.nl')){await slot();try{const r=await fetch('https://wsrv.nl/?url='+encodeURIComponent(u)+'&w=900&we',{mode:'cors'});if(r.ok){b=await r.blob();if(/^image\//.test(b.type)&&b.size<3e6)put('img:'+u,b);else b=null}}catch(e){}finally{free()}}
   if(b)return URL.createObjectURL(b);// sin CORS: el navegador la cachea igualmente vía <img>
   return await new Promise(r=>{const i=new Image();i.referrerPolicy='no-referrer';i.onload=()=>r(u);i.onerror=()=>{bad.add(u);r(null)};i.src=u})})();mem.set(u,p);return p};
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);hydrate(e.target)}}),{rootMargin:'300px'});
 const hydrate=el=>{const u=el.dataset.src;if(!u)return;load(u).then(s=>{if(!s){el.classList.add('img-fail');el.removeAttribute('data-src');return}if(el.tagName==='IMG'){el.onload=()=>el.classList.add('img-in');el.src=s}else{el.style.backgroundImage=`url('${s}')`;el.classList.add('img-in')}el.removeAttribute('data-src')})};
 const scan=root=>root.querySelectorAll&&root.querySelectorAll('[data-src]').forEach(el=>io.observe(el));
 new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&(n.dataset&&n.dataset.src?io.observe(n):scan(n))))).observe(document.body,{childList:true,subtree:true});
 const idle=f=>(window.requestIdleCallback||setTimeout)(f,{timeout:2000});
 return{put:(k,v)=>put(k,v),load,scan,preload:list=>{let i=0;const step=()=>{const u=list[i++];if(!u)return;load(u).finally(()=>idle(step))};for(let k=0;k<3;k++)idle(step)},invalidate:async u=>{mem.delete(u);bad.delete(u);await put('img:'+u,undefined)},
  clear:async()=>{mem.clear();bad.clear();const d=await open();if(d)d.transaction('kv','readwrite').objectStore('kv').clear()}}})();
window.IC=IC;
// las cartas usan data-src → carga perezosa + caché
const _face19=faceHTML;window.faceHTML=faceHTML=function(card,small,live){let h=_face19(card,small,live);const p=photoFor(card);
 if(small)h=h.replace(/<img([^>]*?) src="([^"]+)"/,'<img$1 data-src="$2"');if(p&&p.conf&&p.conf!=='era')h=h.replace('<div class="tag">','<div class="apx" title="Foto de otra época">≈</div><div class="tag">');
 if(!p)h=h.replace(/<div class="ph"[^>]*>/,`<div class="ph ph19" style="--mc:${(TY[card.member]||[,'#ff5fa2'])[1]}"><b>${esc(card.member.slice(0,2).toUpperCase())}</b><small>${esc(card.album)}</small><em>sin foto de este álbum todavía</em>`);return h};
// precarga: imágenes del próximo sobre y portadas
const _preImg=typeof preImg==='function'?preImg:null;if(_preImg)window.preImg=preImg=function(u){return IC.load(u).then(s=>s?_preImg(s):null)};
setTimeout(()=>IC.preload(VIS.map(a=>covers[a.title]&&covS(covers[a.title],300)).filter(Boolean)),2500);
// el centrado automático por detección de caras (heredado) carga 1,6 MB y no es necesario: las imágenes se encuadran por CSS
if(typeof queueImg==='function'){queueImg=function(){};}if(typeof focusPass==='function'){focusPass=function(){};}
})();
;
/* ================= core.js ================= */
// =====================================================================================
//  NÚCLEO DEL JUEGO (v20): economía · tiradas persistentes · wishlist/intercambio · misiones · logros · rachas · eventos · nivel
//  Regla: cada botón cambia estado real; cada número sale de datos reales.
// =====================================================================================
(function(){
// ---------- ECONOMÍA: cada recurso tiene UNA función ----------
const CUR={coins:{n:'Monedas',i:'🪙',use:'Comprar sobres, comida y regalos'},tickets:{n:'Tickets',i:'🎫',use:'Abrir sobres especiales de evento'},
 dust:{n:'Polvo estelar',i:'✨',use:'Sale de duplicados · crea una photocard concreta que te falte'},cp:{n:'Puntos de colección',i:'🏅',use:'Suben tu nivel de coleccionista'},
 gems:{n:'Gemas',i:'💎',use:'Solo por logros: outfits y habitaciones para Mi Idol'}};
const E=()=>{data.eco=data.eco||{dust:0,cp:0,gems:0};data.ledger=data.ledger||[];data.col=data.col||{wish:{},trade:{},seen:{}};data.pulls=data.pulls||{n:0,byR:{},best:null,hist:[]};return data.eco};
const st=()=>stLoad();
function bal(c){E();if(c==='coins')return data.coins||0;if(c==='tickets')return st().tickets||0;return data.eco[c]||0}
function add(c,n,why){E();if(!n)return;if(c==='coins')data.coins=Math.max(0,(data.coins||0)+n);else if(c==='tickets'){const s=st();s.tickets=Math.max(0,(s.tickets||0)+n);stSave(s)}else data.eco[c]=Math.max(0,(data.eco[c]||0)+n);
 data.ledger.unshift({t:Date.now(),c,n,why});data.ledger.length=Math.min(data.ledger.length,60);save();hud()}
function pay(c,n,why){if(bal(c)<n){toast(`Te faltan ${n-bal(c)} ${CUR[c].n.toLowerCase()}`);return false}add(c,-n,why);return true}
function reward(r,why){Object.entries(r||{}).forEach(([c,n])=>add(c,n,why));const txt=Object.entries(r||{}).map(([c,n])=>`${CUR[c]?CUR[c].i:''}${n}`).join(' ');if(txt)toast(`${why} · ${txt}`)}
// nivel de coleccionista (sale de los puntos de colección)
const lvlNeed=l=>100+l*60;function colLevel(){let cp=bal('cp'),l=1;while(cp>=lvlNeed(l)){cp-=lvlNeed(l);l++}return{l,cur:cp,need:lvlNeed(l)}}
window.ECO={CUR,bal,add,pay,reward,colLevel};
// ---------- HUD de recursos (barra superior / perfil) ----------
function hud(){const f=window.ecoHud;if(f&&f!==hud)f()}
window.ecoHud=hud;
const RK=Object.keys(CATALOG.rarities),CP_NEW={N:4,R:6,SR:10,SSR:18,UR:30};
function addCP(n){E();data.eco.cp+=n;}window.addCP=addCP;window.CP_NEW=CP_NEW;
// ---------- WISHLIST · INTERCAMBIO · CREAR CON POLVO ----------
const DUST_OF={N:2,R:5,SR:12,SSR:30,UR:80},CRAFT={N:20,R:45,SR:110,SSR:260,UR:650};
window.COL={wish:id=>{E();data.col.wish[id]=!data.col.wish[id];if(!data.col.wish[id])delete data.col.wish[id];save()},trade:id=>{E();data.col.trade[id]=!data.col.trade[id];if(!data.col.trade[id])delete data.col.trade[id];save()},
 state:id=>{E();const o=!!data.owned[id],d=(data.duplicates[id]||1)-1;return{owned:o,dupes:o?Math.max(0,d):0,wish:!!data.col.wish[id],trade:!!data.col.trade[id]}},
 dustAll:()=>{E();let n=0,k=0;data.cards.forEach(c=>{const d=(data.duplicates[c.id]||1)-1;if(data.owned[c.id]&&d>0&&!data.col.trade[c.id]){n+=d*DUST_OF[c.rarity];k+=d;data.duplicates[c.id]=1}});if(k){add('dust',n,`${k} duplicados convertidos`);stat('dusted',k);toast(`${k} duplicados → ✨${n}`)}else toast('No hay duplicados para convertir (los marcados para intercambio se guardan)');return n},
 // ---- fusión: FUSE[r] duplicados de rareza r -> 1 carta de la rareza siguiente (prefiere una que aún no tienes). El resultado se guarda al instante: no se puede repetir la tirada.
 FUSE:{N:5,R:5,SR:5,SSR:6},NEXT:{N:'R',R:'SR',SR:'SSR',SSR:'UR'},
 fuseList:r=>{E();return data.cards.filter(c=>!c.game&&!c.ext&&c.rarity===r&&data.owned[c.id]&&!data.col.trade[c.id]&&(data.duplicates[c.id]||1)>1).sort((a,b)=>data.duplicates[b.id]-data.duplicates[a.id])},
 fuseHave:r=>COL.fuseList(r).reduce((n,c)=>n+data.duplicates[c.id]-1,0),
 fuse:r=>{E();const need=COL.FUSE[r],nx=COL.NEXT[r];if(!need||!nx||COL.fuseHave(r)<need)return null;
  const pl=data.cards.filter(c=>!c.game&&!c.ext&&c.rarity===nx&&(!window.PH||!PH.ready||PH.ready(c)));if(!pl.length){toast('No hay cartas de rareza '+nx+' con foto lista');return null}
  const fresh=pl.filter(c=>!data.owned[c.id]),src=fresh.length?fresh:pl,card=src[Math.floor(Math.random()*src.length)],isNew=!data.owned[card.id];
  let left=need;COL.fuseList(r).forEach(c=>{const t=Math.min(left,data.duplicates[c.id]-1);if(t>0){data.duplicates[c.id]-=t;left-=t}});
  if(isNew){data.owned[card.id]=true;data.duplicates[card.id]=1;addCP(CP_NEW[nx]);stat('newcards',1);if(window.BINDER&&!card.game)BINDER.onNew([card.id])}else{data.duplicates[card.id]=(data.duplicates[card.id]||1)+1;addCP(1)}
  stat('fused',1);save();if(window.checkAch)checkAch();return{card,isNew,used:need}},
 craft:id=>{const c=data.cards.find(x=>x.id===id);if(!c||data.owned[id])return;if(!pay('dust',CRAFT[c.rarity],'Crear photocard'))return;data.owned[id]=true;data.duplicates[id]=1;addCP(CP_NEW[c.rarity]);stat('newcards',1);save();if(window.BINDER)BINDER.onNew([id]);toast(`Creada: ${c.member} · ${c.album}`);checkAch()},DUST_OF,CRAFT};
// ficha de carta: estado + acciones reales
const _sd=showDetail;window.showDetail=showDetail=function(id){_sd(id);const s=COL.state(id),c=data.cards.find(x=>x.id===id),sh=[...document.querySelectorAll('.sheet')].pop();if(!sh||!c)return;
 const box=document.createElement('div');box.className='cstate';box.onclick=e=>e.stopPropagation();
 const draw=()=>{const s=COL.state(id);box.innerHTML=`<span class="tagc ${s.owned?'own':'miss'}">${s.owned?'TENGO':'ME FALTA'}</span>${s.dupes?`<span class="tagc dup">DUPLICADA ×${s.dupes}</span>`:''}
  <button class="secondary" data-a="wish">${s.wish?'♥ En wishlist':'♡ Wishlist'}</button>${s.owned?`<button class="secondary" data-a="trade">${s.trade?'⇄ Para intercambio':'⇄ Marcar para intercambio'}</button>`:`<button class="secondary" data-a="craft">✨ Crear (${CRAFT[c.rarity]})</button>`}`;
  box.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='craft')COL.craft(id);else COL[a](id);draw()})};draw();(sh.querySelector('.dwrap')||sh).appendChild(box)};
// ---------- MISIONES DIARIAS Y SEMANALES · LOGROS · RACHA ----------
const DAILY=[['pet_feed',1,'Alimenta a tu idol',{coins:80}],['pet_play',1,'Juega con tu idol',{coins:80}],['packs',1,'Abre un sobre',{coins:60}],['newcards',1,'Consigue una photocard nueva',{coins:100,cp:10}],
 ['placed',1,'Coloca una photocard en el álbum',{coins:60,cp:5}],['page',1,'Completa una página del álbum',{tickets:1}],['spins',1,'Gira el gacha',{coins:120}],['puzzles',1,'Gana un minijuego',{coins:100}],['pet_clean',1,'Limpia a tu idol',{coins:60}]];
const WEEKLY=[['careDays',7,'Cuida a tu idol 7 días',{tickets:2,gems:5}],['newcards',10,'Consigue 10 photocards nuevas',{coins:600,cp:40}],['page',1,'Completa una página',{coins:300}],['packs',10,'Abre 10 sobres',{tickets:1,coins:300}]];
const ACH=[['packs',1,'Primera tirada',{coins:100}],['dupes',1,'Primera duplicada',{dust:20}],['owned',100,'100 photocards',{gems:5}],['owned',300,'300 photocards',{gems:15}],['albums',1,'Álbum completo',{gems:5,tickets:1}],['albums',10,'10 álbumes completos',{gems:20}],
 ['idolset',1,'Colección completa de una idol',{gems:10}],['rareSSR',1,'Tirada rara (SSR)',{dust:50}],['rareUR',1,'Tirada legendaria (UR)',{gems:5}],['streak',7,'Racha de 7 días',{gems:5}],['streak',30,'Racha de 30 días',{gems:20}],
 ['evolve',1,'Primera evolución',{gems:3}],['bond',100,'Vínculo máximo',{gems:15}],['pages',10,'10 páginas completas',{gems:8}]];
const wk=()=>{const d=new Date(),j=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-W'+Math.ceil(((d-j)/864e5+j.getDay()+1)/7)};
function weekState(){const s=st();if(s.week!==wk()){s.week=wk();s.w={};s.wc={};stSave(s)}return s}
const _stat=stat;window.stat=stat=function(k,n=1){const s=_stat(k,n);const w=weekState();w.w[k]=(w.w[k]||0)+n;stSave(w);setTimeout(checkAch,0);return s};
function ownedCount(){return data.cards.filter(c=>!c.ext&&data.owned[c.id]).length}
function achVal(k){const s=st();if(k==='owned')return ownedCount();if(k==='albums')return VIS_ALB().filter(a=>albumDone(a.title)).length;if(k==='idolset')return CATALOG.members.some(m=>{const cs=data.cards.filter(c=>c.member===m.name&&!c.ext);return cs.length&&cs.every(c=>data.owned[c.id])})?1:0;
 if(k==='streak')return Math.max(s.streak||0,s.careStreak||0);if(k==='bond'){const p=window.PET&&PET.get();return p?Math.round(p.bond):0}if(k==='evolve')return(s.total.evolve||0);if(k==='packs')return data.pulls?data.pulls.n:0;return s.total[k]||0}
const VIS_ALB=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const albumDone=t=>{const cs=data.cards.filter(c=>c.album===t&&!c.ext);return cs.length&&cs.every(c=>data.owned[c.id])};
function checkAch(){const s=st();s.ach2=s.ach2||{};let ch=false;ACH.forEach((A,j)=>{if(!s.ach2[j]&&achVal(A[0])>=A[1]){s.ach2[j]='ready';ch=true;toast('🏆 Logro desbloqueado: '+A[2])}});if(ch)stSave(s)}
window.claimAch2=j=>{const s=st();if(s.ach2&&s.ach2[j]==='ready'){s.ach2[j]='done';stSave(s);reward(ACH[j][3],'Logro: '+ACH[j][2]);render('retos')}};
function dailyPick(){const s=st();if(!s.mis2||s.mis2.day!==s.day){let h=0;for(const c of s.day)h=(h*31+c.charCodeAt(0))>>>0;const pool=[...DAILY.keys()],pick=[];while(pick.length<4){pick.push(pool.splice(h%pool.length,1)[0]);h=(h*1103515245+12345)>>>0}s.mis2={day:s.day,list:pick.map(k=>({k,c:false}))};stSave(s)}return s.mis2.list}
window.claimDaily2=j=>{const s=st(),m=dailyPick()[j],M=DAILY[m.k];if(m.c||(s.d[M[0]]||0)<M[1])return;m.c=true;s.mis2.list[j]=m;stSave(s);reward(M[3],'Misión: '+M[2]);render('retos')};
window.claimWeekly=j=>{const s=weekState(),M=WEEKLY[j];if(s.wc[j]||(s.w[M[0]]||0)<M[1])return;s.wc[j]=1;stSave(s);reward(M[3],'Semanal: '+M[2]);render('retos')};
// racha de cuidados: no destruye el progreso (1 protección por semana; si se rompe, conservas tu récord y la recompensa baja solo un escalón)
window.careTick=function(){const s=st(),y=new Date(Date.now()-864e5),yd=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');if(s.careDay===s.day)return;
 if(s.careDay===yd)s.careStreak=(s.careStreak||0)+1;else if(s.careDay&&(s.freezeWeek!==wk())){s.freezeWeek=wk();s.careStreak=(s.careStreak||0)+1;toast('🧊 Protección de racha usada')}else{s.careBest=Math.max(s.careBest||0,s.careStreak||0);s.careStreak=1}
 s.careDay=s.day;s.careBest=Math.max(s.careBest||0,s.careStreak);stSave(s);const w=weekState();w.w.careDays=(w.w.careDays||0)+1;stSave(w);const bonus=Math.min(7,s.careStreak)*20;add('coins',bonus,'Racha de cuidados día '+s.careStreak)};
// ---------- EVENTOS (datos; fechas por año) ----------
const EVENTS=[{id:'anniv',name:'Aniversario de TWICE',from:[10,17],to:[10,27],pack:'anniv',pet:'Decoración: globos de aniversario'},{id:'halloween',name:'Halloween',from:[10,25],to:[11,1],pet:'Outfit: bruja'},
 {id:'xmas',name:'Navidad',from:[12,18],to:[12,26],pet:'Habitación: árbol de Navidad'},...BDAY.map(([m,d],i)=>({id:'bday-'+i,name:'Cumpleaños de '+MEM[i].n,from:[m,d],to:[m,d],member:i,pet:'Tarta de cumpleaños'}))];
window.activeEvents=function(now=new Date()){const md=(now.getMonth()+1)*100+now.getDate();return EVENTS.filter(e=>{const a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];return a<=b?md>=a&&md<=b:(md>=a||md<=b)})};
window.REWARD_FMT=r=>Object.entries(r).map(([k,n])=>`${CUR[k].i}${n}`).join(' ');window.DAILY=DAILY;window.WEEKLY=WEEKLY;window.ACH=ACH;window.dailyPick=dailyPick;window.weekState=weekState;window.achVal=achVal;window.checkAch=checkAch;window.EVENTS=EVENTS;
setInterval(checkAch,30000);setTimeout(()=>{hud();checkAch()},300);
})();
;
