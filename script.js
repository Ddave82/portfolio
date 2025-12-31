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

function toggleMobileMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  if (mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

if (hamburger) {
  // Use both touch and click events for iOS Safari compatibility
  hamburger.addEventListener('touchstart', toggleMobileMenu, { passive: false });
  hamburger.addEventListener('click', toggleMobileMenu);
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener('touchstart', closeMobileMenu, { passive: false });
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('touchstart', closeMobileMenu, { passive: false });
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking a link
mobileMenuLinks.forEach(link => {
  link.addEventListener('touchstart', () => {
    closeMobileMenu();
  }, { passive: true });
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

// Projects Slider
const projectsSlider = document.querySelector('.projects-slider');
const prevBtn = document.querySelector('.slider-nav.prev');
const nextBtn = document.querySelector('.slider-nav.next');

if (projectsSlider && prevBtn && nextBtn) {
  let currentIndex = 0;
  const cards = document.querySelectorAll('.project-card');
  const totalCards = cards.length;

  // Determine cards per view based on screen size
  function getCardsPerView() {
    if (window.innerWidth <= 599) return 1;
    if (window.innerWidth <= 959) return 2;
    return 4;
  }

  function updateSlider() {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    // Clamp currentIndex
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    // Calculate offset
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // Gap between cards
    const offset = -(currentIndex * (cardWidth + gap));

    projectsSlider.style.transform = `translateX(${offset}px)`;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  // Update on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlider();
    }, 100);
  });

  // Initial update
  updateSlider();
}

// Project Modal
const projectModal = document.getElementById('projectModal');
const modalOverlay = projectModal?.querySelector('.modal-overlay');
const modalClose = projectModal?.querySelector('.modal-close');
const modalBody = projectModal?.querySelector('.modal-body');

// Project data
const projectData = {
  ethicore: {
    title: 'ETHICORE - Ethical AI Automation',
    image: 'images/ethicore.png',
    tags: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design'],
    description: 'A modern, premium concept website for a fictional ethical AI automation company. The site demonstrates contemporary web design with advanced CSS animations, interactive JavaScript effects, and fully responsive layouts.',
    features: [
      'Glassmorphism cards with backdrop filter effects',
      'Animated 3D rotating cube as hero centerpiece',
      'Particle system with floating animations',
      'Dynamic light sweep effects across pages',
      'Hover animations with lift and glow effects',
      'Magnetic buttons that follow mouse movement',
      'Scroll-triggered fade-in and slide-up animations',
      'Custom cursor with glow effect (desktop only)'
    ],
    technologies: [
      'Semantic HTML5 markup',
      'CSS3 Grid & Flexbox layouts',
      'Advanced CSS animations & 3D transforms',
      'Vanilla JavaScript (ES6+)',
      'Intersection Observer API',
      'RequestAnimationFrame for smooth animations',
      'GPU-accelerated transforms for performance'
    ],
    link: 'https://ddave82.github.io/ETHICORE-Concept-Website/',
    linkText: 'View Live Demo'
  },
  froehlichundbunt: {
    title: 'Fröhlich und Bunt - Children\'s Music Channel',
    image: 'images/froehlichundbunt.png',
    tags: ['WordPress', 'Divi Builder', 'Custom Plugin', 'PHP', 'AzuraCast'],
    description: 'A vibrant WordPress website for a children\'s music channel. The platform features comprehensive information pages, a blog with news and updates, and a live radio stream playing children\'s songs, powered by AzuraCast.',
    features: [
      'Information pages about the children\'s music channel',
      'Blog system for news, updates and announcements',
      'Live radio stream with self-hosted AzuraCast integration',
      'Custom WordPress plugin for enhanced functionality',
      'Child-friendly, colorful design built with Divi',
      'Responsive design across all devices',
      'Optimized page loading and performance',
      'SEO-optimized structure for better discoverability',
      'Custom CSS for unique visual appearance'
    ],
    technologies: [
      'WordPress CMS',
      'Divi Theme & Builder',
      'Custom PHP Plugin Development',
      'AzuraCast Web Radio (Self-hosted)',
      'Advanced CSS3 Styling',
      'Responsive Web Design',
      'MySQL Database',
      'WordPress REST API',
      'Performance Optimization'
    ],
    link: 'https://froehlichundbunt.de',
    linkText: 'Visit Website'
  },
  cosmicinsights: {
    title: 'Cosmic Insights - AI Astrology App',
    image: 'images/cosmicinsights.png',
    tags: ['Next.js', 'TypeScript', 'AI Integration', 'Tailwind CSS', 'Google Gemini'],
    description: 'An intelligent web application that generates personalized astrological profiles using AI. Built with Next.js and powered by Google\'s Gemini AI, it delivers detailed astrological calculations and interpretive insights based on birth information.',
    features: [
      'AI-powered personalized horoscope generation',
      'Detailed astrological data: Ascendant, 12 houses, planet positions',
      'Aspect calculations and astrocartography insights',
      'Customized advice for love, career, and personal growth',
      'Interactive date/time selectors for precise birth data',
      'Bot protection with honeypot fields and timing checks',
      'Copy-to-clipboard functionality for sharing results',
      'Modern, responsive UI with smooth animations'
    ],
    technologies: [
      'Next.js 14 (App Router)',
      'TypeScript',
      'Google Gemini AI (Genkit Framework)',
      'Tailwind CSS',
      'ShadCN UI Components',
      'React Hook Form with Zod Validation',
      'date-fns Library',
      'Server-Side Rendering (SSR)'
    ],
    link: 'https://github.com/Ddave82/CosmicInsights',
    linkText: 'View on GitHub'
  },
  skyvela: {
    title: 'Skyvela - Aviation Charter Company',
    image: 'images/skyvela.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Concept Design'],
    description: 'A sophisticated concept website for Skyvela, a premium aviation charter company. The design showcases luxury air travel services with an elegant, modern interface that reflects the premium nature of private aviation.',
    features: [
      'Premium luxury design aesthetic',
      'Elegant hero section with aviation imagery',
      'Service showcase for charter offerings',
      'Smooth scroll animations and transitions',
      'Interactive fleet gallery',
      'Responsive design for all devices',
      'Modern UI with clean typography',
      'Professional brand presentation'
    ],
    technologies: [
      'Semantic HTML5',
      'CSS3 with advanced animations',
      'Vanilla JavaScript',
      'Responsive Web Design',
      'CSS Grid & Flexbox',
      'Modern UI/UX Principles',
      'Performance Optimization',
      'Cross-browser Compatibility'
    ],
    link: 'https://ddave82.github.io/Skyvela/',
    linkText: 'View Live Demo'
  }
};

