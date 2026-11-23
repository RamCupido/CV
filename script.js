/* =========================================================
   PROYECTOS
   Para añadir un proyecto, copia un objeto y edítalo.
   - category: se usa para los filtros (se generan solos)
   - image: URL o ruta local (ej. "img/mi-proyecto.png")
   - demo: opcional, enlace a la versión desplegada
   ========================================================= */
const PROJECTS = [
    {
        title: 'Plataforma de reserva de restaurantes',
        description:
            'Sistema para gestionar reservas en restaurantes, diseñado con un enfoque en la arquitectura de software.',
        image: 'https://cdn.pixabay.com/photo/2016/11/18/22/21/restaurant-1837150_1280.jpg',
        category: 'Backend',
        tech: ['Arquitectura de software'],
        repo: 'https://github.com/RamCupido/RestaurantesArquitectura',
        demo: '',
    },
];

/* Roles que se escriben en el hero */
const ROLES = [
    'Desarrollador Full Stack',
    'Backend Developer',
    'Python · Java · JavaScript',
    'Docker & despliegue de servicios',
];

/* =========================================================
   Utilidades
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}

function showToast(msg) {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* =========================================================
   Tema claro / oscuro
   ========================================================= */
const root = document.documentElement;
const themeToggle = $('#themeToggle');

function syncThemeIcon() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
    themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
}

themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeIcon();
});
syncThemeIcon();

/* =========================================================
   Navegación: fondo al hacer scroll, menú móvil, link activo
   ========================================================= */
const header = $('#header');
const progress = $('#scrollProgress');
const navLinks = $('#navLinks');
const menuToggle = $('#menuToggle');

function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : '0';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = `<i class="fas fa-${open ? 'xmark' : 'bars'}"></i>`;
}
menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
$$('.nav-link').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            $$('.nav-link').forEach((a) =>
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
            );
        });
    },
    { rootMargin: '-45% 0px -50% 0px' }
);
$$('main section[id]').forEach((s) => sectionObserver.observe(s));

/* =========================================================
   Animaciones de aparición
   ========================================================= */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);
$$('.reveal').forEach((el) => revealObserver.observe(el));

/* =========================================================
   Efecto de escritura en el hero
   ========================================================= */
(function typeRoles() {
    const el = $('#typed');
    if (prefersReducedMotion) {
        el.textContent = ROLES[0];
        return;
    }
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function tick() {
        const word = ROLES[roleIdx];
        charIdx += deleting ? -1 : 1;
        el.textContent = word.slice(0, charIdx);

        let delay = deleting ? 35 : 70;
        if (!deleting && charIdx === word.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % ROLES.length;
            delay = 350;
        }
        setTimeout(tick, delay);
    }
    tick();
})();

/* =========================================================
   Foto de perfil: si no carga, muestra las iniciales
   ========================================================= */
const avatar = $('#avatar');
function avatarFallback() {
    avatar.hidden = true;
    $('#avatarFallback').hidden = false;
}
avatar.addEventListener('error', avatarFallback);
if (avatar.complete && avatar.naturalWidth === 0) avatarFallback();

/* =========================================================
   Proyectos + filtros
   ========================================================= */
const grid = $('#projectsGrid');
const filters = $('#projectFilters');

function projectCard(p, i) {
    const tech = p.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
    const demo = p.demo
        ? `<a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> Demo</a>`
        : '';
    return `
        <article class="project-card" style="animation-delay:${i * 80}ms">
            <div class="project-thumb">
                <span class="project-badge">${escapeHtml(p.category)}</span>
                <img src="${escapeHtml(p.image)}" alt="Vista previa de ${escapeHtml(p.title)}" loading="lazy">
            </div>
            <div class="project-body">
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.description)}</p>
                <ul class="tags">${tech}</ul>
                <div class="project-links">
                    <a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Código</a>
                    ${demo}
                </div>
            </div>
        </article>`;
}

function renderProjects(category = 'Todos') {
    const list = category === 'Todos' ? PROJECTS : PROJECTS.filter((p) => p.category === category);
    grid.innerHTML = list.map(projectCard).join('');
}

function renderFilters() {
    const categories = [...new Set(PROJECTS.map((p) => p.category))];
    if (categories.length < 2) return; // con una sola categoría no hacen falta filtros
    filters.innerHTML = ['Todos', ...categories]
        .map((c, i) => `<button class="filter-btn${i === 0 ? ' active' : ''}" data-cat="${escapeHtml(c)}" type="button">${escapeHtml(c)}</button>`)
        .join('');
    filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        $$('.filter-btn', filters).forEach((b) => b.classList.toggle('active', b === btn));
        renderProjects(btn.dataset.cat);
    });
}

renderFilters();
renderProjects();

/* =========================================================
   Contacto: copiar correo
   ========================================================= */
$('#copyEmail').addEventListener('click', async () => {
    const email = $('#emailText').textContent.trim();
    try {
        await navigator.clipboard.writeText(email);
        showToast('📋 Correo copiado al portapapeles');
    } catch {
        showToast(email);
    }
});

/* =========================================================
   "Descargar CV": abre el diálogo de impresión (Guardar como PDF)
   con una hoja de estilos optimizada para papel.
   ========================================================= */
$('#downloadCv').addEventListener('click', () => {
    $$('.reveal').forEach((el) => el.classList.add('visible'));
    window.print();
});

$('#year').textContent = new Date().getFullYear();
