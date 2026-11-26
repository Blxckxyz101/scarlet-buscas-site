// EP03 sets & props: xmas-in-summer street, grandma's living room, the Apaga-Mentira alley, Santa/sleigh/reindeer, door counters.
import * as THREE from 'three';import * as C from './city.js';import * as A from './assets.js';import {cbox,canvasTex,decal,plastic,fabric} from './kit.js';import {box,cyl,M,textPlane} from './sets2.js';
const V=(x,y,z)=>new THREE.Vector3(x,y,z);let _sd=4242;const SRND=()=>{_sd=(_sd*16807)%2147483647;return (_sd-1)/2147483646};
// ---------- digit counter (atlas of digit textures, no per-number textures) ----------
const DIG={};function digTex(ch,col){const k=ch+col;if(DIG[k])return DIG[k];DIG[k]=canvasTex(64,96,(g,W,H)=>{g.fillStyle='#0c0f14';g.fillRect(0,0,W,H);
  if(ch!==' '){g.fillStyle=col;g.shadowColor=col;g.shadowBlur=10;g.font='84px CapB';g.textAlign='center';g.textBaseline='middle';g.fillText(ch,W/2,H/2+6)}});return DIG[k]}
export function counterBoard(n=4,{w=.42,h=.62,label=null}={}){const g=new THREE.Group();const frame=M(0x2a2f3a,.4,{metalness:.5});box(g,n*w+.24,h+.24+(label?.32:0),.16,frame,0,label?-.16:0,0);
  const cells=[];for(let i=0;i<n;i++){const m=new THREE.MeshStandardMaterial({map:digTex(' ','#3dff7a'),emissive:0xffffff,emissiveMap:digTex(' ','#3dff7a'),emissiveIntensity:1.6,roughness:.4});
    const p=new THREE.Mesh(new THREE.PlaneGeometry(w*.92,h),m);p.position.set(-n*w/2+w/2+i*w,0,.085);g.add(p);cells.push(m)}
  if(label){const lt=textPlane(label,n*w+.1,.26,'#0c0f14','#c9961a',90,512,64);lt.position.set(0,-h/2-.2,.085);g.add(lt)}
  g.userData.set=(str,col)=>{str=String(str);const c=col||(str.trim()==='0'?'#3dff7a':'#ff3a3a');const pad=str.length>=n?str.slice(-n):' '.repeat(n-str.length)+str;
    for(let i=0;i<n;i++){const t=digTex(pad[i],c);if(cells[i].map!==t){cells[i].map=t;cells[i].emissiveMap=t;cells[i].needsUpdate=true}}};
  g.userData.set('0');return g}
// ---------- small props ----------
export function giftBox(col=0xd9332e,rib=0xffd23f,s=1){const g=new THREE.Group();g.add(cbox(.9*s,.8*s,.9*s,M(col,.5),.05,0));box(g,.92*s,.82*s,.16*s,M(rib,.35,{metalness:.4}),0,.4*s,0);box(g,.16*s,.82*s,.92*s,M(rib,.35,{metalness:.4}),0,.4*s,0);
  const bow=new THREE.Mesh(new THREE.TorusGeometry(.16*s,.06*s,8,16),M(rib,.35,{metalness:.4}));bow.position.y=.88*s;bow.rotation.x=Math.PI/2;g.add(bow);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
export function coal(){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.32,0),M(0x1d1d22,.9));m.castShadow=true;return m}
export function mailbox(){const g=new THREE.Group();const r=M(0xd9332e,.45);cyl(g,.09,1.6,M(0x444a55,.4,{metalness:.6}),0,.8,0);g.add(Object.assign(cbox(1.1,.9,.8,r,.15,1.6),{}));
  const l=textPlane('POLO NORTE',1.05,.26,'#ffffff','#d9332e',80,512,128);l.position.set(0,2.05,.41);g.add(l);box(g,.6,.06,.02,M(0x111111,.8),0,2.3,.405);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
export function xmasLights(len,cols=[0xff3a3a,0x3dff7a,0xffd23f,0x36a8ff]){const g=new THREE.Group();const n=Math.max(2,Math.floor(len/.45));const wire=new THREE.Mesh(new THREE.BoxGeometry(len,.025,.025),M(0x1a1a1a,.8));g.add(wire);
  const bulbs=[];for(let i=0;i<n;i++){const c=cols[i%cols.length];const m=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0,roughness:.3});const b=new THREE.Mesh(new THREE.SphereGeometry(.08,8,6),m);b.position.set(-len/2+(i+.5)*len/n,-.1-.06*Math.sin(i*1.3),0);g.add(b);bulbs.push(m)}
  g.userData.on=(k,t=0)=>bulbs.forEach((m,i)=>m.emissiveIntensity=k*(1.6+.8*Math.sin(t*3+i)));return g}
