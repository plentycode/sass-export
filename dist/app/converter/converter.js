"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const sass = require("node-sass");
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
            declaration.compiledValue = this.renderPropertyValue(content, declaration);
            declaration.name = `$${declaration.name}`;
            if (declaration.mapValue) {
                declaration.mapValue.map((mapDeclaration) => {
                    mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration);
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
            let compiledGroup = structuredDeclaration[group].map((declaration) => {
                declaration.compiledValue = this.renderPropertyValue(content, declaration);
                declaration.name = `$${declaration.name}`;
                if (declaration.mapValue) {
                    declaration.mapValue.map((mapDeclaration) => {
                        mapDeclaration.compiledValue = this.renderPropertyValue(content, mapDeclaration);
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
        return contents.join(LINE_BREAK);
    }
    checkForMixins(structuredDeclaration) {
        let mixinsGroup = 'mixins';
        let parsedMixins = new parser_1.Mixins(this.getContent()).parse();
        if (parsedMixins && parsedMixins.length) {
            structuredDeclaration[mixinsGroup] = parsedMixins;
        }
        return structuredDeclaration;
    }
    renderPropertyValue(content, declaration) {
        try {
            let rendered = sass.renderSync({
                data: content + LINE_BREAK + utils_1.Utils.wrapCss(declaration),
                includePaths: this.options.includePaths,
                outputStyle: 'compact'
            });
            let wrappedRendered = String(rendered.css);
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