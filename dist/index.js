"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./app/converter");
let sassExporter = (options) => {
    return new converter_1.Converter(options);
};
let bufferExporter = (input, options) => {
    let converter = new converter_1.ConverterBuffer(input, options);
    return converter.getData();
};
module.exports = {
    exporter: sassExporter,
    buffer: bufferExporter
};
//# sourceMappingURL=index.js.map