// EP02 props & sets: night windows, lava, ladders, bus, doghouse, classroom on stilts, zipline, bell tower, sign, machine.
import * as THREE from 'three';import * as C from './city.js';import * as A from './assets.js';import {cbox,canvasTex,decal,plastic,fabric} from './kit.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);let _sd=12345;const SRND=()=>{_sd=(_sd*16807)%2147483647;return (_sd-1)/2147483646};
export const M=(c,r=.7,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,...o});
export function box(p,w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
export function cyl(p,r,h,m,x,y,z,seg=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o}
export function textPlane(txt,w,h,bg,fg,size=120,cw=1024,ch=256,font='CapB'){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({roughness:.6,transparent:!bg,emissive:0xffffff,emissiveIntensity:.25,map:canvasTex(cw,ch,(g,W,H)=>{if(bg){g.fillStyle=bg;g.fillRect(0,0,W,H)}
  g.fillStyle=fg;g.font=`${size}px ${font}`;g.textAlign='center';g.textBaseline='middle';const L=txt.split('\n');L.forEach((l,i)=>g.fillText(l,W/2,H/2+(i-(L.length-1)/2)*size*1.05+6))})}))}
// ---- night windows: emissive map from Kenney colormap (window glass = bluish pixels) ----
const EM={};
export function nightify(obj,int=1){obj.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map||!o.material.isMeshStandardMaterial||(o.material.emissiveMap&&!o.material.userData.night))return;const src=o.material.map;const key=src.uuid;
  if(!EM[key]){const img=src.image;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);const d=g.getImageData(0,0,c.width,c.height);const p=d.data;
    const sx=c.width/512,sy=c.height/512;for(let i=0;i<p.length;i+=4){const px=(i/4)%c.width,py=Math.floor(i/4/c.width);const win=px>=320*sx&&px<384*sx&&py>=128*sy&&py<256*sy;const f=win?1-(py/sy-128)/128*.35:0;if(win){p[i]=255*f;p[i+1]=196*f;p[i+2]=105*f}else{p[i]=p[i+1]=p[i+2]=0}}g.putImageData(d,0,0);
    const t=new THREE.CanvasTexture(c);t.colorSpace=src.colorSpace;t.flipY=src.flipY;t.magFilter=src.magFilter;t.minFilter=src.minFilter;EM[key]=t}
  if(!o.material.userData.night){o.material=o.material.clone();o.material.userData.night=1}
  o.material.emissiveMap=EM[key];o.material.emissive=new THREE.Color(0xffffff);o.material.emissiveIntensity=int;o.material.needsUpdate=true})}
// ---- lava ----
export function lavaTex(){const t=canvasTex(512,512,(g,W,H)=>{g.fillStyle='#c22a00';g.fillRect(0,0,W,H);for(let i=0;i<260;i++){const x=SRND()*W,y=SRND()*H,r=8+SRND()*46;const gr=g.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,i%3?'rgba(255,214,60,.85)':'rgba(255,120,0,.9)');gr.addColorStop(1,'rgba(255,80,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
  for(let i=0;i<90;i++){g.fillStyle='rgba(60,8,0,.55)';g.beginPath();const x=SRND()*W,y=SRND()*H;g.ellipse(x,y,10+SRND()*30,4+SRND()*10,SRND()*3,0,7);g.fill()}},[30,30]);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
export function lavaPlane(w,d){const t=lavaTex();const m=new THREE.MeshStandardMaterial({map:t,emissiveMap:t,emissive:0xffffff,emissiveIntensity:1.3,roughness:.5});const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);p.rotation.x=-Math.PI/2;p.receiveShadow=true;p.userData.tex=t;return p}
export function crackPlane(w,d){const t=canvasTex(1024,1024,(g,W,H)=>{g.clearRect(0,0,W,H);g.strokeStyle='#ffb020';g.lineCap='round';for(let i=0;i<70;i++){let x=SRND()*W,y=SRND()*H;g.lineWidth=2+SRND()*5;g.beginPath();g.moveTo(x,y);
  for(let k=0;k<6;k++){x+=(SRND()-.5)*120;y+=(SRND()-.5)*120;g.lineTo(x,y)}g.stroke()}},[w/30,d/30]);t.wrapS=t.wrapT=THREE.RepeatWrapping;
  const m=new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,color:0xff7a10});const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);p.rotation.x=-Math.PI/2;return p}
