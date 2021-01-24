import { ILoom } from "./i-loom";
import { LoomLine } from "../loom-line";
import { Vector2 } from "../vector2";
import { AlgoHelpers } from '../algo-base';

export class LoomRectangle implements ILoom {
    
  pins: Vector2[];
  pinsReference: Vector2[];
  loomLines: LoomLine[];
  loomRimWidth: number;

  constructor(nbPins: number, loomRimWidth: number, referenceSize: Vector2, realSize: Vector2) {
    this.loomRimWidth = loomRimWidth;

    this.pins = this.generatePinPositions(nbPins, realSize.x, realSize.y);
    this.pinsReference = this.generatePinPositions(nbPins, referenceSize.x, referenceSize.y);
    this.generatePossibleLines(this.pinsReference);
  }

  generatePinPositions(nbPins: number, width: number, height: number): Vector2[] {

    if (nbPins % 4 != 0) throw new Error('For a rectangle frame, the number of pins must be a multiple of 4');

    let perimeter = 2 * width + 2 * height;
    let delta = perimeter / nbPins;
    let nbPinsWidth = width / delta;
    let nbPinsHeigth = height / delta;

    if (nbPinsWidth % 1 != 0 || nbPinsHeigth % 1 != 0) throw new Error('For a rectangle frame, the distance between the pins must be constant, and a pins must be in each corner');

    let deltaVector: Vector2 = new Vector2(delta, 0);
    let currentPin: Vector2 = new Vector2(0, 0);

    let returnValue: Vector2[] = [];

    for (let pinIndex = 0; pinIndex < nbPins; pinIndex++) {
      let newPin = Vector2.clone(currentPin);

      currentPin = Vector2.add(currentPin, deltaVector);
      currentPin.x = AlgoHelpers.snapNumber(currentPin.x, 0);
      currentPin.x = AlgoHelpers.snapNumber(currentPin.x, width);
      currentPin.y = AlgoHelpers.snapNumber(currentPin.y, 0);
      currentPin.y = AlgoHelpers.snapNumber(currentPin.y, -height);
      
      if (deltaVector.x > 0 && currentPin.x >= width) deltaVector = new Vector2(0, delta);
      else if (deltaVector.y > 0 && currentPin.y >= height) deltaVector = new Vector2(-delta, 0);
      else if (deltaVector.x < 0 && currentPin.x <= 0) deltaVector = new Vector2(0, -delta);

      returnValue.push(newPin);
    }

    return returnValue;
  }
    
  generatePossibleLines(pins: Vector2[]) {
    this.loomLines = [];
    for (let pinStartIndex = 0; pinStartIndex < pins.length - 1; pinStartIndex++) {
      for (let pinStopIndex = pinStartIndex + 1; pinStopIndex < pins.length; pinStopIndex++) {
        if (!AlgoHelpers.colinear(pinStartIndex, pinStopIndex, pins)) {
          let newLoomLine = new LoomLine(pinStartIndex, pinStopIndex);

          let startPos = pins[pinStartIndex].clone();
          let stopPos = pins[pinStopIndex].clone();

          newLoomLine.pixelsThrough = AlgoHelpers.pixelsCrossedByLine(startPos, stopPos);
          this.loomLines.push(newLoomLine);
        }
      }
    }
  }
}