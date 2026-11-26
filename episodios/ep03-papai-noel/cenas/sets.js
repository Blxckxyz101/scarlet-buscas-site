// EP01 v2 sets: hospital, suburb, kitchen, nursery, school hallway, auditorium, city hall, underground prison.
import * as THREE from 'three';import * as C from './city.js';import * as A from './assets.js';import {cbox,canvasTex,decal,plastic,fabric} from './kit.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);let _sd=12345;const SRND=()=>{_sd=(_sd*16807)%2147483647;return (_sd-1)/2147483646};
const M=(c,r=.7,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,...o});
function box(p,w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
function textPlane(txt,w,h,bg,fg,font='CapB',size=120,cw=1024,ch=256){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({roughness:.6,transparent:!bg,map:canvasTex(cw,ch,(g,W,H)=>{if(bg){g.fillStyle=bg;g.fillRect(0,0,W,H)}
  g.fillStyle=fg;g.font=`${size}px ${font}`;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,W/2,H/2+6)})}))}
const tileTex=(a,b,n=8,rep=[4,4])=>canvasTex(256,256,(g,W,H)=>{const s=W/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.fillStyle=(i+j)%2?a:b;g.fillRect(i*s,j*s,s,s)}g.strokeStyle='rgba(0,0,0,.12)';for(let i=0;i<=n;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,H);g.stroke();g.beginPath();g.moveTo(0,i*s);g.lineTo(W,i*s);g.stroke()}},rep);
const woodTex=(rep=[3,3])=>canvasTex(256,256,(g,W,H)=>{for(let i=0;i<8;i++){g.fillStyle=['#c89a64','#b98a56','#d3a56e','#bf9160'][i%4];g.fillRect(0,i*32,W,32);g.fillStyle='rgba(60,30,10,.18)';g.fillRect(0,i*32+30,W,2);
  for(let k=0;k<6;k++){g.fillStyle='rgba(80,40,10,.08)';g.fillRect(SRND()*W,i*32+SRND()*28,40+SRND()*60,2)}}},rep);
const paintTex=(c,rep=[2,2])=>canvasTex(128,128,(g,W,H)=>{g.fillStyle=c;g.fillRect(0,0,W,H);for(let i=0;i<500;i++){g.fillStyle=`rgba(0,0,0,${SRND()*.03})`;g.fillRect(SRND()*W,SRND()*H,2,2)}},rep);
// generic room shell (open towards +z for the camera, optional front wall)
export function room(scene,ox,oz,{w=20,d=14,h=9,wall='#dfe8f4',floor=null,ceiling=true,front=false,trim=0xffffff}={}){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(w,d),floor||new THREE.MeshStandardMaterial({map:woodTex([w/6,d/6]),roughness:.6}));fl.rotation.x=-Math.PI/2;fl.position.y=.04;fl.receiveShadow=true;g.add(fl);
  const wm=new THREE.MeshStandardMaterial({map:paintTex(wall,[w/8,h/8]),roughness:.85});
  box(g,w,h,.4,wm,0,h/2,-d/2);box(g,.4,h,d,wm,-w/2,h/2,0);box(g,.4,h,d,wm,w/2,h/2,0);if(front)box(g,w,h,.4,wm,0,h/2,d/2);
  box(g,w,.5,.5,M(trim,.5),0,.25,-d/2+.3);if(ceiling){const c=box(g,w,.3,d,M(0xf4f4f2,.9),0,h,0);c.castShadow=false}
  return g}
