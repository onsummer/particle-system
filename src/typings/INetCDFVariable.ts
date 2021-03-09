export interface INetCDFVariable {
  dimensions: number[],
  attributes: any[],
  name: string,
  offset: number,
  record: boolean,
  size: number,
  type: string 
}