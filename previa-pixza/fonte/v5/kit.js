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

// ---------- hair (locks) ----------
const lockGeo=(()=>{const g=new THREE.ConeGeometry(.2,1,8,4);g.translate(0,-.5,0);g.scale(1,1,.5);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const y=p.getY(i);p.setZ(i,p.getZ(i)+y*y*.25)}g.computeVertexNormals();return g})();
const SPIKE=(()=>{const g=new THREE.ConeGeometry(.2,1,7,2);g.translate(0,-.5,0);g.rotateX(Math.PI);g.translate(0,0,0);return g})();
function hairMat(col){return new THREE.MeshStandardMaterial({color:col,roughness:.42})}
function lock(m,x,y,z,len,rx,rz,w=1,ry=0){const o=new THREE.Mesh(lockGeo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz,'YXZ');o.scale.set(w,len,w);o.castShadow=true;return o}
export function hair(style,col){const g=new THREE.Group();const m=hairMat(col);
  const cap=(sy=.78,yy=1.02)=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.8,16,12,0,Math.PI*2,0,Math.PI*.55),m);c.scale.set(1.02,sy,1.0);c.position.y=yy;c.castShadow=true;g.add(c)};
  const ring=(n,y,r,len,tilt,skipFront=false,wd=1.1)=>{for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const ang=Math.atan2(Math.sin(a),Math.cos(a));if(skipFront&&Math.abs(ang-Math.PI/2)<.65)continue;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;const l=new THREE.Mesh(lockGeo,m);l.position.set(x,y,z);l.scale.set(wd,len*(.85+rnd()*.3),wd);
    const out=new THREE.Vector3(x,0,z).normalize();const dir=new THREE.Vector3(out.x*tilt,-1,out.z*tilt).normalize();l.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);l.castShadow=true;g.add(l)}};
  const fringe=(n,len,rx,spread=.15,sweep=0,wd=1.2)=>{for(let i=0;i<n;i++)g.add(lock(m,-(n-1)*spread/2+i*spread,1.22,.62,len*(.85+rnd()*.3),rx,sweep+(rnd()-.5)*.15,wd))};
  switch(style){
    case 'spiky':cap();for(let i=0;i<46;i++){const a=rnd()*Math.PI*2,el=.25+rnd()*.95;const dir=new THREE.Vector3(Math.cos(a)*Math.sin(el),Math.cos(el)*.9+.2,Math.sin(a)*Math.sin(el)).normalize();
        const l=new THREE.Mesh(SPIKE,m);l.scale.set(1,.55+rnd()*.3,1);l.position.set(dir.x*.66,1.05+dir.y*.4,dir.z*.66);l.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);l.castShadow=true;g.add(l)}
      fringe(7,.62,-.35,.16,0);break;
    case 'emo':cap(.8);ring(18,1.15,.7,.85,.25,true,1.2);fringe(8,.95,-.22,.13,.5,1.3);break;
    case 'messy':cap(.7,1.0);
      for(let i=0;i<26;i++){const a=i/26*Math.PI*2+rnd()*.2;const out=new THREE.Vector3(Math.cos(a),0,Math.sin(a));if(out.z>.55)continue;const l=new THREE.Mesh(lockGeo,m);l.position.set(out.x*.3,1.55,out.z*.3-.05);
        const dir=new THREE.Vector3(out.x*1.25,-.55-rnd()*.3,out.z*1.25).normalize();l.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir);l.scale.set(1.5,.95+rnd()*.25,1.5);l.castShadow=true;g.add(l)}
      ring(22,1.22,.7,.72,.38,true,1.35);
      for(let i=0;i<8;i++){const x=-.56+i*.16;g.add(lock(m,x,1.5,.45,.62+rnd()*.15,-.95+rnd()*.15,(x)*.6+(rnd()-.5)*.2,1.4))}break;
    case 'long':cap(.8);ring(22,1.15,.7,1.7,.12,true,1.3);fringe(7,.42,-.5,.16,0);break;
    case 'bob':cap(.8);ring(22,1.15,.72,1.05,.2,true,1.3);fringe(8,.38,-.45,.15,0);break;
    case 'pigtails':cap(.8);fringe(8,.38,-.45,.15,0);
      [-1,1].forEach(s=>{const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.26,1),m);b.position.set(s*.8,1.15,-.1);g.add(b);for(let i=0;i<5;i++){const l=lock(m,s*.9,1.1,-.1+(i-2)*.07,1.2,0,s*.3,1.4);g.add(l)}});break;
    case 'bun':cap(.82);fringe(8,.3,-.6,.15,0);const bn=new THREE.Mesh(new THREE.IcosahedronGeometry(.42,2),m);bn.position.set(0,1.75,-.3);bn.castShadow=true;g.add(bn);break;
    case 'afro':for(let i=0;i<40;i++){const a=rnd()*Math.PI*2,el=rnd()*1.5;const s=new THREE.Mesh(new THREE.IcosahedronGeometry(.34+rnd()*.12,1),m);
        s.position.set(Math.cos(a)*Math.sin(el)*.82,1.12+Math.cos(el)*.55,Math.sin(a)*Math.sin(el)*.82-.05);if(s.position.z>.4&&s.position.y<1.4)continue;s.castShadow=true;g.add(s)}break;
    case 'buzz':cap(.62,.98);break;
    case 'swept':cap(.82);for(let i=0;i<12;i++)g.add(lock(m,-.55+i*.1,1.45,.45-i*.03,.85,-1.25,-.9,1.4));ring(14,1.1,.7,.55,.3,true,1.2);break;
  }
  return g}
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
  if(o.hoodie){const hd=cbox(1.7,.7,.55,top,.22,1.5);hd.position.z=-.55;hd.rotation.x=-.3;waist.add(hd);
    [-.32,.32].forEach(x=>{const sm=plastic(o.strings??0xffffff,.5);const s=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.62,6),sm);s.position.set(x,1.25,.53);waist.add(s);const tip=cbox(.09,.12,.09,sm,.02,0);tip.position.set(x,.92,.53);waist.add(tip)});
    const pk=decal(1.4,.6,(c,w,h)=>{c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=7;c.beginPath();c.moveTo(w*.1,h*.95);c.lineTo(w*.2,h*.1);c.lineTo(w*.8,h*.1);c.lineTo(w*.9,h*.95);c.stroke()},400,170);pk.position.set(0,.33,.506);waist.add(pk)}
  if(o.logo){const lg=decal(.75,.75,o.logo);lg.position.set(0,.98,.507);waist.add(lg)}
  if(o.vest){const v=decal(2,1.6,(c,w,h)=>{c.fillStyle=hex(o.vest);c.beginPath();c.moveTo(0,0);c.lineTo(w*.3,0);c.lineTo(w/2,h*.45);c.lineTo(w*.7,0);c.lineTo(w,0);c.lineTo(w,h);c.lineTo(0,h);c.fill();
      c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=8;c.beginPath();for(let i=-6;i<12;i++){c.moveTo(i*60,h);c.lineTo(i*60+h,0)}c.stroke()},512,410);v.position.set(0,.8,.506);waist.add(v)}
  if(o.tie){const t=cbox(.26,1.1,.06,plastic(o.tie,.4),.03,1.0);t.position.z=.52;waist.add(t)}
  const neck=new THREE.Group();neck.position.y=1.6;waist.add(neck);const head=new THREE.Group();neck.add(head);
  const hm=new THREE.Mesh(GC.head||(GC.head=new RoundedBoxGeometry(1.3,1.25,1.25,4,.3)),skin);hm.position.y=.66;hm.castShadow=hm.receiveShadow=true;head.add(hm);
  const fm=new THREE.MeshStandardMaterial({map:face('grin'),transparent:true,roughness:.6,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.3),fm);fp.position.set(0,.6,.632);head.add(fp);
  if(o.hair)head.add(hair(o.hair,o.hairCol??0x2b1d14));
  if(o.beanie)head.add(beanie(o.beanie,o.pom,o.letter));if(o.cap)head.add(cap(o.cap,o.capBack));
  if(o.headphones)head.add(headphones(o.headphones));if(o.glasses)head.add(glasses(o.glasses));
  const limb=(x,y,parent,upMat,loMat,end,endMat,up,lo,en,arm)=>{const j1=new THREE.Group();const off=arm?Math.sign(x)*.5:0;j1.position.set(x-off,y,0);parent.add(j1);const um=cbox(.98,up,.98,upMat,.08,-up/2+(arm?.1:0));um.position.x=off;j1.add(um);
    const j2=new THREE.Group();j2.position.set(off,-up+(arm?.1:0),0);j1.add(j2);j2.add(cbox(.96,lo,.96,loMat,.08,-lo/2));const j3=new THREE.Group();j3.position.y=-lo;j2.add(j3);
    if(end==='foot'){const f=cbox(1,en,1.14,endMat,.1,-en/2);f.position.z=.07;j3.add(f);const s=cbox(1.02,.1,1.16,sole,.04,-en+.05);s.position.z=.07;j3.add(s)}
    else j3.add(cbox(.94,en,.94,endMat,.08,-en/2));return [j1,j2,j3]};
  const lowA=o.short?skin:sleeve;
  const [lS,lE,lH]=limb(-1.5,1.48,waist,sleeve,lowA,'hand',skin,.95,.82,.3,1);const [rS,rE,rH]=limb(1.5,1.48,waist,sleeve,lowA,'hand',skin,.95,.82,.3,1);
  if(o.cuff)[lE,rE].forEach(j=>j.add(cbox(1.0,.16,1.0,plastic(o.cuff,.6),.05,-.74)));
  const legM=o.jumpsuit?top:bot;const [lHp,lK,lF]=limb(-.5,0,hip,legM,legM,'foot',shoe,.95,.75,.3);const [rHp,rK,rF]=limb(.5,0,hip,legM,legM,'foot',shoe,.95,.75,.3);
  lS.rotation.order=rS.rotation.order='YXZ';
  scene.add(root);
  const c={root,hip,waist,neck,head,fm,expr:'grin',lS,lE,lH,rS,rE,rH,lHp,lK,lF,rHp,rK,rF};
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
export const NICO={skin:0xf3d2b4,shirt:0x6b3fd6,hoodie:1,strings:0xffc400,pants:0x23263a,shoe:0xffc400,sole:0xffffff,beanie:0xffc400,pom:0xff7a1a,
  letter:{t:'N',bg:'#6b3fd6',fg:'#ffc400'},hair:'buzz',hairCol:0x3a2618,logo:BOLT};
