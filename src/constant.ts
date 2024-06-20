import { readAndParseDer } from "./cert";

export const SAMPLE_DER: number[] = Array.from(readAndParseDer());
