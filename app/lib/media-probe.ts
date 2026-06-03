/** Client-side probe — avoids broken <img> icons before paint */

export function probeImage(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

export function probeVideo(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const done = (ok: boolean) => {
      video.removeAttribute("src");
      video.load();
      resolve(ok);
    };
    video.preload = "metadata";
    video.onloadeddata = () => done(true);
    video.onerror = () => done(false);
    video.src = path;
  });
}
