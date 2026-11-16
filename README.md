# Safari Store — Tema Shopify

Tema de Shopify para **Safari Store**, ecommerce de tecnología, electrónica, informática y accesorios.
Desarrollado por eQuantum sobre **Dawn**, el tema oficial de referencia de Shopify.

> Este repositorio es un tema Shopify estándar (Liquid, JSON, CSS y JavaScript, sin proceso de build).
> No es un sitio estático ni una aplicación React. Todo lo que se desarrolle debe seguir siendo
> administrable desde el editor visual de Shopify.

## 1. Tema base y versión

| Dato | Valor |
|---|---|
| Tema base | Dawn (Shopify) |
| Versión incorporada | **16.1.1** |
| Tag de origen | `v16.1.1` |
| Commit de origen | `e9ac9c0f0b289da643164f4080380bd11ed27519` |
| Repositorio de origen | https://github.com/Shopify/dawn |
| Licencia | MIT (ver `LICENSE.md`, se conserva el aviso de Shopify) |
| Fecha de incorporación | 16/11/2026 |

Dawn se incorporó como copia de archivos, sin su historial Git. No se trajo la carpeta `.github/` de Dawn
(flujos de CI, CLA y plantillas de issues propios de Shopify) ni su `README.md`.
Las notas de la versión de Dawn se conservan en `release-notes.md`.

### Diferencias respecto de Dawn 16.1.1

Son las únicas. Cualquier otro archivo es idéntico al original.

| Archivo | Cambio |
|---|---|
| `layout/theme.liquid` | Una línea añadida después de `base.css`: `{% render 'safari-head' %}` |
| `config/settings_schema.json` | Bloque `theme_info`: nombre "Safari Store", versión `0.1.0`, autor y URLs del proyecto |
| `snippets/safari-head.liquid` | Nuevo. Carga la capa de estilos Safari |
| `assets/safari-theme.css` | Nuevo. Tokens de diseño enlazados a los valores de Dawn (sin cambio visual) |
| `sections/safari-*.liquid`, `snippets/safari-*.liquid`, `assets/*safari*` | Nuevos. Secciones y piezas propias (OT-002). No modifican archivos de Dawn |
| `.gitignore`, `README.md`, `docs/` | Propios del proyecto |

## 2. Estructura del repositorio

```
.
├── assets/        CSS, JavaScript e imágenes del tema (carpeta plana, sin subcarpetas)
├── config/        settings_schema.json (opciones del tema) y settings_data.json (valores)
├── layout/        theme.liquid y password.liquid
├── locales/       Traducciones de la tienda y del editor (incluye español)
├── sections/      Secciones Liquid y grupos de secciones (header-group, footer-group)
├── snippets/      Fragmentos Liquid reutilizables
├── templates/     Plantillas JSON por tipo de página (+ gift_card.liquid)
├── docs/          Documentación del proyecto (Shopify ignora esta carpeta)
├── .theme-check.yml   Configuración de Theme Check heredada de Dawn
├── .prettierrc.json   Formato de código heredado de Dawn
├── release-notes.md   Notas de la versión de Dawn incorporada
└── LICENSE.md
```

Shopify solo sincroniza las siete carpetas de tema. `docs/` y los archivos de la raíz no se suben a la tienda.
Las cuentas de clientes y el checkout los provee Shopify de forma nativa; el tema no contiene ni modifica su lógica.

