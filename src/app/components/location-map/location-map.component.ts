import { Component, AfterViewInit } from '@angular/core';
import { MapaService } from '../../services/ubicacion.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map',
  standalone: false,
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.css',
})
export class LocationMapComponent {
  private readonly mapCenter: L.LatLngExpression = [12.114992, -86.236174]; // Coordenadas que deseas mostrar
  private readonly zoomLevel: number = 15;

  public markerUrl: string =
    'https://cdn-icons-png.flaticon.com/512/25/25613.png';

  constructor(private mapService: MapaService) {}

  ngOnInit(): void {
    const map = this.mapService.initializeMap('map', {
      center: this.mapCenter,
      zoom: this.zoomLevel,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    this.mapService.addMarker(
      (this.mapCenter as L.LatLngTuple)[0],
      (this.mapCenter as L.LatLngTuple)[1],
      this.markerUrl
    );
  }
}
