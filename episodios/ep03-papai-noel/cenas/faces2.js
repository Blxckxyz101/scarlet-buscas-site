// Roblox-style decal faces: flat black ink, tall oval eyes, simple stroke mouths. Original drawings (not copies of catalog faces).
import * as THREE from 'three';
const INK='#111014';const CACHE={};
// parts: eyes, brows, mouth, extras  -> composed per expression; blink variant replaces eyes with closed lines
const EX={
  smile:{eyes:'oval',mouth:'smile'},            grin:{eyes:'oval',mouth:'grinOpen'},
  happy:{eyes:'arcs',mouth:'smile',blush:1},    joy:{eyes:'arcs',mouth:'bigOpen',blush:1,brows:'up'},
  laugh:{eyes:'xx',mouth:'bigOpen',blush:1},    neutral:{eyes:'oval',mouth:'flat'},
  talk:{eyes:'oval',mouth:'talkO'},             talk2:{eyes:'oval',mouth:'talkWide'},
  shock:{eyes:'wide',mouth:'O',brows:'high'},   scared:{eyes:'small',mouth:'wavy',brows:'worry',sweat:1},
  terrified:{eyes:'wide',mouth:'teethOpen',brows:'worry',sweat:1},
  angry:{eyes:'half',mouth:'grit',brows:'angry'},shout:{eyes:'half',mouth:'shout',brows:'angry'},
  sad:{eyes:'oval',mouth:'frown',brows:'worry'},cry:{eyes:'closedDown',mouth:'cryOpen',brows:'worry',tears:1},
  determined:{eyes:'half',mouth:'firm',brows:'flat'},smug:{eyes:'lids',mouth:'smirk'},smirk:{eyes:'lids',mouth:'smirk',brows:'oneUp'},
  nervous:{eyes:'oval',mouth:'wobble',brows:'worry',sweat:1},confused:{eyes:'oval',mouth:'squiggle',brows:'oneUp'},
  sleep:{eyes:'closed',mouth:'smallO'},wow:{eyes:'stars',mouth:'bigOpen',brows:'high'},relief:{eyes:'arcs',mouth:'smile',brows:'worry'},
  evil:{eyes:'half',mouth:'evil',brows:'angry'},bored:{eyes:'lids',mouth:'flat'},wink:{eyes:'wink',mouth:'smile',blush:1},brace:{eyes:'xx',mouth:'grit',brows:'angry'},blink:{eyes:'closed',mouth:'smile'},
};
export const EXPRESSIONS=Object.keys(EX);
export function faceTex(name,blink=false){const key=name+(blink?'_b':'');if(CACHE[key])return CACHE[key];const P=EX[name]||EX.smile;
  const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');g.fillStyle=g.strokeStyle=INK;g.lineCap=g.lineJoin='round';g.translate(256,268);g.scale(1.18,1.18);g.translate(-256,-268);
  const E=(x,y,rx,ry,col)=>{g.save();if(col)g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();g.restore()};
  const L=(w,pts)=>{g.lineWidth=w;g.beginPath();g.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)g.lineTo(...pts[i]);g.stroke()};
  const Q=(w,a,cp,b)=>{g.lineWidth=w;g.beginPath();g.moveTo(...a);g.quadraticCurveTo(...cp,...b);g.stroke()};
  const EY=232,XL=200,XR=312;const eyes=blink?(P.eyes==='closedDown'?'closedDown':'closed'):P.eyes;
  // ---- eyes ----
  if(eyes==='oval'){E(XL,EY,17,31);E(XR,EY,17,31)}
  else if(eyes==='small'){E(XL,EY+4,11,17);E(XR,EY+4,11,17)}
  else if(eyes==='wide'){[XL,XR].forEach(x=>{E(x,EY,30,36,'#fff');g.lineWidth=8;g.beginPath();g.ellipse(x,EY,30,36,0,0,7);g.stroke();E(x,EY+4,8,10)})}
  else if(eyes==='half'){[XL,XR].forEach((x,i)=>{g.beginPath();g.ellipse(x,EY+6,18,26,0,0,7);g.save();g.clip();g.fillRect(x-30,EY-8+(i?0:0),60,60);g.restore()})}
  else if(eyes==='lids'){[XL,XR].forEach(x=>{g.beginPath();g.ellipse(x,EY+4,17,26,0,0,Math.PI);g.fill();L(9,[[x-26,EY+2],[x+26,EY+2]])})}
  else if(eyes==='arcs'){[XL,XR].forEach(x=>Q(12,[x-24,EY+10],[x,EY-24],[x+24,EY+10]))}
  else if(eyes==='closed'){[XL,XR].forEach(x=>Q(11,[x-22,EY+2],[x,EY+16],[x+22,EY+2]))}
  else if(eyes==='closedDown'){[XL,XR].forEach((x,i)=>Q(11,[x-24,EY-4+(i?8:0)],[x,EY+14],[x+24,EY-4+(i?0:8)]))}
  else if(eyes==='xx'){[XL,XR].forEach((x,i)=>{const s=i?-1:1;L(12,[[x-18*s,EY-18],[x+12*s,EY],[x-18*s,EY+18]])})}
  else if(eyes==='wink'){E(XL,EY,17,31);Q(12,[XR-24,EY+6],[XR,EY-14],[XR+24,EY+6])}
  else if(eyes==='stars'){[XL,XR].forEach(x=>{g.beginPath();for(let k=0;k<10;k++){const r=k%2?13:34,a=k/10*Math.PI*2-Math.PI/2;g.lineTo(x+Math.cos(a)*r,EY+Math.sin(a)*r)}g.closePath();g.fill()})}
  // ---- brows ----
  const B=P.brows;if(B==='angry'){L(13,[[XL-30,EY-56],[XL+26,EY-38]]);L(13,[[XR+30,EY-56],[XR-26,EY-38]])}
  else if(B==='worry'){L(11,[[XL-28,EY-44],[XL+24,EY-60]]);L(11,[[XR+28,EY-44],[XR-24,EY-60]])}
  else if(B==='high'){Q(10,[XL-26,EY-62],[XL,EY-78],[XL+26,EY-62]);Q(10,[XR-26,EY-62],[XR,EY-78],[XR+26,EY-62])}
  else if(B==='flat'){L(12,[[XL-28,EY-48],[XL+24,EY-42]]);L(12,[[XR+28,EY-48],[XR-24,EY-42]])}
  else if(B==='up'){Q(9,[XL-24,EY-54],[XL,EY-66],[XL+24,EY-54]);Q(9,[XR-24,EY-54],[XR,EY-66],[XR+24,EY-54])}
  else if(B==='oneUp'){L(11,[[XL-26,EY-46],[XL+24,EY-46]]);Q(11,[XR-26,EY-56],[XR,EY-74],[XR+26,EY-60])}
  // ---- mouth ----
  const MY=330,M=P.mouth;
  const open=(w,h,y=MY,teeth=true,tongue=true)=>{g.beginPath();g.moveTo(256-w,y);g.quadraticCurveTo(256,y+h*2,256+w,y);g.closePath();g.fill();g.save();g.clip();if(tongue)E(256,y+h*1.25,w*.55,h*.5,'#d24a62');if(teeth){g.fillStyle='#fff';g.fillRect(256-w,y-2,w*2,h*.32)}g.restore()};
  if(M==='smile')Q(11,[196,MY-6],[256,MY+40],[316,MY-6]);
  else if(M==='grinOpen')open(66,40);
  else if(M==='bigOpen')open(78,52,MY-8);
  else if(M==='flat')L(11,[[222,MY+10],[290,MY+10]]);
  else if(M==='talkO'){E(256,MY+14,26,22);E(256,MY+22,15,9,'#d24a62')}
  else if(M==='talkWide')open(48,30,MY+4,true,true);
  else if(M==='O'){E(256,MY+22,24,32)}
  else if(M==='wavy'){g.lineWidth=10;g.beginPath();g.moveTo(206,MY+16);for(let k=1;k<=6;k++)g.lineTo(206+k*17,MY+16+(k%2?-10:10));g.stroke()}
  else if(M==='teethOpen'){g.beginPath();g.roundRect(206,MY-4,100,52,18);g.fill();g.fillStyle='#fff';g.fillRect(212,MY+2,88,13);g.fillRect(212,MY+30,88,12)}
  else if(M==='grit'){g.beginPath();g.roundRect(212,MY+2,88,36,10);g.fill();g.fillStyle='#fff';g.fillRect(218,MY+8,76,24);g.fillStyle=INK;for(let k=1;k<4;k++)g.fillRect(218+k*19,MY+8,4,24);g.fillRect(218,MY+18,76,4)}
  else if(M==='shout'){E(256,MY+26,46,44);E(256,MY+48,26,16,'#d24a62');g.fillStyle='#fff';g.fillRect(222,MY-12,68,12)}
  else if(M==='frown')Q(11,[208,MY+30],[256,MY-6],[304,MY+30]);
  else if(M==='cryOpen'){g.beginPath();g.moveTo(206,MY+34);g.quadraticCurveTo(256,MY-14,306,MY+34);g.closePath();g.fill()}
  else if(M==='firm'){L(12,[[214,MY+12],[300,MY+6]])}
  else if(M==='smirk')Q(11,[218,MY+12],[284,MY+22],[312,MY-8]);
  else if(M==='wobble'){g.lineWidth=10;g.beginPath();g.moveTo(206,MY+6);g.bezierCurveTo(230,MY+26,250,MY-6,276,MY+16);g.quadraticCurveTo(296,MY+28,310,MY+4);g.stroke()}
  else if(M==='squiggle'){g.lineWidth=10;g.beginPath();g.moveTo(214,MY+14);g.bezierCurveTo(240,MY-4,262,MY+30,298,MY+8);g.stroke()}
  else if(M==='smallO'){E(256,MY+16,12,10)}
  else if(M==='evil'){g.beginPath();g.moveTo(190,MY-10);g.quadraticCurveTo(256,MY+70,322,MY-10);g.quadraticCurveTo(256,MY+24,190,MY-10);g.fill();g.fillStyle='#fff';for(let k=0;k<5;k++){g.beginPath();g.moveTo(212+k*20,MY+6+Math.abs(k-2)*-3);g.lineTo(222+k*20,MY+22);g.lineTo(232+k*20,MY+6);g.fill()}}
  // ---- extras ----
  if(P.blush){E(166,302,28,13,'rgba(255,90,120,.35)');E(346,302,28,13,'rgba(255,90,120,.35)')}
  if(P.sweat){g.save();g.fillStyle='#7fd0ff';g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.moveTo(388,140);g.quadraticCurveTo(366,186,388,196);g.quadraticCurveTo(410,186,388,140);g.fill();g.stroke();g.restore()}
  if(P.tears){g.save();g.fillStyle='rgba(110,190,255,.9)';[XL,XR].forEach(x=>{g.beginPath();g.roundRect(x-11,EY+10,22,120,11);g.fill()});g.restore()}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return CACHE[key]=t}
// alias old names
const ALIAS={grin:'grin',nervous_blink:'nervous',smug_talk:'talk2',ko:'sleep',blink:'blink'};
// install on a character: c.face(name) + automatic blinking via c.tickFace(t)
export function install(c,seed=0){c.expr2='smile';c.face=e=>{c.expr2=EX[e]?e:(ALIAS[e]||'smile')};
  c.applyFace=t=>{const per=2.6+((seed*37)%10)/10,ph=(t+seed*.73)%per;const bl=c.expr2!=='blink'&&c.expr2!=='sleep'&&ph<.11;const m=faceTex(c.expr2,bl);if(c.fm.map!==m){c.fm.map=m;c.fm.needsUpdate=true}}}
// mouth flap for talking (syllable-ish, deterministic)
export const talkMouth=(t,base='talk')=>{const s=Math.sin(t*23)+Math.sin(t*13.7);return s>.6?'talk2':(s>-.4?'talk':base==='talk'?'smile':base)};
