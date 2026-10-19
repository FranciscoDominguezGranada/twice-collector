/* ================= games.js ================= */
// =====================================================================================
//  JUEGOS · sección general de la app: 7 minijuegos nativos + Capsule Station (máquina 3D) integrada
//  Todos pagan en monedas reales (ECO) y cuentan para misiones y logros. Las fotos salen del PhotoHub (siempre hay foto).
// =====================================================================================
(function(){
const esc=DS.esc,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const PZ={quiz:{cat:'all',n:5,timer:0},jig:{n:3,img:'rand',m:0},slide:{n:3},mem:{p:6},who:{r:5},disco:{n:5},song:{r:5}};
// ---------- imágenes (nunca se queda sin foto) ----------
const fitC=new Map();
async function fit(url,w,h){if(!url)return null;const k=url+w+'x'+h;if(fitC.has(k))return fitC.get(k);const p=(async()=>{const s=await IC.load(url);if(!s)return null;const im=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});if(!im)return null;
  try{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),r=Math.max(w/im.width,h/im.height),sw=w/r,sh=h/r;x.drawImage(im,(im.width-sw)/2,Math.max(0,(im.height-sh)*.2),sw,sh,0,0,w,h);return c.toDataURL('image/jpeg',.85)}catch(e){return s}})();fitC.set(k,p);return p}
const ph=(mi,w,h)=>{const m=MEM[mi],svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m.c}"/><stop offset="1" stop-color="#2a1040"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="${w/2}" y="${h*.58}" font-family="Fredoka,Poppins,sans-serif" font-weight="700" font-size="${h*.5}" fill="#fff" fill-opacity=".9" text-anchor="middle">${m.n[0]}</text></svg>`;return'data:image/svg+xml;utf8,'+encodeURIComponent(svg)};
async function memberPic(mi,k,w=600,h=800){const u=PH.any(MEM[mi].n,k);return(u&&await fit(u,w,h))||ph(mi,w,h)}
async function coverPic(a,s=400){return(await fit(AlbumArt.get(a).front,s,s))||AlbumArt.get(a).front}
const albs=()=>catVisibleAlbums().filter(x=>x.physical!==false);
// ---------- recompensas ----------
function reward(n,msg,again,back){ECO.add('coins',n,'Juego: '+msg);stat('puzzles');SND.sfx('reward');
 const m=G.m;if(m){m.querySelector('.mbody').innerHTML=`<div class="gres"><div class="gbig">+${n}</div><p>🪙 monedas · ${esc(msg)}</p><div class="row" style="justify-content:center"><button class="btn pri" id="gA">Otra vez</button><button class="btn" id="gB">Volver a Juegos</button></div></div>`;m.querySelector('#gA').onclick=again;m.querySelector('#gB').onclick=()=>{m._close()}}}
const G={m:null,timers:[],audio:null,
 open(title,cls){this.close();const m=DS.modal({id:'game',title,cls:cls||'',body:'',onClose:()=>{this.timers.forEach(clearInterval);this.timers=[];if(this.audio){this.audio.pause();this.audio=null}this.m=null}});this.m=m;return m},
 close(){if(this.m)this.m._close();this.m=null},body(h){this.m.querySelector('.mbody').innerHTML=h;return this.m.querySelector('.mbody')},sub(t){const s=this.m&&this.m.querySelector('header b');if(s)s.textContent=t}};
