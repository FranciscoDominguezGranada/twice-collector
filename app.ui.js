/* ================= ds.js ================= */
// =====================================================================================
//  DS · Sistema de diseño (componentes reutilizables) + SND · sistema de sonido
//  Un solo Button / Modal / Tooltip / Empty / Toast para TODA la aplicación.
// =====================================================================================
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
// ---------------- SND ----------------
const SK='twiceSnd',cfgDef={master:.8,sfx:.9,music:.35,mute:false,music_on:false};
const cfg=Object.assign({},cfgDef,(()=>{try{return JSON.parse(localStorage.getItem(SK))}catch(e){return{}}})());
let ac=null,mg=null,musicNodes=null;
const ctx=()=>{if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.connect(ac.destination)}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();if(mg)mg.gain.value=cfg.mute?0:cfg.master;return ac};
const tone=(f,d=.12,type='sine',v=.12,slide=0,delay=0)=>{const a=ctx();if(!a||cfg.mute)return;const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(v*cfg.sfx,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(mg);o.start(t);o.stop(t+d+.03)};
const noise=(d=.1,v=.1,delay=0,hp=1500,lp=0)=>{const a=ctx();if(!a||cfg.mute)return;const t=a.currentTime+delay,b=a.createBuffer(1,Math.max(1,a.sampleRate*d|0),a.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*(1-i/x.length);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type=lp?'lowpass':'highpass';f.frequency.value=lp||hp;g.gain.value=v*cfg.sfx;s.buffer=b;s.connect(f).connect(g).connect(mg);s.start(t)};
const R={ // efectos: nombre → función
 click:()=>{tone(520,.05,'triangle',.08)},back:()=>{tone(380,.07,'triangle',.07,-120)},ok:()=>{tone(660,.08,'sine',.1);tone(990,.14,'sine',.1,0,.08)},bad:()=>{tone(200,.22,'sawtooth',.07,-70)},
 coin:()=>{tone(1318,.07,'square',.06);tone(1760,.2,'square',.06,0,.07)},reward:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.16,'triangle',.11,0,i*.07))},
 charge:()=>{tone(110,1.2,'sawtooth',.05,330);noise(1.2,.04,0,600)},tear:()=>{noise(.35,.2,0,2600);noise(.18,.12,.08,5000);tone(180,.18,'square',.05,-90)},whoosh:()=>{noise(.35,.12,0,700,2400)},
 slide:()=>{noise(.18,.08,0,1800,5000)},flip:()=>{noise(.09,.1,0,2200);tone(420,.1,'triangle',.07,300)},
 r_N:()=>tone(440,.12,'triangle',.08),r_R:()=>{tone(523,.12,'triangle',.1);tone(784,.2,'triangle',.1,0,.09)},r_SR:()=>{[523,659,784].forEach((f,i)=>tone(f,.18,'triangle',.12,0,i*.08))},
 r_SSR:()=>{[523,659,784,988,1318].forEach((f,i)=>tone(f,.22,'sine',.14,0,i*.08));noise(.5,.05,.2,6000)},r_UR:()=>{[392,523,659,784,1047,1318,1568].forEach((f,i)=>tone(f,.3,'sine',.15,0,i*.075));tone(2093,.9,'triangle',.08,0,.6);noise(.9,.06,.1,5000)},
 pet:()=>{tone(880,.06,'square',.05);tone(1175,.08,'square',.05,0,.07)},place:()=>{tone(300,.08,'sine',.12,-100);noise(.07,.1,0,1800)},page:()=>{noise(.14,.12,0,1800);noise(.1,.06,.07,3500)},
 level:()=>{[523,659,784,1047,1319].forEach((f,i)=>tone(f,.2,'square',.07,0,i*.09))},open:()=>{tone(220,.3,'sine',.12,220);noise(.2,.05,0,900)}};
