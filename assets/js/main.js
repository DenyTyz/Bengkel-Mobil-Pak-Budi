/* =====================================================
   Bengkel Pak Budi — main.js (Perfected Edition)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initSmoothScroll();
    initBackToTop();
    initScrollAnimations();
    initCounters();
    initServiceCardAnimations();
    initContactForm();
});

/* ---- NAVBAR ---- */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function onScroll() {
        // Scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            // Close mobile menu
            const collapse = document.getElementById('navbarNav');
            if (collapse && collapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }

            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

/* ---- BACK TO TOP ---- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- SCROLL-TRIGGERED ANIMATIONS ---- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll(
                    '.stat-item:not(.visible), .process-step:not(.visible), .testi-card:not(.visible)'
                );
                siblings.forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), i * 120);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.stat-item, .process-step').forEach(el => observer.observe(el));
}

/* ---- SERVICE CARD ANIMATIONS ---- */
function initServiceCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(card => observer.observe(card));
}

/* ---- ANIMATED COUNTERS ---- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString('id-ID') + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* ---- CONTACT FORM ---- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFormErrors(form);

        const data = {
            name: document.getElementById('name')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            vehicle: document.getElementById('vehicle')?.value.trim() || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value.trim() || ''
        };

        let valid = true;

        if (data.name.length < 3) {
            showFieldError('name', 'Nama minimal 3 karakter');
            valid = false;
        }
        if (!isValidPhone(data.phone)) {
            showFieldError('phone', 'Nomor WhatsApp tidak valid');
            valid = false;
        }
        if (data.email && !isValidEmail(data.email)) {
            showFieldError('email', 'Format email tidak valid');
            valid = false;
        }
        if (!data.vehicle) {
            showFieldError('vehicle', 'Harap isi jenis kendaraan');
            valid = false;
        }
        if (!data.service) {
            showFieldError('service', 'Silakan pilih layanan');
            valid = false;
        }

        if (!valid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Mengirim...';

        // Simulate API / WhatsApp redirect
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Kirim & Booking Sekarang';
            form.reset();
            showFormSuccess(form, data);
        }, 1600);
    });
}

function showFieldError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('is-invalid');
    const feedback = field.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = msg;
    field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
}

function clearFormErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function showFormSuccess(form, data) {
    // Remove existing alert
    const old = form.querySelector('.form-alert');
    if (old) old.remove();

    const alert = document.createElement('div');
    alert.className = 'form-alert form-alert-success';
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Pesan berhasil dikirim! Tim kami akan segera menghubungi <strong>${data.name}</strong> melalui WhatsApp.</span>
    `;
    form.appendChild(alert);

    // Build WhatsApp message
    const serviceLabels = {
        'ganti-oli': 'Ganti Oli',
        'service-mesin': 'Service Mesin',
        'service-aki': 'Service Aki & Kelistrikan',
        'service-rem': 'Service Rem',
        'service-ac': 'Service AC',
        'general-checkup': 'General Check-up',
        'lainnya': 'Konsultasi / Lainnya'
    };
    const waMsg = `Halo Bengkel Pak Budi! 👋\n\nSaya ingin booking servis:\n\n*Nama:* ${data.name}\n*Kendaraan:* ${data.vehicle || '-'}\n*Layanan:* ${serviceLabels[data.service] || data.service}\n*Nomor:* ${data.phone}\n${data.message ? '*Keluhan:* ' + data.message : ''}`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMsg)}`;

    setTimeout(() => {
        window.open(waUrl, '_blank');
        setTimeout(() => alert.remove(), 6000);
    }, 1000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{8,16}$/.test(phone);
}

/* ---- CSS for spinner injected by JS ---- */
const extraStyle = document.createElement('style');
extraStyle.textContent = `
    .spinner {
        display: inline-block;
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        vertical-align: middle;
        margin-right: 6px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(extraStyle);
