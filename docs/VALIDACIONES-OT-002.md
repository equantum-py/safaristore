# OT-002 — Registro de validaciones (base funcional)

Fecha: 16/11/2026. Alcance: las nueve secciones `safari-*`, sin integrar a las plantillas.

Este registro separa tres niveles de evidencia. **Ninguna prueba se hizo dentro de Shopify.**

## 1. Punto de partida

- SHA inicial: `cc5c0a846ba1355490568148d7b3e8fa3149896f`. Sirve como punto de recuperación.
- Antes de publicar se sincronizó `main`: sin commits del editor de Shopify ni cambios ajenos.
- No se modificó ningún archivo de Dawn, ni `header-group.json`, `index.json` o `settings_data.json`.

## 2. Pruebas estáticas (sobre los archivos del tema)

| Prueba | Resultado |
|---|---|
| Shopify Theme Check (CLI 5.0.1) | **0 errores**, 9 advertencias, 168 archivos. Las 9 son las de Dawn 16.1.1; las secciones Safari no suman ninguna |
| Sintaxis Liquid | Sin errores (Theme Check) |
| JSON del tema | 67 de 67 válidos |
| `schema` de las 9 secciones | JSON válido. Verificado además: nombres de hasta 25 caracteres, rangos con pasos válidos y valor por defecto dentro del paso, valor por defecto de cada lista dentro de sus opciones, IDs sin repetir, bloques de los presets existentes |
| Ajustes declarados y usados | Todo ajuste del `schema` se usa en el Liquid y todo ajuste usado está declarado |
| Referencias | 25 a secciones, 178 a snippets y 244 a assets; todas resuelven |
| Claves de traducción | Todas las usadas existen en `locales/` (Theme Check) |
| Secretos y archivos sensibles | 0 hallazgos en 379 archivos |
| Formato | CSS y JavaScript nuevos pasan Prettier con la configuración del repositorio |

## 3. Pruebas en navegador sobre un render local (no es Shopify)

Las secciones se renderizaron fuera de Shopify con un motor Liquid compatible (liquidjs), los CSS y
JavaScript reales del tema y **datos de prueba** (productos, colecciones, menús e imágenes ficticios,
rotulados "PRUEBA", que no están en el repositorio). Se abrieron en Chrome 153 sin interfaz.

Sirve para verificar marcado, estilos y comportamiento del lado del navegador. No verifica nada que
dependa del servidor de Shopify.

**Responsive.** Página con las nueve secciones en 375, 390, 430, 768, 1024 y 1440 px: sin
desbordamiento horizontal en ningún ancho y sin errores de JavaScript.

**Comportamiento (33 de 36 comprobaciones aprobadas; las 3 restantes se explican abajo).**

| Área | Verificado |
|---|---|
| Slider | Flechas, puntos, vuelta al inicio tras la última, flechas del teclado, autoplay a la velocidad configurada, botón de pausa con cambio de etiqueta, pausa con el cursor encima, sin autoplay con "reducir movimiento" |
| Slider, imágenes | En modo "Adaptar", la proporción mostrada coincide con la original (sin recorte ni deformación). En móvil la imagen ocupa como máximo el 70 % del alto y el texto queda debajo |
| Anuncios | Rotación automática y flechas |
| Menú de categorías | Enter abre el desplegable, Tab recorre los enlaces, tercer nivel con teclado, Escape y pérdida de foco lo cierran |
| Encabezado | Oculta al bajar y reaparece al subir; modo "Siempre" queda fijo. Formulario de búsqueda GET a `/search` con campo `q` y etiqueta. Ícono de carrito único y enlazado a `/cart` |
| Móvil | Menú lateral abre, muestra subcategorías y cierra; fila de categorías, buscador y carrito visibles a 375 px; productos en carrusel |
| Tarjeta | Descuento calculado (2.399.000 → 1.899.000 da -21 %), etiquetas por tag sin distinguir mayúsculas, estados "Disponible", "Agotado" y "Últimas unidades", formulario de agregado rápido de Dawn presente con el ID de sección |
| Sin contenido | En modo tienda, las secciones sin productos, colección o menú no generan nada. En modo editor muestran ejemplos y avisos |

Las 3 comprobaciones no aprobadas:

1. **IDs repetidos** cuando el mismo producto con variantes aparece en dos secciones. Viene de la tarjeta
   de Dawn (`QuickAdd-<id>`), no del código Safari. Documentado en `SECCIONES-SAFARI.md`.
2. **Controles táctiles menores a 24 px**: son los enlaces de texto del nombre del producto en la tarjeta
   de Dawn, cuyo área de toque real es la tarjeta completa. Los controles Safari miden entre 36 y 47 px.
3. **Cierre del menú lateral con Escape**: falló dentro de una secuencia encadenada del script de prueba.
   Repetida de forma aislada, el menú cierra con Escape y con un segundo toque.

Defectos que estas pruebas encontraron y se corrigieron antes del commit:

- Desbordamiento horizontal de 12 px en móvil por el margen del ícono de carrito.
- El menú se veía sin formato porque Dawn declara las reglas `.list-menu` dentro de su propia sección
  de encabezado; ahora las incluyen los CSS de las secciones Safari.
- El panel de sugerencias de búsqueda podía verse sin estilos hasta cargar un CSS diferido del tema.

## 4. Pendiente de validación en Shopify

Nada de lo siguiente está verificado. Requiere la vista previa del tema con datos reales.

| Funcionalidad | Qué hay que comprobar |
|---|---|
| Importación | Que Shopify sincronice el commit sin errores (Ver registros en la tarjeta del tema) |
| Editor | Que las 9 secciones aparezcan para agregar, que sus ajustes se guarden y que se puedan reordenar y ocultar |
| Carrito | Agregar desde la tarjeta, actualización del contador, carrito lateral o notificación |
| Variantes | "Seleccionar opciones" abre el selector de Dawn y agrega la variante elegida |
| Búsqueda | Resultados en `/search` y sugerencias predictivas en el encabezado Safari |
| Cuenta | Ícono y menú de cuenta de cliente |
| Imágenes | `srcset` y tamaños generados por Shopify; imagen de móvil independiente en slider y banners |
| Descuento y stock | Porcentaje y disponibilidad con productos, variantes e inventario reales |
| Menús | Menús reales de tres niveles, estado activo de la página actual |
| Rendimiento y accesibilidad | Lighthouse y Core Web Vitals sobre la vista previa |

Un punto técnico a confirmar en Shopify: la tarjeta de Dawn se renderiza desde un snippet Safari
(dos niveles de `render`) y toma el ID de la sección del contexto. En el render local funciona; hay que
confirmarlo en la plataforma, porque de eso depende el agregado al carrito desde la tarjeta.
