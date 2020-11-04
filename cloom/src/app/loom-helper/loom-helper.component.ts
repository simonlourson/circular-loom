import { Component, Input, OnInit } from '@angular/core';
import { Vector2 } from '../common/vector2';
import { SavedLoom } from '../common/saved-loom';
import { AlgoHelpers } from '../common/algo-base';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-loom-helper',
  templateUrl: './loom-helper.component.html',
  styleUrls: ['./loom-helper.component.css']
})
export class LoomHelperComponent implements OnInit {

  currentPin_: number = 0;
  get currentPin(): number { return this.currentPin_; };
  set currentPin(value: number) { 
    this.currentPin_ = value;
    this.updatePath();
  };
  pinPath: number[] = [];
  instructions: string[];
  audioInstructions: HTMLAudioElement[];

  totalLength: number = 0;
  nbArcs: number = 0;

  get totalLenghtForDisplay() { return this.totalLength.toFixed(2) + ' m' }

  @Input() loomType: LoomType;
  @Input() loomDiameter: number;
  @Input() loomRimWidth: number;
  quadraticError: number = 10;
  threadColor: string = '#E000D1';
  threadWidth: string = '.2';
  pins: Vector2[];
  path: string = '';

  quadraticBezierCurveToRemember: Vector2[];

  get viewBox(): string { 
    if (this.loomType == LoomType.Circle) return '0 0 ' + this.loomDiameter + ' ' + this.loomDiameter;
    else if (this.loomType == LoomType.Rectangle) return '0 0 ' + this.loomDiameter + ' ' + this.loomDiameter;
    else throw new Error('Unknown loom type');
  }

  get isLoomTypeCircle(): boolean { return this.loomType == LoomType.Circle; }
  get isLoomTypeRectangle(): boolean { return this.loomType == LoomType.Rectangle; }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    // LMA Log
    let pinRectangle = AlgoHelpers.generatePinPositionsRectangle(12, 0, 3, 3);
    console.log(pinRectangle);
    let possibleLines = AlgoHelpers.generatePossibleLinesRenctangle(pinRectangle, 3, 3);
    console.log(possibleLines);

    this.initPins();
    this.audioInstructions = [];

