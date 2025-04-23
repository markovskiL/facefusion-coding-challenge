export const base64ToBlob = (base64Data: string): Blob => {
  const parts = base64Data.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const arrayBuffer = new ArrayBuffer(rawLength);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < rawLength; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType });
};
