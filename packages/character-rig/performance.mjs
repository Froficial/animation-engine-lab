// R1: deterministic full-body skeleton acting without claiming IK, 3D turns or foot locking.
export const TOTAL_FRAMES = 450;
export const FPS = 30;
const clamp=(x)=>Math.max(0,Math.min(1,x));
const ease=(x)=>{const a=clamp(x);return a*a*(3-2*a);};
const pulse=(frame,start,peak,end,release)=>ease((frame-start)/(peak-start))*(1-ease((frame-end)/(release-end)));
export function skeletonPoseAtFrame(frame){
 if(!Number.isInteger(frame)||frame<0||frame>=TOTAL_FRAMES)throw Error('Skeleton R1: frame out of bounds');
 const lean=pulse(frame,15,66,93,130);
 const turn=pulse(frame,134,183,226,267);
 const gesture=pulse(frame,265,307,361,407);
 const recovery=ease((frame-404)/40);
 const angles={
   pelvis:.09*lean-.10*turn+.045*gesture,
   lumbar:.13*lean-.10*turn+.06*gesture,
   chest:.10*lean-.08*turn,
   neck_base:-.055*lean+.045*turn-.02*gesture,
   neck_tip:-.04*lean+.06*turn,
   head_root:-.07*lean+.15*turn-.035*gesture,
   left_clavicle:-.03*lean,
   right_clavicle:.03*lean,
   left_shoulder:.16*lean+.25*gesture,
   right_shoulder:-.18*lean-.96*gesture,
   left_elbow:.06*lean,
   right_elbow:-.35*gesture,
   right_wrist:.10*gesture,
   right_index_0:-.26*gesture,
   right_middle_0:.55*gesture,
   right_ring_0:.55*gesture,
   right_pinky_0:.50*gesture,
   right_thumb_0:-.24*gesture,
   left_hip:-.06*lean,
   right_hip:.06*lean,
   left_knee:.14*lean,
   right_knee:.10*lean,
   left_ankle:-.08*lean,
   right_ankle:-.06*lean
 };
 const section=frame<130?0:frame<267?1:frame<407?2:3;
 const titles=['TRONCO E QUADRIL','PESCOÇO CONECTADO','BRAÇOS E DEDOS','RECUPERAÇÃO'];
 return {angles,rootOffset:{x:270+9*lean,y:560+4*lean-2*turn+2*recovery},section,title:titles[section],
  neckEngaged:lean>0||turn>0||gesture>0};
}
