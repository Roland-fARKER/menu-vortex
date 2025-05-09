import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarritoComponent } from './components/carrito/carrito.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductoCardComponent } from './components/producto-card/producto-card.component';
import { MenuDigitalComponent } from './components/menu-digital/menu-digital.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { FormsModule } from '@angular/forms';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LandingComponent } from './components/landing/landing.component';

import {
  LucideAngularModule,
  CupSoda,
  Beef,
  Fish,
  Hamburger,
  Beer,
  Pizza,
  IceCreamCone,
  Tag,
  Newspaper,
  ShoppingCart,
  Pencil,
  ChartLine,
  MapPin,
  TabletSmartphone,
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    CarritoComponent,
    HeaderComponent,
    ProductoCardComponent,
    MenuDigitalComponent,
    AboutUsComponent,
    FooterComponent,
    ThemeToggleComponent,
    LocationMapComponent,
    LandingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LucideAngularModule.pick({
      CupSoda,
      Beef,
      Fish,
      Hamburger,
      Beer,
      Pizza,
      IceCreamCone,
      Tag,
      Newspaper,
      ShoppingCart,
      Pencil,
      ChartLine,
      MapPin,
      TabletSmartphone,
    }),
  ],
  providers: [
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'nova-b364a',
        appId: '1:544247291865:web:d178a325973e108064c3c8',
        storageBucket: 'nova-b364a.appspot.com',
        apiKey: 'AIzaSyAhkUROIiimbCWM_tuI-Ahq15dJmqTE1-s',
        authDomain: 'nova-b364a.firebaseapp.com',
        messagingSenderId: '544247291865',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