// ---------- HOSPITAL ----------
export async function hospital(scene,B,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);
  const plaza=new THREE.Mesh(new THREE.PlaneGeometry(120,90),new THREE.MeshStandardMaterial({map:tileTex('#d9d4cb','#cfc9bf',8,[20,15]),roughness:.85}));plaza.rotation.x=-Math.PI/2;plaza.position.y=.02;plaza.receiveShadow=true;g.add(plaza);
  const b=await A.place(g,'commercial','building-n',0,0,-18);A.recolor(b,0xf3f6fa);b.scale.multiplyScalar(1.35);b.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(b);b.position.x+=ox-(bb.min.x+bb.max.x)/2;b.position.z+=(oz-12)-bb.max.z;b.position.y-=bb.min.y;
  b.updateMatrixWorld(true);const bb2=new THREE.Box3().setFromObject(b);const top=bb2.max.y;const front=bb2.max.z;
  const sign=new THREE.Group();const cross=new THREE.Group();box(cross,4,1.3,.4,M(0xe5353b,.4,{emissive:0xe5353b,emissiveIntensity:.25}),0,0,0);box(cross,1.3,4,.4,M(0xe5353b,.4,{emissive:0xe5353b,emissiveIntensity:.25}),0,0,0);
  cross.position.set(-9,10,front-oz+.6);g.add(cross);const t=textPlane('HOSPITAL',16,3.2,'#ffffff','#e5353b','CapB',170,1024,205);t.position.set(4,10,front-oz+.55);g.add(t);
  const amb=await A.place(g,'car','ambulance',8,0,front-oz+9,Math.PI/2);
  for(let i=0;i<6;i++){const tr=await A.place(g,'nature',i%2?'tree_detailed':'tree_default',-30+i*12,0,front-oz+24);tr.scale.setScalar(3.4)}
  for(let i=0;i<4;i++){const l=C.lamp();l.position.set(-24+i*16,0,front-oz+5);g.add(l)}
  for(let i=0;i<8;i++){const n=['a','b','c','d','e'][i%5];const s=await A.place(g,'commercial','building-skyscraper-'+n,-60+i*16,0,-70-(i%3)*10);A.recolor(s,A.FACADES[i%A.FACADES.length])}
  // light beam from the roof
  const beamM=new THREE.MeshBasicMaterial({color:0xff3030,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(2.6,4.2,260,32,1,true),beamM);beam.position.set(0,top+130,(bb2.min.z+bb2.max.z)/2-oz);g.add(beam);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.4,260,24,1,true),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));core.position.copy(beam.position);g.add(core);
  const glow=new THREE.PointLight(0xff3030,0,80,1.2);glow.position.set(0,top+4,beam.position.z);g.add(glow);
  return {g,beam,core,glow,top,front:front-oz,center:V(ox,0,oz+(bb2.min.z+bb2.max.z)/2-oz)}}
// ---------- SUBURB ----------
export async function suburb(scene,B,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);const houses=[];
  const st=C.street(240,{sw:4});g.add(st);const names='abcdefghijklmnopqrstu'.split('');
  for(let s of [-1,1])for(let i=0;i<9;i++){const n=names[(i*5+(s>0?7:0))%names.length];const h=await A.place(g,'suburban','building-type-'+n,-70+i*16,0,s*18,s>0?Math.PI:0);h.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(h);
    h.position.x+=(ox-70+i*16)-(bb.min.x+bb.max.x)/2;h.position.z+=s<0?(oz-13.5-bb.max.z):(oz+13.5-bb.min.z);h.position.y-=bb.min.y;houses.push({obj:h,x:-70+i*16,s,i});
    const fm=M(0xffffff,.6);for(let f=0;f<22;f++){if(f>=10&&f<=12)continue;box(g,.22,1.3,.12,fm,-70+i*16-7.6+f*.72,.95,s*9.75)}box(g,7.2,.16,.1,fm,-70+i*16-4.3,1.3,s*9.75);box(g,6.6,.16,.1,fm,-70+i*16+4.6,1.3,s*9.75);box(g,7.2,.16,.1,fm,-70+i*16-4.3,.7,s*9.75);box(g,6.6,.16,.1,fm,-70+i*16+4.6,.7,s*9.75);
    const pth=new THREE.Mesh(new THREE.PlaneGeometry(2,3.6),M(0xd9c7a4,.9));pth.rotation.x=-Math.PI/2;pth.position.set(-70+i*16,.03,s*11.7);g.add(pth);
    const tr=await A.place(g,'nature',['tree_default','tree_oak','tree_fat','tree_detailed'][i%4],-70+i*16+7,0,s*11);tr.scale.setScalar(3.4)}
  for(let x=-75;x<80;x+=1){const sideN=SRND()<.5;if(SRND()<.6&&!(sideN&&x>-3&&x<12)){const fl=await A.place(g,'nature',['flower_redA','flower_yellowA','flower_purpleA','plant_bush'][Math.floor(SRND()*4)],x+SRND(),.0,(sideN?-1:1)*(10.6+SRND()*.8));fl.scale.setScalar(2.4)}}
  const grass=new THREE.Mesh(new THREE.PlaneGeometry(200,90),C.mats().grass);grass.rotation.x=-Math.PI/2;grass.position.y=.01;grass.receiveShadow=true;g.add(grass);
  return {g,houses}}
