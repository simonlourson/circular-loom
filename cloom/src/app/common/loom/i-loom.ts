import { Vector2 } from "../vector2";
import { LoomLine } from "../loom-line";

export interface ILoom {

  pins: Vector2[];
  pinsReference: Vector2[];
  loomLines: LoomLine[];
  loomRimWidth: number;
  
}