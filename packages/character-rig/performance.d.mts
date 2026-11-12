export const TOTAL_FRAMES:number;
export const FPS:number;
export function skeletonPoseAtFrame(frame:number):{
  angles:Record<string,number>;rootOffset:{x:number;y:number};
  section:number;title:string;neckEngaged:boolean
};
