# Tarea 3: Agenda Multicapas

**Curso:** Programación WEB (ITLA) · 2026-C-003
**Profesor:** Raydelto Hernández
**Estudiante:** _Tu nombre aquí_

## Descripción

Agenda web que muestra el listado de contactos guardados y permite agregar nuevos.
De cada contacto se almacena **nombre**, **apellido** y **teléfono**.

Los datos se leen y se guardan en el servicio web `http://www.raydelto.org/agenda.php`
usando la función `fetch` de JavaScript.

## Capturas de pantallas
<img width="1189" height="764" alt="image" src="https://github.com/user-attachments/assets/fea45efa-5b08-4d0e-a0dc-c10e1fa08a06" />


## Estructura del proyecto

```
agenda/
├── index.html       Estructura de la página (HTML5)
├── css/
│   └── styles.css   Estilos (CSS3)
├── js/
│   └── app.js       Lógica y consumo del servicio web (JavaScript)
└── README.md
```

Se separó en capas: **HTML** para la estructura, **CSS** para la presentación y
**JavaScript** para el comportamiento.

## Cómo ejecutarla

1. Descomprime el archivo `agenda.zip`.
2. Abre `index.html` en el navegador (doble clic).
3. No requiere instalar nada ni usar un servidor local.

> **Nota:** el servicio usa `http://` (sin HTTPS). Si la página se aloja en un sitio
> con HTTPS, el navegador bloqueará las peticiones por contenido mixto. Ábrela desde
> el disco o usa un hosting sin HTTPS.

## Funcionamiento

### Listar contactos (GET)

Al cargar la página se hace una petición `GET` a la URL del servicio, que responde
con la lista de contactos en formato JSON. Los contactos se muestran ordenados y
agrupados por la inicial del nombre.

```js
fetch("http://www.raydelto.org/agenda.php")
  .then(function (r) { return r.json(); })
  .then(function (contactos) { /* se dibujan en pantalla */ });
```

### Agregar un contacto (POST)

El formulario envía una petición `POST` a la misma URL con un cuerpo JSON con los
campos `nombre`, `apellido` y `telefono`. Al guardar con éxito, el formulario se
limpia y la lista se vuelve a cargar.

```js
fetch("http://www.raydelto.org/agenda.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre: "Ana", apellido: "Pérez", telefono: "809-555-0101" })
});
```

## Características

- Listado de contactos obtenido con `fetch` (GET).
- Registro de nuevos contactos con `fetch` (POST) y cuerpo JSON.
- Validación: no permite guardar si falta algún campo.
- Buscador por nombre, apellido o teléfono.
- Botón **Recargar** para volver a pedir la lista al servidor.
- Mensajes en pantalla para carga, éxito y errores de red.
- Diseño adaptable a celulares.

## Tecnologías

HTML5 · CSS3 · JavaScript · API `fetch` · JSON
