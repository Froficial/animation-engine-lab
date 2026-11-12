import {createHumanoidRig,evaluateSkeleton} from './index.mjs';
import {solveLeg} from './ik.mjs';
export const TOTAL_FRAMES=450;
export const FPS=30;
export const GROUND_Y=772;
const rig=createHumanoidRig();
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const pulse=(f,a,b,c,d)=>ease((f-a)/(b-a))*(1-ease((f-c)/(d-c)));
function foot(frame,x,steps){
 for(const [a,b,target] of steps){
  if(frame<a)break;
  if(frame<=b){const u=(frame-a)/(b-a);return {x:x+(target-x)*ease(u),y:756-22*Math.sin(Math.PI*u),contact:frame===a||frame===b};}
  x=target;
 }
 return {x,y:756,contact:true};
}
export function skeletonPoseAtFrame(frame){
 if(!Number.isInteger(frame)||frame<0||frame>=450)throw Error('Skeleton: frame out of bounds');
 const walking=frame<120, pointing=pulse(frame,120,162,195,237), reacting=pulse(frame,215,245,300,345), waving=pulse(frame,345,390,409,449);
 const left=foot(frame,180,[[44,66,240],[102,119,260]]),right=foot(frame,220,[[12,34,260],[76,98,300]]);
 const crouch=14*pulse(frame,235,245,245,250)+12*pulse(frame,276,282,282,298);
 const flight=frame>=250&&frame<=276;
 const u=(frame-250)/26, jump=flight?-38*4*u*(1-u):0;
 if(flight){left.y+=jump;right.y+=jump;left.contact=right.contact=frame===250||frame===276;}
 const rootOffset={x:200+80*ease(Math.min(frame,120)/120),y:576+(walking?1.8*Math.sin(frame*Math.PI/21):0)+crouch+jump};
 const walkArm=walking?.24*Math.sin(frame*Math.PI/21)*(1-ease((frame-100)/20)):0;
 const angles={pelvis:walking?.018*Math.sin(frame*Math.PI/21):.025*pointing,
 lumbar:.05*pointing+.025*crouch/14,chest:.035*pointing+.015*crouch/14,
 neck_base:-.025*pointing,neck_tip:-.025*pointing,head_root:-.08*pointing-.045*reacting+.035*waving*Math.sin(frame*.07),
 left_shoulder:walkArm+.32*reacting,right_shoulder:-walkArm-1.12*pointing-.30*reacting-.80*waving,
 left_elbow:.12+.12*reacting,right_elbow:.12-.30*pointing-.25*reacting-.35*waving,
 right_wrist:.12*waving*Math.sin(frame*.22),right_index_0:-.18*pointing,
 right_middle_0:.7*pointing,right_ring_0:.7*pointing,right_pinky_0:.7*pointing};
 const before=evaluateSkeleton(rig,angles,rootOffset);
 for(const [side,target] of [['left',left],['right',right]]){
  const hip=before[side+'_hip'];
  const solution=solveLeg(hip,target,94,88,1);
  angles[side+'_hip']=solution.upper-before.pelvis.angle;
  angles[side+'_knee']=solution.kneeAngle;
  // Counter-rotate the ankle so the sole remains horizontal, independent of the hip.
  angles[side+'_ankle']=-(solution.upper+solution.kneeAngle);
 }
 const section=frame<120?0:frame<235?1:frame<345?2:3;
 const surprise=reacting*(.75+.25*Math.cos((frame-270)*.05));
 const blink=[53,188,323,421].reduce((v,f)=>Math.min(v,Math.abs(frame-f)<3?.12+.88*Math.abs(frame-f)/3:1),1);
 return {angles,rootOffset,section,title:['PASSOS COM APOIO','OLHAR E APONTAR','SALTO E ATERRISSAGEM','ACENO'][section],
 neckEngaged:true,feet:{left,right},groundY:GROUND_Y,flight,
 face:{blink,surprise,gaze:pointing*4,mouthOpen:surprise},pointing,waving};
}
