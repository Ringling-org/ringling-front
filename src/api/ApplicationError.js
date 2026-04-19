export class ApplicationError extends Error {
    constructor(message, code, status = null, errors = [], raw = null) {
        super(message || 'ApplicationError');
        this.name = 'ApplicationError';
        this.status = status;
        this.code = code;
        this.errors = Array.isArray(errors) ? errors : [];
        this.raw = raw;
    }
}
