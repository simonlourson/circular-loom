import { AlgoBase, AlgoHelpers } from "./algo-base";
import { LoomLine } from "./loom-line";
import { Vector2 } from './vector2';

export class AlgoDarkestLine implements AlgoBase {

  options: OptionsDarkestLine;
  
  // Algo values
  currentPin: number;
  possibleLines: LoomLine[];

  setParams(options: OptionsDarkestLine) {

    this.options = options;
    this.possibleLines = AlgoHelpers.generatePossibleLines(this.options.pins, this.options.minDistanceBetweenPins);

  }

  runAlgo(nextPin: (pin: number) => void) {

    this.currentPin = Math.floor(Math.random() * this.options.pins.length);
    nextPin(this.currentPin);

    for (let fast = 0; fast < this.options.nbArcs; fast++) {
      // Code assez long à l'execution
      setTimeout(() => {
 
        let nextLine = this.chooseNextLine();
        this.applyNextLine(nextLine);
        nextPin(this.currentPin);
 
        if (fast == this.options.nbArcs - 1) console.log('DONE!');
      });
    }
  }

  chooseNextLine(): number {

    let highestLineDarkness: number = undefined
    let lineDarknesses: number[] = [];
    for (let lineIndex = 0; lineIndex < this.possibleLines.length; lineIndex++) {

      // We only start fromm the subset of lines which either begin or end at the current pin
      if (this.possibleLines[lineIndex].pinStart != this.currentPin && this.possibleLines[lineIndex].pinStop != this.currentPin) continue;

      // We compute the average darkness of the pixel for this line
      lineDarknesses[lineIndex] = 0;
      let totalWeight = 0;
      for (let pixel of this.possibleLines[lineIndex].pixelsThrough) {
        let pixelIndex = AlgoHelpers.getIndexFromVector(pixel.position, this.options.referenceSize);
        lineDarknesses[lineIndex] += this.options.referenceData[pixelIndex] * pixel.weight;
        totalWeight += pixel.weight;
      }
      lineDarknesses[lineIndex] = lineDarknesses[lineIndex] / totalWeight;

      // If this is the darkest line we've encountered so far, we save it
      if (highestLineDarkness == undefined || lineDarknesses[lineIndex] > highestLineDarkness) highestLineDarkness = lineDarknesses[lineIndex];
    }

    let returnValue = -1;
    let startIndex = Math.floor(Math.random() * this.options.pins.length);
    for (let lineIndexRandom = startIndex; lineIndexRandom < this.possibleLines.length + startIndex; lineIndexRandom++) {
      let lineIndex = lineIndexRandom % this.possibleLines.length;
      if (lineDarknesses[lineIndex] == highestLineDarkness) returnValue =  lineIndex;
    }

    if (returnValue != -1) return returnValue;

    throw new Error('No suitable line found');
  }

  applyNextLine(lineIndex: number) {
    for (let pixel of this.possibleLines[lineIndex].pixelsThrough) {
      let pixelIndex = AlgoHelpers.getIndexFromVector(pixel.position, this.options.referenceSize);
      this.options.referenceData[pixelIndex] -= pixel.weight * this.options.threadContrast;
      if (this.options.referenceData[pixelIndex] < 0) this.options.referenceData[pixelIndex] = 0;
    }

    

    if (this.currentPin == this.possibleLines[lineIndex].pinStart) this.currentPin = this.possibleLines[lineIndex].pinStop;
    else if (this.currentPin == this.possibleLines[lineIndex].pinStop) this.currentPin = this.possibleLines[lineIndex].pinStart;
    else throw new Error('this should never happen');

    this.possibleLines.splice(lineIndex, 1);
  }


}

export class OptionsDarkestLine {
  pins: Vector2[];
  nbArcs: number;
  minDistanceBetweenPins: number;
  threadContrast: number;
  referenceSize: number;
  referenceData: number[];
}