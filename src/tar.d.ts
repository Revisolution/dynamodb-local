declare module 'tar' {
  interface ExtractParam {
    C?: string
  }
  export const extract: (param?: ExtractParam) => NodeJS.ReadWriteStream
  export const x: (param?: ExtractParam) => NodeJS.ReadWriteStream
}