export function honestSign(){const g=new THREE.Group();cyl(g,.15,5.2,M(0x7a5a3a,.8),-2.9,2.6,0);cyl(g,.15,5.2,M(0x7a5a3a,.8),2.9,2.6,0);
  const board=new THREE.Group();board.position.y=4.6;g.add(board);box(board,6.6,2.3,.22,M(0xf4ead6,.7),0,0,0);
  const t=textPlane('CIDADE\n100% HONESTA',6.2,2.0,'#f4ead6','#1f6b3a',150,1024,330);t.position.z=.12;board.add(t);
  const hat=new THREE.Mesh(new THREE.ConeGeometry(.45,.9,12),M(0xd9332e,.5));hat.position.set(2.9,5.25,0);g.add(hat);g.userData.board=board;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---------- Santa, sleigh, reindeer ----------
export function dressSanta(c,{beard=true}={}){const head=c.head;if(beard){const b=cbox(1.28,.4,.26,M(0xf7f7f2,.9),.1,.21);b.position.set(0,.15,.58);head.add(b);const m=cbox(.56,.1,.08,M(0xf7f7f2,.9),.04,.6);m.position.set(0,.585,.65);head.add(m)}
  const hat=new THREE.Group();hat.position.y=1.38;head.add(hat);const cone=new THREE.Mesh(new THREE.ConeGeometry(.62,1.25,16),M(0xd9332e,.6));cone.position.set(0,.55,-.05);cone.rotation.z=.25;hat.add(cone);
  const brim=new THREE.Mesh(new THREE.TorusGeometry(.66,.17,10,24),M(0xf7f7f2,.9));brim.rotation.x=Math.PI/2;hat.add(brim);const pom=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),M(0xf7f7f2,.9));pom.position.set(.3,1.1,-.05);hat.add(pom);
  const belt=cbox(2.06,.3,1.06,M(0x1a1a1a,.4),.05,.35);c.waist.add(belt);const buckle=cbox(.42,.32,.08,M(0xffd23f,.25,{metalness:.8}),.04,.34);buckle.position.z=.54;c.waist.add(buckle);c.root.traverse(o=>{if(o.isMesh)o.castShadow=true})}
export function sleigh(){const g=new THREE.Group();const red=M(0xc81e2a,.4,{metalness:.2}),gold=M(0xffc93a,.25,{metalness:.8});
  g.add(cbox(2.6,1.3,4.2,red,.25,.7));box(g,2.7,.16,4.3,gold,0,1.98,0);const back=cbox(2.6,1.4,.5,red,.2,1.4);back.position.z=-1.85;g.add(back);
  [-1.15,1.15].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.07,8,16,Math.PI),gold);r.rotation.y=Math.PI/2;r.position.set(x,.5,2.2);g.add(r);box(g,.12,.12,4.4,gold,x,.0,0)});
  const sack=new THREE.Mesh(new THREE.SphereGeometry(.9,12,10),M(0x8a5a2a,.9));sack.scale.set(1,1.15,1);sack.position.set(0,2.4,-1.1);g.add(sack);
  for(let i=0;i<3;i++){const gb=giftBox([0x36a8ff,0x3dbf6a,0xffd23f][i],0xd9332e,.6);gb.position.set(-.6+i*.6,2.0,-.2);g.add(gb)}
  g.userData.seat=V(0,1.45,.6);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
