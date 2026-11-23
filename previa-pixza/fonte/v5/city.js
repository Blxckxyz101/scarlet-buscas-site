// City kit: modular, Roblox-style town pieces with procedural textures, merged into few draw calls.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

let seed=101;export const crnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};export const cseed=s=>{seed=s;for(let i=0;i<5;i++)crnd()};
const R=()=>crnd()-.5;const pick=a=>a[Math.floor(crnd()*a.length)];
const hex=c=>'#'+new THREE.Color(c).getHexString();
function tex(w,h,draw,rep,srgb=true){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);
  if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;t.wrapS=t.wrapT=THREE.RepeatWrapping;if(rep)t.repeat.set(...rep);return t}
const noiseFill=(g,w,h,a=.08,n=4000,s=2)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(${crnd()<.5?0:255},${crnd()<.5?0:255},${crnd()<.5?0:255},${crnd()*a})`;g.fillRect(crnd()*w,crnd()*h,s,s)}};

// ---------- materials (cached) ----------
const M={};
export function mats(){if(M.ok)return M;M.ok=1;
  M.grass=new THREE.MeshStandardMaterial({roughness:.95,map:tex(512,512,(g,w,h)=>{g.fillStyle='#7cc35a';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){g.fillStyle=`hsla(${95+R()*20},${45+R()*20}%,${42+R()*18}%,.5)`;g.fillRect(crnd()*w,crnd()*h,2,3+crnd()*3)}},[1,1])});
  M.asphalt=new THREE.MeshStandardMaterial({roughness:.92,map:tex(512,512,(g,w,h)=>{g.fillStyle='#4a4e57';g.fillRect(0,0,w,h);noiseFill(g,w,h,.12,14000,2);
    g.strokeStyle='rgba(20,20,25,.35)';g.lineWidth=2;for(let i=0;i<5;i++){g.beginPath();let x=crnd()*w,y=crnd()*h;g.moveTo(x,y);for(let k=0;k<6;k++){x+=R()*40;y+=R()*40;g.lineTo(x,y)}g.stroke()}},[1,1])});
  M.walk=new THREE.MeshStandardMaterial({roughness:.85,map:tex(256,256,(g,w,h)=>{g.fillStyle='#d6d1c8';g.fillRect(0,0,w,h);noiseFill(g,w,h,.08,3000,2);g.strokeStyle='rgba(90,80,70,.35)';g.lineWidth=3;
    for(let i=0;i<=2;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,h);g.stroke();g.beginPath();g.moveTo(0,i*128);g.lineTo(w,i*128);g.stroke()}},[1,1])});
  M.curb=new THREE.MeshStandardMaterial({color:0xb9b4ac,roughness:.8});
  M.line=new THREE.MeshStandardMaterial({color:0xf4f1e6,roughness:.7});M.yline=new THREE.MeshStandardMaterial({color:0xf3c63a,roughness:.7});
  M.white=new THREE.MeshStandardMaterial({color:0xf6f4ee,roughness:.6});M.dark=new THREE.MeshStandardMaterial({color:0x2d313c,roughness:.5,metalness:.3});
  M.metal=new THREE.MeshStandardMaterial({color:0x9aa3b2,roughness:.35,metalness:.7});M.wood=new THREE.MeshStandardMaterial({roughness:.8,map:tex(256,64,(g,w,h)=>{g.fillStyle='#9a6a42';g.fillRect(0,0,w,h);for(let i=0;i<40;i++){g.strokeStyle=`rgba(60,30,10,${.1+crnd()*.15})`;g.beginPath();const y=crnd()*h;g.moveTo(0,y);g.bezierCurveTo(w*.3,y+R()*8,w*.6,y+R()*8,w,y);g.stroke()}})});
  M.glass=new THREE.MeshStandardMaterial({color:0x9fd2f2,roughness:.08,metalness:.35,emissive:0xffd27a,emissiveIntensity:0});
  M.glassDark=new THREE.MeshStandardMaterial({color:0x5d86a8,roughness:.1,metalness:.5,emissive:0xffd27a,emissiveIntensity:0});
  M.water=new THREE.MeshStandardMaterial({color:0x3aa6d8,roughness:.08,metalness:.25,transparent:true,opacity:.92});
  M.leaf=[0x4fa64a,0x5bb54d,0x3f9442,0x6bbf52].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.85}));M.trunk=new THREE.MeshStandardMaterial({color:0x7a5233,roughness:.9});
  M.flower=[0xff5a7a,0xffd23f,0xffffff,0xb06cff,0xff8a3d].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.6}));
  M.bulb=new THREE.MeshStandardMaterial({color:0xfff4d0,emissive:0xffe2a0,emissiveIntensity:0});
  return M}
const MC={};export const solid=(c,r=.6,o={})=>{const k=c+'_'+r+JSON.stringify(o);return MC[k]||(MC[k]=new THREE.MeshStandardMaterial({color:c,roughness:r,...o}))};
const TC={};
export function siding(c){const k='s'+c;return TC[k]||(TC[k]=new THREE.MeshStandardMaterial({roughness:.75,map:tex(128,128,(g,w,h)=>{g.fillStyle=hex(c);g.fillRect(0,0,w,h);for(let y=0;y<h;y+=16){g.fillStyle='rgba(0,0,0,.10)';g.fillRect(0,y+13,w,3);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(0,y,w,2)}noiseFill(g,w,h,.04,600)},[1,1])}))}
export function brick(c){const k='b'+c;return TC[k]||(TC[k]=new THREE.MeshStandardMaterial({roughness:.9,map:tex(256,256,(g,w,h)=>{g.fillStyle='#e6ddd2';g.fillRect(0,0,w,h);for(let r=0;r<16;r++)for(let i=-1;i<5;i++){
  g.fillStyle=hex(new THREE.Color(c).offsetHSL(0,0,R()*.06));g.fillRect(i*64+(r%2)*32+2,r*16+2,60,12)}noiseFill(g,w,h,.05,1500)},[1,1])}))}
export function shingles(c){const k='r'+c;return TC[k]||(TC[k]=new THREE.MeshStandardMaterial({roughness:.85,map:tex(256,256,(g,w,h)=>{g.fillStyle=hex(c);g.fillRect(0,0,w,h);
  for(let r=0;r<16;r++){for(let i=-1;i<9;i++){g.fillStyle=hex(new THREE.Color(c).offsetHSL(0,0,R()*.05));g.fillRect(i*32+(r%2)*16+1,r*16,30,14)}g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,r*16+13,w,3)}},[1,1])}))}
export function facade(c,lit=false){const k='f'+c+lit;return TC[k]||(TC[k]=new THREE.MeshStandardMaterial({roughness:.6,
  map:tex(256,256,(g,w,h)=>{g.fillStyle=hex(c);g.fillRect(0,0,w,h);noiseFill(g,w,h,.05,1500);for(let y=0;y<4;y++)for(let x=0;x<4;x++){const X=x*64+12,Y=y*64+10;g.fillStyle='#f4f1ea';g.fillRect(X-4,Y-4,48,52);
    g.fillStyle=lit&&crnd()<.6?'#ffd98a':(crnd()<.5?'#86b9dc':'#6fa3c9');g.fillRect(X,Y,40,44);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(X,Y,40,8);g.fillStyle='#f4f1ea';g.fillRect(X+18,Y,4,44);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(X-4,Y+48,48,4)}},[1,1]),
  emissiveMap:lit?tex(256,256,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(crnd()<.55){g.fillStyle='#ffcf70';g.fillRect(x*64+12,y*64+10,40,44)}},[1,1]):null,emissive:lit?0xffffff:0x000000,emissiveIntensity:lit?.45:0}))}

// ---------- batcher: merge static meshes by material ----------
export class Batch{constructor(){this.map=new Map();this.root=new THREE.Group()}
  add(geo,mat,m4){const g=geo.index?geo.toNonIndexed():geo.clone();g.applyMatrix4(m4);['uv1','uv2'].forEach(a=>g.deleteAttribute(a));if(!g.attributes.uv){g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*2),2))}
    if(!this.map.has(mat))this.map.set(mat,[]);this.map.get(mat).push(g)}
  addObj(obj){obj.updateMatrixWorld(true);obj.traverse(o=>{if(o.isMesh&&!o.userData.keep)this.add(o.geometry,o.material,o.matrixWorld)})}
  build(scene){for(const [mat,gs] of this.map){for(let i=0;i<gs.length;i+=400){const mg=mergeGeometries(gs.slice(i,i+400),false);const mesh=new THREE.Mesh(mg,mat);mesh.castShadow=mesh.receiveShadow=true;this.root.add(mesh)}}scene.add(this.root);return this.root}}

// ---------- primitives ----------
const GC={};const rbox=(w,h,d,r=.08,seg=2)=>{const k=[w,h,d,r,seg].join();return GC[k]||(GC[k]=new RoundedBoxGeometry(w,h,d,seg,Math.min(r,w/2-.001,h/2-.001,d/2-.001)))};
function mesh(geo,mat,x=0,y=0,z=0,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;if(parent)parent.add(m);return m}
const box=(p,w,h,d,mat,x,y,z,r=.06)=>mesh(rbox(w,h,d,r),mat,x,y,z,p);
// UV-scaled plain box (for textured walls so texture repeats by size)
function tbox(p,w,h,d,mat,x,y,z,scale=1){const g=new THREE.BoxGeometry(w,h,d);const uv=g.attributes.uv;const n=g.attributes.normal;
  for(let i=0;i<uv.count;i++){const nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i));const sx=nx>.5?d:w,sy=ny>.5?d:h;uv.setXY(i,uv.getX(i)*sx/(4*scale),uv.getY(i)*sy/(4*scale))}
  return mesh(g,mat,x,y,z,p)}

// window with frame, sill, mullions (+ optional shutters/flowerbox)
function windowW(p,x,y,z,w=1.7,h=1.9,o={}){const m=mats();const fr=o.frame?solid(o.frame,.5):m.white;box(p,w+.3,h+.3,.22,fr,x,y,z);box(p,w,h,.24,o.dark?m.glassDark:m.glass,x,y,z+.01,.02);
  box(p,.1,h,.3,fr,x,y,z+.02,.02);box(p,w,.1,.3,fr,x,y+h*.05,z+.02,.02);box(p,w+.5,.16,.42,fr,x,y-h/2-.18,z+.12,.04);
  if(o.shutter){[-1,1].forEach(s=>{const sh=box(p,.55,h+.1,.12,solid(o.shutter,.6),x+s*(w/2+.45),y,z+.02,.04)})}
  if(o.flowers){box(p,w+.2,.35,.45,m.wood,x,y-h/2-.45,z+.25,.05);for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.IcosahedronGeometry(.17,0),pick(m.flower));f.position.set(x-w/2+.25+i*(w-.5)/4,y-h/2-.18,z+.3);p.add(f)}}}
function door(p,x,y,z,col=0x8a4b2a,o={}){const m=mats();box(p,1.9,3.2,.22,m.white,x,y+1.6,z);box(p,1.55,2.95,.26,solid(col,.5),x,y+1.5,z+.02,.05);
  for(let i=0;i<2;i++)box(p,1.1,.9,.3,solid(new THREE.Color(col).offsetHSL(0,0,-.05).getHex(),.5),x,y+.75+i*1.3,z+.04,.04);
  mesh(new THREE.SphereGeometry(.09,10,8),solid(0xf2c230,.3,{metalness:.8}),x+.55,y+1.45,z+.2,p);if(o.awning)box(p,2.5,.18,1.1,solid(o.awning,.6),x,y+3.45,z+.5,.05)}

// ---------- house ----------
export const HOUSE_STYLES=[{wall:0xf6eee0,roof:0x3f6f52,shutter:0x3f6f52},{wall:0xbcd8f0,roof:0x3a4f80,shutter:0xffffff},{wall:0xc96a4a,roof:0x5a3a2a,brick:1},{wall:0xf8d98c,roof:0x8a4a32,shutter:0x8a4a32},
  {wall:0xf2b8c6,roof:0x6a3a5a,shutter:0xffffff},{wall:0xb7dcb0,roof:0x9a3a32,shutter:0x9a3a32},{wall:0xe9e4f5,roof:0x4a4a8a,shutter:0x4a4a8a},{wall:0xffffff,roof:0x2f3640,shutter:0x2f6fd0}];
export function house(opt={}){const m=mats();const p=new THREE.Group();const st=opt.style||pick(HOUSE_STYLES);const W=opt.w||9,D=opt.d||8,H=opt.h||(crnd()<.35?7.2:4.6),two=H>6;
  const wm=st.brick?brick(st.wall):siding(st.wall);tbox(p,W,H,D,wm,0,H/2,0,.5);
  box(p,W+.3,.5,D+.3,solid(0x8f8a82,.9),0,.25,0,.04);// foundation
  // gable roof with shingles
  const sh=new THREE.Shape();sh.moveTo(-W/2-.7,0);sh.lineTo(0,H*.0+3.4);sh.lineTo(W/2+.7,0);sh.closePath();const rg=new THREE.ExtrudeGeometry(sh,{depth:D+1.2,bevelEnabled:false});rg.translate(0,0,-(D+1.2)/2);
  const uv=rg.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.12,uv.getY(i)*.12);mesh(rg,shingles(st.roof),0,H,0,p);
  const gs=new THREE.Shape();gs.moveTo(-W/2,0);gs.lineTo(0,3.2);gs.lineTo(W/2,0);gs.closePath();[D/2+.01].forEach(z=>{const gm=mesh(new THREE.ShapeGeometry(gs),wm,0,H,z,p)});
  const bk=mesh(new THREE.ShapeGeometry(gs),wm,0,H,-D/2-.01,p);bk.rotation.y=Math.PI;
  box(p,W+1.5,.22,.3,m.white,0,H+.05,D/2+.55,.05);// fascia
  const z=D/2+.11;door(p,-W/4,.5,z,pick([0x8a4b2a,0xd9473a,0x2f6fd0,0x2f8a5a,0xf2c14e]),{awning:crnd()<.5?st.roof:null});
  windowW(p,W/4,2.6,z,1.9,1.9,{shutter:st.shutter,flowers:crnd()<.5});if(two){windowW(p,-W/4,5.6,z,1.7,1.7,{shutter:st.shutter});windowW(p,W/4,5.6,z,1.7,1.7,{shutter:st.shutter})}
  const rw=mesh(new THREE.CircleGeometry(.6,20),m.glass,0,H+1.4,D/2+.03,p);box(p,1.5,.12,.2,m.white,0,H+.75,D/2+.05,.04);
  // side windows
  [[W/2+.11,Math.PI/2],[-W/2-.11,-Math.PI/2]].forEach(([x,ry])=>{const sg=new THREE.Group();sg.position.set(x,0,0);sg.rotation.y=ry;windowW(sg,0,2.6,0,1.5,1.6,{});p.add(sg)});
  if(crnd()<.6){const ch=new THREE.Group();tbox(ch,1.2,3.6,1.2,brick(0xb5523a),0,1.8,0,.25);box(ch,1.45,.3,1.45,solid(0x6f6a64,.8),0,3.65,0,.05);ch.position.set(W/4,H+.6,-D/6);p.add(ch)}
  // porch step + path + mailbox + bushes
  box(p,2.4,.25,1.2,solid(0xbab4aa,.85),-W/4,.12,D/2+.7,.04);
  for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.6+crnd()*.3,1),pick(m.leaf));b.position.set(W/4-1.2+i*.85,.5,D/2+.75);b.scale.y=.8;b.castShadow=true;p.add(b)}
  if(opt.fence!==false){for(let i=0;i<Math.floor(W/0.8);i++){if(Math.abs(-W/2+.4+i*.8-(-W/4))<1.2)continue;box(p,.22,1.2,.14,m.white,-W/2+.4+i*.8,.6,D/2+3.4,.04)}box(p,W,.14,.12,m.white,0,.85,D/2+3.35,.03);box(p,W,.14,.12,m.white,0,.4,D/2+3.35,.03)}
  const mb=new THREE.Group();box(mb,.12,1.2,.12,m.wood,0,.6,0);box(mb,.5,.45,.8,solid(pick([0x2f6fd0,0xd9473a,0x2d313c]),.4),0,1.35,0,.12);mb.position.set(-W/4+1.6,0,D/2+3.5);p.add(mb);
  p.userData={w:W,d:D+3.6,h:H};return p}

// ---------- shop / apartment building ----------
const SHOPS=[['PADARIA',0xd98a3a],['CAFÉ',0x6b3f2a],['MERCADO',0x2f8a5a],['PIZZARIA',0xd9473a],['FARMÁCIA',0x2f6fd0],['SORVETES',0xf27ba8],['LIVRARIA',0x5a3a8a],['BARBEARIA',0x2d313c]];
export function shop(opt={}){const m=mats();const p=new THREE.Group();const W=opt.w||10,D=opt.d||9,F=opt.floors||(2+Math.floor(crnd()*3)),FH=3.6,H=1.2+F*FH;const col=opt.col||pick([0xf2d4a6,0xd8e6f2,0xf2c4b4,0xe6dcf2,0xcfe8d8,0xf7e3a0,0xe8e2d8]);
  const [name,sc]=opt.shop||pick(SHOPS);
  const fm=facade(col,opt.lit);const body=new THREE.BoxGeometry(W,H-4.2,D);const uv=body.attributes.uv;const nn=body.attributes.normal;
  for(let i=0;i<uv.count;i++){const nx=Math.abs(nn.getX(i));const sx=nx>.5?D:W;uv.setXY(i,uv.getX(i)*sx/5,uv.getY(i)*(H-4.2)/5)}
  mesh(body,fm,0,4.2+(H-4.2)/2,0,p);
  // ground floor storefront
  tbox(p,W,4.2,D,brick(new THREE.Color(sc).offsetHSL(0,-.2,.15).getHex()),0,2.1,0,.5);
  box(p,W-1.6,2.6,.2,m.glassDark,0,1.9,D/2+.02,.03);box(p,W-1.4,.2,.3,m.dark,0,3.3,D/2+.06,.03);box(p,.2,2.8,.3,m.dark,-1,1.9,D/2+.06,.03);box(p,.2,2.8,.3,m.dark,W/4,1.9,D/2+.06,.03);
  // striped awning
  const aw=new THREE.Mesh(new THREE.BoxGeometry(W-.6,.12,2.2),new THREE.MeshStandardMaterial({roughness:.7,map:tex(256,32,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#ffffff':hex(sc);g.fillRect(i*32,0,32,h)}})}));aw.position.set(0,3.75,D/2+1);aw.rotation.x=.3;aw.castShadow=true;p.add(aw);
  const val=new THREE.Mesh(new THREE.BoxGeometry(W-.6,.5,.06),new THREE.MeshStandardMaterial({roughness:.7,map:tex(256,32,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#ffffff':hex(sc);g.beginPath();g.moveTo(i*32,0);g.lineTo(i*32+32,0);g.lineTo(i*32+16,h);g.fill()}})}));val.position.set(0,3.2,D/2+2.05);p.add(val);
  // sign
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(W*.62,1.1),new THREE.MeshStandardMaterial({roughness:.5,emissive:0xffffff,emissiveIntensity:opt.lit?.35:0,map:tex(768,136,(g,w,h)=>{g.fillStyle=hex(sc);g.beginPath();g.roundRect(4,4,w-8,h-8,30);g.fill();g.strokeStyle='#fff';g.lineWidth=8;g.stroke();
    g.fillStyle='#fff';g.font='92px CapB';g.textAlign='center';g.textBaseline='middle';g.fillText(name,w/2,h/2+6)})}));sg.position.set(0,4.55,D/2+.03);p.add(sg);
  // cornice + roof props
  box(p,W+.4,.4,D+.4,solid(0xf4f1ea,.6),0,H+.2,0,.05);box(p,W+.6,.25,D+.6,solid(0xdcd6cc,.6),0,4.25,0,.05);
  if(crnd()<.6){box(p,1.6,1.1,1.6,m.metal,W/4,H+.95,-D/5,.1)}if(crnd()<.5){const wt=new THREE.Group();mesh(new THREE.CylinderGeometry(1,1,1.8,14),m.wood,0,2.4,0,wt);mesh(new THREE.ConeGeometry(1.1,.7,14),m.dark,0,3.6,0,wt);
    for(let i=0;i<4;i++)box(wt,.12,1.6,.12,m.dark,Math.cos(i*1.57)*.7,.8,Math.sin(i*1.57)*.7,.02);wt.position.set(-W/4,H+.4,-D/6);p.add(wt)}
  // balconies
  if(opt.balcony!==false&&F>1)for(let f=1;f<F;f++)if(crnd()<.5){const bx=(crnd()<.5?-1:1)*W/4;box(p,3,.15,1.2,solid(0xe8e2d8,.6),bx,4.2+f*FH-1.6,D/2+.6,.04);for(let i=0;i<7;i++)box(p,.08,.9,.08,m.dark,bx-1.4+i*.47,4.2+f*FH-1.1,D/2+1.15,.02);box(p,3,.08,.1,m.dark,bx,4.2+f*FH-.65,D/2+1.15,.02)}
  p.userData={w:W,d:D,h:H};return p}

// background tower
export function tower(opt={}){const p=new THREE.Group();const W=opt.w||12,H=opt.h||40;const col=opt.col||pick([0xa8c8e8,0xf2c4b4,0xd8d2f0,0xf7e3a0,0xbfe0d0,0xffffff]);
  const fm=new THREE.MeshStandardMaterial({roughness:.4,metalness:.1,map:tex(128,256,(g,w,h)=>{g.fillStyle=hex(col);g.fillRect(0,0,w,h);for(let y=4;y<h;y+=16)for(let x=6;x<w;x+=20){g.fillStyle=opt.lit&&crnd()<.5?'#ffd98a':'rgba(90,140,190,.75)';g.fillRect(x,y,14,10)}},[1,1]),
    emissive:opt.lit?0xffc060:0,emissiveIntensity:opt.lit?.06:0});const g=new THREE.BoxGeometry(W,H,W);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*W/8,uv.getY(i)*H/16);
  mesh(g,fm,0,H/2,0,p);mesh(new THREE.BoxGeometry(W+.4,.6,W+.4),solid(0xf4f1ea,.6),0,H,0,p);if(crnd()<.5)mesh(new THREE.CylinderGeometry(.15,.15,6,6),mats().dark,0,H+3,0,p);return p}

// ---------- street props ----------
export function tree(s=1,kind){const m=mats();const p=new THREE.Group();kind=kind||pick(['round','round','tall','pine']);
  if(kind==='pine'){mesh(new THREE.CylinderGeometry(.25*s,.35*s,2*s,8),m.trunk,0,s,0,p);for(let i=0;i<3;i++)mesh(new THREE.ConeGeometry((2.2-i*.55)*s,2.4*s,9),solid(0x3f8f4a,.85),0,(2.4+i*1.5)*s,0,p);return p}
  mesh(new THREE.CylinderGeometry(.28*s,.42*s,(kind==='tall'?4:3)*s,8),m.trunk,0,(kind==='tall'?2:1.5)*s,0,p);
  const n=kind==='tall'?6:5;const lm=pick(m.leaf);for(let i=0;i<n;i++){const r=(1.3+crnd()*.6)*s;const b=new THREE.Mesh(new THREE.IcosahedronGeometry(r,2),lm);
    b.position.set(R()*1.6*s,(kind==='tall'?4.6:3.6)*s+crnd()*1.4*s,R()*1.6*s);b.castShadow=true;p.add(b)}return p}
export function lamp(lit=false){const m=mats();const p=new THREE.Group();mesh(new THREE.CylinderGeometry(.12,.18,6.5,10),m.dark,0,3.25,0,p);mesh(new THREE.CylinderGeometry(.3,.3,.4,10),m.dark,0,.2,0,p);
  const arm=new THREE.Mesh(new THREE.TorusGeometry(.7,.07,6,16,Math.PI/2),m.dark);arm.position.set(-.7,6.5,0);p.add(arm);box(p,.9,.3,.6,m.dark,-1.4,7.0,0,.1);const b=box(p,.7,.12,.45,m.bulb,-1.4,6.83,0,.04);b.userData.keep=true;p.userData.bulb=b;return p}
export function hydrant(){const p=new THREE.Group();const r=solid(0xd9332e,.45);mesh(new THREE.CylinderGeometry(.28,.32,.9,12),r,0,.45,0,p);mesh(new THREE.SphereGeometry(.3,12,8,0,Math.PI*2,0,Math.PI/2),r,0,.9,0,p);
  [-1,1].forEach(s=>{const n=mesh(new THREE.CylinderGeometry(.12,.12,.25,8),r,s*.33,.6,0,p);n.rotation.z=Math.PI/2});return p}
export function bench(){const m=mats();const p=new THREE.Group();for(let i=0;i<3;i++)box(p,3,.12,.35,m.wood,0,.9,-.3+i*.38,.03);for(let i=0;i<2;i++)box(p,3,.32,.1,m.wood,0,1.35+i*.42,-.55,.03);
  [-1.2,1.2].forEach(x=>{box(p,.12,.9,1,m.dark,x,.45,-.1,.03);box(p,.12,1.1,.12,m.dark,x,1.4,-.55,.03)});return p}
export function bin(){const p=new THREE.Group();mesh(new THREE.CylinderGeometry(.42,.36,1.2,14),solid(0x2f8a5a,.5),0,.6,0,p);mesh(new THREE.CylinderGeometry(.46,.46,.12,14),mats().dark,0,1.22,0,p);return p}
export function trafficLight(){const m=mats();const p=new THREE.Group();mesh(new THREE.CylinderGeometry(.13,.16,6,10),m.dark,0,3,0,p);box(p,.7,1.9,.6,solid(0x22252d,.5),0,6.6,0,.12);
  [[0xd9332e,7.15],[0xf2c230,6.6],[0x3fc46a,6.05]].forEach(([c,y],i)=>mesh(new THREE.SphereGeometry(.2,12,8),solid(c,.3,{emissive:c,emissiveIntensity:i===2?1.5:.1}),0,y,.32,p));return p}
export function stopSign(){const p=new THREE.Group();mesh(new THREE.CylinderGeometry(.06,.06,3,8),mats().metal,0,1.5,0,p);const s=new THREE.Mesh(new THREE.CircleGeometry(.6,8),new THREE.MeshStandardMaterial({map:tex(256,256,(g,w,h)=>{g.fillStyle='#d9332e';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='86px CapB';g.textAlign='center';g.textBaseline='middle';g.fillText('PARE',w/2,h/2+6)})}));s.rotation.z=Math.PI/8;s.position.set(0,3.1,.05);p.add(s);return p}
export function busStop(){const m=mats();const p=new THREE.Group();box(p,4.2,.15,1.8,m.dark,0,3,0,.05);[-1.9,1.9].forEach(x=>box(p,.12,3,.12,m.dark,x,1.5,-.7,.03));box(p,4,2.3,.08,new THREE.MeshStandardMaterial({color:0xcfe8ff,transparent:true,opacity:.35,roughness:.05}),0,1.65,-.75,.02);
  box(p,3,.12,.5,m.wood,0,.85,-.45,.03);const sg=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshStandardMaterial({map:tex(128,128,(g,w,h)=>{g.fillStyle='#2f6fd0';g.beginPath();g.arc(64,64,60,0,7);g.fill();g.fillStyle='#fff';g.font='64px CapB';g.textAlign='center';g.textBaseline='middle';g.fillText('🚌',64,68)})}));sg.position.set(2.1,3.6,0);p.add(sg);return p}
export function car(col){const m=mats();const p=new THREE.Group();col=col??pick([0xd9332e,0x2f6fd0,0xf2c230,0xffffff,0x3fc46a,0xff8a3d,0x9b6bd6,0x38c3d9]);const bm=solid(col,.25,{metalness:.35});
  box(p,2.4,1.0,4.8,bm,0,.95,0,.35);box(p,2.1,.9,2.6,bm,0,1.8,-.2,.35);box(p,2.14,.62,2.3,m.glassDark,0,1.85,-.2,.12);box(p,1.9,.6,.1,m.glassDark,0,1.85,1.12,.05);
  [[-1.1,1.55],[1.1,1.55],[-1.1,-1.55],[1.1,-1.55]].forEach(([x,z])=>{const w=mesh(new THREE.CylinderGeometry(.5,.5,.4,16),solid(0x1d1f24,.8),x,.5,z,p);w.rotation.z=Math.PI/2;const hc=mesh(new THREE.CylinderGeometry(.25,.25,.42,12),m.metal,x,.5,z,p);hc.rotation.z=Math.PI/2});
  [-.75,.75].forEach(x=>{mesh(new THREE.SphereGeometry(.16,10,8),solid(0xfff4d0,.2,{emissive:0xfff0c0,emissiveIntensity:.3}),x,1.05,2.4,p);mesh(new THREE.SphereGeometry(.14,10,8),solid(0xd9332e,.3,{emissive:0xff2020,emissiveIntensity:.2}),x,1.05,-2.4,p)});
  box(p,2.5,.25,.2,m.metal,0,.55,2.42,.05);box(p,2.5,.25,.2,m.metal,0,.55,-2.42,.05);return p}
export function flowers(n=12,spread=2){const m=mats();const p=new THREE.Group();for(let i=0;i<n;i++){const f=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,0),pick(m.flower));f.position.set(R()*spread,.25,R()*spread);p.add(f);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.25,4),m.leaf[0]);st.position.set(f.position.x,.12,f.position.z);p.add(st)}return p}

// ---------- street segment along X: road + sidewalks + crosswalk ----------
export function street(len=80,o={}){const m=mats();const p=new THREE.Group();const RW=o.rw||11,SW=o.sw||4;
  const rd=new THREE.Mesh(new THREE.PlaneGeometry(len,RW),m.asphalt);rd.material.map.repeat.set(len/12,RW/12);rd.rotation.x=-Math.PI/2;rd.position.y=.02;rd.receiveShadow=true;p.add(rd);
  for(let x=-len/2+2;x<len/2;x+=6){if(o.cross&&Math.abs(x-o.cross)<5)continue;const l=new THREE.Mesh(new THREE.PlaneGeometry(3,.25),m.yline);l.rotation.x=-Math.PI/2;l.position.set(x,.04,0);p.add(l)}
  [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.PlaneGeometry(len,.2),m.line);e.rotation.x=-Math.PI/2;e.position.set(0,.04,s*(RW/2-.5));p.add(e);
    const sw=new THREE.Mesh(new THREE.BoxGeometry(len,.32,SW),m.walk);const uv=sw.geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*len/2,uv.getY(i)*SW/2);
    sw.position.set(0,.16,s*(RW/2+SW/2+.15));sw.receiveShadow=true;p.add(sw);const cb=new THREE.Mesh(new THREE.BoxGeometry(len,.36,.3),m.curb);cb.position.set(0,.18,s*(RW/2+.15));p.add(cb)});
  if(o.cross!==undefined)for(let i=0;i<8;i++){const c=new THREE.Mesh(new THREE.PlaneGeometry(.9,RW-1.4),m.line);c.rotation.x=-Math.PI/2;c.position.set(o.cross-3.2+i*.95,.04,0);p.add(c)}
  return p}

// ---------- park ----------
export function park(W=40,D=30){const m=mats();const p=new THREE.Group();
  const path=new THREE.Mesh(new THREE.RingGeometry(7,9,48),solid(0xe2cfa4,.9));path.rotation.x=-Math.PI/2;path.position.y=.03;p.add(path);
  const pa=new THREE.Mesh(new THREE.PlaneGeometry(2,D),solid(0xe2cfa4,.9));pa.rotation.x=-Math.PI/2;pa.position.set(0,.03,0);p.add(pa);
  // pond
  const pond=new THREE.Mesh(new THREE.CircleGeometry(4.5,40),m.water);pond.rotation.x=-Math.PI/2;pond.position.set(-13,.08,-6);p.add(pond);
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const r=new THREE.Mesh(new THREE.IcosahedronGeometry(.45+crnd()*.25,0),solid(0x9a958c,.9));r.position.set(-13+Math.cos(a)*4.7,.15,-6+Math.sin(a)*4.7);r.scale.y=.6;p.add(r)}
  for(let i=0;i<3;i++){const lp=new THREE.Mesh(new THREE.CircleGeometry(.45,12),solid(0x4fa64a,.8));lp.rotation.x=-Math.PI/2;lp.position.set(-14+i*1.3,.1,-6.5+i*.8);p.add(lp)}
  // fountain center
  const f=new THREE.Group();mesh(new THREE.CylinderGeometry(3.2,3.4,.8,32),solid(0xd8d2c8,.7),0,.4,0,f);const fw=mesh(new THREE.CylinderGeometry(2.9,2.9,.1,32),m.water,0,.78,0,f);
  mesh(new THREE.CylinderGeometry(.4,.6,2.4,16),solid(0xd8d2c8,.7),0,1.6,0,f);mesh(new THREE.CylinderGeometry(1.4,.8,.4,24),solid(0xd8d2c8,.7),0,2.8,0,f);
  const jet=mesh(new THREE.ConeGeometry(.5,1.6,16,1,true),new THREE.MeshStandardMaterial({color:0xbfe8ff,transparent:true,opacity:.6,roughness:.05}),0,3.7,0,f);jet.rotation.x=Math.PI;p.add(f);
  // playground
  const pg=new THREE.Group();const sand=new THREE.Mesh(new THREE.CircleGeometry(5,28),solid(0xf0d9a0,.95));sand.rotation.x=-Math.PI/2;sand.position.y=.04;pg.add(sand);
  box(pg,2,.2,2,solid(0x2f6fd0,.4),0,2.6,0,.05);[[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]].forEach(([x,z])=>mesh(new THREE.CylinderGeometry(.09,.09,3.5,8),solid(0xd9332e,.4),x,1.75,z,pg));
  const sl=box(pg,1.4,.12,4,solid(0xf2c230,.35),0,1.4,2.6,.05);sl.rotation.x=.62;mesh(new THREE.ConeGeometry(1.5,1.1,4),solid(0xd9332e,.4),0,4,0,pg).rotation.y=Math.PI/4;
  for(let i=0;i<4;i++)box(pg,.9,.1,.3,solid(0xf6f4ee,.6),-.4,.4+i*.55,-1.1,.02);
  const sw=new THREE.Group();[-2,2].forEach(x=>{const a=mesh(new THREE.CylinderGeometry(.08,.08,3.6,8),solid(0x3fc46a,.4),x,1.7,0,sw);a.rotation.z=x>0?-.15:.15});mesh(new THREE.CylinderGeometry(.08,.08,4.4,8),solid(0x3fc46a,.4),0,3.4,0,sw).rotation.z=Math.PI/2;
  [-.8,.8].forEach(x=>{box(sw,.8,.1,.4,solid(0xd9332e,.5),x,.9,0,.03);[-.3,.3].forEach(o=>mesh(new THREE.CylinderGeometry(.02,.02,2.4,4),m.dark,x+o,2.15,0,sw))});sw.position.set(-5,0,0);pg.add(sw);
  pg.position.set(13,0,6);p.add(pg);
  // trees, benches, flowerbeds
  [[-16,8],[-8,11],[8,-11],[17,-6],[-18,-12],[4,12],[-4,-12],[19,12]].forEach(([x,z])=>{const t=tree(1.1);t.position.set(x,0,z);p.add(t)});
  [[0,-9.5,0],[0,9.5,Math.PI],[-9.5,0,Math.PI/2],[9.5,0,-Math.PI/2]].forEach(([x,z,r])=>{const b=bench();b.position.set(x,0,z);b.rotation.y=r;p.add(b)});
  [[-6,6],[6,-6],[6,6],[-6,-6]].forEach(([x,z])=>{const fb=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.5,.5,20),solid(0x6b4a2b,.9));fb.position.set(x,.25,z);p.add(fb);const fl=flowers(14,1.8);fl.position.set(x,.3,z);p.add(fl)});
  return p}

// ---------- sky / clouds ----------
export function skyTex(top,mid,bot){return tex(8,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,top);gr.addColorStop(.55,mid);gr.addColorStop(1,bot);g.fillStyle=gr;g.fillRect(0,0,w,h)},null)}
export function cloud(s=1){const p=new THREE.Group();const cm=solid(0xffffff,.95,{emissive:0xffffff,emissiveIntensity:.15});const n=4+Math.floor(crnd()*3);
  for(let i=0;i<n;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry((2+crnd()*1.6)*s,2),cm);b.position.set((i-n/2)*2.4*s,R()*1.2*s,R()*1.5*s);b.scale.y=.75;p.add(b)}return p}
