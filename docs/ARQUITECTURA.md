# Arquitectura de personalización — Safari Store

Este documento define cómo se construye Safari Store sobre Dawn sin perder la posibilidad de actualizar
Dawn ni la compatibilidad con el editor visual de Shopify.

## 1. Principios

1. **Dawn no se edita, se extiende.** Los archivos originales quedan intactos. La única excepción es una
   línea en `layout/theme.liquid` que carga la capa Safari.
2. **Todo lo propio lleva el prefijo `safari-`.** Shopify no admite subcarpetas dentro de `sections/`,
   `snippets/` ni `assets/`, así que el prefijo es lo que separa el código del proyecto del de Dawn.
3. **Cada sección es autónoma.** Un archivo Liquid, su `schema`, su CSS y, si hace falta, su JavaScript.
   No depende de que exista otra sección en la página.
4. **Lo nativo de Shopify no se reimplementa.** Carrito, búsqueda, variantes, inventario, precios,
   descuentos, colecciones, cuentas, checkout, idiomas y monedas se usan tal como los provee Dawn.

## 2. Convención de archivos

| Tipo | Ubicación y nombre | Ejemplo |
|---|---|---|
| Sección | `sections/safari-<nombre>.liquid` | `sections/safari-hero-slider.liquid` |
| CSS de sección | `assets/section-safari-<nombre>.css` | `assets/section-safari-hero-slider.css` |
| JS de sección | `assets/safari-<nombre>.js` | `assets/safari-hero-slider.js` |
| Snippet compartido | `snippets/safari-<nombre>.liquid` | `snippets/safari-product-card.liquid` |
| Estilos globales | `assets/safari-theme.css` | (ya existe) |
| Carga global | `snippets/safari-head.liquid` | (ya existe) |

## 3. Secciones previstas (OT-002)

| Componente | Archivo | Dónde se usa |
|---|---|---|
| Barra de anuncios | `sections/safari-announcement-bar.liquid` | Grupo de encabezado |
| Header personalizado | `sections/safari-header.liquid` | Grupo de encabezado |
| Menú de categorías | `sections/safari-category-menu.liquid` | Grupo de encabezado |
| Slider principal | `sections/safari-hero-slider.liquid` | Plantillas |
| Categorías destacadas | `sections/safari-category-grid.liquid` | Plantillas |
| Productos destacados | `sections/safari-featured-products.liquid` | Plantillas |
| Banners promocionales | `sections/safari-promo-banners.liquid` | Plantillas |
| Productos por colección | `sections/safari-collection-products.liquid` | Plantillas |
| Beneficios comerciales | `sections/safari-benefits.liquid` | Plantillas |

**Estos archivos todavía no existen, a propósito.** Una sección vacía aparece igual en el editor de
Shopify como opción agregable y un `schema` incompleto provoca errores de sincronización. Cada archivo se
crea en la OT-002 cuando tenga contenido funcional.

Las secciones de encabezado declaran `"enabled_on": { "groups": ["header"] }` y se agregan al grupo
`sections/header-group.json` desde el editor. Las secciones de Dawn (`header`, `announcement-bar`) se
quitan del grupo desde el editor, no se borran del repositorio.

## 4. Contrato de una sección Safari

Toda sección `safari-*` debe cumplir:

- **Schema válido** con `name`, `settings`, `presets` (sin `presets` no se puede agregar desde el editor)
  y, para contenido repetible (slides, banners, beneficios), `blocks`.
- **Contenido editable**: textos (`text`, `richtext`, `inline_richtext`), imágenes (`image_picker`),
  enlaces (`url`). Ningún texto visible fijo en el Liquid.
- **Datos reales**: productos con `product` o `product_list`, colecciones con `collection` o
  `collection_list`, menús con `link_list`. Sin catálogos simulados.
- **Esquema de color** con el setting `color_scheme` de Dawn y la clase `color-{{ section.settings.color_scheme }}`.
- **Espaciado** con los settings `padding_top` y `padding_bottom`, como las secciones de Dawn.
- **Responsive** con mobile primero. Breakpoints de Dawn: `750px` (tablet) y `990px` (escritorio).
- **Atributos del editor**: `{{ block.shopify_attributes }}` en cada bloque.
- **Estado vacío**: si no hay producto, colección o imagen elegidos, mostrar el placeholder nativo
  (`placeholder_svg_tag`) en lugar de fallar.
- **Reutilizar Dawn**: la tarjeta de producto se obtiene con `{% render 'card-product' %}` y el precio con
  `{% render 'price' %}`, así variantes, descuentos e inventario siguen funcionando.
- **Textos del schema** en español directamente o mediante claves `t:` en `locales/*.schema.json`.

