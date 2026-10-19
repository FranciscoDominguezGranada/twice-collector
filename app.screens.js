/* ================= petsim.js ================= */
// =====================================================================================
//  MI IDOL · motor de simulación (puro: sin DOM; se prueba con node tools/test_pet.js)
//  Todo el comportamiento sale de PET_CFG (datos), no de código disperso.
// =====================================================================================
const PET_CFG={
 stepMin:10,maxDays:14,                                    // simulación en pasos de 10 min, como mucho 14 días hacia atrás
 rates:{hunger:-4,happy:-3,energyAwake:-3.5,energySleep:14,hygienePerPoop:-6,hygiene:-1.5,healthSick:-5,healthBad:-3,healthRecover:2,discipline:-.6,bondNeglectPerDay:-4},
 poopChancePerHour:.22,sickChancePerHour:.18,maxPoop:4,
 stages:[{id:'egg',name:'Huevo',next:'baby',minH:.05},{id:'baby',name:'Bebé',next:'child',minH:1},{id:'child',name:'Niña',next:'teen',minH:36},{id:'teen',name:'Trainee',next:'adult',minH:120},{id:'adult',name:'Idol',next:null,minH:Infinity}],
 // evolución: depende del cuidado, no solo del tiempo (requisitos mínimos + rama según rasgos)
 gates:{teen:{minAvg:40,maxMistakes:10},adult:{minAvg:50,minBond:20,maxMistakes:12}},
 forms:{ // formas adultas: la primera cuyo requisito se cumpla (orden = prioridad)
  legend:{name:'Leyenda',req:s=>s.bond>=95&&s.level>=15&&s.health>=80&&s.mistakes<=3,special:true},
  star:{name:'Estrella',req:s=>s.bond>=60&&s.mistakes<=4},
  dancer:{name:'Bailarina',req:s=>s.counts.train>=25},
  dreamer:{name:'Soñadora',req:s=>s.personality==='lazy'||s.counts.sleepOK>=12},
  rebel:{name:'Rebelde',req:s=>s.discipline<35},
  idol:{name:'Idol',req:()=>true}},
 personalities:{
  energetic:  {name:'Enérgica',  hunger:1.15,happy:1.2, energy:1.25,sleep:.9, play:1.5,bond:1,  callChance:1.4},
  playful:    {name:'Juguetona', hunger:1,   happy:1.35,energy:1.05,sleep:1,  play:1.6,bond:1.05,callChance:1.3},
  calm:       {name:'Tranquila', hunger:.9,  happy:.75, energy:.9,  sleep:1,  play:.8,bond:1,   callChance:.6},
  lazy:       {name:'Perezosa',  hunger:1,   happy:.9,  energy:1.2, sleep:1.4,play:.7,bond:1,   callChance:.8},
  clingy:     {name:'Mimosa',    hunger:1,   happy:1.4, energy:1,   sleep:1,  play:1.1,bond:1.35,callChance:1.6},
  independent:{name:'Independiente',hunger:.95,happy:.65,energy:.95,sleep:1, play:.9,bond:.8,  callChance:.5}},
 bondUnlocks:[[10,'Frases nuevas'],[25,'Habitación: escenario'],[40,'Outfit: chaqueta de ensayo'],[60,'Saludo especial'],[80,'Outfit: vestido de gala'],[100,'Vínculo máximo']],
 xpPerLevel:l=>60+l*40};
const PET_ACTIONS={ // efectos de cada acción (configurables)
 meal:{hunger:38,weight:1,happy:2,xp:4,bond:1,name:'Comida'},snack:{hunger:12,happy:12,weight:2,health:-2,xp:3,bond:1,name:'Dulce'},
 play:{happy:22,energy:-8,hunger:-4,weight:-1,xp:12,bond:3,name:'Jugar'},train:{energy:-12,hunger:-7,happy:4,xp:22,bond:2,discipline:3,name:'Ensayar'},
 clean:{hygiene:100,happy:3,xp:3,bond:1,name:'Limpiar'},medicine:{health:25,happy:-6,xp:2,name:'Medicina'},
 talk:{happy:8,xp:3,bond:4,name:'Hablar'},praise:{discipline:12,happy:4,bond:2,name:'Elogiar'},scold:{discipline:15,happy:-8,bond:-1,name:'Regañar'},
 gift:{happy:25,bond:8,xp:6,name:'Regalo'}};
const clamp100=v=>Math.max(0,Math.min(100,v));
function petRng(t){let x=(Math.floor(t/60000)*2654435761)>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}
function newPet(member,personality,now){return{v:2,member,personality,born:now,last:now,lastSeen:now,age:0,stage:'egg',form:null,hunger:70,happy:70,energy:80,health:100,hygiene:100,discipline:50,weight:10,
 poop:0,sick:false,asleep:false,forceAwake:false,lightsOff:false,bond:0,xp:0,level:1,mistakes:0,crit:{},avg:{n:0,sum:0},counts:{feed:0,play:0,train:0,clean:0,talk:0,sleepOK:0},
 bed:23,wake:8,callUntil:0,callType:null,events:[],mood:'ok'}}
function inSleepWindow(p,t){const h=new Date(t).getHours()+new Date(t).getMinutes()/60;return p.bed>p.wake?(h>=p.bed||h<p.wake):(h>=p.bed&&h<p.wake)}
function petLog(p,t,type,txt){p.events.push({t,type,txt});if(p.events.length>40)p.events.splice(0,p.events.length-40)}
function careScore(p){return(p.hunger+p.happy+p.health+p.hygiene+p.energy)/5}
// ---- simulateElapsedTime: avanza el estado desde p.last hasta now ----
function simulateElapsedTime(p,now){if(!p||p.stage==='egg'&&now<p.last)return p;const C=PET_CFG,P=C.personalities[p.personality]||C.personalities.calm,step=C.stepMin*60000;
 let t=p.last;const end=Math.min(now,p.last+C.maxDays*864e5);if(end<now)p.last=now-C.maxDays*864e5,t=p.last;
 while(t+step<=end){t+=step;const h=step/36e5;p.age+=h;
  // horario: dormir/despertar según rutina (la personalidad perezosa duerme más)
  const sleepTime=inSleepWindow(p,t)||(P.sleep>1.2&&p.energy<20);
  if(sleepTime&&!p.asleep&&!p.forceAwake&&p.stage!=='egg'){p.asleep=true;if(p.lightsOff||p.energy<70)p.counts.sleepOK++;petLog(p,t,'sleep','Se ha dormido')}
  if(!sleepTime&&p.asleep&&p.energy>=40){p.asleep=false;p.forceAwake=false;p.lightsOff=false;petLog(p,t,'wake','Se ha despertado')}
  if(!sleepTime)p.forceAwake=false;
  if(p.stage==='egg'){if(p.age>=C.stages[0].minH)evolve(p,t);continue}
  const R=C.rates,sl=p.asleep;
  p.hunger=clamp100(p.hunger+R.hunger*P.hunger*h*(sl?.4:1));p.happy=clamp100(p.happy+R.happy*P.happy*h*(sl?.3:1)*(p.hunger<25?1.6:1));
  p.energy=clamp100(p.energy+(sl?R.energySleep*(p.lightsOff?1.2:.8):R.energyAwake*P.energy)*h);
  p.hygiene=clamp100(p.hygiene+(R.hygiene+R.hygienePerPoop*p.poop)*h);p.discipline=clamp100(p.discipline+R.discipline*h);
  const r=petRng(t);
  if(!sl&&p.hunger>15&&p.poop<C.maxPoop&&r<C.poopChancePerHour*h){p.poop++;petLog(p,t,'poop','Ha hecho caca')}
  if(!p.sick&&(p.hygiene<25||p.hunger<10||p.poop>=3)&&petRng(t+7)<C.sickChancePerHour*h){p.sick=true;petLog(p,t,'sick','Se ha puesto enferma')}
  if(p.sick)p.health=clamp100(p.health+R.healthSick*h);else if(p.hunger<10||p.hygiene<15||p.happy<5)p.health=clamp100(p.health+R.healthBad*h);else if(p.hunger>50&&p.hygiene>50)p.health=clamp100(p.health+R.healthRecover*h);
  // errores de cuidado: necesidad crítica sin atender durante 2 h (una vez por incidente)
  [['hunger',p.hunger<10],['happy',p.happy<10],['poop',p.poop>=3],['sick',p.sick],['energy',!sl&&p.energy<5]].forEach(([k,bad])=>{if(bad){p.crit[k]=(p.crit[k]||0)+1;if(p.crit[k]===Math.round(2/h)){p.mistakes++;petLog(p,t,'mistake','Necesidad desatendida: '+k)}}else p.crit[k]=0});
  // llamadas de atención (quiere jugar) según personalidad
  if(!sl&&!p.callType&&petRng(t+13)<.05*P.callChance*h*(p.happy<60?2:1)){p.callType='play';p.callUntil=t+36e5;petLog(p,t,'call','Quiere jugar contigo')}
  if(p.callType&&t>p.callUntil){p.callType=null;p.discipline=clamp100(p.discipline-2)}
  // vínculo: baja si pasa más de un día sin verte
  if(t-p.lastSeen>864e5)p.bond=Math.max(0,p.bond+R.bondNeglectPerDay*h/24);
  p.avg.n++;p.avg.sum+=careScore(p);
  const st=C.stages.find(s=>s.id===p.stage);if(st&&st.next&&p.age>=st.minH)evolve(p,t);
  if(p.stage==='adult'&&p.form!=='legend'&&C.forms.legend.req(p)){p.form='legend';petLog(p,t,'evolve','¡Evolución especial: Leyenda!')}}
 p.last=Math.max(p.last,t);p.mood=moodOf(p);return p}
function evolve(p,t){const C=PET_CFG,st=C.stages.find(s=>s.id===p.stage),next=st&&st.next;if(!next)return;const g=C.gates[next]||{},avg=p.avg.n?p.avg.sum/p.avg.n:60;
 if(g.minAvg&&avg<g.minAvg)return;if(g.maxMistakes!=null&&p.mistakes>g.maxMistakes)return;if(g.minBond&&p.bond<g.minBond)return;
 p.stage=next;p.avg={n:0,sum:0};if(next==='adult')p.form=Object.entries(C.forms).find(([k,f])=>!f.special&&f.req(p))[0];
 petLog(p,t,'evolve',`Ha crecido: ${C.stages.find(s=>s.id===next).name}${p.form?' · '+C.forms[p.form].name:''}`)}
function moodOf(p){if(p.stage==='egg')return'egg';if(p.asleep)return'sleep';if(p.sick)return'sick';if(p.hunger<20)return'hungry';if(p.poop>=2)return'dirty';if(p.energy<15)return'tired';if(p.callType)return'call';if(p.happy>75)return'happy';if(p.happy<30)return'sad';return'ok'}
// ---- acciones del usuario (devuelven mensaje y recompensa; no se pueden repetir para farmear) ----
function petAct(p,k,now){simulateElapsedTime(p,now);const A=PET_ACTIONS[k],P=PET_CFG.personalities[p.personality]||PET_CFG.personalities.calm;if(!A&&k!=='lights')return{ok:false,msg:'Acción desconocida'};
 if(p.stage==='egg')return{ok:false,msg:'Todavía es un huevo…'};
 if(k==='lights'){p.lightsOff=!p.lightsOff;if(p.lightsOff&&!inSleepWindow(p,now)&&p.energy<60){p.asleep=true}if(!p.lightsOff&&p.asleep){p.asleep=false;p.forceAwake=true;p.happy=clamp100(p.happy-5)}return{ok:true,msg:p.lightsOff?'Luces apagadas':'Luces encendidas'}}
 if(p.asleep)return{ok:false,msg:'Está durmiendo. Enciende la luz para despertarla.'};
 if(k==='meal'&&p.hunger>=95)return{ok:false,msg:'¡Ya está llena!'};if(k==='snack'&&p.happy>=98)return{ok:false,msg:'No le apetece'};
 if((k==='play'||k==='train')&&p.energy<12)return{ok:false,msg:'Está demasiado cansada'};if(k==='medicine'&&!p.sick)return{ok:false,msg:'No está enferma'};
 if(k==='clean'&&p.poop===0&&p.hygiene>90)return{ok:false,msg:'Ya está todo limpio'};
 if((k==='praise'||k==='scold')&&!p.callType&&p.discipline>80)return{ok:false,msg:'No hace falta ahora'};
 ['hunger','happy','energy','hygiene','health','discipline'].forEach(s=>{if(A[s])p[s]=clamp100(p[s]+A[s]*(s==='happy'&&k==='play'?P.play:1))});if(A.weight)p.weight=Math.max(5,p.weight+A.weight);
 if(k==='clean')p.poop=0;if(k==='medicine'&&p.health>=40)p.sick=false;
 if(p.callType&&(k==='play'||k==='talk'||k==='praise')){p.callType=null;p.discipline=clamp100(p.discipline+5)}
 const c={meal:'feed',snack:'feed',play:'play',train:'train',clean:'clean',talk:'talk'}[k];if(c)p.counts[c]++;
 const bondG=(A.bond||0)*P.bond;p.bond=Math.max(0,Math.min(100,p.bond+bondG));p.xp+=A.xp||0;let lv=0;while(p.xp>=PET_CFG.xpPerLevel(p.level)){p.xp-=PET_CFG.xpPerLevel(p.level);p.level++;lv++}
 p.lastSeen=now;p.mood=moodOf(p);return{ok:true,msg:A.name,levelUps:lv,bond:bondG}}
// ---- previsión: qué va a necesitar y cuándo (para notificaciones sin despertar el móvil) ----
function petForecast(p,now,hours=24){const q=JSON.parse(JSON.stringify(p)),out=[];let t=now;const seen={};
 for(let i=0;i<hours*6;i++){t+=PET_CFG.stepMin*60000;simulateElapsedTime(q,t);const add=(k,pr,txt)=>{if(!seen[k]){seen[k]=1;out.push({t,k,pr,txt})}};
  if(q.hunger<25&&!q.asleep)add('hunger',3,'Tu idol tiene hambre.');if(q.sick)add('sick',5,'Tu idol necesita cuidados.');if(q.poop>=2)add('poop',2,'Hay que limpiar a tu idol.');
  if(!q.asleep&&q.energy<15)add('tired',2,'Tu idol está cansada.');if(q.callType)add('play',1,'Tu idol quiere jugar contigo.');if(i&&!q.asleep&&p.asleep)add('wake',1,'Tu idol se ha despertado.');
  if(q.stage!==p.stage||q.form!==p.form)add('evolve',4,'¡Tu idol ha evolucionado!')}
 if(now-p.lastSeen>18*36e5||true)out.push({t:Math.max(now+6*36e5,p.lastSeen+24*36e5),k:'miss',pr:1,txt:'Tu idol te echa de menos.'});return out.sort((a,b)=>a.t-b.t)}