La arquitectura de personalización (prefijo `safari-`, tokens, reglas para secciones) está en
[`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).

## 3. Instrucciones de desarrollo

Requisitos: Node.js 20 o superior y Shopify CLI.

```bash
npm install -g @shopify/cli@latest

git clone https://github.com/equantum-py/safaristore.git
cd safaristore

# Vista previa local contra una tienda (pide iniciar sesión en el navegador)
shopify theme dev --store NOMBRE-DE-LA-TIENDA.myshopify.com

# Validación obligatoria antes de cada commit
shopify theme check --fail-level error
```

`shopify theme dev` crea un tema de desarrollo temporal; no toca el tema publicado.

**Credenciales:** nunca se guardan tokens, contraseñas ni archivos `.env` en este repositorio.
La autenticación se hace con `shopify auth login` o con la app de GitHub de Shopify.

## 4. Conectar Shopify con GitHub

La conexión usa la integración nativa de Shopify. El tema queda **sin publicar** en la biblioteca.

**Antes de empezar**

- En Shopify: ser propietario de la tienda, o tener una cuenta de personal o colaborador con el permiso **Temas**.
- En GitHub: ser **miembro** de la organización `equantum-py` con permiso de escritura sobre `safaristore`.
  Los colaboradores externos de GitHub no pueden conectar ramas.
- La app **Shopify** de GitHub debe estar instalada en la organización `equantum-py`. Solo un **propietario
  de la organización** puede instalarla; si la instala otro miembro, GitHub deja la solicitud pendiente de
  aprobación en *Organization settings → GitHub Apps*. Se recomienda darle acceso
  únicamente al repositorio `safaristore` ("Only select repositories").

**Pasos**

1. Ingresar al administrador de Shopify de la tienda de Safari Store.
2. Ir a **Tienda online → Temas**.
3. En **Biblioteca de temas**, hacer clic en **Agregar tema → Conectar desde GitHub**.
4. Si es la primera vez, iniciar sesión en GitHub y autorizar la app de Shopify (ver requisitos de arriba).
5. En el panel **Conectar tema**, elegir la organización `equantum-py`.
6. En **Repositorio**, elegir `safaristore`.
7. En **Rama**, elegir `main`.
8. Hacer clic en **Conectar**.
9. Verificar que el tema aparezca en la biblioteca con el repositorio, la rama y la hora del último commit.
10. Abrir **Vista previa** para comprobar que carga. **No** usar "Publicar".

**Cómo funciona después de conectar**

- Cada commit en `main` actualiza el tema en Shopify.
- Cada cambio hecho en el editor visual o en el editor de código de Shopify genera un commit en `main`
  (autor: la app de Shopify). Esta sincronización hacia GitHub no se puede desactivar.
- Si se desconecta la rama, no se puede volver a conectar al mismo tema: al reconectar se crea un tema nuevo.

## 5. Flujo recomendado para futuras modificaciones

1. `git pull` antes de trabajar: el editor de Shopify también escribe en `main`.
2. Para cambios chicos, trabajar directo en `main`. Para cambios grandes (una sección nueva, un rediseño),
   crear una rama corta `feature/nombre`, y opcionalmente conectarla en Shopify como un segundo tema sin
   publicar para probarla.
3. Probar con `shopify theme dev`.
4. Ejecutar `shopify theme check --fail-level error`. No se hace commit con errores.
5. Commit descriptivo y `git push`. Las ramas se integran a `main` por pull request.
6. Revisar en Shopify (**Ver registros**, junto a "Último guardado" en la tarjeta del tema) que la
   sincronización terminó sin errores.

Reglas:

- No editar `base.css` ni los `component-*.css` de Dawn. Los cambios globales van en `assets/safari-theme.css`.
- No modificar las secciones originales de Dawn. Lo nuevo se crea con prefijo `safari-`.
- No hacer `git push --force` sobre `main`: sobrescribe en Shopify lo que el comerciante haya editado.
- Cuando el tema esté publicado, `main` pasa a ser producción: todo cambio entra por rama y pull request.

### Actualizar Dawn

1. Descargar el nuevo tag de https://github.com/Shopify/dawn/releases.
2. Copiar sobre el repositorio las siete carpetas de tema, `release-notes.md` y `LICENSE.md`.
3. Volver a aplicar las dos ediciones de la tabla de la sección 1 (`theme.liquid` y `theme_info`).
4. `git diff` para revisar, Theme Check, y actualizar la tabla de versión de este README.

## 6. Recuperación ante errores

| Situación | Procedimiento |
|---|---|
| El tema en Shopify no refleja el último commit | Tarjeta del tema → **Acciones → Restablecer al último commit** |
| Un commit rompió el tema | `git revert <commit>` y `git push`. Shopify aplica el revert como un commit más |
| Shopify rechaza la rama ("no es un tema válido") | Verificar que las siete carpetas estén en la raíz del repositorio y que `layout/theme.liquid` exista |
| Error de sincronización | **Ver registros** en la tarjeta del tema. Suele ser un JSON inválido o un `schema` mal formado: corregir, Theme Check y nuevo commit |
| Conflicto entre el editor de Shopify y un push | Resolver en GitHub con `git pull`, corregir el conflicto y volver a subir |
| Se quiere volver al estado inicial | El primer commit del repositorio es Dawn 16.1.1 con la base Safari. `git revert` hasta ese punto o conectar ese commit en una rama nueva |
| Se subió una credencial por error | Revocarla de inmediato en Shopify o GitHub. Borrarla del historial no alcanza |

Antes de cualquier cambio riesgoso sobre un tema conectado: en Shopify, **Acciones → Duplicar** deja una
copia de respaldo independiente de GitHub.

## 7. Estado

- OT-001: preparación del repositorio. Ver [`docs/VALIDACIONES-OT-001.md`](docs/VALIDACIONES-OT-001.md).
- OT-002, base funcional: nueve secciones `safari-*` desarrolladas, sin integrar a las plantillas. Ver
  [`docs/SECCIONES-SAFARI.md`](docs/SECCIONES-SAFARI.md) y [`docs/VALIDACIONES-OT-002.md`](docs/VALIDACIONES-OT-002.md).
- OT-002, Fase B (pendiente): identidad visual, a la espera de la imagen de referencia.
