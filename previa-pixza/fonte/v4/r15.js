// R15-style character kit: chamfered parts, elbows/knees, textured clothes, mesh hair, decal faces.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const GC={};
export function cbox(w,h,d,m,ch=.07,y=0){const k=[w,h,d,ch].join();const g=GC[k]||(GC[k]=new RoundedBoxGeometry(w,h,d,1,ch));
  const o=new THREE.Mesh(g,m);o.position.y=y;o.castShadow=o.receiveShadow=true;return o}
export function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep)}return t}
let seed=11;export const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const hex=c=>'#'+new THREE.Color(c).getHexString();
// fabric: base color + fine noise + soft folds
const FT={};
export function fabric(color,o={}){const k=color+JSON.stringify(o);if(FT[k])return FT[k];
  const map=canvasTex(256,256,(g,w,h)=>{g.fillStyle=hex(color);g.fillRect(0,0,w,h);const id=g.getImageData(0,0,w,h);const d=id.data;
    for(let i=0;i<d.length;i+=4){const n=(rnd()-.5)*14+Math.sin(i/4%w*.09)*3;d[i]+=n;d[i+1]+=n;d[i+2]+=n}g.putImageData(id,0,0);
    if(o.seam){g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=3;g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke()}});
  const bump=canvasTex(128,128,(g,w,h)=>{const id=g.createImageData(w,h);for(let i=0;i<id.data.length;i+=4){const v=128+(rnd()-.5)*60;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0)},[3,3]);
  return FT[k]=new THREE.MeshStandardMaterial({map,bumpMap:bump,bumpScale:.6,roughness:o.rough??.85,metalness:0})}
export const plastic=(c,r=.45)=>new THREE.MeshStandardMaterial({color:c,roughness:r});

// faces (Roblox-like decals)
const FC={};
export function face(expr){if(FC[expr])return FC[expr];
  const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');const ink='#161214';g.fillStyle=g.strokeStyle=ink;g.lineCap=g.lineJoin='round';
  const e=(x,y,rx,ry,col)=>{g.save();if(col)g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();g.restore()};
  const mouthOpen=(y=330,w=70,h=44)=>{g.beginPath();g.moveTo(256-w,y);g.quadraticCurveTo(256,y+h*2.2,256+w,y);g.closePath();g.fill();
    g.save();g.clip();e(256,y+h*1.25,w*.6,h*.55,'#d9546a');g.fillStyle='#fff';g.fillRect(256-w,y-2,w*2,14);g.restore()};
  switch(expr){
    case 'grin':e(196,236,17,27);e(316,236,17,27);e(202,224,6,7,'#fff');e(322,224,6,7,'#fff');mouthOpen();
      g.lineWidth=9;g.beginPath();g.arc(196,180,16,1.15*Math.PI,1.85*Math.PI);g.stroke();g.beginPath();g.arc(316,180,16,1.15*Math.PI,1.85*Math.PI);g.stroke();break;
    case 'nervous':e(196,240,17,27);e(316,240,17,27);e(202,228,6,7,'#fff');e(322,228,6,7,'#fff');mouthOpen(332,62,38);
      g.lineWidth=9;g.beginPath();g.arc(196,182,16,1.15*Math.PI,1.85*Math.PI);g.stroke();g.beginPath();g.arc(316,182,16,1.15*Math.PI,1.85*Math.PI);g.stroke();
      g.save();g.fillStyle='#161214';g.beginPath();g.moveTo(250,120);g.quadraticCurveTo(232,160,250,168);g.quadraticCurveTo(268,160,250,120);g.fill();g.restore();break;
    case 'smug':g.lineWidth=12;g.beginPath();g.moveTo(160,236);g.quadraticCurveTo(196,224,232,236);g.stroke();g.beginPath();g.moveTo(280,236);g.quadraticCurveTo(316,224,352,236);g.stroke();
      e(205,246,12,10);e(325,246,12,10);g.lineWidth=10;g.beginPath();g.moveTo(206,326);g.quadraticCurveTo(230,352,256,326);g.quadraticCurveTo(282,352,306,326);g.stroke();break;
    case 'shock':e(196,236,30,36,'#fff');e(316,236,30,36,'#fff');g.lineWidth=6;g.beginPath();g.ellipse(196,236,30,36,0,0,7);g.stroke();g.beginPath();g.ellipse(316,236,30,36,0,0,7);g.stroke();
      e(196,240,10,12);e(316,240,10,12);e(256,350,26,34);break;
    case 'cry':g.lineWidth=11;[[196,236],[316,236]].forEach(([x,y])=>{g.beginPath();g.moveTo(x-22,y-12);g.lineTo(x+6,y);g.lineTo(x-22,y+12);g.stroke()});
      e(150,290,20,30,'#7cc8ff');e(362,290,20,30,'#7cc8ff');e(256,350,40,22);e(170,280,30,16,'rgba(255,120,140,.35)');e(342,280,30,16,'rgba(255,120,140,.35)');break;
    default:e(196,236,17,27);e(316,236,17,27);g.lineWidth=12;g.beginPath();g.arc(256,300,60,.2*Math.PI,.8*Math.PI);g.stroke();
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return FC[expr]=t}

// spiky hair from cones
function spikyHair(col){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:col,roughness:.55,flatShading:true});
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.78,14,10,0,Math.PI*2,0,Math.PI*.55),m);cap.scale.set(1,.75,1);cap.position.y=.95;cap.castShadow=true;g.add(cap);
  for(let i=0;i<60;i++){const a=rnd()*Math.PI*2,el=rnd()*.9;const s=new THREE.Mesh(new THREE.ConeGeometry(.2+rnd()*.12,.55+rnd()*.35,4),m);
    const dir=new THREE.Vector3(Math.cos(a)*Math.sin(el+.4),Math.cos(el+.4)*.6,Math.sin(a)*Math.sin(el+.4)).normalize();
    s.position.set(dir.x*.72,1.0+dir.y*.5,dir.z*.72);s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);s.castShadow=true;g.add(s)}
  for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.ConeGeometry(.2,.8,4),m);s.position.set(-.6+i*.15,1.0,.58);s.rotation.set(Math.PI*.8,0,(i-4)*.1);s.castShadow=true;g.add(s)}
  return g}
