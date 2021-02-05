import { PixelValue, LoomLine } from './loom-line';
import { Vector2 } from './vector2';

export interface AlgoBase {
  setParams(options: any);
  runAlgo(callback: (n: number) => void);
}

export class AlgoHelpers {
  static pixelsCrossedByLine(startPos: Vector2, stopPos: Vector2): PixelValue[] {
    let returnValue: PixelValue[] = [];

    // LMA LOG
    //if (startPos.x == stopPos.x) console.log(startPos)
    //if (startPos.x == stopPos.x) console.log(stopPos)


    let difference = new Vector2(
      stopPos.x - startPos.x,
      stopPos.y - startPos.y
    );

    let differenceUnit = difference.clone();
    differenceUnit.x = differenceUnit.x / difference.length;
    differenceUnit.y = differenceUnit.y / difference.length;

    // LMA LOG
    //if (startPos.x == stopPos.x) {
    //  console.log('differenceUnit')
    //  console.log(differenceUnit)
    //}

    let differenceTaxiCab = difference.clone();
    if (differenceTaxiCab.x != 0) differenceTaxiCab.x = differenceTaxiCab.x / Math.abs(differenceTaxiCab.x);
    if (differenceTaxiCab.y != 0) differenceTaxiCab.y = differenceTaxiCab.y / Math.abs(differenceTaxiCab.y);

    // LMA LOG
    //if (startPos.x == stopPos.x) {
    //  console.log('differenceTaxiCab')
    //  console.log(differenceTaxiCab)
    //}

    let currentCursor = startPos.clone();

    while (true) {

      let nextHorizontalCrossingPoint = new Vector2(
        0,
        differenceTaxiCab.y > 0 ? Math.floor(currentCursor.y + differenceTaxiCab.y) : Math.ceil(currentCursor.y + differenceTaxiCab.y)
      );

      let hcRatio = (nextHorizontalCrossingPoint.y - currentCursor.y) / differenceUnit.y;
      if (differenceUnit.y == 0) hcRatio = 1;
      nextHorizontalCrossingPoint.x = currentCursor.x + differenceUnit.x * hcRatio;

      // LMA LOG
      //if (startPos.x == stopPos.x) {
      //  console.log('nextHorizontalCrossingPoint')
      //  console.log(nextHorizontalCrossingPoint)
      //}

      let nextVerticalCrossingPoint = new Vector2(
        differenceTaxiCab.x > 0 ? Math.floor(currentCursor.x + differenceTaxiCab.x) : Math.ceil(currentCursor.x + differenceTaxiCab.x),
        0
      );
      let vcRatio = (nextVerticalCrossingPoint.x - currentCursor.x) / differenceUnit.x;
      if (differenceUnit.x == 0) vcRatio = 1;
      nextVerticalCrossingPoint.y = currentCursor.y + differenceUnit.y * vcRatio;

      // LMA LOG
      //if (startPos.x == stopPos.x) {
      //  console.log('nextVerticalCrossingPoint')
      //  console.log(nextVerticalCrossingPoint)
      //}

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

      if (weight > 0.0001) returnValue.push(new PixelValue(new Vector2(Math.floor(average.x), Math.floor(average.y)), weight));

      if (distanceToEnd <= distanceToNextVerticalCrossingPoint && distanceToEnd <= distanceToNextHorizontalCrossingPoint) {
        break;
      }

      currentCursor = nextCurrentCursor;
    }

    return returnValue;
  }

  static generatePinPositionsRectangle(nbPins: number, rimWidth: number, width: number, height: number): Vector2[] {

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

  static snapNumber(n: number, target: number) {
    if (Math.abs(n - target) < 0.00001) return target;
    else return n;
  }

  static distanceBetweenPins(pinStart: number, pinStop: number, nbPins: number): number {
    let distance = Math.abs(pinStart - pinStop);

    return Math.min(distance, Math.abs(distance - nbPins));
  }

  static isOnSameLine(pinStart: Vector2, pinStop: Vector2, width: number, height: number) {
    return (
      (pinStart.x == pinStop.x  && (pinStart.x == 0 || pinStart.x == width)) ||
      (pinStart.y == pinStop.y  && (pinStart.y == 0 || pinStart.y == height))
    );
  }

  static colinear(pinStartIndex: number, pinStopIndex: number, pins: Vector2[], minAngle: number) {

    for (let index = 0; index < pins.length; index++) {
      if (index == pinStartIndex || index == pinStopIndex) continue;

      /*
      let v1 = pins[pinStartIndex];
      let v2 = pins[pinStopIndex];
      let v3 = pins[index];

      let result = (v2.x-v1.x)*(v3.y-v1.y)-(v2.y-v1.y)*(v3.x-v1.x);
      if (Math.abs(result) < 1) return true;
      */

      let vectorIn = new Vector2( 
        pins[index].x - pins[pinStartIndex].x,
        pins[index].y - pins[pinStartIndex].y
      );
      let vectorOut: Vector2 = new Vector2(
        pins[pinStopIndex].x - pins[index].x,
        pins[pinStopIndex].y - pins[index].y
      );

      let angle = AlgoHelpers.getAngleBetweenVectors(vectorIn, vectorOut);
      angle = ((angle * 180 / Math.PI) + 360) % 180;
      if (angle < minAngle || angle > (180-minAngle)) return true;
    }

    return false;
  }

  static getAngleBetweenVectors(vectorIn: Vector2, vectorOut: Vector2) {
    return Math.atan2(vectorIn.x*vectorOut.y-vectorIn.y*vectorOut.x,vectorIn.x*vectorOut.x+vectorIn.y*vectorOut.y);
  }

  static getIndexFromVector(pixelPosition: Vector2, referenceSize: number) {
    return pixelPosition.y * referenceSize + pixelPosition.x;
  }
}