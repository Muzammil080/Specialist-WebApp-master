import { Injectable } from '@angular/core';
// import * as tf from '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
// import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';
// import * as bodyPix from '@tensorflow-models/body-pix';
// import { ImageType, BodyPixInternalResolution, BodyPixArchitecture, BodyPixOutputStride, BodyPixMultiplier, BodyPixQuantBytes } from '@tensorflow-models/body-pix/dist/types';

// @Injectable({
// //   providedIn: 'root'
// })
export class VideoEffectsService {

    private MODE_BLUR = 1;
    private currentMode = this.MODE_BLUR;
    private tempcanvas = undefined;
    public canvas = undefined;
    // private net: bodyPix.BodyPix;
    private video = null;

    private FRAME_WIDTH = 640;
    private FRAME_HEIGHT =  480;

    private props:{
    //   architecture: BodyPixArchitecture,
    //   outputStride: BodyPixOutputStride,
    //   internalResolution: BodyPixInternalResolution,
    //   multiplier: BodyPixMultiplier,
    //   quantBytes: BodyPixQuantBytes,
      flipHorizontal: boolean,
      algorithm:string,
      backgroundBlurAmount: number,
      maskBlurAmount: number,
      edgeBlurAmount: number,
      segmentationThreshold: number,
      maxDetections: number,
      scoreThreshold: number,
      nmsRadius: number
      pixelFactor: number,
    } = {
        // architecture: 'MobileNetV1',
    //   outputStride: 16,
    //   internalResolution: 'medium',
    //   multiplier: 0.75,
    //   quantBytes: 2,
      flipHorizontal: false,
      algorithm: 'person',
      backgroundBlurAmount: 0,
      maskBlurAmount: 0,
      edgeBlurAmount: 20,
      segmentationThreshold: 0.7,
      maxDetections: 1,
      scoreThreshold: 0.3,
      nmsRadius: 20,
      pixelFactor: 0.05,
  };
      constructor() {
        this.bindPage();
      }

      async  bindPage() {
        this.canvas = document.createElement("canvas");
        this.tempcanvas = document.createElement("canvas");

        // Load the BodyPix model weights with architecture 0.75
        // this.net = await bodyPix.load({
        //   architecture: this.props.architecture,
        //   outputStride: this.props.outputStride,
        //   multiplier: this.props.multiplier,
        //   quantBytes: this.props.quantBytes
        // });
        await this.loadVideo(null);
        this.segmentBodyInRealTime();


      }
       changeBlurAmount(toggleBlurBool : boolean){
           if(toggleBlurBool){
            this.props.backgroundBlurAmount = 20;
           }else{
            this.props.backgroundBlurAmount = 0;
           }

      }
       segmentBodyInRealTime() {
        // since images are being fed from a webcam
        async function bodySegmentationFrame() {
          if(this.currentMode == this.MODE_BLUR){
              const multiPersonSegmentation = await this.estimateSegmentation(this.video);
            //   bodyPix.drawBokehEffect(
            //           this.canvas, this.video, multiPersonSegmentation,
            //           this.props.backgroundBlurAmount,
            //           this.props.edgeBlurAmount, this.props.flipHorizontal);
          }

          requestAnimationFrame(()=>{bodySegmentationFrame.bind(this)()});
        }

        bodySegmentationFrame.bind(this)();
      }

      async estimateSegmentation(image) {
          let multiPersonSegmentation = null;

        //   return await this.net.segmentPerson(image, {
        //       internalResolution: this.props.internalResolution,
        //       segmentationThreshold: this.props.segmentationThreshold,
        //       maxDetections: this.props.maxDetections,
        //       scoreThreshold: this.props.scoreThreshold,
        //       nmsRadius: this.props.nmsRadius,
        //   });
      }

      async getVideoInputs() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log('enumerateDevices() not supported.');
          return [];
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        return videoDevices;
      }

      async  getDeviceIdForLabel(cameraLabel) {
        const videoInputs = await this.getVideoInputs();

        for (let i = 0; i < videoInputs.length; i++) {
          const videoInput = videoInputs[i];
          if (videoInput.label === cameraLabel) {
            return videoInput.deviceId;
          }
        }

        return null;
      }

      async  getConstraints(cameraLabel) {
        let deviceId;
        let facingMode;

        if (cameraLabel) {
          deviceId = await this.getDeviceIdForLabel(cameraLabel);
          // on mobile, use the facing mode based on the camera.
          facingMode = this.isMobile() ? "user" : null;
        };
        return {deviceId, facingMode,width: {exact: this.FRAME_WIDTH}, height: {exact: this.FRAME_HEIGHT}};
      }

       isAndroid() {
        return /Android/i.test(navigator.userAgent);
      }

       isiOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
      }

       isMobile() {
        return this.isAndroid() || this.isiOS();
      }

     stopExistingVideoCapture() {
        if (this.video && this.video.srcObject) {
          this.video.srcObject.getTracks().forEach(track => {
            track.stop();
          })
          this.video.srcObject = null;
        }
      }

      async setupCamera(cameraLabel) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        const videoElement = document.createElement('video');

        this.stopExistingVideoCapture();

        const videoConstraints = await this.getConstraints(cameraLabel);

        const stream = await navigator.mediaDevices.getUserMedia(
            {'audio': false, 'video': videoConstraints});
        videoElement.srcObject = stream;

        return new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            videoElement.width = this.FRAME_WIDTH;
            videoElement.height = this.FRAME_HEIGHT;
            this.tempcanvas.width = this.FRAME_WIDTH;
            this.canvas.width = this.FRAME_WIDTH;
            this.tempcanvas.height = this.FRAME_HEIGHT;
            this.canvas.height = this.FRAME_HEIGHT;
            console.log(this.canvas.width+":"+this.canvas.height);
            resolve(videoElement);
          };
        });
      }

      async loadVideo(cameraLabel) {
        try {
          this.video = await this.setupCamera(cameraLabel);
        } catch (e) {
          alert("Error in Load Video");
        }

        this.video.play();
      }


}
