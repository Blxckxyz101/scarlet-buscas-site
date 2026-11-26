// Classic Roblox R6-style procedural animation for our rig: straight limbs (no knee/elbow bend),
// pendulum walk, no body bob. Walk speed is derived from leg swing so feet don't slide.
const LEG=2.0; // hip->sole length in rig units
export const GAITS={walk:{A:.62,f:1.05},run:{A:.95,f:1.55},sneak:{A:.35,f:.8}};
export const speedOf=(g,scale=.6)=>{const G=GAITS[g];return 4*LEG*scale*Math.sin(G.A)*G.f};
// hip height (rig units) so the lowest corner of either swinging foot touches the ground
export function hipFor(A){let low=0;for(const th of [A,-A])for(const z of [-.5,.64]){const y=-LEG*Math.cos(th)-z*Math.sin(th);if(-y>low)low=-y}return low}
function reset(c){[c.lS,c.rS,c.lE,c.rE,c.lH,c.rH,c.lHp,c.rHp,c.lK,c.rK,c.lF,c.rF,c.waist,c.neck].forEach(j=>j.rotation.set(0,0,0));c.hip.position.y=2;c.hip.rotation.set(0,0,0)}
export function pose(c,name,t=0,o={}){reset(c);const s=Math.sin,P=Math.PI;
  if(name==='walk'||name==='run'||name==='sneak'){const G=GAITS[name];const ph=(t*G.f+(o.phase||0))*2*P;const a=s(ph)*G.A;
    c.lHp.rotation.x=a;c.rHp.rotation.x=-a;c.hip.position.y=hipFor(Math.abs(a));c.lS.rotation.x=-a*(name==='run'?1:.95);c.rS.rotation.x=a*(name==='run'?1:.95);
    if(o.scared){c.lS.rotation.x=-2.8+s(ph*2)*.4;c.rS.rotation.x=-2.8-s(ph*2)*.4}
    if(name==='run')c.waist.rotation.x=.12}
  else if(name==='idle'){const b=s((t+(o.phase||0))*1.6);c.lS.rotation.z=-.04-b*.02;c.rS.rotation.z=.04+b*.02;c.lS.rotation.x=b*.03;c.rS.rotation.x=-b*.03}
  else if(name==='talk'){pose(c,'idle',t,o);const b=s(t*5+(o.phase||0));c.rS.rotation.x=-.5-b*.25;c.rS.rotation.z=.2;c.neck.rotation.y=s(t*1.3)*.1}
  else if(name==='point'){pose(c,'idle',t,o);c.rS.rotation.x=-P/2;c.rS.rotation.y=o.dir||0}
  else if(name==='aim'){c.rS.rotation.x=-P/2;c.lS.rotation.x=-P/2;c.lS.rotation.y=-.35}
  else if(name==='cheer'){const b=s((t+(o.phase||0))*9);c.lS.rotation.x=-2.9;c.rS.rotation.x=-2.9;c.lS.rotation.z=-.3+b*.15;c.rS.rotation.z=.3-b*.15;c.hip.position.y=2+Math.abs(s((t+(o.phase||0))*6))*.6}
  else if(name==='jump'||name==='fall'){c.lS.rotation.x=-2.9;c.rS.rotation.x=-2.9;c.lHp.rotation.x=name==='jump'?-.3:-.15;c.rHp.rotation.x=name==='jump'?.2:.25}
  else if(name==='sit'){c.lHp.rotation.x=-P/2;c.rHp.rotation.x=-P/2;c.lS.rotation.x=-.25;c.rS.rotation.x=-.25}
  else if(name==='climb'){const ph=(t*1.6+(o.phase||0))*2*P;c.lS.rotation.x=-2.6+s(ph)*.4;c.rS.rotation.x=-2.6-s(ph)*.4;c.lHp.rotation.x=-.2-s(ph)*.25;c.rHp.rotation.x=-.2+s(ph)*.25}
  else if(name==='shock'){c.lS.rotation.z=-.5;c.rS.rotation.z=.5;c.lS.rotation.x=-.4;c.rS.rotation.x=-.4}
  else if(name==='crouch'){/* R6 bend-over: legs straight, torso folds forward */c.waist.rotation.x=1.05;c.rS.rotation.x=-.35;c.lS.rotation.x=-.2;c.neck.rotation.x=-.35}
  else if(name==='lay'){/* caller rotates root */}
}
// agent along a Path at gait speed, always facing travel direction
export function stepWalker(c,path,t,{gait='walk',d0=0,t0=0,scale=.6,y=.32,phase=0,loop=true}={}){const sp=speedOf(gait,scale);let d=d0+(t-t0)*sp;const L=path.len;
  if(loop)d=((d%L)+L)%L;else if(d>L||d<0){c.root.visible=false;return}
  const p=path.at(d);c.root.visible=true;c.root.position.set(p.x,y+p.y,p.z);c.root.rotation.set(0,path.heading(Math.min(d,L-.01)),0);pose(c,gait,t,{phase})}