function openProjectModal(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  const content = `
    ${project.image ? `<div class="project-hero-image"><img src="${project.image}" alt="${project.title}"></div>` : ''}
    <h2>${project.title}</h2>
    <div class="project-meta">
      ${project.tags.map(tag => `<span class="meta-tag">${tag}</span>`).join('')}
    </div>
    <p class="project-description">${project.description}</p>

    <h3>Key Features</h3>
    <ul>
      ${project.features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>

    <h3>Technologies</h3>
    <ul>
      ${project.technologies.map(tech => `<li>${tech}</li>`).join('')}
    </ul>

    <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
      ${project.linkText}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  `;

  modalBody.innerHTML = content;
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Event listeners for project cards
const projectCards = document.querySelectorAll('.project-card[data-project]');
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const projectId = card.getAttribute('data-project');
    openProjectModal(projectId);
  });
});

// Close modal events
if (modalOverlay) {
  modalOverlay.addEventListener('click', closeProjectModal);
}

if (modalClose) {
  modalClose.addEventListener('click', closeProjectModal);
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
    closeProjectModal();
  }
});

// Hero Interactive Elements
// Magnetic button effect
const heroButtons = document.querySelectorAll('.hero-actions .btn');
heroButtons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

// Service tiles stagger animation
const serviceTiles = document.querySelectorAll('.service-tile');
serviceTiles.forEach((tile, index) => {
  tile.style.animationDelay = `${index * 0.1}s`;
});
