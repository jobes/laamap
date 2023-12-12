export function escapeStringRegexp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export function isPwa() {
  return ['fullscreen', 'standalone', 'minimal-ui'].some(
    (displayMode) =>
      window.matchMedia('(display-mode: ' + displayMode + ')').matches ||
      (window.navigator as unknown as { [key: string]: unknown })[
        'standalone'
      ] ||
      document.referrer.includes('android-app://'),
  );
}
