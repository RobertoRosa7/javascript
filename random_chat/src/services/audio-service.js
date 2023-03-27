import Snackbar from './snackbar-service';
import CreateEvent from '../utils/createEvents';

export default class AudioService extends CreateEvent {
    constructor() {
        super();
        // this.snackbarService = new Snackbar(snackbarConfig);
        this.reader = new FileReader();
        this.isAvailable = false;
        this.mimeType = 'audio/webm';
        this.activeAudio();
    }
    async activeAudio() {
        try {
            this.streaming = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            if (this.streaming) this.isAvailable = true;
            // let audio = new Audio();
            // audio.srcObject = new MediaStream(this.streaming);
            // audio.play();
            // this.trigger('ready', audio);
            this.trigger('ready', this.streaming);
        } catch (e) {
            console.error(e);
            this.snackbarService.callNotification(
                'offline',
                'Não foi possível gravar seu audio',
                '&times;'
            );
        }
    }
    stopAudio() {
        this.streaming.getTracks().forEach((track) => track.stop());
    }
    startAudioRecorder() {
        if (this.available()) {
            this.recording = new MediaRecorder(this.streaming, {
                mimeType: this.mimeType,
            });
            this.chunks = [];
            this.recording.addEventListener('dataavailable', (e) =>
                e.data.size > 0 ? this.chunks.push(e.data) : []
            );

            this.recording.addEventListener('stop', (e) => {
                const blob = new Blob(this.chunks, { type: this.mimeType });
                const filename = `audio${Date.now()}.webm`;
                const file = new File([blob], filename, {
                    type: this.mimeType,
                    lastModified: Date.now(),
                });
                this.audioListening(file);
            });

            this.recording.start();
            this.startTimer();
        }
    }
    stopAudioRecorder() {
        if (this.available()) {
            this.recording.stop();
            this.stopAudio();
            this.stopTimer();
        }
    }
    available() {
        return this.isAvailable;
    }
    audioListening(audio) {
        this.reader.onload = (e) => {
            const audio = new Audio(this.reader.result);
            audio.play();
        };
        this.reader.readAsDataURL(audio);
    }
    startTimer() {
        let start = Date.now();
        this.recordMicroInterval = setInterval(
            () => this.trigger('startTimer', Date.now() - start),
            100
        );
    }
    stopTimer() {
        clearInterval(this.recordMicroInterval);
    }
}