const SND={cfg,sfx:n=>{try{(R[n]||R.click)()}catch(e){}},
 save:()=>{try{localStorage.setItem(SK,JSON.stringify(cfg))}catch(e){}if(mg)mg.gain.value=cfg.mute?0:cfg.master;SND.musicApply()},
 set:(k,v)=>{cfg[k]=v;SND.save()},
 // música generativa suave (opcional, apagada por defecto)
 musicApply(){const a=cfg.music_on&&!cfg.mute?ctx():null;if(!a){if(musicNodes){clearInterval(musicNodes.t);musicNodes=null}return}if(musicNodes)return;const seq=[[261,329,392],[220,277,330],[174,220,261],[196,247,294]];let i=0;
  const step=()=>{const ch=seq[i++%seq.length];ch.forEach((f,k)=>{const t=a.currentTime+k*.05,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06*cfg.music*cfg.master,t+.8);g.gain.exponentialRampToValueAtTime(.0001,t+3.6);o.connect(g).connect(a.destination);o.start(t);o.stop(t+3.7)})};step();musicNodes={t:setInterval(step,3400)}}};
window.SND=SND;
addEventListener('pointerdown',()=>{ctx();if(cfg.music_on)SND.musicApply()},{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&musicNodes){clearInterval(musicNodes.t);musicNodes=null}else if(cfg.music_on)SND.musicApply()});
// ---------------- DS ----------------
const DS={esc,
 // Button: único componente de botón. variantes: pri · sec · ghost · danger · gold · tama
 btn:(label,o={})=>`<button class="btn ${o.v||'sec'} ${o.size||''}" ${o.id?`id="${o.id}"`:''} ${o.tip?`data-tip="${esc(o.tip)}"`:''} ${o.disabled?'disabled':''} ${o.on?`data-on="${esc(o.on)}"`:''} ${o.attrs||''}>${o.icon?`<i class="ico">${o.icon}</i>`:''}<span>${label}</span></button>`,
 bar:(v,max=100,o={})=>`<div class="meter ${o.cls||''}"><i style="width:${Math.max(0,Math.min(100,v/max*100))}%;${o.color?`background:${o.color}`:''}"></i></div>`,
 chip:(t,o={})=>`<span class="chip ${o.cls||''}" ${o.tip?`data-tip="${esc(o.tip)}"`:''}>${t}</span>`,
 empty:(icon,text,cta)=>`<div class="empty"><div class="eico">${icon}</div><p>${text}</p>${cta?DS.btn(cta.label,{v:'pri',attrs:`onclick="${cta.go}"`}):''}</div>`,
 // Modal único: cabe siempre (scroll interno), se cierra con ✕ / Esc / clic fuera, devuelve el nodo
 modal(o){DS.closeModal(o.id);const m=document.createElement('div');m.className='modal-bg';m.dataset.mid=o.id||'';m.innerHTML=`<div class="modal ${o.cls||''}" role="dialog" aria-modal="true" aria-label="${esc(o.title||'')}"><header><b>${o.title||''}</b><button class="x" aria-label="Cerrar">✕</button></header><div class="mbody">${o.body||''}</div>${o.actions?`<footer>${o.actions}</footer>`:''}</div>`;
  const close=()=>{m.classList.add('out');setTimeout(()=>m.remove(),160);document.removeEventListener('keydown',kd);o.onClose&&o.onClose()};const kd=e=>{if(e.key==='Escape'&&m.isConnected&&document.querySelector('.modal-bg:last-of-type')===m){e.stopPropagation();close()}};
  m.addEventListener('mousedown',e=>{if(e.target===m)close()});m.querySelector('.x').onclick=close;document.addEventListener('keydown',kd);document.body.appendChild(m);m._close=close;SND.sfx('open');return m},
 closeModal(id){document.querySelectorAll('.modal-bg').forEach(m=>{if(!id||m.dataset.mid===id)m.remove()})},
 // Tooltip: CSS puro con [data-tip] (no se sale de pantalla: ancho máx. y colocación según el borde)
 tipInit(){let t=document.getElementById('dstip');if(!t){t=document.createElement('div');t.id='dstip';document.body.appendChild(t)}
  document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('[data-tip]');if(!el||matchMedia('(hover:none)').matches)return;t.textContent=el.dataset.tip;t.classList.add('on');const r=el.getBoundingClientRect(),w=t.offsetWidth,h=t.offsetHeight;let x=r.left+r.width/2-w/2,y=r.top-h-8;if(y<4)y=r.bottom+8;x=Math.max(6,Math.min(innerWidth-w-6,x));t.style.left=x+'px';t.style.top=y+'px'});
  document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('[data-tip]'))t.classList.remove('on')})},
 toast(msg,ico='★'){let host=document.getElementById('toasts');if(!host){host=document.createElement('div');host.id='toasts';document.body.appendChild(host)}const n=document.createElement('div');n.className='toast';n.innerHTML=`<i>${ico}</i><span>${msg}</span>`;host.appendChild(n);requestAnimationFrame(()=>n.classList.add('in'));setTimeout(()=>{n.classList.remove('in');setTimeout(()=>n.remove(),250)},2800);while(host.children.length>3)host.firstChild.remove()},
 // contador animado (monedas, XP…)
 count(el,to,ms=600){if(!el)return;const from=+el.dataset.v||0;el.dataset.v=to;if(from===to||matchMedia('(prefers-reduced-motion:reduce)').matches){el.textContent=to.toLocaleString('es-ES');return}const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/ms);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3))).toLocaleString('es-ES');if(k<1)requestAnimationFrame(f)})(t0)},
 // partículas de recompensa (ligeras)
 burst(x,y,emoji='✨',n=10){for(let i=0;i<n;i++){const p=document.createElement('i');p.className="fxburst";p.textContent=emoji;p.style.cssText=`left:${x}px;top:${y}px;--dx:${(Math.random()-.5)*160}px;--dy:${-40-Math.random()*120}px`;document.body.appendChild(p);setTimeout(()=>p.remove(),900)}}};
