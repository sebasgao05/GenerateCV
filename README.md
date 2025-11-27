# GenerateCV

Generador de CV en una sola página, listo para exportar a PDF. Se ejecuta directo en el navegador (HTML, CSS y JS vanilla) usando jsPDF e i18next, sin dependencias de build.

## Características
- Formulario completo con datos obligatorios y opcionales (proyectos, experiencia, educación, certificaciones, competencias, foto, web, LinkedIn).
- Vista previa y descarga en PDF con enlaces clicables.
- Selector de fuente (Times, Helvetica, Courier) y modo oscuro/opcional.
- Persistencia en `localStorage`: no pierdes lo diligenciado al recargar.
- Multilenguaje (ES/EN) con i18next.

## Estructura
- `index.html`: marcado principal, footer e instrucciones.
- `styles/main.css`: estilos en una columna tipo CV impreso.
- `logic/app.js`: lógica de formularios, i18n, guardado y generación de PDF con jsPDF.
- `libs/jspdf.umd.min.js`: jsPDF local para trabajar offline.

## Uso
1) Abre `index.html` en el navegador.
2) Completa los campos (web/LinkedIn son opcionales; la foto debe ser imagen).
3) Agrega bloques con los botones de cada sección.
4) Elige fuente y tema si quieres.
5) Genera la vista previa y descarga el PDF.

## Desarrollo
No requiere instalación ni servidor: basta con un navegador. Para ajustar estilos o lógica, edita `styles/main.css` y `logic/app.js`.

## Autor
David Barrera — desplegado en AWS Amplify.
