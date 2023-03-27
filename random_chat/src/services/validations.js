import Format from '../utils/format';
import Errors from '../services/errors';

export default class Validation {
    constructor() {
        this.isValid = {
            valid: false,
            description: '',
            code: '',
            result: [],
        };
        this.units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB'];
    }

    validationsFiles(files) {
        if (!files) return this.isValid;

        if (files.length > 0 && files.length < 10) {
            let total = 0;

            [...files].forEach((file) => {
                total += file.size;
            });

            if (Format.formatBytes(total) == '50 MB') {
                this.updateIsValid(false, 'Somente 50MB permitido', '002', [null]);
                this.setThrowError(
                    '002',
                    'Ultrapassou limite de carregamento de 50MB',
                    'validations'
                );
            } else {
                let s = files.length > 1 ? 's' : '';
                this.updateIsValid(true, `Arquivo carregado${s}`, '200', files);
            }
        } else {
            this.updateIsValid(false, 'Somente 5 arquivos permitidos', '001', [null]);
            this.setThrowError('001', 'Nenhum arquivo carregado', 'validations');
        }
        return this.isValid;
    }

    updateIsValid(valid, text, code, result) {
        this.isValid['valid'] = valid;
        this.isValid['description'] = text;
        this.isValid['code'] = code;
        this.isValid['result'] = result;
    }

    setThrowError(code, message, source) {
        Errors.throwErrors({ code, message, source, id: Format.createUid() });
    }
}
