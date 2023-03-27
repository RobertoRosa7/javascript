import Format from '../utils/format';
const path = require('path');
const ModulePdf = require('pdfjs-dist');

ModulePdf.GlobalWorkerOptions.workerSrc = path.resolve(
    __dirname,
    '../../dist/pdf.worker.bundle.js'
);

export default class DocumentService {
    constructor(files) {
        this.files = files;
    }

    fetchPreviewFile() {
        return new Promise((resolve, reject) => {
            const files = [];
            // const reader = new FileReader();

            [...this.files].forEach((file, index) => {
                var reader = new FileReader();

                switch (file.type) {
                    case 'image/png':
                    case 'image/jpg':
                    case 'image/jpeg':
                    case 'image/gif':
                        reader.onload = (e) =>
                            files.push({ src: reader.result, info: file, id: Format.createUid() });
                        reader.onerror = (e) => reject(e);
                        reader.readAsDataURL(file);
                        break;
                    case 'application/pdf':
                        reader.onload = async (e) => {
                            try {
                                const pdf = await ModulePdf.getDocument(
                                    new Uint8Array(reader.result)
                                ).promise;
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 1 });
                                const canvas = document.createElement('canvas');
                                const canvasContext = canvas.getContext('2d');

                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                await page.render({ canvasContext, viewport }).promise;
                                files.push({
                                    src: canvas.toDataURL('image/png'),
                                    info: file,
                                    pages: pdf.numPages,
                                    id: Format.createUid(),
                                });
                            } catch (e) {
                                reject(e);
                            }
                        };
                        reader.onerror = (e) => reject(e);
                        reader.readAsArrayBuffer(file);
                        break;
                    case 'application/json':
                        break;
                    case 'application/zip':
                        break;
                    case 'text/css':
                    case 'text/markdown':
                    case 'text/plain':
                    case 'text/html':
                        files.push({ info: file, id: Format.createUid() });
                        break;
                    default:
                        reject();
                }
            });
            resolve(files);
        });
    }
}
