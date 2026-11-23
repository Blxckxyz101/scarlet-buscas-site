// R15-style character kit v5: chamfered parts, elbows/knees, fabric + decal details, lock-based hair, random NPC generator.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const GC={};
export function cbox(w,h,d,m,ch=.08,y=0){const k=[w,h,d,ch].join();const g=GC[k]||(GC[k]=new RoundedBoxGeometry(w,h,d,1,ch));
  const o=new THREE.Mesh(g,m);o.position.y=y;o.castShadow=o.receiveShadow=true;return o}
export function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep)}return t}
let seed=11;export const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};export const setSeed=s=>seed=s;
export const pick=a=>a[Math.floor(rnd()*a.length)];
const hex=c=>'#'+new THREE.Color(c).getHexString();
const NOISE=canvasTex(256,256,(g,w,h)=>{const id=g.createImageData(w,h);for(let i=0;i<id.data.length;i+=4){const v=128+(rnd()-.5)*70;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0)},[2,2]);
const FT={};
export function fabric(color,o={}){const k=color+JSON.stringify(o);if(FT[k])return FT[k];
  const map=canvasTex(256,256,(g,w,h)=>{g.fillStyle=hex(color);g.fillRect(0,0,w,h);
    if(o.stripes){g.fillStyle=hex(o.stripes);for(let y=0;y<h;y+=48)g.fillRect(0,y,w,20)}
    if(o.rib){g.fillStyle='rgba(0,0,0,.10)';for(let x=0;x<w;x+=10)g.fillRect(x,0,4,h)}
    const id=g.getImageData(0,0,w,h);const d=id.data;for(let i=0;i<d.length;i+=4){const n=(rnd()-.5)*12;d[i]+=n;d[i+1]+=n;d[i+2]+=n}g.putImageData(id,0,0);
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(255,255,255,.05)');gr.addColorStop(.75,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.18)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
  return FT[k]=new THREE.MeshStandardMaterial({map,bumpMap:NOISE,bumpScale:.5,roughness:o.rough??.88})}
export const plastic=(c,r=.45)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
export const decal=(w,h,draw,cw=512,chh=512)=>new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({transparent:true,roughness:.85,map:canvasTex(cw,chh,draw),polygonOffset:true,polygonOffsetFactor:-2,depthWrite:false}));

// ---------- faces ----------
const FC={};
export function face(expr){if(FC[expr])return FC[expr];
  const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');const ink='#161214';g.fillStyle=g.strokeStyle=ink;g.lineCap=g.lineJoin='round';
  const e=(x,y,rx,ry,col)=>{g.save();if(col)g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();g.restore()};
  const eyes=(ry=30,dy=0)=>{e(190,240+dy,19,ry);e(322,240+dy,19,ry);e(197,226+dy,7,9,'#fff');e(329,226+dy,7,9,'#fff');e(186,256+dy,3,4,'#fff');e(318,256+dy,3,4,'#fff')};
  const brows=(a,b,y=178,w=10)=>{g.lineWidth=w;g.beginPath();g.moveTo(160,y+a);g.quadraticCurveTo(190,y-8,222,y-a);g.stroke();g.beginPath();g.moveTo(352,y+b);g.quadraticCurveTo(322,y-8,290,y-b);g.stroke()};
  const mouthOpen=(y=330,w=66,h=42)=>{g.beginPath();g.moveTo(256-w,y);g.quadraticCurveTo(256,y+h*2.2,256+w,y);g.closePath();g.fill();
    g.save();g.clip();e(256,y+h*1.3,w*.6,h*.55,'#d9546a');g.fillStyle='#fff';g.fillRect(256-w,y-2,w*2,13);g.restore()};
  const sweat=()=>{g.save();g.fillStyle='#8fd3ff';g.strokeStyle='#161214';g.lineWidth=5;g.beginPath();g.moveTo(390,120);g.quadraticCurveTo(368,166,390,176);g.quadraticCurveTo(412,166,390,120);g.fill();g.stroke();g.restore()};
  const blush=()=>{e(160,300,30,14,'rgba(255,110,130,.35)');e(352,300,30,14,'rgba(255,110,130,.35)')};
  switch(expr){
    case 'grin':eyes();brows(0,0);mouthOpen();break;
    case 'nervous':eyes(28,4);brows(-10,-10,176,8);mouthOpen(334,58,34);sweat();break;
    case 'blink':g.lineWidth=11;g.beginPath();g.moveTo(170,244);g.quadraticCurveTo(190,256,212,244);g.stroke();g.beginPath();g.moveTo(302,244);g.quadraticCurveTo(322,256,344,244);g.stroke();brows(0,0);mouthOpen();break;
    case 'shout':eyes(32,-4);brows(10,10,165,10);g.beginPath();g.ellipse(256,345,62,58,0,0,7);g.fill();e(256,370,38,22,'#d9546a');g.fillStyle='#fff';g.fillRect(205,292,102,14);break;
    case 'nervous_blink':g.lineWidth=11;g.beginPath();g.moveTo(170,248);g.quadraticCurveTo(190,258,212,248);g.stroke();g.beginPath();g.moveTo(302,248);g.quadraticCurveTo(322,258,344,248);g.stroke();brows(-10,-10,176,8);mouthOpen(334,58,34);sweat();break;
    case 'talk':eyes();brows(0,0);g.beginPath();g.ellipse(256,342,40,26,0,0,7);g.fill();e(256,352,24,12,'#d9546a');break;
    case 'smug':g.lineWidth=12;g.beginPath();g.moveTo(160,232);g.quadraticCurveTo(196,220,232,232);g.stroke();g.beginPath();g.moveTo(280,232);g.quadraticCurveTo(316,220,352,232);g.stroke();
      e(207,244,13,11);e(327,244,13,11);g.lineWidth=10;g.beginPath();g.moveTo(206,326);g.quadraticCurveTo(230,352,256,326);g.quadraticCurveTo(282,352,306,326);g.stroke();break;
    case 'smug_talk':g.lineWidth=12;g.beginPath();g.moveTo(160,232);g.quadraticCurveTo(196,220,232,232);g.stroke();g.beginPath();g.moveTo(280,232);g.quadraticCurveTo(316,220,352,232);g.stroke();
      e(207,244,13,11);e(327,244,13,11);g.beginPath();g.moveTo(206,326);g.quadraticCurveTo(256,390,306,326);g.closePath();g.fill();break;
    case 'laugh':g.lineWidth=12;[[190,240],[322,240]].forEach(([x,y],i)=>{g.beginPath();g.moveTo(x+(i?22:-22),y-16);g.lineTo(x+(i?-8:8),y);g.lineTo(x+(i?22:-22),y+16);g.stroke()});mouthOpen(316,80,50);blush();break;
    case 'shock':e(190,236,32,38,'#fff');e(322,236,32,38,'#fff');g.lineWidth=7;g.beginPath();g.ellipse(190,236,32,38,0,0,7);g.stroke();g.beginPath();g.ellipse(322,236,32,38,0,0,7);g.stroke();
      e(190,242,11,13);e(322,242,11,13);e(256,352,26,34);brows(8,8,160,8);break;
    case 'angry':eyes(24,8);brows(-20,-20,190,13);g.lineWidth=11;g.beginPath();g.arc(256,372,40,1.2*Math.PI,1.8*Math.PI);g.stroke();break;
    case 'happy':eyes();brows(0,0);g.lineWidth=12;g.beginPath();g.arc(256,300,56,.2*Math.PI,.8*Math.PI);g.stroke();blush();break;
    case 'cry':g.lineWidth=11;[[190,236],[322,236]].forEach(([x,y],i)=>{g.beginPath();g.moveTo(x-24,y-6);g.quadraticCurveTo(x,y+14,x+24,y-6);g.stroke()});
      e(160,300,16,40,'#7cc8ff');e(352,300,16,40,'#7cc8ff');e(256,352,40,24);break;
    default:eyes();brows(0,0);g.lineWidth=12;g.beginPath();g.arc(256,300,52,.22*Math.PI,.78*Math.PI);g.stroke();
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return FC[expr]=t}

// ---------- hair v2: tapered curved clumps over a scalp shell ----------
function hairMat(col){return new THREE.MeshStandardMaterial({color:col,roughness:.6,metalness:0})}
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
// clump along a cubic bezier, radius r tapering to tip (taper 0..1), optional flatten along local x
function clump(m,p0,p1,p2,p3,r=.2,taper=.92,flat=1){const curve=new THREE.CubicBezierCurve3(p0,p1,p2,p3);const seg=14,rad=10;
  const g=new THREE.TubeGeometry(curve,seg,r,rad,false);const pos=g.attributes.position;const fr=curve.computeFrenetFrames(seg,false);
  for(let i=0;i<=seg;i++){const u=i/seg;const c=curve.getPointAt(u);const k=(1-u*taper)*(u<.12?(.75+u*2):1);
    for(let j=0;j<=rad;j++){const idx=i*(rad+1)+j;const v=V3(pos.getX(idx),pos.getY(idx),pos.getZ(idx)).sub(c);
      const nb=fr.binormals[i],nn=fr.normals[i];const a=v.dot(nn),b=v.dot(nb);const w=nn.clone().multiplyScalar(a*k).add(nb.clone().multiplyScalar(b*k*flat));
      pos.setXYZ(idx,c.x+w.x,c.y+w.y,c.z+w.z)}}
  g.computeVertexNormals();const o=new THREE.Mesh(g,m);o.castShadow=true;return o}
// head-surface helper: point on an ellipsoid around the head (head center y=.66, half sizes ~.68,.66,.66)
const HS=(az,el,s=1)=>{const r=.74*s;return V3(Math.sin(az)*Math.cos(el)*r*1.02,.72+Math.sin(el)*r*.98,Math.cos(az)*Math.cos(el)*r)};
function shell(g,m,top=.62,back=true){const cap=new THREE.Mesh(new RoundedBoxGeometry(1.42,.62,1.37,4,.3),m);cap.position.set(0,1.12-(top<.58?.04:0),-.0);cap.castShadow=true;g.add(cap);
  const fr=new THREE.Mesh(new RoundedBoxGeometry(1.44,.3,.3,3,.14),m);fr.position.set(0,1.02,.56);g.add(fr);
  if(back){const b=new THREE.Mesh(new RoundedBoxGeometry(1.42,.75,.42,3,.18),m);b.position.set(0,.86,-.5);b.castShadow=true;g.add(b);
    [-1,1].forEach(sd=>{const sb=new THREE.Mesh(new RoundedBoxGeometry(.2,.45,.9,2,.09),m);sb.position.set(sd*.68,.92,-.1);g.add(sb)})}}
// a "fall" clump: starts on scalp at (az,el), flows outward then down with given length & curl
function fall(g,m,az,el,len,r,out=.25,curl=0,flat=.8){const a=HS(az,el,1.0);const n=a.clone().sub(V3(0,.72,0)).normalize();
  const b=a.clone().add(n.clone().multiplyScalar(out)).add(V3(0,.05,0));const c=b.clone().add(V3(0,-len*.55,0)).add(n.clone().multiplyScalar(out*.4));
  const d=c.clone().add(V3(Math.sin(az+curl)*.12,-len*.45,Math.cos(az+curl)*.12));g.add(clump(m,a,b,c,d,r,.9,flat))}
export function hair(style,col){const g=new THREE.Group();const m=hairMat(col);const R=()=>rnd()-.5;
  switch(style){
    case 'swoop': // side-swept fringe, short sides
      shell(g,m,.58);for(let i=0;i<7;i++){const az=-.9+i*.3;const a=HS(az*.4,1.05),d=HS(az*.9+.9,.18,1.08);g.add(clump(m,a,a.clone().add(V3(.2,.25,.25)),d.clone().add(V3(0,.25,.3)),d.clone().add(V3(.1,-.1,.12)),.2,.9,.7))}
      for(let i=0;i<9;i++)fall(g,m,Math.PI*.35+i*.32,.35+R()*.1,.35,.16,.12,0,.7);break;
    case 'messy': // anime messy with fringe pieces
      shell(g,m,.6);for(let i=0;i<6;i++){const x=-.45+i*.18;const a=V3(x*.6,1.42,.25),d=V3(x*1.05+R()*.08,.82+R()*.06,.74);g.add(clump(m,a,V3(x*.8,1.45,.62),V3(x,1.15,.82),d,.17,.9,.65))}
      for(let i=0;i<12;i++){const az=Math.PI*.42+i*(Math.PI*1.16/11);fall(g,m,az,.55+R()*.15,.55+R()*.2,.2,.2,R()*.6,.75)}
      for(let i=0;i<6;i++){const az=R()*6.28;const a=HS(az,1.2),d=HS(az,.85,1.25).add(V3(0,.25,0));g.add(clump(m,a,a.clone().add(V3(0,.25,0)),d,d.clone().add(V3(0,.12,0)),.18,.95,.7))}break;
    case 'long':
      shell(g,m,.62);for(let i=0;i<7;i++){const x=-.42+i*.14;g.add(clump(m,V3(x*.5,1.4,.35),V3(x*.8,1.35,.7),V3(x,1.12,.78),V3(x*1.05,.95,.76),.15,.85,.6))}
      for(let i=0;i<16;i++){const az=Math.PI*.38+i*(Math.PI*1.24/15);fall(g,m,az,.45,1.7+R()*.2,.22,.12,0,.6)}break;
    case 'bob':
      shell(g,m,.62);for(let i=0;i<8;i++){const x=-.48+i*.137;g.add(clump(m,V3(x*.5,1.42,.32),V3(x*.85,1.38,.72),V3(x,1.15,.8),V3(x*1.05,1.0,.78),.15,.8,.6))}
      for(let i=0;i<16;i++){const az=Math.PI*.38+i*(Math.PI*1.24/15);fall(g,m,az,.45,.95,.23,.12,Math.sin(az)*.6,.6)}break;
    case 'ponytail':
      shell(g,m,.62);for(let i=0;i<7;i++){const x=-.42+i*.14;g.add(clump(m,V3(x*.5,1.4,.35),V3(x*.8,1.35,.7),V3(x,1.15,.78),V3(x*1.05,1.0,.76),.15,.85,.6))}
      {const t=V3(0,1.3,-.62);const tie=new THREE.Mesh(new THREE.TorusGeometry(.14,.06,8,16),plastic(0xff5a8a,.4));tie.position.copy(t);g.add(tie);
       for(let i=0;i<4;i++)g.add(clump(m,t,V3(R()*.2,1.5,-1.0),V3(R()*.3,.9,-1.15),V3(R()*.25,.45,-1.0),.2,.9,.8))}break;
    case 'buns':
      shell(g,m,.62);[-1,1].forEach(s=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.33,20,14),m);b.position.set(s*.52,1.5,-.12);b.castShadow=true;g.add(b);
        const tw=new THREE.Mesh(new THREE.TorusGeometry(.3,.05,8,20),m);tw.position.copy(b.position);tw.rotation.x=Math.PI/2;g.add(tw)});
      for(let i=0;i<8;i++){const x=-.48+i*.137;g.add(clump(m,V3(x*.5,1.42,.32),V3(x*.85,1.38,.72),V3(x,1.15,.8),V3(x*1.05,1.02,.78),.14,.8,.6))}break;
    case 'afro':{const geo=new THREE.IcosahedronGeometry(1.0,4);const p=geo.attributes.position;
      for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));const n=1+.06*Math.sin(v.x*11)*Math.sin(v.y*13)*Math.sin(v.z*12);v.multiplyScalar(n);p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();
      const a=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:col,roughness:.9,bumpMap:NOISE,bumpScale:3}));a.scale.set(1.05,.85,.95);a.position.set(0,1.25,-.18);a.castShadow=true;g.add(a);break}
    case 'curly':shell(g,m,.62);for(let i=0;i<46;i++){const az=R()*6.28,el=.2+rnd()*1.2;if(Math.cos(az)>.55&&el<.75)continue;const pp=HS(az,el,1.08);
      const c=new THREE.Mesh(new THREE.TorusGeometry(.12,.075,8,14),m);c.position.copy(pp);c.lookAt(pp.clone().multiplyScalar(2));c.rotateZ(rnd()*3);c.castShadow=true;g.add(c)}break;
    case 'mohawk':shell(g,m,.5);for(let i=0;i<7;i++){const z=.45-i*.17;const a=V3(0,1.38-Math.abs(z)*.2,z);g.add(clump(m,a,a.clone().add(V3(0,.3,0)),a.clone().add(V3(0,.55,-.1)),a.clone().add(V3(0,.7,-.25)),.17,.95,.45))}break;
    case 'buzz':shell(g,new THREE.MeshStandardMaterial({color:col,roughness:.8,bumpMap:NOISE,bumpScale:2}),.56,false);break;
    case 'quiff': // NICO: short dark sides + big lightning-bolt quiff that can glow
      shell(g,m,.56);for(let i=0;i<10;i++)fall(g,m,Math.PI*.45+i*.25,.35,.28,.15,.1,0,.7);
      for(let i=0;i<4;i++){const x=-.35+i*.2;g.add(clump(m,V3(x,1.2,.55),V3(x*.8,1.45,.75),V3(x*.4+.05,1.6,.55),V3(.05+x*.2,1.62,.3),.2,.7,.75))}
      break;
  }
  return g}