if(typeof module!=='undefined')module.exports={PET_CFG,PET_ACTIONS,newPet,simulateElapsedTime,petAct,petForecast,moodOf,inSleepWindow,careScore};
;
/* ================= pet20.js ================= */
// =====================================================================================
//  MI IDOL · dispositivo tipo huevo virtual (estética propia inspirada en las mascotas de bolsillo)
// =====================================================================================
(function(){
const KEY='twicePet2',NK='twicePetNotif';
const get=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}},put=p=>localStorage.setItem(KEY,JSON.stringify(p));
window.PET={get};
// migración desde la mascota simple de la v19 (se conserva la idol elegida)
(()=>{if(get())return;try{const o=JSON.parse(localStorage.getItem('twicePet'));if(o&&o.member){const ks=Object.keys(PET_CFG.personalities);put(newPet(o.member,ks[Math.floor(Math.random()*ks.length)],Date.now()))}}catch(e){}})();
const MEMC=id=>{const m=CATALOG.members.find(x=>x.id===id);return MASCOT.color(m.name)};
// ---------- sprite en pixel art generado (24×24) ----------
function drawSprite0(cv,p,frame){const x=cv.getContext('2d'),N=24;x.clearRect(0,0,N,N);const ink='#2b2a33',col=MEMC(p.member),px=(a,b,c)=>{if(a>=0&&b>=0&&a<N&&b<N){x.fillStyle=c;x.fillRect(a|0,b|0,1,1)}};
 const disc=(cx,cy,r,c,ry=r)=>{for(let j=-ry;j<=ry;j++)for(let i=-r;i<=r;i++)if(i*i/(r*r)+j*j/(ry*ry)<=1.05)px(cx+i,cy+j,c)},ring=(cx,cy,r,c,ry=r)=>{for(let a=0;a<64;a++){const t=a/64*Math.PI*2;px(Math.round(cx+Math.cos(t)*r),Math.round(cy+Math.sin(t)*ry),c)}};
 const b=frame%2?0:1,st=p.stage,m=p.mood;
 if(st==='egg'){disc(12,13+b,6,'#fff',8);ring(12,13+b,6,ink,8);px(10,10+b,ink);px(14,15+b,ink);px(12,12+b,col);px(11,16+b,col);return}
 const S={baby:{hy:14,hr:6,body:0},child:{hy:11,hr:6,body:4},teen:{hy:9,hr:5,body:7},adult:{hy:8,hr:5,body:9}}[st]||{hy:12,hr:6,body:3};const hy=S.hy+b;
 if(S.body){disc(12,hy+S.hr+S.body/2+1,4+(st==='adult'?1:0),col,Math.ceil(S.body/2));ring(12,hy+S.hr+S.body/2+1,4+(st==='adult'?1:0),ink,Math.ceil(S.body/2));const fy=hy+S.hr+S.body+1;px(10,fy,ink);px(14,fy,ink);px(10,fy-1,ink);px(14,fy-1,ink);
  const arm=m==='happy'||m==='call'?-2:1;px(7,hy+S.hr+2+arm,ink);px(17,hy+S.hr+2+arm,ink)}
 disc(12,hy,S.hr,'#fff');ring(12,hy,S.hr,ink);
 if(st!=='baby'){for(let i=-S.hr;i<=S.hr;i++)px(12+i,hy-S.hr+(Math.abs(i)>S.hr-2?1:0),ink);for(let i=-S.hr+1;i<=S.hr-1;i++)px(12+i,hy-S.hr+1,ink);if(st==='adult'||st==='teen'){for(let k=0;k<5;k++){px(12-S.hr,hy-2+k,ink);px(12+S.hr,hy-2+k,ink)}}}
 const ey=hy;if(m==='sleep'){px(9,ey,ink);px(10,ey,ink);px(14,ey,ink);px(15,ey,ink)}else if(m==='happy'){px(9,ey,ink);px(10,ey-1,ink);px(11,ey,ink);px(13,ey,ink);px(14,ey-1,ink);px(15,ey,ink)}else if(m==='sick'){px(9,ey-1,ink);px(10,ey,ink);px(11,ey-1,ink);px(13,ey-1,ink);px(14,ey,ink);px(15,ey-1,ink)}else{px(10,ey,ink);px(10,ey-1,ink);px(14,ey,ink);px(14,ey-1,ink)}
 if(m==='sad'||m==='hungry'||m==='sick'){px(11,ey+3,ink);px(12,ey+2,ink);px(13,ey+3,ink)}else{px(11,ey+2,ink);px(12,ey+3,ink);px(13,ey+2,ink)}
 px(8,ey+2,'#ff9cb8');px(16,ey+2,'#ff9cb8');
 const f=p.form;if(f==='legend'||f==='star'){[[10,-2],[12,-3],[14,-2],[11,-2],[13,-2]].forEach(([a,o])=>px(a,hy-S.hr+o,'#ffc23d'))}
 if(f==='dancer')[[15,0],[16,-1],[16,1],[17,0]].forEach(([a,o])=>px(a,hy-S.hr+1+o,col));if(f==='dreamer')[[13,-2],[14,-3],[15,-3],[16,-2]].forEach(([a,o])=>px(a,hy-S.hr+o,'#7a8bff'));
 if(f==='rebel')for(let i=-4;i<=5;i++)px(12+i,hy-S.hr,'#d33');if(f==='idol'){px(17,hy+S.hr+1,ink);px(17,hy+S.hr,ink);px(18,hy+S.hr-1,'#999')}
 if(p.poop)for(let k=0;k<p.poop;k++){const ox=2+k*3;px(ox,21,ink);px(ox+1,21,ink);px(ox,20,ink);px(ox+1,19,ink)}
 if(m==='sleep')[[19,4],[20,4],[21,4],[20,5],[19,6],[20,6],[21,6]].forEach(([a,c])=>px(a,c-(frame%2),ink));if(p.sick)[[20,2],[21,2],[20,3],[21,3],[19,3],[22,3]].forEach(([a,c])=>px(a,c,'#d33'))}

// ---------- armario: accesorios por vínculo y por evento (contenido del juego) ----------
const evOn=id=>activeEvents().some(e=>e.id===id||e.id.startsWith(id)),bdayOn=p=>activeEvents().some(e=>e.member!=null&&CATALOG.members[e.member].id===p.member);
// premios del gacha que se llevan puestos: cuentan los que tienes guardados en la máquina (merch · tiras de fotos · videoclips)
const _gc={t:0,v:{merch:0,photo:0,mv:0}};
function gachaOwn(k){const n=Date.now();if(n-_gc.t>3000){_gc.t=n;const v={merch:0,photo:0,mv:0};try{const o=(JSON.parse(localStorage.getItem('twiceCapsuleStation_v1'))||{}).owned||{};for(const id in o){if(!o[id])continue;if(/^g\d+$/.test(id))v.merch++;else if(/^k\d+_\d+$/.test(id))v.photo++;else if(/^m\d+$/.test(id))v.mv++}}catch(e){}_gc.v=v}return _gc.v[k]||0}
const OUTFITS=[['none','Sin accesorio',()=>true,'—'],['lightstick','Palo luminoso',()=>gachaOwn('merch')>=1,'Gacha: 1 merch'],['headset','Auriculares',()=>gachaOwn('photo')>=3,'Gacha: 3 tiras de fotos'],['cap','Gorra de directo',()=>gachaOwn('mv')>=1,'Gacha: 1 videoclip'],['jacket','Chaqueta de ensayo',p=>p.bond>=40,'Vínculo 40'],['gala','Vestido de gala',p=>p.bond>=80,'Vínculo 80'],['party','Gorro de aniversario',()=>evOn('anniv'),'Evento: aniversario'],['witch','Sombrero de bruja',()=>evOn('halloween'),'Evento: Halloween'],['santa','Gorro navideño',()=>evOn('xmas'),'Evento: Navidad'],['cake','Tarta de cumpleaños',bdayOn,'Evento: su cumpleaños']];
function drawOutfit(cv,p,frame){const o=OUTFITS.find(x=>x[0]===p.outfit);if(!o||o[0]==='none'||!o[2](p)||p.stage==='egg')return;const x=cv.getContext('2d'),b=frame%2?0:1,st=p.stage,S={baby:{hy:14,hr:6},child:{hy:11,hr:6},teen:{hy:9,hr:5},adult:{hy:8,hr:5}}[st]||{hy:12,hr:6},hy=S.hy+b,top=hy-S.hr,px=(a,c,col)=>{x.fillStyle=col;x.fillRect(a|0,c|0,1,1)};
 const tri=(rows,col,y0)=>rows.forEach((w,i)=>{for(let k=-w;k<=w;k++)px(12+k,y0-rows.length+i+1,col)});
 if(o[0]==='party'){tri([0,1,2,2],'#ff5fa2',top+1);px(12,top-3,'#ffd23f');[11,13].forEach(a=>px(a,top-1,'#fff'))}
 else if(o[0]==='witch'){tri([0,1,1,2],'#3b1d6b',top);for(let k=-6;k<=6;k++)px(12+k,top,'#2a1040');px(12,top-1,'#ffd23f')}
 else if(o[0]==='santa'){tri([1,2,3],'#e0243a',top+1);for(let k=-4;k<=4;k++)px(12+k,top+1,'#fff');px(12,top-3,'#fff');px(13,top-3,'#fff')}
 else if(o[0]==='cake'){const y=20;for(let k=0;k<5;k++){px(18+k,y,'#fcc89b');px(18+k,y+1,'#ff8cc0')}px(20,y-1,'#fff');px(20,y-2,'#ffd23f')}
 else if(o[0]==='jacket'&&S.hy>9){const y=hy+S.hr+1;for(let k=-3;k<=3;k++)px(12+k,y,'#2b2a33');px(8,y+1,'#2b2a33');px(16,y+1,'#2b2a33');px(12,y+1,'#fff')}
 else if(o[0]==='gala'){const y=hy+S.hr+1;[11,12,13].forEach(a=>px(a,y,'#ffc23d'));px(10,y-1,'#ffc23d');px(14,y-1,'#ffc23d');[[3,3],[20,5],[4,17],[21,14]].forEach(([a,c])=>px(a,c-(frame%2),'#ffe9a0'))}}
function drawSprite(cv,p,frame){if(cv.width!==168){cv.width=168;cv.height=181}const mem=CATALOG.members.find(m=>m.id===p.member),o=OUTFITS.find(x=>x[0]===p.outfit),ok=o&&o[0]!=='none'&&o[2](p);
 idol8(cv,p,frame,ok?o[0]:null)}
