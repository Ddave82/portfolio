// Reveal on scroll with stagger
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = Array.from(reveals).indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => observer.observe(el));

// Subtle parallax on background glow
const glow = document.querySelector('.glow');
if (glow) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * -0.015;
    glow.style.transform = `translateY(${offset}px)`;
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

function openMobileMenu() {
  hamburger.classList.add('active');
  mobileMenu.classList.add('active');
  mobileMenuOverlay.classList.add('active');
  document.body.classList.add('menu-open');
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');
  document.body.classList.remove('menu-open');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking a link
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  }
});

// Update active state in mobile menu
window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });

  mobileMenuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formStatus.classList.remove('show', 'success', 'error');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formStatus.classList.add('show', 'success');
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.classList.remove('show');
        }, 5000);
      } else {
        // Error
        formStatus.textContent = '✗ Oops! Something went wrong. Please try again.';
        formStatus.classList.add('show', 'error');
      }
    } catch (error) {
      // Network error
      formStatus.textContent = '✗ Connection error. Please check your internet and try again.';
      formStatus.classList.add('show', 'error');
    } finally {
      // Remove loading state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}
