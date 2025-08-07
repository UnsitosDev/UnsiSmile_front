# OdontoFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

# UnsiSmile - Frontend

Aplicación web frontend para el sistema de gestión odontológica UnsiSmile, desarrollada con Angular 17 y un conjunto de tecnologías modernas para ofrecer una experiencia de usuario óptima.

## 🚀 Tecnologías Principales

- **Angular 17** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Angular Material** - Componentes UI
- **PrimeNG** - Biblioteca de componentes UI
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **Chart.js** - Gráficos y visualizaciones
- **NgRx** - Gestión de estado (si se implementa)

## 🛠️ Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js) o yarn
- Angular CLI (versión 17 o superior)

## 🚀 Configuración del Entorno

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd UnsiSmile_front
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

   - Copiar el archivo de ejemplo de variables de entorno:
     ```bash
     cp src/environments/environment.example.ts src/environments/environment.ts
     ```
   - Configurar las variables según sea necesario

4. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```
   La aplicación estará disponible en [http://localhost:4200/](http://localhost:4200/)

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes organizados por contexto
│   │   ├── private/         # Componentes que requieren autenticación
│   │   │   └── admins/      # Componentes específicos de administración
│   │   └── public/          # Componentes accesibles sin autenticación
│   │
│   ├── core/                # Funcionalidades centrales
│   │   ├── base/            # Clases base
│   │   └── interceptors/    # Interceptores HTTP
│   │
│   ├── guards/              # Guards de rutas para control de acceso
│   │
│   ├── shared/              # Recursos compartidos
│   │   ├── adapters/        # Adaptadores para servicios externos
│   │   ├── animations/      # Animaciones reutilizables
│   │   ├── components/      # Componentes compartidos
│   │   ├── models/          # Interfaces y tipos de datos
│   │   ├── pipes/           # Pipes personalizados
│   │   └── services/        # Servicios compartidos
│   │
│   └── utils/               # Utilidades y helpers
│
├── assets/                  # Recursos estáticos (imágenes, fuentes, etc.)
└── environments/            # Configuraciones de entorno
```

## 🛠️ Comandos Útiles

- **Iniciar servidor de desarrollo**: `ng serve`
- **Compilar para producción**: `ng build --configuration production`
- **Ejecutar pruebas unitarias**: `ng test`
- **Ejecutar linting**: `ng lint`
- **Generar componentes**: `ng generate component components/nombre-componente`
- **Generar servicios**: `ng generate service services/nombre-servicio`

## 🐳 Docker

El proyecto incluye configuración para Docker:

```bash
# Construir la imagen
sudo docker-compose build

# Iniciar los contenedores
sudo docker-compose up -d
```

## 🤝 Guía de Contribución

1. Hacer un fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feat/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Hacer push a la rama (`git push origin feat/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Estándares de Código

- Seguir las [guías de estilo de Angular](https://angular.io/guide/styleguide)
- Escribir mensajes de commit siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
- Documentar el código con comentarios claros y concisos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

Para soporte o consultas, contactar al equipo de desarrollo.

# UnsiSmile - Frontend

Aplicación web frontend para el sistema de gestión odontológica UnsiSmile, desarrollada con Angular 17 y un conjunto de tecnologías modernas para ofrecer una experiencia de usuario óptima.

## 🚀 Tecnologías Principales

- **Angular 17** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Angular Material** - Componentes UI
- **PrimeNG** - Biblioteca de componentes UI
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **Chart.js** - Gráficos y visualizaciones
- **NgRx** - Gestión de estado (si se implementa)

## 🛠️ Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js) o yarn
- Angular CLI (versión 17 o superior)

## 🚀 Configuración del Entorno

1. **Clonar el repositorio**

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd UnsiSmile_front
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

   - Copiar el archivo de ejemplo de variables de entorno:
     ```bash
     cp src/environments/environment.example.ts src/environments/environment.ts
     ```
   - Configurar las variables según sea necesario

4. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```
   La aplicación estará disponible en [http://localhost:4200/](http://localhost:4200/)

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes organizados por contexto
│   │   ├── private/         # Componentes que requieren autenticación
│   │   │   └── admins/      # Componentes específicos de administración
│   │   └── public/          # Componentes accesibles sin autenticación
│   │
│   ├── core/                # Funcionalidades centrales
│   │   ├── base/            # Clases base
│   │
│   ├── guards/              # Guards de rutas para control de acceso
│   │
│   ├── shared/              # Recursos compartidos
│   │   ├── adapters/        # Adaptadores para servicios externos
│   │   ├── animations/      # Animaciones reutilizables
│   │   ├── components/      # Componentes compartidos
│   │   ├── models/          # Interfaces y tipos de datos
│   │   ├── pipes/           # Pipes personalizados
│   │   └── services/        # Servicios compartidos
│   │
│   └── utils/               # Utilidades y helpers
│
├── assets/                  # Recursos estáticos (imágenes, fuentes, etc.)
└── environments/            # Configuraciones de entorno
```

## 🛠️ Comandos Útiles

- **Iniciar servidor de desarrollo**: `ng serve`
- **Compilar para producción**: `ng build --configuration production`
- **Ejecutar pruebas unitarias**: `ng test`
- **Ejecutar linting**: `ng lint`
- **Generar componentes**: `ng generate component components/nombre-componente`
- **Generar servicios**: `ng generate service services/nombre-servicio`

## 🐳 Docker

El proyecto incluye configuración para Docker:

```bash
# Construir la imagen
docker-compose build

# Iniciar los contenedores
docker-compose up -d
```

## 🤝 Guía de Contribución

1. Hacer un fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feat/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Hacer push a la rama (`git push origin feat/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Estándares de Código

- Seguir las [guías de estilo de Angular](https://angular.io/guide/styleguide)
- Escribir mensajes de commit siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
- Documentar el código con comentarios claros y concisos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📧 Contacto

Para soporte o consultas, contactar al equipo de desarrollo.

[Contacto](https://fr0ste.github.io/).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
