export interface Point{x:number;y:number}
export interface RigJoint{
  id:string;parentId:string|null;offset:Point;pivotLocal:Point;
  limits:{min:number;max:number};restLength:number;drawLayer:number;
}
export interface CharacterRig{
 version:1;id:string;units:'rig-units';views:string[];joints:RigJoint[];
}
export interface WorldJoint{
 x:number;y:number;angle:number;parentId:string|null;matrix:readonly number[];
}
export const BODY_SIDES:readonly ('left'|'right')[];
export const FINGERS:readonly ('thumb'|'index'|'middle'|'ring'|'pinky')[];
export const FACING_VIEWS:readonly string[];
export function createHumanoidRig():CharacterRig;
export function validateRig<T extends CharacterRig>(rig:T):T;
export function evaluateSkeleton(rig:CharacterRig,angles?:Record<string,number>,rootOffset?:Point):Record<string,WorldJoint>;
