export interface SignatureHints {
  node?: string;
  inputs?: {[key: string]: string};
  outputs?: {[key: string]: string};
  controlOutputs?: {[key: string]: string};
}

export interface Signature {
  configs?: Array<string>;
  inputs: Array<string>;
  optionalInputs?: Array<string>;
  outputs: Array<string>;
  controlOutputs?: Array<string>;
  path: string;
  public?: boolean;
  method?: string;
  hints?: SignatureHints;
}
