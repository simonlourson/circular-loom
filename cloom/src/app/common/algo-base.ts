import { PixelValue, LoomLine } from './loom-line';
import { Vector2 } from './vector2';

export interface AlgoBase {
  setParams(options: any);
  runAlgo(callback: (n: number) => void);
}

export class AlgoHelpers {
  static pixelsCrossedByLine(startPos: Vector2, stopPos: Vector2): PixelValue[] {
    let returnValue: PixelValue[] = [];

    let difference = new Vector2(
      stopPos.x - startPos.x,
      stopPos.y - startPos.y
    );

    let differenceUnit = difference.clone();
    differenceUnit.x = differenceUnit.x / difference.length;
    differenceUnit.y = differenceUnit.y / difference.length;

    let differenceTaxiCab = difference.clone();
    if (differenceTaxiCab.x != 0) differenceTaxiCab.x = differenceTaxiCab.x / Math.abs(differenceTaxiCab.x);
    if (differenceTaxiCab.y != 0) differenceTaxiCab.y = differenceTaxiCab.y / Math.abs(differenceTaxiCab.y);

    let currentCursor = startPos.clone();

    while (true) {

      let nextHorizontalCrossingPoint = new Vector2(
        0,
        differenceTaxiCab.y > 0 ? Math.floor(currentCursor.y + differenceTaxiCab.y) : Math.ceil(currentCursor.y + differenceTaxiCab.y)
      );

      let hcRatio = (nextHorizontalCrossingPoint.y - currentCursor.y) / differenceUnit.y;
      nextHorizontalCrossingPoint.x = currentCursor.x + differenceUnit.x * hcRatio;

      let nextVerticalCrossingPoint = new Vector2(
        differenceTaxiCab.x > 0 ? Math.floor(currentCursor.x + differenceTaxiCab.x) : Math.ceil(currentCursor.x + differenceTaxiCab.x),
        0
      );
      let vcRatio = (nextVerticalCrossingPoint.x - currentCursor.x) / differenceUnit.x;
      nextVerticalCrossingPoint.y = currentCursor.y + differenceUnit.y * vcRatio;

      let distanceToNextHorizontalCrossingPoint = Vector2.distanceSquared(currentCursor, nextHorizontalCrossingPoint);
      let distanceToNextVerticalCrossingPoint = Vector2.distanceSquared(currentCursor, nextVerticalCrossingPoint);
      let distanceToEnd = Vector2.distanceSquared(currentCursor, stopPos);

      let weight = Math.sqrt(Math.min(distanceToNextHorizontalCrossingPoint, distanceToNextVerticalCrossingPoint, distanceToEnd));
      let nextCurrentCursor:Vector2;
      if (distanceToEnd <= distanceToNextVerticalCrossingPoint && distanceToEnd <= distanceToNextHorizontalCrossingPoint)
        nextCurrentCursor = stopPos.clone();
      else if (distanceToNextHorizontalCrossingPoint < distanceToNextVerticalCrossingPoint)
        nextCurrentCursor = nextHorizontalCrossingPoint.clone();
      else 
        nextCurrentCursor = nextVerticalCrossingPoint.clone();
      
      let average = Vector2.average(currentCursor, nextCurrentCursor);

      returnValue.push(new PixelValue(new Vector2(Math.floor(average.x), Math.floor(average.y)), weight));

      if (distanceToEnd <= distanceToNextVerticalCrossingPoint && distanceToEnd <= distanceToNextHorizontalCrossingPoint) {
        break;
      }

      currentCursor = nextCurrentCursor;
    }

    return returnValue;
  }

  static generatePinPositions(nbPins: number, center: Vector2, radius: number): Vector2[] {
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

  static generatePossibleLines(pins: Vector2[], minDistance: number): LoomLine[] {
    let returnValue: LoomLine[] = [];
    for (let pinStartIndex = 0; pinStartIndex < pins.length - 1; pinStartIndex++) {
      for (let pinStopIndex = pinStartIndex + 1; pinStopIndex < pins.length; pinStopIndex++) {
        if (AlgoHelpers.distanceBetweenPins(pinStartIndex, pinStopIndex, pins.length) >= minDistance) {
          let newLoomLine = new LoomLine(pinStartIndex, pinStopIndex);

          let startPos = pins[pinStartIndex].clone();
          let stopPos = pins[pinStopIndex].clone();

          newLoomLine.pixelsThrough = AlgoHelpers.pixelsCrossedByLine(startPos, stopPos)
          returnValue.push(newLoomLine);
        }
      }
    }

    return returnValue;
  }

  static distanceBetweenPins(pinStart: number, pinStop: number, nbPins: number): number {
    let distance = Math.abs(pinStart - pinStop);

    return Math.min(distance, Math.abs(distance - nbPins));
  }

  static getIndexFromVector(pixelPosition: Vector2, referenceSize: number) {
    return pixelPosition.y * referenceSize + pixelPosition.x;
  }
}