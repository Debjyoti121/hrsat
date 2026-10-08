// Downloads the original hrsat.org images into public/images so the new site
// does not depend on the old WordPress server. Then set NEXT_PUBLIC_LOCAL_IMAGES="true".
import fs from "node:fs";
import path from "node:path";

const files = [
  "2025/06/HRSAT-LOGO.png",
  "2026/05/cropped-WhatsApp_Image_2026-05-20_at_22.46.21-removebg-preview.png",
  "2026/08/GHRD-logo-high-resolution-kopie.webp",
  "2026/09/Sital-1.png",
  "2026/09/DSC01679.jpg",
  "2026/07/DSC1448-scaled.webp",
  "2026/07/DSC07447-scaled.webp",
  "2026/09/WhatsApp-Image-2026-09-10-at-17.48.24.jpeg",
  "2026/07/DSC0635-scaled.webp",
  "2026/07/DSC03347-scaled.webp",
];
const out = path.join("public", "images");
fs.mkdirSync(out, { recursive: true });
for (const f of files) {
  const url = "https://www.hrsat.org/wp-content/uploads/" + f;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    fs.writeFileSync(path.join(out, path.basename(f)), Buffer.from(await res.arrayBuffer()));
    console.log("✓", path.basename(f));
  } catch (e) {
    console.error("✗", url, e.message);
  }
}
console.log('\nDone. Set NEXT_PUBLIC_LOCAL_IMAGES="true" in .env and restart the dev server.');
