import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Application, Graphics, SCALE_MODES, Sprite, Texture, TextureUvs, utils as Pixiutils } from 'pixi.js-legacy';
import { LoomType, LoomTypeWithLabel } from 'src/app/common/saved-loom';
import { Vector2 } from 'src/app/common/vector2';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  canvasSize: Vector2 = new Vector2(500, 500);

  // UI models
  loomTypes: LoomTypeWithLabel[] = [
    {loomType: LoomType.Circle, loomLabel: "Cerceau"},
    {loomType: LoomType.Rectangle, loomLabel: "Carré"}
  ];
  selectedLoomType: LoomTypeWithLabel = this.loomTypes[0];
  diameterSizes: any[] = [
    {size: 80, rimWidth: 2, label: "80cm"},
    {size: 70, rimWidth: 2, label: "70cm"},
    {size: 60, rimWidth: 2, label: "60cm"}
  ];
  selectedDiameter: any = this.diameterSizes[0];

  currentZoom: number = 0;

  @ViewChild('previewcanvas', {static: true}) 
  canvasRef: ElementRef;

  pixiApp: PIXI.Application;

  image: HTMLImageElement;

  graphics: Graphics;
  dragOverHelper: Sprite;
  imageSprite: Sprite;

  constructor() { }

  ngOnInit(): void {
    this.initPixi();
  }

  imageScale: number;
  loadImage() {
    console.log('loadImage');
    let texture = Texture.from(this.image);
    //this.bunny.texture = texture;

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
    console.log(this.imageScale)

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
    console.log('File(s) in drop zone');
    this.dragOverHelper.visible = true;
    return false
  }

  dragLeaveHandler(event: any) {
    this.dragOverHelper.visible = false;
    return false;
  }

  dropHandler(event: any) {
    console.log('File(s) dropped');
    console.log(event);

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile();
          console.log('... file[' + i + '].name = ' + file.name);
          console.log(file)
          this.readImageFile(file);
        }
      }
    } 
    else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
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

    let realZoom = this.currentZoom;
    if (realZoom < 0) {
      realZoom = -1 * realZoom;
      realZoom = realZoom / 3;
      realZoom = realZoom * 2;
      realZoom = realZoom + 1;
      realZoom = 1 / realZoom;
    }
    else {
      realZoom = realZoom / 3;
      realZoom = realZoom * 2;
      realZoom = 1 + realZoom;
    }

    console.log(realZoom)
    this.imageSprite.scale.x = this.imageScale * realZoom;
    this.imageSprite.scale.y = this.imageScale * realZoom;
  }

  changeDiameter() {
    this.drawCircularLoom(this.selectedDiameter.size, this.selectedDiameter.rimWidth, this.canvasSize.x, 0);
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
    console.log(this.pixiApp.screen.width)

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
    
    console.log(diameterInPixels);
    this.graphics.drawCircle(canvasSizeInPixels / 2, canvasSizeInPixels / 2, diameterInPixels / 2);
    this.graphics.endFill();
  }
  
  uploadImage() {

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
    }
  }

}
