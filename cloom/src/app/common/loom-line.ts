import { Vector2 } from './vector2';

export class LoomLine {
  pinStart: number;
  pinStop: number;

  pixelsThrough: PixelValue[];

  constructor(pinStart: number, pinStop: number) {
    this.pinStart = pinStart;
    this.pinStop = pinStop;
  }
}

export class PixelValue {
  position: Vector2;
  weight: number;

  constructor(position: Vector2, weight: number) {
    this.position = position;
    this.weight = weight;
  }
}