const lose=()=>{SND.sfx('bad');if(G.m)G.m._close()};
// ---------- QUIZ ----------
function qbank(){const Q=[['¿En qué año debutó TWICE?','2015',['2014','2016','2017'],'mem'],['¿Con qué canción debutaron?','Like Ooh-Ahh',['Cheer Up','TT','Signal'],'song'],['¿Quién es la líder?','Jihyo',['Nayeon','Jeongyeon','Sana'],'mem'],['¿Quién es la más joven (maknae)?','Tzuyu',['Chaeyoung','Dahyun','Mina'],'mem'],['¿Quién es la mayor del grupo?','Nayeon',['Jeongyeon','Momo','Jihyo'],'mem'],['¿Cómo se llama su fandom?','ONCE',['BLINK','ARMY','MY'],'mem'],['¿Qué agencia gestiona a TWICE?','JYP Entertainment',['SM Entertainment','YG Entertainment','HYBE'],'mem'],['¿De dónde es Tzuyu?','Taiwán',['Japón','Corea del Sur','Tailandia'],'mem'],['¿Cuál de ellas es japonesa?','Momo',['Nayeon','Dahyun','Chaeyoung'],'mem'],['¿Cuál de ellas es japonesa?','Mina',['Jihyo','Jeongyeon','Tzuyu'],'mem'],['¿Cuál de ellas es japonesa?','Sana',['Nayeon','Dahyun','Tzuyu'],'mem'],['¿En qué programa se formó TWICE?','SIXTEEN',['Produce 101','Idol School','I-LAND'],'mem'],['¿Cuántas integrantes tiene TWICE?','9',['7','8','10'],'mem'],['¿Cómo se llama su lightstick?','Candy Bong',['Ever Bong','Ohm Bong','Lollipop Light'],'mem']];
 const songs=ALB.filter(a=>a[2]),yrs=[...new Set(ALB.map(a=>String(a[1])))];const sh=a=>a.slice().sort(()=>Math.random()-.5);
 songs.forEach(([a,y,s])=>{Q.push([`¿Cuál es la canción principal de «${a}»?`,s,sh(songs.filter(x=>x[2]!==s)).slice(0,3).map(x=>x[2]),'song']);Q.push([`¿En qué año salió «${a}»?`,String(y),sh(yrs.filter(v=>v!==String(y))).slice(0,3),'alb']);Q.push([`¿En qué álbum está «${s}»?`,a,sh(songs.filter(x=>x[0]!==a)).slice(0,3).map(x=>x[0]),'alb'])});return Q}
function quiz(){const o=PZ.quiz,q=qbank().filter(x=>o.cat==='all'||x[3]===o.cat).sort(()=>Math.random()-.5).slice(0,o.n);let n=0,ok=0;const m=G.open('Quiz de TWICE');
 const show=()=>{G.timers.forEach(clearInterval);G.timers=[];if(n>=q.length){const w=ok*(o.timer?2:1)+(ok===q.length?3:0);return w?reward(w,`${ok}/${q.length} aciertos`,quiz):lose()}
  const [txt,ans,wr]=q[n],opts=[ans,...wr].sort(()=>Math.random()-.5);let left=o.timer;
  G.body(`<div class="qq">${o.timer?'<div class="meter"><i id="tb" style="width:100%"></i></div>':''}<div class="small">Pregunta ${n+1}/${q.length} · aciertos ${ok}</div><p class="qtxt">${esc(txt)}</p><div class="qo">${opts.map(x=>`<button class="btn qb">${esc(x)}</button>`).join('')}</div></div>`);
  const done=b=>{G.timers.forEach(clearInterval);const good=b&&b.textContent===ans;if(good){ok++;SND.sfx('ok')}else SND.sfx('bad');m.querySelectorAll('.qb').forEach(x=>{x.disabled=true;if(x.textContent===ans)x.classList.add('good');else if(x===b)x.classList.add('bad')});setTimeout(()=>{n++;show()},900)};
  m.querySelectorAll('.qb').forEach(b=>b.onclick=()=>done(b));if(o.timer)G.timers.push(setInterval(()=>{left-=.1;const t=m.querySelector('#tb');if(t)t.style.width=Math.max(0,left/o.timer*100)+'%';if(left<=0)done(null)},100))};show()}
