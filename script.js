const MENU_ITEMS = [
  {
    id: "tarta-frutos",
    categoria: "reposteria",
    nombre: "Tarta de frutos rojos",
    descripcion: "Base de galleta, crema suave y topping de frutos rojos brillantes.",
    precio: 38,
    etiquetas: ["popular", "premium"],
    imagen: "images/reposteria/tarta-frutos-rojos.svg",
  },
  {
    id: "cheesecake-limon",
    categoria: "reposteria",
    nombre: "Cheesecake de limón",
    descripcion: "Cremosa, cítrica y ligera. Perfecta para café o celebración.",
    precio: 32,
    etiquetas: ["popular"],
    imagen: "images/reposteria/cheesecake-limon.svg",
  },
  {
    id: "cupcakes-vainilla",
    categoria: "reposteria",
    nombre: "Cupcakes de vainilla",
    descripcion: "12 unidades, crema sedosa y decoración lista para regalar.",
    precio: 28,
    etiquetas: ["popular"],
    imagen: "images/reposteria/cupcakes-vainilla.svg",
  },
  {
    id: "croissant-almendra",
    categoria: "reposteria",
    nombre: "Croissant de almendra",
    descripcion: "Hojaldre dorado, almendra tostada y toque de azúcar glass.",
    precio: 9,
    etiquetas: ["premium"],
    imagen: "images/reposteria/croissant-almendra.svg",
  },
  {
    id: "ensalada-burrata",
    categoria: "gourmet",
    nombre: "Ensalada burrata",
    descripcion: "Tomates, albahaca, aceite de oliva y burrata cremosa.",
    precio: 26,
    etiquetas: ["veg", "popular"],
    imagen: "images/gourmet/ensalada-burrata.svg",
  },
  {
    id: "salmon-citricos",
    categoria: "gourmet",
    nombre: "Salmón a los cítricos",
    descripcion: "Sellado perfecto con salsa cítrica y guarnición fresca.",
    precio: 42,
    etiquetas: ["premium"],
    imagen: "images/gourmet/salmon-citricos.svg",
  },
  {
    id: "risotto-setas",
    categoria: "gourmet",
    nombre: "Risotto de setas",
    descripcion: "Cremoso, con setas mixtas y toque de parmesano.",
    precio: 34,
    etiquetas: ["veg", "popular"],
    imagen: "images/gourmet/risotto-setas.svg",
  },
  {
    id: "postre-maridaje",
    categoria: "gourmet",
    nombre: "Postre + maridaje",
    descripcion: "Dulce de autor con bebida sugerida para cerrar con broche de oro.",
    precio: 29,
    etiquetas: ["premium", "popular"],
    imagen: "images/gourmet/postre-maridaje.svg",
  },
]