    this.route.params.subscribe((params: Params): void => {
      let path = params.id;
      if (path != undefined) {
        fetch('/assets/' + path + '.json')
        .then(response => { return response.json(); })
        .then(json => {
          let savedLoom = SavedLoom.copyFrom(json);
          this.pins = savedLoom.pins;
          this.pinPath = savedLoom.pinPath;
          this.loomDiameter = savedLoom.loomDiameter;
          this.loomRimWidth = savedLoom.loomRimWidth;
          this.threadColor = savedLoom.threadColor;
          this.threadWidth = savedLoom.threadWidth;

          this.initInstructions();
          this.setToMax();
        })
        .catch((error) => {
          console.log(error);
        });
      }
    });
  }

  getAudioInstruction(instruction: string) {
    if (instruction == '0a') instruction = '200a';
    else if (instruction == '0h') instruction = '200h';
    
    let horaire: boolean = instruction.indexOf('h') != -1;
    let index = (horaire ? 0 : 200) + Number.parseInt(instruction.replace('a', '').replace('h', ''));

    if (this.audioInstructions[index] == undefined) {
      this.audioInstructions[index] = new Audio('assets/instructions/' + instruction + '.wav');
      this.audioInstructions[index].onended = this.playRecursiveWithDelay.bind(this);
    }
    this.audioInstructions[index].play();
  }

  addIndex(step: number) {
    this.currentPin += step;

    if (this.currentPin < 0) this.currentPin = 0;
    if (this.currentPin >= this.pinPath.length) this.currentPin = this.pinPath.length - 1;
  }

  get canPressPlay() { return !this.isAlgoRunning && this.instructions != undefined && this.instructions.length > 0 }

  isAlgoRunning: boolean = false;
  isPlaying: boolean = false;
  playPause() {
    this.isPlaying = !this.isPlaying;

    // Set to 0 if we reached the end
    if (this.currentPin >= this.pinPath.length - 1) this.currentPin = 0;

    this.playRecursive();
  }

  playRecursiveWithDelay() {
    setTimeout(this.playRecursive.bind(this), 3000);
  }

  playRecursive() {
    // stop playing if we reached the end
    if (this.currentPin + 1 == this.pinPath.length) this.isPlaying = false;

    if (this.isPlaying) {
      this.addIndex(1);
      this.getAudioInstruction(this.instructions[this.currentPin]);
    }
  }

  initPins() {
    //let pinCenter = new Vector2(this.loomDiameter / 2, this.loomDiameter / 2);
    //let pinRadius = this.loomDiameter / 2 - this.loomRimWidth / 2;
    //this.pins = AlgoHelpers.generatePinPositions(this.nbPins, pinCenter, pinRadius);

    this.quadraticBezierCurveToRemember = [];

    /*
    let jeromeaureline = new SavedLoom();
    jeromeaureline.pinPath = [75, 36, 88, 39, 86, 37, 62, 35, 89, 38, 84, 40, 87, 36, 90, 34, 59, 32, 104, 30, 101, 25, 99, 198, 96, 11, 94, 196, 93, 35, 88, 43, 116, 45, 118, 48, 120, 50, 118, 47, 121, 49, 92, 36, 85, 8, 82, 40, 85, 37, 89, 32, 91, 34, 103, 29, 102, 35, 86, 44, 84, 8, 111, 9, 89, 42, 84, 37, 87, 32, 102, 26, 87, 34, 63, 37, 112, 12, 97, 14, 113, 12, 96, 197, 94, 34, 89, 30, 56, 187, 57, 26, 101, 24, 83, 39, 116, 42, 81, 6, 110, 7, 80, 43, 105, 31, 92, 196, 95, 14, 96, 33, 90, 41, 83, 45, 79, 6, 111, 10, 93, 197, 97, 11, 112, 38, 85, 41, 92, 33, 58, 25, 88, 31, 95, 197, 98, 15, 114, 36, 86, 28, 103, 37, 73, 41, 82, 38, 67, 42, 118, 49, 107, 199, 108, 50, 91, 35, 87, 9, 88, 33, 104, 29, 95, 33, 64, 36, 127, 93, 40, 138, 41, 141, 42, 72, 45, 119, 85, 190, 86, 50, 183, 52, 120, 24, 59, 188, 56, 125, 52, 16, 98, 198, 97, 32, 93, 48, 87, 43, 145, 44, 168, 45, 148, 46, 78, 7, 77, 187, 78, 5, 110, 32, 101, 68, 98, 36, 117, 82, 6, 94, 39, 91, 179, 89, 124, 55, 16, 115, 15, 116, 37, 83, 22, 85, 51, 81, 41, 146, 43, 79, 199, 109, 0, 108, 34, 92, 37, 128, 98, 17, 51, 78, 44, 120, 53, 185, 57, 186, 52, 77, 199, 80, 42, 164, 41, 86, 191, 87, 38, 102, 67, 105, 28, 100, 27, 95, 30, 93, 36, 120, 86, 40, 141, 27, 82, 25, 140, 41, 91, 177, 89, 178, 70, 45, 149, 48, 108, 4, 79, 8, 100, 23, 119, 22, 87, 39, 136, 22, 60, 18, 50, 82, 46, 122, 88, 179, 71, 180, 52, 122, 48, 78, 117, 34, 110, 1, 109, 3, 76, 193, 79, 115, 82, 42, 139, 24, 89, 176, 92, 38, 140, 26, 94, 126, 36, 107, 2, 106, 30, 142, 40, 83, 7, 97, 129, 36, 94, 28, 89, 39, 84, 189, 55, 122, 26, 107, 50, 75, 184, 73, 44, 169, 46, 147, 42, 76, 184, 49, 86, 192, 77, 49, 109, 35, 95, 198, 75, 186, 58, 16, 61, 191, 85, 123, 47, 150, 46, 117, 20, 138, 21, 84, 23, 137, 105, 36, 89, 181, 93, 37, 88, 45, 106, 66, 103, 31, 110, 0, 111, 11, 95, 130, 37, 136, 41, 165, 43, 81, 116, 33, 143, 32, 94, 178, 90, 175, 91, 5, 132, 4, 90, 27, 54, 17, 104, 70, 100, 132, 6, 109, 36, 99, 127, 73, 182, 105, 27, 96, 129, 38, 91, 183, 76, 44, 80, 47, 72, 177, 87, 46, 145, 112, 1, 82, 28, 96, 13, 188, 80, 194, 75, 6, 131, 199, 130, 196, 108, 27, 139, 38, 88, 42, 90, 125, 51, 76, 116, 23, 139, 41, 163, 40, 137, 21, 118, 24, 93, 33, 98, 37, 74, 118, 41, 84, 52, 151, 49, 79, 47, 174, 86, 43, 138, 103, 35, 120, 54, 125, 96, 7, 134, 69, 171, 59, 15, 56, 155, 57, 17, 66, 117, 80, 1, 131, 37, 91, 176, 73, 126, 188, 127, 92, 175, 61, 173, 69, 191, 128, 72, 185, 12, 99, 24, 137, 15, 113, 3, 110, 33, 125, 37, 95, 28, 56, 183, 90, 180, 48, 15, 63, 104, 181, 74, 124, 92, 40, 146, 111, 34, 143, 42, 135, 11, 89, 196, 129, 68, 170, 60, 185, 58, 172, 62, 2, 113, 148, 114, 150, 51, 90, 9, 100, 22, 80, 40, 88, 191, 129, 72, 134, 43, 83, 26, 142, 31, 94, 176, 90, 35, 124, 83, 116, 14, 189, 106, 27, 57, 173, 45, 16, 47, 86, 23, 94, 182, 92, 27, 137, 38, 93, 34, 121, 25, 106, 138, 37, 141, 102, 12, 186, 127, 192, 85, 50, 78, 53, 15, 136, 42, 91, 45, 80, 120, 39, 145, 41, 87, 21, 139, 29, 81, 188, 77, 118, 65, 165, 64, 130, 2, 132, 98, 31, 125, 189, 128, 3, 64, 167, 45, 75, 117, 48, 151, 47, 181, 11, 180, 104, 183, 71, 46, 170, 59, 157, 35, 97, 133, 77, 114, 7, 99, 193, 100, 12, 94, 180, 88, 21, 61, 14, 112, 0, 132, 198, 128, 71, 135, 39, 81, 8, 115, 84, 25, 104, 18, 65, 166, 63, 130, 5, 108, 194, 130, 39, 93, 123, 75, 127, 187, 64, 103, 27, 60, 176, 51, 126, 89, 1, 79, 41, 122, 76, 126, 32, 139, 20, 78, 121, 189, 56, 179, 73, 6, 129, 69, 197, 108, 52, 159, 37, 139, 39, 128, 186, 110, 184, 13, 55, 153, 117, 42, 69, 184, 48, 109, 34, 97, 196, 88, 4, 133, 37, 97, 49, 14, 135, 69, 169, 61, 12, 187, 95, 26, 141, 28, 53, 81, 123, 45, 85, 7, 131, 101, 16, 69, 105, 139, 31, 83, 180, 97, 71, 182, 89, 43, 14, 54, 153, 116, 67, 171, 47, 147, 104, 145, 102, 195, 131, 66, 124, 70, 5, 133, 43, 140, 30, 121, 70, 173, 58, 1, 111, 149, 46, 15, 42, 138, 33, 99, 71, 103, 181, 51, 109, 197, 129, 65, 190, 15, 103, 140, 36, 96, 50, 192, 96, 178, 9, 115, 44, 83, 0, 125, 194, 85, 24, 107, 191, 130, 41, 16, 136, 38, 94, 29, 141, 24, 105, 61, 161, 39, 90, 13, 101, 36, 119, 159, 53, 157, 58, 178, 74, 46, 179, 57, 12, 63, 163, 51, 95, 179, 104, 26, 64, 182, 72, 139, 108, 181, 10, 114, 83, 49, 125, 65, 107, 1, 124, 187, 129, 199, 55, 80, 173, 74, 2, 82, 118, 22, 86, 118, 198, 106, 35, 81, 119, 161, 40, 101, 196, 112, 144, 34, 120, 194, 94, 3, 66, 168, 62, 17, 52, 89, 0, 84, 27, 122, 192, 126, 189, 130, 34, 82, 195, 121, 193, 126, 37, 137, 14, 79, 120, 71, 133, 73, 119, 196, 67, 123, 43, 85, 173, 64, 14, 60, 183, 13, 50, 178, 72, 176, 8, 135, 68, 106, 28, 142, 42, 100, 149, 103, 30, 138, 19, 49, 122, 84, 175, 93, 44, 17, 102, 73, 175, 56, 128, 185, 13, 117, 23, 59, 177, 90, 25, 96, 38, 162, 6, 158, 60, 169, 70, 180, 65, 11, 117, 155, 2, 67, 167, 62, 181, 44, 137, 32, 124, 190, 55, 114, 2, 120, 58, 19, 88, 44, 148, 108, 195, 124, 78, 132, 194, 107, 23, 165, 120, 0, 81, 54, 12, 51, 18, 131, 188, 110, 155, 51, 197, 121, 38, 156, 58, 162, 52, 82, 182, 110, 14, 47, 105, 143, 80, 2, 72, 15, 111, 152, 54, 128, 192, 49, 171, 42, 106, 0, 128, 74, 101, 8, 62, 174, 91, 124, 197, 112, 4, 76, 176, 83, 117, 33, 132, 190, 74, 198, 131, 191, 46, 20, 99, 9, 55, 178, 66, 9, 116, 196, 100, 75, 138, 80, 119, 183, 99, 35, 108, 185, 114, 147, 41, 95, 24, 106, 26, 51, 93, 58, 169, 73, 189, 122, 199, 96, 29, 87, 27, 127, 193, 133, 10, 52, 158, 2, 119, 74, 19, 47, 73, 124, 44, 142, 35, 85, 114, 151, 4, 114, 20, 130, 195, 98, 3, 78, 170, 67, 4, 87, 190, 128, 67, 136, 40, 89, 21, 63, 11, 72, 120, 168, 47, 135, 5, 163, 121, 0, 77, 125, 69, 4, 153, 107, 28, 83, 46, 115, 7, 161, 42, 94, 30, 143, 97, 19, 64, 164, 4, 61, 26, 96, 122, 33, 8, 175, 94, 37, 100, 184, 125, 195, 112, 151, 0, 82, 47, 93, 146, 45, 136, 13, 38, 71, 177, 75, 172, 122, 195, 101, 17, 68, 185, 130, 12, 137, 39, 143, 77, 116, 185, 85, 30, 120, 6, 98, 10, 64, 120, 56, 153, 7, 66, 183, 109, 156, 1, 105, 30, 60, 9, 65, 133, 14, 119, 79, 54, 154, 3, 118, 75, 133, 47, 187, 126, 7, 43, 190, 83, 115, 80, 193, 125, 48, 98, 22, 104, 148, 50, 15, 84, 141, 59, 12, 40, 158, 49, 179, 101, 69, 1, 120, 158, 21, 92, 174, 73, 195, 61, 159, 51, 173, 7, 109, 189, 102, 142, 74, 180, 110, 198, 123, 71, 185, 121, 167, 24, 57, 14, 100, 47, 11, 109, 141, 66, 105, 46, 151, 101, 181, 109, 32, 144, 36, 80, 52, 92, 18, 43, 160, 12, 101, 157, 3, 149, 6, 89, 27, 120, 198, 152, 117, 59, 10, 81, 31, 140, 40, 127, 183, 78, 174, 69, 127, 26, 167, 115, 61, 185, 10, 136, 89, 133, 41, 119, 32, 80, 171, 9, 101, 61, 92, 48, 132, 15, 45, 12, 58, 182, 79, 37, 161, 115, 10, 91, 197, 99, 10, 79, 141, 39, 70, 16, 78, 42, 124, 194, 131, 81, 178, 103, 191, 126, 183, 107, 63, 171, 29, 129, 188, 14, 85, 197, 111, 154, 55, 25, 117, 50, 150, 3, 105, 51, 127, 86, 181, 69, 8, 133, 189, 40, 65, 164, 111, 190, 107, 157, 50, 167, 59, 156, 116, 60, 5, 147, 195, 120, 93, 20, 103, 67, 19, 117, 76, 144, 68, 3, 134, 70, 197, 103, 52, 14, 39, 172, 8, 123, 1, 159, 48, 7, 56, 158, 98, 34, 137, 51, 116, 8, 102, 148, 112, 189, 48, 139, 16, 121, 164, 17, 96, 69, 115, 86, 30, 170, 43, 94, 199, 151, 108, 77, 176, 95, 194, 79, 2, 90, 23, 65, 4, 128, 36, 97, 185, 124, 188, 134, 36, 159, 13, 53, 88, 26, 1, 74, 152, 100, 34, 119, 171, 71, 168, 111, 56, 176, 53, 6, 57, 154, 19, 91, 126, 0, 143, 28, 126, 13, 99, 67, 8, 161, 0, 70, 149, 193, 101, 128, 194, 106, 186, 49, 23, 103, 187, 70, 196, 117, 184, 72, 140, 81, 136, 106, 65, 30];
    jeromeaureline.pins = this.pins;
    jeromeaureline.loomDiameter = 800;
    jeromeaureline.loomRimWidth = 20;
    jeromeaureline.threadColor = '#009';
    jeromeaureline.threadWidth = '.2';

    let a = document.createElement('a');
    document.body.append(a);
    a.download = 'jeromeaureline.json';
    a.href = URL.createObjectURL(new Blob([JSON.stringify(jeromeaureline)], {}));
    a.click();
    a.remove();
    */
  }

  saveLoom() {
    let tom = new SavedLoom();
    tom.pinPath = this.pinPath;
    tom.pins = this.pins;
    tom.loomDiameter = 600;
    tom.loomRimWidth = 20;
    tom.threadColor = '#009';
    tom.threadWidth = '.2';

    let a = document.createElement('a');
    document.body.append(a);
    a.download = 'tom.json';
    a.href = URL.createObjectURL(new Blob([JSON.stringify(tom)], {}));
    a.click();
    a.remove();
  }

  initInstructions() {
    this.instructions = [];
    for (let index  = 0; index < this.pinPath.length; index++) {
      if (index == 0 || index == this.pinPath.length - 1) this.instructions[index] = this.pinPath[index] + 'h';
      else {
        let pinIn: Vector2 = this.pins[this.pinPath[index - 1]];
        let pinCurrent: Vector2 = this.pins[this.pinPath[index]];
        let pinOut: Vector2 = this.pins[this.pinPath[index + 1]];
        let vectorIn = new Vector2(
          pinCurrent.x - pinIn.x,
          pinCurrent.y - pinIn.y
        );
        let vectorOut: Vector2 = new Vector2(
          pinOut.x - pinCurrent.x,
          pinOut.y - pinCurrent.y
        );

        let angle = Math.atan2(vectorIn.x*vectorOut.y-vectorIn.y*vectorOut.x,vectorIn.x*vectorOut.x+vectorIn.y*vectorOut.y);
        this.instructions[index] = this.pinPath[index] + (angle < 0 ? 'h' : 'a');
      }
    }
  }

  setToMax() {
    this.currentPin = this.pinPath.length - 1;
  }

  updatePath() {
    this.path = undefined;
    this.nbArcs = 0;
    this.totalLength = 0;
    for (let index  = 0; index < this.currentPin; index++) {
      if (index == 0) {
        this.path = 'M';
        this.path = this.path + this.pins[this.pinPath[index]].x + ' ' + this.pins[this.pinPath[index]].y + ' ';
      }
      else {
        let oldPinPosition = this.pins[this.pinPath[index - 1]];
        let newPinPosition = this.pins[this.pinPath[index]];

        if (oldPinPosition != undefined && newPinPosition != undefined) {
          this.totalLength += Math.sqrt(Vector2.distanceSquared(oldPinPosition, newPinPosition)) / 1000;
          this.nbArcs++;

          let quadraticBezierCurveTo: Vector2 = this.quadraticBezierCurveToRemember[index];;
          if (quadraticBezierCurveTo == undefined) {
            quadraticBezierCurveTo = Vector2.average(oldPinPosition, newPinPosition);
            quadraticBezierCurveTo.x += Math.random() * this.quadraticError - this.quadraticError / 2;
            quadraticBezierCurveTo.y += Math.random() * this.quadraticError - this.quadraticError / 2;
            this.quadraticBezierCurveToRemember[index] = quadraticBezierCurveTo;
          }
          
          let addToPath = 'Q' + ' ' + quadraticBezierCurveTo.x + ' ' + quadraticBezierCurveTo.y + ' ' + newPinPosition.x + ' ' + newPinPosition.y + ' ';
          this.path = this.path + addToPath;
        }
      }
    }
  }

  nextPin(pin: number) {
    if (pin == -1) {
      this.isAlgoRunning = false;
      this.initInstructions();
    }
    else {
      this.pinPath.push(pin);

      // Update visualization info
      let oldPinPosition = this.pins[this.pinPath[this.currentPin]];
      this.setToMax();
      let newPinPosition = this.pins[this.pinPath[this.currentPin]];
      this.totalLength += Math.sqrt(Vector2.distanceSquared(oldPinPosition, newPinPosition)) / 1000;
      this.nbArcs++;
    }
  }

  reset() {
    this.currentPin = 0;
    this.pinPath = [];
    this.quadraticBezierCurveToRemember = [];
    this.path = undefined;
    this.totalLength = 0;
    this.nbArcs = 0;
  }

  instructionString(instruction: string): string {
    if (instruction == undefined) return undefined;

    let returnValue = 'Clou n°';
    if (instruction.indexOf('a') != -1) returnValue = returnValue + instruction.replace('a', ' dans le sens anti-horaire');
    else if (instruction.indexOf('h') != -1) returnValue = returnValue + instruction.replace('h', ' dans le sens horaire');
    return returnValue;
  }

}

export enum LoomType {
  Circle,
  Rectangle
}
