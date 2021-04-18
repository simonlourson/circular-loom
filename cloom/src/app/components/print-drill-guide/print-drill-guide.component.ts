import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoomType } from 'src/app/common/saved-loom';
import { Vector2 } from '../../common/vector2';

@Component({
  selector: 'app-print-drill-guide',
  templateUrl: './print-drill-guide.component.html',
  styleUrls: ['./print-drill-guide.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PrintDrillGuideComponent implements OnInit {

  constructor() { }

  // Circle
  nbPins: number = 200;
  loomDiameter: number = 700;
  rimWidth: number = 20;

  //nbPins: number = 200;
  //loomDiameter: number = 600;
  //rimWidth: number = 20;

  boxPaths: string[];
  boxFills: string[];
  nailCenters: Vector2[];
  textPositions: Vector2[];
  textValues: string[];
  loomType: LoomType = LoomType.Circle;

  top: number = undefined;
  bottom: number = undefined;
  left: number = undefined;
  right: number = undefined;
  //[attr.viewBox]="viewbox"
  get viewbox() { return Math.floor(this.left) + " " + Math.floor(this.top) + " " + Math.floor(this.right - this.left) + " " + Math.floor(this.bottom - this.top); }

  @ViewChild('svgPaths') svgPaths: ElementRef;

  ngOnInit(): void {

    this.boxPaths = [];
    this.boxFills = [];
    this.nailCenters = [];
    this.textPositions = [];
    this.textValues = [];

    if (this.loomType == LoomType.Circle) {
      let innerRim = this.loomDiameter / 2 - this.rimWidth;
      let outerRim = this.loomDiameter / 2;
      let centerRim = this.loomDiameter / 2 - this.rimWidth / 2;
      let textRim = this.loomDiameter / 2 - this.rimWidth * 0.23;

      for (let i = 0; i < this.nbPins; i++) {

        let currentAngle = i * Math.PI * 2 / this.nbPins;
        let nextAngle = (i+1) * Math.PI * 2 / this.nbPins;
        let halfAngle = (i+0.5) * Math.PI * 2 / this.nbPins;
        let boxCorners: Vector2[] = [];
        boxCorners[0] = new Vector2(Math.cos(currentAngle) * innerRim, Math.sin(currentAngle) * innerRim);
        boxCorners[1] = new Vector2(Math.cos(currentAngle) * outerRim, Math.sin(currentAngle) * outerRim);
        boxCorners[2] = new Vector2(Math.cos(nextAngle) * outerRim, Math.sin(nextAngle) * outerRim);
        boxCorners[3] = new Vector2(Math.cos(nextAngle) * innerRim, Math.sin(nextAngle) * innerRim);

        for (let i: number = 0; i < 4; i++) {
          if (this.left == undefined || boxCorners[i].x < this.left) this.left = boxCorners[i].x;
          if (this.right == undefined || boxCorners[i].x > this.right) this.right = boxCorners[i].x;
          if (this.top == undefined || boxCorners[i].y < this.top) this.top = boxCorners[i].y;
          if (this.bottom == undefined || boxCorners[i].y > this.bottom) this.bottom = boxCorners[i].y;
        }

        if ((i+1) % 10 == 0) this.boxFills[i] = '#dcffdc';
        else if ((i+1) % 5 == 0) this.boxFills[i] = '#ffdcdc';
        else this.boxFills[i] = 'none';

        let path = 'M' + boxCorners[0].x + ',' + boxCorners[0].y + ' L' + boxCorners[1].x + ',' + boxCorners[1].y + ' L' + boxCorners[2].x + ',' + boxCorners[2].y + ' L' + boxCorners[3].x + ',' + boxCorners[3].y + 'z';
        this.boxPaths.push(path);

        let nailCenter = new Vector2(Math.cos(halfAngle) * centerRim, Math.sin(halfAngle) * centerRim);
        this.nailCenters.push(nailCenter);

        let textPosition = new Vector2(Math.cos(halfAngle) * textRim - (6.182/2), Math.sin(halfAngle) * textRim + (2.623/2));
        this.textPositions.push(textPosition);
        this.textValues.push(this.pad(i+1, 3, '0'));
      }
    }
    else if (this.loomType == LoomType.Rectangle) {
      //let totalLength = 1450;
      let totalLength = 450+22+22;
      let rimWidth = 22;
      let nbPins = 51;
      //let nbPinsForLength = 49 * 3 + 1 + 1 + 1 + 1;
      let nbPinsForLength = 51;
      let distanceBetweenNails = (totalLength - rimWidth / 2 - rimWidth / 2) / (nbPinsForLength - 1);
      //let distanceBetweenNails = 475 / (nbPinsForLength - 1);
      //let delta = new Vector2(distanceBetweenNails, 0);
      let delta = new Vector2(0, distanceBetweenNails);

      for (let i = 0; i < nbPinsForLength; i++) {
        let nailCenter = Vector2.scale(delta, i);
        //nailCenter = Vector2.add(nailCenter, new Vector2(0, 20))
        //nailCenter = Vector2.add(nailCenter, new Vector2(20, 20))
        this.nailCenters.push(nailCenter);

        let boxCorners: Vector2[] = [];
        
        /*
        boxCorners[0] = Vector2.add(nailCenter, new Vector2(delta.x * -0.5, 1 * +rimWidth / 2)); 
        boxCorners[1] = Vector2.add(nailCenter, new Vector2(delta.x * -0.5, 0 * -rimWidth / 2));
        boxCorners[2] = Vector2.add(nailCenter, new Vector2(delta.x * +0.5, 0 * -rimWidth / 2));
        boxCorners[3] = Vector2.add(nailCenter, new Vector2(delta.x * +0.5, 1 * +rimWidth / 2));
        */

        
        boxCorners[0] = Vector2.add(nailCenter, new Vector2(1 * -rimWidth / 2, delta.y * -0.5)); 
        boxCorners[1] = Vector2.add(nailCenter, new Vector2(0 * +rimWidth / 2, delta.y * -0.5));
        boxCorners[2] = Vector2.add(nailCenter, new Vector2(0 * +rimWidth / 2, delta.y * +0.5));
        boxCorners[3] = Vector2.add(nailCenter, new Vector2(1 * -rimWidth / 2, delta.y * +0.5));
        

        let topNumber = i+1;
        let bottomNumber = 151-i;
        let rightNumber = 51+i
        let leftNumber = 201-i

        if (leftNumber % 10 == 0) this.boxFills[i] = '#ffdcdc';
        else if (leftNumber % 5 == 0) this.boxFills[i] = '#dcffdc';
        else this.boxFills[i] = 'none';

        //this.boxFills[i] = 'none';

        let path = 'M' + boxCorners[0].x + ',' + boxCorners[0].y + ' L' + boxCorners[1].x + ',' + boxCorners[1].y + ' L' + boxCorners[2].x + ',' + boxCorners[2].y + ' L' + boxCorners[3].x + ',' + boxCorners[3].y + 'z';
        this.boxPaths.push(path);

        let textPosition = Vector2.add(nailCenter, new Vector2(-rimWidth / 4, 0));
        //let textPosition = Vector2.add(nailCenter, new Vector2(0, +rimWidth / 4));
        textPosition = Vector2.add(textPosition, new Vector2(-6.182/2, 2.623/2));
        this.textPositions.push(textPosition);

        
        this.textValues.push(this.pad(leftNumber, 3, '0'));
      }
    }
  }

  clickDownload() {

    //let testAws = ["N329SEdSRe5Uv/sUSzHkNQ==;4fs5zmmaplnfd2kddxqwmg6c3il7dva6gqhyzof2bq7tm3klbukq/g5632schkjc64vf77mkewmpegu", "Lbdv3qn/iH7PpumsTm5SbA==;4fs5zmmaplnfd2kddxqwmg6c3il7dva6gqhyzof2bq7tm3klbukq/fw3w7xvj76eh5t5g5gwe43ssnq", "y8kAnLPAJgxxGvL9Ur993A==;4fs5zmmaplnfd2kddxqwmg6c3il7dva6gqhyzof2bq7tm3klbukq/zpeqbhftyatay4i26l6vfp353q"];
    //console.log(JSON.stringify(testAws));

    let test = this.svgPaths.nativeElement.innerHTML;

    let a = document.createElement('a');
    document.body.append(a);
    a.download = 'print.svg';
    a.href = URL.createObjectURL(new Blob([test], {}));
    a.click();
    a.remove();
  }

  pad(num: number, padlen: number, padchar: string) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
  }

}
