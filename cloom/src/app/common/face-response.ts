import { Vector2 } from './vector2';

export class FaceResponse {
  faces: FaceInfo[];

  static copyFrom(original: FaceInfo[]): FaceResponse {
    let returnValue = new FaceResponse();

    returnValue.faces = [];

    for (let face of original) returnValue.faces.push(FaceInfo.copyFrom(face)); 

    return returnValue;
  }

  transformToUv(imageSize: Vector2) {
    for (let face of this.faces) face.transformToUv(imageSize);
  }
}

export class FaceInfo {

  faceId: string;
  faceLandmarks: FaceLandmarks;
  faceRectangle: FaceRectangle;

  static copyFrom(original: FaceInfo): FaceInfo {
    let returnValue = new FaceInfo();

    returnValue.faceId = original.faceId;
    returnValue.faceLandmarks = FaceLandmarks.copyFrom(original.faceLandmarks);
    returnValue.faceRectangle = FaceRectangle.copyFrom(original.faceRectangle);

    return returnValue;
  }

  transformToUv(imageSize: Vector2) {
    this.faceLandmarks.transformToUv(imageSize);
    this.faceRectangle.transformToUv(imageSize);
  }
}

export class FaceLandmarks { 
  eyeLeftBottom: Vector2;
  eyeLeftInner: Vector2;
  eyeLeftOuter: Vector2;
  eyeLeftTop: Vector2;
  eyeRightBottom: Vector2;
  eyeRightInner: Vector2;
  eyeRightOuter: Vector2;
  eyeRightTop: Vector2;
  eyebrowLeftInner: Vector2;
  eyebrowLeftOuter: Vector2;
  eyebrowRightInner: Vector2;
  eyebrowRightOuter: Vector2;
  mouthLeft: Vector2;
  mouthRight: Vector2;
  noseLeftAlarOutTip: Vector2;
  noseLeftAlarTop: Vector2;
  noseRightAlarOutTip: Vector2;
  noseRightAlarTop: Vector2;
  noseRootLeft: Vector2;
  noseRootRight: Vector2;
  noseTip: Vector2;
  pupilLeft: Vector2;
  pupilRight: Vector2;
  underLipBottom: Vector2;
  underLipTop: Vector2;
  upperLipBottom: Vector2;
  upperLipTop: Vector2;

  static copyFrom(original: FaceLandmarks): FaceLandmarks {
    let returnValue = new FaceLandmarks();

    returnValue.eyeLeftBottom = Vector2.clone(original.eyeLeftBottom);
    returnValue.eyeLeftInner = Vector2.clone(original.eyeLeftInner);
    returnValue.eyeLeftOuter = Vector2.clone(original.eyeLeftOuter);
    returnValue.eyeLeftTop = Vector2.clone(original.eyeLeftTop);
    returnValue.eyeRightBottom = Vector2.clone(original.eyeRightBottom);
    returnValue.eyeRightInner = Vector2.clone(original.eyeRightInner);
    returnValue.eyeRightOuter = Vector2.clone(original.eyeRightOuter);
    returnValue.eyeRightTop = Vector2.clone(original.eyeRightTop);
    returnValue.eyebrowLeftInner = Vector2.clone(original.eyebrowLeftInner);
    returnValue.eyebrowLeftOuter = Vector2.clone(original.eyebrowLeftOuter);
    returnValue.eyebrowRightInner = Vector2.clone(original.eyebrowRightInner);
    returnValue.eyebrowRightOuter = Vector2.clone(original.eyebrowRightOuter);
    returnValue.mouthLeft = Vector2.clone(original.mouthLeft);
    returnValue.mouthRight = Vector2.clone(original.mouthRight);
    returnValue.noseLeftAlarOutTip = Vector2.clone(original.noseLeftAlarOutTip);
    returnValue.noseLeftAlarTop = Vector2.clone(original.noseLeftAlarTop);
    returnValue.noseRightAlarOutTip = Vector2.clone(original.noseRightAlarOutTip);
    returnValue.noseRightAlarTop = Vector2.clone(original.noseRightAlarTop);
    returnValue.noseRootLeft = Vector2.clone(original.noseRootLeft);
    returnValue.noseRootRight = Vector2.clone(original.noseRootRight);
    returnValue.noseTip = Vector2.clone(original.noseTip);
    returnValue.pupilLeft = Vector2.clone(original.pupilLeft);
    returnValue.pupilRight = Vector2.clone(original.pupilRight);
    returnValue.underLipBottom = Vector2.clone(original.underLipBottom);
    returnValue.underLipTop = Vector2.clone(original.underLipTop);
    returnValue.upperLipBottom = Vector2.clone(original.upperLipBottom);
    returnValue.upperLipTop = Vector2.clone(original.upperLipTop);

    return returnValue;
  }

