# Raygents AI — Agency website

Web de una agencia de IA para constructoras, empresas de HVAC, cubiertas comerciales y otros contratistas en Estados Unidos. Las dos ofertas principales son agentes de voz para recepción y citas, y CRM personalizados con IA. Marca elegida por el usuario: **Raygents AI**. La disponibilidad legal de la marca y la compra del dominio propio siguen pendientes.

## Abrir la web

Abre `index.html` con Safari, Chrome, Edge o Firefox. Los estilos, el logo y las librerías están guardados en el proyecto; no se necesitan fuentes remotas ni servicios externos para visualizarla.

Para trabajar con servidor local, usando Node.js 22 o posterior:

```sh
pnpm install
pnpm dev
```

La vista previa sirve en `http://localhost:4173`. También puedes usar `npm install` y `npm run dev` si prefieres npm.

## Qué incluye

- Identidad Deep Current: gris suave `#EEF2F6`, azul océano `#376C98`, azul hielo `#B3D9F3` y azul abisal `#091726`.
- Logotipo vectorial original de una manta raya, con variantes azul, clara y oscura y favicon a juego.
- Portada con manta raya WebGL: movimiento lento de alas, reflejos azul plata, cola flexible y respuesta suave al cursor.
- Navegación de cristal, tipografía de gran formato y secciones con contraste claro/oscuro.
- Narrativa de tres capítulos: llamada → cita → CRM. Sigue el scroll en escritorio y usa controles táctiles en móvil.
- Barra de progreso, transiciones, animaciones de entrada y microinteracciones.
- Control para pausar animaciones; respeto a movimiento reducido y transparencia reducida.
- Renderizado 3D detenido fuera de pantalla o al ocultar la pestaña, resolución acotada y alternativa SVG si WebGL no está disponible.
- Presentación de agentes de voz y CRM a medida.
- Tres conversaciones ilustrativas: servicio HVAC, cambio de visita de obra e inspección de una cubierta comercial.
- Audio opcional generado por el sintetizador del navegador. No es un agente real ni una demostración de calidad de un proveedor de voz.
- CRM de ejemplo con oportunidades, contactos de propiedades, visitas y seguimiento de presupuestos.
- Casos de uso para HVAC, cubiertas comerciales, construcción y otros oficios.
- Proceso de trabajo, FAQ y formulario con selección de sector y validación.
- Diseño adaptable a móvil, navegación por teclado y preferencias de movimiento reducido.

## Formulario y publicación

El formulario está en **modo de vista previa**: prepara y descarga un resumen del proyecto en formato `.txt`. No manda correos, no crea citas y no guarda datos en una base de datos.

Para enviar consultas reales, añade antes de `app.js` una configuración como esta y conecta un endpoint que valide los datos y gestione entrega, protección contra spam y errores:

```html
<script>
  window.RAYGENTS_CONFIG = {
    contactEndpoint: 'https://TU-SERVIDOR.example/inquiries'
  };
</script>
```

El endpoint debe aceptar JSON por POST y devolver 2xx únicamente cuando la consulta se haya aceptado correctamente. El formulario muestra un error si el envío falla o supera 15 segundos. Si está en otro dominio, configura CORS. Nunca pongas claves privadas en el frontend.

Antes de lanzamiento comercial: confirmar marca y dominio, añadir identidad legal y contacto real, publicar la política de privacidad y conectar la recepción de consultas o un calendario comercial. No hay agentes de producción, CRM real ni integraciones de cliente en esta landing.

## Empaquetar

```sh
pnpm build
```

Genera `dist/` con los archivos públicos para alojamiento estático. La fuente editable y la copia de la web anterior no se incluyen en ese paquete.

Para actualizar los archivos locales de las librerías tras cambiar dependencias:

```sh
pnpm vendor
pnpm build
```

## Archivos

- `index.html`: contenido y estructura.
- `styles.css`: componentes base y diseño adaptable.
- `assets/experience.css`: dirección visual Deep Current y ajustes ópticos.
- `assets/experience.js`: manta animada, narrativa de scroll y control de movimiento.
- `app.js`: animaciones, demos, formulario y navegación.
- `assets/brand.svg`: favicon de la marca propuesta.
- `assets/manta-mark.svg`, `manta-mark-light.svg`, `manta-mark-dark.svg`: logo escalable con fondo transparente.
- `docs/OCEAN-BRAND.md`: paleta, sistema de marca y verificación de esta actualización.
- `assets/vendor/`: Motion, Lenis y sus licencias.
- `docs/BRAND-AND-TOOLS.md`: investigación de nombre, repositorios y MCPs.
- `docs/VERIFICATION.md`: comprobaciones y limitaciones.
- `ray-agents-original.html`: copia intacta de la web anterior.

Una versión anterior bajo la marca Avelqia se publicó como **Site privado para el propietario**:

https://avelqia-studio.mescuu.chatgpt.site

La publicación fue confirmada por Sites con estado `succeeded`. No se ha abierto el sitio al público, contratado servicios de pago ni comprado dominios.

La identidad del Site está guardada en `.openai/hosting.json`; reutilízala para futuras publicaciones. El checkout con la fuente sincronizada está en `sites/avelqia/`, con su propio manifiesto y repositorio. Al editar la fuente principal, ejecuta el build y sincroniza `dist/` en ese checkout antes de publicar la nueva versión.

## Vercel — publicación de producción

La versión Raygents AI / Deep Current se publica en **https://raygents.vercel.app**.

- Proyecto: `raygents`, cuenta `mescus-projects`.
- Deployment: `dpl_FseZKZu59fQCec5tdDRNHg7kfiEy` (estado `READY`).
- Se publicó el contenido estático de `dist/` mediante el plugin de Vercel.
- `vercel.json` configura el build local/remoto y la carpeta de salida para futuras publicaciones por CLI; `.vercel/project.json` conserva el vínculo local con el proyecto correcto.
- La publicación no activa un agente de voz de producción ni cambia el formulario de demostración.
- El Site privado anterior sigue disponible de forma independiente.
