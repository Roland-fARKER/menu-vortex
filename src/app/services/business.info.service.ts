import { Injectable } from "@angular/core"
import { BehaviorSubject, map, Observable } from "rxjs"
import { SocialMedia, MapLocation } from "../models/social-media"
import { Firestore, collection, query, where, getDocs, collectionData, doc, getDoc } from "@angular/fire/firestore"
import { Business } from "../models/business.model"


@Injectable({
  providedIn: "root",
})
export class BusinessInfoService {
  async getWhatsappByBusinessId(businessId: string): Promise<string | null> {
    try {
      const docRef = doc(this.firestore, `businesses/${businessId}`);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const businessData = docSnap.data() as Business;
        return businessData.whatsapp || null;
      } else {
        console.warn(`No se encontró el negocio con ID: ${businessId}`);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el número de WhatsApp:", error);
      return null;
    }
  }
  
  // Ubicación inicial del mapa
  private initialLocation: MapLocation = {
    lat: 19.4326,
    lng: -99.1332,
    zoom: 15,
    title: "VORTEX - Oficina Central",
    address: "Av. Paseo de la Reforma 222, Juárez, 06600 Ciudad de México, CDMX",
  }

  private businessSubject = new BehaviorSubject<Business | null>(null);
  business$ = this.businessSubject.asObservable();

  // BehaviorSubjects para las redes sociales y la ubicación
  private socialMediaSubject = new BehaviorSubject<SocialMedia[]>(this.getSocialMedia())
  socialMedia$ = this.socialMediaSubject.asObservable()

  private locationSubject = new BehaviorSubject<MapLocation>(this.getSavedLocation())
  location$ = this.locationSubject.asObservable()

  constructor(private firestore: Firestore) {}

  // Métodos para obtener datos guardados o usar los iniciales
  
  private getSavedLocation(): MapLocation {
    const saved = localStorage.getItem("mapLocation")
    return saved ? JSON.parse(saved) : this.initialLocation
  }

  getBusinessBySlug(slug: string): Observable<Business | null> {
    const negociosRef = collection(this.firestore, 'businesses');
    const q = query(negociosRef, where('slug', '==', slug));
    return collectionData(q, { idField: 'id' }).pipe(
      map(negocios => negocios.map(negocio => negocio as Business)[0] ?? null)
    );
  }

  getSocialMedia(): SocialMedia[] {
    const saved = localStorage.getItem("socialMedia");
    return saved ? JSON.parse(saved) : [];
  }

  setBusiness(business: Business) {
    this.businessSubject.next(business);
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
