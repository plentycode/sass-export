const VARIABLE_PATERN = '(?!\\d)[\\w_-][\\w\\d_-]*';
const VALUE_PATERN = '[^;"]+|"(?:[^"]+|(?:\\\\"|[^"])*)"';
const DECLARATION_PATTERN =
  `\\$'?(${VARIABLE_PATERN})'?\\s*:\\s*(${VALUE_PATERN})(?:\\s*!(global|default)\\s*;|\\s*;(?![^\\{]*\\}))`;
const SECTION_PATTERN = '(@sass-export-section=)(".+")';
const QUOTE_SCAPE_TOKEN = '&quot;';


class Parser {
  private rawContent: string;

  constructor(rawContent: string) {
    this.rawContent = rawContent;
  }

  public parse(): any {
    let matches = this.extractDeclarations(this.rawContent);
    // let declarations = matches.map((match) => this.parseSingleDecaration(match));
    let currentSection = 'data';
    let declarations = {};
    declarations[currentSection] = [];

    for (let match of matches) {
      if (match.indexOf('@sass-export-section') > -1) {
        let sectionName = String(new RegExp(SECTION_PATTERN, 'gi').exec(match)[2]);

        // TODO: check for valid-names
        if (sectionName) {
          currentSection = sectionName.replace(/"/g, '');
          declarations[currentSection] = [];
        }

        console.log('found a section:' + sectionName);

      } else {
        declarations[currentSection].push(this.parseSingleDecaration(match));
      }
    }

    return declarations;
  }

  private extractDeclarations(content: string): [any] {
    const matches = content.match(new RegExp(DECLARATION_PATTERN + '|' + SECTION_PATTERN, 'g'));

    if (!matches) {
      /// TODO: handle errors  throw new Error(`Error while extracting declaration:\n\t${content}`);
      return [] as any;
    }

    return matches as any;
  }

  private parseSingleDecaration(matchDeclaration: string): IDeclaration {
    let matches = matchDeclaration
      .replace(/\s*!(default|global)\s*;/, ';')
      .match(new RegExp(DECLARATION_PATTERN));

    if (!matches) {
      // TODO: handle errors   throw new Error(`Error while parsing declaration:\n\t${matchDeclaration}`)
      return;
    }


    let variable = matches[1].trim().replace('_', '-');
    let value = matches[2].trim().replace(/\s*\n+\s*/, '');

    return { variable, value } as IDeclaration;
  }

  private unescapeQuotes(content: string) {
    return content.replace(new RegExp(`^${QUOTE_SCAPE_TOKEN}`), '').replace(new RegExp(`${QUOTE_SCAPE_TOKEN}$`), '');
  }
}

export default Parser;
