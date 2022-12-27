import {Component} from '@angular/core';
import {Map, marker, Marker} from 'leaflet';

@Component({
  selector: 'app-employee-locations',
  templateUrl: './employee-locations.component.html',
  styleUrls: ['./employee-locations.component.scss']
})
export class EmployeeLocationsComponent {
  public map!: Map;
  public markers: Marker[] = [];
  public addMarkers(): void {
    this.clearMarkers();
    for (let i = 0; i < 200; i++) {
      const m = marker([Math.random() * 180 - 90, Math.random() * 360 - 180]);
      this.markers.push(m);
      m.addTo(this.map);
    }
  }
  public clearMarkers(): void {
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];
  }
}
