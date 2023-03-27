export default class CameraController {
    constructor(cameraElement) {
        this.camera = cameraElement;
        this.streaming;

        // ACTIVE CAMERA
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                // MODELO ANTIGO
                // this.camera.src = URL.createObjectURL(stream);

                this.streaming = stream;
                // MODELO ATUAL
                this.camera.srcObject = new MediaStream(stream);
                this.camera.play();
            })
            .catch((err) => console.error(err));
    }

    stopRecording() {
        this.streaming.getTracks().forEach((track) => track.stop());
    }

    takePicture(mimeType = 'image/png') {
        const canvas = document.createElement('canvas');

        canvas.setAttribute('height', this.camera.videoHeight);
        canvas.setAttribute('width', this.camera.videoWidth);

        const context = canvas.getContext('2d');

        context.drawImage(this.camera, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }
}
