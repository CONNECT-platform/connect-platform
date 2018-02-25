export interface Signature {
  configs?: Array<string>;
  inputs: Array<string>;
  outputs: Array<string>;
  controlOutputs?: Array<string>;
  path: string;
  public?: boolean;
  method?: string;
}
