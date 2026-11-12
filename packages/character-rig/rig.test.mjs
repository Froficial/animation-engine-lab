import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {BODY_SIDES,FINGERS,createHumanoidRig,validateRig,evaluateSkeleton} from './index.mjs';
const rig=createHumanoidRig();
const copy=()=>JSON.parse(JSON.stringify(rig));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const get=id=>rig.joints.find(n=>n.id===id);
test('full body schema includes neck, head, spine, pelvis and required limb chains',()=>{
  const ids=new Set(rig.joints.map(n=>n.id));
  for(const n of ['root_motion','pelvis','lumbar','chest','neck_base','neck_tip','head_root','skull','jaw','mouth'])
    assert.ok(ids.has(n),n);
  for(const side of BODY_SIDES){
    for(const n of ['clavicle','shoulder','upper_arm','elbow','forearm','wrist','hand',
      'hip','thigh','knee','shin','ankle','foot','heel','ball','toe'])assert.ok(ids.has(side+'_'+n),side+'_'+n);
    for(const finger of FINGERS){
      for(const segment of [0,1,2])assert.ok(ids.has(side+'_'+finger+'_'+segment));
      assert.equal(get(side+'_'+finger+'_0').parentId,side+'_hand');
      assert.equal(get(side+'_'+finger+'_1').parentId,side+'_'+finger+'_0');
      assert.equal(get(side+'_'+finger+'_2').parentId,side+'_'+finger+'_1');
    }
  }
  assert.equal(get('neck_base').parentId,'chest');
  assert.equal(get('neck_tip').parentId,'neck_base');
  assert.equal(get('head_root').parentId,'neck_tip');
  assert.equal(get('left_ankle').parentId,'left_shin');
  assert.equal(get('right_wrist').parentId,'right_forearm');
});
test('all joints are connected, rooted and valid including all five fingers',()=>{
  assert.equal(validateRig(copy()).joints.length,rig.joints.length);
  assert.ok(rig.joints.length>=75);
  assert.equal(rig.joints.filter(n=>n.parentId===null).length,1);
  assert.deepEqual(rig.views,['front','three-quarter-left','profile-left','three-quarter-right','profile-right']);
});
test('forward kinematics passes chest movement through neck into head, but not feet',()=>{
 const original=evaluateSkeleton(rig);
 const moved=evaluateSkeleton(rig,{lumbar:.18,chest:-.08,neck_base:.09,head_root:-.08});
 assert.ok(distance(original.head_root,moved.head_root)>4);
 assert.ok(distance(original.chest,moved.chest)>1);
 assert.equal(distance(original.left_ankle,moved.left_ankle),0);
 assert.equal(distance(original.right_ankle,moved.right_ankle),0);
 assert.equal(moved.head_root.parentId,'neck_tip');
});
test('bone lengths and neck connections stay constant while parent joints rotate',()=>{
 const angles={pelvis:.21,lumbar:-.16,chest:.11,neck_base:.14,neck_tip:-.11,
  head_root:.19,left_shoulder:-.7,left_elbow:.5,left_wrist:.17,
  right_hip:.18,right_knee:.5,right_ankle:-.22,right_index_0:.25};
 const out=evaluateSkeleton(rig,angles,{x:70,y:200});
 for(const node of rig.joints){
  if(node.parentId===null)continue;
  const actual=distance(out[node.id],out[node.parentId]);
  assert.ok(Math.abs(actual-node.restLength)<1e-6,node.id+': '+actual+' vs '+node.restLength);
 }
});
test('parent rotation moves all attached digits including thumb but keeps other arm independent',()=>{
 const a=evaluateSkeleton(rig),b=evaluateSkeleton(rig,{left_wrist:.7});
 assert.notDeepEqual([a.left_thumb_2.x,a.left_thumb_2.y],[b.left_thumb_2.x,b.left_thumb_2.y]);
 assert.notDeepEqual([a.left_index_2.x,a.left_index_2.y],[b.left_index_2.x,b.left_index_2.y]);
 assert.deepEqual([a.right_thumb_2.x,a.right_thumb_2.y],[b.right_thumb_2.x,b.right_thumb_2.y]);
});
test('reject cycles, orphan joints, duplicates, invalid limits and mismatch bone length',()=>{
 const changes=[
  doc=>doc.joints.find(n=>n.id==='chest').parentId='head_root',
  doc=>doc.joints.find(n=>n.id==='chest').parentId='missing_parent',
  doc=>doc.joints.push({...doc.joints[0]}),
  doc=>doc.joints.find(n=>n.id==='left_knee').limits={min:1,max:2},
  doc=>doc.joints.find(n=>n.id==='left_knee').restLength+=20,
  doc=>doc.joints.find(n=>n.id==='right_hand').offset.x=Infinity,
 ];
 for(const change of changes){const doc=copy();change(doc);assert.throws(()=>validateRig(doc),/CharacterRig:/);}
});
test('rotation limits are enforced and unknown joints cannot be animated',()=>{
 assert.throws(()=>evaluateSkeleton(rig,{neck_base:2}),/angle out of bounds/);
 assert.throws(()=>evaluateSkeleton(rig,{unknown_joint:.1}),/unknown joint/);
});
test('same pose is deterministic regardless of requests order',()=>{
 const a=evaluateSkeleton(rig,{pelvis:.2,left_shoulder:.5,left_index_1:.3},{x:100,y:10});
 evaluateSkeleton(rig,{pelvis:-.3,right_knee:.2},{x:0,y:0});
 const b=evaluateSkeleton(rig,{pelvis:.2,left_shoulder:.5,left_index_1:.3},{x:100,y:10});
 assert.deepEqual(a,b);
});
test('root motion translates all joints uniformly and preserves distances',()=>{
 const a=evaluateSkeleton(rig),b=evaluateSkeleton(rig,{}, {x:134,y:-77});
 for(const id of ['pelvis','head_root','left_thumb_2','right_toe','left_ankle']){
  assert.ok(Math.abs(b[id].x-a[id].x-134)<1e-8,id);
  assert.ok(Math.abs(b[id].y-a[id].y+77)<1e-8,id);
 }
});
