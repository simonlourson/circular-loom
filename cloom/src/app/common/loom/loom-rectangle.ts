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

    this.pins = this.generatePinPositions(nbPins, new Vector2(0, 0), realSize);
    let rimToTotalWidthRatio = new Vector2(loomRimWidth / (realSize.x + loomRimWidth), loomRimWidth / (realSize.y + loomRimWidth));
    let rimWidthInPixels = new Vector2(referenceSize.x * rimToTotalWidthRatio.x, referenceSize.y * rimToTotalWidthRatio.y);
    let referenceSizeCorrected = new Vector2(referenceSize.x - rimWidthInPixels.x, referenceSize.y - rimWidthInPixels.y);
    let referenceStart = Vector2.scale(rimWidthInPixels, 0.5);
    this.pinsReference = this.generatePinPositions(nbPins, referenceStart, referenceSizeCorrected);

    this.generatePossibleLines(this.pinsReference);
  }

  generatePinPositions(nbPins: number, start:Vector2, size: Vector2): Vector2[] {

    if (nbPins % 4 != 0) throw new Error('For a rectangular frame, the number of pins must be a multiple of 4');

    let widthToHeightRatio = size.x / size.y;

    let nbPinsV = new Vector2(
      Math.round((widthToHeightRatio * nbPins) / (2 * (1 + widthToHeightRatio))),
      Math.round(nbPins / (2 * (1 + widthToHeightRatio)))
    );

    //console.log(nbPinsV); 
    
    let currentPin: Vector2 = Vector2.clone(start);

    let returnValue: Vector2[] = [];

    let totalPins = 0;
    for (let pinIndex = 0; pinIndex < nbPinsV.x; pinIndex++) {

      let newPin = Vector2.clone(currentPin);
      returnValue.push(newPin);

      currentPin.x += size.x / nbPinsV.x;

      totalPins++;
    }
    for (let pinIndex = 0; pinIndex < nbPinsV.y; pinIndex++) {

      let newPin = Vector2.clone(currentPin);
      returnValue.push(newPin);

      currentPin.y += size.y / nbPinsV.y;

      totalPins++;
    }
    for (let pinIndex = 0; pinIndex < nbPinsV.x; pinIndex++) {

      let newPin = Vector2.clone(currentPin);
      returnValue.push(newPin);

      currentPin.x -= size.x / nbPinsV.x;

      totalPins++;
    }
    for (let pinIndex = 0; pinIndex < nbPinsV.y; pinIndex++) {

      let newPin = Vector2.clone(currentPin);
      returnValue.push(newPin);

      currentPin.y -= size.y / nbPinsV.y;

      totalPins++;
    }

    //console.log(totalPins);
    //console.log(returnValue);
    
/*
    for (let pinIndex = 0; pinIndex < nbPins; pinIndex++) {
      let newPin = Vector2.clone(currentPin);

      currentPin = Vector2.add(currentPin, deltaVector);
      currentPin.x = AlgoHelpers.snapNumber(currentPin.x, 0);
      currentPin.x = AlgoHelpers.snapNumber(currentPin.x, size.x);
      currentPin.y = AlgoHelpers.snapNumber(currentPin.y, 0);
      currentPin.y = AlgoHelpers.snapNumber(currentPin.y, -size.y);
      
      if (deltaVector.x > 0 && currentPin.x >= size.x) deltaVector = new Vector2(0, delta);
      else if (deltaVector.y > 0 && currentPin.y >= size.y) deltaVector = new Vector2(-delta, 0);
      else if (deltaVector.x < 0 && currentPin.x <= 0) deltaVector = new Vector2(0, -delta);

      returnValue.push(newPin);
    }
    */

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