// ---- PERSONAJE NUEVO (v27): mini idol en pixel art de 8 bits, dibujada píxel a píxel (diseño propio del juego) ----
//  Cada integrante tiene su peinado y su color de vestuario. Crece por etapas (huevo → bebé → niña → trainee → idol) y cambia de cara según su estado.
const HAIRC=['#3a2a2e','#c9a36b','#f0d9a8','#6b3f3a','#4a2f25','#2a2228','#efe6da','#8a4b3c','#33262b'];
function idol8(cv,p,frame,outfit){const x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,cv.width,cv.height);
 const s=5,ox=4,oy=8,R=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(ox+Math.round(a)*s,oy+Math.round(b)*s,w*s,h*s)};
 const mi=Math.max(0,CATALOG.members.findIndex(m=>m.id===p.member)),col=MEMC(p.member),ink='#2a1c22',skin='#ffe0c8',sk2='#f3c4a6',hair=HAIRC[mi%9],cx=16,m=p.mood,st=p.stage,f=frame%2;
 // suelo
 R(6,32,20,1,'#00000022');
 if(p.poop)for(let k=0;k<Math.min(3,p.poop);k++){const a=1+k*4;R(a,31,3,1,'#6b4a2a');R(a+1,30,2,1,'#6b4a2a');R(a+1,29,1,1,'#6b4a2a')}
 if(st==='egg'){const t=12+f;R(11,t,10,1,ink);R(9,t+1,14,2,ink);R(8,t+3,16,12,ink);R(9,t+15,14,2,ink);R(11,t+17,10,1,ink);
  R(11,t+1,10,2,'#fff8ee');R(9,t+3,14,12,'#fff8ee');R(10,t+15,12,2,'#fff8ee');R(11,t+5,3,3,col);R(18,t+9,3,3,col);R(13,t+12,2,2,col);R(17,t+4,2,2,'#ffd23f');return}
 const T={baby:{hw:14,hh:12,by:3,lg:0},child:{hw:14,hh:12,by:6,lg:2},teen:{hw:12,hh:11,by:8,lg:3},adult:{hw:12,hh:11,by:10,lg:3}}[st]||{hw:14,hh:12,by:5,lg:2};
 const joy=m==='happy'||m==='call',top=32-(T.hh+T.by+T.lg)-(joy?f*2:f),L=cx-T.hw/2,Rg=cx+T.hw/2,by0=top+T.hh,dress=outfit==='gala'?'#ffc23d':outfit==='jacket'?'#2b2a33':col;
 // pelo por detrás (melenas largas)
 const longs={0:T.hh+2,5:T.hh+3,8:T.hh+T.by}[mi];if(longs){for(let k=0;k<longs;k++){const w=mi===5?(k%2):0;R(L-1+w,top+2+k,2,1,hair);R(Rg-1-w,top+2+k,2,1,hair)}}
 // cuerpo
 const bx=cx-4;R(bx,by0,8,T.by,dress);R(bx-1,by0+T.by-2,10,2,dress);R(bx,by0+T.by-1,8,1,'#00000033');R(cx-1,by0,2,1,'#fff');R(cx-1,by0+1,2,1,'#ffd23f');
 if(T.lg){R(cx-3,by0+T.by,2,T.lg,skin);R(cx+1,by0+T.by,2,T.lg,skin);R(cx-4,by0+T.by+T.lg-1,3,1,ink);R(cx+1,by0+T.by+T.lg-1,3,1,ink)}
 if(joy){R(bx-2,by0-2+f,2,3,skin);R(bx+8,by0-2+f,2,3,skin)}else{R(bx-2,by0+1,2,3,skin);R(bx+8,by0+1,2,3,skin)}
 if(st==='adult'){const my=joy?by0-5+f:by0-1;R(bx+9,my+2,1,3,'#9a9a9a');R(bx+8,my,3,2,ink);R(bx+8,my,1,1,'#fff')}
 // cabeza
 R(L+1,top-1,T.hw-2,1,ink);R(L,top,T.hw,T.hh,ink);R(L-1,top+2,T.hw+2,T.hh-4,ink);R(L+1,top+T.hh,T.hw-2,1,ink);
 R(L+1,top,T.hw-2,T.hh,m==='sick'?'#e8eedc':skin);R(L,top+2,T.hw,T.hh-4,m==='sick'?'#e8eedc':skin);R(L+2,top+T.hh-1,T.hw-4,1,sk2);
 // flequillo y peinado
 R(L,top-1,T.hw,4,hair);R(L-1,top+1,2,3,hair);R(Rg-1,top+1,2,3,hair);R(L+1,top+3,3,2,hair);R(Rg-4,top+3,3,2,hair);R(cx-1,top+3,2,1,hair);R(L+2,top-2,T.hw-4,1,hair);
 if(mi===1){R(L-1,top+3,2,T.hh-4,hair);R(Rg-1,top+3,2,T.hh-4,hair)}
 if(mi===2){R(L-4,top+2,3,7,hair);R(Rg+1,top+2,3,7,hair);R(L-1,top+3,1,2,col);R(Rg,top+3,1,2,col)}
 if(mi===3){R(Rg,top,4,3,hair);R(Rg+2,top+3,2,7,hair);R(Rg,top+1,1,2,col)}
 if(mi===4){R(cx+2,top-5,4,3,hair);R(cx+5,top-3,2,8,hair);R(cx+2,top-3,2,1,col)}
 if(mi===6){R(L,top-5,4,4,hair);R(Rg-4,top-5,4,4,hair);R(L+1,top-2,2,1,col);R(Rg-3,top-2,2,1,col)}
 if(mi===7){R(cx,top-4,1,2,hair);R(cx+1,top-5,1,1,hair);R(L-1,top+3,1,3,hair);R(Rg,top+3,1,3,hair)}
 if(mi===8)R(cx,top-1,1,3,'#00000030');
 // cara
 const ey=top+Math.round(T.hh*.52),e1=cx-5,e2=cx+2;
 const eye=e=>{if(m==='sleep'||p.asleep){R(e,ey+1,3,1,ink)}else if(joy){R(e,ey+1,1,1,ink);R(e+1,ey,1,1,ink);R(e+2,ey+1,1,1,ink)}else if(m==='sick'){R(e,ey,1,1,ink);R(e+2,ey,1,1,ink);R(e+1,ey+1,1,1,ink);R(e,ey+2,1,1,ink);R(e+2,ey+2,1,1,ink)}else{R(e,ey,2,3,ink);R(e,ey,1,1,'#fff');if(frame%8===7)R(e,ey,2,2,skin)}};eye(e1);eye(e2);
 R(L+1,ey+3,2,1,'#ff9cb8');R(Rg-3,ey+3,2,1,'#ff9cb8');
 if(joy){R(cx-1,ey+4,2,1,ink);R(cx-1,ey+5,2,1,'#e0607a')}else if(m==='sad'||m==='hungry'||m==='sick'||m==='dirty'){R(cx-2,ey+5,1,1,ink);R(cx-1,ey+4,2,1,ink);R(cx+1,ey+5,1,1,ink)}else if(m==='sleep'||p.asleep){R(cx,ey+4,1,1,ink)}else R(cx-1,ey+4,2,1,ink);
 if(m==='hungry'){R(Rg+1,top+2,1,1,'#9ad8ff');R(Rg+1,top+3,2,2,'#9ad8ff')}
 if(p.sick){R(cx-3,top+1,6,2,'#9ad8ff');R(cx-3,top+1,6,1,'#fff')}
 if(m==='sleep'||p.asleep){const zy=top-4-f;R(Rg+2,zy,3,1,'#fff');R(Rg+3,zy+1,1,1,'#fff');R(Rg+2,zy+2,3,1,'#fff');R(Rg+5,zy-4,2,1,'#fff');R(Rg+5,zy-3,1,1,'#fff');R(Rg+5,zy-2,2,1,'#fff')}
 // corona de las formas especiales y accesorios de evento
 if(p.form==='legend'||p.form==='star'){R(cx-3,top-3,7,1,'#ffc23d');R(cx-3,top-4,1,1,'#ffc23d');R(cx,top-5,1,2,'#ffc23d');R(cx+3,top-4,1,1,'#ffc23d')}
 const hat=(c,c2)=>{R(cx-4,top-2,8,1,c2);R(cx-3,top-3,6,1,c);R(cx-2,top-5,4,2,c);R(cx-1,top-7,2,2,c);R(cx-1,top-8,2,1,c2)};
 if(outfit==='party')hat('#d9a441','#fff');if(outfit==='witch')hat('#3b1d6b','#ffd23f');if(outfit==='santa')hat('#e0243a','#fff');
 if(outfit==='lightstick'){const y=by0+(joy?-2:0)-f;R(Rg+1,y,1,6,'#d9dde3');R(Rg,y-3,3,3,col);R(Rg+1,y-2,1,1,'#fff');R(Rg-1,y-1,1,1,col+'88');R(Rg+3,y-1,1,1,col+'88')}
 if(outfit==='headset'){R(L,top-1,T.hw,1,'#2d2d38');R(L-1,top,1,6,'#2d2d38');R(Rg,top,1,6,'#2d2d38');R(L-2,top+2,2,5,col);R(Rg+1,top+2,2,5,col)}
 if(outfit==='cap'){R(cx-5,top-3,10,2,'#1d3b8a');R(cx-4,top-4,8,1,'#1d3b8a');R(cx+1,top-1,7,1,'#14285f');R(cx-1,top-3,2,1,'#ffd23f')}
 if(outfit==='cake'){R(24,28,6,3,'#f6e3a8');R(24,28,6,1,'#ff8cc0');R(26,26,1,2,'#fff');R(26,25,1,1,'#ffd23f')}
 if(joy&&frame%2){R(3,top+2,1,1,'#ffd23f');R(27,top+6,1,1,'#ffd23f');R(5,top+9,1,1,'#fff')}}
window.idol8=idol8;
// ---- estética de 8 bits: la mascota del juego se rasteriza a 42×45 «píxeles gordos», se reduce a una paleta corta y se amplía sin suavizado ----
const PXW=42,PXH=45,_pxc=new Map(),_off=document.createElement('canvas');_off.width=PXW;_off.height=PXH;
function pix8(cv,sv){const draw=im=>{const o=_off.getContext('2d',{willReadFrequently:true});o.clearRect(0,0,PXW,PXH);o.imageSmoothingEnabled=true;o.drawImage(im,0,0,PXW,PXH);
  try{const d=o.getImageData(0,0,PXW,PXH),a=d.data;for(let i=0;i<a.length;i+=4){a[i+3]=a[i+3]>110?255:0;a[i]=Math.round(a[i]/51)*51;a[i+1]=Math.round(a[i+1]/51)*51;a[i+2]=Math.round(a[i+2]/51)*51}o.putImageData(d,0,0)}catch(e){}
  const x=cv.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,cv.width,cv.height);x.drawImage(_off,0,0,cv.width,cv.height)};
 cv.__mk=sv;const c=_pxc.get(sv);if(c&&c.complete&&c.naturalWidth)return draw(c);
 const im=new Image();im.onload=()=>{_pxc.set(sv,im);if(_pxc.size>60)_pxc.delete(_pxc.keys().next().value);if(cv.__mk===sv)draw(im)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(sv)}
// ---------- pantalla ----------
const ICONS=[['food','🍙','Comer'],['light','💡','Luz'],['play','🎈','Jugar'],['med','💊','Medicina'],['bath','🫧','Limpiar'],['stats','📊','Estado'],['disc','📣','Disciplina'],['call','🔔','Aviso']];
let sel=0,sub=null,anim=0,msg='',game=null;
// ---- MÁQUINA DE ESTADOS (presentación): IDLE · FEEDING · PLAYING · CLEANING · RECOVERING · LEVEL_UP · REWARD · NOTICE  (SLEEPING / SICK se derivan de la simulación)
// Una acción = cambio de estado → animación → mensaje → vuelta a IDLE. No hay temporizadores por acción: el único reloj (tick, 500 ms) cierra el estado al vencer.
const ACT={s:'IDLE',until:0,ico:'',txt:''},Q=[];
const ST_OF={meal:['FEEDING','🍙'],snack:['FEEDING','🍰'],play:['PLAYING','🎈'],train:['PLAYING','💃'],talk:['PLAYING','💬'],praise:['PLAYING','👏'],scold:['PLAYING','📣'],gift:['REWARD','🎁'],clean:['CLEANING','🫧'],medicine:['RECOVERING','💊']};
const busy=()=>ACT.s!=='IDLE'&&ACT.s!=='NOTICE'&&Date.now()<ACT.until;
function enter(s,ms,txt,ico){ACT.s=s;ACT.until=Date.now()+ms;ACT.txt=txt||'';ACT.ico=ico||'';msg=''}
function tick(){if(ACT.s!=='IDLE'&&Date.now()>=ACT.until){const n=Q.shift();if(n)enter(...n);else{ACT.s='IDLE';ACT.txt='';ACT.ico=''}return true}return false}
const baseState=p=>p.asleep?'SLEEPING':p.sick?'SICK':'IDLE';
function sim(){const p=get();if(!p)return null;simulateElapsedTime(p,Date.now());put(p);return p}
function act(k){if(busy())return;const p=sim();if(!p)return;const before=p.stage+p.form,r=petAct(p,k,Date.now());Q.length=0;
 if(!r.ok){put(p);enter('NOTICE',1800,r.msg,'');return paint()}
 if(k==='lights'){put(p);scheduleNotifs(p);enter('NOTICE',1200,r.msg,p.lightsOff?'🌙':'💡');return paint()}
 const S=ST_OF[k]||['PLAYING','✨'];enter(S[0],1600,r.msg,S[1]);
 const s=stLoad();s.petCoins=s.day===s.petDay?s.petCoins||0:0;s.petDay=s.day;if(s.petCoins<150){s.petCoins+=10;stSave(s);ECO.add('coins',10,'Cuidar a Mi Idol')}careTick();
 stat({meal:'pet_feed',snack:'pet_feed',play:'pet_play',clean:'pet_clean'}[k]||'pet_care');
 if(r.levelUps){ECO.reward({coins:100*p.level,tickets:p.level%5?0:1},'Mi Idol sube a nivel '+p.level);Q.push(['LEVEL_UP',1800,'¡Nivel '+p.level+'!','⭐'])}
 if(before!==p.stage+p.form){stat('evolve');ECO.reward({gems:3,coins:300},'¡Tu idol ha evolucionado!');Q.push(['REWARD',2000,'¡Ha evolucionado!','✨'])}
 if(p.bond>=100)grantGame('game-bond-'+p.member,'Vínculo máximo con Mi Idol');if(p.form==='legend')grantGame('game-legend','Mi Idol: Leyenda');put(p);scheduleNotifs(p);paint()}
function press(btn){const p=sim();if(!p)return;if(game)return gameKey(btn);
 if(btn==='A'){if(sub)sub.i=(sub.i+1)%sub.items.length;else sel=(sel+1)%ICONS.length}
 else if(btn==='C'){sub=null;msg='';if(ACT.s==='NOTICE'){ACT.s='IDLE';ACT.until=0}}
 else{if(sub){const it=sub.items[sub.i];sub.k==='stats'?(sub.i=(sub.i+1)%sub.items.length):(act(it[0]),sub=null)}else open(ICONS[sel][0])}paint()}
function open(k){const p=get();if(k==='food')sub={k,i:0,items:[['meal','Comida'],['snack','Dulce']]};else if(k==='light')return act('lights');else if(k==='play')return startGame();else if(k==='med')return act('medicine');
 else if(k==='bath')return act('clean');else if(k==='stats')sub={k,i:0,items:[['h','hunger'],['a','age'],['d','disc'],['b','bond']]};else if(k==='disc')sub={k,i:0,items:[['praise','Elogiar'],['scold','Regañar']]};else if(k==='call'){enter('NOTICE',2200,p.callType?'¡Quiere jugar contigo!':needsText(p)||'Todo está bien','🔔')}}
function needsText(p){return p.sick?'Está enferma':p.hunger<25?'Tiene hambre':p.poop>=2?'Hay que limpiar':p.energy<15?'Está cansada':p.happy<30?'Está triste':''}
// minijuego clásico: ¿izquierda o derecha? (5 rondas)
function startGame(){const p=sim();if(busy())return;if(p.asleep){enter('NOTICE',1800,'Está durmiendo','😴');return paint()}if(p.energy<12){enter('NOTICE',1800,'Está demasiado cansada','🥱');return paint()}game={r:0,w:0,dir:null,show:0};paint()}
function gameKey(btn){if(btn==='C'){game=null;return paint()}if(game.show)return;const pick=btn==='A'?'L':'R',dir=Math.random()<.5?'L':'R';game.dir=dir;game.show=1;if(pick===dir)game.w++;paint();
 const g0=game;setTimeout(()=>{if(game!==g0)return;game.r++;game.show=0;if(game.r>=5){const won=game.w>=3,w=game.w;game=null;if(won)act('play');else{const p=sim();p.happy=Math.min(100,p.happy+5);put(p)}const _m=won?`¡Ganaste! ${w}/5`:`${w}/5 · casi, otra vez`;if(won&&ACT.s==='PLAYING')ACT.txt=_m;else enter('NOTICE',1800,_m,won?'🎉':'')}paint()},700)}