export function reindeer(){const g=new THREE.Group();const fur=fabric(0x8a5a34),light=fabric(0xe9d2b0),dark=M(0x3a2414,.8);
  const body=cbox(1.2,1.1,2.3,fur,.3,1.6);g.add(body);const neck=cbox(.6,1.1,.6,fur,.2,2.3);neck.position.z=1.05;neck.rotation.x=.35;g.add(neck);
  const head=new THREE.Group();head.position.set(0,3.25,1.45);g.add(head);head.add(cbox(.8,.75,1.05,fur,.25,-.35));const snout=cbox(.55,.42,.5,light,.15,-.5);snout.position.z=.55;head.add(snout);
  const nose=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshStandardMaterial({color:0xff2a2a,emissive:0xff2a2a,emissiveIntensity:1.2}));nose.position.set(0,-.27,.82);head.add(nose);
  const eyes=decal(.7,.3,(c,w,h)=>{[[w*.25,h*.5],[w*.75,h*.5]].forEach(([x,y])=>{c.fillStyle='#161214';c.beginPath();c.ellipse(x,y,w*.08,h*.34,0,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x+4,y-8,5,0,7);c.fill()})},256,110);eyes.position.set(0,.05,.18);head.add(eyes);
  [-1,1].forEach(s=>{const an=new THREE.Group();an.position.set(s*.28,.38,-.2);head.add(an);[[0,.5,0,.07],[s*.2,.85,.0,.06],[0,.75,.18,.05]].forEach(([x,y,z,r],i)=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.55,6),dark);b.position.set(x,y-.2,z);b.rotation.z=-s*(.3+i*.25);an.add(b)})});
  const legs=[];[[-.4,.8],[.4,.8],[-.4,-.8],[.4,-.8]].forEach(([x,z])=>{const p=new THREE.Group();p.position.set(x,1.25,z);g.add(p);const l=cbox(.3,1.25,.3,fur,.1,-.62);p.add(l);legs.push(p)});
  g.userData.legs=legs;g.userData.head=head;g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---------- grandma's living room (warm, hot summer xmas) ----------
