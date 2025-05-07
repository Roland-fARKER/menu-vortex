import { Categoria, Producto } from './../models/producto.model';
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

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private collectionName = 'menu_categorias';

  constructor(private firestore: Firestore) {}

  obtenerCategorias(): Observable<Categoria[]> {
    const productosRef = collection(this.firestore, this.collectionName);
    return collectionData(productosRef, { idField: 'id' }) as Observable<Categoria[]>;
  }

  obtenerCategoriasPorNegocio(businessId: string): Observable<Categoria[]> {
    const categoriasRef = collection(this.firestore, this.collectionName);
    const q = query(categoriasRef, where('businessId', '==', businessId));
    return collectionData(q, { idField: 'id' }) as Observable<Categoria[]>;
  }

  crearCategoria(cat: Categoria): Promise<any> {
    const categoriRef = collection(this.firestore, this.collectionName);
    return addDoc(categoriRef, cat);
  }

  actualizarCategoria(id: string, cat: Partial<Categoria>): Promise<void> {
    const categoriRef = doc(this.firestore, this.collectionName, id);
    return updateDoc(categoriRef, cat);
  }

  eliminarCategoria(id: string): Promise<void> {
    const categoriRef = doc(this.firestore, this.collectionName, id);
    return deleteDoc(categoriRef);
  }
}
