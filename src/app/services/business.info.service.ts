import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { SocialMedia, MapLocation } from "../models/social-media"

@Injectable({
  providedIn: "root",
})
export class BusinessInfoService {
  // Datos iniciales de redes sociales
  private initialSocialMedia: SocialMedia[] = [
    {
      id: "facebook",
      name: "Facebook",
      url: "https://facebook.com/vortex",
      icon: "facebook",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://instagram.com/vortex",
      icon: "instagram",
    },
    {
      id: "twitter",
      name: "Twitter",
      url: "https://twitter.com/vortex",
      icon: "twitter",
    },
  ]

  // Ubicación inicial del mapa
  private initialLocation: MapLocation = {
    lat: 19.4326,
    lng: -99.1332,
    zoom: 15,
    title: "VORTEX - Oficina Central",
    address: "Av. Paseo de la Reforma 222, Juárez, 06600 Ciudad de México, CDMX",
  }

  // BehaviorSubjects para las redes sociales y la ubicación
  private socialMediaSubject = new BehaviorSubject<SocialMedia[]>(this.getSavedSocialMedia())
  socialMedia$ = this.socialMediaSubject.asObservable()

  private locationSubject = new BehaviorSubject<MapLocation>(this.getSavedLocation())
  location$ = this.locationSubject.asObservable()

  constructor() {}

  // Métodos para obtener datos guardados o usar los iniciales
  private getSavedSocialMedia(): SocialMedia[] {
    const saved = localStorage.getItem("socialMedia")
    return saved ? JSON.parse(saved) : this.initialSocialMedia
  }

  private getSavedLocation(): MapLocation {
    const saved = localStorage.getItem("mapLocation")
    return saved ? JSON.parse(saved) : this.initialLocation
  }

  // Métodos para gestionar redes sociales
  getSocialMedia(): SocialMedia[] {
    return this.socialMediaSubject.value
  }

  addSocialMedia(socialMedia: SocialMedia): void {
    const current = this.socialMediaSubject.value
    const updated = [...current, socialMedia]
    this.socialMediaSubject.next(updated)
    localStorage.setItem("socialMedia", JSON.stringify(updated))
  }

  updateSocialMedia(id: string, socialMedia: Partial<SocialMedia>): void {
    const current = this.socialMediaSubject.value
    const updated = current.map((item) => (item.id === id ? { ...item, ...socialMedia } : item))
    this.socialMediaSubject.next(updated)
    localStorage.setItem("socialMedia", JSON.stringify(updated))
  }

  deleteSocialMedia(id: string): void {
    const current = this.socialMediaSubject.value
    const updated = current.filter((item) => item.id !== id)
    this.socialMediaSubject.next(updated)
    localStorage.setItem("socialMedia", JSON.stringify(updated))
  }

  // Métodos para gestionar la ubicación
  getLocation(): MapLocation {
    return this.locationSubject.value
  }

  updateLocation(location: Partial<MapLocation>): void {
    const current = this.locationSubject.value
    const updated = { ...current, ...location }
    this.locationSubject.next(updated)
    localStorage.setItem("mapLocation", JSON.stringify(updated))
  }
}
