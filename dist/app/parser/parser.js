"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const VARIABLE_PATERN = '(?!\\d)[\\w_-][\\w\\d_-]*';
const VALUE_PATERN = '[^;]+|"(?:[^"]+|(?:\\\\"|[^"])*)"';
const DECLARATION_PATTERN = `\\$['"]?(${VARIABLE_PATERN})['"]?\\s*:\\s*(${VALUE_PATERN})(?:\\s*!(global|default)\\s*;|\\s*;(?![^\\{]*\\}))`;
const MAP_DECLARATIOM_REGEX = /['"]?((?!\d)[\w_-][\w\d_-]*)['"]?\s*:\s*([a-z\-]+\([^\)]+\)|[^\),\/]+)/gi;
const QUOTES_PATTERN = /^(['"]).*\1$/;
const QUOTES_REPLACE = /^(['"])|(['"])$/g;
const SECTION_TAG = 'sass-export-section';
const SECTION_PATTERN = `(@${SECTION_TAG}=)(".+")`;
const END_SECTION_PATTERN = `(@end-${SECTION_TAG})`;
const DEFAULT_SECTION = 'variables';
class Parser {
    constructor(rawContent) {
        this.rawContent = rawContent;
    }
    parse() {
        let matches = this.extractDeclarations(this.rawContent);
        let declarations = [];
        for (let match of matches) {
            if (!this.checkIsSectionStart(match) && !this.checkIsSectionStart(match)) {
                let parsed = this.parseSingleDeclaration(match);
                if (parsed) {
                    let map = this.extractMapDeclarations(parsed.value);
                    if (map.length) {
                        parsed.mapValue = map.map((declaration) => this.parseSingleDeclaration(`$${declaration};`));
                    }
                    declarations.push(parsed);
                }
            }
        }
        return declarations;
    }
    parseStructured() {
        let matches = this.extractDeclarationsStructured(this.rawContent);
        let currentSection = DEFAULT_SECTION;
        let declarations = {};
        if (!matches || !matches.length) {
            return {};
        }
        declarations[currentSection] = [];
        for (let match of matches) {
            if (this.checkIsSectionStart(match)) {
                let sectionName = String(new RegExp(SECTION_PATTERN, 'gi').exec(match)[2]);
                if (sectionName) {
                    currentSection = sectionName.replace(/"/g, '');
                    declarations[currentSection] = declarations[currentSection] || [];
                }
            }
            else if (this.checkIsSectionEnd(match)) {
                currentSection = DEFAULT_SECTION;
            }
            else {
                let parsed = this.parseSingleDeclaration(match);
                if (parsed) {
                    let map = this.extractMapDeclarations(parsed.value);
                    if (map.length) {
                        parsed.mapValue = map.map((declaration) => this.parseSingleDeclaration(`$${declaration};`));
                    }
                    declarations[currentSection].push(parsed);
                }
            }
        }
        return declarations;
    }
    extractDeclarationsStructured(content) {
        const matches = content.match(new RegExp(`${DECLARATION_PATTERN}|${SECTION_PATTERN}|${END_SECTION_PATTERN}`, 'g'));
        if (!matches) {
            return [];
        }
        return matches;
    }
    extractDeclarations(content) {
        const matches = content.match(new RegExp(DECLARATION_PATTERN, 'g'));
        if (!matches) {
            return [];
        }
        return matches;
    }
    extractMapDeclarations(content) {
        const matches = content.match(new RegExp(MAP_DECLARATIOM_REGEX, 'g'));
        if (!matches) {
            return [];
        }
        return matches;
    }
    parseSingleDeclaration(matchDeclaration) {
        let matches = matchDeclaration
            .replace(/\s*!(default|global)\s*;/, ';')
            .match(new RegExp(DECLARATION_PATTERN));
        if (!matches) {
            return;
        }
        let name = matches[1].trim().replace('_', '-');
        let value = matches[2].trim().replace(/\s*\n+\s*/g, ' ');
        if (value.match(QUOTES_PATTERN)) {
            value = value.replace(QUOTES_REPLACE, '');
        }
        return { name, value };
    }
    checkIsSectionStart(content) {
        return (new RegExp(SECTION_PATTERN, 'gi')).test(content);
    }
    checkIsSectionEnd(content) {
        return (new RegExp(END_SECTION_PATTERN, 'gi')).test(content);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map