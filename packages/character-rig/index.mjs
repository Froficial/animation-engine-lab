// Human rig v1: data-only skeleton shared by all renderers.
// Coordinate system: +X right, +Y down. Angles in radians. No global clock.
const TAU=Math.PI*2;
const finite=(v)=>typeof v==='number'&&Number.isFinite(v);
const ensure=(test,message)=>{if(!test)throw Error('CharacterRig: '+message);};
export const FACING_VIEWS=Object.freeze(['front','three-quarter-left','profile-left','three-quarter-right','profile-right']);
export const FINGERS=Object.freeze(['thumb','index','middle','ring','pinky']);
export const BODY_SIDES=Object.freeze(['left','right']);
export function validateRig(rig){
  ensure(rig&&typeof rig==='object'&&!Array.isArray(rig),'invalid document');
  ensure(rig.version===1,'unsupported version');
  ensure(typeof rig.id==='string'&&/^[a-z][a-z0-9-]*$/.test(rig.id),'invalid rig ID');
  ensure(rig.units==='rig-units','invalid units');
  ensure(Array.isArray(rig.views)&&rig.views.length>=1&&rig.views.every(x=>FACING_VIEWS.includes(x)),'invalid views');
  ensure(new Set(rig.views).size===rig.views.length,'duplicate views');
  ensure(Array.isArray(rig.joints)&&rig.joints.length>=3&&rig.joints.length<=250,'invalid joint count');
  const map=new Map();
  for(const n of rig.joints){
    ensure(n&&typeof n==='object','invalid joint');
    ensure(typeof n.id==='string'&&/^[a-z][a-z0-9_]*$/.test(n.id)&&!map.has(n.id),'duplicate/invalid joint ID');
    ensure(n.parentId===null||(typeof n.parentId==='string'&&n.parentId!==n.id),'invalid parent ID for '+n.id);
    ensure(n.offset&&finite(n.offset.x)&&finite(n.offset.y),'invalid offset for '+n.id);
    ensure(n.pivotLocal&&finite(n.pivotLocal.x)&&finite(n.pivotLocal.y),'invalid pivot for '+n.id);
    ensure(n.limits&&finite(n.limits.min)&&finite(n.limits.max)&&n.limits.min<=0&&n.limits.max>=0&&
      n.limits.min>=-TAU&&n.limits.max<=TAU,'invalid rotation limits for '+n.id);
    ensure(Number.isInteger(n.drawLayer)&&Math.abs(n.drawLayer)<100,'invalid draw layer for '+n.id);
    ensure(finite(n.restLength)&&n.restLength>=0,'invalid rest length for '+n.id);
    ensure(Math.abs(n.restLength-Math.hypot(n.offset.x,n.offset.y))<1e-8,'rest length mismatches offset for '+n.id);
    map.set(n.id,n);
  }
  const roots=rig.joints.filter(n=>n.parentId===null);
  ensure(roots.length===1&&roots[0].id==='root_motion','expected exactly one root_motion');
  for(const n of rig.joints){
    if(n.parentId!==null)ensure(map.has(n.parentId),'missing parent for '+n.id);
  }
  const states=new Map();
  const visit=(id)=>{
    if(states.get(id)===2)return;
    ensure(states.get(id)!==1,'cycle near '+id);
    states.set(id,1);
    const n=map.get(id);
    if(n.parentId!==null)visit(n.parentId);
    states.set(id,2);
  };
  for(const n of rig.joints)visit(n.id);
  return rig;
}
const clamp=(min,max,value)=>Math.max(min,Math.min(max,value));
const rounded=(value)=>Math.round(value*1e8)/1e8;
function multiply(p,q){
  return [
    p[0]*q[0]+p[2]*q[1], p[1]*q[0]+p[3]*q[1],
    p[0]*q[2]+p[2]*q[3], p[1]*q[2]+p[3]*q[3],
    p[0]*q[4]+p[2]*q[5]+p[4], p[1]*q[4]+p[3]*q[5]+p[5]
  ];
}
export function evaluateSkeleton(rig,angles={},rootOffset={x:0,y:0}){
  validateRig(rig);
  ensure(angles&&typeof angles==='object'&&!Array.isArray(angles),'invalid angles');
  ensure(rootOffset&&finite(rootOffset.x)&&finite(rootOffset.y),'invalid world offset');
  const map=new Map(rig.joints.map(n=>[n.id,n]));
  for(const [id,a] of Object.entries(angles)){
    ensure(map.has(id),'unknown joint in pose: '+id);
    ensure(finite(a),'non-finite angle: '+id);
    const {limits}=map.get(id);
    ensure(a>=limits.min-1e-9&&a<=limits.max+1e-9,'joint angle out of bounds: '+id);
  }
  const world=new Map();
  const visit=id=>{
    if(world.has(id))return world.get(id);
    const n=map.get(id),angle=clamp(n.limits.min,n.limits.max,angles[id]||0);
    const c=Math.cos(angle),s=Math.sin(angle);
    const local=[c,s,-s,c,n.offset.x,n.offset.y];
    const parent=n.parentId===null?[1,0,0,1,rootOffset.x,rootOffset.y]:visit(n.parentId);
    const output=multiply(parent,local);
    world.set(id,output);
    return output;
  };
  for(const n of rig.joints)visit(n.id);
  return Object.fromEntries(rig.joints.map(n=>{
    const m=world.get(n.id);
    return [n.id,Object.freeze({x:rounded(m[4]),y:rounded(m[5]),angle:rounded(Math.atan2(m[1],m[0])),
      matrix:Object.freeze(m.map(rounded)),parentId:n.parentId})];
  }));
}
export function createHumanoidRig(){
  const joints=[];
  const add=(id,parentId,x,y,min=-Math.PI,max=Math.PI,drawLayer=0)=>{
    joints.push({id,parentId,offset:{x,y},pivotLocal:{x:0,y:0},limits:{min,max},
      restLength:Math.hypot(x,y),drawLayer});
  };
  add('root_motion',null,0,0);
  add('pelvis','root_motion',0,0,-.55,.55);
  add('lumbar','pelvis',0,-55,-.4,.4);
  add('chest','lumbar',0,-75,-.4,.4);
  add('neck_base','chest',0,-55,-.3,.3);
  add('neck_tip','neck_base',0,-22,-.35,.35);
  add('head_root','neck_tip',0,-14,-.6,.6);
  for(const [id,x,y] of [['skull',0,-24],['jaw',0,8],['hair',0,-70],
      ['left_eye',-20,-33],['right_eye',20,-33],['left_brow',-20,-48],
      ['right_brow',20,-48],['mouth',0,13]]){
    add(id,'head_root',x,y,-.25,.25);
  }
  for(const side of BODY_SIDES){
    const sign=side==='left'?-1:1;
    const d=side==='left'?-1:1;
    add(side+'_clavicle','chest',sign*38,-20,-.65,.65,d);
    add(side+'_shoulder',side+'_clavicle',sign*23,5,-1.9,1.9,d);
    add(side+'_upper_arm',side+'_shoulder',0,0,-1.9,1.9,d);
    add(side+'_elbow',side+'_upper_arm',sign*5,71,-2.3,2.3,d);
    add(side+'_forearm',side+'_elbow',0,0,-2.3,2.3,d);
    add(side+'_wrist',side+'_forearm',sign*3,69,-1.3,1.3,d);
    add(side+'_hand',side+'_wrist',0,17,-1.3,1.3,d);
    const digitX={thumb:-18,index:-10,middle:0,ring:9,pinky:18};
    for(const digit of FINGERS){
      const x=digitX[digit]*sign;
      const id=side+'_'+digit;
      add(id+'_0',side+'_hand',x,digit==='thumb'?9:25,-1.5,1.5,d);
      add(id+'_1',id+'_0',digit==='thumb'?sign*-11:0,13,-1.5,1.5,d);
      add(id+'_2',id+'_1',digit==='thumb'?sign*-7:0,11,-1.5,1.5,d);
    }
    add(side+'_hip','pelvis',sign*27,14,-1.3,1.3,d);
    add(side+'_thigh',side+'_hip',0,0,-1.6,1.6,d);
    add(side+'_knee',side+'_thigh',0,94,-.3,2.5,d);
    add(side+'_shin',side+'_knee',0,0,-1.6,1.6,d);
    add(side+'_ankle',side+'_shin',0,88,-1.6,1.6,d);
    add(side+'_foot',side+'_ankle',0,6,-.65,.65,d);
    add(side+'_heel',side+'_foot',sign*-14,8,-.45,.45,d);
    add(side+'_ball',side+'_foot',sign*19,10,-.45,.45,d);
    add(side+'_toe',side+'_ball',sign*19,0,-.5,.5,d);
  }
  const rig={version:1,id:'humanoid-2d-v1',units:'rig-units',
    views:[...FACING_VIEWS],joints};
  return validateRig(rig);
}

