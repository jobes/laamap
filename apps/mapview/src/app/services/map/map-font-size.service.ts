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
    map.setLayoutProperty('Town labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCityFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('City labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setVillageFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('Village labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setPlaceOtherFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('Other labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setCapitalFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('Capital city labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }

  private setWaterFontSizeRatio(ratio: number, map: Map) {
    map.setLayoutProperty('Ocean labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    map.setLayoutProperty('River labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);

    map.setLayoutProperty('Lakeline labels', 'text-field', [
      'format',
      ['get', 'name'],
      {
        'font-scale': ratio,
      },
    ]);
  }
}
