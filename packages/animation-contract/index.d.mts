export interface AnimationScene{id:string;startFrame:number;durationFrames:number;action:'walk'|'point'|'react'|'wave';heading:string;subtitle:string}
export interface AnimationDocument{version:1;id:string;fps:number;width:number;height:number;totalFrames:number;characterId:string;characterRig:'simple-humanoid-v1';scenes:AnimationScene[]}
export interface RigPose{
 action:string;x:number;y:number;bodyY:number;torsoAngle:number;
 leftUpperArm:number;rightUpperArm:number;leftForearm:number;rightForearm:number;
 leftLeg:number;rightLeg:number;leftFootX:number;rightFootX:number;
 leftFootLift:number;rightFootLift:number;headAngle:number;eyeScale:number;eyeOpen:number;
 pupilX:number;mouth:string;mouthOpen:number;browRaise:number;cameraZoom:number;spotlight:number;
 leftHand:string;rightHand:string
}
export const ACTIONS:readonly string[];
export function validateDocument<T extends AnimationDocument>(doc:T):T;
export function sceneAtFrame(doc:AnimationDocument,frame:number):{scene:AnimationScene;localFrame:number};
export function poseAtFrame(doc:AnimationDocument,frame:number):RigPose;
