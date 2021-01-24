import { LoomType } from './saved-loom';
import { Vector2 } from './vector2';
import { LoomLine } from './loom-line';
import { AlgoHelpers } from './algo-base';


export class LoomVectorInfo {
  nbPins: number;
  loomType: LoomType;
  loomDiameter: number;
  referenceSize: Vector2;
  loomRimWidth: number;

  pins: Vector2[];
  pinsReference: Vector2[];
  loomLines: LoomLine[];

  /*
  constructor(nbPins: number, loomType: LoomType, loomDiameter: number, loomRimWidth: number, referenceSize: Vector2) {
    this.nbPins = nbPins;
    this.loomType = loomType;
    this.loomDiameter = loomDiameter;
    this.referenceSize = referenceSize;
    this.loomRimWidth = loomRimWidth;
    if (this.loomType == LoomType.Circle) {
      let center = new Vector2(
        (this.loomDiameter + 0) / 2,
        (this.loomDiameter + 0) / 2
      );
      this.pins = AlgoHelpers.generatePinPositions(this.nbPins, center, loomDiameter / 2);

      let centerReference = Vector2.scale(this.referenceSize, 0.5);
      let referenceDiameter = this.referenceSize.x * this.loomDiameter / (this.loomDiameter + this.loomRimWidth);
      this.pinsReference = AlgoHelpers.generatePinPositions(this.nbPins, centerReference, referenceDiameter / 2);

      this.loomLines = AlgoHelpers.generatePossibleLines(this.pinsReference, 25);

      //console.log(centerReference);
      //console.log(referenceDiameter);
      console.log(center);
      console.log(this.loomLines);
    }
    else if (this.loomType == LoomType.Rectangle) {
      this.pins = AlgoHelpers.generatePinPositionsRectangle(this.nbPins, this.loomRimWidth, this.loomDiameter, this.loomDiameter);
      this.pinsReference = AlgoHelpers.generatePinPositionsRectangle(this.nbPins, 0, 200, 200);
      
      this.loomLines = AlgoHelpers.generatePossibleLinesRectangle(this.pinsReference, 200, 200);
    }
    

  }
  */
}