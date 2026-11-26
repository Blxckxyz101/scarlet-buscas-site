// Automatic clipping QA: precise character-part vs scene-triangle intersection (three-mesh-bvh) + character-vs-character overlap.
import * as THREE from 'three';import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';THREE.Mesh.prototype.raycast=acceleratedRaycast;
const FLAT=new Set(['PlaneGeometry','CircleGeometry','RingGeometry']);
function worldVisible(o){while(o){if(!o.visible)return false;o=o.parent}return true}
function label(o){let p=o;while(p){if(p.name)return p.name;p=p.parent}return o.geometry?.type||'mesh'}
export function setupQA(S,chars,fxObjs,cam,props=[]){props.forEach(({obj,name})=>obj.traverse(o=>o.userData.char=name));chars.forEach(({c,name})=>{c.root.name=name;c.root.traverse(o=>o.userData.char=name)});fxObjs.forEach(o=>o.traverse(m=>m.userData.fx=1));
  const inv=new THREE.Matrix4(),m=new THREE.Matrix4(),bA=new THREE.Box3(),bB=new THREE.Box3();
  return function check(margin=.07){S.updateMatrixWorld(true);if(cam)cam.updateMatrixWorld(true);const obs=[];
    S.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.char||o.userData.fx||!o.geometry||FLAT.has(o.geometry.type))return;const mat=o.material;if(mat&&(mat.blending===THREE.AdditiveBlending||(mat.transparent&&mat.opacity<.5)))return;if(!worldVisible(o))return;
      if(!o.geometry.boundsTree)o.geometry.boundsTree=new MeshBVH(o.geometry);if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();obs.push(o)});
    const obsBox=obs.map(o=>new THREE.Box3().copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld));
    const hits=[];const IG=window.__qaIgnore||[];const vis=chars.filter(({c,name})=>worldVisible(c.root)&&!IG.includes(name));
    vis.forEach(({c,name})=>{const parts=[];c.root.traverse(p=>{if(p.isMesh&&p.geometry&&!FLAT.has(p.geometry.type)&&p.material&&!p.material.transparent)parts.push(p)});
      parts.forEach(p=>{if(!p.geometry.boundingBox)p.geometry.computeBoundingBox();const s=new THREE.Vector3();p.getWorldScale(s);const lb=p.geometry.boundingBox.clone();const mg=margin/Math.max(1e-3,s.x);lb.expandByVector(new THREE.Vector3(-mg,-mg,-mg));if(lb.isEmpty())return;
        bA.copy(lb).applyMatrix4(p.matrixWorld);
        obs.forEach((o,i)=>{if(!bA.intersectsBox(obsBox[i]))return;inv.copy(o.matrixWorld).invert();m.multiplyMatrices(inv,p.matrixWorld);let hit=o.geometry.boundsTree.intersectsBox(lb,m);if(!hit){/* fully embedded? parity test from the part centre */const ctr=new THREE.Vector3();bA.getCenter(ctr);const rr=new THREE.Raycaster(ctr,new THREE.Vector3(.577,.577,.577));rr.firstHitOnly=false;const n=rr.intersectObject(o,false).length;if(n%2===1)hit=true}if(hit){const c=new THREE.Vector3();bA.getCenter(c);hits.push(name+' ✕ '+label(o)+(window.QAPOS?` @${c.x.toFixed(1)},${c.y.toFixed(1)},${c.z.toFixed(1)}`:''))}})})});
    // moving props (dog etc.): intersection + support
    props.forEach(pr=>{if(!worldVisible(pr.obj))return;const parts=[];pr.obj.traverse(p=>{if(p.isMesh&&p.geometry&&!FLAT.has(p.geometry.type)&&p.material&&!p.material.transparent)parts.push(p)});
      parts.forEach(p=>{if(!p.geometry.boundingBox)p.geometry.computeBoundingBox();const s=new THREE.Vector3();p.getWorldScale(s);const lb=p.geometry.boundingBox.clone();const mg=margin/Math.max(1e-3,s.x);lb.expandByVector(new THREE.Vector3(-mg,-mg,-mg));if(lb.isEmpty())return;bA.copy(lb).applyMatrix4(p.matrixWorld);
        obs.forEach((o,i)=>{if(!bA.intersectsBox(obsBox[i]))return;inv.copy(o.matrixWorld).invert();m.multiplyMatrices(inv,p.matrixWorld);let hit=o.geometry.boundsTree.intersectsBox(lb,m);if(!hit){const ctr=new THREE.Vector3();bA.getCenter(ctr);const rr=new THREE.Raycaster(ctr,new THREE.Vector3(.577,.577,.577));const n=rr.intersectObject(o,false).length;if(n%2===1)hit=true}if(hit){const cc=new THREE.Vector3();bA.getCenter(cc);const oc=new THREE.Vector3();obsBox[i].getCenter(oc);const os=new THREE.Vector3();obsBox[i].getSize(os);hits.push(pr.name+' ✕ '+label(o)+(window.QAPOS?` @${cc.x.toFixed(1)},${cc.y.toFixed(1)},${cc.z.toFixed(1)} obj@${oc.x.toFixed(1)},${oc.y.toFixed(1)},${oc.z.toFixed(1)} size ${os.x.toFixed(1)}x${os.y.toFixed(1)}x${os.z.toFixed(1)}`:''))}})});
      if(!pr.air||!pr.air()){const supp=[];S.traverse(o=>{if(o.isMesh&&!o.userData.char&&!o.userData.fx&&worldVisible(o)&&o.geometry){if(!o.geometry.boundsTree)o.geometry.boundsTree=new MeshBVH(o.geometry);supp.push(o)}});
        let best=99,worst=99;(pr.feet?pr.feet():[]).forEach(f=>{const b=new THREE.Box3().setFromObject(f);const c=new THREE.Vector3();b.getCenter(c);const rc2=new THREE.Raycaster(new THREE.Vector3(c.x,b.min.y+.3,c.z),new THREE.Vector3(0,-1,0));rc2.firstHitOnly=true;const hh=rc2.intersectObjects(supp,false)[0];const gap=hh?b.min.y-hh.point.y:99;best=Math.min(best,gap);worst=Math.min(worst,gap)});
        if(best>.08&&best<99)hits.push(pr.name+' FLUTUANDO '+best.toFixed(2));if(worst<-.08)hits.push(pr.name+' AFUNDADO '+worst.toFixed(2))}});
    // character vs character (torso + head boxes)
    const tb=vis.map(({c,name})=>{const b=new THREE.Box3();[c.waist.children.find(x=>x.isMesh),c.head.children.find(x=>x.isMesh)].forEach(x=>{if(x){x.geometry.computeBoundingBox();b.union(x.geometry.boundingBox.clone().applyMatrix4(x.matrixWorld))}});b.expandByScalar(-.08);return {name,b}});
    for(let i=0;i<tb.length;i++)for(let j=i+1;j<tb.length;j++)if(tb[i].b.intersectsBox(tb[j].b))hits.push(tb[i].name+' ✕ '+tb[j].name);
    // floating check: grounded characters must have a surface under their soles (within 6cm)
    const sup=[];S.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.userData.char&&!o.userData.fx&&o.geometry&&worldVisible(o)){const mt=o.material;if(mt&&mt.blending===THREE.AdditiveBlending)return;if(!o.geometry.boundsTree)o.geometry.boundsTree=new MeshBVH(o.geometry);sup.push(o)}});
    const rc=new THREE.Raycaster();rc.firstHitOnly=true;
    vis.forEach(({c,name})=>{if(c.air)return;let worst=99;[c.lF,c.rF].forEach(f=>{const sole=f.children.find(x=>x.isMesh);if(!sole)return;sole.geometry.computeBoundingBox();const b=sole.geometry.boundingBox.clone().applyMatrix4(sole.matrixWorld);const p=new THREE.Vector3();b.getCenter(p);
      rc.set(new THREE.Vector3(p.x,b.min.y+.4,p.z),new THREE.Vector3(0,-1,0));rc.far=30;const h=rc.intersectObjects(sup,false)[0];const gap=h?(b.min.y-h.point.y):99;if(gap<worst)worst=gap});
      if(worst>.06&&worst<99)hits.push(name+' FLUTUANDO '+worst.toFixed(2));if(worst<-.06)hits.push(name+' PE ENTERRADO '+worst.toFixed(2))});
    // camera too close to / inside geometry or a character
    if(cam){const cp=cam.position;const loc=new THREE.Vector3(),tgt={point:new THREE.Vector3(),distance:0};
      obs.forEach((o,i)=>{if(obsBox[i].distanceToPoint(cp)>.5)return;inv.copy(o.matrixWorld).invert();loc.copy(cp).applyMatrix4(inv);const r=o.geometry.boundsTree.closestPointToPoint(loc,tgt);if(r){const wp=tgt.point.clone().applyMatrix4(o.matrixWorld);const d=wp.distanceTo(cp);if(d<.22)hits.push('CAMERA perto/dentro de '+label(o)+' ('+d.toFixed(2)+')')}});
      vis.forEach(({c,name})=>{const b=new THREE.Box3().setFromObject(c.root);b.expandByScalar(-.05);if(b.containsPoint(cp))hits.push('CAMERA dentro de '+name)})}
    // subject checks: blocked view, face turned away, head cut at the frame edge
    const sj=window.__qaSubj;if(sj&&cam&&worldVisible(sj.c.root)){const hb=new THREE.Box3();const hm=sj.c.head.children.find(x=>x.isMesh);hm.geometry.computeBoundingBox();hb.copy(hm.geometry.boundingBox).applyMatrix4(hm.matrixWorld);const hc=new THREE.Vector3();hb.getCenter(hc);
      const dir=hc.clone().sub(cam.position);const dist=dir.length();dir.normalize();const rc3=new THREE.Raycaster(cam.position.clone(),dir,.05,dist-.5);const cand=[];S.traverse(o=>{if(o.isMesh&&worldVisible(o)&&!o.userData.fx&&o.userData.char!==sj.name&&o.geometry&&!(o.material&&(o.material.transparent||o.material.blending===THREE.AdditiveBlending))){if(!o.geometry.boundsTree)o.geometry.boundsTree=new MeshBVH(o.geometry);cand.push(o)}});
      rc3.firstHitOnly=true;const bh=rc3.intersectObjects(cand,false)[0];if(bh)hits.push('BLOQUEADO: '+label(bh.object)+(bh.object.userData.char?' ('+bh.object.userData.char+')':'')+' na frente de '+sj.name);
      if(sj.face){const fw=new THREE.Vector3(0,0,1).applyQuaternion(sj.c.head.getWorldQuaternion(new THREE.Quaternion()));const toCam=cam.position.clone().sub(hc).normalize();if(fw.dot(toCam)<.3)hits.push('ROSTO DE COSTAS/PERFIL: '+sj.name+' ('+fw.dot(toCam).toFixed(2)+')')}
      const pts=[];for(const x of [hb.min.x,hb.max.x])for(const y of [hb.min.y,hb.max.y])for(const z of [hb.min.z,hb.max.z])pts.push(new THREE.Vector3(x,y,z).project(cam));
      if(pts.some(p=>p.x<-.96||p.x>.96||p.y<-.96||p.y>.96||p.z>1))hits.push('CABECA CORTADA NA BORDA: '+sj.name)}
    return [...new Set(hits)]}}
