export function tagDecoder(n: number) {
  return { tagClass: n >> 6, tagConstructed: (n & 0x20) == 0 ? 1 : 0, tagNumber: n & 0x1f };
}