const SKINS=[0xf6d7bd,0xf0c4a0,0xdba37b,0xb87a50,0x8a5636,0x5e3a24,0xf6d7bd,0xffe1c8];
const HAIRC=[0x1b1412,0x3a2618,0x6b3f22,0xc98a3d,0xe8c46a,0x9a2e1e,0x1d2858,0xd8d8d8,0xf28fb3,0x2f6fd0,0x1b1412,0x3a2618];
const SHIRT=[0xe85d75,0x5b8def,0xf2c14e,0x46c2b0,0xff9f43,0x7bd389,0xffffff,0x2b2b33,0xea5a3c,0x3fb0e8,0xf4e1c1,0x8a9aa8];
const PANTS=[0x2b3550,0x23232a,0x4a5d7a,0x6b4a2b,0x3b5f3b,0xd8cfc0,0x1e2a44];
const STYLES=['spiky','emo','messy','long','bob','pigtails','bun','afro','buzz','swept'];
export function randomNPC(scene,s,extra={}){setSeed(s*7919+13);for(let i=0;i<9;i++)rnd();const style=extra.hair||pick(STYLES);const o={skin:pick(SKINS),hair:style,hairCol:pick(HAIRC),shirt:pick(SHIRT),pants:pick(PANTS),
  shoe:pick([0x22283a,0xffffff,0xe84a3a,0x111111,0x8a5a34])};
  const r=rnd();if(r<.18)o.stripes=pick(SHIRT);else if(r<.32)o.sleeveCol=pick(SHIRT);else if(r<.44)o.vest=pick(SHIRT);else if(r<.6)o.hoodie=1;
  if(rnd()<.2)o.glasses=pick([0x111111,0x7a4a2a,0xd23a3a]);if(rnd()<.14&&style!=='afro')o.headphones=pick([0xffffff,0x111111,0xe84a3a]);
  if(rnd()<.3&&['buzz','messy','swept'].includes(style)){o.cap=pick(SHIRT);o.capBack=rnd()<.5}
  if(rnd()<.25)o.short=1;
  return r15(scene,{...o,...extra})}
