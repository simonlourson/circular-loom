import { AlgoBase, AlgoHelpers } from "./algo-base";
import { LoomLine } from "./loom-line";
import { Vector2 } from './vector2';
import { Observable } from 'rxjs';

export class AlgoMinimumError implements AlgoBase {

  options: OptionsMinimumError;
  
  // Algo values
  currentPin: number;
  possibleLines: LoomLine[];
  lineData: number[];

  setParams(options: OptionsMinimumError) {
    this.options = options;
  }

  runAlgo(nextPin: (pin: number) => void) {

    this.currentPin = Math.floor(Math.random() * this.options.pins.length);
    nextPin(this.currentPin);

    setTimeout(() => {
      // Generate possible lines from the pins we got from the options
      this.possibleLines = this.options.possibleLines;

      // Reset the line data
      this.lineData = [];
      for (let i = 0; i < this.options.referenceData.length; i++) this.lineData[i] = 0;

      // Start the recursive algorithm
      this.algoNextStep(nextPin);
    });

  }

  algoNextStep(nextPin: (pin: number) => void) {
    setTimeout(() => {
      let nextLine = this.chooseNextLine();
      if (nextLine != -1) {
        nextPin(this.applyNextLine(nextLine));
        this.algoNextStep(nextPin);
      }
      else {
        nextPin(-1);
      }
    });
  }

  chooseNextLine(): number {

    let highestErrorDelta: number = undefined
    let errorDeltas: number[] = [];
    for (let lineIndex = 0; lineIndex < this.possibleLines.length; lineIndex++) {

      // We only start fromm the subset of lines which either begin or end at the current pin
      if (this.possibleLines[lineIndex].pinStart != this.currentPin && this.possibleLines[lineIndex].pinStop != this.currentPin) continue;

      // We compute the average error of the pixels for this line
      errorDeltas[lineIndex] = 0;
      let totalWeight = 0;
      for (let pixel of this.possibleLines[lineIndex].pixelsThrough) {
        let pixelIndex = AlgoHelpers.getIndexFromVector(pixel.position, this.options.referenceSize);

        // The error for this line right now
        let currentError = this.options.referenceData[pixelIndex] - this.lineData[pixelIndex];
        currentError = (currentError * currentError);

        // The error for this line if we where to draw it
        let tentativeError = this.options.referenceData[pixelIndex] - this.lineData[pixelIndex] - this.options.threadContrast;
        tentativeError = (tentativeError * tentativeError);

        // The error delta, the higher, the better the line. If this is negative, drawing the line will make the final picture worse
        let errorDelta = currentError - tentativeError;
        let errorWeight = (this.options.errorWeightData[pixelIndex] / 255) * 1 + 1;
        errorDeltas[lineIndex] += errorDelta * pixel.weight * errorWeight;

        totalWeight += pixel.weight;
      }
      errorDeltas[lineIndex] = errorDeltas[lineIndex] / totalWeight;

      // If this is the highest error delta we've encountered so far, we save it
      if (highestErrorDelta == undefined || errorDeltas[lineIndex] > highestErrorDelta) highestErrorDelta = errorDeltas[lineIndex];
    }

    let returnValue = -1;
    let startIndex = Math.floor(Math.random() * this.options.pins.length);
    for (let lineIndexRandom = startIndex; lineIndexRandom < this.possibleLines.length + startIndex; lineIndexRandom++) {
      let lineIndex = lineIndexRandom % this.possibleLines.length;
      if (errorDeltas[lineIndex] == highestErrorDelta && highestErrorDelta > 0) returnValue =  lineIndex;
    }

    return returnValue;
  }

  applyNextLine(lineIndex: number): number {
    for (let pixel of this.possibleLines[lineIndex].pixelsThrough) {
      let pixelIndex = AlgoHelpers.getIndexFromVector(pixel.position, this.options.referenceSize);
      this.lineData[pixelIndex] += pixel.weight * this.options.threadContrast;
    }

    if (this.currentPin == this.possibleLines[lineIndex].pinStart) this.currentPin = this.possibleLines[lineIndex].pinStop;
    else if (this.currentPin == this.possibleLines[lineIndex].pinStop) this.currentPin = this.possibleLines[lineIndex].pinStart;
    else throw new Error('this should never happen');

    this.possibleLines.splice(lineIndex, 1);

    return this.currentPin;
  }


}

export class OptionsMinimumError {
  pins: Vector2[];
  possibleLines: LoomLine[];
  minDistanceBetweenPins: number;
  threadContrast: number;
  referenceSize: number;
  referenceData: number[];
  errorWeightData: number[];
}