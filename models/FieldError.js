class FieldError {
    constructor(name, message) {
        this.fieldName = name;
        this.fieldMessage = message;
    }
}

module.exports = FieldError;