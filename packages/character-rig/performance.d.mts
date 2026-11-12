export const TOTAL_FRAMES:number;
export const FPS:number;
export const GROUND_Y:number;
export function skeletonPoseAtFrame(frame:number):{angles:Record<string,number>;rootOffset:{x:number;y:number};section:number;title:string;neckEngaged:boolean;feet:{left:{x:number;y:number;contact:boolean};right:{x:number;y:number;contact:boolean}};groundY:number;flight:boolean;face:{blink:number;surprise:number;gaze:number;mouthOpen:number};pointing:number;waving:number};
