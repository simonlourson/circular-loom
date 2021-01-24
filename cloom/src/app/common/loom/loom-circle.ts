import { ILoom } from "./i-loom";
import { LoomLine } from "../loom-line";
import { Vector2 } from "../vector2";
import { AlgoHelpers } from "../algo-base";

export class LoomCircle implements ILoom {
  
  pins: Vector2[];
  pinsReference: Vector2[];
  loomLines: LoomLine[];
  loomRimWidth: number;

  constructor(nbPins: number, loomRimWidth: number, referenceSize: Vector2, realRadius: number, minDistance: number) {

      this.loomRimWidth = loomRimWidth;

      let realCenter = new Vector2(realRadius, realRadius);
      this.pins = this.generatePinPositions(nbPins, realCenter, realRadius);

      let rimToTotalWidthRatio = loomRimWidth / (loomRimWidth + realRadius * 2);
      let rimWidthInPixels = referenceSize.x * rimToTotalWidthRatio;
      let referenceRadius = (referenceSize.x - rimWidthInPixels) / 2;
      this.pinsReference = this.generatePinPositions(nbPins, Vector2.scale(referenceSize, 0.5), referenceRadius);
      this.generatePossibleLines(this.pinsReference, minDistance);

  }

  generatePinPositions(nbPins: number, center: Vector2, radius: number) : Vector2[] {
    
    let returnValue: Vector2[] = [];

    for (let pinIndex = 0; pinIndex < nbPins; pinIndex++) {
      let angle = Math.PI * 2 * pinIndex / nbPins;
      let newPin = new Vector2(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius
      );

      returnValue.push(newPin);
    }

    return returnValue;
  }

  generatePossibleLines(pinsReference: Vector2[], minDistance: number) {
    
    this.loomLines = [];

    for (let pinStartIndex = 0; pinStartIndex < pinsReference.length - 1; pinStartIndex++) {
      for (let pinStopIndex = pinStartIndex + 1; pinStopIndex < pinsReference.length; pinStopIndex++) {
        if (AlgoHelpers.distanceBetweenPins(pinStartIndex, pinStopIndex, pinsReference.length) >= minDistance) {
          let newLoomLine = new LoomLine(pinStartIndex, pinStopIndex);

          let startPos = pinsReference[pinStartIndex].clone();
          let stopPos = pinsReference[pinStopIndex].clone();

          newLoomLine.pixelsThrough = AlgoHelpers.pixelsCrossedByLine(startPos, stopPos)
          this.loomLines.push(newLoomLine);
        }
      }
    }
  }
}