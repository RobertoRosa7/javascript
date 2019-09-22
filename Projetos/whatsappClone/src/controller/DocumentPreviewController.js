// import lib PDF
const pdfLib = require('pdfjs-dist');
// import path
const path = require('path');
// execute Worker to monitoring - indicando caminho para worker funcionar com webpack
pdfLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');
export class DocumentPreviewController{
	constructor(file){
		this._file = file;
	}
	// get preview data
	getPreviewData(){
		// return promise - deve usar then() quando for chamado
		return new Promise((s, f)=>{
			// instancia de file reader
			let reader = new FileReader()
			switch(this._file.type){
				case 'image/png':
				case 'image/jpeg':
				case 'image/jpg':
				case 'image/gif':
					// instancia file reader to image
					reader.onload = e =>{
						s({
							// get info file
							src: reader.result,
							info: this._file.name
						});
					}
					reader.onerror = e =>{
						f(e);
					}
					reader.readAsDataURL(this._file);
					break;
				case 'application/pdf':
					reader.onload = e =>{
						// get document return promise, fazendo conversão
						// de array buffer para 8bit => Uint8Arra()
						// reader.result content o arquivo vindo do reader.readAsArrray...
						pdfLib.getDocument(new Uint8Array(reader.result)).then(pdf => {
							// verificação
							//console.log('pdf', pdf);
							// pegando página do pdf
							pdf.getPage(1).then(page =>{
								//verificando objeto page
								//console.log('page: ', page);
								// fazendo renderização da pagina passando numero page
								let viewport = page.getViewport(1);
								// criando área canvas para conter image pdf
								let canvas = document.createElement('canvas');
								// necessário contexto 2D ou 3D
								let canvasContext = canvas.getContext('2d');
								// definindo tamanho de altura e largura
								canvas.width = viewport.width;
								canvas.height = viewport.height;
								// objeto para fazer a renderização
								page.render({
									canvasContext,
									viewport
								}).then(() =>{
									// exibindo uma página ou mais
									let _s = (pdf.numPages > 1) ? 's' : '';
									// retornando o resolve da promessa
									s({
										src: canvas.toDataURL('image/png'),
										info: `${pdf.numPages} página${_s}`
									})
								}).catch(err =>{
									f(err);
								});
							}).catch(err =>{
								f(err);
							});
						}).catch(err =>{
							f(err);
						});
					}
					// conversão do arquivo para um ArrayBuffer
					reader.readAsArrayBuffer(this._file);
					break;
				default:
					f();
			}
		});
	}
}