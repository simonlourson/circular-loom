
import { Vector2 } from './vector2';

export class SavedLoom {
  pins: Vector2[];
  pinPath: number[];

  loomType: LoomType;
  loomDiameter: number;
  loomRimWidth: number;
  loomColor: string;
  threadWidth: string;
  threadColor: string;

  static copyFrom(original: SavedLoom): SavedLoom {
    let returnValue = new SavedLoom();

    returnValue.pinPath = original.pinPath;
    returnValue.loomDiameter = original.loomDiameter;
    returnValue.loomRimWidth = original.loomRimWidth;
    returnValue.threadColor = original.threadColor;
    returnValue.loomColor = original.loomColor;
    returnValue.threadWidth = original.threadWidth;
    returnValue.loomType = original.loomType;

    returnValue.pins = [];
    if (original.pins != undefined) {
      for (let pin of original.pins) 
        returnValue.pins.push(Vector2.clone(pin));
    }

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