function ushanka(col){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:col,roughness:.95,bumpMap:canvasTex(64,64,(c,w,h)=>{for(let i=0;i<900;i++){c.fillStyle=`rgba(255,255,255,${rnd()*.5})`;c.fillRect(rnd()*w,rnd()*h,2,4)}}),bumpScale:2});
  const top=cbox(1.55,.75,1.55,m,.3,1.32);g.add(top);const brim=cbox(1.62,.32,1.62,m,.15,.98);g.add(brim);
  [-1,1].forEach(s=>{const f=cbox(.22,.95,1.05,m,.1,.55);f.position.x=s*.78;g.add(f)});const fr=cbox(1.3,.36,.25,m,.12,1.05);fr.position.z=.76;g.add(fr);return g}
function beanie(col,letter){const g=new THREE.Group();const m=fabric(col,{rough:.95});g.add(cbox(1.45,.7,1.45,m,.25,1.26));g.add(cbox(1.5,.3,1.5,m,.12,.96));
  if(letter){const p=new THREE.Mesh(new THREE.PlaneGeometry(.45,.45),new THREE.MeshStandardMaterial({transparent:true,map:canvasTex(256,256,(c)=>{c.fillStyle='#ffd23f';c.font='200px CapB';c.textAlign='center';c.textBaseline='middle';c.fillText(letter,128,140)})}));p.position.set(0,1.0,.76);g.add(p)}return g}

