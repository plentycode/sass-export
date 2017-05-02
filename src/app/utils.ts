class Utils {

  public static getDeclarationByName(declarations: IDeclaration[] = [], name: string): IDeclaration {
    let filtered = declarations.filter((declaration) => {
      return declaration.variable === name;
    });

    return filtered[0];
  }
}

export default Utils;
