import { provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    // La aplicación usa zone.js para detectar cambios (desde Angular 21 el modo por defecto es sin zone.js)
    applicationProviders: [provideZoneChangeDetection({ eventCoalescing: true })],
  })
  .catch((err) => console.error(err));
