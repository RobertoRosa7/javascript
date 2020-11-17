// modulo para encontrar aquivos
const path = require('path');

// modulo para processamento do webpack
module.exports = {
	// primeiro arquivo a ser procurado para empacotamento de todos os js
	// converter entry em objeto para usar workder - recurso do pdfjs-dist
	entry: {
		// (app e pdf.worker) - devem ir para index.html
		app:'./src/app.js',
		'pdf.worker':'pdfjs-dist/build/pdf.worker.entry.js'
	},
	// arquivo de processamento dos dados
	output: {
		// aquivo compilado de todos js
		// novo nome para bundle porque há dois arquivos de saída agora [name].bundle.js
		filename:'[name].bundle.js',
		// informar o caminho onde está bundle.js
		// substituir resolve por join devido ao novo arquivo pdf.worker e remover a barra do dist
		path: path.join(__dirname, 'dist'),
		// pasta pública de distribuição
		publicPath:'dist'
	}
}