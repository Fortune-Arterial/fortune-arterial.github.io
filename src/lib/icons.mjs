const paths = {
  github:
    '<path d="M12 2.6a9.4 9.4 0 0 0-3 18.32c.47.09.64-.2.64-.45v-1.58c-2.62.57-3.17-1.26-3.17-1.26-.43-1.09-1.05-1.38-1.05-1.38-.86-.59.06-.58.06-.58.95.07 1.45.98 1.45.98.84 1.45 2.21 1.03 2.75.79.09-.61.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.67 0-1.03.37-1.87.98-2.53-.1-.24-.42-1.2.09-2.5 0 0 .79-.25 2.59.97a8.9 8.9 0 0 1 4.72 0c1.8-1.22 2.59-.97 2.59-.97.51 1.3.19 2.26.09 2.5.61.66.98 1.5.98 2.53 0 3.63-2.2 4.42-4.3 4.66.34.29.64.87.64 1.75v2.59c0 .25.17.55.65.45A9.4 9.4 0 0 0 12 2.6Z" fill="currentColor"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  rss: '<path d="M5 18.5h.01"/><path d="M5 12.5a6 6 0 0 1 6 6"/><path d="M5 6.5a12 12 0 0 1 12 12"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 5.5A1.5 1.5 0 0 0 13.5 4H5.5A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4.4l2-2a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1"/><path d="M14 10a4.5 4.5 0 0 0-6.4-.4l-2 2A4.5 4.5 0 0 0 12 18l1.1-1.1"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
  spark: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',
  eraser: '<path d="m4 16 8-8 6 6-8 8H6l-2-2Z"/><path d="M11 21h10"/>',
};

export function icon(name, size = 18, className = "") {
  const path = paths[name] || paths.spark;
  return `<svg class="icon${className ? ` ${className}` : ""}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function brandMark(size = 34) {
  return `<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
  <rect width="64" height="64" rx="15" fill="#14161c"/>
  <rect x=".75" y=".75" width="62.5" height="62.5" rx="14.25" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>
  <path d="M32 12v40M14.7 22l34.6 20M49.3 22 14.7 42" stroke="#f5f4f0" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="5.2" fill="#4f7cff"/>
</svg>`;
}
