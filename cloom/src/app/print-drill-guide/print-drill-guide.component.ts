import { Component, OnInit } from '@angular/core';
import { Vector2 } from '../common/vector2';

@Component({
  selector: 'app-print-drill-guide',
  templateUrl: './print-drill-guide.component.html',
  styleUrls: ['./print-drill-guide.component.css']
})
export class PrintDrillGuideComponent implements OnInit {

  constructor() { }

  nbPins: number = 200;
  loomDiameter: number = 800;
  rimWidth: number = 20;

  boxPaths: string[];
  boxFills: string[];
  nailCenters: Vector2[];
  textPositions: Vector2[];
  textValues: string[];

  ngOnInit(): void {

    this.boxPaths = [];
    this.boxFills = [];
    this.nailCenters = [];
    this.textPositions = [];
    this.textValues = [];

    let innerRim = this.loomDiameter / 2 - this.rimWidth;
    let outerRim = this.loomDiameter / 2;
    let centerRim = this.loomDiameter / 2 - this.rimWidth / 2;
    let textRim = this.loomDiameter / 2 - this.rimWidth * 0.2;

    for (let i = 0; i < this.nbPins; i++) {

      let currentAngle = i * Math.PI * 2 / this.nbPins;
      let nextAngle = (i+1) * Math.PI * 2 / this.nbPins;
      let halfAngle = (i+0.5) * Math.PI * 2 / this.nbPins;
      let b1 = new Vector2(Math.cos(currentAngle) * innerRim, Math.sin(currentAngle) * innerRim);
      let b2 = new Vector2(Math.cos(currentAngle) * outerRim, Math.sin(currentAngle) * outerRim);
      let b3 = new Vector2(Math.cos(nextAngle) * outerRim, Math.sin(nextAngle) * outerRim);
      let b4 = new Vector2(Math.cos(nextAngle) * innerRim, Math.sin(nextAngle) * innerRim);

      if ((i+1) % 10 == 0) this.boxFills[i] = '#dcffdc';
      else if ((i+1) % 5 == 0) this.boxFills[i] = '#ffdcdc';
      else this.boxFills[i] = 'none';

      let path = 'M' + b1.x + ',' + b1.y + ' L' + b2.x + ',' + b2.y + ' L' + b3.x + ',' + b3.y + ' L' + b4.x + ',' + b4.y + 'z';
      this.boxPaths.push(path);

      let nailCenter = new Vector2(Math.cos(halfAngle) * centerRim, Math.sin(halfAngle) * centerRim);
      this.nailCenters.push(nailCenter);

      let textPosition = new Vector2(Math.cos(halfAngle) * textRim - (6.182/2), Math.sin(halfAngle) * textRim + (2.623/2));
      this.textPositions.push(textPosition);
      this.textValues.push(this.pad(i+1, 3, '0'));
    }

  }

  pad(num: number, padlen: number, padchar: string) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
  }

}