// Nico's signature: lightning-bolt quiff
export function boltQuiff(col=0xffc400){const g=new THREE.Group();const sh=new THREE.Shape();const P=[[0,0],[.34,.62],[.12,.6],[.4,1.15],[-.08,.5],[.12,.52],[-.16,0]];
  sh.moveTo(P[0][0],P[0][1]);P.slice(1).forEach(p=>sh.lineTo(p[0],p[1]));sh.closePath();
  const geo=new THREE.ExtrudeGeometry(sh,{depth:.26,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:3});geo.translate(-.1,0,-.13);
  const mtl=new THREE.MeshStandardMaterial({color:col,roughness:.35,emissive:col,emissiveIntensity:.25});const q=new THREE.Mesh(geo,mtl);q.castShadow=true;
  q.scale.setScalar(.9);q.position.set(.1,1.3,.32);q.rotation.set(-.5,0,-.22);g.add(q);g.userData.mat=mtl;return g}
function beanie(col,pom,letter){const g=new THREE.Group();const m=fabric(col,{rib:1,rough:.95});const top=new THREE.Mesh(new THREE.SphereGeometry(.86,22,14,0,Math.PI*2,0,Math.PI*.52),m);
  top.scale.set(1,.95,1);top.position.y=1.02;top.castShadow=true;g.add(top);const cuff=cbox(1.58,.38,1.58,fabric(col,{rib:1}),.16,1.0);g.add(cuff);
  if(pom){const pg=new THREE.IcosahedronGeometry(.34,3);const p=pg.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.multiplyScalar(1+(rnd()-.5)*.12);p.setXYZ(i,v.x,v.y,v.z)}
    pg.computeVertexNormals();const pm=new THREE.Mesh(pg,new THREE.MeshStandardMaterial({color:pom,roughness:1,bumpMap:NOISE,bumpScale:4}));pm.position.y=1.98;pm.castShadow=true;g.add(pm)}
  if(letter){const d=decal(.55,.55,(c,w,h)=>{c.fillStyle='#fff';c.beginPath();c.arc(w/2,h/2,w*.46,0,7);c.fill();c.fillStyle=letter.bg||'#222';c.beginPath();c.arc(w/2,h/2,w*.4,0,7);c.fill();
    c.fillStyle=letter.fg||'#fff';c.font='300px CapB';c.textAlign='center';c.textBaseline='middle';c.fillText(letter.t,w/2,h/2+18)});d.position.set(0,1.0,.8);g.add(d)}return g}
