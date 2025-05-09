import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito, Producto } from '../models/producto.model';
import { Business } from '../models/business.model';
import { BusinessInfoService } from './business.info.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private animarCarritoSubject = new BehaviorSubject<boolean>(false);
  animarCarrito$ = this.animarCarritoSubject.asObservable();

  private collectionRef: CollectionReference;

  constructor(private firestore: Firestore, private businessIn: BusinessInfoService) {
    this.collectionRef = collection(
      this.firestore,
      'carritos'
    ) as CollectionReference;
  }

  /** Genera o recupera el ID local del carrito del usuario */
  private obtenerOGenerarCarritoId(): string {
    let id = localStorage.getItem('carrito_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('carrito_id', id);
    }
    return id;
  }

  async agregarAlCarrito(producto: Producto): Promise<void> {
    const id = this.obtenerOGenerarCarritoId();

    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.find(
      (item) => item.producto.id === producto.id
    );

    let carritoActualizado: ItemCarrito[];

    if (itemExistente) {
      carritoActualizado = carritoActual.map((item) =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      carritoActualizado = [...carritoActual, { producto, cantidad: 1 }];
    }

    this.carritoSubject.next(carritoActualizado);
    this.animarCarritoSubject.next(true);
    setTimeout(() => this.animarCarritoSubject.next(false), 500);

    this.guardarCarritoEnFirestore(id, carritoActualizado);
  }

  async eliminarDelCarrito(productoId: number): Promise<void> {
    const id = this.obtenerOGenerarCarritoId();

    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.find(
      (item) => item.producto.id === productoId
    );

    let carritoActualizado: ItemCarrito[];

    if (itemExistente && itemExistente.cantidad > 1) {
      carritoActualizado = carritoActual.map((item) =>
        item.producto.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
    } else {
      carritoActualizado = carritoActual.filter(
        (item) => item.producto.id !== productoId
      );
    }

    this.carritoSubject.next(carritoActualizado);
    this.guardarCarritoEnFirestore(id, carritoActualizado);
  }

  obtenerTotal(): number {
    return this.carritoSubject.value.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
  }  

  obtenerCantidadItems(): number {
    return this.carritoSubject.value.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  async limpiarCarrito(): Promise<void> {
    const id = this.obtenerOGenerarCarritoId();

    this.carritoSubject.next([]);
    this.eliminarCarritoDeFirestore(id);
  }

  private guardarCarritoEnFirestore(id: string, carrito: ItemCarrito[]): void {
    const docRef = doc(this.collectionRef, id);
    setDoc(docRef, { items: carrito }).catch((err) =>
      console.error('Error al guardar carrito:', err)
    );
  }

  async cargarCarritoDesdeFirestore(): Promise<void> {
    const id = this.obtenerOGenerarCarritoId();

    const docRef = doc(this.collectionRef, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as { items: ItemCarrito[] };
      this.carritoSubject.next(data.items);
    }
  }

  private eliminarCarritoDeFirestore(id: string): void {
    const docRef = doc(this.collectionRef, id);
    deleteDoc(docRef).catch((err) =>
      console.error('Error al eliminar carrito:', err)
    );
  }

  async enviarPedidoPorWhatsApp(nombreCliente: string, direccionCliente: string): Promise<void> {
    const carrito = this.carritoSubject.value;
  
    if (carrito.length === 0) {
      console.warn('El carrito está vacío');
      return;
    }
  
    const idBusiness = carrito[0]?.producto.businessId;
    if (!idBusiness) {
      console.error('No se encontró el ID del negocio en el carrito');
      return;
    }
  
    const numero = await this.businessIn.getWhatsappByBusinessId(idBusiness);
    if (!numero) {
      console.error('No se encontró el número de WhatsApp del negocio');
      return;
    }
  
    let mensaje = `Hola, deseo realizar el siguiente pedido:%0A`;
    mensaje += `👤 *Nombre:* ${nombreCliente}%0A`;
    mensaje += `🏠 *Dirección:* ${direccionCliente}%0A%0A`;
  
    carrito.forEach((item) => {
      mensaje += `• ${item.producto.nombre} x${item.cantidad} - C$${item.producto.precio * item.cantidad}%0A`;
    });
  
    const total = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    mensaje += `%0A💰 *Total:* C$${total}`;

    mensaje += `%0A🚚 *Nota:* El delivery tiene un costo adicional según su ubicación.`;
  
    const url = `https://api.whatsapp.com/send/?phone=505${numero}&text=${mensaje}&type=phone_number&app_absent=0`;
  
    window.open(url, '_blank');
  }
  

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
}
