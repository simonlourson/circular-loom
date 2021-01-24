import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Application, BaseRenderTexture, Container, Graphics, RenderTexture, SCALE_MODES, Sprite, Texture, utils as Pixiutils } from 'pixi.js-legacy';
import { LoomType, LoomTypeWithLabel } from 'src/app/common/saved-loom';
import { LoomVectorInfo } from 'src/app/common/loom-vector-info';
import { Vector2 } from 'src/app/common/vector2';
import { AlgoMinimumError, OptionsMinimumError } from 'src/app/common/algo-minimum-error';
import { LoomHelperComponent } from '../loom-helper/loom-helper.component';
import { ILoom } from 'src/app/common/loom/i-loom';
import { LoomCircle } from 'src/app/common/loom/loom-circle';
import { LoomRectangle } from 'src/app/common/loom/loom-rectangle';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  canvasSize: Vector2 = new Vector2(500, 500);
  referenceSize: Vector2 = new Vector2(200, 200);

  // Colors for algorithm
  referenceData: number[];
  errorWeightData: number[];

  // UI models
  // Image zoom slider
  currentZoom: number = 0;
  realZoom: number;

  // Thread contrast slider
  currentBrightness: number = 14;

  // Loom types dropdown
  loomTypes: LoomTypeWithLabel[] = [
    {loomType: LoomType.Circle, loomLabel: "Cerceau"},
    {loomType: LoomType.Rectangle, loomLabel: "Carré"}
  ];
  selectedLoomType: LoomTypeWithLabel = this.loomTypes[0];
  get isLoomTypeCircular(): boolean { return this.selectedLoomType.loomType == LoomType.Circle; }
  get isLoomTypeSquare(): boolean { return this.selectedLoomType.loomType == LoomType.Rectangle; }

  // Number of nails dropdown
  numberOfNails: NumberOfNails[] = [
    {value: 200, label: "200"}
  ];
  selectedNumberOfNails = this.numberOfNails[0];
