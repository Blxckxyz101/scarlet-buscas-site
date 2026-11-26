// Locomotion & crowd: agents follow obstacle-free lanes, face their travel direction, and advance at the
// exact speed of the mocap gait (no foot sliding, no walking backwards, no teleporting on screen).
import * as THREE from 'three';
// source speed (m/s of source rig) -> our units: ratio = (2/0.9167) * characterScale
export const GAIT={Walk_Loop:.977,Walk_Formal_Loop:1.033,Jog_Fwd_Loop:1.534,Sprint_Loop:1.682,Crouch_Fwd_Loop:.625};
export const gaitSpeed=(anim,scale=.6)=>GAIT[anim]*(2/.9167)*scale;
export class Path{constructor(pts){this.p=pts.map(a=>new THREE.Vector3(a[0],a[1]??0,a[2]));this.seg=[];this.len=0;
  for(let i=0;i<this.p.length-1;i++){const l=this.p[i].distanceTo(this.p[i+1]);this.seg.push(l);this.len+=l}}
  at(d){d=Math.max(0,Math.min(this.len,d));let i=0;while(i<this.seg.length-1&&d>this.seg[i]){d-=this.seg[i];i++}
    const a=this.p[i],b=this.p[i+1];const k=this.seg[i]?d/this.seg[i]:0;return a.clone().lerp(b,k)}
  heading(d,look=.8){const a=this.at(d-look*.5),b=this.at(d+look);const v=b.sub(a);return Math.atan2(v.x,v.z)}}
// agent = {c (r15 char), path, anim, t0, d0, end:'stop'|'hide'|'idle', idle:'Idle_Loop', y, phase}
export function stepAgent(MC,ag,t,extra){const sp=gaitSpeed(ag.anim,ag.scale??.6)*(ag.speedMul??1);const d=ag.d0+(t-ag.t0)*sp;
  const done=d>=ag.path.len,before=t<ag.t0;const c=ag.c;
  if(before&&ag.end==='hide'&&ag.hideBefore){c.root.visible=false;return}
  if(done&&ag.end==='hide'){c.root.visible=false;return}
  c.root.visible=true;const pos=ag.path.at(Math.max(ag.d0,d));c.root.position.set(pos.x,(ag.y??.32)+pos.y,pos.z);
  c.root.rotation.set(0,ag.path.heading(Math.min(d,ag.path.len-.01)),0);
  if(done||before){MC.apply(c,MC.pose(ag.idle||'Idle_Loop',t+(ag.phase||0)))}else{MC.apply(c,MC.pose(ag.anim,t+(ag.phase||0)))}
  if(extra)extra(ag,t,done)}
// lane helper: build agents spaced along a lane, all moving the same direction
export function laneAgents(chars,laneFrom,laneTo,{anim='Walk_Loop',t0=0,spacing=3.2,jitter=.6,end='hide',scale=.6,rnd=Math.random}={}){
  return chars.map((c,i)=>{const off=(rnd()-.5)*jitter;const a=[laneFrom[0],0,laneFrom[1]+off],b=[laneTo[0],0,laneTo[1]+off];
    const path=new Path([a,b]);return {c,path,anim,t0,d0:i*spacing+rnd()*spacing*.4,end,scale,phase:rnd()*2}})}
