interface IOptions {
  inputFiles?: any,
  includePaths?: string[],
  format?: string,
  type?: string
}

interface IDeclaration {
  name: string,
  value: string,
  mapValue?: Array<any>,
  compiledValue: string
}