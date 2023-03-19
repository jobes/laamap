import { Injectable } from '@angular/core';

import { RadarSettings } from '../../../store/settings/radar/radar.feature';
import { IRainViewerUrls } from '../../rain-viewer/rain-viewer.interface';
import { RainViewerService } from '../../rain-viewer/rain-viewer.service';
import { MapService } from '../map.service';

@Injectable({
  providedIn: 'root',
})
export class OnMapRainViewerService {
  itemCounts = 0;
  constructor(
    private readonly mapService: MapService,
    private readonly rainViewer: RainViewerService
  ) {}

  createLayers(urlsWithSettings?: {
    urls: IRainViewerUrls;
    settings: RadarSettings;
  }): void {
    this.deleteLayers();

    if (urlsWithSettings) {
      const urls = this.getSourceUrls(urlsWithSettings);
      this.itemCounts = urls.length;
      this.createLayersFromUrls(
        urls,
        urlsWithSettings.settings.type === 'coverage'
      );
      if (urlsWithSettings.settings.type !== 'coverage') {
        this.startAnimation(
          urlsWithSettings.settings,
          this.createFrameTimeArray(urlsWithSettings)
        );
      }
    }
  }

  deleteLayers(): void {
    this.rainViewer.stopAnimationTimer();
    for (let i = 0; i < this.itemCounts; i++) {
      this.mapService.instance.removeLayer(this.getLayerName(i));
      this.mapService.instance.removeSource(this.getSourceName(i));
    }
    this.itemCounts = 0;
  }

  showFrame(frameNum: number, opacity: number): void {
    this.mapService.instance.setPaintProperty(
      this.getLayerName(frameNum - 1),
      'raster-opacity',
      0
    );
    this.mapService.instance.setPaintProperty(
      this.getLayerName(frameNum),
      'raster-opacity',
      opacity / 100
    );
  }

  private startAnimation(
    settings: RadarSettings,
    timeArray: { time: number; isPast: boolean }[]
  ): void {
    this.rainViewer.startAnimationTimer(
      this.itemCounts,
      settings.animationSpeed,
      timeArray
    );
  }

  private createLayersFromUrls(urls: string[], singleFrame: boolean): void {
    urls.forEach((url, index) => {
      const sourceName = this.getSourceName(index);
      const layerName = this.getLayerName(index);
      this.mapService.instance.addSource(sourceName, {
        type: 'raster',
        tiles: [url],
        tileSize: this.rainViewer.tileSize,
      });

      this.mapService.instance.addLayer({
        id: layerName,
        source: sourceName,
        type: 'raster',
        paint: {
          'raster-opacity': singleFrame ? 1 : 0,
          'raster-fade-duration': 0,
        },
      });
    });
  }

  private createFrameTimeArray(urlsWithSettings: {
    urls: IRainViewerUrls;
    settings: RadarSettings;
  }): { time: number; isPast: boolean }[] {
    if (urlsWithSettings.settings.type === 'radar') {
      return [
        ...urlsWithSettings.urls.radar.past.map((item) => ({
          time: item.time,
          isPast: true,
        })),
        ...urlsWithSettings.urls.radar.nowcast.map((item) => ({
          time: item.time,
          isPast: false,
        })),
      ];
    }

    if (urlsWithSettings.settings.type === 'satellite') {
      urlsWithSettings.urls.satellite.infrared.map((item) => ({
        time: item.time,
        isPast: true,
      }));
    }

    return [];
  }

  private getSourceUrls(urlsWithSettings: {
    urls: IRainViewerUrls;
    settings: RadarSettings;
  }): string[] {
    if (urlsWithSettings.settings.type === 'radar') {
      return this.getRadarSourceUrls(urlsWithSettings);
    }
    if (urlsWithSettings.settings.type === 'satellite') {
      return this.getSatelliteSourceUrls(urlsWithSettings);
    }
    return [`${urlsWithSettings.urls.host}/${urlsWithSettings.urls.coverage}`];
  }

  private getRadarSourceUrls(urlsWithSettings: {
    urls: IRainViewerUrls;
    settings: RadarSettings;
  }): string[] {
    return [
      ...urlsWithSettings.urls.radar.past,
      ...urlsWithSettings.urls.radar.nowcast,
    ].map(
      (item) =>
        `${urlsWithSettings.urls.host}${item.path}/${
          this.rainViewer.tileSize
        }/{z}/{x}/{y}/${urlsWithSettings.settings.colorScheme}/${
          urlsWithSettings.settings.smooth ? 1 : 0
        }_${urlsWithSettings.settings.snow ? 1 : 0}.png`
    );
  }

  private getSatelliteSourceUrls(urlsWithSettings: {
    urls: IRainViewerUrls;
    settings: RadarSettings;
  }): string[] {
    return urlsWithSettings.urls.satellite.infrared.map(
      (item) =>
        `${urlsWithSettings.urls.host}${item.path}/${
          this.rainViewer.tileSize
        }/{z}/{x}/{y}/0/${urlsWithSettings.settings.smooth ? 1 : 0}_0.png`
    );
  }

  private getSourceName(index: number): string {
    return `rainViewerSource${
      index < 0 ? (index = this.itemCounts - 1) : index
    }`;
  }

  private getLayerName(index: number): string {
    return `rainViewerLayer${
      index < 0 ? (index = this.itemCounts - 1) : index
    }`;
  }
}
