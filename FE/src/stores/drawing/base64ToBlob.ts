// Helper function to convert base64 to blob
const base64ToBlob = async (base64String: string): Promise<Blob> => {
    // Extract actual base64 data (remove data URL prefix if present)
    const base64Data = base64String.split(',')[1] || base64String;

    // Convert base64 to byte array
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'image/webp' });
  };

  export default base64ToBlob;
