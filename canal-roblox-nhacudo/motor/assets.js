// Kenney CC0 kit loader with per-kit scale so props match our characters (char height ~3.24 at scale .6)
import * as THREE from 'three';import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const KIT={commercial:['city-kit-commercial','GLB format'],suburban:['city-kit-suburban','GLB format'],roads:['city-kit-roads','GLB format'],industrial:['city-kit-industrial','GLB format'],
  car:['car-kit','GLB format'],furniture:['furniture-kit','GLTF format'],nature:['nature-kit','GLTF format'],space:['space-station-kit','GLB format'],modular:['modular-buildings','GLB format']};
export const SCALE={commercial:13,suburban:12,roads:13,industrial:13,car:2.9,furniture:3.4,nature:3.2,space:5,modular:13};
const L=new GLTFLoader();const cache={};
export async function preload(list){await Promise.all(list.map(([k,n])=>get(k,n)))}
async function get(k,n){const key=k+'/'+n;if(!cache[key]){const [dir,fmt]=KIT[k];cache[key]=L.loadAsync(`kits/${dir}/Models/${fmt}/${n}.glb`).then(g=>{g.scene.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;if(o.material){o.material.envMapIntensity=.35}}});return g.scene})}return cache[key]}
export async function place(parent,k,n,x=0,y=0,z=0,ry=0,s=1){const src=await get(k,n);const o=src.clone(true);o.scale.setScalar(SCALE[k]*s);o.position.set(x,y,z);o.rotation.y=ry;parent.add(o);return o}
export function size(o){return new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3())}
// recolor Kenney commercial/suburban walls: replace the white wall swatches (x 192..256, y 256..384 in the 512 colormap)
const VAR={};
export function recolor(obj,hex){obj.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map)return;const src=o.material.map;const key=src.uuid+hex;
  if(!VAR[key]){const img=src.image;const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);
    const sx=img.width/512,sy=img.height/512;const col=new THREE.Color(hex);const gr=g.createLinearGradient(0,256*sy,0,384*sy);gr.addColorStop(0,'#'+col.clone().offsetHSL(0,0,.06).getHexString());gr.addColorStop(1,'#'+col.clone().offsetHSL(0,0,-.08).getHexString());
    g.fillStyle='#'+col.getHexString();g.fillRect(192*sx,256*sy,32*sx,128*sy);g.fillStyle=gr;g.fillRect(224*sx,256*sy,32*sx,128*sy);
    const t=new THREE.CanvasTexture(c);t.colorSpace=src.colorSpace;t.flipY=src.flipY;t.magFilter=src.magFilter;t.minFilter=src.minFilter;
    const m=o.material.clone();m.map=t;VAR[key]=m}
  o.material=VAR[key]})}
export const FACADES=[0xf6e6c8,0xf5b98e,0xa8dfc2,0xb9d6f2,0xf4b6c8,0xcbb8ef,0xd97a5a,0xffe08a,0xeef2f7];
