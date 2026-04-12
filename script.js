// ========== PRELOADER ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 800);
});

// ========== PARTICLE CANVAS ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== HAMBURGER ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Mobile dropdown toggle
document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            link.parentElement.classList.toggle('open');
        }
    });
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function () {
        if (window.innerWidth <= 768 && !this.parentElement.classList.contains('dropdown')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        }
    });
});

// ========== SMOOTH SCROLL FOR NAV ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== COURSES DATA ==========
const coursesData = {
    python: [
        {
            title: 'Python Full Stack Development',
            desc: 'Build modern web apps from UI to API with Python, React, and SQL, plus job-ready projects.',
            icon: 'fa-python',
            color: '#3b82f6',
            duration: '18 Weeks',
            price: '₹8,000',
            badge: '🚀 Career Track',
            highlights: [
                'HTML, CSS, JavaScript, Bootstrap foundations',
                'React with hooks, routing, and performance',
                'Python core, OOP, and backend architecture',
                'SQL, CRUD, and database design fundamentals',
            ],
            pdf: 'Python%20full%20stack%20syllabus.pdf',
        },
    ],
    mern: [
        {
            title: 'MERN Stack Development',
            desc: 'Go full stack with MongoDB, Express, React, and Node.js to ship portfolio-ready apps.',
            icon: 'fa-layer-group',
            color: '#6366f1',
            duration: '18 Weeks',
            price: '₹8,000',
            badge: '⭐ Most Popular',
            highlights: [
                'HTML, CSS, JavaScript, Bootstrap essentials',
                'React + Vite setup, components, hooks, routing',
                'Node.js + Express, REST APIs, middleware',
                'MongoDB + Mongoose, MVC, CRUD workflows',
            ],
            pdf: 'MERN%20Stack%20Syllabus.pdf',
        },
    ],
};

const coursesGrid = document.getElementById('coursesGrid');

function renderCourses(cards) {
    coursesGrid.innerHTML = cards.map(c => `
        <div class="course-card">
            <div class="course-img" style="background: linear-gradient(135deg, ${c.color}33, ${c.color}11);">
                <i class="fas ${c.icon}" style="color:${c.color};"></i>
                <span class="course-badge">${c.badge}</span>
            </div>
            <div class="course-body">
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                ${c.highlights ? `
                    <ul class="course-highlights">
                        ${c.highlights.map(item => `
                            <li><i class="fas fa-check-circle"></i> ${item}</li>
                        `).join('')}
                    </ul>
                ` : ''}
                ${c.pdf ? `
                    <div class="course-actions">
                        <a class="course-download" href="${c.pdf}" download>
                            <i class="fas fa-file-download"></i>
                            Download syllabus
                        </a>
                    </div>
                ` : ''}
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${c.duration}</span>
                    <span class="course-price">${c.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

const allCourses = Object.values(coursesData).flat();
renderCourses(allCourses);

// ========== SCROLL REVEAL ANIMATIONS ==========
const revealElements = document.querySelectorAll('.section-header, .course-card, .service-card, .belief, .contact-item, .company-logo');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ========== CONTACT FORM ==========
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmailInput').value.trim();
    const phone = document.getElementById('contactPhoneInput').value.trim();
    const interestedIn = document.getElementById('contactCourse').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !phone || !interestedIn) return;

    const iframe = document.getElementById('contactIframe');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = 'contactIframe';

    const fields = {
        name,
        email,
        phone,
        interestedIn,
        message,
        formType: 'contact',
    };

    Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    const btn = document.getElementById('contactSubmitBtn');
    btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
        btn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

// ========== NEWSLETTER FORM ==========
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    const origValue = input.value;
    input.value = '✓ Subscribed!';
    input.style.color = '#22c55e';
    setTimeout(() => {
        input.value = '';
        input.style.color = '';
    }, 2500);
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-links > li > a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========== ENROLL MODAL ==========
function openEnrollModal() {
    document.getElementById('enrollModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to form screen
    document.getElementById('enrollFormScreen').style.display = 'block';
    document.getElementById('enrollSuccessScreen').style.display = 'none';
    document.getElementById('enrollForm').reset();
}

function closeEnrollModal() {
    document.getElementById('enrollModal').classList.remove('active');
    document.body.style.overflow = '';
}

function openPlacementModal() {
    document.getElementById('placementModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('placementFormScreen').style.display = 'block';
    document.getElementById('placementSuccessScreen').style.display = 'none';
    document.getElementById('placementForm').reset();
}

function closePlacementModal() {
    document.getElementById('placementModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close on overlay click
document.getElementById('enrollModal').addEventListener('click', function (e) {
    if (e.target === this) closeEnrollModal();
});

document.getElementById('placementModal').addEventListener('click', function (e) {
    if (e.target === this) closePlacementModal();
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeEnrollModal();
        closePlacementModal();
    }
});

// ⚠️ Replace this with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6-AGxU32W7vfobNVxy93JtPgxmqMOfdh9GRS7N77eSv5swflKBTbKMgB_N3wbCi4Lfw/exec';
// Form submit
document.getElementById('enrollForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('enroll-name').value.trim();
    const email   = document.getElementById('enroll-email').value.trim();
    const phone   = document.getElementById('enroll-phone').value.trim();
    const passout = document.getElementById('enroll-passout').value;
    const branch  = document.getElementById('enroll-branch').value;

    if (!name || !email || !phone || !passout || !branch) return;

    // Submit via hidden iframe to avoid CORS and page redirect
    const iframe = document.getElementById('enrollIframe');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = 'enrollIframe';

    const fields = { name, email, phone, passout, branch };
    Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    document.getElementById('enrollFormScreen').style.display = 'none';
    document.getElementById('enrollSuccessScreen').style.display = 'block';
});

// Placement assistance submit
document.getElementById('placementForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('placement-name').value.trim();
    const email = document.getElementById('placement-email').value.trim();
    const phone = document.getElementById('placement-phone').value.trim();
    const passout = document.getElementById('placement-passout').value;
    const branch = document.getElementById('placement-branch').value;
    const assistanceType = document.getElementById('placement-assistance').value;
    const domainInterest = document.getElementById('placement-domain').value;

    if (!name || !email || !phone || !passout || !branch || !assistanceType || !domainInterest) return;

    const iframe = document.getElementById('placementIframe');
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = APPS_SCRIPT_URL;
    form.target = 'placementIframe';

    const fields = {
        name,
        email,
        phone,
        passout,
        branch,
        assistanceType,
        domainInterest,
        formType: 'placement',
    };
    Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = val;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    document.getElementById('placementFormScreen').style.display = 'none';
    document.getElementById('placementSuccessScreen').style.display = 'block';
});
