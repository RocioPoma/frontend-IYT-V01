# Frontend IYT: Sistema de campeonatos de la Integración Yaretanense

Aplicación **Angular 22** + Angular Material.

## Ejecutar en local

Requisitos: **Node.js 22** y el backend corriendo en `http://localhost:4000`.

```bash
npm install
npm start          # http://localhost:4200
```

- `src/environments/environment.ts`: URL del backend en desarrollo.
- `src/environments/environment.prod.ts`: URL del backend en producción (Render o Contabo).

## Construir para producción

```bash
npm run build      # genera dist/Frontend
```

Netlify usa `netlify.toml`: comando `npm run build`, carpeta `dist/Frontend`, Node 22.

## Estructura relevante

| Carpeta / archivo | Contenido |
|---|---|
| `src/app/home` | Página pública (RF01): partidos en vivo y próximos, fixture, tabla, ranking, medallero, noticias y campos de juego |
| `src/app/competencia` | Componentes reutilizables: tabla de posiciones, ranking, fixture, programar partido y medallero |
| `src/app/shared/permisos.ts` | Roles y permisos (los mismos grupos que el backend) |
| `src/app/shared/reporte-pdf.ts` | Generador común de reportes PDF |
| `src/app/servicios/sesion.service.ts` | Renueva la sesión mientras hay actividad y la cierra tras 30 min de inactividad |

## Roles

`admin`, `presidente`, `comite_tecnico`, `responsable_categoria` y `delegado`. El menú y las pantallas
se muestran según `shared/permisos.ts`; el backend vuelve a validar cada operación.
