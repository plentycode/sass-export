interface IOptions {
  inputFiles: string[],
  includePaths?: string[],
  format?: string
}

interface IDeclaration {
  variable: string,
  value: string,
  compiledValue: string
}