export async function livingRoom(scene,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);
  const W=20,D=14,H=9;const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({color:0xb88a5a,roughness:.6}));fl.rotation.x=-Math.PI/2;fl.position.y=.04;fl.receiveShadow=true;g.add(fl);
  const wall=M(0xf2d6b3,.85);box(g,W,H,.4,wall,0,H/2,-D/2);box(g,.4,H,D,wall,-W/2,H/2,0);box(g,.4,H,D,wall,W/2,H/2,0);const ceil=box(g,W,.3,D,M(0xfaf3ea,.9),0,H,0);ceil.castShadow=false;
  box(g,W,.5,.45,M(0xffffff,.5),0,.25,-D/2+.3);
  // window with hot sun
  const win=new THREE.Group();win.position.set(-4.5,5,-D/2+.22);g.add(win);box(win,5.2,3.6,.2,M(0xffffff,.5),0,0,0);box(win,4.6,3.0,.25,new THREE.MeshStandardMaterial({color:0xbfe8ff,emissive:0xfff2c0,emissiveIntensity:1.1}),0,0,.02);
  box(win,.12,3.0,.3,M(0xffffff,.5),0,0,.05);box(win,4.6,.12,.3,M(0xffffff,.5),0,0,.05);
  const sofa=await A.place(g,'furniture','loungeSofa',-3.6,0,1.2,0);sofa.updateMatrixWorld(true);
  const tree=await A.place(g,'nature','tree_pineRoundC',6.5,0,-4.4);tree.scale.setScalar(2.6);
  const orn=[];for(let i=0;i<16;i++){const a=i*2.4,hh=1+(i%8)*.55,r=1.5-(hh/5.5)*1.2;const c=[0xff3a3a,0xffd23f,0x36a8ff,0xff7ab8][i%4];const m=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.6,roughness:.3}));m.position.set(ox*0+6.5+Math.cos(a)*r,hh,-4.4+Math.sin(a)*r);g.add(m);orn.push(m)}
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(.4,0),new THREE.MeshStandardMaterial({color:0xffd23f,emissive:0xffd23f,emissiveIntensity:2}));star.position.set(6.5,6.3,-4.4);g.add(star);
  await A.place(g,'furniture','rugRounded',-2,.05,3.5);await A.place(g,'furniture','lampRoundFloor',-8.4,0,-5.2);await A.place(g,'furniture','tableCoffee',-2.2,0,4.4);
  const fan=await A.place(g,'furniture','ceilingFan',-2.5,H-1.6,1.5);
  // fireplace with stocking (the wool sock comes back here)
  const fp=new THREE.Group();fp.position.set(1.8,0,-D/2+.75);g.add(fp);const brick=M(0xa8543a,.85);box(fp,3.6,3.4,1.1,brick,0,1.7,0);box(fp,2.0,1.7,1.15,M(0x140c08,.9),0,.95,.02);box(fp,4.0,.3,1.3,M(0xe9dcc6,.7),0,3.5,0);
  const sock=new THREE.Group();sock.position.set(-1.0,3.0,.72);fp.add(sock);sock.add(cbox(.5,.9,.18,M(0xd9332e,.9),.08,-.5));const toe=cbox(.7,.4,.18,M(0xd9332e,.9),.08,-1.0);toe.position.x=.12;sock.add(toe);box(sock,.56,.22,.22,M(0xf7f7f2,.9),0,-.08,0);
  const thermo=textPlane('40°C',1.6,.8,'#ffffff','#e5353b',150,256,128);thermo.position.set(-8.9,5.2,-2);thermo.rotation.y=Math.PI/2;g.add(thermo);
  const table=new THREE.Group();table.position.set(4.6,0,2.6);g.add(table);box(table,2.8,.16,1.6,M(0xa87a4a,.6),0,1.6,0);[[-1.2,-.6],[1.2,-.6],[-1.2,.6],[1.2,.6]].forEach(([x,z])=>box(table,.14,1.6,.14,M(0x7a5a3a,.6),x,.8,z));
  const letter=new THREE.Mesh(new THREE.PlaneGeometry(.9,.65),new THREE.MeshStandardMaterial({map:canvasTex(256,180,(c,W,H)=>{c.fillStyle='#fffaf0';c.fillRect(0,0,W,H);c.strokeStyle='#5a6a9a';c.lineWidth=3;for(let i=0;i<7;i++){c.beginPath();c.moveTo(18,26+i*22);c.lineTo(W-18-((i*37)%60),26+i*22);c.stroke()}c.fillStyle='#d9332e';c.font='22px CapB';c.fillText('Papai Noel,',18,18)})}));
  letter.rotation.x=-Math.PI/2;letter.position.set(0,1.69,.1);table.add(letter);
  const warm=new THREE.PointLight(0xffb070,0,22,1.4);warm.position.set(ox-6,6,oz-2);scene.add(warm);
  g.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial)o.material.envMapIntensity=.25});
  return {g,sofa,fan,warm,sock,table,orn,fireplace:fp,H}}
