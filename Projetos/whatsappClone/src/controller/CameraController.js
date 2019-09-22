export class CameraController{
	constructor(videoEl){
		// atribuindo id do container para passar vídeo
		this._videoEl = videoEl;
		// permissão de para mídia - retorna promise
		/*
		* Suport Browsers: 
		* IE8 => getUserMedia
		* Chrome => webkitGetUserMedia
		*/
		navigator.mediaDevices.getUserMedia({
			video: true
		}).then(stream =>{
			this._stream = stream;
			// fonte do video - criar arquivos do tipo binário
			this._videoEl.srcObject = stream;
			//this._videoEl.src = URL.createObjectURL(stream) // não funcionou
			// exibir na tela o que está passando no stream
			this._videoEl.play();
		}).catch(err =>{
			console.error(err);
		});
	}
	stop(){
		this._stream.getTracks().forEach(track =>{
			track.stop();
		});
	}
	// take a picture
	takePicture(mimeType = 'image/png'){
		// create area canvas
		let canvas = document.createElement('canvas');
		// set height and width
		canvas.setAttribute('height', this._videoEl.videoHeight);
		canvas.setAttribute('width', this._videoEl.videoWidth);
		// set context 2D or 3D
		let context = canvas.getContext('2d');
		// set area to draw
		context.drawImage(this._videoEl, 0, 0, canvas.height, canvas.width);
		// return encode URL more mimeType
		return canvas.toDataURL(mimeType);
	}
}