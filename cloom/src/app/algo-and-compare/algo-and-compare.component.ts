import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, ApplicationRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vector2 } from '../common/vector2';
import { FaceResponse, FaceInfo } from '../common/face-response';
import { AlgoHelpers } from '../common/algo-base';
import { OptionsDarkestLine, AlgoDarkestLine } from '../common/algo-darkest-line'
import { OptionsMinimumError, AlgoMinimumError } from '../common/algo-minimum-error'
import { LoomHelperComponent } from '../loom-helper/loom-helper.component';

@Component({
  selector: 'app-algo-and-compare',
  templateUrl: './algo-and-compare.component.html',
  styleUrls: ['./algo-and-compare.component.css']
})
export class AlgoAndCompareComponent implements OnInit {

  image: HTMLImageElement;
  @ViewChild('compareCanvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('referenceCanvas', {static: true}) referenceCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('loomHelper', {static: true}) loomHelper: LoomHelperComponent;
  viewingCanvasSize: Vector2 = new Vector2(500, 500);

  // We save the binary buffer for any uploaded image, because we might need to send it to the faces api
  uploadedImageBuffer: ArrayBuffer;

  // Object containing the face detection info
  faceResponse: FaceResponse;

  // Reframing info
  faceFrameStart: Vector2;
  faceFrameSize: Vector2;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }
  
  ngOnInit(): void {

    this.image = new Image();
    this.image.onload = this.loadImage.bind(this);
    this.image.src = '/assets/deep.png';
  }

  loadImage() {
    // Reset face info
    this.faceFrameStart = undefined;
    this.faceFrameSize = undefined;
    this.faceResponse = undefined;

    // Update the canvas we show to the user, as well as the reference canvas for the aglorithm
    this.updateCanvas();
    this.updateReferenceCanvas();
  }

  clickUpload() {
    let fileElem = document.getElementById("pictureUploader") as HTMLInputElement;
    fileElem.click();
  }

  datauri: string = undefined;
  upload() {
    let fileElem = document.getElementById("pictureUploader") as HTMLInputElement;
    if (fileElem.files.length > 0) {
      this.readImageFile(fileElem.files[0]);
    }
    fileElem.value = '';
  }

  readImageFile(file: File) {
    let reader = new FileReader();
    reader.onloadend = () => { 

      // We update the binary buffer that will be sent to the faces API
      this.uploadedImageBuffer = reader.result as ArrayBuffer;

      // We use the binary buffer to create a base64 uri to display the image.
      let binary = '';
      let bytes = new Uint8Array(this.uploadedImageBuffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++)
        binary += String.fromCharCode(bytes[i]);
      this.datauri = 'data:' + file.type + ';base64,' + window.btoa(binary);

      this.image.src = this.datauri;
    };

    reader.readAsArrayBuffer(file);
  }

  handleNextFaces(response: any) {
    this.faceResponse = FaceResponse.copyFrom(response as FaceInfo[]);
    this.faceResponse.transformToUv(new Vector2(this.image.width, this.image.height));
    
    this.updateCanvas();
    this.updateReferenceCanvas();

    // Save the face info to json 
    /*
    let a = document.createElement('a');
    document.body.append(a);
    a.download = 'homelander.json';
    a.href = URL.createObjectURL(new Blob([JSON.stringify(response)], {}));
    a.click();
    a.remove();
    */
  }

