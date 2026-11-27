(()=>{'use strict';
/* refresh: selalu mulai dari sampul (browser tidak boleh me-restore posisi scroll lama) */
if('scrollRestoration'in history)history.scrollRestoration='manual';
scrollTo(0,0);
/* tanpa zoom: iOS Safari mengabaikan user-scalable=no, jadi gesture pinch dicegat di sini.
   Double-tap zoom dicegah lewat CSS touch-action:manipulation. Scroll 1 jari, tap, dan keyboard tidak terpengaruh. */
['gesturestart','gesturechange','gestureend'].forEach(k=>document.addEventListener(k,e=>e.preventDefault()));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
const C=window.WEDDING_CONFIG||{},$=id=>document.getElementById(id);
const set=(id,v)=>{const e=$(id);if(e)e.textContent=v??''};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const guest=(new URLSearchParams(location.search).get('to')||'').trim().slice(0,80);
const g=C.couple?.groom||{},b=C.couple?.bride||{},ev=C.event||{},a=ev.akad||{},r=ev.reception||{};
const gName=g.nickname||'[NAMA PRIA]',bName=b.nickname||'[NAMA WANITA]',names=`${gName} & ${bName}`;

/* tema */
const th=C.theme||{},root=document.documentElement.style;
[['--ink',th.ink],['--green',th.green],['--orange',th.accent],['--paper',th.paper],['--text',th.text]].forEach(([k,v])=>v&&root.setProperty(k,v));
document.title=C.copy?.title||'Undangan Pernikahan';

/* nama: dua baris besar "Pria / & / Wanita" */
function setNames(id){const e=$(id);if(!e)return;e.textContent='';const s1=document.createElement('span'),amp=document.createElement('i'),s2=document.createElement('span');s1.textContent=gName;amp.textContent='&';s2.textContent=bName;e.append(s1,amp,s2);e.setAttribute('aria-label',names)}
['coverNames','heroNames'].forEach(setNames);set('loaderNames',C.copy?.hashtag||names);set('closingNames',names);

/* teks */
set('guestName',guest||'Nama Tamu');set('heroDate',ev.dateLabel||'[TANGGAL ACARA]');set('openingCopy',C.copy?.opening);
set('quoteText',`“${C.copy?.quote||''}”`);set('quoteSource',C.copy?.quoteSource);set('closingCopy',C.copy?.closing);set('thankYou',C.copy?.thankYou);
set('groomName',g.fullName);set('brideName',b.fullName);set('groomParents',g.parents);set('brideParents',b.parents);
[['groomPhoto',g],['bridePhoto',b]].forEach(([id,o])=>{const e=$(id);e.src=o.photo||'';e.alt=o.alt||''});
[['groomIg',g],['brideIg',b]].forEach(([id,o])=>{const h=String(o.instagram||'').replace(/^@/,'').replace(/[^\w.]/g,'');if(h){const e=$(id);e.href='https://instagram.com/'+h;e.hidden=false}});
set('akadDate',a.dateLabel);set('akadTime',a.time);set('akadVenue',a.venue);set('akadAddress',a.address);
set('receptionDate',r.dateLabel);set('receptionTime',r.time);set('receptionVenue',r.venue);set('receptionAddress',r.address);
$('routeBtn').href=ev.mapsUrl||'#';

/* section on/off */
const hide=(id,on)=>{const e=$(id);if(e&&!on)e.hidden=true};
hide('story',C.sections?.story!==false&&C.story?.enabled!==false);hide('gallery',C.sections?.gallery!==false);hide('rsvp',C.sections?.rsvp!==false);hide('gift',C.sections?.gifts!==false&&C.gifts?.enabled!==false);
if(C.sections?.wishes===false){$('wishList').hidden=true;document.querySelector('#rsvpForm textarea').hidden=true}

/* kisah, galeri, lightbox */
$('storyList').innerHTML=(C.story?.moments||[]).map(m=>`<article class="story-item"><img width="72" height="72" loading="lazy" decoding="async" src="${safe(m.illustration)}" alt=""><div><small>${safe(m.date)}</small><h3>${safe(m.title)}</h3><p>${safe(m.text)}</p></div></article>`).join('');
const gallery=C.gallery||[];let photoIndex=0;
const FRAME='assets/illustrations/tint/06_frame_floral_maroon.webp';
$('galleryGrid').innerHTML=gallery.map((p,i)=>`<button type="button" class="g-item" data-photo="${i}" aria-label="Buka foto ${i+1}"><span class="g-photo"><img loading="lazy" src="${safe(p.src)}" alt="${safe(p.alt)}"></span><img class="g-frame" width="334" height="343" loading="lazy" decoding="async" src="${FRAME}" alt="">${/placeholder/i.test(p.src||'')?'<span class="g-pill">♡ Ganti foto di sini ♡</span>':''}</button>`).join('');
let lbOpener=null;
function openPhoto(i){if(!gallery.length)return;photoIndex=(i+gallery.length)%gallery.length;const p=gallery[photoIndex];$('lightboxImage').src=p.src;$('lightboxImage').alt=p.alt||'';if($('lightbox').hidden){lbOpener=document.activeElement;$('lightbox').hidden=false;$('closeLightbox').focus()}}
function closePhoto(){$('lightbox').hidden=true;$('lightboxImage').removeAttribute('src');if(lbOpener&&lbOpener.focus)lbOpener.focus()}
$('galleryGrid').addEventListener('click',e=>{const x=e.target.closest('[data-photo]');if(x)openPhoto(+x.dataset.photo)});
$('closeLightbox').onclick=closePhoto;$('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))closePhoto()});
addEventListener('keydown',e=>{if($('lightbox').hidden)return;if(e.key==='Escape')closePhoto();else if(e.key==='ArrowLeft')openPhoto(photoIndex-1);else if(e.key==='ArrowRight')openPhoto(photoIndex+1)});$('prevPhoto').onclick=()=>openPhoto(photoIndex-1);$('nextPhoto').onclick=()=>openPhoto(photoIndex+1);
let touchX=0;$('lightbox').addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
$('lightbox').addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>45)openPhoto(photoIndex+(d<0?1:-1))},{passive:true});

