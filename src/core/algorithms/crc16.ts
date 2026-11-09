/**
 * Calcula o CRC16-CCITT (Polinômio 0x1021, Init 0xFFFF)
 * Compatível com a especificação do Banco Central do Brasil para PIX.
 */
export function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  // Retorna em hexadecimal uppercase com 4 dígitos fixos
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
