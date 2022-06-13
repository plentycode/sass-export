export declare class Utils {
    static getDeclarationByName(declarations: IDeclaration[], name: string): IDeclaration;
    static wrapCss(cssDeclaration: IDeclaration, useInspect: boolean): string;
    static removeDoubleQuotes(wrappedContent: string): string;
    static unWrapValue(wrappedContent: string): string;
}