function cap(col,back){const g=new THREE.Group();const m=fabric(col);const c=new THREE.Mesh(new THREE.SphereGeometry(.8,18,12,0,Math.PI*2,0,Math.PI*.5),m);c.scale.set(1.02,.7,1.02);c.position.y=1.12;c.castShadow=true;g.add(c);
  const br=cbox(1.2,.1,.75,m,.04,1.12);br.position.z=back?-.95:.95;g.add(br);g.add(cbox(1.62,.14,1.62,m,.05,1.1));return g}
function headphones(col){const g=new THREE.Group();const m=plastic(col,.35);const band=new THREE.Mesh(new THREE.TorusGeometry(.82,.08,8,24,Math.PI),m);band.position.y=.75;g.add(band);
  [-1,1].forEach(s=>{const cup=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.22,18),m);cup.rotation.z=Math.PI/2;cup.position.set(s*.75,.7,0);cup.castShadow=true;g.add(cup)});return g}
function glasses(col){const g=new THREE.Group();const m=plastic(col,.3);[-.3,.3].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,8,22),m);r.position.set(x,.74,.66);g.add(r)});
  const b=new THREE.Mesh(new THREE.BoxGeometry(.2,.04,.04),m);b.position.set(0,.76,.66);g.add(b);return g}


// ---------- shark hood (Nhacudo) ----------
export function sharkHood(col=0x18b4ea){const g=new THREE.Group();const m=fabric(col,{rough:.8});const wm=plastic(0xfbfbf8,.35);const dk=plastic(0x0e1a2a,.3);
  const add=(o,x,y,z)=>{o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
  add(new THREE.Mesh(new RoundedBoxGeometry(1.7,.62,1.66,5,.3),m),0,1.42,-.04);
  add(new THREE.Mesh(new RoundedBoxGeometry(1.7,1.5,.5,5,.24),m),0,.76,-.62);
  [-1,1].forEach(s=>add(new THREE.Mesh(new RoundedBoxGeometry(.24,1.42,1.5,3,.11),m),s*.78,.76,-.02));
  add(new THREE.Mesh(new RoundedBoxGeometry(1.66,.3,.34,4,.14),m),0,1.27,.62);
  add(new THREE.Mesh(new RoundedBoxGeometry(1.66,.26,.4,4,.12),m),0,.02,.55);
  // teeth (one missing!)
  const tooth=new THREE.ConeGeometry(.085,.2,4);
  for(let i=0;i<9;i++){if(i===5)continue;const t=new THREE.Mesh(tooth,wm);t.rotation.x=Math.PI;t.position.set(-.56+i*.14,1.12,.76);t.scale.set(1,.8,1);g.add(t)}
  for(let i=0;i<8;i++){const t=new THREE.Mesh(tooth,wm);t.position.set(-.49+i*.14,.16,.73);t.scale.set(1,.7,1);g.add(t)}
  // fin
  const fs=new THREE.Shape();fs.moveTo(-.45,0);fs.quadraticCurveTo(-.2,.25,.05,.85);fs.quadraticCurveTo(.12,.4,.4,0);fs.lineTo(-.45,0);
  const fg=new THREE.ExtrudeGeometry(fs,{depth:.26,bevelEnabled:true,bevelSize:.05,bevelThickness:.05,bevelSegments:3});fg.translate(0,0,-.08);
  const fin=new THREE.Mesh(fg,m);fin.name='fin';fin.rotation.y=Math.PI/2-.62;fin.rotation.z=.12;fin.scale.set(1.35,1.15,1.1);fin.position.set(.05,1.66,-.1);fin.castShadow=true;g.add(fin);
  // hood eyes
  [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.11,16,12),dk);e.position.set(s*.86,1.2,.36);g.add(e);const h=new THREE.Mesh(new THREE.SphereGeometry(.035,8,6),wm);h.position.set(s*.93,1.24,.42);g.add(h);
    const gl=decal(.6,.5,(c,w,h)=>{c.strokeStyle='rgba(8,40,70,.55)';c.lineWidth=14;c.lineCap='round';for(let i=0;i<3;i++){c.beginPath();c.moveTo(w*(.25+i*.22),h*.15);c.quadraticCurveTo(w*(.18+i*.22),h*.5,w*(.25+i*.22),h*.85);c.stroke()}},256,220);
    gl.position.set(s*.905,.72,-.05);gl.rotation.y=s*Math.PI/2;g.add(gl)});
  return g}
