"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WRAPPER_CSS_ID = '#sass-export-id';
const UNWRAPPER_PATTERN = `${WRAPPER_CSS_ID}\\.(.+)\\s*\\{\\s*content:\\s*["'](.+)["']`;
class Utils {
    static getDeclarationByName(declarations = [], name) {
        let filtered = declarations.filter((declaration) => declaration.name === name);
        return filtered[0];
    }
    static wrapCss(cssDeclaration) {
        return `${WRAPPER_CSS_ID}.${cssDeclaration.name}{content:"#{${cssDeclaration.value}}";}`;
    }
    static unWrapValue(wrappedContent) {
        wrappedContent = wrappedContent.replace(/\n/g, '');
        let matches = wrappedContent.match(UNWRAPPER_PATTERN);
        if (matches && matches.length > 2) {
            return matches[2].trim();
        }
        else {
            return '';
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map