// ---------- ROMPECABEZAS ----------
async function jigsaw(){const N=PZ.jig.n,m=G.open(`Rompecabezas ${N}×${N}`);G.body('<div class="mute" style="text-align:center;padding:30px">Preparando la imagen…</div>');
 let src,name,sq=false;if(PZ.jig.img==='cover'){const a=albs()[Math.floor(Math.random()*albs().length)];src=await coverPic(a,600);name=a.title;sq=true}else{const mi=PZ.jig.img==='pick'?PZ.jig.m:Math.floor(Math.random()*9);src=await memberPic(mi,Math.floor(Math.random()*5));name=MEM[mi].n}
 if(!G.m)return;let order=[...Array(N*N).keys()];do{order.sort(()=>Math.random()-.5)}while(order.every((v,i)=>v===i));let sel=-1,t0=Date.now(),moves=0;
 G.body(`<div class="jig ${sq?'sq':''}" id="jig" style="--n:${N}"></div><div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="peek">👁 Mantén para ver la imagen</button></div>`);const jg=m.querySelector('#jig');
 const pk=m.querySelector('#peek');pk.onpointerdown=()=>jg.classList.add('peek');pk.onpointerup=pk.onpointerleave=()=>jg.classList.remove('peek');jg.style.setProperty('--img',`url("${src}")`);
 const pos=p=>`${(p%N)/(N-1)*100}% ${Math.floor(p/N)/(N-1)*100}%`;
 const draw=()=>{jg.innerHTML=order.map((p,i)=>`<button class="pcj${i===sel?' sel':''}${p===i?' ok':''}" data-i="${i}" style="background-image:url('${src}');background-size:${N*100}% ${N*100}%;background-position:${pos(p)}"></button>`).join('');
  jg.querySelectorAll('.pcj').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(sel<0){sel=i;SND.sfx('click')}else{[order[sel],order[i]]=[order[i],order[sel]];sel=-1;moves++;SND.sfx('click');if(order.every((v,k)=>v===k)){const s=Math.round((Date.now()-t0)/1000),w={3:2,4:4,5:7,6:10}[N]+(s<N*N*4?2:0);draw();return setTimeout(()=>reward(w,`${name} · ${s} s · ${moves} movimientos`,jigsaw),500)}}draw()})};draw()}
// ---------- DESLIZANTE ----------
async function slide(){const N=PZ.slide.n,m=G.open(`Puzzle deslizante ${N}×${N}`);G.body('<div class="mute" style="text-align:center;padding:30px">Preparando la imagen…</div>');const src=await memberPic(Math.floor(Math.random()*9),Math.floor(Math.random()*5),600,600);if(!G.m)return;
 let b=[...Array(N*N).keys()],e=N*N-1;const nb=p=>[p-N,p+N,(p%N)?p-1:-1,(p%N<N-1)?p+1:-1].filter(x=>x>=0&&x<N*N);for(let k=0,last=-1;k<N*N*30;k++){const c=nb(e).filter(x=>x!==last),t=c[Math.floor(Math.random()*c.length)];[b[e],b[t]]=[b[t],b[e]];last=e;e=t}
 let moves=0,t0=Date.now();G.body(`<div class="jig sq slide" id="jig" style="--n:${N}"></div>`);const jg=m.querySelector('#jig'),pos=p=>`${(p%N)/(N-1)*100}% ${Math.floor(p/N)/(N-1)*100}%`;
 const draw=()=>{jg.innerHTML=b.map((p,i)=>p===N*N-1?'<i class="hole"></i>':`<button class="pcj" data-i="${i}" style="background-image:url('${src}');background-size:${N*100}% ${N*100}%;background-position:${pos(p)}"><span>${p+1}</span></button>`).join('');
  jg.querySelectorAll('.pcj').forEach(x=>x.onclick=()=>{const i=+x.dataset.i;if(!nb(e).includes(i)){SND.sfx('bad');return}[b[e],b[i]]=[b[i],b[e]];e=i;moves++;SND.sfx('click');draw();if(b.every((v,k)=>v===k))setTimeout(()=>reward(N===3?3:7,`${moves} movimientos · ${Math.round((Date.now()-t0)/1000)} s`,slide),400)})};draw()}
// ---------- MEMORIA ----------
async function memory(){const P=PZ.mem.p,m=G.open('Memoria de photocards');G.body('<div class="mute" style="text-align:center;padding:30px">Barajando…</div>');const ids=[...Array(9).keys()].sort(()=>Math.random()-.5).slice(0,P),imgs=await Promise.all(ids.map(mi=>memberPic(mi,1,240,320)));if(!G.m)return;
 const deck=[...ids,...ids].sort(()=>Math.random()-.5);let open=[],found=0,tries=0;G.body(`<div class="small" id="ms" style="text-align:center">${P} parejas</div><div class="memg" style="--c:${P>6?6:4}">${deck.map((mi,k)=>`<button class="mc" data-m="${mi}"><i class="b">TWICE</i><img src="${imgs[ids.indexOf(mi)]}" alt=""><span>${MEM[mi].n}</span></button>`).join('')}</div>`);
 m.querySelectorAll('.mc').forEach(c=>c.onclick=()=>{if(c.classList.contains('up')||open.length>=2)return;c.classList.add('up');SND.sfx('flip');open.push(c);if(open.length===2){tries++;const[a,b2]=open;if(a.dataset.m===b2.dataset.m){found++;open=[];SND.sfx('ok');a.classList.add('ok');b2.classList.add('ok');if(found===P)setTimeout(()=>reward(P===6?3:P===8?5:8,`${tries} intentos`,memory),600)}else setTimeout(()=>{a.classList.remove('up');b2.classList.remove('up');open=[]},800);m.querySelector('#ms').textContent=`${found}/${P} parejas · ${tries} intentos`}})}