export function sharkTail(col=0x18b4ea){const g=new THREE.Group();g.name='tail';const m=fabric(col);const t=new THREE.Mesh(new THREE.ConeGeometry(.32,1.1,10),m);t.rotation.x=-Math.PI/2+.35;t.position.set(0,.5,-1.0);t.scale.set(1.1,1.2,1.1);t.castShadow=true;g.add(t);
  const fs=new THREE.Shape();fs.moveTo(0,0);fs.lineTo(.45,.45);fs.lineTo(.2,0);fs.lineTo(.45,-.4);fs.closePath();const fg=new THREE.ExtrudeGeometry(fs,{depth:.1,bevelEnabled:true,bevelSize:.03,bevelThickness:.03});
  const f=new THREE.Mesh(fg,m);f.rotation.set(0,Math.PI/2,0);f.scale.setScalar(1.5);f.position.set(-.08,.72,-1.6);g.add(f);return g}

// ---------- character ----------
export function r15(scene,o={}){
  const root=new THREE.Group(),hip=new THREE.Group();root.add(hip);hip.position.y=2;
  const skin=plastic(o.skin??0xf2e4d4,.55);
  const top=o.topMat??fabric(o.shirt??0xe06a2a,{stripes:o.stripes,rib:o.rib});const sleeve=o.sleeveCol?fabric(o.sleeveCol):top;
  const bot=o.botMat??fabric(o.pants??0x2b3550);const shoe=plastic(o.shoe??0x22283a,.55);const sole=plastic(o.sole??0xf2f2f2,.6);
  hip.add(cbox(2,.42,1,o.jumpsuit?top:bot,.07,.21));
  const waist=new THREE.Group();waist.position.y=.42;hip.add(waist);waist.add(cbox(2,1.58,1,top,.09,.79));
  if(o.jumpsuit){const d=decal(2,1.6,(c,w,h)=>{c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=6;c.beginPath();c.moveTo(w/2,h*.28);c.lineTo(w/2,h);c.stroke();
      c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=5;c.strokeRect(w*.62,h*.5,w*.24,h*.22);c.beginPath();c.moveTo(w*.62,h*.56);c.lineTo(w*.86,h*.56);c.stroke();
      c.fillStyle='#f0f0ee';c.beginPath();c.moveTo(w*.33,0);c.lineTo(w/2,h*.3);c.lineTo(w*.67,0);c.fill();c.fillStyle='rgba(0,0,0,.12)';c.fillRect(0,0,w,8)},512,410);d.position.set(0,.8,.505);waist.add(d)}
  if(o.patch){const p=decal(.62,.38,(c,w,h)=>{c.fillStyle='#ededea';c.fillRect(0,0,w,h);c.strokeStyle='#2a2a2a';c.lineWidth=10;c.strokeRect(5,5,w-10,h-10);c.fillStyle='#1d1d1d';c.font='118px CapB';c.textAlign='center';c.textBaseline='middle';c.fillText(o.patch,w/2,h/2+6)},320,196);p.position.set(-.5,1.0,.51);waist.add(p)}
  if(o.hoodie){if(!o.shark){const hd=cbox(1.7,.7,.55,top,.22,1.5);hd.position.z=-.55;hd.rotation.x=-.3;waist.add(hd)}
    [-.32,.32].forEach(x=>{const sm=plastic(o.strings??0xffffff,.5);const s=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.62,6),sm);s.position.set(x,1.25,.53);waist.add(s);const tip=cbox(.09,.12,.09,sm,.02,0);tip.position.set(x,.92,.53);waist.add(tip)});
    const pk=decal(1.4,.6,(c,w,h)=>{c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=7;c.beginPath();c.moveTo(w*.1,h*.95);c.lineTo(w*.2,h*.1);c.lineTo(w*.8,h*.1);c.lineTo(w*.9,h*.95);c.stroke()},400,170);pk.position.set(0,.33,.506);waist.add(pk)}
  if(o.belly){const bl=decal(1.5,1.3,(c,w,h)=>{c.fillStyle='#fbfbf8';c.beginPath();c.roundRect(w*.08,h*.06,w*.84,h*.9,w*.3);c.fill()},400,350);bl.position.set(0,.72,.506);waist.add(bl);const tl=sharkTail(o.shirt);waist.add(tl)}
  if(o.logo){const lg=decal(.75,.75,o.logo);lg.position.set(0,.98,.507);waist.add(lg)}
  if(o.vest){const v=decal(2,1.6,(c,w,h)=>{c.fillStyle=hex(o.vest);c.beginPath();c.moveTo(0,0);c.lineTo(w*.3,0);c.lineTo(w/2,h*.45);c.lineTo(w*.7,0);c.lineTo(w,0);c.lineTo(w,h);c.lineTo(0,h);c.fill();
      c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=8;c.beginPath();for(let i=-6;i<12;i++){c.moveTo(i*60,h);c.lineTo(i*60+h,0)}c.stroke()},512,410);v.position.set(0,.8,.506);waist.add(v)}
  if(o.tie){const t=cbox(.26,1.1,.06,plastic(o.tie,.4),.03,1.0);t.position.z=.52;waist.add(t)}
  if(o.jacket){const J=o.jacket;const d=decal(2,1.6,(c,w,h)=>{c.fillStyle=hex(J.tee);c.fillRect(w*.36,0,w*.28,h*.9);
      c.fillStyle='rgba(0,0,0,.18)';c.fillRect(w*.355,0,7,h*.9);c.fillRect(w*.645-7,0,7,h*.9);
      if(J.teeLogo){c.save();c.translate(w*.38,h*.18);c.scale(.24,.3);J.teeLogo(c,w,h);c.restore()}
      for(let k=0;k<3;k++){c.fillStyle=k%2?hex(J.rib2):hex(J.rib);c.fillRect(0,h*.9+k*(h*.1/3),w,h*.1/3+1)}
      c.fillStyle='#f6f0e2';for(let k=0;k<4;k++){c.beginPath();c.arc(w*.33,h*(.2+k*.18),7,0,7);c.fill();c.beginPath();c.arc(w*.67,h*(.2+k*.18),7,0,7);c.fill()}
      if(J.patch){c.save();c.translate(w*.08,h*.12);J.patch(c,w*.22,w*.22);c.restore()}},512,410);d.position.set(0,.8,.506);waist.add(d);
    const back=decal(2,1.6,(c,w,h)=>{if(J.back)J.back(c,w,h);for(let k=0;k<3;k++){c.fillStyle=k%2?hex(J.rib2):hex(J.rib);c.fillRect(0,h*.9+k*(h*.1/3),w,h*.1/3+1)}},512,410);back.position.set(0,.8,-.506);back.rotation.y=Math.PI;waist.add(back);
    const col=new THREE.Mesh(new THREE.TorusGeometry(.62,.09,8,24),fabric(J.rib,{rib:1}));col.rotation.x=Math.PI/2;col.scale.set(1.3,.8,1);col.position.y=1.6;waist.add(col)}
  const neck=new THREE.Group();neck.position.y=1.6;waist.add(neck);const head=new THREE.Group();neck.add(head);
  const hm=new THREE.Mesh(GC.head||(GC.head=new RoundedBoxGeometry(1.3,1.25,1.25,4,.3)),skin);hm.position.y=.66;hm.castShadow=hm.receiveShadow=true;head.add(hm);
  const fm=new THREE.MeshStandardMaterial({map:face('grin'),transparent:true,roughness:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.3),fm);fp.position.set(0,.6,.632);head.add(fp);
  if(o.hair)head.add(hair(o.hair,o.hairCol??0x2b1d14));
  if(o.shark)head.add(sharkHood(o.shark));let quiff=null;if(o.quiff){quiff=boltQuiff(o.quiff);head.add(quiff)}
  if(o.bandaid){const b=decal(.36,.16,(c,w,h)=>{c.fillStyle='#f3c9a0';c.beginPath();c.roundRect(2,2,w-4,h-4,h/2);c.fill();c.fillStyle='#e6b48a';c.fillRect(w*.38,6,w*.24,h-12);c.fillStyle='rgba(0,0,0,.15)';for(let i=0;i<4;i++)for(let j=0;j<2;j++){c.beginPath();c.arc(w*.43+i*10,h*.38+j*16,2.5,0,7);c.fill()}},160,72);b.position.set(.36,.5,.645);b.rotation.z=.5;head.add(b)}
  if(o.beanie)head.add(beanie(o.beanie,o.pom,o.letter));if(o.cap)head.add(cap(o.cap,o.capBack));
  if(o.headphones)head.add(headphones(o.headphones));if(o.glasses)head.add(glasses(o.glasses));
  const limb=(x,y,parent,upMat,loMat,end,endMat,up,lo,en,arm)=>{const j1=new THREE.Group();const off=arm?Math.sign(x)*.5:0;j1.position.set(x-off,y,0);parent.add(j1);const um=cbox(.98,up,.98,upMat,.08,-up/2+(arm?.1:0));um.position.x=off;j1.add(um);
    const j2=new THREE.Group();j2.position.set(off,-up+(arm?.1:0),0);j1.add(j2);j2.add(cbox(.96,lo,.96,loMat,.08,-lo/2));const j3=new THREE.Group();j3.position.y=-lo;j2.add(j3);
    if(end==='foot'){const f=cbox(1,en,1.14,endMat,.1,-en/2);f.position.z=.07;j3.add(f);const s=cbox(1.02,.1,1.16,sole,.04,-en+.05);s.position.z=.07;j3.add(s)}
    else j3.add(cbox(.94,en,.94,endMat,.08,-en/2));return [j1,j2,j3]};
  const lowA=o.short?skin:sleeve;
  const [lS,lE,lH]=limb(-1.5,1.48,waist,sleeve,lowA,'hand',skin,.95,.82,.3,1);const [rS,rE,rH]=limb(1.5,1.48,waist,sleeve,lowA,'hand',skin,.95,.82,.3,1);
  if(o.cuff)[lE,rE].forEach(j=>j.add(cbox(1.0,.16,1.0,plastic(o.cuff,.6),.05,-.74)));
  if(o.ribCuff)[lE,rE].forEach(j=>{const cf=cbox(1.0,.2,1.0,fabric(o.ribCuff,{rib:1}),.05,-.74);j.add(cf)});
  const legM=o.jumpsuit?top:bot;const [lHp,lK,lF]=limb(-.5,0,hip,legM,legM,'foot',shoe,.95,.75,.3);const [rHp,rK,rF]=limb(.5,0,hip,legM,legM,'foot',shoe,.95,.75,.3);
  if(o.rollCuff)[lK,rK].forEach(j=>j.add(cbox(1.02,.2,1.02,fabric(o.rollCuff),.06,-.62)));
  lS.rotation.order=rS.rotation.order='YXZ';
  scene.add(root);
  const c={root,hip,waist,neck,head,fm,expr:'grin',lS,lE,lH,rS,rE,rH,lHp,lK,lF,rHp,rK,rF,quiff};
  c.fin=head.getObjectByName('fin');c.tail=waist.getObjectByName('tail');
  c.face=e=>{if(c.expr!==e){fm.map=face(e);fm.needsUpdate=true;c.expr=e}};
  c.pose=(p={})=>{const d=v=>v||0;
    lS.rotation.set(d(p.lsx),d(p.lsy),d(p.lsz));rS.rotation.set(d(p.rsx),d(p.rsy),d(p.rsz));lE.rotation.set(d(p.lex),0,0);rE.rotation.set(d(p.rex),0,0);
    lH.rotation.set(d(p.lhdx),0,0);rH.rotation.set(d(p.rhdx),0,0);
    lHp.rotation.set(d(p.lhx),0,d(p.lhz));rHp.rotation.set(d(p.rhx),0,d(p.rhz));lK.rotation.set(d(p.lkx),0,0);rK.rotation.set(d(p.rkx),0,0);
    lF.rotation.set(d(p.lfx),0,0);rF.rotation.set(d(p.rfx),0,0);hip.position.y=2+d(p.hy);hip.rotation.set(d(p.hx),d(p.hry),0);
    waist.rotation.set(d(p.wx),d(p.wy),d(p.wz));neck.rotation.set(d(p.nx),d(p.ny),d(p.nz))};
  return c}

