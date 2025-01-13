export function encodeURLid(id?: string | null) {
  if (!id) return undefined;
  return Buffer.from(id).toString("base64");
}

export function decodeURLid(encoded: string) {
  return Buffer.from(encoded, "base64").toString();
}
