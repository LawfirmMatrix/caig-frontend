import {Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {Browser, Map, map, tileLayer, TileLayerOptions} from 'leaflet';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements AfterViewInit {
  @ViewChild('map') public mapContainer!: ElementRef<HTMLElement>;

  public ngAfterViewInit() {
    const apiKey = '177274e90c514c4689435ee86ee3cbe9';
    const baseUrl = 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}';
    const regUrl = `${baseUrl}.png?apiKey=${apiKey}`;
    const retinaUrl = `${baseUrl}@2x.png?apiKey=${apiKey}`;
    const lefletMap: Map = map(this.mapContainer.nativeElement).setView([39.369, -76.717], 12);

    tileLayer(Browser.retina ? retinaUrl : regUrl, {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      apiKey,
      maxZoom: 20,
      id: 'osm-bright',
    } as TileLayerOptions).addTo(lefletMap);
  }
}