function formatPrice(value) {
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
      value * 1000,
    )
  } catch {
    return `$${value}`
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function buildTagPills(tags) {
  return tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")
}

function buildCard(item) {
  return `
    <article class="card" tabindex="0" role="button" aria-label="Ver ${escapeHtml(item.nombre)}" data-item-id="${escapeHtml(item.id)}">
      <div class="card__media">
        <img src="${escapeHtml(item.imagen)}" alt="${escapeHtml(item.nombre)}" loading="lazy" />
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3 class="card__title">${escapeHtml(item.nombre)}</h3>
          <span class="card__price">${escapeHtml(formatPrice(item.precio))}</span>
        </div>
        <p class="card__desc">${escapeHtml(item.descripcion)}</p>
        <div class="tags" aria-label="Etiquetas">${buildTagPills(item.etiquetas)}</div>
      </div>
    </article>
  `
}

function renderMenu(items) {
  const grid = document.querySelector("[data-menu-grid]")
  if (!grid) return
  if (items.length === 0) {
    grid.innerHTML = `<div class="empty">No hay resultados con esos filtros. Prueba otra búsqueda o etiqueta.</div>`
    return
  }
  grid.innerHTML = items.map(buildCard).join("")
}

function matchesSearch(item, query) {
  if (!query) return true
  const haystack = `${item.nombre} ${item.descripcion} ${item.etiquetas.join(" ")}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function setupMenuFiltering() {
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"))
  const searchInput = document.querySelector("[data-search]")
  const tagButtons = Array.from(document.querySelectorAll("[data-tag]"))

  let categoria = "reposteria"
  let query = ""
  let tag = null

  const apply = () => {
    const filtered = MENU_ITEMS.filter((item) => {
      const okCategory = categoria === "todo" ? true : item.categoria === categoria
      const okQuery = matchesSearch(item, query)
      const okTag = tag ? item.etiquetas.includes(tag) : true
      return okCategory && okQuery && okTag
    })
    renderMenu(filtered)
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.toggle("is-active", b === btn)
        b.setAttribute("aria-selected", b === btn ? "true" : "false")
      })
      categoria = btn.getAttribute("data-filter") || "todo"
      apply()
    })
  })

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || ""
      apply()
    })
  }

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-tag")
      const isActive = btn.classList.contains("is-active")
      tagButtons.forEach((b) => b.classList.remove("is-active"))
      tag = isActive ? null : next
      if (tag && next) btn.classList.add("is-active")
      apply()
    })
  })

  apply()
}

function setupHeader() {
  const header = document.querySelector("[data-header]")
  if (!header) return

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8)
  }
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]")
  const menu = document.querySelector("[data-nav-menu]")
  if (!toggle || !menu) return

  const close = () => {
    menu.classList.remove("is-open")
    toggle.setAttribute("aria-expanded", "false")
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open")
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false")
  })

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a")
    if (link) close()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close()
  })
}

function setupTheme() {
  const key = "kdj-theme"
  const toggle = document.querySelector("[data-theme-toggle]")
  const label = document.querySelector("[data-theme-label]")

  const apply = (theme) => {
    document.documentElement.setAttribute("data-theme", theme)
    if (label) label.textContent = theme === "light" ? "Claro" : "Oscuro"
  }

  const stored = localStorage.getItem(key)
  if (stored === "light" || stored === "dark") {
    apply(stored)
  } else {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches
    apply(prefersLight ? "light" : "dark")
  }

  toggle?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"
    const next = current === "light" ? "dark" : "light"
    localStorage.setItem(key, next)
    apply(next)
  })
}

function openDialog(dialog) {
  if (!dialog) return
  if (typeof dialog.showModal === "function") {
    dialog.showModal()
    return
  }
  dialog.setAttribute("open", "")
}

function closeDialog(dialog) {
  if (!dialog) return
  if (typeof dialog.close === "function") {
    dialog.close()
    return
  }
  dialog.removeAttribute("open")
}

function setupItemModal() {
  const dialog = document.querySelector("[data-modal]")
  const body = document.querySelector("[data-modal-body]")
  const closeBtn = document.querySelector("[data-modal-close]")
  const grid = document.querySelector("[data-menu-grid]")
  if (!dialog || !body || !grid) return

  const openItem = (item) => {
    body.innerHTML = `
      <div class="modal__media">
        <img src="${escapeHtml(item.imagen)}" alt="${escapeHtml(item.nombre)}" />
      </div>
      <div class="modal__meta">
        <h3 class="modal__title">${escapeHtml(item.nombre)}</h3>
        <p class="modal__desc">${escapeHtml(item.descripcion)}</p>
        <div class="tags" aria-label="Etiquetas">${buildTagPills(item.etiquetas)}</div>
        <div class="modal__row">
          <div><strong>${escapeHtml(formatPrice(item.precio))}</strong></div>
          <a class="btn btn--primary" href="#contacto">Quiero este</a>
        </div>
      </div>
    `
    openDialog(dialog)
  }

  const onActivate = (el) => {
    const id = el.getAttribute("data-item-id")
    const item = MENU_ITEMS.find((x) => x.id === id)
    if (!item) return
    openItem(item)
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-item-id]")
    if (!card) return
    onActivate(card)
  })

  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return
    const card = e.target.closest("[data-item-id]")
    if (!card) return
    e.preventDefault()
    onActivate(card)
  })

  closeBtn?.addEventListener("click", () => closeDialog(dialog))

  dialog.addEventListener("click", (e) => {
    const rect = dialog.getBoundingClientRect()
    const isInside =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
    if (!isInside) closeDialog(dialog)
  })
}

function setupLightbox() {
  const dialog = document.querySelector("[data-lightbox-modal]")
  const img = document.querySelector("[data-lightbox-img]")
  const closeBtn = document.querySelector("[data-lightbox-close]")
  const gallery = document.querySelector("[data-gallery]")
  if (!dialog || !img || !gallery) return

  gallery.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lightbox]")
    if (!btn) return
    const src = btn.getAttribute("data-lightbox")
    img.src = src || ""
    img.alt = "Imagen ampliada"
    openDialog(dialog)
  })

  closeBtn?.addEventListener("click", () => closeDialog(dialog))
  dialog.addEventListener("click", () => closeDialog(dialog))
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]")
  const hint = document.querySelector("[data-form-hint]")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const nombre = (data.get("nombre") || "").toString().trim()
    const telefono = (data.get("telefono") || "").toString().trim()
    const correo = (data.get("correo") || "").toString().trim()
    const tipo = (data.get("tipo") || "").toString()
    const fecha = (data.get("fecha") || "").toString()
    const mensaje = (data.get("mensaje") || "").toString().trim()

    const phone = "573042049489"
    const texto = [
      `Hola, soy ${nombre || "un cliente"}.`,
      "",
      `Quiero hacer un pedido de tipo: ${tipo || "sin especificar"}.`,
      fecha ? `Fecha: ${fecha}` : "",
      telefono ? `Teléfono: ${telefono}` : "",
      correo ? `Correo: ${correo}` : "",
      "",
      "Mensaje:",
      mensaje || "(sin mensaje adicional)",
      "",
      "Enviado desde la web de Repostería y Gourmet KDJ.",
    ]
      .filter(Boolean)
      .join("\n")

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`

    if (hint) hint.textContent = "Abriendo WhatsApp con tu pedido…"
    window.open(url, "_blank")
  })
}

setupHeader()
setupMobileNav()
setupTheme()
setupMenuFiltering()
setupItemModal()
setupLightbox()
setupContactForm()