window.DS=DS;
// el toast global heredado usa el sistema nuevo
window.toast=(t)=>DS.toast(t);
document.addEventListener('DOMContentLoaded',DS.tipInit);if(document.readyState!=='loading')DS.tipInit();
// feedback "pressed" + sonido en todos los botones del sistema
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.btn:not(:disabled),.nav-i:not(.on)');if(b){SND.sfx('click')}},true);
})();
;
/* ================= shell.js ================= */
// =====================================================================================
//  SHELL · un único router + navegación + barra superior. Sustituye a desk.js y al router de v19.
//  #/vista/arg1/arg2   ·   las vistas se registran con UI.view(nombre,{skin,render})
// =====================================================================================
(function(){
const esc=DS.esc;
const NAV=[['home','🏠','Inicio'],['pet','🐣','Mi Idol'],['packs','🎁','Sobres'],['binder','📚','Colección'],['gacha','🎰','Gacha'],['games','🎮','Juegos'],['events','🎉','Eventos'],['profile','👤','Perfil']];
const ALIAS={retos:['events'],capsule:['gacha'],puzzles:['games'],stats:['profile','stats'],source:['profile','settings'],members:['collection','members'],album:['albums']};
const UI={views:{},cur:null,args:[],NAV};window.UI=UI;
UI.view=(n,v)=>{UI.views[n]=v};
UI.go=h=>{if(location.hash===h)UI.route();else location.hash=h};window.go19=UI.go;
UI.route=function(){let p=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean),name=p[0]||'home',args=p.slice(1);
 if(ALIAS[name]){const a=ALIAS[name];if(name==='album'||name==='binder'){args=[args[0]].concat(name==='binder'?['open']:args.slice(1))}else args=a.slice(1).concat(args);name=a[0]}
 if(!UI.views[name]){name='home';args=[]}UI.cur=name;UI.args=args;
 document.querySelectorAll('.modal-bg').forEach(m=>m.remove());document.querySelectorAll('.sheet').forEach(s=>s.remove());
 const v=UI.views[name];document.body.dataset.skin=v.skin||'collection';document.body.dataset.route=name;
 document.querySelectorAll('.nav-i[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===name||((name==='collection'||name==='albums')&&b.dataset.v==='binder')));
 const c=document.getElementById('content');c.className='';c.innerHTML='';try{v.render(c,args)}catch(e){console.error(e);c.innerHTML=DS.empty('⚠️','Algo ha fallado al mostrar esta pantalla. El resto de la app sigue funcionando.',{label:'Volver al inicio',go:"UI.go('#/home')"})}
 // transición común de pantalla: solo al CAMBIAR de pantalla (los repintados de la misma no la repiten)
 const key=name+'/'+args.join('/');if(UI._last!==key&&!UI.keepScroll){c.removeAttribute('data-pg');void c.offsetWidth;c.setAttribute('data-pg','in');let b=document.getElementById('pgbar');if(!b){b=document.createElement('i');b.id='pgbar';document.body.appendChild(b)}b.classList.remove('go');void b.offsetWidth;b.classList.add('go')}UI._last=key;
 if(!UI.keepScroll)window.scrollTo(0,0);UI.keepScroll=false;UI.badges();updateStats&&updateStats()};
// compatibilidad con el código heredado: render('pet') / render('retos') vuelven a pintar la vista
window.render=render=function(t){const a=ALIAS[t]?ALIAS[t][0]:t;if(a===UI.cur){UI.keepScroll=true;UI.route()}else UI.go('#/'+t)};
// ---------- estructura del shell ----------
const LOGO='https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Logo_of_TWICE.svg/330px-Logo_of_TWICE.svg.png';
const logo=h=>`<img src="${LOGO}" alt="TWICE" referrerpolicy="no-referrer" onerror="this.outerHTML='<b>TWICE</b>'">`;
document.body.classList.add('ds');
const app=document.querySelector('.app');
document.querySelectorAll('nav').forEach(n=>n.remove());
const side=document.createElement('nav');side.className='sidenav';side.setAttribute('aria-label','Navegación principal');
side.innerHTML=`<div class="logo">${logo()}<div>COLLECTOR<small>ONCE EDITION</small></div></div>${NAV.map(([k,i,l])=>`<button class="nav-i" data-v="${k}"><span class="ni">${i}</span>${l}<span class="nb" hidden></span></button>`).join('')}<div class="foot">Juego de coleccionismo de TWICE.<br>Contenido de juego ≠ merchandising oficial.</div>`;
document.body.appendChild(side);
const MORE=[['gacha','🎰','Gacha'],['games','🎮','Juegos'],['events','🎉','Eventos y misiones'],['profile','👤','Perfil y ajustes']];
const bot=document.createElement('nav');bot.className='bottomnav';bot.setAttribute('aria-label','Navegación');
bot.innerHTML=NAV.slice(0,4).map(([k,i,l])=>`<button class="nav-i" data-v="${k}"><span class="ni">${i}</span>${l}</button>`).join('')+`<button class="nav-i" data-more><span class="ni">⋯</span>Más</button>`;
document.body.appendChild(bot);
const top=document.createElement('header');top.className='topbar';
top.innerHTML=`<a class="brand-m" href="#/home">${logo()}<span>Collector</span></a><div class="srch" id="srch"><input id="q" type="search" placeholder="Buscar integrante, álbum, versión, era o carta…  ( / )" autocomplete="off" aria-label="Buscar"><div id="qres"></div></div><div class="res" id="res"></div>`;
app.insertBefore(top,app.firstChild);
document.querySelectorAll('.nav-i[data-v]').forEach(b=>b.onclick=()=>UI.go('#/'+b.dataset.v));
bot.querySelector('[data-more]').onclick=()=>DS.modal({id:'more',title:'Más',cls:'sm',body:`<div class="vstack">${MORE.map(([k,i,l])=>`<button class="btn block" onclick="DS.closeModal('more');UI.go('#/${k}')"><i class="ico">${i}</i>${l}</button>`).join('')}<button class="btn block" onclick="DS.closeModal('more');UI.search()"><i class="ico">🔍</i>Buscar</button></div>`});
UI.badges=function(){const n=document.querySelector('.nav-i[data-v=packs] .nb');if(n&&window.PACKS){const f=PACKS.freeReady()||(data.pending&&!data.pending.done);n.hidden=!f;n.textContent=f?'1':''}};
// ---------- recursos (monedas, tickets, polvo, gemas) + nivel ----------
window.ecoHud=UI.res=function(){const L=ECO.colLevel(),h=document.getElementById('res');if(!h)return;
 h.innerHTML=`<button class="lvl" data-tip="Nivel de coleccionista · ${L.cur}/${L.need} 🏅" onclick="UI.go('#/profile')">Nv ${L.l}<i><u style="width:${L.cur/L.need*100}%"></u></i></button>${['coins','tickets','dust','gems'].map(c=>`<span class="cur" data-tip="${ECO.CUR[c].n}: ${ECO.CUR[c].use}">${ECO.CUR[c].i}<b data-r="${c}" data-v="${h.dataset['v'+c]||0}">${ECO.bal(c).toLocaleString('es-ES')}</b></span>`).join('')}`;
 ['coins','tickets','dust','gems'].forEach(c=>{const b=h.querySelector(`[data-r=${c}]`);const old=+h.dataset['v'+c]||ECO.bal(c);b.dataset.v=old;DS.count(b,ECO.bal(c),500);h.dataset['v'+c]=ECO.bal(c)})};
window.hud=window.ecoHud;
// ---------- búsqueda: integrante · álbum · versión · era · carta (solo TWICE) ----------
function searchHTML(txt){const s=catNorm(txt);if(s.length<2)return'';const out=[];
 CATALOG.members.filter(m=>catNorm(m.name).includes(s)||m.hangul.includes(txt)).forEach(m=>out.push(`<a href="#/collection/member/${m.id}">👤 ${m.name}<small>${m.hangul}</small></a>`));
 catVisibleAlbums().filter(a=>catNorm(a.title).includes(s)||(a.release.v||'').startsWith(s)).slice(0,6).forEach(a=>out.push(`<a href="#/binder/${a.id}">💿 ${esc(a.title)}<small>${(a.release.v||'').slice(0,4)}</small></a>`));
 CATALOG.versions.filter(v=>catNorm(v.name).includes(s)||catNorm(v.id).includes(s)).slice(0,4).forEach(v=>{const a=CAT_IDX.album[v.album];out.push(`<a href="#/binder/${v.album}">📀 ${esc(a.title)} · ${esc(v.name)}<small>versión</small></a>`)});
 const yr=/^(20\d\d)$/.exec(txt.trim());if(yr)out.push(`<a href="#/collection/era/${yr[1]}">🕘 Era ${yr[1]}<small>${catVisibleAlbums().filter(a=>a.release.v.startsWith(yr[1])).length} álbumes</small></a>`);
 data.cards.filter(c=>catNorm(c.name).includes(s)).slice(0,5).forEach(c=>{const a=catAlbumByTitle(c.album);out.push(`<a href="#/collection/${a?'album/'+a.id:'special'}">🃏 ${esc(c.name)}<small>${data.owned[c.id]?'tengo':'falta'}</small></a>`)});
 return out.slice(0,12).join('')||'<span class="small" style="padding:10px 14px;display:block">Sin resultados</span>'}
const q=document.getElementById('q'),qr=document.getElementById('qres');q.oninput=()=>qr.innerHTML=searchHTML(q.value);q.onblur=()=>setTimeout(()=>qr.innerHTML='',180);
UI.search=()=>{const m=DS.modal({id:'search',title:'Buscar',body:`<input class="inp" id="q2" type="search" placeholder="Integrante, álbum, versión, era o carta" style="width:100%" autocomplete="off"><div id="q2r" class="vstack" style="margin-top:12px;gap:0"></div>`});const i=m.querySelector('#q2'),r=m.querySelector('#q2r');i.oninput=()=>r.innerHTML=searchHTML(i.value).replace(/<a /g,'<a class="btn ghost block" style="justify-content:space-between;margin-bottom:6px" ');r.onclick=()=>setTimeout(()=>DS.closeModal('search'),50);setTimeout(()=>i.focus(),50)};
// ---------- teclado (escritorio) ----------
addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select')||e.ctrlKey||e.metaKey)return;
 if(e.key==='/'){e.preventDefault();if(matchMedia('(min-width:768px)').matches)q.focus();else UI.search();return}
 if(/^[1-9]$/.test(e.key)&&!document.querySelector('.modal-bg,.packscene,#tama')){UI.go('#/'+NAV[+e.key-1][0])}});