// ---------- KITCHEN ----------
export async function kitchen(scene,ox,oz){const g=room(scene,ox,oz,{w:18,d:12,h:9,wall:'#fde9c8',floor:new THREE.MeshStandardMaterial({map:tileTex('#f4f4f4','#d8dde6',8,[5,4]),roughness:.4})});
  const P=async(n,x,z,ry=0,y=0)=>A.place(g,'furniture',n,x,y,z,ry);
  await P('kitchenCabinet',-6,-4.2);const stv=await P('kitchenStove',-3.6,-4.2);stv.updateMatrixWorld(true);const sbb=new THREE.Box3().setFromObject(stv);window.INFO=(window.INFO||'')+' stove '+JSON.stringify([sbb.min,sbb.max]);await P('kitchenCabinetDrawer',-1.2,-4.2);await P('kitchenSink',1.2,-4.2);await P('kitchenCabinet',3.6,-4.2);await P('kitchenFridgeLarge',6.6,-4.2);
  for(let i=0;i<4;i++)await P('kitchenCabinetUpper',-6+i*2.4,-4.4,0,4.6);await P('hoodModern',-3.6,-4.4,0,4.4);
  await P('tableRound',2,1.5);await P('chair',0,1.5,Math.PI/2);await P('chair',4,1.5,-Math.PI/2);await P('kitchenCoffeeMachine',1.4,-4.2,0,1.53);await P('pottedPlant',-7.6,4);
  const win=new THREE.Group();box(win,5,3.4,.2,M(0xffffff,.5),0,0,0);box(win,4.4,2.8,.25,M(0x9fd6ff,.1,{emissive:0x9fd6ff,emissiveIntensity:.4}),0,0,0);win.position.set(-1,6,-5.85);g.add(win);
  const pan=new THREE.Group();pan.scale.setScalar(.55);const pm=M(0x2d313c,.35,{metalness:.6});const body=new THREE.Mesh(new THREE.CylinderGeometry(.9,.7,.35,24),pm);pan.add(body);const hd=box(pan,1.6,.12,.25,pm,1.5,.05,0);g.updateMatrixWorld(true);let sy=3.4;g.traverse(o=>{if(o.name==='STOVE'){}});pan.position.set(-2.87,1.72,-4.96);g.add(pan);
  return {g,pan}}
// ---------- NURSERY ----------
export async function nursery(scene,ox,oz){const g=room(scene,ox,oz,{w:20,d:14,h:9,wall:'#dff1fb',floor:new THREE.MeshStandardMaterial({map:tileTex('#eef5f7','#dfe9ec',6,[6,4]),roughness:.35})});
  const P=async(n,x,z,ry=0,y=0,k='furniture')=>A.place(g,k,n,x,y,z,ry);
  const crib=new THREE.Group();const cm=M(0xffffff,.5);box(crib,3.4,.3,2.2,cm,0,1.6,0);box(crib,3.2,.35,2.0,M(0xbfe6ff,.9),0,1.9,0);
  for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.6,8),cm);b.position.set(-1.6+i*.4,2.4,1.05);crib.add(b);const b2=b.clone();b2.position.z=-1.05;crib.add(b2)}
  [-1.7,1.7].forEach(x=>{box(crib,.15,3.2,2.2,cm,x,1.6,0)});box(crib,3.4,.12,.12,cm,0,3.2,1.05);box(crib,3.4,.12,.12,cm,0,3.2,-1.05);crib.position.set(0,0,0);g.add(crib);
  const mon=await P('computer-screen',5.5,-5.6,0,3,'space');await P('bedSingle',-7,-3.4);await P('cabinetBedDrawerTable',-4.6,-5.6);await P('lampSquareTable',-4.6,-5.6,0,2.2);await P('pottedPlant',8.5,-5.6);
  const win=new THREE.Group();box(win,6,4,.2,M(0xffffff,.5),0,0,0);const sky=box(win,5.4,3.4,.25,M(0x0b1440,.4,{emissive:0x23306a,emissiveIntensity:.6}),0,0,0);win.position.set(-1,6,-6.85);g.add(win);
  const mobile=new THREE.Group();[0xffd23f,0x36d4ff,0xff7ab8,0x7bd389].forEach((c,i)=>{const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),M(c,.5));s.position.set(Math.cos(i*1.57)*.8,-.6,Math.sin(i*1.57)*.8);mobile.add(s);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,.6,4),M(0xffffff));st.position.copy(s.position).add(V(0,.3,0));mobile.add(st)});mobile.position.set(0,5.4,0);g.add(mobile);
  const lampL=new THREE.PointLight(0xfff0d0,0,26,1.6);lampL.position.set(ox,8,oz);scene.add(lampL);
  return {g,crib,mobile,sky,lamp:lampL}}