/* hadiah */
let toastTimer=0;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function legacyCopy(t){const x=document.createElement('textarea');x.value=t;x.setAttribute('readonly','');x.style.cssText='position:fixed;top:0;left:0;opacity:0;font-size:16px';document.body.append(x);x.focus();x.select();x.setSelectionRange(0,t.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}x.remove();return ok}
function copyText(t){const done=()=>toast('Berhasil disalin'),fail=()=>legacyCopy(t)?done():toast('Gagal menyalin. Salin manual: '+t);
  if(navigator.clipboard?.writeText&&window.isSecureContext)navigator.clipboard.writeText(t).then(done).catch(fail);else fail()}
$('accounts').innerHTML=(C.gifts?.accounts||[]).map(x=>`<div class="account-card"><small>${safe(x.bank)}</small><p><b>${safe(x.number)}</b></p><p>a.n. ${safe(x.holder)}</p><button class="btn" data-copy="${safe(x.number)}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>Salin Rekening</button></div>`).join('');
$('accounts').addEventListener('click',e=>{const x=e.target.closest('[data-copy]');if(x)copyText(x.dataset.copy)});
set('giftAddress',C.gifts?.shippingAddress||'');

/* buka undangan + musik */
const music=$('bgMusic'),mt=$('musicToggle');let opened=false,resumeAfterHidden=false;
function musicUI(on){mt.textContent=on?'♫':'Ⅱ';mt.setAttribute('aria-pressed',String(on))}
$('openInvite').addEventListener('click',()=>{
  if(opened)return;opened=true;$('openInvite').disabled=true;
  const tr=$('bookTransition');tr.classList.add('active');
  setTimeout(()=>{$('cover').hidden=true;document.body.classList.remove('locked');$('mainContent').inert=false;scrollTo(0,0);tr.classList.remove('active');dispatchEvent(new Event('resize'))},650);
  $('musicToggle').hidden=!(C.music?.enabled&&C.music?.url);$('bottomNav').hidden=!C.sections?.bottomNav;
  if(C.music?.enabled&&C.music.url){music.src=C.music.url;music.play().then(()=>musicUI(true)).catch(()=>musicUI(false))}
});
music.addEventListener('error',()=>{musicUI(false);if(opened&&music.src)toast('Musik tidak dapat dimuat')});
/* musik berhenti saat tab/aplikasi disembunyikan, lanjut saat kembali */
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(!music.paused){resumeAfterHidden=true;music.pause()}}else if(resumeAfterHidden){resumeAfterHidden=false;music.play().catch(()=>musicUI(false))}});
mt.onclick=()=>{resumeAfterHidden=false;if(music.paused)music.play().then(()=>musicUI(true)).catch(()=>toast('Musik tidak dapat diputar'));else{music.pause();musicUI(false)}};
$('calendarBtn').onclick=()=>{const fmt=x=>{const d=new Date(x);return isNaN(d)?null:d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')},
  esc=t=>String(t||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[,;]/g,m=>'\\'+m);
  const st=fmt(a.startISO||ev.dateISO),en=fmt(r.endISO||a.endISO||ev.dateISO);
  if(!st||!en){toast('Tanggal acara belum valid');return}
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Undangan//ID','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${st}-${Math.random().toString(36).slice(2)}@undangan`,`DTSTAMP:${fmt(Date.now())}`,`DTSTART:${st}`,`DTEND:${en}`,`SUMMARY:${esc(names+' - Pernikahan')}`,`LOCATION:${esc(ev.locationName)}`,`DESCRIPTION:${esc(C.copy?.description)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'})),l=document.createElement('a');l.href=url;l.download='undangan-pernikahan.ics';l.hidden=true;document.body.append(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),4000)};

/* RSVP + ucapan (satu form, satu request POST ke Google Apps Script) */
/* URL endpoint diatur di config.js → RSVP_API_URL. Kosong = RSVP belum aktif (tidak ada simulasi sukses). */
const endpoint=(()=>{const v=String(typeof RSVP_API_URL==='string'?RSVP_API_URL:'').trim();return /^https:\/\/\S+$/i.test(v)?v:''})(),pageSize=C.backend?.pageSize||4;
const rsvpForm=$('rsvpForm'),rsvpStatus=$('rsvpStatus');let sending=false;
function say(t,kind){rsvpStatus.textContent=t;rsvpStatus.className='form-status'+(kind?' '+kind:'')}
async function post(p){const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),20000);
  try{const res=await fetch(endpoint,{method:'POST',body:JSON.stringify(p),headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',credentials:'omit',signal:ctl.signal});
    if(!res.ok)throw new Error('HTTP '+res.status);
    let d=null;try{d=await res.json()}catch(e){}
    /* sukses hanya jika server benar-benar menjawab ok */
    if(d&&(d.ok===true||d.success===true||d.result==='success'))return{ok:true};
    return{ok:false,reason:(d&&(d.error||d.message))?String(d.error||d.message).slice(0,120):'Server tidak mengonfirmasi penyimpanan.'}}
  catch(e){return{ok:false,reason:e.name==='AbortError'?'Waktu tunggu habis.':'Tidak dapat terhubung ke server.'}}
  finally{clearTimeout(timer)}}
$('rsvpName').value=guest;
const guestSel=rsvpForm.elements.guests,statusSel=rsvpForm.elements.status;
const syncGuests=()=>{const no=statusSel.value==='Tidak hadir';guestSel.disabled=no;guestSel.setAttribute('aria-disabled',String(no))};
statusSel.addEventListener('change',syncGuests);syncGuests();
if(!endpoint)say('Sistem RSVP belum dikonfigurasi. Konfirmasi belum dapat dikirim.','err');
let wishes=[],wishPage=0,counts={hadir:0,tidak:0,ragu:0};
function renderCounts(){const v=[counts.hadir,counts.tidak,counts.ragu];$('counts').querySelectorAll('b').forEach((el,i)=>el.textContent=v[i]||0)}
function renderWishes(){const vis=wishes.slice(0,(wishPage+1)*pageSize);$('wishList').innerHTML=vis.map(x=>`<article class="wish-card"><b>${safe(x.name)}</b>${x.status?`<em>${safe(x.status)}</em>`:''}<p>${safe(x.message)}</p></article>`).join('');$('moreWishes').hidden=vis.length>=wishes.length}
async function loadWishes(){if(!endpoint||document.hidden)return;try{const u=new URL(endpoint);u.searchParams.set('action','wishes');const res=await fetch(u,{credentials:'omit'});if(!res.ok)throw Error();const d=await res.json();
  if(Array.isArray(d.wishes)){wishes=d.wishes;renderWishes()}if(d.counts){counts=d.counts;renderCounts()}}catch(e){/* data yang sudah tampil tetap dipertahankan */}}
rsvpForm.addEventListener('submit',async e=>{e.preventDefault();if(sending)return;
  const f=new FormData(rsvpForm),name=String(f.get('name')||'').trim().replace(/\s+/g,' ').slice(0,80),message=String(f.get('message')||'').trim().slice(0,500),status=String(f.get('status')||''),
    hadir=status==='Hadir',guests=status==='Tidak hadir'?0:Math.max(1,Math.min(10,Number(f.get('guests'))||1));
  /* validasi */
  if(!endpoint){say('Sistem RSVP belum dikonfigurasi. Konfirmasi belum dapat dikirim.','err');return}
  if(name.length<2){say('Mohon isi nama Anda (minimal 2 huruf).','err');rsvpForm.elements.name.setAttribute('aria-invalid','true');rsvpForm.elements.name.focus();return}
  rsvpForm.elements.name.removeAttribute('aria-invalid');
  if(!['Hadir','Tidak hadir','Masih ragu'].includes(status)){say('Pilih konfirmasi kehadiran.','err');return}
  if(hadir&&!(guests>=1)){say('Pilih jumlah tamu yang hadir.','err');return}
  /* kirim */
  sending=true;const btn=rsvpForm.querySelector('button[type=submit]'),label=btn.textContent;btn.disabled=true;btn.textContent='Mengirim…';rsvpForm.setAttribute('aria-busy','true');say('Mengirim konfirmasi…');
  const res=await post({action:'rsvp',name,status,guests,message,timestamp:new Date().toISOString()});
  sending=false;btn.textContent=label;rsvpForm.removeAttribute('aria-busy');
  if(res.ok){
    say('Terima kasih, konfirmasi dan ucapan Anda telah tersimpan.','ok');rsvpForm.elements.message.value='';
    if(message&&C.sections?.wishes!==false){wishes.unshift({name,message,status});wishPage=0;renderWishes()}
    loadWishes();setTimeout(()=>{btn.disabled=false},4000)
  }else{
    /* input dipertahankan agar bisa dicoba lagi */
    say('Belum terkirim: '+res.reason+' Isian Anda masih ada di form, silakan coba lagi.','err');btn.disabled=false}
});
$('moreWishes').onclick=()=>{wishPage++;renderWishes()};renderWishes();loadWishes();if(endpoint)setInterval(loadWishes,30000);

/* hitung mundur */
const target=new Date(ev.dateISO||'2027-01-03T08:00:00+07:00').getTime();
$('countdown').innerHTML=['Hari','Jam','Menit','Detik'].map(l=>`<div><b>00</b><span>${l}</span></div>`).join('');
const cdb=[...$('countdown').querySelectorAll('b')];let cdTimer=0;
function countdown(){const d=isFinite(target)?Math.max(0,target-Date.now()):0,v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
  cdb.forEach((b,i)=>{const t=String(v[i]).padStart(2,'0');if(b.textContent!==t)b.textContent=t});if(d===0)clearInterval(cdTimer)}
countdown();cdTimer=setInterval(countdown,1000);

/* efek */
if(C.effects?.autoDisableOnLowPower!==false&&((navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)))document.body.classList.add('low-power');
/* animasi masuk: isi tiap section bergerak masuk satu per satu, diulang tiap section muncul */
const blocks=[...document.querySelectorAll('.section,.cover-inner')];
blocks.forEach(sec=>{let i=0;[...sec.children].forEach(el=>{
  const kids=el.matches('.gallery-grid,.story-list,.counts')?[...el.children]:[el],step=el.matches('.gallery-grid')?.08:.13;
  kids.forEach((k,n)=>{const cls=k.matches('.art')?'z':k.matches('.head,.big-names,.big-title,.of')?'d':k.matches('.frame')?(sec.dataset.side||'l'):k.matches('.ev')?(i%2?'r':'l'):'u';
    k.classList.add('rv',cls);k.style.setProperty('--d',Math.min((i+n)*step,1.1).toFixed(2)+'s')});i+=kids.length})});
document.querySelectorAll('.profile').forEach((s,n)=>{const f=s.querySelector('.frame');f.classList.remove('l','r','z');f.classList.add(n%2?'r':'l')});
if('IntersectionObserver'in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{const on=e.isIntersecting&&e.intersectionRatio>0;if(on)e.target.classList.add('in');e.target.classList.toggle('vis',on)}),{threshold:[0,.12],rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.section,.cover').forEach(e=>io.observe(e));
  /* dock: tandai bagian yang sedang tampil */
  const links=[...document.querySelectorAll('#bottomNav a')],map=new Map(links.map(l=>[l.getAttribute('href').slice(1),l]));
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('active'));map.get(e.target.id)?.classList.add('active')}}),{rootMargin:'-45% 0px -45% 0px'});
  map.forEach((_,id)=>{const s=$(id);if(s)so.observe(s)});
}else{document.body.classList.add("ready");document.querySelectorAll(".section,.cover").forEach(e=>e.classList.add("in"))}
/* klik dock: perpindahan antar section dibuat pelan (durasi diatur di DUR, milidetik) */
const DUR=1600,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;let anim=0;
function glide(y){const h=document.documentElement,from=scrollY,dist=y-from,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  cancelAnimationFrame(anim);if(reduce||Math.abs(dist)<2){scrollTo(0,y);return}
  const dur=Math.min(DUR+Math.abs(dist)/innerHeight*350,3200),t0=performance.now();h.style.scrollSnapType='none';h.style.scrollBehavior='auto';
  const stop=()=>{cancelAnimationFrame(anim);end()},end=()=>{h.style.scrollSnapType='';h.style.scrollBehavior='';['wheel','touchstart','keydown'].forEach(k=>removeEventListener(k,stop))};
  ['wheel','touchstart','keydown'].forEach(k=>addEventListener(k,stop,{passive:true,once:true}));
  const step=now=>{const p=Math.min((now-t0)/dur,1);scrollTo(0,from+dist*ease(p));if(p<1)anim=requestAnimationFrame(step);else end()};anim=requestAnimationFrame(step)}
