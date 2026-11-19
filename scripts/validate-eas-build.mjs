const profile = process.env.EAS_BUILD_PROFILE;

if (!profile) {
  process.exit(0);
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
if (!apiUrl) {
  console.error('Configure EXPO_PUBLIC_API_URL no ambiente EAS antes de gerar o APK.');
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(apiUrl);
} catch {
  console.error('EXPO_PUBLIC_API_URL precisa ser uma URL HTTP ou HTTPS válida.');
  process.exit(1);
}

const host = parsedUrl.hostname.toLowerCase();
if (['localhost', '127.0.0.1', '::1', '10.0.2.2'].includes(host)) {
  console.error('O APK não pode usar localhost ou o endereço loopback/do emulador como API.');
  process.exit(1);
}

if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
  console.error('EXPO_PUBLIC_API_URL precisa usar HTTP ou HTTPS.');
  process.exit(1);
}
