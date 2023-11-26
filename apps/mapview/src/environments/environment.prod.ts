export const environment = {
  production: true,
  galleryLicenseKey: process.env['NX_LIGHT_GALLERY_KEY'],
  mapTilesKey: process.env['NX_MAP_TILES_KEY'] ?? 'MISSING_KEY',
  openAipDbUrl: process.env['NX_API_DB_URL'],
  notamProxy: process.env['NOTAM_PROXY'],
};