document.querySelectorAll('#bottomNav a').forEach(l=>l.addEventListener('click',e=>{const s=$(l.getAttribute('href').slice(1));if(!s)return;e.preventDefault();glide(s.getBoundingClientRect().top+scrollY)}));
/* scroll mouse/trackpad dibuat sedikit lambat & halus (SPEED: makin kecil makin lambat; EASE: makin kecil makin lembut) */
if(matchMedia('(pointer: fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const SPEED=.55,EASE=.075;let target=0,cur=0,run=0,idle=0;const root=document.documentElement,max=()=>root.scrollHeight-innerHeight;
  const inner=el=>{for(;el&&el!==document.body;el=el.parentElement){const s=getComputedStyle(el);if(/(auto|scroll)/.test(s.overflowY)&&el.scrollHeight>el.clientHeight)return true}return false};
  const loop=()=>{cur+=(target-cur)*EASE;if(Math.abs(target-cur)<.5){cur=target;scrollTo(0,cur);run=0;return}scrollTo(0,cur);run=requestAnimationFrame(loop)};
  addEventListener('wheel',e=>{if(e.ctrlKey||document.body.classList.contains('locked')||!$('lightbox').hidden||inner(e.target))return;
    e.preventDefault();cancelAnimationFrame(anim);if(!run){cur=target=scrollY}
    root.style.scrollSnapType='none';root.style.scrollBehavior='auto';clearTimeout(idle);idle=setTimeout(()=>{root.style.scrollSnapType='';root.style.scrollBehavior=''},400);
    const d=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*innerHeight:e.deltaY;
    target=Math.max(0,Math.min(max(),target+d*SPEED));if(!run)run=requestAnimationFrame(loop)},{passive:false});
  addEventListener('scroll',()=>{if(!run)cur=target=scrollY},{passive:true});
}
/* gerakan mengikuti scroll: ilustrasi & bingkai bergeser pelan (parallax), ilustrasi sedikit miring */
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.body.classList.contains('low-power')){
  const par=[...document.querySelectorAll('.main-content .art,.main-content .frame')];let tk=false;
  const frame=()=>{tk=false;const vh=innerHeight;par.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<-120||r.top>vh+120)return;const d=(r.top+r.height/2-vh/2)/vh;el.style.top=(d*-30).toFixed(1)+'px';if(el.classList.contains('art'))el.style.rotate=(d*5).toFixed(2)+'deg'})};
  addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(frame)}},{passive:true});addEventListener('resize',frame);
}
let petalLayer=null;const layer=()=>petalLayer||(petalLayer=Object.assign(document.createElement('div'),{className:'petal-layer','aria-hidden':'true'}),document.body.append(petalLayer),petalLayer);
if(C.effects?.petals&&!document.body.classList.contains('low-power')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let n=0;const t=setInterval(()=>{if(n++>16){clearInterval(t);return}if(document.hidden)return;const p=document.createElement('span');p.className='petal';p.textContent='✿';p.style.left=Math.random()*94+'%';p.style.animationDuration=(6+Math.random()*5)+'s';layer().append(p);setTimeout(()=>p.remove(),12000)},850)}
if(C.effects?.easterEgg){document.querySelectorAll('.art').forEach(el=>el.addEventListener('click',()=>{const h=document.createElement('span');h.className='petal';h.textContent='♡';h.style.left='50%';h.style.top='45%';h.style.fontSize='28px';h.style.animationDuration='2s';layer().append(h);setTimeout(()=>h.remove(),2100)}))}

/* loader: tunggu semua gambar & font utama + durasi minimum, baru buka halaman */
const items=[...new Set([...document.querySelectorAll('.cover img,#home img,#couple img')].map(i=>i.currentSrc||i.src).filter(Boolean))];
let loaded=0,fontsDone=false;const total=items.length+1,MIN=2200,MAX=7000;
items.forEach(src=>{const im=new Image();im.onload=im.onerror=()=>{loaded++};im.src=src});
Promise.all(document.fonts?['44px "Caveat Brush"','26px Yellowtail','18px "Patrick Hand"','600 20px "Playfair Display"'].map(f=>document.fonts.load(f)):[]).then(()=>{fontsDone=true},()=>{fontsDone=true});
const t0=Date.now(),tick=setInterval(()=>{const el=Date.now()-t0,real=(loaded+(fontsDone?1:0))/total,pct=el>MAX?1:Math.min(real,el/MIN);
  $('loaderBar').style.width=Math.round(pct*100)+'%';$('loaderPercent').textContent=`Menyiapkan cerita… ${Math.round(pct*100)}%`;
  if(pct>=1){clearInterval(tick);setTimeout(()=>{$('loader').classList.add('done');document.body.classList.add('ready')},600)}},60);
})();