// ---------- ¿QUIÉN ES? ----------
async function who(){const R=PZ.who.r;let r=0,pts=0;const m=G.open('¿Quién es?');
 const round=async()=>{if(!G.m)return;if(r>=R)return pts?reward(pts,`${pts} monedas en ${R} rondas`,who):lose();G.body('<div class="mute" style="text-align:center;padding:30px">Cargando foto…</div>');
  const mi=Math.floor(Math.random()*9),src=await memberPic(mi,Math.floor(Math.random()*6),300,400);if(!G.m)return;const opts=[mi,...[...Array(9).keys()].filter(x=>x!==mi).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
  G.body(`<div class="small" style="text-align:center">Ronda ${r+1}/${R} · ${pts} monedas</div><div class="who"><canvas id="wc" width="300" height="400"></canvas></div><div class="qo">${opts.map(o=>`<button class="btn qb" data-m="${o}">${MEM[o].n}</button>`).join('')}</div>`);
  const im=await new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src}),cv=m.querySelector('#wc'),x=cv.getContext('2d');let lv=0;const L=[6,10,16,28,300];
  const paint=()=>{const s=L[lv],t=document.createElement('canvas');t.width=Math.max(1,Math.round(s*.75));t.height=s;t.getContext('2d').drawImage(im,0,0,t.width,t.height);x.imageSmoothingEnabled=false;x.drawImage(t,0,0,300,400)};if(im)paint();
  const tm=setInterval(()=>{if(lv<3){lv++;if(im)paint()}},1800);G.timers.push(tm);
  m.querySelectorAll('.qb').forEach(b=>b.onclick=()=>{clearInterval(tm);const good=+b.dataset.m===mi;if(good){pts+=Math.max(1,3-lv);SND.sfx('ok')}else SND.sfx('bad');lv=4;if(im)paint();m.querySelectorAll('.qb').forEach(q=>{q.disabled=true;if(+q.dataset.m===mi)q.classList.add('good');else if(q===b)q.classList.add('bad')});r++;setTimeout(round,1300)})};round()}
// ---------- ORDENA LA DISCOGRAFÍA ----------
async function disco(){const n=PZ.disco.n,m=G.open('Ordena la discografía');G.body('<div class="mute" style="text-align:center;padding:30px">Preparando álbumes…</div>');
 const pick=albs().sort(()=>Math.random()-.5).filter((v,k,arr)=>arr.findIndex(j=>j.release.v.slice(0,4)===v.release.v.slice(0,4))===k).slice(0,n),arts=await Promise.all(pick.map(a=>coverPic(a,240)));if(!G.m)return;let seq=[];
 G.body(`<p class="small" style="text-align:center">Toca los álbumes del más antiguo al más reciente</p><div class="disco">${pick.map((a,k)=>`<button class="dc" data-i="${k}"><img src="${arts[k]}" alt=""><b>${esc(a.title)}</b><em></em></button>`).join('')}</div><div class="row" style="justify-content:center"><button class="btn" id="dr">↺ Empezar de nuevo</button></div>`);
 m.querySelector('#dr').onclick=()=>{seq=[];m.querySelectorAll('.dc').forEach(d=>{d.classList.remove('on');d.querySelector('em').textContent=''})};
 m.querySelectorAll('.dc').forEach(d=>d.onclick=()=>{if(d.classList.contains('on'))return;d.classList.add('on');seq.push(+d.dataset.i);d.querySelector('em').textContent=seq.length;SND.sfx('click');if(seq.length===pick.length){const ok=seq.every((v,k)=>!k||pick[seq[k-1]].release.v<=pick[v].release.v);m.querySelectorAll('.dc').forEach(x=>x.querySelector('em').textContent+=' · '+pick[+x.dataset.i].release.v.slice(0,4));if(ok)setTimeout(()=>reward(n===5?3:6,'¡Orden perfecto!',disco),900);else{SND.sfx('bad');DS.toast('Casi: mira los años e inténtalo de nuevo','🤏')}}})}
