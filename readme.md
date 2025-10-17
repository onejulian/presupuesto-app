# 💰 Aplicación de Presupuesto Personal

Una aplicación web moderna y elegante para gestionar ingresos y egresos personales, construida con JavaScript vanilla y estilizada con **Tailwind CSS 4** en modo oscuro.

## ✨ Características

- 🌙 **Diseño en modo oscuro** profesional y elegante
- 📱 **Completamente responsive** (móvil, tablet, desktop)
- 🎨 **Tailwind CSS 4** instalado vía npm (no CDN)
- ✨ **Efectos glassmorphism** y sombras elegantes
- 🎯 **Cálculo automático** de presupuesto disponible
- 📊 **Seguimiento en tiempo real** de ingresos y egresos
- 📈 **Porcentajes visuales** de gastos respecto a ingresos
- 🎭 **Animaciones suaves** y transiciones profesionales
- 🗑️ **Eliminación fácil** de transacciones con hover

## 🎨 Paleta de Colores

- **Fondo principal**: `#0a0e27` (Azul oscuro profundo)
- **Tarjetas**: `#151b3d` con efecto glassmorphism
- **Ingresos**: Gradiente verde esmeralda (`#10b981` → `#059669`)
- **Egresos**: Gradiente rojo (`#ef4444` → `#dc2626`)
- **Acentos**: Gradiente púrpura (`#667eea` → `#764ba2` → `#f093fb`)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd presupuesto-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Compilar Tailwind CSS**
```bash
npm run build:css
```

4. **Abrir la aplicación**
Simplemente abre `index.html` en tu navegador favorito.

## 📦 Scripts disponibles

```bash
# Compila Tailwind CSS (versión minificada para producción)
npm run build:css

# Modo desarrollo - observa cambios en tiempo real
npm run watch:css
```

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos personalizados avanzados
- **Tailwind CSS 4.1.14** - Framework de utilidades CSS
- **JavaScript ES6+** - Lógica de la aplicación
- **Ionicons 5.4.0** - Sistema de iconos moderno

## 📱 Diseño Responsive

La aplicación se adapta perfectamente a todos los dispositivos:

| Dispositivo | Ancho | Características |
|------------|-------|-----------------|
| 📱 **Móvil** | < 640px | Layout vertical, elementos apilados |
| 📱 **Tablet** | 640px - 1024px | Formulario horizontal, grid adaptativo |
| 💻 **Desktop** | > 1024px | Layout de 2 columnas, espaciado amplio |

## 🎯 Uso

1. **Agregar transacción**
   - Selecciona el tipo (+ Ingreso o - Egreso)
   - Ingresa una descripción clara
   - Define el valor monetario
   - Haz clic en "Agregar" (✓)

2. **Ver resumen**
   - El **Balance Disponible** se actualiza automáticamente
   - Los **Ingresos** totales se muestran en verde
   - Los **Egresos** totales aparecen en rojo con porcentaje

3. **Eliminar transacción**
   - Pasa el cursor sobre cualquier elemento
   - Aparecerá un botón de basura (🗑️)
   - Haz clic para eliminar

## 📂 Estructura del proyecto

```
presupuesto-app/
├── css/
│   ├── input.css       # Entrada de Tailwind CSS + estilos custom
│   └── output.css      # CSS compilado (generado automáticamente)
├── js/
│   ├── app.js          # Lógica principal de la aplicación
│   ├── Dato.js         # Clase base para transacciones
│   ├── Ingreso.js      # Modelo de Ingreso
│   └── Egreso.js       # Modelo de Egreso
├── index.html          # Página principal
├── package.json        # Configuración de npm y scripts
├── .gitignore          # Archivos a ignorar en git
└── readme.md          # Este archivo
```

## 🎨 Características de Diseño

### Glassmorphism
Las tarjetas utilizan un efecto de vidrio esmerilado con:
- Fondo semi-transparente
- Backdrop filter blur
- Bordes sutiles con opacidad

### Gradientes Elegantes
- **Header**: Gradiente púrpura diagonal
- **Ingresos**: Verde esmeralda
- **Egresos**: Rojo intenso
- **Botón agregar**: Púrpura vibrante

### Microinteracciones
- Hover scales en tarjetas
- Transiciones suaves en todos los elementos
- Animación de aparición en botones de eliminar
- Focus rings personalizados

## 🔧 Desarrollo

Para trabajar en el proyecto con recarga automática:

```bash
npm run watch:css
```

Esto compilará automáticamente los estilos cada vez que hagas cambios en:
- `css/input.css`
- Clases de Tailwind en `index.html`
- Clases de Tailwind en `js/app.js`

## 🌐 Despliegue

### Producción

Antes de desplegar, asegúrate de:

1. ✅ Ejecutar `npm run build:css` para generar CSS optimizado
2. ✅ Verificar que `css/output.css` esté incluido
3. ✅ Probar en diferentes navegadores
4. ✅ Validar responsive en múltiples dispositivos

### GitHub Pages

```bash
# Construir CSS
npm run build:css

# Commit y push
git add .
git commit -m "Build production CSS"
git push origin main
```

### Netlify / Vercel

El proyecto es compatible con deploy automático. Solo configura:
- **Build command**: `npm run build:css`
- **Publish directory**: `./`

## 🎯 Próximas Mejoras

- [ ] Persistencia de datos en LocalStorage
- [ ] Exportar datos a CSV/Excel
- [ ] Filtros por fecha
- [ ] Gráficos y estadísticas
- [ ] Categorías personalizadas
- [ ] Metas de ahorro

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Desarrollado con

- ❤️ Pasión por el diseño limpio
- ☕ Café (mucho café)
- 🎨 Buen gusto visual
- 💻 Las mejores prácticas de desarrollo

---

**¿Te gusta el proyecto?** ⭐ Dale una estrella en GitHub
