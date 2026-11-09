import { WifiPayload } from '../../types/payload';

function escapeWifiString(value: string): string {
  // Caracteres reservados no padrão de Wi-Fi para QR: \, ;, ,, :, "
  return value.replace(/([\\;,":])/g, '\\$1');
}

export function buildWifiPayload(payload: WifiPayload): string {
  const ssid = escapeWifiString(payload.ssid.trim());
  const type = payload.encryption || 'WPA';
  const password = payload.password ? escapeWifiString(payload.password) : '';
  const hidden = payload.hidden ? 'true' : 'false';

  return `WIFI:S:${ssid};T:${type};P:${password};H:${hidden};;`;
}