  updateFacePolygons() {
    let ctx = this.canvas.nativeElement.getContext('2d');
    if (this.faceResponse != undefined) {
      for (let face of this.faceResponse.faces) {
        this.drawPolygon([face.faceLandmarks.eyeLeftOuter, face.faceLandmarks.eyeLeftTop, face.faceLandmarks.eyeLeftInner, face.faceLandmarks.eyeLeftBottom], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPolygon([face.faceLandmarks.eyeRightOuter, face.faceLandmarks.eyeRightTop, face.faceLandmarks.eyeRightInner, face.faceLandmarks.eyeRightBottom], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPolygon([face.faceLandmarks.noseRootLeft, face.faceLandmarks.noseRootRight, face.faceLandmarks.noseRightAlarOutTip, face.faceLandmarks.noseLeftAlarOutTip], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPolygon([face.faceLandmarks.mouthLeft, face.faceLandmarks.upperLipTop, face.faceLandmarks.mouthRight, face.faceLandmarks.underLipBottom], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPolygon([face.faceLandmarks.eyebrowLeftInner, face.faceLandmarks.eyebrowLeftOuter], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPolygon([face.faceLandmarks.eyebrowRightInner, face.faceLandmarks.eyebrowRightOuter], this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeLeftOuter, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeLeftInner, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeLeftTop, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeLeftBottom, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeRightOuter, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeRightInner, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeRightTop, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyeRightBottom, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.mouthLeft, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.mouthRight, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.upperLipTop, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.underLipBottom, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.noseRootLeft, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.noseRootRight, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.noseLeftAlarOutTip, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.noseRightAlarOutTip, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyebrowLeftInner, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyebrowLeftOuter, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyebrowRightInner, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
        this.drawPoint(face.faceLandmarks.eyebrowRightOuter, this.viewingCanvasSize.x, this.viewingCanvasSize.y, ctx);
      }
    }
  }

  updateFacePolygonsReference() {
    let referenceCtx = this.referenceCanvas.nativeElement.getContext('2d');
    referenceCtx.globalCompositeOperation = 'lighter';
    referenceCtx.lineCap = 'round';

    if (this.faceResponse != undefined) {
      for (let face of this.faceResponse.faces) {
        this.fillPolygon([face.faceLandmarks.eyeLeftOuter, face.faceLandmarks.eyeLeftTop, face.faceLandmarks.eyeLeftInner, face.faceLandmarks.eyeLeftBottom], this.referenceImageSize, this.referenceImageSize, referenceCtx)
        this.fillPolygon([face.faceLandmarks.eyeRightOuter, face.faceLandmarks.eyeRightTop, face.faceLandmarks.eyeRightInner, face.faceLandmarks.eyeRightBottom], this.referenceImageSize, this.referenceImageSize, referenceCtx)
        this.fillPolygon([face.faceLandmarks.noseRootLeft, face.faceLandmarks.noseRootRight, face.faceLandmarks.noseRightAlarOutTip, face.faceLandmarks.noseLeftAlarOutTip], this.referenceImageSize, this.referenceImageSize, referenceCtx)
        this.fillPolygon([face.faceLandmarks.mouthLeft, face.faceLandmarks.upperLipTop, face.faceLandmarks.mouthRight, face.faceLandmarks.underLipBottom], this.referenceImageSize, this.referenceImageSize, referenceCtx)
        this.fillPolygon([face.faceLandmarks.eyebrowLeftInner, face.faceLandmarks.eyebrowLeftOuter], this.referenceImageSize, this.referenceImageSize, referenceCtx);
        this.fillPolygon([face.faceLandmarks.eyebrowRightInner, face.faceLandmarks.eyebrowRightOuter], this.referenceImageSize, this.referenceImageSize, referenceCtx);
      }
    }
    
  }

  updateCanvas() {
    this.canvas.nativeElement.width = this.viewingCanvasSize.x;
    this.canvas.nativeElement.height = this.viewingCanvasSize.y;
    let ctx = this.canvas.nativeElement.getContext('2d');

    if (this.faceFrameStart == undefined || this.faceFrameSize == undefined) {
      ctx.drawImage(this.image, 0, 0, this.viewingCanvasSize.x, this.viewingCanvasSize.y);
    }
    else {
      ctx.drawImage(this.image, this.faceFrameStart.x, this.faceFrameStart.y, this.faceFrameSize.x, this.faceFrameSize.y, 0, 0, this.viewingCanvasSize.x, this.viewingCanvasSize.y);
    }

    this.updateFacePolygons();
  }

  updateReferenceCanvas() {
    // Resize the reference canvas
    this.referenceCanvas.nativeElement.width = this.referenceImageSize;
    this.referenceCanvas.nativeElement.height = this.referenceImageSize;
    let referenceCtx = this.referenceCanvas.nativeElement.getContext('2d');

    // Draw the whole image, or the reframed image
    referenceCtx.globalCompositeOperation = 'source-over';
    if (this.faceFrameStart == undefined || this.faceFrameSize == undefined)
      referenceCtx.drawImage(this.image, 0, 0, this.referenceImageSize, this.referenceImageSize);
    else
      referenceCtx.drawImage(this.image, this.faceFrameStart.x, this.faceFrameStart.y, this.faceFrameSize.x, this.faceFrameSize.y, 0, 0, this.referenceImageSize, this.referenceImageSize);

    // Get an array containing the colors for the image or the reframed image
    let fullImageData = referenceCtx.getImageData(0, 0, this.referenceImageSize, this.referenceImageSize);
    let index = 0;

    // Step one : convert image to greyscale and update the reference array for the algorithm
    this.referenceData = [];
    for (let y = 0; y < this.referenceImageSize; y++) {
      for (let x = 0; x < this.referenceImageSize; x++) {
        let indexR = index; index++;
        let indexG = index; index++;
        let indexB = index; index++;
        let indexA = index; index++;
        let r = fullImageData.data[indexR];
        let g = fullImageData.data[indexG];
        let b = fullImageData.data[indexB];
        let a = fullImageData.data[indexA];
        let greyscale = 0.21*r + 0.72*g + 0.07*b;

        fullImageData.data[indexR] = greyscale;
        fullImageData.data[indexG] = 0;//greyscale;
        fullImageData.data[indexB] = 0;//greyscale;

        //this.referenceData.push(255 - greyscale);
        this.referenceData.push(255 - r);
      }
    }

    // After this point only the red channel is containing the greyscale data
    //referenceCtx.putImageData(fullImageData, 0, 0);

    // We draw the error correcting polygons, using additive blending and the green channel
    this.updateFacePolygonsReference();

    // We use the green channel to update the error correction array for the algorithm
    this.errorWeightData = [];
    fullImageData = referenceCtx.getImageData(0, 0, this.referenceImageSize, this.referenceImageSize);
    index = 0;
    for (let y = 0; y < this.referenceImageSize; y++) {
      for (let x = 0; x < this.referenceImageSize; x++) {
        let indexR = index; index++;
        let indexG = index; index++;
        let indexB = index; index++;
        let indexA = index; index++;
        this.errorWeightData.push(fullImageData.data[indexG]);
      }
    }
  }
  

  loomDiameter:number = 800;
  loomRimWidth: number = 25;
  referenceImageSize: number = 200;
  nbPins: number = 200;

  referenceData: number[];
  errorWeightData: number[];

  minimumError() {
    let pinReferenceCenter = new Vector2(this.referenceImageSize / 2, this.referenceImageSize / 2);
    let pinRadius = this.loomDiameter / 2 - this.loomRimWidth / 2;
    let pinReferenceRadius = pinRadius * this.referenceImageSize / this.loomDiameter;
    let pinsReference = AlgoHelpers.generatePinPositions(this.nbPins, pinReferenceCenter, pinReferenceRadius);
    let optionsMinimumError: OptionsMinimumError = {
      pins: pinsReference,
      minDistanceBetweenPins: 25,
      threadContrast: 13,
      referenceSize: this.referenceImageSize,
      referenceData: this.referenceData,
      errorWeightData: this.errorWeightData
    }

    this.loomHelper.reset();
    
    this.loomHelper.isAlgoRunning = true;

    let algoMinimumError = new AlgoMinimumError();
    algoMinimumError.setParams(optionsMinimumError);
    algoMinimumError.runAlgo(this.nextPin.bind(this));
  }

  uvToImage(v: Vector2, width: number, height: number): Vector2 {
    if (this.faceFrameStart == undefined || this.faceFrameSize == undefined) {
      return new Vector2(v.x * width, v.y * height);
    }
    else {
      let returnValue = new Vector2(v.x * this.image.width, v.y * this.image.height);
      returnValue.x -= this.faceFrameStart.x;
      returnValue.y -= this.faceFrameStart.y;
      returnValue.x = returnValue.x * width / this.faceFrameSize.x;
      returnValue.y = returnValue.y * height / this.faceFrameSize.y;
      return returnValue;
    }
  }

  drawPoint(uv: Vector2, width: number, height: number, ctx: CanvasRenderingContext2D) {

    if (uv == undefined) return;

    let center = this.uvToImage(uv, width, height);
    var radius = 5;

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#009900';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
  }

  drawPolygon(uv: Vector2[], width: number, height: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    for (let index = 0; index < uv.length - 1; index++) {
      if (uv[index] != undefined && uv[index+1] != undefined) {
        let start = this.uvToImage(uv[index], width, height);
        let end = this.uvToImage(uv[index+1], width, height);
        if (index == 0) ctx.moveTo(start.x, start.y);
        
        ctx.lineTo(end.x,end.y);
      }
    }
    ctx.closePath();
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
    
    ctx.closePath();
  }

  fillPolygon(uv: Vector2[], width: number, height: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    for (let index = 0; index < uv.length - 1; index++) {
      if (uv[index] != undefined && uv[index+1] != undefined) {
        let start = this.uvToImage(uv[index], width, height);
        let end = this.uvToImage(uv[index+1], width, height);
        if (index == 0) ctx.moveTo(start.x, start.y);
        
        ctx.lineTo(end.x,end.y);
      }
    }
    ctx.closePath();
    
    ctx.fillStyle = '#00ff00';
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
    
    ctx.closePath();
  }

  faceRecognition() {
    // If the uploadedImageBuffer is not null, we sent it to the backend which will contact the Azure Faces API
    if (this.uploadedImageBuffer != undefined) {
      this.http.post('/face/', this.uploadedImageBuffer, { headers: { 'content-type': 'application/octet-stream' }}).subscribe({
        next: this.handleNextFaces.bind(this),
        error(msg) {
          console.log('Error contacting the faces api: ', msg);
        }
      });
    }
    // If the uploadedImageBuffer is null, we assume the default image is still displayed, and we fetch the saved face info
    else {
      this.http.get('/assets/deep.json').subscribe({
        next: this.handleNextFaces.bind(this),
        error(msg) {
          console.log('Error contacting the faces api: ', msg);
        }
      });
    }
  }

  downloadJson() {
    let a = document.createElement('a');
    document.body.append(a);
    a.download = 'arc order.json';
    a.href = URL.createObjectURL(new Blob([JSON.stringify({pinPath: this.loomHelper.pinPath})], {}));
    a.click();
    a.remove();
  }

  reframe() {
    if (this.faceResponse == undefined || this.faceResponse.faces.length < 1) throw new Error('cannnot reframe without face recognition info');

    this.faceFrameStart = new Vector2(this.faceResponse.faces[0].faceRectangle.left * this.image.width, this.faceResponse.faces[0].faceRectangle.top * this.image.height);
    this.faceFrameSize = new Vector2(this.faceResponse.faces[0].faceRectangle.width * this.image.width, this.faceResponse.faces[0].faceRectangle.height * this.image.height);

    let center = Vector2.add(this.faceFrameStart, Vector2.scale(this.faceFrameSize, 0.5));
    let radius = Vector2.distance(center, this.faceFrameStart);

    this.faceFrameStart = new Vector2(center.x - radius, center.y - radius);
    this.faceFrameSize = new Vector2(radius * 2, radius * 2);

    if (this.faceFrameStart.x < 0 ) this.faceFrameStart.x = 0;
    if (this.faceFrameStart.y < 0 ) this.faceFrameStart.y = 0;
    if (this.faceFrameStart.x + this.faceFrameSize.x > this.image.width) this.faceFrameSize.x = this.image.width - this.faceFrameStart.x;
    if (this.faceFrameStart.y + this.faceFrameSize.y > this.image.height) this.faceFrameSize.y = this.image.height - this.faceFrameStart.y;

    this.updateCanvas();
    this.updateReferenceCanvas();
  }

  nextPin(pin: number) {

    this.loomHelper.nextPin(pin);

    /*
    let oldPinPosition = this.pins[this.currentPin];
    this.currentPin = pin;
    let newPinPosition = this.pins[this.currentPin];
    if (this.path == undefined) {
      this.path = 'M';
      this.path = this.path + newPinPosition.x + ' ' + newPinPosition.y + ' ';
    }
    else {

      this.totalLength += Math.sqrt(Vector2.distanceSquared(oldPinPosition, newPinPosition)) / 1000;
      this.nbArcs++;

      let quadraticBezierCurveTo = Vector2.average(oldPinPosition, newPinPosition);
      quadraticBezierCurveTo.x += Math.random() * this.quadraticError - this.quadraticError / 2;
      quadraticBezierCurveTo.y += Math.random() * this.quadraticError - this.quadraticError / 2;
      let addToPath = 'Q' + ' ' + quadraticBezierCurveTo.x + ' ' + quadraticBezierCurveTo.y + ' ' + newPinPosition.x + ' ' + newPinPosition.y + ' ';
      this.path = this.path + addToPath;
    }
    */
  }
}
