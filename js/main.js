/* ─── SCROLL REVEAL ─────────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── MOBILE NAV ────────────────────────────────────────────────── */
const toggle   = document.getElementById('navToggle');
const mobileNav = document.getElementById('navMobile');

toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', open);
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    toggle.classList.remove('open');
}));

/* ─── SMOOTH SCROLL ─────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ─── CAROUSEL ──────────────────────────────────────────────────── */
(function () {
    const track  = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const total  = slides.length;

    /* build dots */
    slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => scrollTo(i));
        dotsWrap.appendChild(d);
    });

    const dots = () => Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

    function setActive(i) {
        dots().forEach((d, idx) => d.classList.toggle('active', idx === i));
    }

    function scrollTo(i) {
        const slide = slides[i];
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }

    /* sync dots on scroll */
    let scrollTimer;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const center = track.scrollLeft + track.clientWidth / 2;
            let closest = 0, minDist = Infinity;
            slides.forEach((s, i) => {
                const dist = Math.abs(s.offsetLeft + s.clientWidth / 2 - track.offsetLeft - center);
                if (dist < minDist) { minDist = dist; closest = i; }
            });
            setActive(closest);
        }, 60);
    }, { passive: true });

    /* drag-to-scroll (desktop) */
    let isDown = false, startX, scrollLeft;

    track.addEventListener('mousedown', e => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX    = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });
    document.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
    track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.4;
        track.scrollLeft = scrollLeft - walk;
    });
    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'grab';
    });
})();
