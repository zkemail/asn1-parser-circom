import { readAndParseDer } from "./cert-utils";

export const SAMPLE_DER: number[] = Array.from(readAndParseDer());
