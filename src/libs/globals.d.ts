interface IOptions {
  inputFiles?: any,
  includePaths?: string[],
  format?: string,
  type?: string
}

interface IDeclaration {
  variable: string,
  value: string,
  mapValue?: Array<any>,
  compiledValue: string
}