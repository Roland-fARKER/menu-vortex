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

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private animarCarritoSubject = new BehaviorSubject<boolean>(false);
  animarCarrito$ = this.animarCarritoSubject.asObservable();

  private collectionRef: CollectionReference;

  constructor(private firestore: Firestore) {
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
    return this.carritoSubject.value.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
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

  enviarPedidoPorWhatsApp(
    nombreCliente: string,
    direccionCliente: string
  ): void {
    const numero = '50557337508';
    const carrito = this.carritoSubject.value;

    if (carrito.length === 0) {
      console.warn('El carrito está vacío');
      return;
    }

    let mensaje = `Hola, deseo realizar el siguiente pedido:%0A`;
    mensaje += `👤 *Nombre:* ${nombreCliente}%0A`;
    mensaje += `🏠 *Dirección:* ${direccionCliente}%0A%0A`;

    carrito.forEach((item) => {
      mensaje += `• ${item.producto.nombre} x${item.cantidad} - C$${
        item.producto.precio * item.cantidad
      }%0A`;
    });

    const total = this.obtenerTotal();
    mensaje += `%0A💰 *Total:* C$${total}`;
    mensaje += `%0A🚚 *Nota:* El delivery tiene un costo adicional según su ubicación.`;

    const url = `https://api.whatsapp.com/send/?phone=${numero}&text=${mensaje}&type=phone_number&app_absent=0`;

    window.open(url, '_blank');
  }
}
