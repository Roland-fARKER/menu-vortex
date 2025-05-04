import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapaService {
  private map: L.Map | undefined;

  initializeMap(containerId: string, options: L.MapOptions): L.Map {
    this.map = L.map(containerId, options);
    return this.map;
  }

  addMarker(lat: number, lng: number, iconUrl: string): L.Marker {
    const icon = L.icon({
      iconUrl,
      iconSize: [35, 35],
      iconAnchor: [19, 35],
    });
    const marker = L.marker([lat, lng], { icon });
    marker.addTo(this.map!);
    return marker;
  }
}
