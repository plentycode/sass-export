"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MIXIN_VALUES_REGEX = /@mixin ?((?!\d)[\w_-][\w\d_-]*)(\([^\)"]+.)?/gi;
const FUNC_VALUES_REGEX = /@function ?((?!\d)[\w_-][\w\d_-]*)(\([^\)"]+.)?/gi;
const MIXIN_DECLARATION_REGEX = '@mixin.[^\{]+|@function.[^\{]+';
class Mixins {
    constructor(rawContent) {
        this.rawContent = rawContent;
    }
    parse() {
        let matches = this.extractDeclarations(this.rawContent);
        let declarations = [];
        matches.forEach((match) => {
            let mixins = this.parseSingle(match);
            let functions = this.parseSingle(match, true);
            if (mixins) {
                declarations.push(mixins);
            }
            if (functions) {
                declarations.push(functions);
            }
        });
        return declarations;
    }
    extractDeclarations(content) {
        let matches = content.match(new RegExp(MIXIN_DECLARATION_REGEX, 'gi'));
        if (!matches) {
            return [];
        }
        return matches;
    }
    parseSingle(declaration, checkFunctions = false) {
        let regex = checkFunctions ? FUNC_VALUES_REGEX : MIXIN_VALUES_REGEX;
        let matches = (new RegExp(regex, 'gi')).exec(declaration);
        if (!matches) {
            return null;
        }
        let name = matches[1].trim();
        let parameters = [];
        if (matches.length > 2 && matches[2]) {
            let params = matches[2].split(',').map((param) => param.trim().replace(/[\(\)]/g, ''));
            parameters.push(...params);
        }
        return { name, parameters };
    }
}
exports.Mixins = Mixins;
//# sourceMappingURL=mixins.js.map