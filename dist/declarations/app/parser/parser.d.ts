export declare class Parser {
    private rawContent;
    constructor(rawContent: string);
    parse(): IDeclaration[];
    parseStructured(): any;
    private extractDeclarationsStructured;
    private extractDeclarations;
    private extractMapDeclarations;
    private parseSingleDeclaration;
    private checkIsSectionStart;
    private checkIsSectionEnd;
}