// ---- ladder ----
export function ladder(h,w=1.1,col=0xc8a063){const g=new THREE.Group();const m=M(col,.7);box(g,.14,h,.14,m,-w/2,h/2,0);box(g,.14,h,.14,m,w/2,h/2,0);for(let y=.5;y<h;y+=.62)box(g,w,.1,.12,m,0,y,0);return g}
// ---- bus (procedural, yellow-orange) ----
export function bus(){const g=new THREE.Group();const body=M(0xffb21f,.45),dark=M(0x1d2433,.3,{metalness:.3}),glass=M(0x9fd2ff,.1,{emissive:0xffe0a0,emissiveIntensity:.25,transparent:true,opacity:.3});
  const L=13,Wd=3.6,y0=.7,h=3.9;box(g,L,.25,Wd,body,0,y0+.12,0);box(g,L,.3,Wd,body,0,y0+h-.15,0);// floor, roof
  [-1,1].forEach(s=>{box(g,L,1.55,.18,body,0,y0+.25+.78,s*(Wd/2-.09));for(let i=0;i<=6;i++)box(g,.3,1.35,.18,body,-L/2+.15+i*(L-.3)/6,y0+1.8+.67,s*(Wd/2-.09));box(g,L-.4,1.3,.05,glass,0,y0+1.8+.67,s*(Wd/2-.1))});
  box(g,.2,h,Wd,body,-L/2+.1,y0+h/2,0);box(g,.2,1.6,Wd,body,L/2-.1,y0+.8,0);box(g,.2,.5,Wd,body,L/2-.1,y0+h-.25,0);box(g,.06,1.3,Wd-.4,glass,L/2-.1,y0+2.3,0);
  box(g,13.1,.3,3.7,M(0x222222,.6),0,.9,0);box(g,.12,.7,.9,M(0xffffee,.3,{emissive:0xffffcc,emissiveIntensity:1.2}),6.55,1.4,1.2);box(g,.12,.7,.9,M(0xffffee,.3,{emissive:0xffffcc,emissiveIntensity:1.2}),6.55,1.4,-1.2);
  box(g,.9,.5,.9,dark,4.0,y0+.5,0);// driver seat
  const sign=textPlane('ESCOLA',3.2,.7,'#1d2433','#ffd23f',120,512,112);sign.position.set(0,4.85,1.82);g.add(sign);
  const wm=M(0x161616,.8);[[-4,1.8],[4,1.8],[-4,-1.8],[4,-1.8]].forEach(([x,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.6,20),wm);w.rotation.x=Math.PI/2;w.position.set(x,.85,z);g.add(w)});
  const lad=ladder(4.7,.9,0xd9dde6);lad.position.set(2.6,0,1.95+.12);g.add(lad);g.userData.ladder=lad;g.userData.seat=new THREE.Vector3(4.0,y0+.75,0);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---- doghouse ----
export function doghouse(){const g=new THREE.Group();const w=M(0xd9473a,.7),r=M(0x5a3a2a,.8),st=M(0xc8a063,.7);box(g,2.6,1.9,2.6,w,0,.95,0);box(g,3.0,.2,3.0,r,0,2.0,0);
  box(g,1.0,1.2,.1,M(0x1a1010,.9),0,.6,1.31);
  // ramp with slats ("escadinha") from ground (x=5.6) up to the roof edge (x=1.5, y=2.1)
  const x0=5.6,x1=1.5,Ht=2.1,len=Math.hypot(x0-x1,Ht),ang=Math.atan2(Ht,x0-x1);const ramp=new THREE.Group();ramp.position.set((x0+x1)/2,Ht/2,0);ramp.rotation.z=-ang;g.add(ramp);
  box(ramp,len,.12,1.1,st,0,-.06,0);for(let i=0;i<7;i++)box(ramp,.08,.06,1.1,M(0x8a6a3a,.7),-len/2+.4+i*(len-.8)/6,.03,0);
  g.userData.ramp={x0,x1,Ht,ang};return g}
