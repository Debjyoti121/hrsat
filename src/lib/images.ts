// Images originally hosted on hrsat.org. Run `npm run images:download` and set
// NEXT_PUBLIC_LOCAL_IMAGES="true" to serve them from /public/images instead.
const REMOTE = "https://www.hrsat.org/wp-content/uploads/";
const local = process.env.NEXT_PUBLIC_LOCAL_IMAGES === "true";

export const IMAGE_SOURCES = {
  logo: "2025/06/HRSAT-LOGO.png",
  emblem: "2026/05/cropped-WhatsApp_Image_2026-05-20_at_22.46.21-removebg-preview.png",
  ghrdLogo: "2026/08/GHRD-logo-high-resolution-kopie.webp",
  team: "2026/09/Sital-1.png",
  office: "2026/09/DSC01679.jpg",
  conference: "2026/07/DSC1448-scaled.webp",
  aboutHero: "2026/07/DSC07447-scaled.webp",
  aboutIntro: "2026/09/WhatsApp-Image-2026-09-10-at-17.48.24.jpeg",
  ghrdEvent: "2026/07/DSC0635-scaled.webp",
  globalReach: "2026/07/DSC03347-scaled.webp",
} as const;

export type ImageKey = keyof typeof IMAGE_SOURCES;

export function img(key: ImageKey) {
  const p = IMAGE_SOURCES[key];
  return local ? `/images/${p.split("/").pop()}` : REMOTE + p;
}
