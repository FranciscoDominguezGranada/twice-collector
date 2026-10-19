/* ================= packs.js ================= */
// =====================================================================================
//  SOBRES · catálogo de sobres DEL JUEGO · probabilidades · transacción atómica · Envelope3D · escena de apertura continua · hub
//  Todo el contenido sale del catálogo de TWICE. Los sobres son mecánica del juego (no merchandising oficial).
// =====================================================================================
(function(){
const esc=DS.esc,RK=Object.keys(CATALOG.rarities),R=CATALOG.rarities,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const FREE_H=8,START_COINS=600;
const KINDS={free:'Gratis',normal:'Estándar',premium:'Premium',album:'Álbum',era:'Era',member:'Integrante',event:'Evento'};
// ---------------- catálogo de sobres ----------------
const VIS=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const gameFor=e=>e.id==='anniv'?'game-anniv':e.id==='halloween'?'game-halloween':e.id==='xmas'?'game-xmas':e.member!=null?'game-bday-'+CATALOG.members[e.member].id:null;
function list(){const L=[];
 L.push({id:'free',kind:'free',name:'Sobre diario',sub:`Gratis cada ${FREE_H} h`,cost:{},cards:3,pool:{all:1},min:'N',theme:['#6fe3c6','#1f8f73']});
 L.push({id:'normal',kind:'normal',name:'Sobre TWICE',sub:'Todas las eras',cost:{coins:100},cards:5,pool:{all:1},min:'R',theme:['#ff8cc0','#d93a86']});
 L.push({id:'premium',kind:'premium',name:'Sobre Premium',sub:'SR o mejor garantizada',cost:{coins:300},cards:5,pool:{all:1},mult:{N:.4,R:1,SR:2.2,SSR:3.2,UR:4},min:'SR',theme:['#ffe08a','#9b6b00']});
 activeEvents().forEach(e=>{const g=gameFor(e);L.push({id:'event:'+e.id,kind:'event',name:e.name,sub:'Evento temporal',cost:{tickets:1},cards:5,pool:e.member!=null?{member:CATALOG.members[e.member].id}:{all:1},min:'SR',extra:g,event:e,theme:['#ffb36b','#7a1f9b']})});
 VIS().forEach(a=>L.push({id:'album:'+a.id,kind:'album',name:a.title,sub:`${(a.release.v||'').slice(0,4)} · ${a.type}`,cost:{coins:150},cards:5,pool:{album:a.id},min:'R',theme:['#9b7bff','#3b1d6b'],album:a.id}));
 [...new Set(VIS().map(a=>a.release.v.slice(0,4)))].forEach(y=>{const as=VIS().filter(a=>a.release.v.startsWith(y));L.push({id:'era:'+y,kind:'era',name:'Era '+y,sub:as.map(a=>a.title).join(' · '),cost:{coins:150},cards:5,pool:{year:y},min:'R',theme:[`hsl(${(+y*37)%360} 80% 65%)`,`hsl(${(+y*37+40)%360} 60% 30%)`],year:y})});
 CATALOG.members.forEach(m=>L.push({id:'member:'+m.id,kind:'member',name:m.name,sub:'Todas sus photocards',cost:{coins:200},cards:5,pool:{member:m.id},min:'R',theme:[(TY[m.name]||[,'#ff5fa2'])[1],'#2a1040'],member:m.id}));
 return L}
const get=id=>list().find(p=>p.id===id);
// ---------------- cartas posibles y probabilidades ----------------
function pool(p){let cs=data.cards.filter(c=>!c.ext),q=p.pool||{};if(q.album)cs=cs.filter(c=>c.album===CAT_IDX.album[q.album].title);else if(q.member)cs=cs.filter(c=>c.member===CAT_IDX.member[q.member].name);else if(q.year)cs=cs.filter(c=>c.year===q.year);return cs}
function weights(p,cs,floor){const has={},w={};cs.forEach(c=>has[c.rarity]=(has[c.rarity]||0)+1);RK.forEach((r,i)=>{w[r]=has[r]&&i>=RK.indexOf(floor||'N')?R[r].weight*((p.mult||{})[r]??1):0});return{w,has}}
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
function odds(p){const cs=pool(p),a=weights(p,cs,'N'),b=weights(p,cs,p.min),ta=sum(a.w)||1,tb=sum(b.w)||1;return{rows:RK.map(r=>({r,count:a.has[r]||0,pct:a.w[r]/ta*100,last:b.w[r]/tb*100})),total:cs.length,pool:cs}}
function pick(w){let t=sum(w),x=Math.random()*t;for(const r of RK){x-=w[r];if(x<=0&&w[r]>0)return r}return RK.find(r=>w[r]>0)}
const rdy=c=>!window.PH||!PH.ready||PH.ready(c);
// Un sobre NUNCA trae dos veces la misma carta: se sortea sin reemplazo. Si quedan menos cartas con foto que huecos, el sobre trae las que hay.
// ---------------- garantía (pity): SR o mejor como máximo cada 10 sobres, SSR o mejor cada 30 (sobres que no son el diario gratis) ----------------
const PITY={SR:10,SSR:30};
const pity=()=>{data.pity=data.pity||{sr:0,ssr:0};return data.pity};
const pityFloor=p=>{if(!p||p.kind==='free')return null;const y=pity();return y.ssr>=PITY.SSR-1?'SSR':y.sr>=PITY.SR-1?'SR':null};
const pityStep=(p,best)=>{if(!p||p.kind==='free')return;const y=pity(),i=RK.indexOf(best);y.sr=i>=RK.indexOf('SR')?0:y.sr+1;y.ssr=i>=RK.indexOf('SSR')?0:y.ssr+1};
const pityHTML=()=>{const y=pity(),l1=PITY.SR-y.sr,l2=PITY.SSR-y.ssr;return`<div class="pity"><div class="pity-r"><b>SR o mejor</b><div class="pity-b"><i style="width:${Math.min(100,y.sr/PITY.SR*100)}%"></i></div><span>${l1<=1?'¡El próximo sobre!':'en '+l1+' sobres'}</span></div><div class="pity-r gold"><b>SSR o mejor</b><div class="pity-b"><i style="width:${Math.min(100,y.ssr/PITY.SSR*100)}%"></i></div><span>${l2<=1?'¡El próximo sobre!':'en '+l2+' sobres'}</span></div><small>Garantía: se cuenta en los sobres de pago y de evento (no en el diario) y se reinicia al salir una carta de esa rareza.</small></div>`};
function roll(p,gf){let cs=pool(p).filter(rdy);const out=[];for(let i=0;i<p.cards&&cs.length;i++){const floor=i===p.cards-1?(gf&&RK.indexOf(gf)>RK.indexOf(p.min)?gf:p.min):'N',{w}=weights(p,cs,floor),r=pick(w)||pick(weights(p,cs,'N').w);let opts=cs.filter(c=>c.rarity===r);if(!opts.length)opts=cs;const c=opts[Math.floor(Math.random()*opts.length)];out.push(c);cs=cs.filter(x=>x!==c)}
 if(p.extra){const g=data.cards.find(c=>c.id===p.extra);if(g)out.push(g)}return out}
// ---------------- estado ----------------
const E=()=>{data.free=data.free||{last:0};data.pulls=data.pulls||{n:0,byR:{},best:null,hist:[]};data.eco=data.eco||{dust:0,cp:0,gems:0};if(!data.eco.start){data.eco.start=1;ECO.add('coins',START_COINS,'Regalo de bienvenida')}};
const freeLeft=()=>{E();return Math.max(0,data.free.last+FREE_H*36e5-Date.now())};
const freeReady=()=>freeLeft()===0;
const fmtT=ms=>{const m=Math.ceil(ms/6e4),h=Math.floor(m/60);return h?`${h} h ${m%60} min`:`${m} min`};
function available(p){if(p.kind==='free')return freeReady()?{ok:true}:{ok:false,why:`Disponible en ${fmtT(freeLeft())}`};
 for(const [c,n] of Object.entries(p.cost))if(ECO.bal(c)<n)return{ok:false,why:`Te faltan ${n-ECO.bal(c)} ${ECO.CUR[c].n.toLowerCase()}`};return{ok:true}}
const costTxt=p=>Object.keys(p.cost).length?Object.entries(p.cost).map(([c,n])=>`${ECO.CUR[c].i} ${n}`).join(' + '):'GRATIS';
// ---------------- transacción atómica: cobrar → generar → guardar. Una apertura = una ejecución ----------------
let busy=false;
function commit(p){E();if(busy||(data.pending&&!data.pending.done))return null;const av=available(p);if(!av.ok){DS.toast(av.why,'⚠️');SND.sfx('bad');return null}
 busy=true;try{if(p.kind==='free')data.free.last=Date.now();else Object.entries(p.cost).forEach(([c,n])=>ECO.add(c,-n,'Sobre: '+p.name));
  const gf=pityFloor(p),cs=roll(p,gf),seen={},isNew=cs.map(c=>{const n=!data.owned[c.id]&&!seen[c.id];seen[c.id]=1;return n}),best=cs.reduce((a,c)=>RK.indexOf(c.rarity)>RK.indexOf(a)?c.rarity:a,'N');
  cs.forEach((c,i)=>{if(isNew[i]){data.owned[c.id]=true;data.duplicates[c.id]=1;addCP(CP_NEW[c.rarity]);if(!c.game)BINDER.onNew([c.id])}else{data.duplicates[c.id]=(data.duplicates[c.id]||1)+1;addCP(1)}});
  pityStep(p,best);data.pulls.n++;cs.forEach(c=>data.pulls.byR[c.rarity]=(data.pulls.byR[c.rarity]||0)+1);if(!data.pulls.best||RK.indexOf(best)>RK.indexOf(data.pulls.best))data.pulls.best=best;
  stat('packs');if(p.kind==='event'&&p.event){data.evprog=data.evprog||{};const ek=p.event.id+'-'+new Date().getFullYear();data.evprog[ek]=(data.evprog[ek]||0)+1}const nn=isNew.filter(Boolean).length;if(nn)stat('newcards',nn);if(isNew.some(x=>!x))stat('dupes',isNew.filter(x=>!x).length);if(best==='SSR'||best==='UR')stat('rare'+best);if(cs.some(c=>c.game))stat('special');
  // consuelo: si un sobre de pago trae 3 o más duplicadas, se devuelve el 20 % de su coste en monedas (una sola vez, al decidirse el resultado)
  const nd=isNew.filter(x=>!x).length,refund=p.cost&&p.cost.coins&&nd>=3?Math.round(p.cost.coins*.2):0; // se entrega al terminar (finish), no antes: así no destripa el resultado
  data.pending={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),pack:{id:p.id,name:p.name,kind:p.kind},ids:cs.map(c=>c.id),isNew,best,refund,pity:gf||null,t:Date.now(),done:false};
  save();return data.pending}finally{busy=false}}
function finish(){const p=data.pending;if(!p||p.done)return;p.done=true;if(p.refund)ECO.add('coins',p.refund,'Consuelo por duplicadas');data.pulls.hist.unshift({id:p.id,t:p.t,pack:p.pack,ids:p.ids,isNew:p.isNew,best:p.best});data.pulls.hist.length=Math.min(data.pulls.hist.length,30);data.pending=null;save();checkAch();ecoHud();UI.badges()}
// ---------------- precarga: ninguna carta espera a su imagen durante la animación ----------------
const resolved=new Map();
async function preload(cards,timeout=6000){const jobs=cards.map(async c=>{const p=photoFor(c);if(!p||!p.url){return}const s=await IC.load(p.url);resolved.set(c.id,s);if(s){try{const im=new Image();im.src=s;await im.decode()}catch(e){}}});
 await Promise.race([Promise.all(jobs),sleep(timeout)])}
function cardFront(c){let h=faceHTML(c,false,true);const p=photoFor(c),s=resolved.get(c.id);if(p&&p.url&&s&&s!==p.url)h=h.split(p.url).join(s);return h}
// ---------------- Envelope3D: objeto físico (frente, reverso interior, canto, solapa de rasgado, sombras, brillo) ----------------
const LOGO='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Logo_of_TWICE.svg/330px-Logo_of_TWICE.svg.png';
const Envelope3D={html(p,o={}){const sz=o.size||'sm',n=o.cards||0,a=p.album?CAT_IDX.album[p.album]:null,cov=a&&covers[a.title]?covS(covers[a.title],400):'',t=p.theme||['#ff8cc0','#d93a86'];
  const emb=p.kind==='album'?`<div class="e-cover" ${cov?`data-src="${cov}"`:''}>${cov?'':`<span>${esc(a.title)}</span>`}</div>`:p.kind==='era'?`<div class="e-big">${p.year}</div>`:p.kind==='member'?`<div class="e-big">${esc(CAT_IDX.member[p.member].name[0])}</div>`:p.kind==='event'?'<div class="e-big">🎉</div>':p.kind==='premium'?'<div class="e-big">★</div>':p.kind==='free'?'<div class="e-big">🎁</div>':'<div class="e-big">♪</div>';
  const cards=Array.from({length:n},(_,i)=>`<div class="pcard" data-i="${i}" style="--z:${n-i}"><div class="pc-back"><img src="${LOGO}" alt="" referrerpolicy="no-referrer" onerror="this.remove()"><i></i></div></div>`).join('');
  return`<div class="env ${sz}" ${o.id?`id="${o.id}"`:''} style="--c1:${t[0]};--c2:${t[1]}"><div class="env-body">
   <div class="env-face back"><i class="inner"></i></div>
   ${n?`<div class="env-cards">${cards}</div>`:''}
   <div class="env-face front"><div class="art">${emb}<img class="e-logo" src="${LOGO}" alt="TWICE" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('b'),{className:'e-logo',textContent:'TWICE'}))"><div class="e-name">${esc(p.name)}</div><div class="e-sub">${esc(p.sub||'')}</div></div>
    <i class="crimp b"></i><i class="gbadge-e">CONTENIDO DEL JUEGO</i><i class="sheen"></i><i class="gloss"></i></div>
   <div class="env-strip"><i class="crimp t"></i><i class="perf"></i><span>RASGAR</span><i class="tearline"></i></div>
   <i class="env-side l"></i><i class="env-side r"></i></div><i class="env-shadow"></i></div>`}};
window.Envelope3D=Envelope3D;
// ---------------- escena de apertura: UN solo objeto, de cerrado a vacío, sin cambiar de componente ----------------
const FX={N:{hold:350,shake:0,burst:0},R:{hold:560,shake:0,burst:6,e:'✨'},SR:{hold:900,shake:0,burst:12,e:'💜'},SSR:{hold:1400,shake:1,burst:20,e:'⭐'},UR:{hold:2200,shake:2,burst:34,e:'🌈'}};
function zig(){const pts=['0% 14%'];const n=18;for(let i=1;i<n;i++)pts.push(`${(i/n*100).toFixed(1)}% ${(11+Math.random()*5).toFixed(1)}%`);pts.push('100% 14%','100% 100%','0% 100%');return`polygon(${pts.join(',')})`}
async function play(pend,o={}){if(document.querySelector('.packscene'))return;
 const p=get(pend.pack.id)||{id:pend.pack.id,name:pend.pack.name,kind:pend.pack.kind,cost:{},cards:pend.ids.length,pool:{all:1},theme:['#ff8cc0','#d93a86'],sub:''},cards=pend.ids.map(id=>data.cards.find(c=>c.id===id)).filter(Boolean);
 const S={skip:false,fast:false,anims:new Set(),tapRes:null,done:false};
 const sc=document.createElement('div');sc.className='packscene';sc.dataset.r=pend.best;
 sc.innerHTML=`<div class="ps-bg"></div><div class="ps-top"><span class="chip game">${esc(p.name)} · sobre del juego</span><button class="btn ghost sm" id="psSkip" data-tip="Termina la presentación. El resultado no cambia">Omitir animación ⏭</button></div>
  <div class="ps-stage" id="psStage">${Envelope3D.html(p,{size:'stage',cards:cards.length,id:'psEnv'})}<div class="ps-rev" id="psRev"></div></div>
  <div class="ps-cap" id="psCap"></div><div class="ps-act" id="psAct"><button class="btn pri lg" id="psOpen">ABRIR SOBRE</button><span class="small" id="psHint">${o.resume?'Recuperamos tu sobre guardado: el resultado es el mismo':'Arrastra el borde superior hacia un lado o pulsa abrir'}</span></div>`;
 document.body.appendChild(sc);document.body.classList.add('noscroll');IC.scan(sc);
 const env=sc.querySelector('#psEnv'),stage=sc.querySelector('#psStage'),rev=sc.querySelector('#psRev'),cap=sc.querySelector('#psCap'),act=sc.querySelector('#psAct');
 const A=(el,kf,ms,opt={})=>{const a=el.animate(kf,Object.assign({duration:ms,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'},opt));a.playbackRate=S.fast?3:1;S.anims.add(a);a.finished.finally(()=>S.anims.delete(a)).catch(()=>{});if(S.skip)a.finish();return a.finished.catch(()=>{})};
 const W=async ms=>{const t0=performance.now();while(performance.now()-t0<ms/(S.fast?3:1)&&!S.skip)await sleep(30)};
 const preP=preload(cards);
 const cleanup=()=>{document.body.classList.remove('noscroll');sc.classList.add('out');setTimeout(()=>sc.remove(),260);document.removeEventListener('keydown',kd)};
 const kd=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(S.tapRes){const r=S.tapRes;S.tapRes=null;r()}else if(!S.started)startOpen()}else if(e.key==='Escape'&&S.done)cleanup()};document.addEventListener('keydown',kd);
 sc.querySelector('#psSkip').onclick=()=>{S.skip=true;S.anims.forEach(a=>{try{a.finish()}catch(e){}});if(S.tapRes){const r=S.tapRes;S.tapRes=null;r()}if(!S.started)startOpen()};
 stage.addEventListener('pointerdown',()=>{if(S.tapRes){const r=S.tapRes;S.tapRes=null;r()}});
 // idle + tilt con el puntero (el objeto responde al usuario)
 const body=env.querySelector('.env-body');stage.addEventListener('pointermove',e=>{if(S.started||S.drag)return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;body.style.setProperty('--ry',(x*26)+'deg');body.style.setProperty('--rx',(-y*18)+'deg')});
 // interacción: arrastrar el borde superior (rasgado)
 const strip=env.querySelector('.env-strip');let tp=0,x0=null;S.drag=false;
 strip.addEventListener('pointerdown',e=>{if(S.started)return;S.drag=true;x0=e.clientX;strip.setPointerCapture(e.pointerId);SND.sfx('slide')});
 strip.addEventListener('pointermove',e=>{if(!S.drag)return;tp=Math.max(0,Math.min(1,Math.abs(e.clientX-x0)/(env.offsetWidth*.7)));env.style.setProperty('--tear',tp);if(Math.random()<.35)SND.sfx('slide');if(tp>=1){S.drag=false;startOpen()}});
 strip.addEventListener('pointerup',()=>{if(S.drag){S.drag=false;if(tp<1){env.style.setProperty('--tear',0);tp=0}}});
 sc.querySelector('#psOpen').onclick=()=>startOpen();
 // pistas de anticipación: el aura del sobre sube según la mejor rareza (sin enseñar cartas)
 const tier=RK.indexOf(pend.best);env.style.setProperty('--hint',R[pend.best].color);env.style.setProperty('--hint-a',[.12,.2,.32,.5,.7][tier]);
 const pres=async()=>{ // ——— secuencia continua ———
  S.started=true;act.classList.add('gone');SND.sfx('charge');
  await A(body,[{translate:'0 0',rotate:'0deg'},{translate:'0 -6px',rotate:'-1.6deg'},{translate:'0 0',rotate:'1.6deg'},{translate:'0 -8px',rotate:'-1.6deg'},{translate:'0 0',rotate:'0deg'}],900+tier*220,{easing:'ease-in-out'});
  await Promise.race([preP,sleep(6000)]);                       // la precarga corre mientras el sobre "carga"; si ya terminó no se espera nada
  env.style.setProperty('--rx','8deg');env.style.setProperty('--ry','0deg');env.classList.add('opening');
  strip.classList.add('tearing');SND.sfx('tear');
  await A(strip.querySelector('.tearline'),[{width:'0%'},{width:'100%'}],260);
  env.querySelector('.env-face.front').style.clipPath=zig();strip.classList.add('gone');
  A(strip,[{transform:'translate3d(0,0,3px) rotate(0)',opacity:1},{transform:'translate3d(70px,-90px,40px) rotate(24deg)',opacity:0}],520);
  await W(380);env.classList.add('torn');SND.sfx('whoosh');
  // las cartas asoman por la abertura (están DENTRO del sobre: detrás de la cara frontal)
  const pc=[...env.querySelectorAll('.pcard')];await Promise.all(pc.map((c,i)=>A(c,[{transform:'translateY(0)'},{transform:`translateY(${-14-(pc.length-i)*1.2}%)`}],420+i*40)));await W(300);
  // ——— cartas una a una ———
  for(let i=0;i<cards.length;i++){if(S.skip)break;await reveal(i)}
  summary()};
 const startOpen=()=>{if(S.started)return;S.started=true;pres().catch(e=>{console.error(e);S.skip=true;summary()})};
 async function reveal(i){const c=cards[i],f=FX[c.rarity],el=env.querySelector(`.pcard[data-i="${i}"]`),isNew=pend.isNew[i],special=c.game;
  cap.innerHTML='';SND.sfx('slide');
  await A(el,[{transform:getComputedStyle(el).transform==='none'?'translateY(0)':getComputedStyle(el).transform},{transform:'translateY(-118%)'}],620);
  if(S.skip)return;
  // traspaso continuo: el MISMO elemento se convierte en la carta de revelación (FLIP: misma posición y tamaño)
  const r1=el.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  const rv=document.createElement('div');rv.className='rvcard';rv.style.cssText=`left:${r1.left-sr.left}px;top:${r1.top-sr.top}px;width:${r1.width}px;height:${r1.height}px`;
  rv.innerHTML=`<div class="rv-in"><div class="rv-back">${window.cardBackHTML?cardBackHTML(c):el.querySelector('.pc-back').innerHTML}</div><div class="rv-front">${cardFront(c)}</div></div><div class="rv-fx"></div>`;
  rev.appendChild(rv);el.style.visibility='hidden';SND.sfx('whoosh');
  const tw=Math.max(150,Math.min(sr.width*.94,460,(sr.height-6)/1.5)),th=tw*1.5,cx=(sr.width-tw)/2,cy=Math.max(6,(sr.height-th)/2);
  rv.style.setProperty('--glow',R[c.rarity].color);
  await A(rv,[{left:rv.style.left,top:rv.style.top,width:r1.width+'px',height:r1.height+'px'},{left:cx+'px',top:cy+'px',width:tw+'px',height:th+'px'}],520);
  if(S.skip)return;
  // anticipación: pausa + el brillo del dorso crece (la intensidad depende de la rareza real; el color solo se revela al girar)
  rv.classList.add('charging');rv.style.setProperty('--gi',[.2,.35,.55,.8,1][RK.indexOf(c.rarity)]);if(c.rarity!=='N')SND.sfx('charge');await W(f.hold);if(S.skip)return;
  SND.sfx('flip');await A(rv.querySelector('.rv-in'),[{transform:'rotateY(0)'},{transform:'rotateY(180deg)'}],520);
  rv.classList.remove('charging');rv.classList.add('shown','fx-'+R[c.rarity].fx);SND.sfx('r_'+c.rarity);if(f.shake)sc.classList.add('shake'+f.shake),setTimeout(()=>sc.classList.remove('shake1','shake2'),700);
  if(f.burst){const b=rv.getBoundingClientRect();DS.burst(b.left+b.width/2,b.top+b.height/2,f.e,f.burst)}try{navigator.vibrate&&navigator.vibrate(f.shake?[40,30,60]:12)}catch(e){}
  const dupDust=window.COL?COL.DUST_OF[c.rarity]:0;
  cap.innerHTML=`<div class="capc"><span class="tag-r ${c.rarity}">${c.rarity}</span> <b>${esc(c.member)}</b> <span class="mute">· ${esc(special?'GAME SPECIAL':c.album)}</span> ${isNew?'<span class="chip off">¡NUEVA!</span>':`<span class="chip dupc">REPETIDA · ✨${dupDust}</span>`}${special?'<span class="chip game">Contenido del juego</span>':''}</div>`;
  const hint=sc.querySelector('#psHint');hint.textContent=i<cards.length-1?'Toca para la siguiente carta':'Toca para ver el resumen';
  act.classList.add('gone');
  await new Promise(res=>{S.tapRes=res;if(S.fast)setTimeout(()=>{if(S.tapRes===res){S.tapRes=null;res()}},500)});
  if(S.skip)return;
  cap.innerHTML='';SND.sfx('slide');
  await A(rv,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-14%) scale(.92)'}],260);rv.remove()}
 function summary(){if(S.done)return;S.done=true;finish();SND.sfx(['N','R'].includes(pend.best)?'ok':'reward');
  const nNew=pend.isNew.filter(Boolean).length,nDup=pend.ids.length-nNew,dust=pend.ids.reduce((s,id,i)=>s+(pend.isNew[i]?0:COL.DUST_OF[data.cards.find(c=>c.id===id).rarity]),0);
  rev.innerHTML='';env.classList.add('spent');cap.remove();
  const aff=p.id&&get(p.id)&&available(get(p.id)).ok&&p.kind!=='event';
  stage.insertAdjacentHTML('beforeend',`<div class="ps-sum"><h2>Resumen del sobre</h2><div class="sum-row">${cards.map((c,i)=>`<button class="sumc ${pend.isNew[i]?'new':'dup'}" data-id="${c.id}">${faceHTML(c,true)}<span class="sumb ${pend.isNew[i]?'n':'d'}">${pend.isNew[i]?'NUEVA':'REPETIDA'}</span></button>`).join('')}</div>
   <div class="row" style="justify-content:center"><span class="chip off">${nNew} nuevas</span><span class="chip">${nDup} repetidas${dust?` · ✨${dust} si las conviertes`:''}</span>${pend.pity&&RK.indexOf(pend.best)>=RK.indexOf(pend.pity)?`<span class="chip acc">★ Garantía cumplida: ${pend.pity}+</span>`:''}${pend.refund?`<span class="chip acc">Consuelo +🪙${pend.refund}</span>`:''}<span class="chip acc">Mejor: ${pend.best}</span></div>
   <div class="row" style="justify-content:center"><button class="btn pri" id="sAgain" ${aff?'':'disabled'}>${aff?'Abrir otro · '+costTxt(get(p.id)):'Abrir otro'}</button><button class="btn" id="sCol">📚 Ver colección</button>${nNew&&cards.some((c,i)=>pend.isNew[i]&&!c.game)?'<button class="btn" id="sAlb">📒 Colocar en el álbum</button>':''}${dust?'<button class="btn" id="sDust">✨ Convertir duplicados</button>':''}<button class="btn ghost" id="sClose">Cerrar</button></div></div>`);
  IC.scan(sc);const q=s=>sc.querySelector(s);sc.querySelectorAll('.sumc').forEach(b=>b.onclick=()=>openCard(b.dataset.id));
  q('#sClose').onclick=()=>{cleanup();UI.route()};q('#sCol').onclick=()=>{cleanup();UI.go('#/collection')};if(q('#sAlb'))q('#sAlb').onclick=()=>{const c0=cards.find((c,i)=>pend.isNew[i]&&!c.game);cleanup();UI.go('#/albums/'+catAlbumByTitle(c0.album).id+'/open')};if(q('#sDust'))q('#sDust').onclick=()=>{COL.dustAll();q('#sDust').remove()};
  if(aff)q('#sAgain').onclick=()=>{cleanup();setTimeout(()=>PACKS.open(p.id),300)}}
 return S}
// ---------------- API pública ----------------
// Antes de abrir: las fotos del sobre tienen que estar descargadas. Si faltan, se descargan ahora (con barra de progreso).
let prepping=false;
async function ensure(p){const all=pool(p);if(!all.length)return true;if(all.filter(rdy).length>=Math.min(8,all.length))return true;if(!window.PH||!PH.prepare)return true;
 let als=[...new Set(all.filter(c=>!rdy(c)).map(c=>c.album))];if(als.length>3)als=als.sort(()=>Math.random()-.5).slice(0,3);
 const m=DS.modal({id:'prep',title:'Preparando las fotos',body:`<p>Descargando las fotos de este sobre para que todas las cartas salgan con su imagen…</p><div class="prepbar"><i id="prepI"></i></div><p class="small" id="prepT">Conectando…</p>`});
 try{await PH.prepare(als,(d,t,al)=>{const i=m.querySelector('#prepI'),x=m.querySelector('#prepT');if(i)i.style.width=Math.round(d/t*100)+'%';if(x)x.textContent=al+' · '+d+'/'+t})}catch(e){}
 DS.closeModal('prep');return all.filter(rdy).length>0}
async function openPack(id){E();if(data.pending&&!data.pending.done){DS.toast('Tienes un sobre sin terminar: te lo enseñamos primero','🎁');return play(data.pending,{resume:true})}
 const p=get(id);if(!p){DS.toast('Ese sobre ya no está disponible','⚠️');return}if(prepping)return;const av=available(p);if(!av.ok){DS.toast(av.why,'⚠️');SND.sfx('bad');return}
 prepping=true;let ok=false;try{ok=await ensure(p)}finally{prepping=false}
 if(!ok){DS.toast('Todavía no hay fotos descargadas para este sobre. Conéctate a internet o prueba con otro sobre: no se te ha cobrado nada.','⚠️');return}
 const pend=commit(p);if(pend)play(pend)}
window.PACKS={commit,finish,pity,PITY,pityHTML,list,get,odds,pool,available,costTxt,freeReady,freeLeft,fmtT,open:openPack,play,KINDS,Envelope3D,
 resume(){if(data.pending&&!data.pending.done)play(data.pending,{resume:true})},
 forCard(c){const out=[];if(c.game){return list().filter(p=>p.extra===c.id).concat([])}const a=catAlbumByTitle(c.album);const m=CATALOG.members.find(x=>x.name===c.member);
  if(a)out.push(get('album:'+a.id));if(m)out.push(get('member:'+m.id));if(a)out.push(get('era:'+a.release.v.slice(0,4)));out.push(get('normal'),get('premium'));return out.filter(Boolean)}};
// ---------------- HUB DE SOBRES ----------------
let F={kind:'all',year:'',member:'',min:'',sel:null,q:''};
function tile(p){const av=available(p),sel=F.sel===p.id;return`<button class="ptile ${sel?'sel':''} ${av.ok?'':'locked'} k-${p.kind}" data-p="${esc(p.id)}">${Envelope3D.html(p,{size:'sm'})}<div class="pt-i"><b>${esc(p.name)}</b><small>${esc(p.sub)}</small><span class="pt-c ${p.kind==='free'?'free':''}">${p.kind==='free'&&!freeReady()?'⏳ '+fmtT(freeLeft()):costTxt(p)}</span></div></button>`}
function detail(p,modal){const o=odds(p),av=available(p),pc=o.pool.slice().sort((a,b)=>RK.indexOf(b.rarity)-RK.indexOf(a.rarity)),shown=pc.slice(0,modal?12:12),a=p.album?CAT_IDX.album[p.album]:null;
 const guar=p.min!=='N'?`Última carta: ${p.min} o mejor`:'Sin garantía';
 return`<div class="pd"><div class="pd-env">${Envelope3D.html(p,{size:modal?'lg':'md'})}</div><div class="pd-info vstack"><div><div class="row"><span class="chip game">CONTENIDO DEL JUEGO · no es merchandising oficial</span><span class="chip">${KINDS[p.kind]}</span></div><h2 style="margin:.5rem 0 0">${esc(p.name)}</h2><div class="mute">${esc(p.sub)}</div></div>
  <div class="row"><span class="chip acc">${p.cards}${p.extra?' + 1 especial':''} cartas</span><span class="chip">${guar}</span><span class="chip">${o.total} posibles</span>${p.extra?'<span class="chip game">1 carta GAME SPECIAL asegurada</span>':''}</div>
  <div class="row pd-open"><button class="btn pri lg" id="pdOpen" ${av.ok?'':'disabled'}>${p.kind==='free'?'ABRIR GRATIS':'ABRIR · '+costTxt(p)}</button>${av.ok?'':`<span class="small" style="color:var(--warn)">${esc(av.why)}</span>`}</div>
  <div class="odds">${o.rows.map(r=>`<div class="orow"><span class="tag-r ${r.r}">${r.r}</span><div class="meter"><i style="width:${r.pct}%;background:${R[r.r].color}"></i></div><b>${r.count?r.pct.toFixed(1)+'%':'—'}</b><small>${r.count} cartas${p.min!=='N'&&r.last!==r.pct?` · última ${r.last.toFixed(1)}%`:''}</small></div>`).join('')}<p class="small">Probabilidad por carta (calculada con las cartas que existen en este sobre).</p></div>
  <div class="row">${a?`<button class="btn sm" data-go="#/binder/${a.id}">📒 Ver en cromos</button><button class="btn sm" data-go="#/collection/album/${a.id}">📚 Ver colección</button>`:p.member?`<button class="btn sm" data-go="#/collection/member/${p.member}">📚 Ver colección</button>`:p.year?`<button class="btn sm" data-go="#/collection/era/${p.year}">📚 Ver colección</button>`:`<button class="btn sm" data-go="#/collection">📚 Ver colección</button>`}<button class="btn sm" id="pdAll">🃏 Ver cartas posibles (${o.total})</button></div></div>
  <div class="pd-cards"><h3>Algunas cartas posibles</h3><div class="mini-row wrapr">${shown.map(c=>`<button class="pcw" data-c="${c.id}" title="${esc(c.name)}">${data.owned[c.id]?faceHTML(c,true):`<div class="dimc">${faceHTML(c,true)}</div>`}</button>`).join('')}</div></div></div>`}
function bindDetail(root,p){const g=s=>root.querySelector(s);const o=g('#pdOpen');if(o)o.onclick=()=>{DS.closeModal('pack');PACKS.open(p.id)};root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{DS.closeModal('pack');UI.go(b.dataset.go)});root.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>openCard(b.dataset.c));
 const all=g('#pdAll');if(all)all.onclick=()=>{const cs=odds(p).pool.slice().sort((a,b)=>RK.indexOf(b.rarity)-RK.indexOf(a.rarity));const m=DS.modal({id:'poolm',title:`Cartas posibles · ${esc(p.name)}`,cls:'lg',body:`<div class="gridx g-auto" style="--min:104px">${cs.map(c=>`<button class="pcw" data-c="${c.id}">${data.owned[c.id]?'':'<span class="chip off sm1">nueva</span>'}${faceHTML(c,true)}<small>${esc(c.member)} · ${c.rarity}</small></button>`).join('')}</div>`});IC.scan(m);m.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>openCard(b.dataset.c))};IC.scan(root)}
function history(){const H=(data.pulls.hist||[]);const m=DS.modal({id:'hist',title:'Historial de aperturas',cls:'lg',body:H.length?`<div class="vstack">${H.map(h=>`<div class="card flat"><div class="row spb"><b>${esc(h.pack.name)}</b><span class="small">${new Date(h.t).toLocaleString('es-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} · mejor <span class="tag-r ${h.best}">${h.best}</span></span></div><div class="mini-row" style="margin-top:8px">${h.ids.map((id,i)=>{const c=data.cards.find(x=>x.id===id);return c?`<button class="pcw" data-c="${id}">${faceHTML(c,true)}<span class="sumb ${h.isNew[i]?'n':'d'}">${h.isNew[i]?'NUEVA':'DUP'}</span></button>`:''}).join('')}</div></div>`).join('')}<p class="small">El historial es solo de consulta: una apertura terminada no se puede repetir.</p></div>`:DS.empty('🎁','Todavía no has abierto sobres.',{label:'Abrir el sobre diario',go:"DS.closeModal('hist');PACKS.open('free')"})});IC.scan(m);m.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>openCard(b.dataset.c))}
function nextEvent(){const now=new Date(),y=now.getFullYear(),c=EVENTS.map(e=>{let d=new Date(y,e.from[0]-1,e.from[1]);if(d<now)d=new Date(y+1,e.from[0]-1,e.from[1]);return{e,d}}).sort((a,b)=>a.d-b.d)[0];return{e:c.e,days:Math.ceil((c.d-now)/864e5)}}
UI.view('packs',{skin:'collection',render(c,args){E();const all=list();if(args[0]&&get(decodeURIComponent(args[0]))&&!F._seen)F.sel=decodeURIComponent(args[0]);F._seen=0;F.q=F.q||'';
 const kinds=[['all','Todos'],...Object.entries(KINDS).filter(([k])=>all.some(p=>p.kind===k))],years=[...new Set(VIS().map(a=>a.release.v.slice(0,4)))];
 let L=all.filter(p=>F.kind==='all'||p.kind===F.kind);
 if(F.year)L=L.filter(p=>p.album?CAT_IDX.album[p.album].release.v.startsWith(F.year):p.year===F.year);
 if(F.member)L=L.filter(p=>p.member===F.member);
 if(F.min)L=L.filter(p=>RK.indexOf(p.min)>=RK.indexOf(F.min));
 const qq=F.q.trim().toLowerCase();if(qq)L=L.filter(p=>(p.name+' '+(p.sub||'')).toLowerCase().includes(qq));
 const fr=get('free'),ne=nextEvent(),ev=all.filter(p=>p.kind==='event'),pend=data.pending&&!data.pending.done,nf=[F.year,F.member,F.min,qq].filter(Boolean).length+(F.kind!=='all'?1:0);
 const groups=F.kind==='all'&&!qq&&!F.year&&!F.member&&!F.min?Object.keys(KINDS).map(k=>[k,L.filter(p=>p.kind===k)]).filter(x=>x[1].length):[['_',L]];
 const secs=groups.map(([k,l])=>`${k==='_'?'':`<div class="psec"><h3>${KINDS[k]}</h3><span>${l.length} sobre${l.length===1?'':'s'}</span></div>`}<div class="pgrid">${l.map(tile).join('')}</div>`).join('');
 c.innerHTML=`<div class="phead"><div><h2>Sobres</h2><div class="small">Elige un sobre, mira qué cartas puede dar y ábrelo.</div></div><div class="row"><button class="btn sm" id="hHist">🕘 Historial</button><button class="btn sm" onclick="UI.go('#/gacha')">🎰 Gacha</button></div></div>
 ${pityHTML()}
 ${pend?`<div class="card resume2"><b>🎁 Tienes un sobre sin terminar</b><span class="small">Su resultado ya está guardado y no puede cambiar.</span><button class="btn pri" id="hResume">Ver mis cartas</button></div>`:''}
 <div class="hero2"><div class="hero2-env">${Envelope3D.html(fr,{size:'md'})}</div><div class="hero2-t"><span class="hero2-chip ${freeReady()?'on':''}">${freeReady()?'● LISTO PARA ABRIR':'⏳ EN CARGA'}</span><h3>Sobre diario gratis</h3><p>3 cartas cada ${FREE_H} horas. Nunca te quedas sin sobres.</p>${DS.btn(freeReady()?'ABRIR AHORA':'Disponible en '+fmtT(freeLeft()),{v:'pri',id:'hFree',disabled:!freeReady()})}</div>
   ${ev.length?`<div class="hero2-ev">${ev.map(p=>`<button class="evb2" data-p="${esc(p.id)}"><span>EVENTO</span><b>${esc(p.name)}</b><small>hasta el ${String(p.event.to[1]).padStart(2,'0')}/${String(p.event.to[0]).padStart(2,'0')} · 🎫 1</small></button>`).join('')}</div>`:`<div class="hero2-ev"><div class="evb2 soon"><span>PRÓXIMO EVENTO</span><b>${esc(ne.e.name)}</b><small>en ${ne.days} día${ne.days===1?'':'s'} · 🎫 1</small></div></div>`}</div>
 <div class="ptools"><div class="pt-search"><span>🔎</span><input id="pq" type="search" placeholder="Buscar sobre, álbum o era…" value="${esc(F.q)}" autocomplete="off"></div>
  <div class="pt-kinds">${kinds.map(([k,l])=>`<button class="pk ${F.kind===k?'on':''}" data-k="${k}">${l}<small>${k==='all'?all.length:all.filter(p=>p.kind===k).length}</small></button>`).join('')}</div>
  <div class="pt-sel"><label>Era<select id="fy"><option value="">Todas</option>${years.map(y=>`<option ${F.year===y?'selected':''}>${y}</option>`).join('')}</select></label><label>Miembro<select id="fm"><option value="">Todas</option>${CATALOG.members.map(m=>`<option value="${m.id}" ${F.member===m.id?'selected':''}>${m.name}</option>`).join('')}</select></label><label>Garantía<select id="fg">${[['','Cualquiera'],['R','R o mejor'],['SR','SR o mejor']].map(([k,l])=>`<option value="${k}" ${F.min===k?'selected':''}>${l}</option>`).join('')}</select></label>${nf?`<button class="btn sm" id="fx">✕ Quitar filtros</button>`:''}<span class="pt-n">${L.length} sobre${L.length===1?'':'s'}</span></div></div>
 <div class="hubgrid2"><section class="hubmain">${L.length?secs:DS.empty('🔎','Ningún sobre cumple esa combinación.',{label:'Quitar filtros',go:"PACKS._reset()"})}</section>
  <aside class="pdetail card" id="pdet">${F.sel&&get(F.sel)?'':`<div class="empty"><div class="eico">🎁</div><p>Toca un sobre para ver qué cartas puede dar, sus probabilidades y su coste.</p></div>`}</aside></div>`;
 IC.scan(c);const q=s=>c.querySelector(s),re=()=>{UI.keepScroll=true;UI.route()};
 c.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{F.kind=b.dataset.k;re()});
 q('#fy').onchange=e=>{F.year=e.target.value;if(F.year&&F.kind==='all')F.kind='album';re()};q('#fm').onchange=e=>{F.member=e.target.value;if(F.member)F.kind='member';re()};q('#fg').onchange=e=>{F.min=e.target.value;re()};
 const fx=q('#fx');if(fx)fx.onclick=()=>{F={kind:'all',year:'',member:'',min:'',sel:F.sel,q:''};re()};
 let qt=0;q('#pq').oninput=e=>{clearTimeout(qt);const v=e.target.value;qt=setTimeout(()=>{F.q=v;UI.keepScroll=true;UI.route();const i=document.querySelector('#pq');if(i){i.focus();i.setSelectionRange(v.length,v.length)}},260)};
 q('#hHist').onclick=history;if(q('#hResume'))q('#hResume').onclick=()=>PACKS.resume();if(q('#hFree'))q('#hFree').onclick=()=>PACKS.open('free');
 const show=id=>{F.sel=id;const p=get(id);if(!p)return;c.querySelectorAll('.ptile').forEach(t=>t.classList.toggle('sel',t.dataset.p===id));if(matchMedia('(min-width:1100px)').matches){q('#pdet').innerHTML=detail(p);bindDetail(q('#pdet'),p)}else{const m=DS.modal({id:'pack',title:esc(p.name),cls:'lg',body:detail(p,true)});bindDetail(m,p)}};
 c.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>show(b.dataset.p));if(F.sel&&get(F.sel)&&matchMedia('(min-width:1100px)').matches)show(F.sel)}});
window.PACKS.showDetail=id=>{const p=get(id);if(!p)return;const m=DS.modal({id:'pack',title:esc(p.name),cls:'lg',body:detail(p,true)});bindDetail(m,p)};
window.PACKS._reset=()=>{F={kind:'all',year:'',member:'',min:'',sel:null,q:''};UI.route()};
// recuperar una apertura interrumpida automáticamente al volver
window.addEventListener('load',()=>setTimeout(()=>{if(data.pending&&!data.pending.done)DS.toast('Tienes un sobre sin terminar en Sobres','🎁')},1500));
})();
;
/* ================= packs3.js ================= */
// v22.18 · Sobres como pantalla de invocación de un gacha: carrusel de banners con probabilidades, categorías y filtros plegables
(function(){
const V=UI.views.packs;if(!V||!window.PACKS)return;const _r=V.render;
const RKS=['UR','SSR','SR','R','N'];
function banners(){const L=[],add=id=>{try{const p=PACKS.get(id);if(p&&!L.some(x=>x.id===p.id))L.push(p)}catch(e){}};
 add('free');
 try{PACKS.list().filter(p=>p.kind==='event').forEach(p=>add(p.id))}catch(e){}
 const fav=(data.fav||[]).map(id=>data.cards.find(c=>c.id===id)).filter(Boolean)[0];
 if(fav){try{const a=catAlbumByTitle(fav.album);if(a)add('album:'+a.id)}catch(e){}try{const m=CATALOG.members.find(x=>x.name===fav.member);if(m)add('member:'+m.id)}catch(e){}}
 add('premium');add('normal');
 if(L.length<4)PACKS.list().filter(p=>p.kind==='album').slice(-3).forEach(p=>add(p.id));
 return L.slice(0,6)}
const slide=p=>{const o=PACKS.odds(p),av=PACKS.available(p),top=o.rows.filter(r=>r.count).slice(0,3),th=p.theme||['#ff8cc0','#d93a86'],free=p.kind==='free';
 const guar=p.min&&p.min!=='N'?`Última carta ${p.min} o mejor`:'Sin garantía';
 return`<article class="sb" style="--a:${th[0]};--b:${th[1]}" data-id="${esc(p.id)}"><div class="sb-env">${PACKS.Envelope3D.html(p,{size:'md'})}</div>
 <div class="sb-tx"><span class="sb-k">${esc(({free:'GRATIS',event:'EVENTO',album:'ÁLBUM',era:'ERA',member:'INTEGRANTE',premium:'PREMIUM',normal:'ESTÁNDAR'})[p.kind]||'SOBRE')}</span><h3>${esc(p.name)}</h3><p>${esc(p.sub||'')}</p>
  <div class="sb-od">${top.map(r=>`<span class="tag-r ${r.r}">${r.r} ${r.pct<1?r.pct.toFixed(2):r.pct.toFixed(1)}%</span>`).join('')}<small>${p.cards}${p.extra?'+1':''} cartas · ${guar}</small></div>
  <div class="sb-act"><button class="sb-open ${av.ok?'':'off'}" data-open="${esc(p.id)}" ${av.ok?'':'disabled'}>${av.ok?(free?'ABRIR GRATIS':'ABRIR · '+PACKS.costTxt(p)):esc(av.why||'No disponible')}</button><button class="sb-info" data-info="${esc(p.id)}">Probabilidades</button></div></div></article>`};
V.render=function(c,args){_r.call(this,c,args);try{
 const hero=c.querySelector('.hero2');if(!hero)return;const B=banners();
 const wrap=document.createElement('section');wrap.className='sbw';wrap.innerHTML=`<div class="sb-track">${B.map(slide).join('')}</div><div class="sb-dots">${B.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>`;
 hero.replaceWith(wrap);
 const tr=wrap.querySelector('.sb-track'),dots=[...wrap.querySelectorAll('.sb-dots i')];let bi=0,idle=0;
 const go=n=>{bi=(n+B.length)%B.length;tr.scrollTo({left:tr.children[bi].offsetLeft-tr.offsetLeft,behavior:'smooth'})};
 tr.addEventListener('scroll',()=>{const w=tr.children[0].offsetWidth+14,n=Math.round(tr.scrollLeft/w);bi=n;dots.forEach((d,j)=>d.classList.toggle('on',j===n))},{passive:true});
 dots.forEach((d,j)=>d.onclick=()=>go(j));
 const tm=setInterval(()=>{if(!tr.isConnected){clearInterval(tm);return}if(Date.now()-idle>9000)go(bi+1)},6000);['pointerdown','wheel','touchstart'].forEach(e=>tr.addEventListener(e,()=>idle=Date.now(),{passive:true}));
 wrap.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>PACKS.open(b.dataset.open));
 wrap.querySelectorAll('[data-info]').forEach(b=>b.onclick=()=>PACKS.showDetail(b.dataset.info));
 // filtros plegables
 const tools=c.querySelector('.ptools'),sel=tools&&tools.querySelector('.pt-sel'),kinds=tools&&tools.querySelector('.pt-kinds');
 if(sel&&kinds){const b=document.createElement('button');b.className='pk fl';b.innerHTML='⚙ Filtros';b.onclick=()=>{tools.classList.toggle('open')};kinds.appendChild(b);if([...sel.querySelectorAll('select')].some(s=>s.value))tools.classList.add('open')}
 // etiqueta de estado en tiles
 c.querySelectorAll('.ptile').forEach(t=>{if(t.classList.contains('locked')){const i=document.createElement('i');i.className='lk';i.textContent='🔒';t.appendChild(i)}});
 }catch(e){console.error(e)}};
})();
;
