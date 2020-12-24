
import { Vector2 } from './vector2';

export class SavedLoom {
  pins: Vector2[];
  pinPath: number[];

  loomType: LoomType;
  loomDiameter: number;
  loomRimWidth: number
  threadColor: string;
  loomColor: string;
  threadWidth: string;

  static copyFrom(original: SavedLoom): SavedLoom {
    let returnValue = new SavedLoom();

    returnValue.pins = [];
    for (let pin of original.pins) returnValue.pins.push(Vector2.clone(pin));
    returnValue.pinPath = original.pinPath;
    returnValue.loomDiameter = original.loomDiameter;
    returnValue.loomRimWidth = original.loomRimWidth;
    returnValue.threadColor = original.threadColor;
    returnValue.loomColor = original.loomColor;
    returnValue.threadWidth = original.threadWidth;
    returnValue.loomType = original.loomType;

    return returnValue;
  }
}

export enum LoomType {
  Circle,
  Rectangle
}

export interface LoomTypeWithLabel {
  loomType: LoomType;
  loomLabel: string;
}