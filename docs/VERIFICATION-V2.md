# Verificación — Avelqia / Flow v2

13 de octubre de 2026. Verificación local por HTTP en el navegador integrado de Codex.

## Visual y responsive
- Escritorio: 1440 × 1000.
- Tablet: 768 × 1024.
- Móvil: 390 × 844 y 320 × 812.
- Sin desbordamiento horizontal en las anchuras comprobadas (scrollWidth == clientWidth).
- Corregida la anchura intrínseca de la cuadrícula móvil y el encuadre del arte 3D.
- Contraste reforzado en textos secundarios, tablas, FAQ y formulario.
- Campos móviles a 16 px para evitar ampliación automática en navegadores móviles que la aplican.

## Funciones comprobadas
- Render WebGL activo, resolución acotada; consola sin errores ni avisos observados.
- Capítulos: llamada → reserva → ficha CRM. Desplazamiento y selección en escritorio; selección directa en móvil.
- Menú móvil: apertura, cierre al navegar y cambio de aria-expanded.
- Conversaciones: estados Reschedule y Ask a question actualizan transcripción y resultado.
- CRM: Contacts, Appointments y Take a look actualizan sus vistas.
- Sector: Real estate actualiza el título y flujo.
- FAQ: solo una pregunta abierta tras seleccionar dos.
- Formulario: apertura y cierre, campos requeridos, selección Voice + CRM, envío local y confirmación de brief generado.
- Pausa y reanudación: botón, etiqueta accesible y clase de estado actualizados sin errores.
- Anclas internas: corregido el doble desplazamiento compensado del encabezado.
- Sintaxis JavaScript correcta en app.js y assets/experience.js.
- Build estático correcto, IDs únicos, anclas resueltas y recursos locales presentes.

## Límites
Las demos siguen siendo ilustrativas. El formulario produce un brief local; el envío real no está conectado. La descarga de ese mismo flujo fue comprobada en v1; en v2 se volvió a comprobar la generación y confirmación. No se conectaron teléfono, calendario, CRM real ni APIs de IA.

Se implementan prefers-reduced-motion, prefers-reduced-transparency, contraste aumentado y fallback CSS de WebGL. Se ha revisado su código, pero no se han forzado todas las preferencias del sistema ni pérdida de contexto GPU en el navegador. No se han medido FPS en hardware móvil real, ni realizado una auditoría WCAG completa o validación en todos los motores de navegador.

## Capturas
- artifacts/avelqia-v2-desktop.jpg
- artifacts/avelqia-v2-mobile.jpg
- artifacts/avelqia-flow-story.jpg

## Publicación
Confirmada por Sites con estado `succeeded`.

- URL: https://avelqia-studio.mescuu.chatgpt.site
- Project: appgprj_6aceb1cf4908819182a03925af73478a
- Source commit: c14a95a86936a4a6e2b4f993da13f5dc24450b4c
- Version: appgprj_6aceb1cf4908819182a03925af73478a~appgver_e2238d0291e48191bc103a5893f13541
- Deployment: appgdep_6aceb85b210c81919aaeed77a4b79a73
- Archive: artifacts/avelqia-v2-site.tar.gz
- Acceso conservado: privado para el propietario.

La versión publicada se abrió en el navegador: titular actualizado y render WebGL confirmado. La prueba funcional detallada se realizó en HTTP local.
