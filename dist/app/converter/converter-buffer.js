"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterBuffer = void 0;
const converter_1 = require("./converter");
const Types = {
    STRUCTURED: 'structured',
    ARRAY: 'array'
};
class ConverterBuffer extends converter_1.Converter {
    constructor(inputBuffers, options) {
        super(options);
        this.inputBuffers = inputBuffers;
    }
    getData() {
        if (this.options && this.options.type === Types.ARRAY) {
            return Promise.resolve(this.getArray());
        }
        else {
            return Promise.resolve(this.getStructured());
        }
    }
    getContent() {
        let contents = this.inputBuffers.map((buffer) => buffer.toString());
        return contents.join('\n');
    }
}
exports.ConverterBuffer = ConverterBuffer;
//# sourceMappingURL=converter-buffer.js.map