// ---------- the alley with the Apaga-Mentira shop (night) ----------
export function alley(scene,ox,oz){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);
  const brickT=canvasTex(512,512,(c,W,H)=>{c.fillStyle='#5a3a3a';c.fillRect(0,0,W,H);for(let r=0;r<16;r++)for(let i=-1;i<5;i++){const v=110+((r*7+i*13)%40);c.fillStyle=`rgb(${v+40},${v-20},${v-30})`;c.fillRect(i*128+(r%2)*64+4,r*32+4,120,26)}},[4,3]);
  const bm=new THREE.MeshStandardMaterial({map:brickT,roughness:.9});const ground=new THREE.Mesh(new THREE.PlaneGeometry(14,40),M(0x3a3e48,.85));ground.rotation.x=-Math.PI/2;ground.position.y=.03;ground.receiveShadow=true;g.add(ground);
  box(g,.5,12,40,bm,-6,6,0);box(g,.5,12,22,bm,6,6,-9);box(g,14,12,.5,bm,0,6,-20);
  // shop front on the right wall (x=+6) from z=2..10, set back: facade at x=6
  const shop=new THREE.Group();shop.position.set(6,0,6);g.add(shop);const dark=M(0x1d2230,.6);const fm=M(0x3a2f4a,.8);box(shop,.5,1.4,8,fm,0,.7,0);box(shop,.5,8,8,fm,0,8,0);box(shop,.5,2.6,3.7,fm,0,2.7,-2.15);box(shop,.5,2.6,.5,fm,0,2.7,3.75);
  const winGlass=new THREE.Mesh(new THREE.PlaneGeometry(3.8,2.6),new THREE.MeshStandardMaterial({color:0x9fd2ff,transparent:true,opacity:.18,roughness:.05}));winGlass.position.set(-.27,2.7,1.6);winGlass.rotation.y=-Math.PI/2;shop.add(winGlass);
  box(shop,.3,.2,4.0,dark,-.3,1.35,1.6);box(shop,.3,.2,4.0,dark,-.3,4.05,1.6);box(shop,.3,2.9,.2,dark,-.3,2.7,-.4);box(shop,.3,2.9,.2,dark,-.3,2.7,3.6);
  const door=box(shop,.2,3.4,1.6,M(0x2a1f30,.6),-.3,1.7,-2.2);
  const sign=textPlane('APAGA-MENTIRA',4.6,.9,null,'#ff3ad2',120,1024,200);sign.material.emissive=new THREE.Color(0xff3ad2);sign.material.emissiveIntensity=2.4;sign.position.set(-.32,5.0,.6);sign.rotation.y=-Math.PI/2;shop.add(sign);
  const poster=textPlane('R$ 50\nPOR NÚMERO',1.5,1.1,'#ffd23f','#1d1d1d',90,256,190);poster.position.set(-.3,2.6,-.4-1.25);poster.rotation.y=-Math.PI/2;shop.add(poster);
  // interior visible through the window (x from 6 to 14)
  const inside=new THREE.Group();inside.position.set(6,0,6);g.add(inside);const fl2=new THREE.Mesh(new THREE.PlaneGeometry(9.5,8),M(0x4a3a5a,.7));fl2.rotation.x=-Math.PI/2;fl2.position.set(4.75,.04,0);inside.add(fl2);
  box(inside,.4,8,8,M(0x6a4a7a,.8),9.5,4,0);box(inside,9.5,8,.4,M(0x6a4a7a,.8),4.75,4,4);box(inside,9.5,8,.4,M(0x6a4a7a,.8),4.75,4,-4);box(inside,9.5,.3,8,M(0x2a2030,.8),4.75,7.6,0);
  const counter=box(inside,1.4,1.6,4,M(0x2a2f3a,.5,{metalness:.4}),6.4,.8,0);const mach=box(inside,1.0,1.4,1.0,M(0x5a6272,.35,{metalness:.8}),6.4,2.3,-1);
  const scr=box(inside,.05,.6,.8,new THREE.MeshStandardMaterial({color:0x111,emissive:0x3dff7a,emissiveIntensity:1.6}),5.88,2.4,-1);
  const inL=new THREE.PointLight(0xff9adf,0,14,1.4);inL.position.set(ox+9,6,oz+6);scene.add(inL);const signL=new THREE.PointLight(0xff3ad2,0,10,1.6);signL.position.set(ox+4.5,5,oz+6.6);scene.add(signL);
  const lamp=C.lamp(true);lamp.position.set(-5.4,.03,-6);lamp.rotation.y=Math.PI;g.add(lamp);const lampL=new THREE.PointLight(0xffc880,0,18,1.5);lampL.position.set(ox-4,6.6,oz-6);scene.add(lampL);
  [[-5,10],[-5,-2]].forEach(([x,z])=>{const b=C.bin();b.position.set(x,.03,z);g.add(b)});
  g.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial)o.material.envMapIntensity=.25});
  return {g,sign,inL,signL,lampL,door,queue:[[ox+8.0,oz+8.3],[ox+9.3,oz+7.5],[ox+10.6,oz+8.2]],owner:[ox+14.1,oz+6.0],window:V(ox+5.7,2.7,oz+7.6)}}
