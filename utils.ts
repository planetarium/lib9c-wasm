export function parseHex(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, "hex"));
}

export function toHex(buf: Uint8Array): string {
    return Buffer.from(buf).toString("hex");
}
