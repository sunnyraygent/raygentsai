# Verificación de la web — v1

Histórico. Las comprobaciones del rediseño están en `VERIFICATION-V2.md`.

13 de octubre de 2026. Navegador integrado, servido por HTTP local.

Historia comprobada: un visitante entiende las dos ofertas, explora las demostraciones y crea un resumen de consulta. La landing no llama a un agente real ni a un CRM de producción.

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| Servidor de vista previa | Correcto | HTTP 200 en `http://localhost:4173` |
| Sintaxis JavaScript | Correcta | `node --check app.js` |
| Paquete estático | Correcto | `scripts/build.mjs`, archivos generados en `dist/` |
| Recursos y estructura | Correctos | Referencias locales presentes, IDs únicos, un único h1, sin anclas internas rotas |
| Escritorio | Revisado visualmente | Vista de 1440 × 1000 y captura de página completa |
| Móvil | Revisado | Vistas de 390 × 844 y 320 × 812; `scrollWidth === clientWidth` |
| CRM en móvil estrecho | Correcto | Tabla de 272 px dentro de contenedor de 296 px en viewport de 320 px |
| Menú móvil | Correcto | Se abre, actualiza `aria-expanded`, se cierra al navegar |
| Conversación de reserva | Correcta | Estado inicial y resultado visibles |
| Cambio de cita | Correcto | Texto y resultado actualizados al elegir Reschedule |
| Preguntas | Correctas | Texto, resultado y `aria-pressed` actualizados |
| Vistas CRM | Correctas | Contacts muestra 3 registros; Appointments muestra 2 |
| Sugerencias CRM | Correctas | Take a look muestra 3 sugerencias para revisar |
| Ejemplos por sector | Correctos | Real estate cambia título, descripción y flujo |
| FAQ | Correctas | Apertura/cierre; un solo elemento abierto en la comprobación final |
| Formulario de consulta | Correcto en modo preview | Datos de prueba, selección Voice + CRM, validación y confirmación |
| Descarga del resumen | Correcta | Archivo `.txt` descargado y contenido revisado; copia en `artifacts/qa-project-brief.txt` |
| Editar resumen | Correcto | Vuelve a mostrar el formulario |
| Consola | Sin errores observados | Sin entradas error/warn en las lecturas realizadas |

## Alcance y límites

Las conversaciones, los datos y las sugerencias son ejemplos locales y están identificados como tales. No hay integración con un teléfono, calendario, proveedor de IA o base de datos real.

El formulario no envía datos salvo que se configure explícitamente `contactEndpoint`. Se ha verificado el modo de vista previa; el envío a un endpoint de producción no se ha comprobado porque no hay un servicio conectado.

El audio usa speechSynthesis del navegador. No se ha verificado la calidad o disponibilidad de voces en todos los navegadores. No representa la voz de un proveedor de agentes.

Las preferencias de movimiento reducido, transparencia reducida y contraste están implementadas. No se ha simulado cada preferencia del sistema operativo en esta revisión. No se ha realizado una auditoría formal WCAG ni una matriz completa de Safari, Chrome, Edge y Firefox.

La web se verificó por HTTP. El navegador de automatización no permite navegar a URLs `file:`; no se ha verificado mediante esa vía la apertura directa del HTML.

Capturas: `artifacts/avelqia-desktop.jpg`, `artifacts/avelqia-mobile.jpg` y `artifacts/avelqia-full-page.jpg`.

## Publicación



- Source commit: `914113af5d3a0191568b0af61a113d96c0dbc625`

Se mantiene el acceso privado. El enlace requiere la cuenta del propietario.