// ---------- ADIVINA LA CANCIÓN ----------
async function song(){const R=PZ.song.r;let r=0,ok=0,coins=0;const m=G.open('Adivina la canción'),order=albs().sort(()=>Math.random()-.5);
 const round=async()=>{if(!G.m)return;if(G.audio)G.audio.pause();if(r>=R){stat('songs',ok);return coins?reward(coins,`${ok}/${R} canciones acertadas`,song):lose()}
  G.body('<div class="mute" style="text-align:center;padding:30px">Buscando una canción…</div>');let a,tr=[];for(let t=0;t<8&&!tr.length;t++){a=order[(r*2+t)%order.length];tr=(await AlbumArt.tracksFor(a.title)).filter(x=>x.p)}
  if(!G.m)return;if(!tr.length){G.body('<div class="empty" style="border:0"><div class="eico">🎵</div><p>No hay fragmentos de audio disponibles (¿sin conexión?). Inténtalo cuando tengas internet.</p></div>');return}
  const ans=tr[Math.floor(Math.random()*tr.length)],names=new Set([ans.n]);(await AlbumArt.tracksFor(a.title)).sort(()=>Math.random()-.5).forEach(x=>names.size<4&&names.add(x.n));ALB.forEach(x=>x[2]&&names.size<4&&names.add(x[2]));const opts=[...names].slice(0,4).sort(()=>Math.random()-.5);
  G.body(`<div class="gs"><div class="gs-disc spin" style="background-image:url('${AlbumArt.get(a).front}')"></div><div class="small">Ronda ${r+1}/${R} · escucha y elige · cuanto antes, más monedas</div></div><div class="qo">${opts.map(o=>`<button class="btn qb">${esc(o)}</button>`).join('')}</div>`);
  const t0=performance.now();G.audio=new Audio(ans.p);G.audio.volume=.8*(SND.cfg.mute?0:1);G.audio.play().catch(()=>{});const stop=setTimeout(()=>G.audio&&G.audio.pause(),12000);
  m.querySelectorAll('.qb').forEach(b=>b.onclick=()=>{clearTimeout(stop);const good=b.textContent===ans.n,s=(performance.now()-t0)/1000;if(good){ok++;coins+=s<4?3:s<8?2:1;SND.sfx('ok')}else SND.sfx('bad');m.querySelectorAll('.qb').forEach(q=>{q.disabled=true;if(q.textContent===ans.n)q.classList.add('good');else if(q===b)q.classList.add('bad')});r++;setTimeout(round,1600)})};round()}
