const variable = '(?!\\d)[\\w_-][\\w\\d_-]*'
const value = '[^;"]+|"(?:[^"]+|(?:\\\\"|[^"])*)"'
const declarationPattern = `\\$'?(${variable})'?\\s*:\\s*(${value})(?:\\s*!(global|default)\\s*;|\\s*;(?![^\\{]*\\}))`

class Parser {
  rawContent: string;

  constructor(rawContent: string) {
    this.rawContent = rawContent;
    this.parse();
  }

  parse() {
    let matches = this.extractDeclarations(this.rawContent);

    let declarations = matches.map(match => this.parseSingleDecaration(match));

    //TODO: need scaping
    //let inner = declarations.map((declaration: IDeclaration) => this.extractDeclarations(declaration.value));

    console.log(declarations);
   // console.log(inner);
  }

  extractDeclarations(content: string): [any] {
    let matches = content.match(new RegExp(declarationPattern, 'g'))

    if (!matches) {
      throw new Error(`Error while extracting declaration:\n\t${content}`)
    }

    return <[any]>matches;
  }

  private parseSingleDecaration(matchDeclaration: string): IDeclaration {
    let matches = matchDeclaration
      .replace(/\s*!(default|global)\s*;/, ';')
      .match(new RegExp(declarationPattern))

    if (!matches) {
      //      throw new Error(`Error while parsing declaration:\n\t${matchDeclaration}`)
      return;
    }

    let variable = matches[1].trim().replace('_', '-');
    let value = matches[2].trim().replace(/\s*\n+\s*/, '');

    return { value, variable }
  }

  private scapeQuotes() {

  }
}

export default Parser;