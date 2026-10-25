# Avelqia: marca provisional y recursos

Fecha de investigación: 13 de octubre de 2026.
Mercado inicial: Estados Unidos. Web en inglés, sin especialización sectorial inicial.

## Nombre recomendado: Avelqia

Nombre inventado y flexible para agentes de voz, CRM personalizados, automatización y marketing con IA. Propuesta de pronunciación en inglés: “uh-VEL-kee-uh”. La palabra no limita la empresa a una sola tecnología o sector. Es una propuesta para valorar; no una marca legalmente validada.

Búsquedas realizadas: `"Avelqia"`, `"Avelqia" AI software agency`, `Avelqia` y `"avelqia.com"`. No se identificaron coincidencias exactas visibles para una marca Avelqia en los resultados revisados. Las búsquedas amplias sí devolvieron nombres parecidos, como Avelia y Aveliq; no prueban exclusividad.

Consulta directa en el buscador oficial de la USPTO, campo Wordmark, término `AVELQIA`, con estados Live y Dead seleccionados: resultado **No results found**, Live count 0 y Dead count 0. Se conserva una captura en `artifacts/avelqia-uspto-search.jpg`. Es una búsqueda preliminar del término; no cubre todos los nombres similares, derechos no registrados ni otras jurisdicciones.

Consulta a `https://rdap.verisign.com/com/v1/domain/avelqia.com`: HTTP 404, sin registro encontrado en la consulta. Esto no reserva el dominio ni garantiza que un registrador lo ofrezca para compra. No se ha comprado ningún dominio.

Antes de elegir definitivamente: comprobar el nombre y variantes similares en el buscador de marcas de Estados Unidos, revisar nombres comerciales y usuarios en redes, y confirmar el dominio con un registrador. Una búsqueda web no equivale a una búsqueda de marca.

- Buscador oficial: https://www.uspto.gov/trademarks/search
- Registro RDAP consultado: https://rdap.verisign.com/com/v1/domain/avelqia.com

Se descartaron varias propuestas por usos visibles, entre ellas Oryven (agentes y automatización), Velqia (asistentes), Aelvyn (software y otros usos), Aurenivo (solicitud de marca británica) y Velunexa (comercio). No se han usado como marca del proyecto.

## Librerías instaladas e integradas

### Motion 14.1.0

- Repositorio: https://github.com/motiondivision/motion
- Documentación: https://motion.dev/docs/quick-start
- Licencia: MIT, conservada en `assets/vendor/motion-LICENSE.txt`.
- Uso: entrada de la portada, revelado al desplazarse, flotación de elementos y transiciones de las demostraciones.

### Lenis 1.3.26

- Repositorio: https://github.com/darkroomengineering/lenis
- Sitio/documentación: https://lenis.dev/
- Licencia: MIT, conservada en `assets/vendor/lenis-LICENSE.txt`.
- Uso: desplazamiento suave y navegación entre secciones. Se desactiva cuando el usuario solicita movimiento reducido.

Las dependencias están instaladas mediante pnpm y fijadas en `pnpm-lock.yaml`. Sus archivos para navegador están copiados al proyecto: la web no necesita un CDN para las animaciones.

## MCPs encontrados

### Motion AI Kit / MCP oficial de Motion

- Guía oficial: https://motion.dev/docs/ai-kit-install
- Repositorio: https://github.com/motiondivision/ai-kit
- Servidor de documentación: https://mcp.motion.dev
- La búsqueda de documentación y metadatos de ejemplos es gratuita. Otras funciones requieren Motion+.
- Estado: investigado; no se ha cambiado la configuración global de Codex ni se ha activado este MCP. La librería Motion sí está instalada y funcionando en esta web.

### MCP de shadcn/ui

- Guía oficial: https://ui.shadcn.com/docs/mcp
- Repositorio: https://github.com/shadcn-ui/ui
- Útil para descubrir y añadir componentes desde registros cuando el proyecto usa React y shadcn/ui.
- Estado: investigado; no instalado. La primera versión conserva HTML/CSS/JS, con componentes propios, para abrirla sin compilación y sin añadir un framework innecesario.

### Figma

El buscador de plugins confirmó un plugin de Figma disponible. Sería útil si se quieren diseños editables, un sistema de componentes o colaboración en Figma. No hace falta para esta primera versión y no se ha instalado ni conectado ninguna cuenta.

## Criterios visuales

Fondo claro, tipografía del sistema, espacio generoso, jerarquía marcada y vidrio limitado a navegación y elementos flotantes. Las animaciones principales usan transformaciones y opacidad. Se respetan las preferencias de movimiento reducido, se ofrece un tratamiento opaco para transparencia reducida, y existe un ajuste para mayor contraste.

No se usan logos de Apple, fuentes propietarias distribuidas, testimonios inventados, clientes ficticios presentados como reales ni cifras de resultados comerciales. Los datos del CRM y las conversaciones se indican como ejemplos.
