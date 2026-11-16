# Secciones Safari — guía de uso

Estado: **base funcional con estilos provisionales**. Las secciones usan los colores, tipografías y
botones actuales de Dawn. La identidad visual se define en la Fase B con la imagen de referencia.

Ninguna sección está integrada todavía: no se modificaron `templates/index.json`,
`sections/header-group.json` ni `config/settings_data.json`. Aparecen en el editor de Shopify como
secciones agregables, con nombres que empiezan con "Safari ·".

## 1. Qué hace cada sección

Todas tienen esquema de color, espacio superior e inferior, y casillas para mostrarse u ocultarse en
escritorio y en móvil (el encabezado no tiene estas casillas). Además, el editor permite ocultar o
reordenar cualquier sección de forma nativa.

### Grupo de encabezado

| Sección | Bloques | Ajustes principales |
|---|---|---|
| **Safari · Anuncios** | Mensaje (texto, enlace), hasta 6 | Rotación automática y velocidad, flechas, texto informativo, menú de enlaces |
| **Safari · Header** | Bloques de apps | Logo y anchos, menú, menú desplegable en escritorio, buscador, cuenta, encabezado fijo, línea inferior |
| **Safari · Menú categorías** | — | Menú (hasta 3 niveles), enlace "Ver todo", alineación, comportamiento en móvil |

- **Buscador.** Es el formulario de búsqueda de Shopify (`/search`). Si en Configuración del tema está
  activa la búsqueda predictiva, usa el componente `predictive-search` de Dawn.
- **Carrito.** Usa el mismo ícono y contador que Dawn (`#cart-icon-bubble`), por lo que el carrito
  lateral, la notificación y la página de carrito funcionan sin código nuevo.
- **Cuenta.** Usa el componente `shopify-account`, igual que Dawn. Solo aparece si la tienda tiene
  cuentas de cliente activas.
- **Menú lateral en móvil.** Es el `header-drawer` de Dawn, alimentado por el menú elegido.
- **Categorías.** Se toman de un menú de Shopify (Contenido → Menús). No hay categorías escritas en el
  código. En móvil se muestran las categorías principales en una fila desplazable y las subcategorías
  se navegan desde el menú lateral.

### Plantillas

| Sección | Bloques | Ajustes principales |
|---|---|---|
| **Safari · Slider** | Diapositiva, hasta 8: imagen de escritorio, imagen de móvil, subtítulo, título, descripción, botón, enlace | Altura en escritorio y móvil, posición y alineación del contenido, recuadro de texto, texto debajo en móvil, autoplay, velocidad, flechas, puntos |
| **Safari · Categorías** | Categoría, hasta 16: colección, imagen, nombre y enlace opcionales | Columnas, fila desplazable o cuadrícula en móvil, proporción y forma de imagen, cantidad de productos |
| **Safari · Destacados** | Etiqueta comercial, hasta 5 | Lista de productos elegidos a mano (hasta 12), ajustes de tarjeta, botón |
| **Safari · Banners promo** | Banner, hasta 9: imagen de escritorio y móvil, enlace, título, texto, botón | 1, 2 o 3 por fila, disposición en móvil, separación, proporción, redondeo, borde, texto debajo o encima |
| **Safari · Colección** | Etiqueta comercial, hasta 5 | Colección, máximo de productos, título, "Ver todo", ajustes de tarjeta |
| **Safari · Beneficios** | Beneficio, hasta 8: ícono o imagen, título, descripción, enlace | Columnas, disposición en móvil, posición y tamaño del ícono |

### Tarjeta de producto

La tarjeta es la de Dawn (`card-product`) con una capa encima. Qué aporta cada parte:

| Elemento | Origen |
|---|---|
| Imagen principal y segunda imagen al pasar el cursor | Dawn |
| Nombre, precio y precio anterior | Dawn |
| Distintivos "Oferta" y "Agotado" | Dawn |
| Botón "Agregar al carrito"; con varias variantes, "Seleccionar opciones" abre el selector | Dawn (`quick-add`) |
| Porcentaje de descuento | Capa Safari. Calculado con el precio y el precio de comparación del producto |
| Etiquetas comerciales | Capa Safari. Cada bloque "Etiqueta comercial" asocia un tag del producto con un texto y un color |
| Disponibilidad: con stock, sin stock, pocas unidades | Capa Safari. Textos editables. "Pocas unidades" usa el inventario de la primera variante disponible |

En productos con varias variantes de distinto precio, el porcentaje se calcula sobre el menor precio.

### Comportamiento sin contenido

| Situación | En la tienda | En el editor |
|---|---|---|
| Destacados sin productos, Colección sin colección o vacía | La sección no genera nada | Tarjetas de ejemplo y un aviso |
| Categoría sin colección ni nombre y enlace | El bloque no se publica | Tarjeta de ejemplo |
| Menú de categorías sin menú | La sección no genera nada | Aviso |
| Banner sin imagen ni texto | El bloque no se publica | Imagen de ejemplo |

Nunca se muestran productos, precios ni categorías de ejemplo en la tienda.

## 2. Cómo integrarlas (pendiente de autorización)

Estos pasos modifican `header-group.json` e `index.json`. Shopify los guarda como commits en `main`.

1. En el editor del tema, **Encabezado → Agregar sección**: sumar "Safari · Anuncios", "Safari · Header"
   y "Safari · Menú categorías", en ese orden.
2. **Ocultar** las secciones "Barra de anuncios" y "Encabezado" de Dawn con el ícono del ojo.
3. En la plantilla de inicio, agregar las secciones de plantilla y ordenarlas.
4. Elegir menús, colecciones, productos e imágenes en cada sección.
5. Antes de seguir trabajando por código: `git pull`.

**Importante:** "Safari · Header" y el "Encabezado" de Dawn no deben estar visibles a la vez. Comparten
el ícono del carrito (`#cart-icon-bubble`), la notificación del carrito y el menú lateral; duplicados,
el carrito actualizaría solo uno.

## 3. Limitaciones conocidas

- **Selectores de país e idioma en el encabezado.** No están en "Safari · Header". Siguen disponibles en
  el pie de Dawn. Se pueden sumar en la Fase B si la referencia los incluye.
- **Mega menú.** El menú de categorías es desplegable. No hay mega menú con columnas o imágenes.
- **Mismo producto en dos secciones de la página.** El selector de variantes de Dawn usa IDs por
  producto (`QuickAdd-<id>`), no por sección. Si un producto con variantes aparece en dos secciones, el
  HTML tiene IDs repetidos y se abre el primer selector. Es el comportamiento de Dawn sin modificar.
- **Slider en modo "Adaptar a la imagen".** Si las diapositivas tienen proporciones distintas, las más
  bajas se recortan para igualar la altura. Usar imágenes de la misma proporción.
- **Íconos de beneficios.** La lista usa los íconos que trae Dawn. Para otros, subir un ícono propio.
- **Textos de las opciones.** Los nombres de ajustes están en español en el propio `schema`, no en los
  archivos de traducción del editor.
