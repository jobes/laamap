export const getGeolocationButton = () =>
  cy.get('.maplibregl-ctrl-geolocate > .maplibregl-ctrl-icon');
export const locationForSecond = (
  second: number,
  positionList: number[][]
) => ({
  coords: {
    longitude: positionList[second][0],
    latitude: positionList[second][1],
    altitude: 100,
    heading: 30,
    speed: 100 / 3.6,
  },
  timestamp: new Date().getTime(),
});
