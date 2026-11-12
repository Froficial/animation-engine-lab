import {test} from 'node:test';
import assert from 'node:assert/strict';
import {solveLeg} from './ik.mjs';
import {createHumanoidRig,evaluateSkeleton} from './index.mjs';
import {skeletonPoseAtFrame} from './performance.mjs';
const rig=createHumanoidRig(),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test('IK preserves both lengths and rejects unreachable poses',()=>{
 for(const target of [{x:20,y:160},{x:-40,y:150},{x:0,y:180}]){
  const hip={x:0,y:0},s=solveLeg(hip,target,94,88);
  assert.ok(Math.abs(dist(hip,s.knee)-94)<1e-8);
  assert.ok(Math.abs(dist(s.knee,target)-88)<1e-8);
 }
 assert.throws(()=>solveLeg({x:0,y:0},{x:0,y:200},94,88),/unreachable/);
});
test('all frames reach ankle targets without stretching; soles stay level',()=>{
 for(let f=0;f<450;f++){
  const p=skeletonPoseAtFrame(f),w=evaluateSkeleton(rig,p.angles,p.rootOffset);
  for(const side of ['left','right']){
   assert.ok(dist(w[side+'_ankle'],p.feet[side])<1e-5,side+' ankle@'+f);
   assert.ok(Math.abs(w[side+'_ankle'].angle)<1e-6,'tilted sole@'+f);
  }
 }
});
test('stance feet remain fixed even when pelvis and chest change',()=>{
 for(const [a,b,side] of [[0,43,'left'],[35,75,'right'],[67,101,'left'],[120,249,'left'],[120,249,'right'],[276,449,'left'],[276,449,'right']]){
  const first=skeletonPoseAtFrame(a),origin=evaluateSkeleton(rig,first.angles,first.rootOffset)[side+'_ankle'];
  for(let f=a;f<=b;f++){const p=skeletonPoseAtFrame(f),w=evaluateSkeleton(rig,p.angles,p.rootOffset);assert.ok(dist(origin,w[side+'_ankle'])<1e-5,side+' slides@'+f);}
 }
});
test('jump bends before takeoff, lifts both feet, and absorbs landing',()=>{
 const neutral=skeletonPoseAtFrame(230),crouch=skeletonPoseAtFrame(245),air=skeletonPoseAtFrame(263),land=skeletonPoseAtFrame(282);
 assert.ok(crouch.rootOffset.y>neutral.rootOffset.y+10);
 assert.ok(crouch.angles.left_knee>neutral.angles.left_knee);
 assert.ok(air.feet.left.y<neutral.feet.left.y-30&&air.feet.right.y<neutral.feet.right.y-30);
 assert.equal(air.feet.left.contact,false);
 assert.ok(land.rootOffset.y>neutral.rootOffset.y+8);
 assert.equal(land.feet.left.y,neutral.feet.left.y);
});
test('all joints fit the shared framing with room for finger strokes',()=>{
 for(let f=0;f<450;f++){
  const p=skeletonPoseAtFrame(f),w=evaluateSkeleton(rig,p.angles,p.rootOffset);
  for(const [name,n] of Object.entries(w))assert.ok(n.x*.96-15>=16&&n.x*.96-15<=524,`${name} clipped at ${f}`);
 }
});
