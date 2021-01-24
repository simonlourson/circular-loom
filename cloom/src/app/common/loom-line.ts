import { Vector2 } from './vector2';

export class LoomLine {
  pinStart: number;
  pinStop: number;

  pixelsThrough: PixelValue[];

  constructor(pinStart: number, pinStop: number) {
    this.pinStart = pinStart;
    this.pinStop = pinStop;
  }

  static clone(loomLine: LoomLine): LoomLine {
    let returnValue = new LoomLine(loomLine.pinStart, loomLine.pinStop);

    returnValue.pixelsThrough = [];
    for (let pixel of loomLine.pixelsThrough)
      returnValue.pixelsThrough.push(PixelValue.clone(pixel));

    return returnValue;
  } 
}

export class PixelValue {
  position: Vector2;
  weight: number;

  constructor(position: Vector2, weight: number) {
    this.position = position;
    this.weight = weight;
  }

  static clone(pixelValue: PixelValue): PixelValue {
    return new PixelValue(Vector2.clone(pixelValue.position), pixelValue.weight);
  }
}