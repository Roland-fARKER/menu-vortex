import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, Business, AuthState } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initialState: AuthState = {
    user: null,
    business: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  private authStateSubject = new BehaviorSubject<AuthState>(
    this.getInitialState()
  );
  authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Verificar si hay una sesión guardada al iniciar
    this.checkSavedSession();
  }

  private getInitialState(): AuthState {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return this.initialState;
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

  private updateState(newState: Partial<AuthState>): void {
    const currentState = this.authStateSubject.value;
    const updatedState = { ...currentState, ...newState };
    this.authStateSubject.next(updatedState);

    // Guardar en localStorage (excepto durante carga o errores)
    if (!updatedState.isLoading && !updatedState.error) {
      localStorage.setItem('authState', JSON.stringify(updatedState));
    }
  }

  login(email: string, password: string): Observable<User> {
    this.updateState({ isLoading: true, error: null });

    const foundUser = this.getMockUsers().find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      const error = 'Credenciales incorrectas';
      this.updateState({ isLoading: false, error });
      return throwError(() => new Error(error));
    }

    const business = this.getMockBusinesses().find(
      (b) => b.ownerId === foundUser.id
    );
    const { password: _, ...secureUser } = foundUser;

    const user = secureUser as User;

    this.updateState({
      user,
      business,
      isAuthenticated: true,
      isLoading: false,
    });

    return of(user).pipe(delay(800));
  }

  register(
    user: User,
    business: Business
  ): Observable<{ user: User; business: Business }> {
    this.updateState({ isLoading: true, error: null });

    // Simulación de API - En producción, esto sería una llamada real a un backend
    return of({ user, business }).pipe(
      delay(1000), // Simular latencia de red
      tap((result) => {
        // Generar IDs simulados
        const newUser = {
          ...result.user,
          id: 'user_' + Date.now(),
          createdAt: new Date(),
        };

        const newBusiness = {
          ...result.business,
          id: 'business_' + Date.now(),
          ownerId: newUser.id,
          createdAt: new Date(),
        };

        // Eliminar la contraseña antes de almacenar el usuario
        const { password, ...secureUser } = newUser;

        this.updateState({
          user: secureUser as User,
          business: newBusiness,
          isAuthenticated: true,
          isLoading: false,
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authState');
    this.authStateSubject.next(this.initialState);
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    this.updateState({ isLoading: true });

    return of({
      ...this.authStateSubject.value.user,
      ...userData,
    } as User).pipe(
      delay(500),
      tap((updatedUser) => {
        this.updateState({
          user: updatedUser,
          isLoading: false,
        });
      })
    );
  }

  updateBusinessProfile(businessData: Partial<Business>): Observable<Business> {
    this.updateState({ isLoading: true });

    return of({
      ...this.authStateSubject.value.business,
      ...businessData,
    } as Business).pipe(
      delay(500),
      tap((updatedBusiness) => {
        this.updateState({
          business: updatedBusiness,
          isLoading: false,
        });
      })
    );
  }

  // Métodos auxiliares para simular una base de datos
  private getMockUsers(): User[] {
    return [
      {
        id: 'user_1',
        name: 'Admin Demo',
        email: 'admin@demo.com',
        phone: '555-1234',
        password: 'password123',
        role: 'owner',
        createdAt: new Date('2023-01-01'),
      },
    ];
  }

  private getMockBusinesses(): Business[] {
    return [
      {
        id: 'business_1',
        ownerId: 'user_1',
        name: 'Restaurante Demo',
        description: 'El mejor restaurante de la ciudad',
        logo: 'assets/vortex-logo.png',
        coverImage: 'assets/placeholder-banner.png',
        location: {
          lat: 19.4326,
          lng: -99.1332,
          address:
            'Av. Paseo de la Reforma 222, Juárez, 06600 Ciudad de México, CDMX',
        },
        socialMedia: {
          facebook: 'https://facebook.com/restaurantedemo',
          instagram: 'https://instagram.com/restaurantedemo',
          twitter: 'https://twitter.com/restaurantedemo',
          website: 'https://restaurantedemo.com',
        },
        createdAt: new Date('2023-01-01'),
      },
    ];
  }
}