// ---- RENDERER: solo toca el DOM cuando cambia lo que se ve (sin reescrituras cada 500 ms: eso causaba el parpadeo, los toques perdidos y el mensaje que reaparecía)
let _ov=null,_side=null;
function paint(){const el=document.getElementById('tama');if(!el)return;const p=get();if(!p)return;const cv=el.querySelector('canvas');
 const tr=ACT.s!=='IDLE'&&ACT.s!=='NOTICE';drawSprite(cv,tr&&!p.asleep?Object.assign({},p,{mood:'happy'}):p,anim);
 el.dataset.state=ACT.s==='IDLE'||ACT.s==='NOTICE'?baseState(p):ACT.s;
 const scr=el.querySelector('.lcd');scr.classList.toggle('off',!!p.lightsOff);scr.classList.toggle('call',!!(p.callType||needsText(p)));
 el.querySelectorAll('.ic').forEach((n,i)=>n.classList.toggle('on',i===sel&&!sub&&!game));
 const ov=el.querySelector('.ov2');const X='<button class="lx" data-b="C" title="Salir">✕</button>';let h;
 if(game)h=`<i class="gz l" data-b="A"></i><i class="gz r" data-b="B"></i>${X}<div class="g gm">${game.show?(game.dir==='L'?'◀':'▶'):'¿◀ o ▶?'}<small>toca izquierda o derecha · ronda ${game.r+1}/5 · aciertos ${game.w}</small></div>`;
 else if(ACT.s!=='IDLE')h=`<div class="g act s-${ACT.s}" data-b="C">${ACT.ico?`<b class="bub">${ACT.ico}</b>`:''}<span>${esc(ACT.txt)}</span></div>`;
 else if(sub){if(sub.k==='stats'){const s=sub.items[sub.i][1],hearts=v=>'♥'.repeat(Math.round(v/25))+'♡'.repeat(4-Math.round(v/25));h=`${X}<div class="g st2 it" data-b="B">${s==='hunger'?`Hambre ${hearts(p.hunger)}<br>Ánimo ${hearts(p.happy)}`:s==='age'?`Edad ${Math.floor(p.age/24)} días<br>Peso ${p.weight} g`:s==='disc'?`Disciplina<br>${'▮'.repeat(Math.round(p.discipline/10))}${'▯'.repeat(10-Math.round(p.discipline/10))}`:`Vínculo ${Math.round(p.bond)}<br>${PET_CFG.personalities[p.personality].name}`}<small>toca para ver más</small></div>`}
  else h=`${X}<div class="g">${sub.items.map((it,i)=>`<div class="it ${i===sub.i?'cur':''}" data-si="${i}">${i===sub.i?'▶ ':''}${it[1]}</div>`).join('')}<small>toca una opción</small></div>`}
 else h=msg?`<div class="g msg it" data-b="C">${esc(msg)}</div>`:'';
 if(h!==_ov||ov.__h!==h){ov.innerHTML=h;ov.__h=h;_ov=h}
 const side=document.getElementById('tside');if(side){const sh=panelHTML(p);if(side.__h!==sh&&!(side.contains(document.activeElement)&&document.activeElement.tagName==='INPUT')){
   const open=[...side.querySelectorAll('details')].map(d=>d.open);side.innerHTML=sh;side.__h=sh;side.querySelectorAll('details').forEach((d,i)=>{if(open.length)d.open=!!open[i]});
   side.querySelectorAll('[data-act]').forEach(b=>b.disabled=busy())}
  else if(side.__busy!==busy())side.querySelectorAll('[data-act]').forEach(b=>b.disabled=busy());side.__busy=busy()}}
const bar=(v,l,ic)=>`<div class="pbar"><span>${ic} ${l}</span><i><u style="width:${v}%;background:${v<25?'#ff4b4b':v<55?'#ffc23d':'#6fe3c6'}"></u></i><em>${Math.round(v)}</em></div>`;
function panelHTML(p){const st=PET_CFG.stages.find(s=>s.id===p.stage),need=PET_CFG.xpPerLevel(p.level),pers=PET_CFG.personalities[p.personality],nx=PET_CFG.bondUnlocks.find(u=>u[0]>p.bond),notif=nset();
 return`<div class="tp-top"><h2>${CATALOG.members.find(m=>m.id===p.member).name}</h2><span class="lvl">Nv ${p.level}</span></div>
 <p class="small">${st.name}${p.form?' · '+PET_CFG.forms[p.form].name:''} · ${pers.name} · ${Math.floor(p.age/24)} d ${Math.floor(p.age%24)} h · ${p.asleep?'😴 durmiendo':moodName(p.mood)}</p>
 <div class="pbar xp"><span>⭐ EXP</span><i><u style="width:${p.xp/need*100}%"></u></i><em>${Math.floor(p.xp)}/${need}</em></div>
 ${bar(p.hunger,'Hambre','🍙')}${bar(p.happy,'Felicidad','💗')}${bar(p.energy,'Energía','⚡')}${bar(p.health,'Salud','➕')}${bar(p.hygiene,'Higiene','🫧')}${bar(p.discipline,'Disciplina','📣')}${bar(p.bond,'Vínculo','💞')}
 <div class="quick">${[['meal','🍙 Comer'],['play','🎈 Jugar'],['clean','🫧 Limpiar'],['lights',p.lightsOff?'💡 Luz':'🌙 Apagar luz'],['talk','💬 Hablar'],['train','💃 Ensayar'],['medicine','💊 Medicina'],['gift','🎁 Regalo 50🪙']].map(([k,l])=>`<button class="secondary" data-act="${k}">${l}</button>`).join('')}</div>
 <p class="small">${nx?`Siguiente desbloqueo por vínculo (${nx[0]}): ${nx[1]}`:'¡Vínculo máximo!'} · Errores de cuidado: ${p.mistakes}</p>
 <details open><summary>👗 Armario</summary><div class="quick">${OUTFITS.map(o=>{const ok=o[2](p);return`<button class="secondary" ${ok?'':'disabled'} data-outfit="${o[0]}" data-tip="${ok?'':'Se desbloquea: '+o[3]}">${o[0]===p.outfit||(!p.outfit&&o[0]==='none')?'✓ ':''}${o[1]}</button>`}).join('')}</div><p class="small">Accesorios del juego: por vínculo, por eventos activos y por los premios que consigues en el gacha.</p></details>
 <details><summary>⏰ Horario y avisos</summary><div class="sched"><label>Dormir <input type="number" min="0" max="23" value="${p.bed}" data-k="bed"></label><label>Despertar <input type="number" min="0" max="23" value="${p.wake}" data-k="wake"></label></div>
  <label class="sw"><input type="checkbox" data-n="on" ${notif.on?'checked':''}> Notificaciones</label><div class="sched"><label>Silencio desde <input type="number" min="0" max="23" value="${notif.qf}" data-q="qf"></label><label>hasta <input type="number" min="0" max="23" value="${notif.qt}" data-q="qt"></label></div>
  <p class="small">Próximos avisos: ${(notif.plan||[]).map(n=>`${new Date(n.at).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})} ${n.txt}`).join(' · ')||'ninguno'}</p></details>
 <details><summary>📜 Diario</summary><ul class="log">${p.events.slice(-12).reverse().map(e=>`<li><b>${new Date(e.t).toLocaleString('es-ES',{weekday:'short',hour:'2-digit',minute:'2-digit'})}</b> ${esc(e.txt)}</li>`).join('')}</ul></details>
 <button class="secondary small-btn" data-reset>Cambiar de idol</button>`}
const moodName=m=>({happy:'😊 feliz',ok:'🙂 tranquila',sad:'😢 triste',hungry:'🍙 hambrienta',dirty:'🫧 sucia',tired:'🥱 cansada',sick:'🤒 enferma',call:'🔔 te llama',egg:'🥚 huevo'})[m]||m;
// ---------- notificaciones: previsión → horario silencioso → enfriamiento → prioridad → agrupación ----------
const nset=()=>{try{return Object.assign({on:true,qf:23,qt:8,last:{}},JSON.parse(localStorage.getItem(NK)))}catch(e){return{on:true,qf:23,qt:8,last:{}}}},nsave=n=>localStorage.setItem(NK,JSON.stringify(n));
const quiet=(n,t)=>{const h=new Date(t).getHours();return n.qf>n.qt?(h>=n.qf||h<n.qt):(h>=n.qf&&h<n.qt)};
function scheduleNotifs(p){const n=nset();const nat=window.TWNative;if(nat)for(let i=1;i<=4;i++)try{nat.cancel(i)}catch(e){}if(!n.on||!p){n.plan=[];nsave(n);return}
 const now=Date.now(),COOL=6*36e5;let list=petForecast(p,now,24).filter(e=>e.t>now+5*60000);
 list=list.map(e=>{let t=e.t;if(quiet(n,t)){const d=new Date(t);if(d.getHours()>=n.qf)d.setDate(d.getDate()+1);d.setHours(n.qt,5,0,0);t=d.getTime()}return{...e,t}}).filter(e=>!(n.last[e.k]&&e.t-n.last[e.k]<COOL));
 list.sort((a,b)=>a.t-b.t||b.pr-a.pr);const groups=[];list.forEach(e=>{const g=groups.find(g=>Math.abs(g.t-e.t)<45*60000);if(g){g.items.push(e);g.pr=Math.max(g.pr,e.pr)}else groups.push({t:e.t,pr:e.pr,items:[e]})});
 const name=CATALOG.members.find(m=>m.id===p.member).name;n.plan=groups.slice(0,4).map((g,i)=>{const top=g.items.sort((a,b)=>b.pr-a.pr)[0];return{id:i+1,at:g.t,k:top.k,txt:g.items.length>1?`${top.txt} (+${g.items.length-1} avisos)`:top.txt}});
 n.plan.forEach(x=>{if(nat)try{nat.schedule(x.id,'Mi Idol · '+name,x.txt.replace('Tu idol',name),x.at)}catch(e){}});nsave(n)}
let webT=[];function webNotify(){webT.forEach(clearTimeout);webT=[];const n=nset();if(!n.on||window.TWNative||!('Notification' in window)||Notification.permission!=='granted')return;
 (n.plan||[]).forEach(x=>{const d=x.at-Date.now();if(d>0&&d<6*36e5)webT.push(setTimeout(()=>{if(document.hidden){new Notification('Mi Idol',{body:x.txt});const m=nset();m.last[x.k]=Date.now();nsave(m)}},d))})}
document.addEventListener('visibilitychange',()=>{const p=sim();if(p){if(document.hidden){scheduleNotifs(p);webNotify()}else{p.lastSeen=Date.now();put(p)}}});
// ---------- página ----------
function petPage(c){let p=sim();
 if(!p){c.innerHTML=`<div class="pet-pick"><h2>Mi Idol</h2><p class="small">Elige la mascota de tu miembro favorito o deja que salga una al azar. Nace de un huevo, crece según cómo la cuides y sigue viviendo aunque cierres la app. No toca tu colección.</p>
  <div class="pp-grid">${CATALOG.members.map(m=>`<button class="pp" style="--mc:${MEMC(m.id)}" data-m="${m.id}"><canvas class="pp8" width="168" height="181" data-pm="${m.id}"></canvas><b>${m.name}</b><small>${m.hangul}</small></button>`).join('')}</div><button class="open-btn" data-m="">🎲 IDOL ALEATORIA</button></div>`;
  c.querySelectorAll('canvas[data-pm]').forEach(cv=>idol8(cv,{member:cv.dataset.pm,stage:'adult',mood:'happy',poop:0},0,null));
  c.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const ids=CATALOG.members.map(m=>m.id),ks=Object.keys(PET_CFG.personalities),m=b.dataset.m||ids[Math.floor(Math.random()*ids.length)];put(newPet(m,ks[Math.floor(Math.random()*ks.length)],Date.now()));try{window.TWNative&&TWNative.init()}catch(e){}if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();petPage(c)});return}
 p.lastSeen=Date.now();put(p);const ev=activeEvents();
 c.innerHTML=`<div class="tama-wrap"><div class="tama" id="tama" style="--mc:${MEMC(p.member)}"><i class="chain"></i><div class="shell"><div class="brand">MI·IDOL</div>
  <div class="bezel"><div class="lcd"><div class="icons top">${ICONS.slice(0,4).map((ic,i)=>`<button class="ic" data-i="${i}" title="${ic[2]}">${ic[1]}</button>`).join('')}</div>
   <div class="view"><canvas width="168" height="181"></canvas><div class="ov2"></div></div><div class="icons bot">${ICONS.slice(4).map((ic,i)=>`<button class="ic" data-i="${i+4}" title="${ic[2]}">${ic[1]}</button>`).join('')}</div></div></div>
  <div class="grill">${"<i></i>".repeat(12)}</div>${ev.length?`<div class="evt">🎉 ${esc(ev[0].name)}</div>`:''}</div></div>
  <div class="tside" id="tside"></div></div>`;
 c.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{press(b.dataset.b);b.classList.add('push');setTimeout(()=>b.classList.remove('push'),120)});
 c.querySelector('.ov2').addEventListener('click',e=>{const si=e.target.closest('[data-si]');if(si&&sub){sub.i=+si.dataset.si;return press('B')}const b=e.target.closest('[data-b]');if(b)press(b.dataset.b)});
 c.querySelectorAll('.ic').forEach(b=>b.onclick=()=>{sel=+b.dataset.i;sub=null;open(ICONS[sel][0]);paint()});
 c.querySelector('#tside').addEventListener('click',e=>{const oc=e.target.closest('[data-outfit]');if(oc){const q=get();q.outfit=oc.dataset.outfit;put(q);SND.sfx('ok');return paint()}const a=e.target.closest('[data-act]');if(a){const k=a.dataset.act;if(k==='gift'&&!ECO.pay('coins',50,'Regalo para Mi Idol'))return;act(k)}if(e.target.closest('[data-reset]')&&confirm('¿Cambiar de idol? Empieza de nuevo (tu colección no cambia).')){localStorage.removeItem(KEY);petPage(c)}});
 c.querySelector('#tside').addEventListener('change',e=>{const t=e.target,p=get();if(t.dataset.k){p[t.dataset.k]=Math.max(0,Math.min(23,+t.value));put(p)}if(t.dataset.n){const n=nset();n.on=t.checked;nsave(n)}if(t.dataset.q){const n=nset();n[t.dataset.q]=+t.value;nsave(n)}scheduleNotifs(get());paint()});
 scheduleNotifs(p);paint()}