// ---------- SCHOOL HALLWAY ----------
export function hallway(scene,ox,oz){const g=room(scene,ox,oz,{w:30,d:12,h:9,wall:'#f6e7b8',floor:new THREE.MeshStandardMaterial({map:tileTex('#e9e4da','#cfd6e2',10,[8,3]),roughness:.35})});
  const cols=[0x2f6fd0,0xd9473a,0x3fc46a,0xf2c230];for(let i=0;i<14;i++){const l=new THREE.Group();const m=M(cols[Math.floor(i/4)%4],.45,{metalness:.3});box(l,1.9,6,1.2,m,0,3,0);
    for(let k=0;k<4;k++)box(l,1.2,.08,.05,M(0x222,.6),0,4.6+k*.25,.62);box(l,.1,.5,.1,M(0xdddddd,.3,{metalness:.8}),.6,3.3,.62);l.position.set(-13+i*2.05,0,-5.2);g.add(l)}
  const board=textPlane('DIA DOS PODERES ✨',10,1.6,'#ffd23f','#2f3a8a','CapB',110,1024,164);board.position.set(4,7.8,-5.75);g.add(board);
  return {g}}
// ---------- AUDITORIUM ----------
export async function auditorium(scene,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x5a2a30,roughness:.9}));fl.rotation.x=-Math.PI/2;fl.position.y=.04;fl.receiveShadow=true;g.add(fl);
  const stage=box(g,26,1.8,9,new THREE.MeshStandardMaterial({map:woodTex([5,2]),roughness:.5}),0,.9,-8);box(g,26,.2,.4,M(0x2b1b14,.5),0,1.8,-3.6);
  const back=box(g,40,18,.4,M(0x2a1630,.9),0,9,-12.6);box(g,40,18,.4,M(0x2a1630,.9),0,9,19);box(g,.4,18,32,M(0x3a1f40,.9),-20,9,3);box(g,.4,18,32,M(0x3a1f40,.9),20,9,3);box(g,40,.4,32,M(0x1a0e20,.9),0,18,3);
  const curtainM=new THREE.MeshStandardMaterial({color:0xb51e2a,roughness:.75});for(let s of [-1,1])for(let i=0;i<9;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,16,10),curtainM);c.position.set(s*(9+i*.9),9,-11.8+(i%2)*.3);c.castShadow=true;g.add(c)}
  const valance=new THREE.Group();for(let i=0;i<30;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,3,10),curtainM);c.position.set(-14+i*.97,15.5,-11.5);valance.add(c)}g.add(valance);
  const banner=textPlane('DIA DOS PODERES',14,2.6,'#ffd23f','#5a1a8a','CapB',150,1024,190);banner.position.set(0,12,-12.3);g.add(banner);
  const spots=[];for(let i=-1;i<=1;i+=2){const s=new THREE.SpotLight(0xfff2d0,0,60,.32,.5,1.2);s.position.set(i*10,22,6);s.target.position.set(i*-1,1.8,-8);g.add(s);g.add(s.target);s.castShadow=true;spots.push(s)}
  const center=new THREE.SpotLight(0xffffff,0,60,.18,.4,1.2);center.position.set(0,24,4);center.target.position.set(0,1.8,-7);g.add(center);g.add(center.target);center.castShadow=true;
  const chairs=[];for(let r=0;r<4;r++)for(let i=0;i<10;i++){const c=await A.place(g,'furniture','chairCushion',-11+i*2.4,0,2+r*3.2,0);chairs.push(c)}
  const am=new THREE.HemisphereLight(0x8070a0,0x201020,0);g.add(am);
  return {g,spots,center,am,stageY:1.8}}