addEventListener('hashchange',()=>UI.route());
UI.start=function(){const qt=new URLSearchParams(location.search).get('tab');if(qt&&(!location.hash||location.hash==='#/'))history.replaceState(null,'',location.pathname+'#/'+(qt==='gacha'?'packs':qt));if(!location.hash||location.hash==='#'||location.hash==='#/')history.replaceState(null,'',location.pathname+location.search.replace(/[?&]tab=[^&]*/,'')+'#/home');ecoHud();UI.route()};
})();
;
/* ================= cards.js ================= */
// =====================================================================================
//  CARTAS · tipos, cartas GAME SPECIAL (contenido del juego) y ficha de carta unificada
//  Regla: "rareza del juego" ≠ "característica física real". Ninguna photocard real se marca holográfica/foil/firmada
//  porque no hay datos verificados de eso; los efectos visuales son efectos del juego y se rotulan así.
// =====================================================================================
(function(){
const esc=DS.esc;
// ---- taxonomía (tipo = qué es la carta; rareza = valor dentro del juego; físico = dato real, solo si está verificado) ----
window.CARD_TYPES={photocard:{n:'Photocard',official:true,desc:'Photocard real de un álbum de TWICE'},
 event:{n:'Evento',official:false,desc:'Carta exclusiva del juego, ligada a un evento temporal'},anniversary:{n:'Aniversario',official:false,desc:'Carta exclusiva del juego por el aniversario'},
 idol:{n:'Mi Idol',official:false,desc:'Carta exclusiva del juego conseguida cuidando a Mi Idol'},limited:{n:'Limitada',official:false,desc:'Carta exclusiva del juego de edición limitada'},
 gacha:{n:'Gacha',official:false,desc:'Carta exclusiva del juego conseguida con premios del gacha'}};
// características físicas reales (holo, foil, firmada, concept…): NO hay ninguna verificada → se declara tal cual
window.REAL_FEATURES_NOTE='Características físicas reales (holo, foil, firma…): sin verificar. Los brillos que ves son efectos del juego.';
// ---- cartas GAME SPECIAL (arte generado, no son fotos de nadie) ----
const col=id=>{const m=CATALOG.members.find(x=>x.id===id);return(TY[m.name]||[,'#ff5fa2'])[1]};
function gameArt(kind,mid,label){const m=mid?CATALOG.members.find(x=>x.id===mid):null,c=m?col(mid):'#ff5fa2',h=[...(kind+(mid||''))].reduce((a,ch)=>a*31+ch.charCodeAt(0)>>>0,7);
 const conf=Array.from({length:26},(_,i)=>{const x=(h*(i+3)*37)%400,y=(h*(i+5)*53)%600,r=4+((h>>i)&7),k=(h>>(i%9))&3;return k===0?`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".35"/>`:k===1?`<rect x="${x}" y="${y}" width="${r*2}" height="${r*2}" fill="${c}" opacity=".5" transform="rotate(${(h*i)%90} ${x} ${y})"/>`:`<path d="M${x} ${y-r*2} l${r} ${r*2} l${r*2} 0 l${-r*1.6} ${r*1.5} l${r*.8} ${r*2.2} l${-r*2.2} ${-r*1.2} l${-r*2.2} ${r*1.2} l${r*.8} ${-r*2.2} l${-r*1.6} ${-r*1.5} l${r*2} 0z" fill="#ffd23f" opacity=".6"/>`}).join('');
 const sym={event:'★',anniversary:'♛',idol:'♥',limited:'✦',gacha:'◆'}[kind]||'★',ini=m?m.name[0]:'T';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#2a1040"/></linearGradient><radialGradient id="r" cx=".5" cy=".38" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="400" height="600" fill="url(#g)"/><rect width="400" height="600" fill="url(#r)"/>${conf}<text x="200" y="330" font-family="Fredoka,Poppins,sans-serif" font-weight="700" font-size="250" fill="#fff" fill-opacity=".92" text-anchor="middle">${ini}</text><text x="200" y="415" font-family="Poppins,sans-serif" font-weight="700" font-size="46" fill="#fff" text-anchor="middle">${sym}</text><text x="200" y="520" font-family="Poppins,sans-serif" font-weight="600" font-size="26" fill="#fff" text-anchor="middle" opacity=".95">${esc(label)}</text></svg>`;
 return'data:image/svg+xml;utf8,'+encodeURIComponent(svg)}
const G=[];
CATALOG.members.forEach((m,i)=>{G.push({id:'game-bday-'+m.id,type:'event',event:'bday-'+i,member:m.id,rarity:'SSR',name:'Cumpleaños de '+m.name,label:'CUMPLEAÑOS'});G.push({id:'game-bond-'+m.id,type:'idol',member:m.id,rarity:'SR',name:'Vínculo con '+m.name,label:'MI IDOL'})});
G.push({id:'game-anniv',type:'anniversary',event:'anniv',member:null,rarity:'UR',name:'Aniversario ONCE',label:'ANIVERSARIO'},{id:'game-halloween',type:'event',event:'halloween',member:null,rarity:'SSR',name:'Noche de Halloween',label:'HALLOWEEN'},
 {id:'game-xmas',type:'event',event:'xmas',member:null,rarity:'SSR',name:'Navidad ONCE',label:'NAVIDAD'},{id:'game-legend',type:'idol',member:null,rarity:'UR',name:'Mi Idol: Leyenda',label:'LEYENDA'});
// cartas exclusivas del gacha: 3 tiras de fotos de la misma miembro -> «Cápsula de <miembro>» (SSR) · 3 videoclips -> «Gran premio del gacha» (UR)
CATALOG.members.forEach(m=>G.push({id:'game-gacha-'+m.id,type:'gacha',member:m.id,rarity:'SSR',name:'Cápsula de '+m.name,label:'GACHA'}));
G.push({id:'game-gacha-mv',type:'gacha',member:null,rarity:'UR',name:'Gran premio del gacha',label:'GACHA'});
window.GAME_CARDS=G;
const MN=id=>id?CATALOG.members.find(m=>m.id===id).name:'TWICE';
G.forEach(g=>{if(!data.cards.some(c=>c.id===g.id))data.cards.push({id:g.id,ext:true,game:true,gtype:g.type,event:g.event||null,album:'GAME SPECIAL',year:'',member:MN(g.member),name:g.name,rarity:g.rarity,image_url:gameArt(g.type,g.member,g.label)})});
// regenerar la imagen por si cambió el arte; mantener el resto
data.cards.forEach(c=>{if(c.game){const g=G.find(x=>x.id===c.id);if(g){c.image_url=gameArt(g.type,g.member,g.label);c.name=g.name;c.rarity=g.rarity}}});save();
window.isGame=c=>!!(c&&c.game);
// el gacha guarda sus premios en 'twiceCapsuleStation_v1'; aquí se comprueba qué cartas exclusivas se han ganado (también las de tiradas anteriores)
window.GACHA_CARDS={NEED:3,
 counts(){const out={mv:0,byM:{}};try{const o=(JSON.parse(localStorage.getItem('twiceCapsuleStation_v1'))||{}).owned||{};for(const id in o){if(!o[id])continue;let m;if(/^m\d+$/.test(id))out.mv++;else if((m=/^k\d+_(\d+)$/.exec(id)))out.byM[+m[1]]=(out.byM[+m[1]]||0)+1}}catch(e){}return out},
 check(){if(typeof grantGame!=='function')return 0;const c=this.counts();let n=0;
  CATALOG.members.forEach((m,i)=>{if((c.byM[i]||0)>=this.NEED&&grantGame('game-gacha-'+m.id,'Tiras de '+m.name+' en el gacha'))n++});
  if(c.mv>=this.NEED&&grantGame('game-gacha-mv','Videoclips en el gacha'))n++;return n}};
// conceder una carta del juego (misiones, Mi Idol…) → entra en la colección como cualquier carta
window.grantGame=function(id,why){const c=data.cards.find(x=>x.id===id);if(!c||data.owned[id])return false;data.owned[id]=true;data.duplicates[id]=1;ECO.add('cp',CP_NEW[c.rarity],why||'Carta del juego');stat('newcards',1);stat('special',1);save();DS.toast(`Nueva carta GAME SPECIAL: ${esc(c.name)}`,'🎴');SND.sfx('r_'+c.rarity);return true};
// ---- insignia GAME SPECIAL en la cara de la carta ----
const _f=faceHTML;window.faceHTML=faceHTML=function(card,small,live){let h=_f(card,small,live);if(card&&card.game)h=h.replace('<div class="tag">','<div class="gbadge">GAME SPECIAL</div><div class="tag">');return h};
// ---- ficha de carta (modal del sistema de diseño; sustituye a la antigua) ----
function packsFor(c){return window.PACKS?PACKS.forCard(c):[]}
window.openCard=window.showDetail=showDetail=function(id){const c=data.cards.find(x=>x.id===id);if(!c)return;const st=COL.state(id),a=c.game?null:catAlbumByTitle(c.album),R=CATALOG.rarities[c.rarity],type=c.game?CARD_TYPES[c.gtype]:CARD_TYPES.photocard,own=st.owned;
 const pk=packsFor(c).slice(0,3),era=a?(a.release.v||'').slice(0,4):'';
 const body=`<div class="cd"><div class="cd-card tilt" id="cdc">${own?faceHTML(c,false,true):`<div class="pc locked"><div class="in">${window.cardBackHTML?cardBackHTML(c):backHTML(c.album)}</div></div>`}</div><div class="cd-info vstack">
  <div class="row"><span class="tag-r ${c.rarity}">${c.rarity}</span><span class="chip">${esc(R.name)} · rareza del juego</span>${c.game?'<span class="chip game">GAME SPECIAL · contenido del juego</span>':'<span class="chip off">Photocard real</span>'}</div>
  <h3 style="font-size:22px;margin:0">${esc(c.member)}</h3><div class="small">${esc(c.game?c.name:c.album)}${a?` · ${era}`:''}</div>
  <table class="kv"><tr><th>Tipo</th><td>${esc(type.n)}</td></tr>${a?`<tr><th>Álbum</th><td>${esc(a.title)}</td></tr><tr><th>Era</th><td>${era} <span class="small">(${esc(a.type)})</span></td></tr><tr><th>Versión</th><td>${catVersions(a.id).length?'según edición (ver ficha del álbum)':'sin verificar'}</td></tr>`:`<tr><th>Origen</th><td>${esc(type.desc)}</td></tr>`}
   <tr><th>Estado</th><td>${own?'<b style="color:var(--ok)">TENGO</b>':'<b class="mute">ME FALTA</b>'}${st.dupes?` · <b style="color:var(--warn)">DUPLICADA ×${st.dupes}</b> <span class="small">(→ ✨${COL.DUST_OF[c.rarity]*st.dupes} al convertir)</span>`:''}${st.trade?' · para intercambio':''}</td></tr></table>
  <p class="small">${c.game?'Esta carta solo existe dentro del juego. No es una photocard oficial ni merchandising.':REAL_FEATURES_NOTE}</p>
  <div class="row"><button class="btn sm ${st.wish?'on chip acc':''}" data-a="wish">${st.wish?'♥ En wishlist':'♡ Wishlist'}</button>${own?`<button class="btn sm" data-a="trade">${st.trade?'⇄ Quitar de intercambio':'⇄ Marcar para intercambio'}</button>`:(c.game?'':`<button class="btn sm" data-a="craft">✨ Crear (${COL.CRAFT[c.rarity]})</button>`)}</div>
  <div class="row">${a?`<button class="btn pri sm" data-go="#/binder/${a.id}">📒 Ver en cromos</button><button class="btn sm" data-go="#/collection/album/${a.id}">📚 Ver colección</button>`:`<button class="btn sm" data-go="#/collection/special">📚 Ver especiales</button>`}${pk[0]?`<button class="btn sm" data-go="#/packs/${encodeURIComponent(pk[0].id)}">🎁 Ver sobres (${pk.length}+)</button>`:''}</div></div></div>`;
 const m=DS.modal({id:'card',title:esc(c.name),cls:'lg',body});
 m.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{m._close();UI.go(b.dataset.go)});
 m.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const k=b.dataset.a;if(k==='craft')COL.craft(id);else COL[k](id);m._close();openCard(id)});
 // inclinación con el ratón (microinteracción con función: ver el brillo de la carta)
 const t=m.querySelector('#cdc');if(t){t.onmousemove=e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(900px) rotateY(${x*14}deg) rotateX(${-y*14}deg)`};t.onmouseleave=()=>t.style.transform=''}};
})();
;
