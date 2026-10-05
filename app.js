var URL_AGENDA = "http://www.raydelto.org/agenda.php";
var contactos = [];

var $lista = document.getElementById("lista");
var $contador = document.getElementById("contador");
var $buscar = document.getElementById("buscar");
var $estadoLista = document.getElementById("estado-lista");
var $estadoForm = document.getElementById("estado-form");
var $form = document.getElementById("form");
var $guardar = document.getElementById("guardar");
var $recargar = document.getElementById("recargar");

function mostrar(el, texto, tipo) {
  el.textContent = texto;
  el.className = "msg " + tipo;
  el.hidden = false;
}

// GET: obtiene todos los contactos en JSON
function cargarContactos() {
  $recargar.disabled = true;
  $estadoLista.hidden = true;
  $contador.textContent = "Cargando contactos...";
  return fetch(URL_AGENDA)
    .then(function (r) {
      if (!r.ok) throw new Error("El servidor respondió con el código " + r.status);
      return r.json();
    })
    .then(function (datos) {
      contactos = Array.isArray(datos) ? datos : [];
      pintar();
    })
    .catch(function (e) {
      $contador.textContent = "";
      $lista.textContent = "";
      mostrar($estadoLista, "No se pudo cargar la lista (" + e.message + "). Revisa tu conexión y pulsa Recargar.", "error");
    })
    .then(function () { $recargar.disabled = false; });
}

function texto(c, campo) { return (c[campo] || "").toString().trim(); }

// Dibuja la lista agrupada por la inicial del nombre
function pintar() {
  var q = $buscar.value.trim().toLowerCase();
  var filtrados = contactos.filter(function (c) {
    return (texto(c, "nombre") + " " + texto(c, "apellido") + " " + texto(c, "telefono")).toLowerCase().indexOf(q) !== -1;
  }).sort(function (a, b) {
    return (texto(a, "nombre") + texto(a, "apellido")).localeCompare(texto(b, "nombre") + texto(b, "apellido"), "es");
  });

  $lista.textContent = "";
  $contador.textContent = filtrados.length + (filtrados.length === 1 ? " contacto" : " contactos");

  if (!filtrados.length) {
    var vacio = document.createElement("p");
    vacio.className = "empty";
    vacio.textContent = contactos.length ? "Ningún contacto coincide con la búsqueda." : "Todavía no hay contactos. Agrega el primero desde el formulario.";
    $lista.appendChild(vacio);
    return;
  }

  var letraActual = "", ul = null;
  filtrados.forEach(function (c) {
    var letra = (texto(c, "nombre").charAt(0) || "#").toUpperCase();
    if (letra !== letraActual) {
      letraActual = letra;
      var tab = document.createElement("div");
      tab.className = "letter";
      tab.textContent = letra;
      ul = document.createElement("ul");
      $lista.appendChild(tab);
      $lista.appendChild(ul);
    }
    var li = document.createElement("li");
    var nombre = document.createElement("span");
    nombre.className = "name";
    nombre.textContent = texto(c, "nombre") + " " + texto(c, "apellido");
    var tel = document.createElement("span");
    tel.className = "tel";
    tel.textContent = texto(c, "telefono");
    li.appendChild(nombre);
    li.appendChild(tel);
    ul.appendChild(li);
  });
}

// POST: envía un cuerpo JSON con nombre, apellido y telefono
$form.addEventListener("submit", function (ev) {
  ev.preventDefault();
  var nuevo = {
    nombre: $form.nombre.value.trim(),
    apellido: $form.apellido.value.trim(),
    telefono: $form.telefono.value.trim()
  };
  if (!nuevo.nombre || !nuevo.apellido || !nuevo.telefono) {
    mostrar($estadoForm, "Completa nombre, apellido y teléfono.", "error");
    return;
  }
  $guardar.disabled = true;
  $guardar.textContent = "Guardando...";
  fetch(URL_AGENDA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo)
  })
    .then(function (r) {
      if (!r.ok) throw new Error("El servidor respondió con el código " + r.status);
      $form.reset();
      mostrar($estadoForm, "Contacto guardado.", "ok");
      $form.nombre.focus();
      return cargarContactos();
    })
    .catch(function (e) {
      mostrar($estadoForm, "No se pudo guardar el contacto (" + e.message + "). Inténtalo de nuevo.", "error");
    })
    .then(function () {
      $guardar.disabled = false;
      $guardar.textContent = "Guardar contacto";
    });
});

$buscar.addEventListener("input", pintar);
$recargar.addEventListener("click", cargarContactos);
cargarContactos();
