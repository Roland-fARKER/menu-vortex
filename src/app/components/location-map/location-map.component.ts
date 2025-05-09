import { Component, Input, OnInit } from '@angular/core';
import { MapaService } from '../../services/ubicacion.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map',
  standalone: false,
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.css',
})
export class LocationMapComponent implements OnInit {
  @Input() latitude: number = 12.114992;  // valor por defecto
  @Input() longitude: number = -86.236174; // valor por defecto

  private readonly zoomLevel: number = 15;
  public markerUrl: string =
    'https://cdn-icons-png.flaticon.com/512/25/25613.png';

  constructor(private mapService: MapaService) {}

  ngOnInit(): void {
    const mapCenter: L.LatLngExpression = [this.latitude, this.longitude];

    const map = this.mapService.initializeMap('map', {
      center: mapCenter,
      zoom: this.zoomLevel,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    this.mapService.addMarker(
      this.latitude,
      this.longitude,
      this.markerUrl
    );
  }
}
