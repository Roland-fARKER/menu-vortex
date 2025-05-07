import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthState, User} from '../../models/auth.model';
import { Auth, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, getDoc, collection, query, where, getDocs, Timestamp } from '@angular/fire/firestore';
import { Business } from '../../models/business.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private initialState: AuthState = {
    user: null,
    business: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  private authStateSubject = new BehaviorSubject<AuthState>(this.getInitialState());
  authState$ = this.authStateSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    this.checkSavedSession();
  }

  private getInitialState(): AuthState {
    const savedState = localStorage.getItem('authState');
    return savedState ? JSON.parse(savedState) : this.initialState;
  }

  private updateState(newState: Partial<AuthState>): void {
    const currentState = this.authStateSubject.value;
    const updatedState = { ...currentState, ...newState };
    this.authStateSubject.next(updatedState);
    if (!updatedState.isLoading && !updatedState.error) {
      localStorage.setItem('authState', JSON.stringify(updatedState));
    }
  }

  private checkSavedSession(): void {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.isAuthenticated && state.user) {
        this.authStateSubject.next(state);
      }
    }
  }

  register(user: User, business: Business): Observable<{ user: User; business: Business }> {
    this.updateState({ isLoading: true, error: null });
  
    return from(
      createUserWithEmailAndPassword(this.auth, user.email, user.password!)
    ).pipe(
      switchMap((userCredential) => {
        const userId = userCredential.user.uid;
  
        // Crear el objeto de usuario sin la contraseña
        const newUser: User = {
          ...user,
          id: userId,
          createdAt: new Date(),
        };
  
        const { password, ...userToSave } = newUser; // Eliminar password
  
        // Crear el negocio vinculado al usuario
        const newBusiness: Business = {
          ...business,
          id: 'business_' + Date.now(),
          ownerId: userId,
          createdAt:  Timestamp.now(),
        };
  
        const userRef = doc(this.firestore, `users/${userId}`);
        const businessRef = doc(this.firestore, `businesses/${newBusiness.id}`);
  
        return from(Promise.all([
          setDoc(userRef, userToSave),
          setDoc(businessRef, newBusiness)
        ])).pipe(
          tap(() => {
            this.updateState({
              user: userToSave as User,
              business: newBusiness,
              isAuthenticated: true,
              isLoading: false,
            });
          }),
          map(() => ({ user: userToSave as User, business: newBusiness }))
        );
      }),
      catchError((error) => {
        this.updateState({ isLoading: false, error: error.message });
        return throwError(() => new Error(error.message));
      })
    );
  }
  

  login(email: string, password: string): Observable<User> {
    this.updateState({ isLoading: true, error: null });
  
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred) => {
        const userId = cred.user.uid;
        const userRef = doc(this.firestore, `users/${userId}`);
        const businessCollection = collection(this.firestore, 'businesses');
        const q = query(businessCollection, where('ownerId', '==', userId));
  
        return from(Promise.all([
          getDoc(userRef),
          getDocs(q)
        ])).pipe(
          tap(([userSnap, businessQuerySnap]) => {
            const user = userSnap.data() as User;
            const business = !businessQuerySnap.empty
              ? businessQuerySnap.docs[0].data() as Business
              : null;
  
            this.updateState({
              user,
              business,
              isAuthenticated: true,
              isLoading: false
            });
          }),
          switchMap(([userSnap, _]) => of(userSnap.data() as User))
        );
      }),
      catchError(err => {
        this.updateState({ isLoading: false, error: err.message });
        return throwError(() => new Error(err.message));
      })
    );
  }

  logout(): void {
    signOut(this.auth).then(() => {
      localStorage.removeItem('authState');
      this.authStateSubject.next(this.initialState);
    });
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.authStateSubject.value.user;
    if (!currentUser) return throwError(() => new Error('No user logged in'));

    const userRef = doc(this.firestore, `users/${currentUser.id}`);
    const updatedUser = { ...currentUser, ...userData };

    return from(setDoc(userRef, updatedUser, { merge: true })).pipe(
      tap(() => {
        this.updateState({ user: updatedUser });
      }),
      switchMap(() => of(updatedUser))
    );
  }

  updateBusinessProfile(businessData: Partial<Business>): Observable<Business> {
    const currentBusiness = this.authStateSubject.value.business;
    if (!currentBusiness) return throwError(() => new Error('No business found'));

    const businessRef = doc(this.firestore, `businesses/${currentBusiness.id}`);
    const updatedBusiness = { ...currentBusiness, ...businessData };

    return from(setDoc(businessRef, updatedBusiness, { merge: true })).pipe(
      tap(() => {
        this.updateState({ business: updatedBusiness });
      }),
      switchMap(() => of(updatedBusiness))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const currentUser = this.auth.currentUser;
  
    if (!currentUser || !currentUser.email) {
      return throwError(() => new Error("Usuario no autenticado o sin email"));
    }
  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  
    return from(reauthenticateWithCredential(currentUser, credential)).pipe(
      switchMap(() => from(updatePassword(currentUser, newPassword))),
      tap(() => {
        console.log("Contraseña actualizada correctamente");
      }),
      catchError(err => {
        console.error("Error al cambiar contraseña:", err);
        return throwError(() => new Error(err.message));
      })
    );
  }
}