// ---- bell tower ----
export function bellTower(){const g=new THREE.Group();const st=M(0xe9e0cf,.8),rf=M(0x6e3a2a,.6);box(g,5,22,5,st,0,11,0);
  box(g,5.4,.5,5.4,st,0,22.25,0);[[-2.3,-2.3],[2.3,-2.3],[-2.3,2.3],[2.3,2.3]].forEach(([x,z])=>box(g,.6,4.4,.6,st,x,24.6,z));box(g,5.4,.5,5.4,st,0,27,0);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(4.2,4.5,4),rf);roof.rotation.y=Math.PI/4;roof.position.y=29.5;g.add(roof);
  const clock=new THREE.Mesh(new THREE.CircleGeometry(1.8,40),new THREE.MeshStandardMaterial({emissive:0xfff3c0,emissiveIntensity:.9,map:canvasTex(256,256,(c,W,H)=>{c.fillStyle='#fffbe8';c.beginPath();c.arc(128,128,126,0,7);c.fill();c.strokeStyle='#2a2a2a';c.lineWidth=8;c.stroke();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.fillRect(128+Math.sin(a)*100-4,128-Math.cos(a)*100-4,8,8)}c.lineCap='round';c.lineWidth=12;c.beginPath();c.moveTo(128,128);c.lineTo(128+Math.sin(-Math.PI/3)*60,128-Math.cos(-Math.PI/3)*60);c.stroke();c.lineWidth=7;c.beginPath();c.moveTo(128,128);c.lineTo(128,40);c.stroke()})}));
  clock.position.set(0,18,2.52);g.add(clock);
  const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector2(.35+Math.pow(t,1.8)*1.25,-t*2.2))}const bell=new THREE.Mesh(new THREE.LatheGeometry(pts,28),M(0xd9a520,.3,{metalness:.6,emissive:0x8a5a10,emissiveIntensity:.5,side:THREE.DoubleSide}));
  const piv=new THREE.Group();piv.position.set(0,26.3,0);piv.add(bell);bell.position.y=0;g.add(piv);g.userData.bell=piv;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---- safety sign ----
export function safetySign(){const g=new THREE.Group();cyl(g,.15,5,M(0x666a70,.4,{metalness:.6}),-2.6,2.5,0);cyl(g,.15,5,M(0x666a70,.4,{metalness:.6}),2.6,2.5,0);box(g,6.6,3.6,.25,M(0x1f7a3a,.5),0,5.6,0);
  const mk=n=>canvasTex(1024,560,(c,W,H)=>{c.fillStyle='#1f7a3a';c.fillRect(0,0,W,H);c.strokeStyle='#fff';c.lineWidth=14;c.strokeRect(20,20,W-40,H-40);c.fillStyle='#fff';c.font='230px CapB';c.textAlign='center';c.textBaseline='middle';c.fillText(n,W/2,H*.38);c.font='84px CapB';c.fillText('ANOS SEM ACIDENTES',W/2,H*.78)});
  const T=[mk('40'),mk('0')];const face=new THREE.Mesh(new THREE.PlaneGeometry(6.3,3.4),new THREE.MeshStandardMaterial({map:T[0],emissive:0xffffff,emissiveMap:T[0],emissiveIntensity:.35}));face.position.set(0,5.6,.14);g.add(face);
  g.userData.set=i=>{face.material.map=T[i];face.material.emissiveMap=T[i];face.material.needsUpdate=true};return g}
