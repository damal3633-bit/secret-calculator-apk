import { Capacitor } from "@capacitor/core";
import { Media } from "@capacitor-community/media";

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected media file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

async function getCalculatorAlbumIdentifier() {
  const albumName = "Calculator";
  let { albums } = await Media.getAlbums();
  let album;

  if (Capacitor.getPlatform() === "android") {
    const root = (await Media.getAlbumsPath()).path;
    album = albums.find(item => item.name === albumName && item.identifier.startsWith(root));
  } else {
    album = albums.find(item => item.name === albumName);
  }

  if (!album) {
    await Media.createAlbum({ name: albumName });
    ({ albums } = await Media.getAlbums());
    if (Capacitor.getPlatform() === "android") {
      const root = (await Media.getAlbumsPath()).path;
      album = albums.find(item => item.name === albumName && item.identifier.startsWith(root));
    } else {
      album = albums.find(item => item.name === albumName);
    }
  }

  if (!album) throw new Error("Could not create or find the Calculator album.");
  return album.identifier;
}

async function saveCalculatorMediaToGallery(file, originalName) {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Gallery save works inside the installed APK, not in a normal browser tab.");
  }
  if (!(file instanceof Blob)) throw new Error("The selected file is not available.");
  // Base64 conversion temporarily uses extra memory; warn rather than risk app crashes on huge videos.
  const maxBytes = 150 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("This file is larger than 150 MB. Please use a smaller video to save it to Gallery.");
  }

  const dataUrl = await blobToDataUrl(file);
  const albumIdentifier = await getCalculatorAlbumIdentifier();
  const rawName = String(originalName || file.name || "Calculator media");
  const fileName = rawName.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]/g, "_").slice(0, 80) || "Calculator media";
  const mime = file.type || "application/octet-stream";

  if (mime.startsWith("video/")) {
    await Media.saveVideo({ path: dataUrl, albumIdentifier, fileName });
  } else if (mime.startsWith("image/") || mime === "image/gif") {
    await Media.savePhoto({ path: dataUrl, albumIdentifier, fileName });
  } else {
    throw new Error("Only image and video files can be saved to Gallery.");
  }
  return true;
}

window.calculatorGalleryReady = Promise.resolve(true);
window.saveCalculatorMediaToGallery = saveCalculatorMediaToGallery;
