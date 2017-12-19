export declare class Mixins {
    private rawContent;
    constructor(rawContent: string);
    parse(): any[];
    private extractDeclarations(content);
    private parseSingle(declaration, checkFunctions?);
}
