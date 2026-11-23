// Retarget Quaternius UAL (CC0) mocap clips onto our blocky R15 rig, using world-space rotation deltas from the T-pose.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const Q=()=>new THREE.Quaternion(),V=()=>new THREE.Vector3();
export async function loadMocap(url='ual.glb'){
  const g=await new GLTFLoader().loadAsync(url);const src=g.scene;src.updateMatrixWorld(true);
  const bone=n=>{let b=null;src.traverse(o=>{if(o.name===n)b=o});return b};
  const clips={};g.animations.forEach(a=>clips[a.name]=a);
  const mixer=new THREE.AnimationMixer(src);
  const B={hips:bone('DEF-hips'),spine:bone('DEF-spine003'),head:bone('DEF-head'),
    uaL:bone('DEF-upper_armL'),faL:bone('DEF-forearmL'),hdL:bone('DEF-handL'),uaR:bone('DEF-upper_armR'),faR:bone('DEF-forearmR'),hdR:bone('DEF-handR'),
    thL:bone('DEF-thighL'),shL:bone('DEF-shinL'),ftL:bone('DEF-footL'),thR:bone('DEF-thighR'),shR:bone('DEF-shinR'),ftR:bone('DEF-footR')};
  // sample a clip at t into world quaternions + hips pos
  let cur=null;
  function sample(name,t){const clip=clips[name];if(cur&&cur.getClip()!==clip){cur.stop()}
    cur=mixer.clipAction(clip);cur.play();cur.time=((t%clip.duration)+clip.duration)%clip.duration;if(!clip.name.endsWith('Loop')&&t>=clip.duration)cur.time=clip.duration-1e-4;
    mixer.update(0);src.updateMatrixWorld(true);const out={};for(const k in B){out[k]=B[k].getWorldQuaternion(Q())}out.hipPos=B.hips.getWorldPosition(V());return out}
  const rest=sample('A_TPose',0);
  // facing & side detection
  const facingFlip=(()=>{const toe=bone('DEF-toeL').getWorldPosition(V()),ft=bone('DEF-footL').getWorldPosition(V());return toe.z<ft.z})();
  const leftIsNegX=B.uaL.getWorldPosition(V()).x<0;
  const restHipY=rest.hipPos.y;
  const flip=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),facingFlip?Math.PI:0);
  const flipInv=flip.clone().invert();
  const restInv={};for(const k in B)restInv[k]=rest[k].clone().invert();
  // our rest (T-pose) world orientations relative to character root
  const dirQ=(a,b)=>{const pa=bone(a).getWorldPosition(V()),pb=bone(b).getWorldPosition(V());const d=pb.sub(pa).applyQuaternion(flip).normalize();return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0),d)};
  const RQ={uaL:dirQ('DEF-upper_armL','DEF-forearmL'),faL:dirQ('DEF-forearmL','DEF-handL'),hdL:dirQ('DEF-forearmL','DEF-handL'),uaR:dirQ('DEF-upper_armR','DEF-forearmR'),faR:dirQ('DEF-forearmR','DEF-handR'),hdR:dirQ('DEF-forearmR','DEF-handR'),
    thL:dirQ('DEF-thighL','DEF-shinL'),shL:dirQ('DEF-shinL','DEF-footL'),thR:dirQ('DEF-thighR','DEF-shinR'),shR:dirQ('DEF-shinR','DEF-footR'),ftL:new THREE.Quaternion(),ftR:new THREE.Quaternion()};
  // map: our side "n" (x<0) and "p" (x>0)
  const sideN=leftIsNegX?'L':'R',sideP=leftIsNegX?'R':'L';
  function delta(s,k){// world delta in our (flipped) frame
    const d=s[k].clone().multiply(restInv[k]);return flip.clone().multiply(d).multiply(flipInv)}
  function pose(name,t){const s=sample(name,t);const P={};for(const k in B)P[k]=delta(s,k);
    const hp=s.hipPos.clone().sub(rest.hipPos).applyQuaternion(flip);P.hipOff=hp.multiplyScalar(2/restHipY);return P}
  function blend(a,b,w){if(w<=0)return a;if(w>=1)return b;const o={};for(const k in a){o[k]=k==='hipOff'?a[k].clone().lerp(b[k],w):a[k].clone().slerp(b[k],w)}return o}
  // apply to an r15 character (from kit.js)
  const tmp=Q();
  function setLocal(obj,parentWorld,targetWorld){obj.quaternion.copy(parentWorld.clone().invert().multiply(targetWorld))}
  function apply(c,P,o={}){
    const hipW=P.hips.clone();c.hip.quaternion.copy(hipW);c.hip.position.set(P.hipOff.x*(o.sway??1),2+P.hipOff.y+(o.hy||0),P.hipOff.z*(o.sway??1));
    const waistW=P.spine.clone();setLocal(c.waist,hipW,waistW);
    const neckW=P.head.clone();setLocal(c.neck,waistW,neckW);
    const arm=(j1,j2,j3,ua,fa,hd)=>{const w1=P[ua].clone().multiply(RQ[ua]);setLocal(j1,waistW,w1);const w2=P[fa].clone().multiply(RQ[fa]);setLocal(j2,w1,w2);const w3=P[hd].clone().multiply(RQ[hd]);setLocal(j3,w2,w3)};
    arm(c.lS,c.lE,c.lH,'ua'+sideN,'fa'+sideN,'hd'+sideN);arm(c.rS,c.rE,c.rH,'ua'+sideP,'fa'+sideP,'hd'+sideP);
    const leg=(j1,j2,j3,th,sh,ft)=>{const w1=P[th].clone().multiply(RQ[th]);setLocal(j1,hipW,w1);const w2=P[sh].clone().multiply(RQ[sh]);setLocal(j2,w1,w2);const w3=P[ft].clone().multiply(RQ[ft]);setLocal(j3,w2,w3)};
    leg(c.lHp,c.lK,c.lF,'th'+sideN,'sh'+sideN,'ft'+sideN);leg(c.rHp,c.rK,c.rF,'th'+sideP,'sh'+sideP,'ft'+sideP);
    if(o.headExtra){c.neck.quaternion.multiply(o.headExtra)}}
  return {RQ,clips:Object.keys(clips),pose,blend,apply,dur:n=>clips[n].duration,info:{facingFlip,leftIsNegX,restHipY}}}
