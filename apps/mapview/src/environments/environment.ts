// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  galleryLicenseKey: process.env['NX_LIGHT_GALLERY_KEY'],
  mapTilesKey: process.env['NX_MAP_TILES_KEY'] ?? 'MISSING_KEY',
  openAipDbUrl: process.env['NX_API_DB_URL'],
  notamProxy: process.env['NX_NOTAM_PROXY'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
