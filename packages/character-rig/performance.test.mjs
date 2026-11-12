import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {createHumanoidRig,evaluateSkeleton} from './index.mjs';
import {skeletonPoseAtFrame,TOTAL_FRAMES,FPS} from './performance.mjs';
const rig=createHumanoidRig();
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test('R1 15-second skeleton demo spans exactly 450 frames at 30fps',()=>{
 assert.equal(TOTAL_FRAMES,450);assert.equal(FPS,30);
 assert.deepEqual([0,130,267,407,449].map(f=>skeletonPoseAtFrame(f).section),[0,1,2,3,3]);
});
test('R1 all frames satisfy rotation bounds, joints stay attached, and lengths remain constant',()=>{
 for(let f=0;f<TOTAL_FRAMES;f++){
  const p=skeletonPoseAtFrame(f),s=evaluateSkeleton(rig,p.angles,p.rootOffset);
  for(const bone of rig.joints){
   const joint=s[bone.id];
   assert.ok(Number.isFinite(joint.x)&&Number.isFinite(joint.y),bone.id+'@'+f);
   if(bone.parentId)assert.ok(Math.abs(d(joint,s[bone.parentId])-bone.restLength)<.00001,bone.id+'@'+f);
  }
 }
});
test('R1 the head follows torso, while neck bones remain separately articulated',()=>{
 const base=skeletonPoseAtFrame(0),inclined=skeletonPoseAtFrame(63);
 const p0=evaluateSkeleton(rig,base.angles,base.rootOffset);
 const p1=evaluateSkeleton(rig,inclined.angles,inclined.rootOffset);
 assert.ok(d(p0.head_root,p1.head_root)>3);
 assert.ok(d(p0.neck_base,p1.neck_base)>3);
 assert.ok(Math.abs(inclined.angles.head_root)>0.01);
 assert.ok(d(p1.neck_tip,p1.head_root)>10);
});
test('R1 all fingers, wrist, pelvis and both ankle chains remain represented in motion',()=>{
 const p=skeletonPoseAtFrame(309),w=evaluateSkeleton(rig,p.angles,p.rootOffset);
 for(const side of ['left','right']){
  for(const name of ['hip','knee','ankle','foot','wrist','hand','thumb_2','index_2','middle_2','ring_2','pinky_2'])
   assert.ok(w[side+'_'+name],side+'_'+name);
 }
 assert.ok(Math.abs(p.angles.right_shoulder)>.7);
 assert.ok(Math.abs(p.angles.right_index_0)>.1);
});
test('R1 deterministic scrubbing and smooth frame-to-frame head, neck, hip motion',()=>{
 const frames=[0,17,62,129,130,180,266,267,306,406,407,449];
 for(const f of frames){
  const original=skeletonPoseAtFrame(f);
  skeletonPoseAtFrame(449);
  assert.deepEqual(original,skeletonPoseAtFrame(f));
 }
 let last=null;
 for(let f=0;f<TOTAL_FRAMES;f++){
  const pose=skeletonPoseAtFrame(f);
  const p=evaluateSkeleton(rig,pose.angles,pose.rootOffset);
  if(last)for(const name of ['pelvis','chest','neck_base','neck_tip','head_root','left_wrist','right_wrist']){
   assert.ok(d(p[name],last[name])<6,'unexpected position pop: '+name+' frame '+f);
  }
  last=p;
 }
});
test('R1 rejects invalid frames',()=>{
 for(const frame of [-1,450,1.25,NaN])assert.throws(()=>skeletonPoseAtFrame(frame),/out of bounds/);
});
