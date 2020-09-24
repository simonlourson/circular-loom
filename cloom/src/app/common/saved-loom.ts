
import { Vector2 } from './vector2';

export class SavedLoom {
  pins: Vector2[];
  pinPath: number[];

  loomDiameter: number;
  loomRimWidth: number
  threadColor: string;
  threadWidth: string;

  static copyFrom(original: SavedLoom): SavedLoom {
    let returnValue = new SavedLoom();

    returnValue.pins = [];
    for (let pin of original.pins) returnValue.pins.push(Vector2.clone(pin));
    returnValue.pinPath = original.pinPath;
    returnValue.loomDiameter = original.loomDiameter;
    returnValue.loomRimWidth = original.loomRimWidth;
    returnValue.threadColor = original.threadColor;
    returnValue.threadWidth = original.threadWidth;

    return returnValue;
  }
}