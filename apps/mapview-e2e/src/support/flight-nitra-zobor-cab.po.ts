import * as turf from '@turf/turf';

export const getGeolocationButton = () =>
  cy.get('.maplibregl-ctrl-geolocate > .maplibregl-ctrl-icon');
export const getSettingsButton = () => cy.get('button[title="Nastavenia"');
interface IPointWithMetaData {
  bearing: number;
  speed: number;
  position: turf.helpers.Position;
  distanceFromLastPoint: number;
  distanceFromBeginning: number;
  timeFromLastPoint: number;
  timeFromBeginning: number;
}

function metaDataPoints() {
  const routePoints = [
    [18.1331, 48.2793],
    [18.1557, 48.2757],
    [18.1671, 48.2839],
    [18.1639, 48.3072],
    [18.108, 48.347],
    [18.0462, 48.3569],
    [18.0085, 48.3599],
    [18.004, 48.3735],
    [18.005, 48.3886],
  ];

  const line = turf.lineString(routePoints);
  const curved = turf.bezierSpline(line);

  return curved.geometry.coordinates.reduce((acc, position, index, array) => {
    const speed = 90 / 3.6; // kph to mps
    const bearing =
      index === array.length - 1
        ? turf.bearing(array[index - 1], position)
        : turf.bearing(position, array[index + 1]);
    const distanceFromLastPoint =
      index === 0
        ? 0
        : turf.distance(array[index - 1], position, { units: 'meters' });
    const timeFromLastPoint = index === 0 ? 0 : distanceFromLastPoint / speed;
    return [
      ...acc,
      {
        bearing,
        speed,
        position,
        distanceFromLastPoint,
        distanceFromBeginning:
          (index === 0 ? 0 : acc[index - 1].distanceFromBeginning) +
          distanceFromLastPoint,
        timeFromLastPoint,
        timeFromBeginning:
          (index === 0 ? 0 : acc[index - 1].timeFromBeginning) +
          timeFromLastPoint,
      },
    ];
  }, [] as IPointWithMetaData[]);
}

function intervalPoints(points: IPointWithMetaData[], time = 1) {
  return points.reduce(
    (acc, point, currentIndex, allPoints) => {
      while (acc.currentTime <= point.timeFromBeginning) {
        if (acc.currentTime === point.timeFromBeginning) {
          acc = {
            currentTime: acc.currentTime + time,
            points: [...acc.points, point],
          };
          continue;
        }

        const previousPoint = allPoints[currentIndex - 1];
        const line = turf.lineString([previousPoint.position, point.position]);
        const relativeCurrentTime =
          acc.currentTime - previousPoint.timeFromBeginning; // time like when route starts on previous point
        const relativeDistanceAtCurrentTime =
          (point.distanceFromLastPoint / point.timeFromLastPoint) *
          relativeCurrentTime;
        const currentTimePoint = turf.along(
          line,
          relativeDistanceAtCurrentTime,
          {
            units: 'meters',
          },
        ).geometry.coordinates;

        acc = {
          currentTime: acc.currentTime + time,
          points: [
            ...acc.points,
            {
              bearing: previousPoint.bearing,
              distanceFromBeginning:
                previousPoint.distanceFromBeginning +
                relativeDistanceAtCurrentTime,
              position: currentTimePoint,
              speed: previousPoint.speed,
              timeFromBeginning: acc.currentTime,
            },
          ],
        };
      }
      return acc;
    },
    { currentTime: 0, points: [] } as {
      currentTime: number;
      points: Omit<
        Omit<IPointWithMetaData, 'timeFromLastPoint'>,
        'distanceFromLastPoint'
      >[];
    },
  ).points;
}

export const points = intervalPoints(metaDataPoints());

export function locationForSecond(second: number) {
  const point =
    second === -1
      ? { ...points[0], speed: 0 }
      : points.length > second
        ? points[second]
        : { ...points[points.length - 1], speed: 0 };
  return {
    coords: {
      longitude: point.position[0],
      latitude: point.position[1],
      altitude: second === -1 ? 135 : 500,
      heading: point.bearing,
      speed: point.speed,
    },
    timestamp: new Date().getTime(),
  };
}