// ---------- vista JUEGOS ----------
const opt=(g,k,vals)=>`<div class="opts">${vals.map(([v,l])=>`<button class="chip${PZ[g][k]==v?' on':''}" data-g="${g}" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
const RUN={quiz,jig:jigsaw,slide,mem:memory,who,disco,song};
window.GAMES={PZ,RUN,sync(){try{const d=JSON.parse(localStorage.getItem('twiceGachaV3'));if(d&&typeof d.coins==='number'){data.coins=d.coins;data.owned=Object.assign(data.owned,d.owned||{});if(d.eco){data.eco=data.eco||{};['dust','cp','gems'].forEach(k=>{if(typeof d.eco[k]==='number')data.eco[k]=d.eco[k]})}if(window.ecoHud)ecoHud();if(window.GACHA_CARDS)GACHA_CARDS.check()}}catch(e){}}};
addEventListener('message',e=>{if(e.data&&e.data.tw==='sync')GAMES.sync()});
UI.view('games',{skin:'collection',render(c,args){if(args[0]==='capsule'){setTimeout(()=>UI.go('#/gacha'),0);return}const tab='games';GAMES.sync();
 c.innerHTML=`<div class="phead"><div><h2>Juegos</h2><div class="small">Gana monedas y tickets para abrir sobres · todo cuenta para tus misiones</div></div></div>
 <div id="gbody"></div>`;c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>UI.go('#/games'+(b.dataset.t==='capsule'?'/capsule':'')));const body=c.querySelector('#gbody');
 if(tab==='capsule'){body.innerHTML=`<div class="card flat small" style="margin-bottom:10px">🎰 Mete monedas, gira la manivela y consigue álbumes, vinilos, stands de acrílico y actuaciones. Comparte monedas y colección con el resto del juego.</div><iframe class="capframe" id="capf" src="capsule.html?embed=1&app=1" title="Capsule Station" allow="autoplay; fullscreen"></iframe>`;const fr=body.querySelector('#capf'),fitF=()=>{if(!fr.isConnected)return removeEventListener('resize',fitF);const bn=document.querySelector('.bottomnav'),bh=bn&&getComputedStyle(bn).display!=='none'?bn.offsetHeight:0;fr.style.height=Math.max(430,innerHeight-fr.getBoundingClientRect().top-bh-14)+'px'};fitF();addEventListener('resize',fitF);setTimeout(fitF,300);return}
 body.innerHTML=`<div class="gridx" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">
 <div class="card gcard"><h3>🧠 Quiz de TWICE</h3><span class="small">1 🪙 por acierto (×2 con reloj) · +3 si aciertas todas</span>${opt('quiz','cat',[['all','Todo'],['alb','Álbumes'],['song','Canciones'],['mem','Integrantes']])}${opt('quiz','n',[[5,'5 preguntas'],[10,'10 preguntas']])}${opt('quiz','timer',[[0,'Sin reloj'],[12,'12 s']])}<button class="btn pri" data-go="quiz">Jugar</button></div>
 <div class="card gcard"><h3>🧩 Rompecabezas</h3><span class="small">Intercambia piezas · de 2 a 12 🪙</span>${opt('jig','n',[[3,'3×3'],[4,'4×4'],[5,'5×5'],[6,'6×6']])}${opt('jig','img',[['rand','Integrante al azar'],['pick','Elegir integrante'],['cover','Portada de álbum']])}<div class="opts" ${PZ.jig.img==='pick'?'':'hidden'}>${MEM.map((x,i)=>`<button class="chip${PZ.jig.m==i?' on':''}" data-g="jig" data-k="m" data-v="${i}">${x.n}</button>`).join('')}</div><button class="btn pri" data-go="jig">Jugar</button></div>
 <div class="card gcard"><h3>🔢 Puzzle deslizante</h3><span class="small">Mueve las piezas al hueco · 3 o 7 🪙</span>${opt('slide','n',[[3,'3×3'],[4,'4×4']])}<button class="btn pri" data-go="slide">Jugar</button></div>
 <div class="card gcard"><h3>🃏 Memoria de photocards</h3><span class="small">Encuentra las parejas · 3 a 8 🪙</span>${opt('mem','p',[[6,'6 parejas'],[8,'8 parejas'],[9,'9 parejas']])}<button class="btn pri" data-go="mem">Jugar</button></div>
 <div class="card gcard"><h3>🔍 ¿Quién es?</h3><span class="small">La foto se va aclarando · hasta 3 🪙 por ronda</span>${opt('who','r',[[5,'5 rondas'],[9,'9 rondas']])}<button class="btn pri" data-go="who">Jugar</button></div>
 <div class="card gcard"><h3>📅 Ordena la discografía</h3><span class="small">Del más antiguo al más reciente · 3 o 6 🪙</span>${opt('disco','n',[[5,'5 álbumes'],[8,'8 álbumes']])}<button class="btn pri" data-go="disco">Jugar</button></div>
 <div class="card gcard"><h3>🎵 Adivina la canción</h3><span class="small">Suena un fragmento: acierta el título · hasta 3 🪙 por ronda</span><button class="btn pri" data-go="song">Jugar</button></div>
 <div class="card gcard"><h3>🐣 Mi Idol: izquierda o derecha</h3><span class="small">El minijuego clásico está en el huevo de Mi Idol (botón de jugar).</span><button class="btn" onclick="UI.go('#/pet')">Ir a Mi Idol</button></div></div>`;
 body.querySelectorAll('.chip[data-g]').forEach(b=>b.onclick=()=>{const v=isNaN(+b.dataset.v)?b.dataset.v:+b.dataset.v;PZ[b.dataset.g][b.dataset.k]=v;SND.sfx('click');UI.keepScroll=true;UI.route()});
 body.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>RUN[b.dataset.go]())}});
})();
;
/* ================= gacha.js ================= */
// =====================================================================================
//  GACHA · seccion propia (como Mi Idol): pantalla de inicio y despues la maquina.
//  Los premios NO se guardan aqui: cada uno va a la pagina de su album (menu Colección).
// =====================================================================================
(function(){
function fit(fr){if(!fr.isConnected)return;const bn=document.querySelector('.bottomnav'),bh=bn&&getComputedStyle(bn).display!=='none'?bn.offsetHeight:0;fr.style.height=Math.max(460,innerHeight-fr.getBoundingClientRect().top-bh-14)+'px'}
const CAPK='twiceCapsuleStation_v1';
const capGet=()=>{try{return JSON.parse(localStorage.getItem(CAPK))||{}}catch(e){return{}}};
const capPut=o=>{try{localStorage.setItem(CAPK,JSON.stringify(o))}catch(e){}};
UI.view('gacha',{skin:'collection',render(c){
 if(window.GACHA_CARDS)GACHA_CARDS.check();
 const C=capGet(),own=Object.keys(C.owned||{}).length;
 c.innerHTML=`<div class="gstart"><div class="gs-card"><div class="gs-ic">🎰</div><h2>K-POP Gacha</h2><p>Gira la máquina y consigue premios reales: portadas oficiales de álbum, fotos libres de las miembros y videoclips oficiales de TWICE. Cada premio se guarda en la página de su álbum, en Colección. Con 3 tiras de la misma miembro o 3 videoclips ganas una carta exclusiva GAME SPECIAL, y los repetidos dan ✨ polvo estelar.</p>
  <div class="gs-row"><span>🪙 ${(C.coins!=null?C.coins:9).toLocaleString('es-ES')} monedas</span><span>🎁 ${own} premios</span></div>
  <button class="btn pri" id="gsGo">▶ Jugar</button> <button class="btn" id="gsAlb">📒 Ver mis premios</button>
  <p class="gs-note">Tus propias fotos de objetos reales (merch, álbumes…) pueden sustituir a cualquier premio: guárdalas en la carpeta <b>prizes</b> con el nombre del premio (mira LEEME.txt).</p></div></div>`;
 c.querySelector('#gsAlb').onclick=()=>UI.go('#/binder');
 c.querySelector('#gsGo').onclick=()=>{c.innerHTML=`<iframe class="capframe gachaframe" id="capf" src="capsule.html?embed=1&app=1" title="Gacha" allow="autoplay; fullscreen"></iframe>`;
  const fr=c.querySelector('#capf'),f=()=>{if(!fr.isConnected)return removeEventListener('resize',f);fit(fr)};f();addEventListener('resize',f);setTimeout(f,300);setTimeout(f,1200)}}});
// el premio recien salido: ir a la pagina de su album
addEventListener('message',e=>{const d=e.data;if(!d||typeof d!=='object')return;
 if(d.tw==='goalbum'){const a=d.alb&&typeof catAlbumByTitle==='function'?catAlbumByTitle(d.alb):null;UI.go(a?'#/binder/'+a.id:'#/binder')}
 if(d.tw==='closemodal'){const m=document.querySelector('.modal-bg .gachaview');if(m&&m.closest('.modal-bg')){const bg=m.closest('.modal-bg');bg.remove()}if(window.__gachaClose)window.__gachaClose()}});
// ver un premio del gacha desde la pagina de su album (se abre sobre la pagina, sin salir)
window.GACHA={open(id,onClose){const url='capsule.html?app=1&modal=1&open='+encodeURIComponent(id);
  const m=DS.modal({id:'gacha-prize',title:'Premio del gacha',cls:'lg',body:`<iframe class="capframe gachaview" src="${url}" title="Premio" allow="autoplay; fullscreen" style="height:min(76vh,640px)"></iframe>`});
  window.__gachaClose=()=>{try{m._close()}catch(e){}window.__gachaClose=null;if(onClose)onClose()}}};
})();
;
/* ================= test.js ================= */
// =====================================================================================
//  VERSION DE PRUEBA · menu "Prueba" (o abre index.html#/test). Todo es reversible con "Borrar datos" en Perfil.
// =====================================================================================
(function(){
const CAPK='twiceCapsuleStation_v1',capGet=()=>{try{return JSON.parse(localStorage.getItem(CAPK))||{}}catch(e){return{}}};
const A=[
 ['💰 +100.000 monedas','Para abrir sobres sin límite',()=>{ECO.add('coins',100000,'prueba');return'+100.000 monedas'}],
 ['💎 +500 gemas, +500 tickets, +5.000 polvo','Todas las monedas especiales',()=>{ECO.add('gems',500,'prueba');ECO.add('tickets',500,'prueba');ECO.add('dust',5000,'prueba');return'Monedas especiales añadidas'}],
 ['🃏 Desbloquear TODAS las photocards','Las añade a tu colección',()=>{let n=0;data.cards.forEach(c=>{if(!data.owned[c.id]){data.owned[c.id]=1;n++}});return n+' photocards nuevas'}],
 ['📒 Pegar todo en el álbum de cromos','Pega las cartas que tengas',()=>{const n=BINDER.stickAll();return n+' cromos pegados'}],
 ['⭐ Desbloquear TODOS los cromos especiales','Teaser, dance practice y MV de cada álbum',()=>{data.sp=data.sp||{owned:{},img:{}};data.sp.owned=data.sp.owned||{};let n=0;catVisibleAlbums().forEach(a=>SPCR.of(a).forEach(sp=>{if(!data.sp.owned[sp.id]){data.sp.owned[sp.id]=1;n++}}));return n+' cromos especiales'}],
 ['🎰 Gacha en modo prueba','1.000.000 monedas, todos los premios visibles y premio a elegir en la máquina',()=>{const C=capGet();C.test=true;C.coins=Math.max(C.coins||0,1000000);localStorage.setItem(CAPK,JSON.stringify(C));return'Gacha en modo prueba'}],
 ['🎰 Gacha: volver a modo normal','Quita el modo prueba',()=>{const C=capGet();C.test=false;localStorage.setItem(CAPK,JSON.stringify(C));return'Gacha en modo normal'}],
 ['✅ Todo a la vez','Monedas + cartas + cromos + especiales + gacha',()=>{A.slice(0,6).forEach(x=>x[2]());return'Todo desbloqueado'}]];
UI.view('test',{skin:'collection',render(c){
 c.innerHTML=`<div class="tst"><h2>🧪 Versión de prueba</h2><p>Herramientas para probar toda la web sin jugar durante horas. Los cambios se guardan en este navegador.</p><div class="tout" id="to"></div><div class="tg">${A.map((x,i)=>`<button class="tb" data-i="${i}"><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div></div>`;
 c.querySelectorAll('.tb').forEach(b=>b.onclick=()=>{let r;try{r=A[b.dataset.i][2]();save()}catch(e){r='Error: '+e.message}c.querySelector('#to').textContent=r;try{if(UI.refresh)UI.refresh()}catch(e){}})}});
if(/[?&]test\b/.test(location.search))setTimeout(()=>UI.go('#/test'),300);
})();
;
/* ================= native.js ================= */
// Puente nativo para la app Android (Capacitor): avisos de Mi Idol con la app cerrada.
// En el navegador no hace nada (pet20.js usa entonces las notificaciones web).
(function(){const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
 const LN=C.Plugins&&C.Plugins.LocalNotifications;if(!LN)return;let ok=null;
 const perm=()=>ok||(ok=LN.requestPermissions().then(r=>r.display==='granted').catch(()=>false));
 window.TWNative={
  schedule(id,title,body,at){perm().then(g=>{if(g)LN.schedule({notifications:[{id,title,body,schedule:{at:new Date(at),allowWhileIdle:true},smallIcon:'ic_stat_icon'}]}).catch(()=>{})})},
  cancel(id){try{LN.cancel({notifications:[{id}]}).catch(()=>{})}catch(e){}}};
 document.documentElement.classList.add('is-app');
})();
;
