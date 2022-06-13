"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const fs = require("fs");
const sass = require("sass");
const glob = require("glob");
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const LINE_BREAK = '\n';
class Converter {
    constructor(options) {
        this.options = options;
        this.options = options || {};
    }
    getArray() {
        let content = this.getContent();
        let parsedDeclarations = new parser_1.Parser(content).parse();
        return parsedDeclarations.map((declaration) => {
            let isMap = false;
            if (declaration.mapValue) {
                isMap = true;
            }
            declaration.compiledValue = this.renderPropertyValue(content, declaration, isMap);
            declaration.name = `$${declaration.name}`;
            if (declaration.mapValue) {
                declaration.mapValue.map((mapDeclaration) => {
                    mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration, true);
                    return mapDeclaration;
                });
            }
            return declaration;
        });
    }
    getStructured() {
        let content = this.getContent();
        let structuredDeclaration = new parser_1.Parser(content).parseStructured();
        structuredDeclaration = this.compileStructure(structuredDeclaration);
        return structuredDeclaration;
    }
    compileStructure(structuredDeclaration) {
        let groups = Object.keys(structuredDeclaration);
        groups.forEach((group) => {
            let content = this.getContent();
            let isMap = false;
            let compiledGroup = structuredDeclaration[group].map((declaration) => {
                if (declaration.mapValue) {
                    isMap = true;
                }
                declaration.compiledValue = this.renderPropertyValue(content, declaration, isMap);
                declaration.name = `$${declaration.name}`;
                if (declaration.mapValue) {
                    declaration.mapValue.map((mapDeclaration) => {
                        mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration, true);
                        return mapDeclaration;
                    });
                }
                return declaration;
            });
        });
        return this.checkForMixins(structuredDeclaration);
    }
    getContent() {
        let inputFiles = [];
        let inputs = [];
        if (!Array.isArray(this.options.inputFiles)) {
            inputFiles.push(this.options.inputFiles);
        }
        else {
            inputFiles = this.options.inputFiles;
        }
        inputFiles.forEach((path) => {
            let files = glob.sync(String(path));
            inputs.push(...files);
        });
        let contents = inputs.map((filePath) => fs.readFileSync(String(filePath)));
        let strContents = contents.join(LINE_BREAK);
        strContents = strContents.replace(/\/\*[\w\W\r\n]*?\*\//g, '');
        strContents = strContents.split(LINE_BREAK).filter(v => v.indexOf('//') === -1).join(LINE_BREAK);
        return strContents;
    }
    checkForMixins(structuredDeclaration) {
        let mixinsGroup = 'mixins';
        let parsedMixins = new parser_1.Mixins(this.getContent()).parse();
        if (parsedMixins && parsedMixins.length) {
            structuredDeclaration[mixinsGroup] = parsedMixins;
        }
        return structuredDeclaration;
    }
    renderPropertyValue(content, declaration, isMap) {
        try {
            let rendered = sass.renderSync({
                data: content + LINE_BREAK + utils_1.Utils.wrapCss(declaration, isMap),
                includePaths: this.options.includePaths,
                outputStyle: 'compressed'
            });
            let wrappedRendered = String(rendered.css);
            wrappedRendered = utils_1.Utils.removeDoubleQuotes(wrappedRendered);
            return utils_1.Utils.unWrapValue(wrappedRendered);
        }
        catch (err) {
            console.error(err);
            return '';
        }
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map