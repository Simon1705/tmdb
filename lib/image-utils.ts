// Generate blur data URL for image placeholders
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#1e293b" offset="20%" />
      <stop stop-color="#334155" offset="50%" />
      <stop stop-color="#1e293b" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1e293b" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const getBlurDataURL = (w: number = 700, h: number = 475) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;

// Specific blur placeholders for different aspect ratios
export const posterBlurDataURL = getBlurDataURL(300, 450); // 2:3 ratio for posters
export const backdropBlurDataURL = getBlurDataURL(700, 400); // ~16:9 ratio for backdrops
