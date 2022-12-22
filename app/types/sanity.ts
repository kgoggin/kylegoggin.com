export interface SanityAPIResponse<ResultT> {
  query: string;
  ms: number;
  result: ResultT;
}