// animación: 2 fotogramas por segundo solo con la pantalla visible (no gasta batería)
setInterval(()=>{if(document.hidden||!document.getElementById('tama'))return;anim++;tick();if(anim%120===0)sim();paint()},500);
addEventListener('keydown',e=>{if(!document.getElementById('tama')||e.target.matches('input'))return;const k={ArrowLeft:'A',ArrowRight:'A',Enter:'B',' ':'B',Escape:'C'}[e.key];if(k){e.preventDefault();press(k)}});
window.petPage20=petPage;window.petSprite=(cv,pt,fr)=>drawSprite(cv,pt,fr);UI.view('pet',{skin:'idol',render:(c)=>petPage(c)});try{if(get()&&window.TWNative){TWNative.init();scheduleNotifs(sim())}}catch(e){}
})();
;
/* ================= views.js ================= */
// =====================================================================================
//  VISTAS: Inicio (centro del juego) · Eventos y misiones · Perfil (estadísticas, sonido, datos, caché)
//  Todos los números salen de los datos reales.
// =====================================================================================
(function(){
const esc=DS.esc,RK=Object.keys(CATALOG.rarities),R=CATALOG.rarities;
const photo=()=>data.cards.filter(c=>!c.ext),own=c=>!!data.owned[c.id],albumsV=()=>catVisibleAlbums().filter(a=>a.physical!==false);
const cardsOf=a=>photo().filter(c=>c.album===a.title);
const pet=()=>window.PET&&PET.get();
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);return m<1?'ahora':m<60?`hace ${m} min`:m<1440?`hace ${Math.round(m/60)} h`:`hace ${Math.round(m/1440)} d`};
const daysLeft=e=>{const n=new Date(),y=n.getFullYear();let d=new Date(y,e.to[0]-1,e.to[1],23,59);if(d<n)d=new Date(y+1,e.to[0]-1,e.to[1],23,59);return Math.max(0,Math.ceil((d-n)/864e5))};
window.daysLeft=daysLeft;   // Inicio (home2.js) también la usa: sin esto fallaba al haber un evento activo
function nextAction(){const p=pet();if(data.pending&&!data.pending.done)return{ico:'🎁',t:'Termina tu sobre guardado',s:'El resultado ya está decidido.',b:'Ver mis cartas',go:'PACKS.resume()'};
 if(p){simulateElapsedTime(p,Date.now());if(p.sick)return{ico:'🤒',t:'Tu idol está enferma',s:'Necesita medicina.',b:'Cuidarla',go:"UI.go('#/pet')"};if(!p.asleep&&p.hunger<30)return{ico:'🍙',t:'Tu idol tiene hambre',s:'Dale de comer y ganarás monedas.',b:'Ir a Mi Idol',go:"UI.go('#/pet')"}}
 if(PACKS.freeReady())return{ico:'🎁',t:'Tienes un sobre gratis',s:'3 cartas, sin coste.',b:'Abrir ahora',go:"PACKS.open('free')"};
 if(data.bind&&data.bind.inbox.filter(id=>data.owned[id]&&!data.bind.placed[id]).length)return{ico:'📒',t:'Cartas por colocar en tu álbum',s:'Completa páginas para ganar recompensas.',b:'Ir al álbum',go:"UI.go('#/binder')"};
 if(ECO.bal('coins')>=100)return{ico:'🪙',t:`Tienes ${ECO.bal('coins')} monedas`,s:'Un sobre estándar cuesta 100.',b:'Ir a Sobres',go:"UI.go('#/packs')"};
 return{ico:'🐣',t:'Cuida a tu idol',s:'Cuidarla te da monedas para sobres.',b:'Ir a Mi Idol',go:"UI.go('#/pet')"}}
UI.view('home',{skin:'collection',render(c){const p=pet(),all=photo(),n=all.filter(own).length,pct=all.length?n/all.length*100:0,st=stLoad(),ev=activeEvents(),act=nextAction(),H=(data.pulls.hist||[])[0],led=(data.ledger||[])[0],L=ECO.colLevel();
 const as=albumsV().map(a=>{const cs=cardsOf(a);return{a,n:cs.filter(own).length,t:cs.length}}).filter(x=>x.n>0&&x.n<x.t).sort((x,y)=>y.n/y.t-x.n/x.t).slice(0,4);
 const D=dailyPick(),dd=D.filter(m=>m.c).length,wk=weekState();
 const petBlock=p?(()=>{simulateElapsedTime(p,Date.now());const st2=PET_CFG.stages.find(s=>s.id===p.stage);return`<div class="hpet" onclick="UI.go('#/pet')"><div class="hpet-s"><canvas id="hc" width="24" height="24"></canvas></div><div class="vstack" style="gap:8px;flex:1;min-width:0"><div class="row spb"><h3 style="margin:0">${CATALOG.members.find(m=>m.id===p.member).name}</h3><span class="chip acc">Nv ${p.level} · ${st2.name}</span></div>
   ${[['🍙','Hambre',p.hunger],['💗','Felicidad',p.happy],['⚡','Energía',p.energy],['➕','Salud',p.health]].map(([i,l,v])=>`<div class="hb"><span>${i} ${l}</span>${DS.bar(v,100,{color:v<25?'var(--bad)':v<55?'var(--warn)':'var(--ok)'})}</div>`).join('')}<div class="small">${p.asleep?'😴 Durmiendo':p.sick?'🤒 Enferma':p.hunger<25?'🍙 Con hambre':p.poop>=2?'🫧 Hay que limpiarla':'💗 Está bien'} · vínculo ${Math.round(p.bond)}/100</div></div></div>`})():`<div class="empty" style="border:0"><div class="eico">🥚</div><p>Aún no tienes una idol. Adopta a una de las 9 integrantes: nace de un huevo y crece según cómo la cuides.</p>${DS.btn('Adoptar una idol',{v:'pri',attrs:`onclick="UI.go('#/pet')"`})}</div>`;
 c.innerHTML=`<div class="phead"><div><h2>Hola, ONCE 👋</h2><div class="small">Nivel de coleccionista ${L.l} · ${L.cur}/${L.need} 🏅</div></div></div>
 <div class="hgrid"><div class="card hnext"><span class="hn-i">${act.ico}</span><div class="vstack" style="gap:2px;flex:1;min-width:0"><b style="font:600 18px var(--f-disp)">${act.t}</b><span class="small">${act.s}</span></div>${DS.btn(act.b,{v:'pri',attrs:`onclick="${act.go}"`})}</div>
 <div class="card hidol"><h3>🐣 Mi Idol</h3>${petBlock}</div>
 <div class="card"><h3>🎁 Sobres</h3><div class="vstack" style="gap:8px"><div class="row spb"><span>Sobre diario</span>${PACKS.freeReady()?'<span class="chip off">DISPONIBLE</span>':`<span class="chip">en ${PACKS.fmtT(PACKS.freeLeft())}</span>`}</div><div class="row spb"><span>Monedas</span><b>🪙 ${ECO.bal('coins').toLocaleString('es-ES')}</b></div><div class="row spb"><span>Tickets</span><b>🎫 ${ECO.bal('tickets')}</b></div>${ev.length?`<div class="chip game">🎉 ${esc(ev[0].name)} · ${daysLeft(ev[0])} d</div>`:''}${DS.btn(PACKS.freeReady()?'Abrir gratis':'Ir al hub',{v:PACKS.freeReady()?'pri':'sec',attrs:`onclick="${PACKS.freeReady()?"PACKS.open('free')":"UI.go('#/packs')"}"`})}</div></div>
 <div class="card"><h3>📚 Colección</h3><div class="kp2"><b>${pct.toFixed(1)}%</b><span>${n} de ${all.length} photocards</span></div>${DS.bar(n,all.length)}<div class="row small" style="margin-top:8px"><span>⧉ ${all.reduce((s,c)=>s+(own(c)?Math.max(0,(data.duplicates[c.id]||1)-1):0),0)} duplicadas</span><span>🎴 ${data.cards.filter(c=>c.game&&own(c)).length} especiales</span></div>${DS.btn('Ver colección',{attrs:`onclick="UI.go('#/collection')"`,size:'sm'})}</div>
 <div class="card"><h3>🎮 Juegos</h3><p class="small" style="margin:0 0 8px">Quiz, rompecabezas, memoria, ¿Quién es?, adivina la canción y más.</p><div class="row">${DS.btn('Jugar',{v:'pri',attrs:`onclick="UI.go('#/games')"`})}${DS.btn('🎰 Gacha',{attrs:`onclick="UI.go('#/gacha')"`})}</div></div>
 <div class="card"><h3>🎯 Misiones de hoy</h3><div class="vstack" style="gap:8px">${D.map(m=>{const M=DAILY[m.k],v=Math.min(M[1],st.d[M[0]]||0);return`<div><div class="row spb small"><span>${m.c?'✓ ':''}${M[2]}</span><span>${v}/${M[1]}</span></div>${DS.bar(v,M[1])}</div>`}).join('')}<div class="small">${dd}/${D.length} completadas · racha de cuidados ${st.careStreak||0} días</div>${DS.btn('Ver misiones',{size:'sm',attrs:`onclick="UI.go('#/events')"`})}</div></div>
 <div class="card"><h3>💿 Álbumes en progreso</h3>${as.length?`<div class="vstack" style="gap:10px">${as.map(x=>`<a class="hal" href="#/binder/${x.a.id}"><div class="aart" ${covers[x.a.title]?`data-src="${covS(covers[x.a.title],120)}"`:''}></div><div style="flex:1;min-width:0"><b>${esc(x.a.title)}</b>${DS.bar(x.n,x.t)}</div><small>${x.n}/${x.t}</small></a>`).join('')}</div>`:DS.empty('💿','Consigue tu primera photocard para empezar un álbum.',{label:'Ver sobres',go:"UI.go('#/packs')"})}</div>
 <div class="card"><h3>🎉 Eventos</h3>${ev.length?ev.map(e=>`<div class="row spb" style="margin-bottom:6px"><div><b>${esc(e.name)}</b><div class="small">Termina en ${daysLeft(e)} día${daysLeft(e)===1?'':'s'}</div></div><button class="btn sm" onclick="UI.go('#/events')">Ver</button></div>`).join(''):`<p class="small" style="margin:0">Sin eventos activos. Próximos: aniversario (20/10), Halloween, Navidad y los cumpleaños.</p>`}</div>
 <div class="card"><h3>🕘 Actividad reciente</h3><div class="vstack" style="gap:6px;font-size:13px">${H?`<div>🎁 ${esc(H.pack.name)} · mejor <span class="tag-r ${H.best}">${H.best}</span> <span class="mute">${ago(H.t)}</span></div>`:'<div class="mute">Aún no has abierto sobres.</div>'}${H?`<div class="mini-row">${H.ids.map(id=>{const cd=data.cards.find(x=>x.id===id);return cd?`<div onclick="openCard('${id}')" style="cursor:pointer">${faceHTML(cd,true)}</div>`:''}).join('')}</div>`:''}${led?`<div>${led.n>0?'➕':'➖'} ${ECO.CUR[led.c].i} ${Math.abs(led.n)} · ${esc(led.why||'')} <span class="mute">${ago(led.t)}</span></div>`:''}</div></div></div>`;
 IC.scan(c);const cv=c.querySelector('#hc');if(cv&&window.petSprite){petSprite(cv,p,0);setInterval(function f(){if(!cv.isConnected){clearInterval(f.id);return}petSprite(cv,p,Math.floor(Date.now()/500))},500)}}});
