import { barDefinition, barExtraValues } from './selector-helpers';

describe('Selector helpers', () => {
  describe('barExtraValues', () => {
    it('should map with no caution and alert', () => {
      expect(
        barExtraValues(
          170,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map with lower caution', () => {
      expect(
        barExtraValues(
          140,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map with upper caution', () => {
      expect(
        barExtraValues(
          190,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map with lower alert', () => {
      expect(
        barExtraValues(
          60,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map with upper alert', () => {
      expect(
        barExtraValues(
          210,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map when value lower than min bar', () => {
      expect(
        barExtraValues(
          30,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should map when value bigger than max bar', () => {
      expect(
        barExtraValues(
          270,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should be hidden when not connected', () => {
      expect(
        barExtraValues(
          270,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          false,
        ),
      ).toMatchSnapshot();
    });

    it('should be hidden when not shown', () => {
      expect(
        barExtraValues(
          270,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: false,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });

    it('should be hidden when value null', () => {
      expect(
        barExtraValues(
          null,
          {
            alertLower: 70,
            alertUpper: 200,
            cautionLower: 150,
            cautionUpper: 180,
            minShownValue: 50,
            maxShownValue: 250,
            show: true,
            compact: false,
          },
          true,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('barDefinition', () => {
    it('should define normal bars', () => {
      expect(
        barDefinition({
          alertLower: 70,
          alertUpper: 130,
          cautionLower: 90,
          cautionUpper: 120,
          bgColor: 'red',
          position: { x: 20, y: 30 },
          textColor: 'black',
          minShownValue: 50,
          maxShownValue: 150,
        }),
      ).toMatchSnapshot();
    });

    it('should define normal bars overflowed alert', () => {
      expect(
        barDefinition({
          alertLower: 70,
          alertUpper: 130,
          cautionLower: 90,
          cautionUpper: 120,
          bgColor: 'red',
          position: { x: 20, y: 30 },
          textColor: 'black',
          minShownValue: 50,
          maxShownValue: 110,
        }),
      ).toMatchSnapshot();
    });

    it('should define normal bars overflowed caution', () => {
      expect(
        barDefinition({
          alertLower: 70,
          alertUpper: 130,
          cautionLower: 90,
          cautionUpper: 120,
          bgColor: 'red',
          position: { x: 20, y: 30 },
          textColor: 'black',
          minShownValue: 50,
          maxShownValue: 125,
        }),
      ).toMatchSnapshot();
    });
  });
});