### Esqueleto de referencia

Punto de partida para la OT-002. No está en `sections/` para no generar una sección vacía.

```liquid
{{ 'section-safari-ejemplo.css' | asset_url | stylesheet_tag }}

{%- style -%}
  .section-{{ section.id }}-padding {
    padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
    padding-bottom: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
  }
  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
      padding-bottom: {{ section.settings.padding_bottom }}px;
    }
  }
{%- endstyle -%}

<div class="safari-ejemplo color-{{ section.settings.color_scheme }} gradient">
  <div class="page-width section-{{ section.id }}-padding">
    {%- if section.settings.heading != blank -%}
      <h2 class="safari-ejemplo__heading h1">{{ section.settings.heading }}</h2>
    {%- endif -%}

    {%- for block in section.blocks -%}
      <div class="safari-ejemplo__item" {{ block.shopify_attributes }}>
        {{ block.settings.text }}
      </div>
    {%- endfor -%}
  </div>
</div>

{% schema %}
{
  "name": "Safari · Ejemplo",
  "tag": "section",
  "class": "section",
  "disabled_on": { "groups": ["header", "footer"] },
  "settings": [
    { "type": "inline_richtext", "id": "heading", "label": "Título", "default": "Título de la sección" },
    { "type": "color_scheme", "id": "color_scheme", "label": "Esquema de color", "default": "scheme-1" },
    { "type": "range", "id": "padding_top", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Espacio superior", "default": 36 },
    { "type": "range", "id": "padding_bottom", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Espacio inferior", "default": 36 }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Elemento",
      "settings": [
        { "type": "text", "id": "text", "label": "Texto", "default": "Texto del elemento" }
      ]
    }
  ],
  "presets": [
    { "name": "Safari · Ejemplo", "blocks": [{ "type": "item" }] }
  ]
}
{% endschema %}
```

## 5. Capa de estilos

Orden de carga: `base.css` (Dawn) → `safari-theme.css` (global Safari) → CSS de cada sección.

`assets/safari-theme.css` está organizado en bloques numerados: tokens, tipografía, botones, tarjetas de
producto, encabezado y navegación, banners, mobile.

Hay dos niveles de personalización, y conviene agotar el primero antes de usar el segundo:

| Qué se quiere cambiar | Dónde |
|---|---|
| Colores (esquemas), tipografías, radio y sombra de botones, tarjetas, inputs, ancho de página, espaciado entre secciones | **Editor de Shopify → Configuración del tema.** Se guarda en `config/settings_data.json`. Sin código |
| Lo que el editor no permite: forma de la tarjeta, header a medida, navegación, banners, ajustes mobile | `assets/safari-theme.css`, en el bloque correspondiente |
| Estilo propio de una sección | `assets/section-safari-<nombre>.css` |

### Tokens

Los tokens `--safari-*` hoy apuntan a las variables que Dawn genera desde el editor, por eso el tema se ve
igual a Dawn. En la OT-002 se decide token por token si sigue siendo editable por el comerciante (se deja
el enlace) o si queda fijado por diseño (se reemplaza el valor).

Los colores de Dawn son tripletas RGB sin función. Se usan así:

```css
.safari-ejemplo__boton {
  background: rgb(var(--safari-color-primary));
  color: rgb(var(--safari-color-on-primary));
  border: 1px solid rgba(var(--safari-color-text), 0.1);
  border-radius: var(--safari-radius-button);
  padding: var(--safari-space-3) var(--safari-space-6);
}
```

En Dawn `1rem` equivale a `10px` (el `font-size` raíz es 62.5 %).

## 6. Funcionalidades nativas que no se tocan

| Funcionalidad | Dónde vive en el tema |
|---|---|
| Carrito | `sections/main-cart-*.liquid`, `snippets/cart-drawer.liquid`, `assets/cart*.js` |
| Búsqueda y búsqueda predictiva | `sections/main-search.liquid`, `sections/predictive-search.liquid` |
| Variantes | `snippets/product-variant-picker.liquid`, `assets/product-info.js` |
| Inventario, precios y descuentos | `snippets/price.liquid`, `snippets/card-product.liquid` (datos de Shopify) |
| Colecciones y filtros | `sections/main-collection-product-grid.liquid`, `assets/facets.js` |
| Ficha de producto | `sections/main-product.liquid` |
| Cuentas de clientes | Provistas por Shopify (cuentas de cliente nativas) |
| Checkout | Provisto por Shopify. Fuera del tema. No se modifica |
| Idiomas y monedas | `locales/`, `snippets/country-localization.liquid`, `snippets/language-localization.liquid` |