// ---------------- EVENTOS Y MISIONES ----------------
const EVMIS=ev=>[{k:'evpacks',n:2,t:`Abre 2 sobres de «${ev.name}»`,r:{gems:2,cp:20}},{k:'evcards',n:1,t:'Consigue la carta GAME SPECIAL del evento',r:{coins:300}}];
function evProg(e){const y=new Date().getFullYear(),k=e.id+'-'+y;data.evprog=data.evprog||{};data.evclaim=data.evclaim||{};return{k,packs:data.evprog[k]||0,card:(()=>{const g=GAME_CARDS.find(x=>x.event===e.id||(e.member!=null&&x.id==='game-bday-'+CATALOG.members[e.member].id));return g&&data.owned[g.id]?1:0})(),claim:data.evclaim}}
window.claimEv=(k,j,n)=>{const e=EVENTS.find(x=>k.startsWith(x.id+'-')),M=EVMIS(e)[j],id=k+':'+j;data.evclaim=data.evclaim||{};if(data.evclaim[id])return;data.evclaim[id]=1;save();ECO.reward(M.r,M.t);SND.sfx('reward');UI.keepScroll=true;UI.route()};
UI.view('events',{skin:'collection',render(c,args){const s=stLoad(),W=weekState(),ev=activeEvents(),D=dailyPick(),rw=REWARD_FMT;checkAch();const s2=stLoad();
 const row=(lbl,v,need,r,btn,done)=>`<div class="mis2"><div><b>${lbl}</b><div class="small">${rw(r)}</div></div><div class="mp">${DS.bar(Math.min(v,need),need)}<small>${Math.min(v,need)}/${need}</small></div><button class="btn sm ${v>=need&&!done?'pri':''}" ${done||v<need?'disabled':''} onclick="${btn}">${done?'✓ Recogida':'Recoger'}</button></div>`;
 const up=EVENTS.filter(e=>!ev.includes(e)).map(e=>{const n=new Date();let d=new Date(n.getFullYear(),e.from[0]-1,e.from[1]);if(d<n)d=new Date(n.getFullYear()+1,e.from[0]-1,e.from[1]);return{e,d}}).sort((a,b)=>a.d-b.d).slice(0,4);
 c.innerHTML=`<div class="phead"><div><h2>Eventos y misiones</h2><div class="small">Eventos temporales de TWICE dentro del juego · misiones · logros</div></div></div>
 <h3>🎉 Eventos activos</h3>${ev.length?`<div class="gridx" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">${ev.map(e=>{const pr=evProg(e),M=EVMIS(e),pk=PACKS.get('event:'+e.id),g=pk&&pk.extra&&data.cards.find(x=>x.id===pk.extra);return`<div class="card evc"><div class="row spb"><span class="chip game">EVENTO</span><span class="chip acc">⏳ ${daysLeft(e)} día${daysLeft(e)===1?'':'s'}</span></div><h3 style="font-size:22px;margin:8px 0 0">${esc(e.name)}</h3><div class="small">${String(e.from[1]).padStart(2,'0')}/${String(e.from[0]).padStart(2,'0')} → ${String(e.to[1]).padStart(2,'0')}/${String(e.to[0]).padStart(2,'0')}${e.pet?' · '+esc(e.pet)+' (Mi Idol)':''}</div>
  ${g?`<div class="row" style="margin:10px 0"><div style="width:70px;cursor:pointer" onclick="openCard('${g.id}')">${faceHTML(g,true)}</div><div class="small">Carta exclusiva: <b>${esc(g.name)}</b><br><span class="chip game">GAME SPECIAL</span> ${own(g)?'<span class="chip off">Conseguida</span>':''}</div></div>`:''}
  <div class="vstack" style="gap:8px">${M.map((m,j)=>{const v=j===0?pr.packs:pr.card,id=pr.k+':'+j;return row(m.t,v,m.n,m.r,`claimEv('${pr.k}',${j})`,pr.claim[id])}).join('')}</div>${pk?`<div class="row" style="margin-top:12px"><button class="btn pri" onclick="PACKS.open('${pk.id}')" ${PACKS.available(pk).ok?'':'disabled'}>Abrir sobre de evento · 🎫 1</button><button class="btn sm" onclick="UI.go('#/packs/${encodeURIComponent(pk.id)}')">Ver contenido</button></div>`:''}</div>`}).join('')}</div>`:`<div class="card flat small">No hay eventos activos ahora mismo.</div>`}
 ${up.length?`<div class="sec-head"><h3>Próximos</h3></div><div class="row">${up.map(x=>`<span class="chip">📅 ${esc(x.e.name)} · ${x.d.toLocaleDateString('es-ES',{day:'numeric',month:'short'})}</span>`).join('')}</div>`:''}
 <div class="split" style="--cols:minmax(0,1fr) minmax(0,1fr);margin-top:var(--s5)"><div class="vstack"><div class="card"><h3>📅 Misiones diarias</h3><div class="vstack" style="gap:12px">${D.map((m,j)=>{const M=DAILY[m.k];return row(M[2],s.d[M[0]]||0,M[1],M[3],`claimDaily2(${j})`,m.c)}).join('')}</div></div>
  <div class="card"><h3>🗓 Misiones semanales</h3><div class="vstack" style="gap:12px">${WEEKLY.map((M,j)=>row(M[2],W.w[M[0]]||0,M[1],M[3],`claimWeekly(${j})`,W.wc[j])).join('')}</div></div></div>
  <div class="vstack"><div class="card"><h3>🔥 Racha de cuidados</h3><div class="kp2"><b>${s.careStreak||0} días</b><span>récord ${s.careBest||0} · 1 protección de racha por semana</span></div><p class="small">Cuida a tu idol cada día. Romper la racha nunca te quita lo que ya has ganado.</p></div>
  <div class="card"><h3>🎁 Recompensa diaria</h3><div class="row">${DS.btn(s.last===today()?'Vuelve mañana':'Recoger',{v:'pri',attrs:`onclick="claimDaily()"`,disabled:s.last===today()})}<span class="small">Racha de entradas: ${s.streak||0}</span></div></div>
  <div class="card"><h3>🎡 Ruleta del día</h3><div class="wheelw"><div class="wheel" id="wheel">${WHEEL.map((v,i)=>`<span style="--i:${i}">${v}</span>`).join('')}</div><i class="wptr"></i></div>${DS.btn(s.spun?'Mañana otra vez':'Girar',{v:'pri',attrs:`onclick="spinWheel()"`,disabled:s.spun})}</div></div></div>
 <div class="card" style="margin-top:var(--s5)"><h3>🏆 Logros</h3><div class="achg">${ACH.map((A,j)=>{const v=achVal(A[0]),t=(s2.ach2||{})[j];return`<div class="ach ${t||''}"><b>${esc(A[2])}</b><small>${Math.min(v,A[1])}/${A[1]} · ${rw(A[3])}</small>${DS.bar(Math.min(v,A[1]),A[1])}${t==='ready'?`<button class="btn pri sm" onclick="claimAch2(${j})">Recoger</button>`:t==='done'?'<em>✓ Conseguido</em>':''}</div>`}).join('')}</div></div>`}});
// el evento cuenta aperturas propias
const _stat=window.stat;
// ---------------- PERFIL ----------------
let PT='stats';
UI.view('profile',{skin:'collection',render(c,args){PT=args[0]||PT;if(!['stats','settings','data'].includes(PT))PT='stats';const tabs=[['stats','📊 Estadísticas'],['settings','⚙️ Ajustes'],['data','💾 Datos y caché']];
 c.innerHTML=`<div class="phead"><div><h2>Perfil del coleccionista</h2></div><div class="seg">${tabs.map(([k,l])=>`<button data-t="${k}" class="${PT===k?'on':''}">${l}</button>`).join('')}</div></div><div id="pbody"></div>`;c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>UI.go('#/profile/'+b.dataset.t));{const T={stats,settings,data:dataTab};if(!T[PT])PT='stats';const pb=c.querySelector('#pbody');try{T[PT](pb)}catch(e){console.error(e);pb.innerHTML=DS.empty('⚠️','Esta pestaña ha fallado al cargarse. Prueba otra pestaña o vacía la caché.',{label:'Ir a Estadísticas',go:"UI.go('#/profile/stats')"})}}}});
function stats(b){const all=photo(),n=all.filter(own).length,as=albumsV(),done=as.filter(a=>cardsOf(a).every(own)),dup=all.reduce((s,c)=>s+(own(c)?Math.max(0,(data.duplicates[c.id]||1)-1):0),0),L=ECO.colLevel(),p=pet(),yrs=[...new Set(as.map(a=>a.release.v.slice(0,4)))],eras=yrs.filter(y=>as.filter(a=>a.release.v.startsWith(y)).every(a=>cardsOf(a).every(own))),
 mem=CATALOG.members.filter(m=>all.filter(c=>c.member===m.name).every(own)),memAny=CATALOG.members.filter(m=>all.some(c=>c.member===m.name&&own(c))),sp=data.cards.filter(c=>c.game&&own(c)),byR=data.pulls.byR||{},mx=Math.max(1,...RK.map(r=>byR[r]||0));
 const kp=(a,t,l)=>`<div class="card kp"><div class="kp2"><b>${a}${t!=null?`<small> / ${t}</small>`:''}</b><span>${l}</span></div>${t?DS.bar(a,t):''}</div>`;
 b.innerHTML=`<div class="card prof"><div class="cvring" style="--p:${Math.min(100,L.cur/L.need*100).toFixed(0)}"><b>Nv ${L.l}</b><span>${L.cur}/${L.need}</span></div><div class="vstack" style="gap:6px;flex:1"><h3 style="margin:0">Coleccionista de TWICE</h3><div class="row">${['coins','tickets','dust','cp','gems'].map(k=>`<span class="chip" data-tip="${ECO.CUR[k].use}">${ECO.CUR[k].i} ${ECO.CUR[k].n}: <b>${ECO.bal(k).toLocaleString('es-ES')}</b></span>`).join('')}</div><div class="small">Los puntos de colección 🏅 (por cartas nuevas, páginas y álbumes) suben tu nivel.</div></div></div>
 <div class="gridx g-auto" style="--min:200px;margin-top:var(--s4)">${kp(n,all.length,'Photocards')}${kp(done.length,as.length,'Álbumes completos')}${kp(mem.length,9,'Integrantes completas')}${kp(memAny.length,9,'Integrantes con cartas')}${kp(eras.length,yrs.length,'Eras completas')}${kp(data.pulls.n||0,null,'Sobres abiertos')}${kp(sp.length,data.cards.filter(c=>c.game).length,'Cartas especiales')}${kp(dup,null,'Duplicadas')}${kp(all.length-n,null,'Cartas que faltan')}${kp(data.pulls.best||'—',null,'Mejor rareza')}${kp(p?p.level:'—',null,'Nivel de Mi Idol')}${kp(p?Math.round(p.bond):'—',null,'Vínculo con Mi Idol')}</div>
 <div class="split" style="--cols:minmax(0,1fr) minmax(0,1fr);margin-top:var(--s4)"><div class="card"><h3>Tiradas por rareza</h3><div class="chart">${RK.map(r=>`<div class="bar2"><i style="height:${(byR[r]||0)/mx*100}%;background:${R[r].color}"></i><b>${r}</b><small>${byR[r]||0}</small></div>`).join('')}</div></div>
 <div class="card"><h3>Por integrante</h3><div class="hbars">${CATALOG.members.map(m=>{const cs=all.filter(c=>c.member===m.name),o=cs.filter(own).length;return`<div><span>${m.name}</span>${DS.bar(o,cs.length||1)}<small>${o}/${cs.length}</small></div>`}).join('')}</div></div></div>
 <div class="card" style="margin-top:var(--s4)"><h3>Movimientos recientes</h3>${(data.ledger||[]).length?`<ul class="log">${data.ledger.slice(0,14).map(l=>`<li><b>${l.n>0?'+':''}${l.n} ${ECO.CUR[l.c].i}</b> ${esc(l.why||'')}</li>`).join('')}</ul>`:'<p class="small">Sin movimientos todavía.</p>'}</div>`}
function settings(b){const C=SND.cfg,sl=(k,l)=>`<label class="sli"><span>${l}</span><input type="range" min="0" max="1" step=".05" value="${C[k]}" data-sl="${k}"><b>${Math.round(C[k]*100)}%</b></label>`;
 b.innerHTML=`<div class="split" style="--cols:minmax(0,1fr) minmax(0,1fr)"><div class="card vstack"><h3>🔊 Sonido</h3><label class="sw"><input type="checkbox" data-sw="mute" ${C.mute?'checked':''}> Silenciar todo</label>${sl('master','Volumen general')}${sl('sfx','Efectos (sobres, cartas, recompensas, Mi Idol)')}${sl('music','Música de fondo')}<label class="sw"><input type="checkbox" data-sw="music_on" ${C.music_on?'checked':''}> Música de fondo (generada, apagada por defecto)</label><button class="btn sm" id="tSnd">▶ Probar efectos</button></div>
 <div class="card vstack"><h3>🖼 Imágenes</h3><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn pri sm" id="phAll">⬇ Descargar todas las fotos</button><button class="btn sm" id="phImp">📁 Importar mis fotos</button><button class="btn sm" onclick="UI.go('#/test')">🧪 Modo prueba</button><input type="file" id="phImpF" accept="image/*" multiple hidden><span class="small" id="phN">${(()=>{const r=PH.readyCount();return r.n+" / "+r.t+" cartas con foto lista"})()}</span></div><div class="prepbar" id="phBar" hidden><i id="phI"></i></div><label class="sw"><input type="checkbox" id="stp" ${data.strictPhotos!==false?'checked':''}> Solo fotos del propio álbum (recomendado)</label><p class="small">Cada carta lleva únicamente una foto de la galería de su álbum y ninguna foto se repite. Si aún no hay foto de ese álbum, la carta muestra un hueco «imagen pendiente» en vez de una foto de otra época.</p><label class="sw"><input type="checkbox" id="apx" ${data.showApprox?'checked':''}> Marcar con ≈ las fotos que no son de su época</label><p class="small">Siempre se muestra una foto: primero la de su era, si no la más cercana y, si no, cualquiera de esa integrante.</p></div>
 <div class="card vstack"><h3>🖼 Fuentes de imágenes</h3><p class="small">Fotos: Fandom, Wikimedia Commons, Wikipedia y Openverse. Portadas y contraportadas: Cover Art Archive, Discogs (opcional), iTunes/Deezer. Hay <b>${PH.count()}</b> fotos de integrantes en este dispositivo.</p><input class="inp" id="dtk" placeholder="Token de Discogs (opcional)" value="${localStorage.getItem('twiceDiscogs')||''}"><div class="row"><button class="btn sm" id="dtkS">Guardar token</button><button class="btn sm" id="phW">Buscar más fotos ahora</button></div></div>
 <div class="card vstack"><h3>🔔 Mi Idol</h3><p class="small">Las notificaciones, el horario de sueño y el silencio nocturno se configuran dentro de Mi Idol.</p>${DS.btn('Abrir Mi Idol',{attrs:`onclick="UI.go('#/pet')"`})}</div>
 <div class="card vstack"><h3>ℹ️ Acerca de</h3><p class="small">Proyecto de fans, solo sobre TWICE y sus 9 integrantes. Las cartas «GAME SPECIAL», los sobres, los eventos y las rarezas son contenido del juego y no merchandising oficial. Las portadas y fotos pertenecen a sus titulares y se usan solo de forma personal.</p></div></div>`;
 b.querySelectorAll('[data-sl]').forEach(i=>i.oninput=()=>{SND.set(i.dataset.sl,+i.value);i.nextElementSibling.textContent=Math.round(i.value*100)+'%'});b.querySelectorAll('[data-sw]').forEach(i=>i.onchange=()=>SND.set(i.dataset.sw,i.checked));
 b.querySelector('#phAll').onclick=async e=>{const bt=e.target,bar=b.querySelector('#phBar'),lab=b.querySelector('#phN');bt.disabled=true;bar.hidden=false;await PH.prepareAll((d,t,al)=>{const i=b.querySelector('#phI');if(i)i.style.width=Math.round(d/t*100)+'%';if(lab&&lab.isConnected)lab.textContent=al+' · álbum '+d+'/'+t});const r=PH.readyCount();if(lab.isConnected){lab.textContent=r.n+' / '+r.t+' cartas con foto lista';bt.disabled=false;bar.hidden=true}DS.toast(r.n+' fotos guardadas en el dispositivo')}; b.querySelector('#phImp').onclick=()=>b.querySelector('#phImpF').click();b.querySelector('#phImpF').onchange=async e=>{const fs=[...e.target.files];if(!fs.length)return;DS.toast('Importando '+fs.length+' fotos…');const r=await PHOTO_IMPORT(fs);DS.toast(r.ok+' importadas'+(r.skip?' · '+r.skip+' sin reconocer (el nombre debe llevar el álbum y la integrante, p. ej. «Page Two - Jihyo - 3.jpg»)':''),'📁');try{await PH.prepareAll()}catch(_){}UI.keepScroll=true;UI.route()};
 b.querySelector('#stp').onchange=e=>{data.strictPhotos=e.target.checked;save();DS.toast(e.target.checked?'Solo fotos del propio álbum':'Se permiten fotos de otras épocas')}; b.querySelector('#dtkS').onclick=()=>{localStorage.setItem('twiceDiscogs',b.querySelector('#dtk').value.trim());DS.toast('Token guardado')};b.querySelector('#phW').onclick=()=>{DS.toast('Buscando fotos…','🔎');PH.warm(true).then(()=>DS.toast(PH.count()+' fotos disponibles'))};b.querySelector('#tSnd').onclick=()=>['click','coin','flip','r_SR','reward'].forEach((n,i)=>setTimeout(()=>SND.sfx(n),i*350));b.querySelector('#apx').onchange=e=>{data.showApprox=e.target.checked;save();DS.toast(e.target.checked?'Fotos aproximadas visibles (≈)':'Fotos aproximadas ocultas')}}
function dataTab(b){const vis=catVisibleAlbums(),pcs=photo().length,issues=[];
 const dupe=Object.entries(data.cards.reduce((m,c)=>(m[c.id]=(m[c.id]||0)+1,m),{})).filter(([k,v])=>v>1);if(dupe.length)issues.push(`${dupe.length} cartas duplicadas en la base`);
 const orphan=photo().filter(c=>!catAlbumByTitle(c.album));if(orphan.length)issues.push(`${orphan.length} cartas sin álbum`);
 b.innerHTML=`<div class="split" style="--cols:minmax(0,1fr) minmax(0,1fr)"><div class="card vstack"><h3>💾 Tu partida</h3><p class="small">Todo se guarda en este dispositivo: colección, monedas, Mi Idol, misiones, logros e historial.</p><div class="row"><button class="btn" id="dEx">Exportar partida</button><button class="btn" id="dIm">Importar partida</button></div><div class="row"><button class="btn danger" id="dRs">Reiniciar la partida</button></div></div>
 <div class="card vstack"><h3>🗂 Catálogo ${CATALOG.version}</h3><table class="kv"><tr><th>Álbumes visibles</th><td>${vis.length}</td></tr><tr><th>Fechas verificadas</th><td>${vis.filter(a=>a.release.s==='verified').length}/${vis.length}</td></tr><tr><th>Photocards reales</th><td>${pcs}</td></tr><tr><th>Cartas del juego</th><td>${data.cards.filter(c=>c.game).length}</td></tr><tr><th>Con foto de su era</th><td>${photo().filter(c=>(photoFor(c)||{}).conf==='era').length}</td></tr><tr><th>Avisos</th><td>${issues.length?issues.join(' · '):'ninguno'}</td></tr></table><p class="small">Validación completa: <code>node tools/validate.js</code></p></div>
 <div class="card vstack"><h3>🖼 Caché de imágenes</h3><p class="small">Las imágenes se guardan en el dispositivo y no se descargan dos veces.</p><div class="row"><button class="btn" id="cClr">Vaciar caché</button><button class="btn" id="cChk">Comprobar imágenes rotas</button></div><p class="small" id="cOut"></p></div></div>`;
 const q=s=>b.querySelector(s);q('#dEx').onclick=()=>document.getElementById('export').click();q('#dIm').onclick=()=>document.getElementById('import').click();
 q('#dRs').onclick=()=>DS.modal({id:'rs',title:'Reiniciar la partida',cls:'sm',body:'<p>Se borrará toda tu colección, monedas, Mi Idol y progreso de este dispositivo. No se puede deshacer.</p>',actions:'<button class="btn" onclick="DS.closeModal(\'rs\')">Cancelar</button><button class="btn danger" id="rsOk">Borrar todo</button>'}).querySelector('#rsOk').onclick=()=>{['twiceGachaV3','twiceStats','twicePet2','twicePet','twicePetNotif','twiceCapsuleStation_v1'].forEach(k=>localStorage.removeItem(k));location.hash='#/home';location.reload()};
 q('#cClr').onclick=()=>IC.clear().then(()=>DS.toast('Caché vaciada'));q('#cChk').onclick=async()=>{const urls=[...new Set(photo().filter(own).map(c=>(photoFor(c)||{}).url).filter(Boolean))];let bad=0,i=0;for(const u of urls){i++;q('#cOut').textContent=`Comprobando ${i}/${urls.length}…`;if(!(await IC.load(u)))bad++}q('#cOut').textContent=`${urls.length} imágenes · ${bad} rotas${bad?' (se muestran como «imagen pendiente»)':''}`}}
})();
;
/* ================= home2.js ================= */
// v22.18 · Inicio estilo juego gacha profesional: hero con idol favorita, banners, calendario de acceso, misiones y menú rápido
(function(){
if(!UI.views.home)return;
const RK={UR:5,SSR:4,SR:3,R:2,N:1};
const ready=c=>{try{return PH.ready(c)&&!!(photoFor(c)||{}).url}catch(e){return false}};
const pool=()=>{if(data.homeMode==='member'&&data.homeMember){const M=CATALOG.members.find(m=>m.id===data.homeMember);if(M){const L=data.cards.filter(c=>!c.ext&&!c.game&&c.member===M.name&&ready(c)).sort((a,b)=>(data.owned[b.id]?1:0)-(data.owned[a.id]?1:0)||(RK[b.rarity]||0)-(RK[a.rarity]||0)).slice(0,8);if(L.length)return L}}
 const fav=(data.fav||[]).map(id=>data.cards.find(c=>c.id===id)).filter(c=>c&&ready(c));if(fav.length)return fav;
 const ph=data.cards.filter(c=>!c.ext&&!c.game&&ready(c));const o=ph.filter(c=>data.owned[c.id]);const src=o.length?o:ph;
 return src.slice().sort((a,b)=>(RK[b.rarity]||0)-(RK[a.rarity]||0)).slice(0,8)};
let timers=[];const clr=()=>{timers.forEach(clearInterval);timers=[]};
const tday=()=>new Date().toISOString().slice(0,10),yday=()=>new Date(Date.now()-864e5).toISOString().slice(0,10);
// ---- calendario de acceso (7 días) ----
const LOGIN=[{coins:200},{coins:300},{tickets:1},{coins:400},{gems:1},{coins:600},{tickets:3,gems:2}];
const lg=()=>{const L=data.login=data.login||{d:'',n:0};return L};
const lgNext=()=>{const L=lg();if(L.d===tday())return{can:false,day:L.n};return{can:true,day:L.d===yday()?(L.n%7)+1:1}};
window.HOME2={picker,claimLogin(){const x=lgNext();if(!x.can)return;const L=lg();L.d=tday();L.n=x.day;save();ECO.reward(LOGIN[x.day-1],'Acceso diario · día '+x.day);try{SND.sfx('reward')}catch(e){}if(window.ecoHud)ecoHud();UI.keepScroll=true;UI.route()},
 claimMis(j){const s=stLoad(),m=dailyPick()[j],M=DAILY[m.k];if(m.c||(s.d[M[0]]||0)<M[1])return;m.c=true;s.mis2.list[j]=m;stSave(s);ECO.reward(M[3],'Misión: '+M[2]);try{SND.sfx('reward')}catch(e){}if(window.ecoHud)ecoHud();UI.keepScroll=true;UI.route()}};
function picker(){const all=data.cards.filter(c=>!c.ext&&!c.game&&ready(c));
 const fav=new Set(data.fav||[]);const sorted=all.sort((a,b)=>(data.owned[b.id]?1:0)-(data.owned[a.id]?1:0)||(RK[b.rarity]||0)-(RK[a.rarity]||0)).slice(0,240);
 DS.modal({id:'fav',title:'★ Protagonista del Inicio',cls:'lg',body:`<p class="small"><b>Protagonista del Inicio:</b> una integrante…</p><div class="fpm">${CATALOG.members.map(m=>`<button data-hm="${m.id}" class="${data.homeMode==='member'&&data.homeMember===m.id?'on':''}">${esc(m.name)}</button>`).join('')}</div>`+(sorted.length?`<p class="small">…o tus photocards favoritas (toca para elegir; solo salen las que ya tienen la foto descargada).</p><div class="fp">${sorted.map(c=>`<div data-id="${c.id}" class="${fav.has(c.id)?'on':''}" data-src="${(photoFor(c)||{}).url}"><span>${esc(c.member)} · ${c.rarity||''}</span></div>`).join('')}</div>`:'<p>Aún no hay fotos descargadas. Espera a que termine la descarga o conéctate a internet.</p>'),actions:'<button class="btn pri" id="favOk">Listo</button>'});
 const root=document.querySelector('.modal-bg[data-mid=fav]');if(!root)return;
 root.querySelectorAll('.fp div').forEach(d=>{IC.load(d.dataset.src).then(u=>{if(u)d.style.backgroundImage=`url("${u}")`}).catch(()=>{});
  d.onclick=()=>{const l=data.fav=data.fav||[],i=l.indexOf(d.dataset.id);if(i>=0){l.splice(i,1);d.classList.remove('on')}else if(l.length<8){l.push(d.dataset.id);d.classList.add('on')}else DS.toast('Máximo 8 favoritas');data.homeMode=l.length?'cards':data.homeMode;save()}});
 root.querySelectorAll('[data-hm]').forEach(b=>b.onclick=()=>{data.homeMode='member';data.homeMember=b.dataset.hm;save();DS.closeModal('fav');UI.route()});
 const ok=root.querySelector('#favOk');if(ok)ok.onclick=()=>{DS.closeModal('fav');UI.keepScroll=true;UI.route()}}
const setBg=async(el,u)=>{if(!el||!u)return;const s=await IC.load(u).catch(()=>null);if(s&&el.isConnected){el.style.backgroundImage=`url("${s}")`;el.classList.add('in')}};
UI.view('home',{skin:'collection',render(c){
 clr();
 const L=ECO.colLevel(),free=PACKS.freeReady(),fl=PACKS.freeLeft(),P=pool(),ev=(typeof activeEvents==='function'?activeEvents():[]);
 const pct=free?100:Math.max(0,100-fl/(8*36e5)*100),lead=P[0],ln=lgNext(),Lg=lg();
 // banners
 const alb=lead&&typeof catAlbumByTitle==='function'?catAlbumByTitle(lead.album):null;const fp=alb?PACKS.get('album:'+alb.id):null;
 const B=[{k:'free',t:'Sobre diario',s:free?'¡Tu sobre gratis está listo!':'Próximo en '+PACKS.fmtT(fl),tag:free?'GRATIS':'8 h',cta:free?'Abrir ahora':'Ver sobres',go:free?"PACKS.open('free')":"UI.go('#/packs')",c:'#6fe3c6'}];
 if(fp)B.push({k:'feat',t:'Banner · '+lead.album,s:`${PACKS.costTxt(fp)} · ${fp.sub||'Cartas de este álbum'}`,tag:'DESTACADO',cta:'Abrir sobre',go:`PACKS.open('${fp.id}')`,c:'#d9a441'});
 if(ev.length)B.push({k:'ev',t:ev[0].name,s:`Termina en ${daysLeft(ev[0])} día${daysLeft(ev[0])===1?'':'s'} · misiones y carta especial`,tag:'EVENTO',cta:'Ver evento',go:"UI.go('#/events')",c:'#ffc23d'});
 B.push({k:'gacha',t:'Gacha K-pop',s:'Cápsulas con premios reales: álbumes, merch, tiras de fotos y MVs',tag:'GACHA',cta:'Girar',go:"UI.go('#/gacha')",c:'#b56bff'});
 const D=dailyPick(),st=stLoad(),dd=D.filter(m=>m.c).length;
 const all=data.cards.filter(c=>!c.ext&&!c.game),own=all.filter(c=>data.owned[c.id]);let prog=[];try{prog=catVisibleAlbums().filter(a=>a.physical!==false).map(a=>{const cs=all.filter(c=>c.album===a.title);return{a,n:cs.filter(c=>data.owned[c.id]).length,t:cs.length}}).filter(x=>x.n>0&&x.n<x.t).sort((x,y)=>y.n/y.t-x.n/x.t).slice(0,3)}catch(e){}
 const rw=r=>Object.entries(r||{}).filter(([k])=>ECO.CUR[k]).map(([k,n])=>ECO.CUR[k].i+n).join(' ');
 c.innerHTML=`<div class="hm">
 <section class="dk"><div class="dk-bg"></div><div class="dk-art"></div><div class="dk-card" id="dkC"></div>
  <div class="dk-top"><div class="dk-pl" onclick="UI.go('#/profile')"><div class="dk-av" id="dkAv"></div><div><b>ONCE</b><div class="dk-lvl">Nv ${L.l}<i><u style="width:${L.cur/L.need*100}%"></u></i></div></div></div>
   <div class="dk-en">🎁 ${free?'Sobre diario listo':'Sobre en '+PACKS.fmtT(fl)}<i><u style="width:${pct}%"></u></i></div></div>
  <div class="dk-side l"><button class="dk-b" onclick="UI.go('#/events')"><span>🎯</span>Misiones<em ${dd<D.length?'':'hidden'}>${D.length-dd}</em></button><button class="dk-b" onclick="UI.go('#/binder')"><span>📚</span>Colección</button><button class="dk-b" onclick="UI.go('#/games')"><span>🎮</span>Juegos</button></div>
  <div class="dk-side r"><button class="dk-b" onclick="UI.go('#/gacha')"><span>🎰</span>Gacha</button><button class="dk-b" onclick="UI.go('#/pet')"><span>🐣</span>Mi Idol</button><button class="dk-b" onclick="UI.go('#/events')"><span>🎉</span>Eventos${ev.length?`<em>${ev.length}</em>`:''}</button></div>
  <div class="dk-lead"><b id="dkN"></b><small id="dkS"></small><div class="dk-dots" id="dkD"></div></div>
  <button class="dk-fav" id="dkF">★ Protagonista</button>
  <button class="dk-go" id="dkG">${free?'ABRIR SOBRE GRATIS':'SOBRES'}<small>${free?'Tu sobre diario te espera':'Ver todos los sobres'}</small></button>
  ${P.length?'':'<div class="dk-empty">Descargando fotos de tus idols…<br>Vuelve en un momento o pulsa ★ Favoritas.</div>'}</section>
 <div class="hm-r">
  <section class="bn" id="bn"><div class="bn-track">${B.map((b,i)=>`<article class="bn-c" style="--bc:${b.c}" data-i="${i}"><div class="bn-art"></div><div class="bn-sh"></div><span class="bn-tag">${b.tag}</span><div class="bn-tx"><b>${esc(b.t)}</b><small>${esc(b.s)}</small><button class="bn-cta" onclick="${b.go}">${b.cta} ›</button></div></article>`).join('')}</div><div class="bn-dots">${B.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div></section>
  <div class="hm-2">
   <section class="pn"><header><h3>📅 Acceso diario</h3><span class="small">Racha ${Lg.n||0}/7</span></header><div class="lg7">${LOGIN.map((r,i)=>{const d=i+1,done=Lg.d===tday()?d<=Lg.n:(Lg.d===yday()?d<=Lg.n:false),today=ln.can&&d===ln.day;return`<div class="lgd ${done?'done':''} ${today?'today':''}"><small>Día ${d}</small><b>${rw(r)}</b>${done?'<i>✓</i>':''}</div>`}).join('')}</div><button class="btn ${ln.can?'pri':''} block" ${ln.can?'':'disabled'} onclick="HOME2.claimLogin()">${ln.can?'Reclamar día '+ln.day:'Vuelve mañana'}</button></section>
   <section class="pn"><header><h3>🎯 Misiones de hoy</h3><span class="small">${dd}/${D.length}</span></header><div class="msl">${D.map((m,j)=>{const M=DAILY[m.k],v=Math.min(M[1],st.d[M[0]]||0),ok=v>=M[1];return`<div class="ms"><div><b>${m.c?'✓ ':''}${M[2]}</b><small>${rw(M[3])}</small>${DS.bar(v,M[1])}</div><button class="btn sm ${ok&&!m.c?'pri':''}" ${ok&&!m.c?'':'disabled'} onclick="HOME2.claimMis(${j})">${m.c?'✓':ok?'Reclamar':v+'/'+M[1]}</button></div>`}).join('')}</div></section>
  </div>
  <section class="pn"><header><h3>📚 Tu colección</h3><span class="small">${own.length} / ${all.length}</span></header>${DS.bar(own.length,all.length||1)}<div class="msl">${prog.map(x=>`<a class="ms" href="#/binder/${x.a.id}" style="text-decoration:none;color:inherit"><div><b>${esc(x.a.title)}</b>${DS.bar(x.n,x.t)}</div><span class="small">${x.n}/${x.t}</span></a>`).join('')||'<span class="small">Abre tu primer sobre para empezar un álbum.</span>'}</div><button class="btn block" onclick="UI.go('#/binder')">Ver colección</button></section>
 </div></div>`;
 const q=s=>c.querySelector(s);q('#dkF').onclick=picker;q('#dkG').onclick=()=>free?PACKS.open('free'):UI.go('#/packs');
 // hero rotatorio
 let i=0;const art=q('.dk-art'),bg=q('.dk-bg');
 const show=async k=>{if(!P.length)return;const cd=P[k%P.length];i=k%P.length;
  q('#dkN').innerHTML=esc(cd.member);q('#dkS').innerHTML=`<span class="r">${cd.rarity||''}</span>${esc(cd.album||'')}`;
  q('#dkD').innerHTML=P.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('');
  const cardMode=data.homeMode!=='member'&&data.owned[cd.id],hold=q('#dkC');
  if(data.homeMode==='member'){let pt=null;try{pt=JSON.parse(localStorage.getItem('twicePet2'))}catch(e){}const mine=pt&&CATALOG.members.find(m=>m.id===pt.member&&m.name===cd.member);q('#dkS').innerHTML+=` <button class="dk-mi" onclick="UI.go('#/pet')">🐣 ${mine?'Nv '+pt.level+' · cuidar':'Mi Idol'}</button>`}
  const u=await IC.load((photoFor(cd)||{}).url).catch(()=>null);if(!u||!art.isConnected)return;
  art.style.opacity=0;if(hold)hold.style.opacity=0;setTimeout(()=>{bg.style.backgroundImage=`url("${u}")`;
   if(cardMode&&hold){art.style.backgroundImage='none';hold.innerHTML=faceHTML(cd,false);hold.style.opacity=1;hold.onclick=()=>openCard(cd.id)}
   else{if(hold){hold.innerHTML='';}art.style.backgroundImage=`url("${u}")`;art.style.opacity=1}},250);art.onclick=()=>openCard(cd.id)};
 show(0);if(P.length>1)timers.push(setInterval(()=>{if(!art.isConnected){clr();return}show(i+1)},6500));
 if(lead)setBg(q('#dkAv'),(photoFor(lead)||{}).url);
 // banners: arte con distintas cartas, auto-avance
 c.querySelectorAll('.bn-c').forEach((el,j)=>{const cd=P[(j+1)%Math.max(1,P.length)];if(cd)setBg(el.querySelector('.bn-art'),(photoFor(cd)||{}).url)});
 const tr=q('.bn-track'),dots=[...c.querySelectorAll('.bn-dots i')];let bi=0;
 const go=n=>{bi=(n+B.length)%B.length;tr.scrollTo({left:tr.children[bi].offsetLeft-tr.offsetLeft,behavior:'smooth'});dots.forEach((d,j)=>d.classList.toggle('on',j===bi))};
 tr.addEventListener('scroll',()=>{const w=tr.children[0].offsetWidth+12,n=Math.round(tr.scrollLeft/w);dots.forEach((d,j)=>d.classList.toggle('on',j===n));bi=n},{passive:true});
 dots.forEach((d,j)=>d.onclick=()=>go(j));timers.push(setInterval(()=>{if(!tr.isConnected){clr();return}go(bi+1)},5500));
}});
})();
;
/* ================= loading.js ================= */
// v22.16 · Pantalla de carga: descarga y guarda las fotos antes de entrar (como la descarga de datos de un gacha)
(function(){
const TIPS=['Las fotos se guardan en tu dispositivo: después funcionan sin conexión.','Cada sobre solo reparte cartas con su foto ya descargada.','Elige tus idols favoritas en Inicio con ★ Favoritas.','Abre el sobre diario cada 8 h para no perder monedas.','Completa un álbum de cromos para ganar recompensas.','En Ajustes › Imágenes puedes repetir la descarga cuando quieras.'];
const KEY='twiceBootV';
const css=document.createElement('style');css.textContent=`#boot{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;text-align:center;color:#f6eef9;background:radial-gradient(700px 500px at 50% 25%,#5a2a22 0,transparent 70%),radial-gradient(600px 400px at 90% 100%,#d9a44133,transparent 70%),#100b0d;transition:opacity .5s}
#boot.out{opacity:0;pointer-events:none}
#boot .bt-logo{font:800 clamp(28px,8vw,46px)/1 var(--f-disp,system-ui);letter-spacing:.04em;background:linear-gradient(135deg,#f6e3a8,#d9a441);-webkit-background-clip:text;background-clip:text;color:transparent}
#boot .bt-sub{font-size:13px;letter-spacing:.3em;color:#b9a6c6}
#boot .bt-orb{width:84px;height:84px;border-radius:50%;background:conic-gradient(from 0deg,#d9a441,#f6e3a8,#7fe8c9,#a78bfa,#d9a441);animation:btspin 2.4s linear infinite;display:grid;place-items:center}
#boot .bt-orb::after{content:'♥';width:70px;height:70px;border-radius:50%;background:#100b0d;display:grid;place-items:center;font-size:30px;color:#d9a441}
@keyframes btspin{to{transform:rotate(360deg)}}
#boot .bt-bar{width:min(380px,84vw);height:14px;border-radius:99px;background:#ffffff1a;overflow:hidden;border:1px solid #ffffff2a}
#boot .bt-bar u{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#d9a441,#f6e3a8);transition:width .3s}
#boot .bt-st{font-size:13px;color:#d9c8e4;min-height:18px}
#boot .bt-tip{font-size:12px;color:#9c88aa;max-width:340px;min-height:34px}
#boot .bt-b{display:flex;gap:10px;min-height:42px}
#boot button{border:0;border-radius:99px;padding:11px 22px;font:700 14px var(--f-ui,system-ui);cursor:pointer;background:linear-gradient(135deg,#f6e3a8,#d9a441);color:#24160a}
#boot button.s{background:#ffffff1c;color:#f6eef9}`;
document.head.appendChild(css);
const $=document.createElement('div');$.id='boot';
$.innerHTML='<div class="bt-orb"></div><div><div class="bt-logo">TWICE</div><div class="bt-sub">GACHA COLLECTOR</div></div><div class="bt-steps"><i data-s="0">Datos</i><i data-s="1">Fotos</i><i data-s="2">Listo</i></div><div class="bt-bar"><u></u></div><div class="bt-pct">0%</div><div class="bt-st">Comprobando datos…</div><div class="bt-tip"></div><div class="bt-b"></div>';
document.body.appendChild($);
const bar=$.querySelector('u'),st=$.querySelector('.bt-st'),tip=$.querySelector('.bt-tip'),btn=$.querySelector('.bt-b');
let ti=Math.floor(Math.random()*TIPS.length);const rot=()=>{tip.textContent='💡 '+TIPS[ti++%TIPS.length]};rot();const tt=setInterval(rot,3800);
let closed=false;const close=()=>{if(closed)return;closed=true;clearInterval(tt);$.classList.add('out');setTimeout(()=>$.remove(),600)};
window.BOOT={close};
const pctEl=$.querySelector('.bt-pct'),steps=[...$.querySelectorAll('.bt-steps i')];
const set=(p,t)=>{p=Math.max(3,Math.min(100,p));bar.style.width=p+'%';pctEl.textContent=Math.round(p)+'%';const k=p>=100?2:p>=8?1:0;steps.forEach((e,i)=>{e.classList.toggle('on',i===k);e.classList.toggle('done',i<k)});if(t)st.textContent=t};
async function run(){
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const rc=()=>window.PH?PH.readyCount():{n:0,t:0};
 const before=rc();let last=0;try{last=+JSON.parse(localStorage.getItem(KEY)||'{}').t||0}catch(e){}
 const warm=before.t&&before.n>=Math.max(20,before.t*.6)&&Date.now()-last<3*864e5;
 if(navigator.onLine===false||warm){ // ya está en caché o sin red: entrada rápida
  set(60,navigator.onLine===false?'Sin conexión · usando fotos guardadas':'Datos en caché · '+before.n+' fotos listas');await sleep(700);set(100,'¡Listo!');await sleep(250);close();
  if(warm&&navigator.onLine!==false)setTimeout(()=>{try{PH.prepareAll().then(()=>localStorage.setItem(KEY,JSON.stringify({t:Date.now(),ok:1})))}catch(e){}},3000);return}
 set(5,'Buscando las fotos disponibles…');
 try{if(typeof loadFandom==='function'&&typeof fdm!=='undefined'&&!fdm._n)await Promise.race([loadFandom(true),sleep(20000)])}catch(e){}
 try{if(typeof loadCovers==='function')await Promise.race([loadCovers(false),sleep(8000)])}catch(e){}
 // aviso de tamaño: solo la primera vez (lo ya guardado no se vuelve a descargar)
 const urls=new Set();data.cards.forEach(c=>{if(c.ext||c.game||PH.ready(c))return;try{const u=c.kind==='group'?groupFor(c.album):c.kind==='cover'?covers[c.album]:(photoFor(c)||{}).url;if(u)urls.add(u)}catch(e){}});
 const n=urls.size,mb=Math.max(1,Math.round(n*0.2));
 if(n>12&&!(JSON.parse(localStorage.getItem(KEY)||'{}').ok)){
  const cell=navigator.connection&&/cellular|2g|3g/.test((navigator.connection.type||'')+(navigator.connection.effectiveType||''));
  const go=await new Promise(res=>{st.innerHTML=`<b>Descarga inicial: ≈ ${mb} MB</b> (${n} fotos)<br>Solo se hace <b>una vez</b>: después las fotos quedan guardadas en tu dispositivo y funciona sin conexión.${cell?'<br>⚠ Parece que usas datos móviles; mejor con Wi-Fi.':''}`;set(4);
   btn.innerHTML='<button id="btGo">Descargar ahora</button><button class="s" id="btLater">Más tarde</button>';btn.querySelector('#btGo').onclick=()=>res(true);btn.querySelector('#btLater').onclick=()=>res(false)});
  btn.innerHTML='';if(!go){set(100,'Podrás descargarlas desde Ajustes › Imágenes o al abrir un sobre');await sleep(900);close();return}}
 set(8,'Descargando fotos…');
 let skip=false;setTimeout(()=>{if(closed)return;btn.innerHTML='<button class="s" id="btSkip">Entrar y seguir en segundo plano</button>';btn.firstChild.onclick=()=>{skip=true;close()}},6000);
 let alb=0;const tick=setInterval(()=>{const r=rc();if(!closed&&r.t)st.textContent=`Descargando fotos… ${r.n}/${r.t}`},700);
 try{
  await Promise.race([PH.prepareAll((i,n,al)=>{alb=i;set(8+i/Math.max(1,n)*90,al&&i<n?'Álbum: '+al:null)}),sleep(150000)]);
 }catch(e){}
 clearInterval(tick);try{localStorage.setItem(KEY,JSON.stringify({t:Date.now(),ok:1}))}catch(e){}
 if(skip||closed)return;const r=rc();set(100,`¡Listo! ${r.n} fotos guardadas · no se vuelve a descargar`);await sleep(600);close();
}
const _s=UI.start;UI.start=function(){_s.apply(this,arguments);setTimeout(()=>run().catch(()=>close()),60)};
setTimeout(close,170000); // seguridad
})();
;
/* ================= boot.js ================= */
// arranque: todos los módulos están cargados
UI.start();
;
