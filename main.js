// ===================================
// Lazy Loading Images with Blur-up Effect
// ===================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('.lazy-img');
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );
            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            
            // Optional: Remove the data-src attribute after loading
            img.removeAttribute('data-src');
        };

        tempImg.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            // Still mark as loaded to hide placeholder
            img.classList.add('loaded');
        };

        tempImg.src = src;
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ===================================
// Scroll Animations with Intersection Observer
// ===================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in-scroll');
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );
            this.elements.forEach(el => this.observer.observe(el));
        } else {
            // Fallback: show all elements immediately
            this.elements.forEach(el => el.classList.add('visible'));
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Keep observing in case element scrolls out and back in
            }
        });
    }
}

// ===================================
// Navigation Bar Scroll Effect
// ===================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
        }

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.navMenu.contains(e.target) && 
                !this.menuToggle.contains(e.target) &&
                this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===================================
// Stats Counter Animation
// ===================================

class StatsCounter {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );
            this.statNumbers.forEach(stat => this.observer.observe(stat));
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animated.has(entry.target)) {
                this.animateCounter(entry.target);
                this.animated.add(entry.target);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ===================================
// Back to Top Button
// ===================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.button.addEventListener('click', this.scrollToTop.bind(this));
    }

    handleScroll() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Don't prevent default for links with just "#"
        if (href === '#') return;

        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ===================================
// Performance Optimization: Debounce
// ===================================

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Image Preloading for Critical Images
// ===================================

function preloadCriticalImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1920&q=80' // Hero image
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===================================
// Parallax Effect for Hero Section
// ===================================

class ParallaxEffect {
    constructor() {
        this.heroImg = document.querySelector('.hero-img');
        this.init();
    }

    init() {
        if (!this.heroImg) return;

        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                this.heroImg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, 5));
    }
}

// ===================================
// Loading Screen (Optional)
// ===================================

class LoadingScreen {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Remove any loading overlay if present
            const loader = document.querySelector('.page-loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 300);
                }, 500);
            }
        });
    }
}

// ===================================
// Image Error Handling
// ===================================

function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with a placeholder or hide the image
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src || this.getAttribute('data-src')}`);
        });
    });
}

// ===================================
// Reduce Motion Support
// ===================================

function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('scroll-behavior', 'auto');
    }
}

// ===================================
// Initialize All Features
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    checkReducedMotion();
    
    // Preload critical images
    preloadCriticalImages();
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize stats counter
    new StatsCounter();
    
    // Initialize back to top button
    new BackToTop();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Initialize loading screen
    new LoadingScreen();
    
    // Handle image errors
    handleImageErrors();
    
    // Log initialization
    console.log('🌟 Astron website initialized successfully');
});

// ===================================
// Performance Monitoring (Development)
// ===================================

if ('PerformanceObserver' in window) {
    try {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
        // Performance Observer not supported
        console.log('Performance monitoring not available');
    }
}

// ===================================
// Service Worker Registration (Optional - for PWA)
// ===================================

if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker for offline support
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
    */
}

// ===================================
// Export for Testing (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LazyLoader,
        ScrollAnimations,
        Navigation,
        StatsCounter,
        BackToTop,
        SmoothScroll,
        ParallaxEffect
    };
}
