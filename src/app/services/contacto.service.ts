import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Contacto } from '../models/contacto';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private coleccion = 'contactos';

  constructor(private firestore: Firestore) {}

  guardarContacto(contacto: Contacto) {
    contacto.fechaEnvio = new Date();
    const contactosRef = collection(this.firestore, this.coleccion);
    return addDoc(contactosRef, contacto);
  }
}