;
  // Circular loom sizes dropdown
  diameterSizes: LoomSize[] = [
    {size: 780, rimWidth: 20, label: "80cm", pointFile: "c780.json"},
    {size: 680, rimWidth: 20, label: "70cm", pointFile: "c680.json"},
    {size: 580, rimWidth: 20, label: "60cm", pointFile: "c580.json"}
  ];
  selectedDiameter: any = this.diameterSizes[0];

  // Square loom sizes dropdown
  squareSizes: LoomSize[] = [
    {size: 475, rimWidth: 23, label: "50cm", pointFile: "s475.json"},
  ];
  selectedSquareSize: any = this.squareSizes[0];

  // Thread color dropdown
  threadColors: ColorWithLabel[] = [
    {color:"#000000", colorName:"Noir"},
    {color:"#4B4C4E", colorName:"Anthracite"},
    {color:"#D7D6D1", colorName:"Écru"},
    {color:"#FFFFFF", colorName:"Blanc"},
    {color:"#246344", colorName:"Vert Herbe"},
    {color:"#A6D273", colorName:"Vert Pomme"},
    {color:"#374F8F", colorName:"Bleu Roi"},
    {color:"#D7EAFB", colorName:"Bleu Clair"},
    {color:"#1A78AE", colorName:"Turquoise"},
    {color:"#C5B39D", colorName:"Beige Clair"},
    {color:"#D8BB99", colorName:"Beige"},
    {color:"#8A745F", colorName:"Beige Foncé"},
    {color:"#534032", colorName:"Marron Foncé"},
    {color:"#B51813", colorName:"Rouge"},
    {color:"#5A3585", colorName:"Lilas"},
    {color:"#FC773C", colorName:"Orange"},
    {color:"#E64C7E", colorName:"Rose Vif"},
    {color:"#FACDE1", colorName:"Rose"},
    {color:"#F9CCAF", colorName:"Abricot"}
  ];
  selectedThreadColor: ColorWithLabel = this.threadColors[0];

  // Getters for the loomHelper component
  get loomCommonSize(): LoomSize {
    if (this.selectedLoomType.loomType == LoomType.Circle) return this.selectedDiameter;
    if (this.selectedLoomType.loomType == LoomType.Rectangle) return this.selectedSquareSize;
  }


  @ViewChild('previewcanvas', {static: true}) canvasRef: ElementRef;
  @ViewChild('loomHelper', {static: false}) loomHelper: LoomHelperComponent;

  pixiApp: PIXI.Application;

  image: HTMLImageElement;

  graphics: Graphics;
  dragOverHelper: Sprite;
  imageSprite: Sprite;

  constructor() { }

  ngOnInit(): void {
    this.initPixi();
  }

  clickUpload() {
    let fileElem = document.getElementById("pictureUploader") as HTMLInputElement;
    fileElem.click();
  }

  showImage: boolean = true;
  clickSwitch() {
    this.showImage = !this.showImage;
  }

  upload() {
    let fileElem = document.getElementById("pictureUploader") as HTMLInputElement;
    if (fileElem.files.length > 0) {
      this.readImageFile(fileElem.files[0]);
    }
    fileElem.value = '';
  }

  imageScale: number;
  loadImage() {
    let texture = Texture.from(this.image);

    if (this.imageSprite != undefined) {
      this.pixiApp.stage.removeChild(this.imageSprite)
      this.imageSprite.destroy({
        children: true,
        texture: true,
        baseTexture: true
      });
    }
    

    this.imageSprite = Sprite.from(texture);
    if (this.imageSprite.width > this.canvasSize.x) {
      let ratio = this.imageSprite.width / this.canvasSize.x;
      this.imageSprite.width /= ratio;
      this.imageSprite.height /= ratio;
    }
    if (this.imageSprite.height > this.canvasSize.y) {
      let ratio = this.imageSprite.height / this.canvasSize.y;
      this.imageSprite.width /= ratio;
      this.imageSprite.height /= ratio;
    }

    this.imageScale = this.imageSprite.scale.x;

    this.imageSprite.interactive = true;
    this.imageSprite.buttonMode = true;
    this.imageSprite
      .on('pointerdown', this.onDragStart.bind(this))
      .on('pointerup', this.onDragEnd.bind(this))
      .on('pointerupoutside', this.onDragEnd.bind(this))
      .on('pointermove', this.onDragMove.bind(this));

    this.pixiApp.stage.addChild(this.imageSprite);
    this.pixiApp.stage.sortChildren();
  }

  dragOverHandler(event: any) {
    this.dragOverHelper.visible = true;
    return false
  }

  dragLeaveHandler(event: any) {
    this.dragOverHelper.visible = false;
    return false;
  }

  dropHandler(event: any) {

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          //console.log('... file[' + i + '].name = ' + file.name);
          this.readImageFile(file);
        }
      }
    } 
    else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        //console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        this.readImageFile(event.dataTransfer.files[i]);
      }
    }

    this.dragOverHelper.visible = false;
    return false;
  }

  
  uploadedImageBuffer: ArrayBuffer;
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
      let datauri = 'data:' + file.type + ';base64,' + window.btoa(binary);

      
      this.image = new Image();
      this.image.onload = this.loadImage.bind(this);
      this.image.src = datauri;
      
    };

    reader.readAsArrayBuffer(file);
  }

  changeZoom() {

    this.realZoom = this.currentZoom;
    if (this.realZoom < 0) {
      this.realZoom = -1 * this.realZoom;
      this.realZoom = this.realZoom / 3;
      this.realZoom = this.realZoom * 2;
      this.realZoom = this.realZoom + 1;
      this.realZoom = 1 / this.realZoom;
    }
    else {
      this.realZoom = this.realZoom / 3;
      this.realZoom = this.realZoom * 2;
      this.realZoom = 1 + this.realZoom;
    }

    if (this.imageSprite != undefined) {
      this.imageSprite.scale.x = this.imageScale * this.realZoom;
      this.imageSprite.scale.y = this.imageScale * this.realZoom;
    }

    this.updateReferenceImage();
  }

  updateReferenceImage() {

  }

  changeLoomType() {
    if (this.selectedLoomType.loomType == LoomType.Circle) this.changeDiameter();
    if (this.selectedLoomType.loomType == LoomType.Rectangle) this.changeSquareSize();
  }

  changeDiameter() {
    this.drawCircularLoom(this.selectedDiameter.size, this.selectedDiameter.rimWidth, this.canvasSize.x, 0);
  }

  changeSquareSize() {
    this.drawSquareLoom(this.selectedSquareSize.size, this.selectedSquareSize.rimWidth, this.canvasSize.x, 0);
  }

  initPixi() {
    let htmlCanvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    let options: any = {};
    options.view =  htmlCanvas;
    options.width = this.canvasSize.x;
    options.height = this.canvasSize.y;
    options.backgroundColor = 0xffffff;
    options.antialias = true;
    
    Pixiutils.skipHello();
    this.pixiApp = new Application(options);

    let dragOverHelperTexture = Texture.from('/assets/drag_over_helper.png');
    dragOverHelperTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    this.dragOverHelper = new Sprite(dragOverHelperTexture);
    this.dragOverHelper.anchor.set(0);
    this.dragOverHelper.zIndex = 99;
    this.dragOverHelper.x = 0;
    this.dragOverHelper.y = 0;
    this.dragOverHelper.visible = false;
    this.pixiApp.stage.addChild(this.dragOverHelper);

    this.graphics = new Graphics();
    this.graphics.zIndex = 2;

    this.changeDiameter();
    
    this.pixiApp.stage.addChild(this.graphics);

  }

  drawCircularLoom(outerDiameterInCm: number, rimWidthInCm: number, canvasSizeInPixels: number, canvasPaddingInPixels: number) {
    let outerRimInPixels = canvasSizeInPixels - 2*canvasPaddingInPixels;
    let pixelsPerCm = outerRimInPixels / outerDiameterInCm;
    let rimWidthInPixels = rimWidthInCm * pixelsPerCm;
    let diameterInPixels = outerRimInPixels - rimWidthInPixels;

    this.graphics.clear();
    this.graphics.lineStyle(rimWidthInPixels, 0xA98C6B);
    this.graphics.beginFill(0x000000, 0);
    this.graphics.drawCircle(canvasSizeInPixels / 2, canvasSizeInPixels / 2, diameterInPixels / 2);
    this.graphics.endFill();
  }

  drawSquareLoom(outerDiameterInCm: number, rimWidthInCm: number, canvasSizeInPixels: number, canvasPaddingInPixels: number) {
    let outerRimInPixels = canvasSizeInPixels - 2*canvasPaddingInPixels;
    let pixelsPerCm = outerRimInPixels / outerDiameterInCm;
    let rimWidthInPixels = rimWidthInCm * pixelsPerCm;

    this.graphics.clear();
    this.graphics.lineStyle(rimWidthInPixels, 0xA98C6B);
    this.graphics.beginFill(0x000000, 0);
    this.graphics.drawRect(rimWidthInPixels / 2, rimWidthInPixels / 2, outerRimInPixels - rimWidthInPixels, outerRimInPixels - rimWidthInPixels);
    this.graphics.endFill();
  }

  runAlgorithm() {
    // First, create a container which is just our canvas, but with only the picture, not the loom frame
    let containerWithoutFrame = new Container();

    // Shallow clone our picture sprite
    let imageSpriteClone = Sprite.from(this.imageSprite.texture);
    imageSpriteClone.pivot = this.imageSprite.pivot;
    imageSpriteClone.position = this.imageSprite.position;
    imageSpriteClone.scale = this.imageSprite.scale;
    containerWithoutFrame.addChild(imageSpriteClone);

    // Render our containerWithoutFrame to a texture
    let brtWithoutFrame = new BaseRenderTexture({width: this.canvasSize.x, height: this.canvasSize.y, scaleMode: SCALE_MODES.LINEAR});
    let rtWithoutFrame = new RenderTexture(brtWithoutFrame);
    this.pixiApp.renderer.render(containerWithoutFrame, rtWithoutFrame, false);

    // This container is used to resize rtWithoutFrame to our reference size
    let containerReference = new Container();
    let imageReference = Sprite.from(rtWithoutFrame);
    imageReference.width = this.referenceSize.x;
    imageReference.height = this.referenceSize.y;
    containerReference.addChild(imageReference);

    let fullImageData = this.pixiApp.renderer.extract.pixels(containerReference);
    console.log(fullImageData);

    //let loomVectorInfo = new LoomVectorInfo(this.selectedNumberOfNails.value, this.selectedLoomType.loomType, this.loomCommonSize.size, this.loomCommonSize.rimWidth, Vector2.clone(this.referenceSize));
    let loom: ILoom;
    if (this.selectedLoomType.loomType == LoomType.Circle) loom = new LoomCircle(
      this.selectedNumberOfNails.value, 
      this.loomCommonSize.rimWidth, 
      this.referenceSize, 
      this.loomCommonSize.size / 2,
      25 
    );
    else if (this.selectedLoomType.loomType == LoomType.Rectangle) loom = new LoomRectangle(
      this.selectedNumberOfNails.value,
      this.loomCommonSize.rimWidth,
      this.referenceSize,
      new Vector2(this.loomCommonSize.size, this.loomCommonSize.size)
    );

    // Step one : convert image to greyscale and update the reference array for the algorithm
    this.referenceData = [];
    let index = 0;
    for (let y = 0; y < this.referenceSize.y; y++) {
      for (let x = 0; x < this.referenceSize.x; x++) {
        let indexR = index; index++;
        let indexG = index; index++;
        let indexB = index; index++;
        let indexA = index; index++;
        let r = fullImageData[indexR];
        let g = fullImageData[indexG];
        let b = fullImageData[indexB];
        let a = fullImageData[indexA];
        let greyscale = 0.21*r + 0.72*g + 0.07*b;

        fullImageData[indexR] = greyscale;
        fullImageData[indexG] = 0;//greyscale;
        fullImageData[indexB] = 0;//greyscale;

        //this.referenceData.push(255 - greyscale);
        this.referenceData.push(255 - r);
      }
    }

    // We use the green channel to update the error correction array for the algorithm
    this.errorWeightData = [];
    index = 0;
    for (let y = 0; y < this.referenceSize.y; y++) {
      for (let x = 0; x < this.referenceSize.x; x++) {
        let indexR = index; index++;
        let indexG = index; index++;
        let indexB = index; index++;
        let indexA = index; index++;
        this.errorWeightData.push(fullImageData[indexG]);
      }
    }
    console.log(this.referenceData);
    let optionsMinimumError: OptionsMinimumError = {
      loom: loom,
      threadContrast: this.currentBrightness,
      referenceSize: this.referenceSize.x,
      referenceData: this.referenceData,
      errorWeightData: this.errorWeightData
    }

    this.loomHelper.reset();
    this.loomHelper.pins = loom.pins;
    this.loomHelper.isAlgoRunning = true;

    let algoMinimumError = new AlgoMinimumError();
    algoMinimumError.setParams(optionsMinimumError);
    algoMinimumError.runAlgo(this.nextPin.bind(this));

    /*
    // This is the reference picture should we ever need it
    let brtReference = new BaseRenderTexture({width: this.referenceSize.x, height: this.referenceSize.y, scaleMode: SCALE_MODES.LINEAR});
    let rtReference = new RenderTexture(brtReference);
    this.pixiApp.renderer.render(containerReference, rtReference, false);

    this.pixiApp.renderer.extract.canvas(rtReference).toBlob((blob) => { 
      this.addBlob(blob, 'test.png');
    }); 
    */
  }

  nextPin(pin: number) {

    this.loomHelper.nextPin(pin);

  }

  addBlob(blob: Blob, filename: string)
  {
    let a = document.createElement('a');
    document.body.append(a);
    a.download = filename;
    a.href = URL.createObjectURL(blob);
    a.click();
    a.remove();        
  }

  dragData: any;
  dragging: boolean;
  onDragStart(event) {
    this.dragging = true;
    this.dragData = event.data;
    this.imageSprite.alpha = 0.5;

    // Set the new pivot to where the user clicked
    let dragStartPosition = this.dragData.getLocalPosition(this.imageSprite);
    this.imageSprite.pivot.x = dragStartPosition.x;
    this.imageSprite.pivot.y = dragStartPosition.y;

    // "move" the sprite so that it doesn't move when we change the pivot
    let newPosition = this.dragData.getLocalPosition(this.imageSprite.parent);
    this.imageSprite.x = newPosition.x;
    this.imageSprite.y = newPosition.y;
  }

  onDragEnd() {
    this.dragging = false;
    this.dragData = null;
    this.imageSprite.alpha = 1;
  }

  onDragMove() {
    if (this.dragging) {
        let newPosition = this.dragData.getLocalPosition(this.imageSprite.parent);
        this.imageSprite.x = newPosition.x;
        this.imageSprite.y = newPosition.y;
        this.updateReferenceImage();
    }
  }

}

interface ColorWithLabel {
  color: string;
  colorName: string;
}

interface NumberOfNails {
  value: number;
  label: string;
}

interface LoomSize {
  size: number; 
  rimWidth: number;
  label: string; 
  pointFile: string;
  pointData?: any
}