// ---------- CITY HALL ----------
export async function cityHall(scene,B,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);
  const plaza=new THREE.Mesh(new THREE.PlaneGeometry(140,100),new THREE.MeshStandardMaterial({map:tileTex('#d8d2c6','#cbc3b6',8,[24,18]),roughness:.85}));plaza.rotation.x=-Math.PI/2;plaza.position.y=.02;plaza.receiveShadow=true;g.add(plaza);
  const stone=M(0xf1eadc,.75),roof=M(0x6e8fae,.5);
  for(let i=0;i<5;i++)box(g,44-i*1.2,.6,8-i*1.2,stone,0,.3+i*.6,-2-i*.6+3);
  box(g,40,14,16,stone,0,3+7,-14);box(g,42,1.2,17,M(0xe2d8c6,.7),0,17.6,-14);
  for(let i=0;i<8;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.7,.8,12,16),stone);c.position.set(-15+i*4.3,9,-5.2);c.castShadow=true;g.add(c)}
  const ped=new THREE.Shape();ped.moveTo(-21,0);ped.lineTo(0,6);ped.lineTo(21,0);ped.closePath();const pg=new THREE.Mesh(new THREE.ExtrudeGeometry(ped,{depth:2,bevelEnabled:false}),stone);pg.position.set(0,18.2,-6.4);pg.castShadow=true;g.add(pg);
  const t=textPlane('PREFEITURA',20,2.6,null,'#5a4a32','CapB',170,1024,140);t.position.set(0,16.1,-4.45);g.add(t);
  const drum=new THREE.Mesh(new THREE.CylinderGeometry(6,6,5,32),stone);drum.position.set(0,22,-14);g.add(drum);const dome=new THREE.Mesh(new THREE.SphereGeometry(6.2,32,16,0,Math.PI*2,0,Math.PI/2),roof);dome.position.set(0,24.5,-14);dome.castShadow=true;g.add(dome);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,7,8),M(0xdddddd,.3,{metalness:.8}));pole.position.set(0,34,-14);g.add(pole);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2,8,1),new THREE.MeshStandardMaterial({side:THREE.DoubleSide,map:canvasTex(256,160,(c,W,H)=>{c.fillStyle='#18b4ea';c.fillRect(0,0,W,H);c.fillStyle='#ffd23f';c.beginPath();c.arc(W/2,H/2,40,0,7);c.fill()})}));flag.position.set(1.7,36.4,-14);g.add(flag);
  for(let i=0;i<10;i++){const n=['a','b','c','d','e'][i%5];const s=await A.place(g,'commercial','building-skyscraper-'+n,-70+i*15,0,-55-(i%3)*12);A.recolor(s,A.FACADES[(i+2)%A.FACADES.length])}
  for(let i=0;i<6;i++){const tr=await A.place(g,'nature','tree_detailed',-30+i*12,0,14);tr.scale.setScalar(3.6)}
  return {g,roofTop:V(ox,26,oz-14),domeTop:V(ox,31,oz-14),flag}}
// ---------- UNDERGROUND PRISON ----------
export async function prison(scene,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);g.updateMatrixWorld(true);
  const floorM=new THREE.MeshStandardMaterial({map:tileTex('#3a4256','#323a4c',8,[10,4]),roughness:.6,metalness:.2});const fl=new THREE.Mesh(new THREE.PlaneGeometry(80,30),floorM);fl.rotation.x=-Math.PI/2;fl.position.y=.04;fl.receiveShadow=true;g.add(fl);
  const wallM=M(0x4a536b,.6,{metalness:.2});box(g,80,12,.5,wallM,0,6,-14);box(g,80,12,.5,wallM,0,6,14);box(g,80,.4,30,M(0x2a3042,.8),0,12,0);box(g,.5,12,30,wallM,-40,6,0);box(g,.5,12,30,wallM,40,6,0);
  const steel=M(0x9aa4bd,.3,{metalness:.85});const cells=[];
  for(let s of [-1,1])for(let i=0;i<8;i++){const cx=-32+i*9;for(let k=0;k<7;k++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,9,8),steel);b.position.set(cx-3.6+k*1.2,4.5,s*5.6);b.castShadow=true;g.add(b)}
    box(g,8.6,.3,.3,steel,cx,9,s*5.6);box(g,8.6,.3,.3,steel,cx,.4,s*5.6);box(g,.5,12,8.4,wallM,cx+4.5,6,s*9.8);cells.push({x:ox+cx,z:oz+s*9.6,side:s});
    const bench=box(g,6,.7,1.7,M(0x5d6584,.7),cx,.35,s*12.9)}
  const red=[];for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.BoxGeometry(1.4,.4,.4),M(0xff2a2a,.4,{emissive:0xff2020,emissiveIntensity:1.5}));l.position.set(-32+i*9,11.2,0);g.add(l);const pl=new THREE.PointLight(0xff3030,0,18,1.6);pl.position.set(ox-32+i*9,10,oz);scene.add(pl);red.push(pl)}
  for(let i=0;i<6;i++){const p=await A.place(g,'space','pipe',-30+i*12,10.6,-13.4,Math.PI/2);p.scale.setScalar(5)}
  return {g,cells,red}}
