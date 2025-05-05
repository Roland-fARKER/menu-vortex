import { Injectable, inject } from "@angular/core";
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import type { Categoria, Producto } from "../models/producto.model";

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  private firestore = inject(Firestore);
  private collectionName = "productos";

  private categoriaActivaSubject = new BehaviorSubject<string>("todas");
  categoriaActiva$ = this.categoriaActivaSubject.asObservable();

  private categorias: Categoria[] = [
    { id: "todos", nombre: "Todo" },
    { id: "hamburguesas", nombre: "Hamburguesas" },
    { id: "pizzas", nombre: "Pizzas" },
    { id: "tacos", nombre: "Tacos" },
    { id: "ensaladas", nombre: "Ensaladas" },
    { id: "sushi", nombre: "Sushi" },
    { id: "pastas", nombre: "Pastas" },
    { id: "burritos", nombre: "Burritos" },
  ];

  constructor() {}

  obtenerProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, this.collectionName);
    return collectionData(productosRef, { idField: "id" }) as Observable<Producto[]>;
  }

  obtenerCategorias(): Categoria[] {
    return this.categorias;
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