// ---------- mascot + random NPCs ----------
export const BOLT=(c,w,h)=>{c.fillStyle='#ffc400';c.beginPath();const pts=[[.6,.04],[.28,.56],[.5,.56],[.4,.96],[.74,.42],[.52,.42]];c.moveTo(pts[0][0]*w,pts[0][1]*h);pts.forEach(p=>c.lineTo(p[0]*w,p[1]*h));c.closePath();c.fill();c.lineWidth=16;c.strokeStyle='#2a1660';c.stroke()};
export const NHACUDO={skin:0xf0c49c,shirt:0x18b4ea,hoodie:1,strings:0xfbfbf8,belly:1,pants:0x1f2a4a,shoe:0xff3b3b,sole:0xffffff,shark:0x18b4ea,bandaid:1};
export const NICO={skin:0xe9b48a,shirt:0x6b3fd6,sleeveCol:0xf4ead8,pants:0x2f4a78,rollCuff:0x5a78a8,shoe:0xffffff,sole:0xffc400,ribCuff:0xffc400,
  hair:'quiff',hairCol:0x2a1a12,quiff:0xffc400,bandaid:1,
  jacket:{tee:0xf8f8f4,rib:0xffc400,rib2:0x6b3fd6,teeLogo:BOLT,patch:(c,w,h)=>{c.fillStyle='#ffc400';c.beginPath();c.arc(w/2,h/2,w*.48,0,7);c.fill();c.fillStyle='#6b3fd6';c.font=`${w*.8}px CapB`;c.textAlign='center';c.textBaseline='middle';c.fillText('N',w/2,h/2+w*.06)},
    back:(c,w,h)=>{c.save();c.translate(w*.35,h*.15);c.scale(.3,.55);BOLT(c,w,h);c.restore()}}};
