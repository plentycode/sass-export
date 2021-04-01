/// <reference types="node" />
import { Converter } from './converter';
export declare class ConverterBuffer extends Converter {
    private inputBuffers;
    constructor(inputBuffers: Buffer[], options?: IOptions);
    getData(): Promise<any>;
    getContent(): string;
}
