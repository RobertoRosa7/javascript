import { ClassEvent } from "../utils/ClassEvent";

export class PhoneController extends ClassEvent{
    constructor(){
    super();
    // verificar se está disponível para gravação de áudio
    this._available = false;
    // mimeType - tipo de extensão de áudio
    this._mimeType = 'audio/webm';
    // recurso e media - video e audio
    navigator.mediaDevices.getUserMedia({
        audio:true
    }).then(stream =>{
        this._available = true;
        this._stream = stream;
        /*
        let audio = new Audio();
        audio.srcObject = stream;
        audio.play();
        */
        this.trigger('ready', this._stream);
    }).catch(err =>{
        console.error(err);
      });
    }
    // verificar se está disponível
    isAvailable(){
        return this._available;
    }
    // para faixa de audio
    stop(){
        this._stream.getTracks().forEach(track =>{
            track.stop();
        });
    }
    // inicar gravação de áudio
    startRecorder(){
        if(this.isAvailable()){
            // Media Record params: audio e objeto
            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType:this._mimeType
            });
            // array para guardar gravações
            this._recorderChunks = [];
            // evento de ficar escutando os dados 
            this._mediaRecorder.addEventListener('dataavailable', e =>{
                // verificando se houve recebimento de dados e adicionando no array
                if(e.data.size > 0) this._recorderChunks.push(e.data);
            });
            // evento de ficar escutando quando parar de receber dados
            this._mediaRecorder.addEventListener('stop', e =>{
                // Blob - manipulação de binários
                let blob = new Blob(this._recorderChunks,{
                    type:this._mimeType
                });
                // dando nome ao arquivo recém criado
                let filename = `rec${Date.now()}.webm`;
                // audio context API de audio do browser para imprimir audio size
                let audioContext = new AudioContext();
                // converter para array buffer quando for carregado
                let reader = new FileReader();
                reader.onload = e =>{
                    audioContext.decodeAudioData(reader.result).then(decode =>{
                        let file = new File([blob], filename,{
                            type:this._mimeType,
                            lastModified:Date.now()
                        });
                        // passando para evento trigger que fica na espera de eventos
                        this.trigger('recorded', file, decode);
                    });
                }
                reader.readAsArrayBuffer(blob);
                
                // arquivo pronto
                //console.log('file:', file);

                // ouvindo o arquivo com file reader
                /*
                let reader = new FileReader();
                reader.onload = e =>{
                    let audio = new Audio(reader.result);
                    audio.play();
                }
                reader.readAsDataURL(file);
                */
            });
            this._mediaRecorder.start();
            this.startTimer();
        }
    }
    // para gravação de audio
    stopRecorder(){
        if(this.isAvailable()){
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
        }
    }
    // record microphone timer
	startTimer(){
		let start = Date.now();
		this._recordMicrophoneInterval = setInterval(()=>{
            this.trigger('recordTimer', (Date.now() - start));
		}, 100);
    }
    stopTimer(){
		clearInterval(this._recordMicrophoneInterval);
    }
}