const SKINS=[0xf6d7bd,0xf0c4a0,0xdba37b,0xb87a50,0x8a5636,0x5e3a24,0xf6d7bd,0xffe1c8];
const HAIRC=[0x1b1412,0x3a2618,0x6b3f22,0xc98a3d,0xe8c46a,0x9a2e1e,0x1d2858,0xd8d8d8,0xf28fb3,0x2f6fd0,0x1b1412,0x3a2618];
const SHIRT=[0xe85d75,0x5b8def,0xf2c14e,0x46c2b0,0xff9f43,0x7bd389,0xffffff,0x2b2b33,0xea5a3c,0x3fb0e8,0xf4e1c1,0x8a9aa8];
const PANTS=[0x2b3550,0x23232a,0x4a5d7a,0x6b4a2b,0x3b5f3b,0xd8cfc0,0x1e2a44];
const STYLES=['swoop','messy','long','bob','ponytail','buns','afro','curly','mohawk','buzz','swoop','messy'];
export function randomNPC(scene,s,extra={}){setSeed(s*7919+13);for(let i=0;i<9;i++)rnd();const style=extra.hair||pick(STYLES);const o={skin:pick(SKINS),hair:style,hairCol:pick(HAIRC),shirt:pick(SHIRT),pants:pick(PANTS),
  shoe:pick([0x22283a,0xffffff,0xe84a3a,0x111111,0x8a5a34])};
  const r=rnd();if(r<.18)o.stripes=pick(SHIRT);else if(r<.32)o.sleeveCol=pick(SHIRT);else if(r<.44)o.vest=pick(SHIRT);else if(r<.6)o.hoodie=1;
  if(rnd()<.2)o.glasses=pick([0x111111,0x7a4a2a,0xd23a3a]);if(rnd()<.14&&style!=='afro')o.headphones=pick([0xffffff,0x111111,0xe84a3a]);
  if(rnd()<.3&&['buzz','swoop'].includes(style)){o.cap=pick(SHIRT);o.capBack=rnd()<.5}
  if(rnd()<.25)o.short=1;
  return r15(scene,{...o,...extra})}
