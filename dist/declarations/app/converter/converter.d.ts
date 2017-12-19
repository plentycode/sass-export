export declare class Converter {
    options: IOptions;
    constructor(options?: IOptions);
    getArray(): IDeclaration[];
    getStructured(): any;
    compileStructure(structuredDeclaration: IDeclaration): object;
    getContent(): string;
    private checkForMixins(structuredDeclaration);
    private renderPropertyValue(content, declaration);
}
