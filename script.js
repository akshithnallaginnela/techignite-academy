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

// ========== COURSES DATA & TABS ==========
const coursesData = {
    trending: [
        { title: 'Generative AI & LLM Engineering', desc: 'Build production-ready AI applications with GPT, LangChain, and vector databases.', icon: 'fa-robot', color: '#f59e0b', duration: '16 Weeks', price: '₹24,999', badge: '🔥 Hot' },
        { title: 'Full Stack MERN Development', desc: 'Master MongoDB, Express, React, and Node.js to build modern web applications.', icon: 'fa-layer-group', color: '#6366f1', duration: '20 Weeks', price: '₹19,999', badge: '⭐ Popular' },
        { title: 'AWS Solutions Architect', desc: 'Design and deploy scalable applications on Amazon Web Services with certification prep.', icon: 'fa-cloud', color: '#06b6d4', duration: '12 Weeks', price: '₹17,999', badge: '☁️ Cloud' },
        { title: 'Python for Data Science', desc: 'From EDA to machine learning — master Python for data-driven decision making.', icon: 'fa-chart-line', color: '#22c55e', duration: '14 Weeks', price: '₹15,999', badge: '📊 Data' },
        { title: 'DevOps & CI/CD Pipeline', desc: 'Learn Docker, Kubernetes, Jenkins, and Terraform for modern DevOps workflows.', icon: 'fa-infinity', color: '#a855f7', duration: '12 Weeks', price: '₹16,999', badge: '🔧 DevOps' },
        { title: 'React Native Mobile Dev', desc: 'Build cross-platform mobile apps for iOS and Android with React Native.', icon: 'fa-mobile-alt', color: '#ec4899', duration: '10 Weeks', price: '₹14,999', badge: '📱 Mobile' },
    ],
    fullstack: [
        { title: 'Full Stack Java Developer', desc: 'Java, Spring Boot, Microservices, React — complete enterprise stack.', icon: 'fa-java', color: '#ef4444', duration: '24 Weeks', price: '₹22,999', badge: '☕ Java' },
        { title: 'MEAN Stack Development', desc: 'MongoDB, Express, Angular, Node.js — full-stack JavaScript mastery.', icon: 'fa-code', color: '#dd1b16', duration: '20 Weeks', price: '₹19,999', badge: 'Angular' },
        { title: 'Python Full Stack', desc: 'Django/Flask backend with React frontend — versatile full stack skills.', icon: 'fa-python', color: '#3b82f6', duration: '18 Weeks', price: '₹18,999', badge: '🐍 Python' },
    ],
    placement: [
        { title: 'Job Guarantee: Full Stack + DSA', desc: '100% placement guarantee with 6 months of intensive training and interview prep.', icon: 'fa-briefcase', color: '#f59e0b', duration: '28 Weeks', price: '₹49,999', badge: '💼 Job Guarantee' },
        { title: 'Career Accelerator: Data Science', desc: 'Fast-track your data career with placement assistance and live projects.', icon: 'fa-rocket', color: '#10b981', duration: '24 Weeks', price: '₹44,999', badge: '🚀 Accelerator' },
    ],
    certification: [
        { title: 'AWS Certified Developer', desc: 'Prepare for the AWS Developer Associate certification with hands-on labs.', icon: 'fa-certificate', color: '#f97316', duration: '8 Weeks', price: '₹12,999', badge: '🏅 Cert' },
        { title: 'Azure Fundamentals + Admin', desc: 'Microsoft Azure certification track — AZ-900 to AZ-104.', icon: 'fa-microsoft', color: '#0ea5e9', duration: '10 Weeks', price: '₹14,999', badge: '🏅 Cert' },
        { title: 'Google Cloud Professional', desc: 'GCP Professional Cloud Architect certification preparation.', icon: 'fa-google', color: '#16a34a', duration: '10 Weeks', price: '₹14,999', badge: '🏅 Cert' },
    ],
    internship: [
        { title: 'AI & ML Internship', desc: '30-day immersive internship with capstone project and NASSCOM certification.', icon: 'fa-brain', color: '#8b5cf6', duration: '30 Days', price: '₹4,999', badge: '🎓 Intern' },
        { title: 'Web Development Internship', desc: 'Build 5 real-world projects during your internship with mentor guidance.', icon: 'fa-globe', color: '#14b8a6', duration: '45 Days', price: '₹5,999', badge: '🎓 Intern' },
    ],
};

const coursesGrid = document.getElementById('coursesGrid');
const courseTabs = document.getElementById('courseTabs');

function renderCourses(tab) {
    const cards = coursesData[tab] || [];
    coursesGrid.innerHTML = cards.map(c => `
        <div class="course-card">
            <div class="course-img" style="background: linear-gradient(135deg, ${c.color}33, ${c.color}11);">
                <i class="fas ${c.icon}" style="color:${c.color};"></i>
                <span class="course-badge">${c.badge}</span>
            </div>
            <div class="course-body">
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${c.duration}</span>
                    <span class="course-price">${c.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

renderCourses('trending');

courseTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.course-tab');
    if (!btn) return;
    courseTabs.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.tab);
});

// ========== STAT COUNTER ==========
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateCounters() {
    statNumbers.forEach(el => {
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '+';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    });
}

const statsSection = document.getElementById('stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.3 });
statsObserver.observe(statsSection);

// ========== TESTIMONIALS CAROUSEL ==========
const track = document.getElementById('testimonialTrack');
const cards = track.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('carouselDots');
let currentSlide = 0;
const slidesPerView = window.innerWidth > 768 ? 2 : 1;
const totalSlides = Math.ceil(cards.length / slidesPerView);

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot-indicator');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

function goToSlide(index) {
    currentSlide = index;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${currentSlide * cardWidth * slidesPerView}px)`;
    dotsContainer.querySelectorAll('.dot-indicator').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
}

document.getElementById('testimonialPrev').addEventListener('click', () => {
    goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1);
});
document.getElementById('testimonialNext').addEventListener('click', () => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
});

// Auto-play
setInterval(() => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
}, 5000);

// ========== SCROLL REVEAL ANIMATIONS ==========
const revealElements = document.querySelectorAll('.section-header, .course-card, .service-card, .belief, .stat-card, .domain-card, .testimonial-card, .blog-card, .contact-item, .company-logo');

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

// Close on overlay click
document.getElementById('enrollModal').addEventListener('click', function (e) {
    if (e.target === this) closeEnrollModal();
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeEnrollModal();
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
