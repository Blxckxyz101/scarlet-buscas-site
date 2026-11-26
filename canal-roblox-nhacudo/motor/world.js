// World builder v2: Kenney CC0 kits + our props. Districts are laid out at fixed offsets.
import * as THREE from 'three';import * as C from './city.js';import * as A from './assets.js';
const BW={a:.88,b:.97,c:.88,d:.84,e:1.64,f:.84,g:.97,h:.88,i:1.24,j:2.08,k:2.08,l:1.37,m:1.24,n:2.32};
// Place a row of Kenney commercial buildings along X between x0..x1, fronts facing the street (side=-1 north / +1 south)
export const LANES={curb:6.2,in1:7.8,in2:10.2,front:11.95};
async function buildingRow(root,B,x0,x1,zFront,side,seedNames){let x=x0;let i=0;const names=seedNames||['a','b','c','d','f','g','h','i','e','k','l','j','m','n'];
  while(x<x1){const n=names[(i*7+3)%names.length];const o=await A.place(root,'commercial','building-'+n,0,0,0,side>0?Math.PI:0);A.recolor(o,A.FACADES[(i*5+(side>0?3:0)+Math.floor(x))%A.FACADES.length]);o.updateMatrixWorld(true);
    const bb=new THREE.Box3().setFromObject(o);o.position.x+=x-bb.min.x;o.position.z+=side<0?(zFront-bb.max.z):(zFront-bb.min.z);o.position.y-=bb.min.y;
    B.addObj(o);root.remove(o);x+=(bb.max.x-bb.min.x)+.2;i++}}
export async function downtown(scene,B,{len=150,lit=false}={}){
  const root=new THREE.Group();scene.add(root);
  const add=(o,x,y,z,ry=0)=>{o.position.set(x,y,z);o.rotation.y=ry;B.addObj(o);return o};
  add(C.street(len*1.6,{cross:30,sw:6.2}),0,0,0);
  const cross=C.street(120,{});cross.rotation.y=Math.PI/2;cross.position.set(30,.005,-50);B.addObj(cross);
  await buildingRow(root,B,-len/2,24,-LANES.front,-1);await buildingRow(root,B,36,len/2,-LANES.front,-1,['n','i','l','j','m','k']);
  await buildingRow(root,B,-len/2,24,LANES.front,1,['b','h','g','e','a','i','f','c','k']);await buildingRow(root,B,36,len/2,LANES.front,1,['j','l','m','n']);
  // skyline
  for(let i=0;i<18;i++){const n=['a','b','c','d','e'][i%5];const o=await A.place(root,'commercial','building-skyscraper-'+n,-90+i*11+(i%3)*2,0,-58-(i%4)*9);o.scale.multiplyScalar(1.15);B.addObj(o);root.remove(o)}
  for(let i=0;i<14;i++){const n=['m','l','n','j'][i%4];const o=await A.place(root,'commercial','building-'+n,-85+i*13,0,52+(i%3)*6,Math.PI);B.addObj(o);root.remove(o)}
  // curb-strip props only (z=±6.1); pedestrian lanes kept free at z=±7.2..±8.6
  const lampX=[];for(let lx=-len/2+6;lx<len/2;lx+=14){if(Math.abs(lx-30)<9)continue;add(C.lamp(lit),lx,.32,-LANES.curb);add(C.lamp(lit),lx+7,.32,LANES.curb,Math.PI);lampX.push(lx)}
  for(let i=0;i<lampX.length-1;i++){root.add(Object.assign(C.bunting(new THREE.Vector3(lampX[i]-1.2,6.95,-LANES.curb),new THREE.Vector3(lampX[i]+5.8,6.95,LANES.curb),1.3),{name:'bunting'}))}
  for(let tx=-len/2+10;tx<len/2;tx+=14){if(Math.abs(tx-30)<11)continue;const t=await A.place(root,'nature','tree_default',tx,.32,LANES.curb);t.scale.setScalar(3.4);B.addObj(t);root.remove(t);
    const t2=await A.place(root,'nature','tree_oak',tx+7,.32,-LANES.curb);t2.scale.setScalar(3.0);B.addObj(t2);root.remove(t2)}
  [[-22,-6.2],[8,6.2],[44,-6.2]].forEach(([x,z])=>add(C.hydrant(),x,.32,z));
  [[-14,-6.2],[18,6.2],[-40,6.2]].forEach(([x,z])=>add(C.bin(),x,.32,z));
  add(C.trafficLight(),24.8,.32,-6.2);add(C.trafficLight(),35.2,.32,6.2,Math.PI);
  // cafe terrace in a recessed plaza in front of a building corner (outside lanes)
  B.build(scene);
  
  return {root,lampX}}
// parked + moving cars from car-kit
export async function cars(scene,list){const out=[];for(const [name,x,z,ry] of list){const o=await A.place(scene,'car',name,x,0,z,ry);out.push(o)}return out}