  transformToUv(imageSize: Vector2) {
    this.eyeLeftBottom = Vector2.divide(this.eyeLeftBottom, imageSize);
    this.eyeLeftInner = Vector2.divide(this.eyeLeftInner, imageSize);
    this.eyeLeftOuter = Vector2.divide(this.eyeLeftOuter, imageSize);
    this.eyeLeftTop = Vector2.divide(this.eyeLeftTop, imageSize);
    this.eyeRightBottom = Vector2.divide(this.eyeRightBottom, imageSize);
    this.eyeRightInner = Vector2.divide(this.eyeRightInner, imageSize);
    this.eyeRightOuter = Vector2.divide(this.eyeRightOuter, imageSize);
    this.eyeRightTop = Vector2.divide(this.eyeRightTop, imageSize);
    this.eyebrowLeftInner = Vector2.divide(this.eyebrowLeftInner, imageSize);
    this.eyebrowLeftOuter = Vector2.divide(this.eyebrowLeftOuter, imageSize);
    this.eyebrowRightInner = Vector2.divide(this.eyebrowRightInner, imageSize);
    this.eyebrowRightOuter = Vector2.divide(this.eyebrowRightOuter, imageSize);
    this.mouthLeft = Vector2.divide(this.mouthLeft, imageSize);
    this.mouthRight = Vector2.divide(this.mouthRight, imageSize);
    this.noseLeftAlarOutTip = Vector2.divide(this.noseLeftAlarOutTip, imageSize);
    this.noseLeftAlarTop = Vector2.divide(this.noseLeftAlarTop, imageSize);
    this.noseRightAlarOutTip = Vector2.divide(this.noseRightAlarOutTip, imageSize);
    this.noseRightAlarTop = Vector2.divide(this.noseRightAlarTop, imageSize);
    this.noseRootLeft = Vector2.divide(this.noseRootLeft, imageSize);
    this.noseRootRight = Vector2.divide(this.noseRootRight, imageSize);
    this.noseTip = Vector2.divide(this.noseTip, imageSize);
    this.pupilLeft = Vector2.divide(this.pupilLeft, imageSize);
    this.pupilRight = Vector2.divide(this.pupilRight, imageSize);
    this.underLipBottom = Vector2.divide(this.underLipBottom, imageSize);
    this.underLipTop = Vector2.divide(this.underLipTop, imageSize);
    this.upperLipBottom = Vector2.divide(this.upperLipBottom, imageSize);
    this.upperLipTop = Vector2.divide(this.upperLipTop, imageSize);
  }
}

export class FaceRectangle {
  left: number;
  top: number;
  width: number;
  height: number;

  static copyFrom(original: FaceRectangle): FaceRectangle {
    let returnValue = new FaceRectangle();

    returnValue.left = original.left;
    returnValue.top = original.top;
    returnValue.width = original.width;
    returnValue.height = original.height;
    
    return returnValue;
  }

  transformToUv(imageSize: Vector2) {
    this.left = this.left / imageSize.x;
    this.top = this.top / imageSize.y;
    this.width = this.width / imageSize.x;
    this.height = this.height / imageSize.y;
  }
}
