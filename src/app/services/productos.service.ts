import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Producto } from '../models/producto.model';
import { BusinessInfoService } from './business.info.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private collectionName = 'productos';

  private categoriaActivaSubject = new BehaviorSubject<string>('todas');
  categoriaActiva$ = this.categoriaActivaSubject.asObservable();

  constructor(
    private firestore: Firestore,
  ) {}

  getProductosPorNegocio(businessId: string): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    const q = query(productosRef, where('businessId', '==', businessId));
    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  obtenerProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, this.collectionName);
    return collectionData(productosRef, { idField: 'id' }) as Observable<
      Producto[]
    >;
  }

  cambiarCategoria(categoria: string): void {
    this.categoriaActivaSubject.next(categoria);
  }

  crearProducto(producto: Producto): Promise<any> {
    const productosRef = collection(this.firestore, this.collectionName);
    return addDoc(productosRef, producto);
  }

  actualizarProducto(id: string, producto: Partial<Producto>): Promise<void> {
    const productoRef = doc(this.firestore, this.collectionName, id);
    return updateDoc(productoRef, producto);
  }

  eliminarProducto(id: string): Promise<void> {
    const productoRef = doc(this.firestore, this.collectionName, id);
    return deleteDoc(productoRef);
  }
}
