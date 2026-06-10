# BuscaIA 🔍

Buscador inteligente con IA — gratis, tuyo, público.

---

## Estructura del proyecto

```
buscador-groq/
├── index.html       ← La página web
├── api/
│   └── search.js    ← El backend (protege tu API key)
├── vercel.json      ← Configuración de Vercel
└── README.md
```

---

## Cómo desplegarlo en Vercel (paso a paso)

### Paso 1 — Sube el código a GitHub
1. Ve a https://github.com y crea una cuenta si no tienes
2. Crea un repositorio nuevo → ponle nombre `buscador-ia` → Public → Create
3. Sube los archivos: arrastra toda la carpeta `buscador-groq` al repositorio

### Paso 2 — Conecta con Vercel
1. Ve a https://vercel.com y crea cuenta con GitHub
2. Haz clic en **Add New Project**
3. Selecciona tu repositorio `buscador-ia`
4. Haz clic en **Deploy**

### Paso 3 — Agrega tu API key de Groq
1. En Vercel, ve a tu proyecto → **Settings** → **Environment Variables**
2. Agrega una variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** tu key de Groq (la que empieza con `gsk_...`)
3. Haz clic en **Save**
4. Ve a **Deployments** → haz clic en los tres puntos del último deploy → **Redeploy**

### Paso 4 — Listo
Vercel te da un link público tipo:
`https://buscador-ia-tuusuario.vercel.app`

---

## Personalización

Abre `index.html` y edita:
- **Nombre del sitio**: busca `BuscaIA` y cámbialo
- **Sugerencias**: busca el array `SUGGESTIONS`
- **Colores**: busca `:root` y edita `--accent`, `--bg`, etc.

---

## Costos
- Vercel: **gratis** (plan hobby)
- Groq: **gratis** (tiene límite generoso de solicitudes por minuto)