export function r15(scene,o={}){
  const root=new THREE.Group(),hip=new THREE.Group();root.add(hip);hip.position.y=2;
  const skin=plastic(o.skin??0xf4f4f2,.55);const top=o.topMat??fabric(o.shirt??0xe06a2a,{seam:o.seam});const bot=o.botMat??fabric(o.pants??o.shirt??0xe06a2a);const shoe=plastic(o.shoe??0x22283a,.6);
  const lower=cbox(2,.42,1,bot,.06,.21);hip.add(lower);
  const waist=new THREE.Group();waist.position.y=.42;hip.add(waist);const upper=cbox(2,1.58,1,top,.08,.79);waist.add(upper);
  if(o.vneck){const v=new THREE.Mesh(new THREE.CircleGeometry(.36,3),plastic(0xf2f2f2,.8));v.rotation.z=-Math.PI/2;v.position.set(0,1.38,.505);v.scale.set(1,1.1,1);waist.add(v)}
  if(o.patch){const p=new THREE.Mesh(new THREE.PlaneGeometry(.62,.36),new THREE.MeshStandardMaterial({roughness:.8,map:canvasTex(256,150,(c,w,h)=>{c.fillStyle='#ececec';c.fillRect(0,0,w,h);c.strokeStyle='#333';c.lineWidth=8;c.strokeRect(4,4,w-8,h-8);c.fillStyle='#222';c.font='92px CapB';c.textAlign='center';c.textBaseline='middle';c.fillText(o.patch,w/2,h/2+4)})}));p.position.set(-.52,.95,.506);waist.add(p)}
  if(o.tie){const t=cbox(.26,1.1,.06,plastic(o.tie,.4),.03,1.0);t.position.z=.52;waist.add(t)}
  const neck=new THREE.Group();neck.position.y=1.6;waist.add(neck);
  const head=new THREE.Group();neck.add(head);{const hg=new RoundedBoxGeometry(1.3,1.25,1.25,4,.3);const hm=new THREE.Mesh(hg,skin);hm.position.y=.66;hm.castShadow=hm.receiveShadow=true;head.add(hm)}
  const fm=new THREE.MeshStandardMaterial({map:face('grin'),transparent:true,roughness:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.32,1.32),fm);fp.position.set(0,.6,.63);head.add(fp);
  if(o.hair==='spiky')head.add(spikyHair(o.hairCol??0x1d2a5a));if(o.hair==='ushanka')head.add(ushanka(o.hairCol??0x2e8b2e));if(o.hair==='beanie')head.add(beanie(o.hairCol??0x2f4fb0,o.letter));
  const limb=(x,y,parent,upMat,loMat,end,endMat,up=1.0,lo=.72,en=.28)=>{const j1=new THREE.Group();j1.position.set(x,y,0);parent.add(j1);j1.add(cbox(.98,up,.98,upMat,.07,-up/2));
    const j2=new THREE.Group();j2.position.y=-up;j1.add(j2);j2.add(cbox(.96,lo,.96,loMat,.07,-lo/2));const j3=new THREE.Group();j3.position.y=-lo;j2.add(j3);
    const e=cbox(end==='foot'?1:.94,en,end==='foot'?1.12:.94,endMat,.08,-en/2);if(end==='foot')e.position.z=.06;j3.add(e);return [j1,j2,j3]};
  const sl=o.sleeve??'long';const armLo=sl==='long'?top:skin;
  const [lS,lE,lH]=limb(-1.5,1.58,waist,sl==='none'?skin:top,armLo,'hand',skin,.95,.82,.3);const [rS,rE,rH]=limb(1.5,1.58,waist,sl==='none'?skin:top,armLo,'hand',skin,.95,.82,.3);
  if(o.cuff){[lE,rE].forEach(j=>{const c=cbox(1.0,.16,1.0,plastic(o.cuff,.6),.05,-.74);j.add(c)})}
  const [lHp,lK,lF]=limb(-.5,0,hip,bot,bot,'foot',shoe,.95,.75,.3);const [rHp,rK,rF]=limb(.5,0,hip,bot,bot,'foot',shoe,.95,.75,.3);
  scene.add(root);
  const c={root,hip,waist,neck,head,fm,expr:'grin',lS,lE,lH,rS,rE,rH,lHp,lK,lF,rHp,rK,rF};
  c.face=e=>{if(c.expr!==e){fm.map=face(e);fm.needsUpdate=true;c.expr=e}};
  c.pose=(p={})=>{const d=v=>v||0;
    lS.rotation.set(d(p.lsx),d(p.lsy),d(p.lsz));rS.rotation.set(d(p.rsx),d(p.rsy),d(p.rsz));lE.rotation.set(d(p.lex),0,0);rE.rotation.set(d(p.rex),0,0);
    lHp.rotation.set(d(p.lhx),0,d(p.lhz));rHp.rotation.set(d(p.rhx),0,d(p.rhz));lK.rotation.set(d(p.lkx),0,0);rK.rotation.set(d(p.rkx),0,0);
    lF.rotation.set(d(p.lfx),0,0);rF.rotation.set(d(p.rfx),0,0);hip.position.y=2+d(p.hy);hip.rotation.set(d(p.hx),d(p.hry),0);
    waist.rotation.set(d(p.wx),d(p.wy),d(p.wz));neck.rotation.set(d(p.nx),d(p.ny),d(p.nz))};
  return c}