// ---- city-hall machine ----
export async function machine(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);const met=M(0x5a6272,.35,{metalness:.8}),dk=M(0x2a2f3a,.5,{metalness:.6});
  box(g,9,6,6,met,0,3,0);for(let i=0;i<3;i++){const t=await A.place(g,'industrial','detail-tank-large',-5+i*4,0,-5,0,.3);}
  const glowM=new THREE.MeshStandardMaterial({color:0xff6a10,emissive:0xff5a00,emissiveIntensity:2.2});for(let i=0;i<5;i++)box(g,.9,.5,.06,glowM,-3+i*1.5,4.6,3.03);
  const win=box(g,3.2,1.6,.08,new THREE.MeshStandardMaterial({color:0x111,emissive:0xff9a40,emissiveIntensity:1.4}),2.2,2.4,3.03);
  const sil=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,map:canvasTex(256,256,(c,W,H)=>{c.fillStyle='#050208';c.beginPath();c.roundRect(78,40,100,96,22);c.fill();c.beginPath();c.moveTo(20,256);c.lineTo(40,170);c.quadraticCurveTo(128,130,216,170);c.lineTo(236,256);c.fill();
    c.fillStyle='#ff2a2a';c.shadowColor='#ff2a2a';c.shadowBlur=14;c.beginPath();c.ellipse(108,88,9,6,0,0,7);c.fill();c.beginPath();c.ellipse(148,88,9,6,0,0,7);c.fill()})}));sil.position.set(2.2,2.3,3.1);sil.visible=false;g.add(sil);g.userData.sil=sil;
  cyl(g,.7,1,dk,4.5,6.5,0);const pipe=new THREE.Group();g.add(pipe);
  // pipe: down the facade to the ground
  const pm=M(0x3a404c,.4,{metalness:.7});const PX=8.5;const h1=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,PX-4.5,16),pm);h1.rotation.z=Math.PI/2;h1.position.set(4.5+(PX-4.5)/2,2,0);pipe.add(h1);
  const p2=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,y+2.5,16),pm);p2.position.set(PX,2-(y+2.5)/2,0);pipe.add(p2);
  const ring=[];for(let i=0;i<9;i++){const rr=new THREE.Mesh(new THREE.TorusGeometry(.85,.12,8,20),glowM);rr.rotation.x=Math.PI/2;rr.position.set(PX,-y+1+i*(y/8),0);pipe.add(rr);ring.push(rr)}
  const base=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.8,.8,20),glowM);base.position.set(PX,-y+.6,0);pipe.add(base);
  g.userData.ring=ring;g.userData.groundPt=V(x+PX,0,z);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---- classroom on stilts ----
export async function classroom(scene,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(24,16),M(0xc89a64,.6));fl.rotation.x=-Math.PI/2;fl.position.y=.04;fl.receiveShadow=true;g.add(fl);
  const wm=M(0xcfe8d6,.85);box(g,24,11,.4,wm,0,5.5,-8);box(g,.4,11,16,wm,-12,5.5,0);box(g,.4,11,16,wm,12,5.5,0);box(g,24,.3,16,M(0xf4f4f2,.9),0,11,0).castShadow=false;
  const board=textPlane('PROVA\n2 + 2 = ?',9,4,'#1f4a34','#ffffff',120,768,340,'Cap');board.position.set(0,6.5,-7.75);g.add(board);
  const desks=[];for(let r=0;r<2;r++)for(let i=0;i<4;i++){const d=new THREE.Group();const x=-7.5+i*5,z=-1.5+r*5;d.position.set(x,0,z);g.add(d);const H=3.6;
    [[-.9,-.6],[.9,-.6],[-.9,.9],[.9,.9]].forEach(([a,b])=>cyl(d,.09,H,M(0x8a8f99,.4,{metalness:.7}),a,H/2,b,8));box(d,2.4,.12,2.0,M(0xb07a44,.6),0,H,0);
    await A.place(d,'furniture','desk',-.8,H+.06,-.75);await A.place(d,'furniture','chairDesk',.2,H+.06,.7,Math.PI);const l=ladder(H,.7,0xd9dde6);l.position.set(1.4,0,.95);l.rotation.x=-.2;d.add(l);desks.push({x:ox+x,z:oz+z,H})}
  return {g,desks}}
// ---- zipline ----
export function zipline(a,b){const g=new THREE.Group();const d=a.distanceTo(b);const c=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,d,6),M(0x222222,.4,{metalness:.6}));c.position.copy(a).add(b).multiplyScalar(.5);c.lookAt(b);c.rotateX(Math.PI/2);g.add(c);return g}
