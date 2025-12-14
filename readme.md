# 📸 Galeria_Laravel: Plataforma de Galería Fotográfica y Pedidos [![GitHub Actions CI/CD Status](https://github.com/SirBeho/Galeria_Laravel/actions/workflows/main.yml/badge.svg)](https://github.com/SirBeho/Galeria_Laravel/actions/workflows/main.yml)

<img src="https://simpleskill.icons.workers.dev/svg?i=laravel,react,tailwindcss,mysql,vite,php" height="40">

## Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Comandos por Entorno](#comandos-por-entorno)
- [Despliegue y CI/CD](#despliegue-y-cicd-automatizado)
- [Contribución](#contribución)
- [Autor](#autor)

## ✨ Descripción y Arquitectura

El proyecto `Galeria_Laravel` es una aplicación web moderna diseñada para la **visualización optimizada de catálogos fotográficos** y la gestión de **pedidos de artículos**. Utiliza una arquitectura monolítica híbrida impulsada por **Inertia.js**, lo que permite construir una *Single Page Application* (SPA) utilizando el enrutamiento y controladores clásicos de Laravel junto con la reactividad de React.

El sistema está optimizado para manejar grandes volúmenes de imágenes con un enfoque en la experiencia de usuario (UX), minimizando los tiempos de carga y facilitando la interacción comercial a través de WhatsApp.

> **Frontend (React + Inertia)**
Proporciona una experiencia de usuario fluida sin recargas de página completas. Gestiona el estado visual de la galería (columnas, filtros), el carrito de compras y la carga diferida (*Lazy Loading*) de imágenes.

> **Backend (Laravel)**
Actúa como el núcleo robusto del sistema, gestionando el sistema de archivos (*Filesystem*), la autenticación de administradores, la validación de datos y el procesamiento de eliminación masiva de recursos.

> **Base de Datos (MySQL)**
Almacena la información de los productos, usuarios administradores y registros de pedidos para un control eficiente del inventario y ventas.

## 📸 Capturas de Pantalla

| Galería Principal  | Detalle de Producto (Modal) |
| :---: | :---: |
| ![Home View](./public/Info/home.png) | ![Modal View](./public/Info/modal_tablet.png) | 

| Carrito de Pedidos | Vista Móvil |
| :---: | :---: |
| ![Cart View](./public/Info/carrito.png) |![Mobile View](./public/Info/home_tablet.png) | 
---

## 🎯 Funcionalidades Clave

### 1. Experiencia Visual y Rendimiento
* **Lazy Loading Inteligente:** Implementación de componentes de carga diferida (`LazyLoadedImage`) para asegurar que el navegador solo descargue las imágenes visibles en el *viewport*, mejorando drásticamente el rendimiento inicial.
* **Layout Adaptable:** El usuario puede alternar dinámicamente la visualización de la grilla (1, 2 o 3 columnas) según su preferencia, persistiendo la configuración en el navegador.
* **Categorización Dinámica:** Navegación instantánea entre categorías principales (ej. "Galería Principal" vs "Juguetes") sin latencia.

### 2. E-Commerce y Pedidos
* **Carrito de Compras Persistente:** Gestión del estado del carrito mediante `localStorage`, permitiendo a los usuarios navegar libremente sin perder sus selecciones.
* **Integración con WhatsApp:** Sistema de "Checkout" que genera un resumen detallado del pedido y redirige automáticamente al cliente a WhatsApp para finalizar la compra directamente con el vendedor.
* **Modales Interactivos:** Uso de ventanas modales para ver detalles de productos, confirmar acciones y gestionar el carrito sin salir de la galería.
* **Enlaces de Seguimiento Seguro:** Generación de URLs únicas protegidas por tokens de seguridad (key), permitiendo a los clientes consultar el detalle de su pedido sin necesidad de crear una cuenta de usuario.

### 3. Administración y Gestión
* **Gestión de Archivos (Storage):** Carga y eliminación segura de imágenes utilizando el sistema de almacenamiento de Laravel (`storage/app/public`).
* **Eliminación Masiva:** Herramienta administrativa que permite seleccionar múltiples imágenes visualmente y eliminarlas en lote con una sola petición al servidor.
* **Seguridad:** Rutas protegidas mediante *Middleware* de autenticación de Laravel para asegurar que solo los administradores puedan modificar el catálogo.

---

## ⚙️ Tecnologías Utilizadas

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=react" height="40"> Frontend</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=react" height="20"> React</span>**
  - Librería principal para la interfaz de usuario reactiva.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://avatars.githubusercontent.com/u/47703742?s=200&v=4" height="20"> Inertia.js</span>**
  - El "pegamento" que conecta Laravel y React, permitiendo construir una SPA sin una API compleja.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=tailwindcss" height="20"> Tailwind CSS</span>**
  - Framework de utilidades para un diseño rápido, responsivo y moderno.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=javascript" height="20"> Headless UI</span>**
  - Componentes accesibles y sin estilos (Modales, Dialogs) integrados con Tailwind.

---

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=laravel" height="40"> Backend</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=laravel" height="20"> Laravel</span>**
  - Framework PHP robusto para la lógica del servidor, enrutamiento y seguridad.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=php" height="20"> PHP</span>**
  - Lenguaje base del servidor.

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://cdn-icons-png.flaticon.com/512/5925/5925232.png"  height="20"> Illuminate/Filesystem</span>**
  - Gestión avanzada de discos y almacenamiento de imágenes.

---
### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=mysql" height="40"> Base de Datos</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
  <img src="https://simpleskill.icons.workers.dev/svg?i=mysql" height="20">  MySQL</span>**
  - Almacenamiento relacional para usuarios y metadatos de pedidos.

---

### <span style="display: inline-flex; align-items: center;gap:10px"><img src="https://ekiip.com/wp-content/uploads/2020/01/cropped-devops.png"  width="50"> Herramientas y DevOps</span>

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=vite" height="20">  Vite</span>**
  - Empaquetador de módulos de próxima generación para un desarrollo frontend ultrarrápido.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://simpleskill.icons.workers.dev/svg?i=githubactions" height="20">  GitHub Actions</span>**
  - Automatización de CI/CD para despliegues.

- **<span style="display: inline-flex; align-items: center;gap:10px">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" height="20">  VS Code</span>**
  - Entorno de desarrollo con extensiones para PHP y React.

- **<span style="display: inline-flex; align-items: center;gap:10px"><img src="https://simpleskill.icons.workers.dev/svg?i=cypress" height="20"> Cypress</span>**

    - Testing End-to-End (E2E) para automatización de navegadores y pruebas de integración.

- **<span style="display: inline-flex; align-items: center;gap:10px"><img src="https://phpunit.de/img/phpunit.svg" width="30"> PHPUnit</span>**

    - Framework de pruebas unitarias y de características para la lógica del backend.
---
## 🧪 Testing y Aseguramiento de Calidad (QA)

El proyecto cuenta con una estrategia de testing híbrida que asegura tanto la lógica de negocio en el servidor como la experiencia del usuario final en el navegador.

### 1. Backend Testing (PHPUnit)
Se utiliza **PHPUnit** con base de datos en memoria (`sqlite :memory:`) y **Storage Mocks** para validar la lógica crítica sin ensuciar el entorno de producción.

| Suite de Pruebas | Cobertura Principal |
| :--- | :--- |
| **📸 Carga de Imágenes** | • Validación de tipos MIME y tamaños.<br>• Simulación de sistema de archivos (`Storage::fake`).<br>• Renombrado secuencial de archivos (52.jpg, 53.jpg...). |
| **🗑️ Gestión de Archivos** | • Eliminación segura de imágenes.<br>• Manejo de errores ante archivos inexistentes.<br>• Protección de rutas administrativas. |
| **📦 Procesamiento de Pedidos** | • Validación estricta de payloads JSON.<br>• Generación correcta de enlaces de **WhatsApp**.<br>• Integración y consistencia en Base de Datos. |
| **🔒 Seguridad de Vistas** | • Acceso denegado a pedidos con claves (keys) inválidas.<br>• Redirección de usuarios no autenticados. |

### 2. End-to-End Testing (Cypress)
Se utiliza **Cypress** para simular la interacción real de un usuario en un navegador Chrome, validando flujos completos y persistencia de datos.


Suite / Flujo | Escenarios Críticos Validados |
| :--- | :--- |
| **🛒 Flujo Crítico de Compra** | • Ciclo completo: `Galería` -> `Carrito` -> `Checkout` -> `WhatsApp`.<br>• Validación de ventanas modales y alertas nativas (`window.alert`, `window.open`).<br>• Bloqueo de envío de formulario si el carrito se vacía intencionalmente. |
| **💾 Persistencia & UX** | • **Resiliencia:** Verificación de que los ítems del carrito sobreviven a una recarga de página (`F5`) .<br>• **Preferencias:** Persistencia de la configuración visual (Grid de 1 vs 3 columnas) tras recargar el navegador. |
| **🛡️ Panel Administrativo** | • **Gestión de Estado:** Cambio de estatus de pedido (Pendiente -> Completado) vía AJAX/Inertia sin recarga completa.<br>• **Visualización:** Renderizado correcto de tablas de datos y coincidencia de detalles de pedido. |
| **🔑 Autenticación** | • Protección de rutas `/panel` y `/subir` contra accesos directos.<br>• Flujo de Login exitoso y manejo de errores de credenciales. |


## 🚀 Despliegue y CI/CD Automatizado

El proyecto utiliza **GitHub Actions** para orquestar un pipeline de integración y despliegue continuo. Este flujo de trabajo asegura que solo el código estable y probado llegue al entorno de producción.

### Workflow del Pipeline (`laravel.yml`)
Cada vez que se realiza un `push` a la rama `main`, se activan secuencialmente las siguientes etapas:

| Etapa | Descripción |
| :--- | :--- |
| **1. Frontend Build** | Instalación de dependencias NPM y ejecución de `npm run build` para generar y minificar los assets estáticos (CSS/JS) con Vite. |
| **2. Quality Gate (PHPUnit)** | Ejecución de la suite de pruebas **PHPUnit** (Backend). Valida la lógica, integridad de la base de datos y el sistema de archivos (Storage Mocks). |
| **3. Quality Gate (Cypress E2E)** | **Ejecución de las pruebas End-to-End de Cypress**. Asegura que la capa de React/Inertia funcione correctamente y que el flujo de compra crítica (carrito, formulario) sea exitoso. |
| **4. Backend Optimization** | Instalación de dependencias de Composer optimizadas (`--no-dev`) para reducir el peso y mejorar el rendimiento en producción. |
| **5. FTP Deployment** | Sincronización inteligente de archivos (incluyendo los assets compilados) con el servidor de destino utilizando las credenciales seguras de FTP. |

### Configuración de Secretos
Para replicar este entorno, es necesario configurar los siguientes **GitHub Secrets** en el repositorio:

| Variable Secreta | Propósito |
| :--- | :--- |
| `FTP_SERVER` | Dirección IP o dominio del host FTP. |
| `FTP_USERNAME` | Usuario FTP con permisos de escritura en la carpeta pública. |
| `FTP_PASSWORD` | Contraseña de acceso FTP. |


> **Nota:** El despliegue excluye automáticamente archivos innecesarios como `.git`, `node_modules` (de desarrollo) y archivos de configuración de tests para mantener el servidor limpio.

---

## 📝 Comandos por Entorno

### **Backend (Laravel)**

| **Comando** | **Descripción** |
|-----------------------|-------------------------------------------------|
| `php artisan serve`   | Inicia el servidor de desarrollo local. |
| `php artisan migrate` | Ejecuta las migraciones de base de datos. |
| `php artisan optimize:clear` | Limpia caché de configuración, rutas y vistas. |

### **Frontend (React + Vite)**

| **Comando** | **Descripción** |
|-----------------|----------------------------------------------------|
| `npm run dev`   | Inicia el servidor de desarrollo con *Hot Module Replacement* (HMR). |
| `npm run build` | Compila y minifica los assets para producción en la carpeta `public/build`. |

---

## 🤝 Contribución

¡Tu ayuda es bienvenida para mejorar esta galería!

1.  Haz un fork del repositorio.
2.  Crea una rama (`git checkout -b feature/nueva-mejora`).
3.  Haz tus cambios y commit (`git commit -m 'Mejora: Agregado filtro por precio'`).
4.  Haz push a la rama (`git push origin feature/nueva-mejora`).
5.  Abre un Pull Request.

---

<h2 style="font-size: 1.5rem; font-weight: 600; border-bottom: 2px solid #3182ce">🧑‍💻 Autor</h2>
 <table >
                <tbody id="simbolo">
                <tr><td style="display: flex;"><div style="width: 10rem; height: 13rem; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" ><img src="https://raw.githubusercontent.com/SirBeho/compilador/refs/heads/master/img/ouner.jpg" alt="Descripción de la imagen"  style="width: 26rem; height: 13rem; object-fit: cover;border-radius: 0.5rem;"/></div></td><td> 
                
<p style="display: block; font-size: 2rem; font-weight: 700;">Ing. Benjamin Tavarez</p>         

<p style="margin-top: 0.5rem; font-size: 1rem;">Este proyecto fue desarrollado por <a href="https://github.com/SirBeho" style="color: #3182ce; text-decoration: underline;">Benjamin Tavarez</a> con el objetivo de ofrecer una solución robusta y visualmente atractiva para la gestión de catálogos y pedidos simplificados. Todos los derechos reservados.</p>

<p style="margin-top: 0.25rem; font-size: 0.875rem;">Si tienes alguna pregunta, propuesta o comentario sobre este proyecto, no dudes en ponerte en contacto conmigo a través de <a href="mailto:benjamin.tavarez.98@gmail.com" style="color: #3182ce; text-decoration: underline;">benjamin.tavarez.98@gmail.com</a> o en <a href="https://www.linkedin.com/in/benjamin-tavarez-cruceta-052aa623b/" style="color: #3182ce; text-decoration: underline;">LinkedIn</a>.</p>
</td>         
  </tr>
  </tbody>
</table>