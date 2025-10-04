export async function processImageToWebP(file, maxEdge = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions if necessary
          if (width > maxEdge || height > maxEdge) {
            const scale = maxEdge / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          // Create a canvas with the new dimensions
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP
          const webpUrl = canvas.toDataURL("image/webp", quality);

          resolve({
            url: webpUrl,
            width,
            height,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => reject(err);
      img.src = reader.result; // Load image from base64
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function processImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64Url = reader.result;
      const img = new Image();

      img.onload = () => {
        resolve({
          url: base64Url,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = (err) => reject(err);
      img.src = base64Url; // load image from base64
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file); // convert file to base64
  });
}
