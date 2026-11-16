# OT-001 — Registro de auditoría y validaciones

Fecha: 16/11/2026. Todas las pruebas de este registro se ejecutaron sobre el contenido exacto del commit
inicial. Lo que no se pudo ejecutar figura como limitación.

## 1. Estado inicial del repositorio (Fase A)

| Verificación | Resultado |
|---|---|
| Acceso | Repositorio público `equantum-py/safaristore`; la cuenta del responsable tiene permiso de escritura |
| Ramas | Ninguna. `git ls-remote` no devolvió referencias: `main` no existía |
| Commits, archivos, tags | Ninguno. Repositorio vacío |
| Tema Shopify preexistente | No |
| Archivos sensibles | No aplica (sin contenido) |

No se pudieron revisar por API la configuración del repositorio (protección de ramas, webhooks, apps
instaladas en la organización): requieren permisos de administración.

## 2. Origen de Dawn (Fase B)

- Versión: **16.1.1**, tag `v16.1.1`, commit `e9ac9c0f0b289da643164f4080380bd11ed27519` (02/11/2026).
- Era el tag de versión más reciente de https://github.com/Shopify/dawn al momento de la incorporación.
- Copia de archivos sin historial Git. Comparación archivo por archivo contra el original: solo difieren
  los archivos listados en el README, sección 1.

## 3. Validaciones (Fase G)

| Prueba | Herramienta | Resultado |
|---|---|---|
| Shopify Theme Check | Shopify CLI 5.0.1, `shopify theme check --fail-level error` | **0 errores**, 9 advertencias, 156 archivos |
| Línea base | Theme Check sobre Dawn 16.1.1 sin modificar | 0 errores, 9 advertencias, 155 archivos. Las 9 advertencias son las mismas |
| Estructura del tema | Script propio | Las 7 carpetas existen, sin subcarpetas no admitidas |
| Archivos requeridos | Script propio | 13 de 13 (`layout/theme.liquid`, `config/settings_*.json`, plantillas principales, locale por defecto, grupos de secciones) |
| Plantillas y archivos JSON | Script propio (parseo) | 67 de 67 válidos |
| `schema` de secciones | Script propio (parseo) | 38 de 38 válidos. Las otras 8 secciones de Dawn no declaran schema |
| Referencias a secciones | Script propio | 25 referencias en plantillas, grupos y layouts; todas resuelven |
| Referencias a snippets | Script propio | 157 `render`; todos resuelven |
| Referencias a assets | Script propio | 211 `asset_url` con nombre literal; todos existen |
| Archivos Liquid | Theme Check (sintaxis) | Sin errores |
| Secretos y archivos sensibles | Script propio (tokens Shopify, GitHub, AWS, Slack, claves privadas, `.env`, `.pem`, `.key`, `.zip`, `.log`) | 0 hallazgos |
| Esqueleto de sección documentado | Theme Check sobre una copia temporal con el esqueleto de `docs/ARQUITECTURA.md` | Sin hallazgos nuevos |

### Advertencias pendientes

Las 9 advertencias vienen de Dawn 16.1.1 original y no se corrigieron, para no alterar el tema base:

| Tipo | Cantidad |
|---|---|
| UndefinedObject | 3 |
| UnusedAssign | 2 |
| VariableName | 2 |
| LiquidComplexity | 1 |
| OrphanedSnippet | 1 |

Ninguna es un error ni impide la sincronización con Shopify.

## 4. Limitaciones

- **No se probó el tema en una tienda Shopify.** No se ejecutó `shopify theme dev` ni se subió el tema:
  la OT no entrega acceso a una tienda y prohíbe modificar tiendas. La carga real del tema se confirma
  recién al conectarlo (README, sección 4, pasos 9 y 10).
- **No se realizó la conexión GitHub → Shopify.** Requiere el administrador de la tienda y la
  autorización de la app de Shopify en la organización de GitHub.
- No se ejecutaron pruebas de rendimiento ni de accesibilidad (Lighthouse): necesitan una tienda en línea.
