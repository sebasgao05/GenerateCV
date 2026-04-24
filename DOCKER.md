# Docker - GenerateCV

## Requisitos

- Docker Desktop instalado y corriendo
- Puerto 3000 y 8080 disponibles

---

## Construir

### Solo Frontend
```bash
docker build -t generate-cv-frontend .
```

### Solo LaTeX (Backend)
```bash
docker build -t latex-generator ./latex
```

### Ambos servicios (docker-compose)
```bash
docker-compose build
```

---

## Iniciar

### Solo Frontend (puerto 3000)
```bash
docker run -p 3000:3000 generate-cv-frontend
```

### Solo LaTeX (puerto 8080)
```bash
docker run -p 8080:8080 latex-generator
```

### Ambos servicios
```bash
docker-compose up
```

### En segundo plano
```bash
docker-compose up -d
```

---

## Usar

### Frontend
Abre en tu navegador: `http://localhost:3000`

### LaTeX API
Envía datos JSON para generar PDF:

```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tu Nombre",
    "role": "Tu Rol",
    "email": "tu@email.com",
    "phone": "+57 300 000 0000",
    "location": "Ciudad, País",
    "linkedin": "https://linkedin.com/in/tu-usuario",
    "website": "https://tu-sitio.com",
    "summary": "Tu resumen profesional",
    "skills": {
      "languages": "Java, Python, Node.js",
      "frontend": "React, Angular",
      "backend": "Spring Boot, Express",
      "cloud": "AWS, Azure",
      "devops": "Docker, Kubernetes",
      "testing": "JUnit, Jest",
      "databases": "MySQL, PostgreSQL"
    },
    "experiences": [{
      "company": "Empresa",
      "position": "Cargo",
      "start": "2023",
      "end": "Presente",
      "details": "Descripción de logros"
    }],
    "education": [{
      "institution": "Universidad",
      "program": "Carrera",
      "eduStart": "2019",
      "eduEnd": "2023"
    }],
    "certs": [{
      "certTitle": "Certificación",
      "certOrg": "Organización",
      "certYear": "2024"
    }],
    "volunteering": [{
      "title": "Título",
      "role": "Rol",
      "start": "2024",
      "end": "Presente",
      "description": "Descripción"
    }],
    "projects": [{
      "projectTitle": "Proyecto",
      "projectDesc": "Descripción"
    }]
  }' -o cv.pdf
```

---

## Apagar

### Detener contenedores corriendo
```bash
# Si usaste docker-compose
docker-compose stop

# O individually
docker stop $(docker ps -q)
```

### Eliminar contenedores
```bash
docker-compose down

# O individualmente
docker rm -f $(docker ps -aq)
```

---

## Limpiar Todo

### Eliminar contenedores
```bash
docker rm -f $(docker ps -aq)
```

### Eliminar imágenes
```bash
docker rmi -f $(docker images -q)
```

### Eliminar volúmenes (si hay)
```bash
docker volume prune -f
```

---

## Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | 3000 |
| LaTeX API | 8080 |

---

## Estructura

```
├── Dockerfile              # Frontend
├── docker-compose.yml     # Ambos servicios
├── latex/
│   ├── Dockerfile    # LaTeX generator
│   ├── lambda.js    # Handler
│   └── template.tex # Plantilla
├── index.html
├── styles/
├── logic/
└── libs/
```
