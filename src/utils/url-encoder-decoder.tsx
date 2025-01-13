export function encodeURLid(id: string) {
  return Buffer.from(id).toString("base64");
}

export function decodeURLid(encoded: string) {
  return Buffer.from(encoded, "base64").toString();
}
