import { Injectable } from '@angular/core';
import { Map } from 'maplibre-gl';

@Injectable({
  providedIn: 'root',
})
export class MapFontSizeService {
  setMapFontSizeRatio(ratio: number, map: Map) {
    this.setTownFontSizeRatio(ratio, map);
    this.setCityFontSizeRatio(ratio, map);
    this.setVillageFontSizeRatio(ratio, map);
    this.setCapitalFontSizeRatio(ratio, map);
    this.setPlaceOtherFontSizeRatio(ratio, map);
    this.setWaterFontSizeRatio(ratio, map);
  }

  private setTownFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('place_town', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCityFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('place_city', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setVillageFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('place_village', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setPlaceOtherFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('place_other', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCapitalFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('place_capital', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setWaterFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('water_way_name', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    map.setLayoutProperty('water_name_line', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    map.setLayoutProperty('water_name_point', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }
}
