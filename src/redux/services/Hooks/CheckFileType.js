export default function checkFileType(file) {
    if (!file || !file?.type) return false; // Handle invalid file input

    const reader = new FileReader();
    reader.readAsArrayBuffer(file?.slice(0, 4)); // Read the first 4 bytes (usually enough for MIME type)

    
    if (file?.type.includes('image') ) {
        return "image";
      } else if (file?.type.includes('video')) {
        return "video";
      } else {
        return false; // Not an image or video
      }
    
  }