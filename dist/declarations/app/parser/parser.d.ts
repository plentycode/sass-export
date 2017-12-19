export declare class Parser {
    private rawContent;
    constructor(rawContent: string);
    parse(): IDeclaration[];
    parseStructured(): any;
    private extractDeclarationsStructured(content);
    private extractDeclarations(content);
    private extractMapDeclarations(content);
    private parseSingleDecaration(matchDeclaration);
    private checkIsSectionStart(content);
    private checkIsSectionEnd(content);
}
