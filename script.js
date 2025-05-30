/**
 * Ingetest SpA Website JavaScript
 * Main script file handling all interactive functionality
 * Includes carousel, animations, form handling, and custom UI elements
 */

/**
 * Carousel Class
 * Handles the hero section image carousel with fade transitions
 * @class
 */
class Carousel {
    /**
     * Creates a new Carousel instance
     * @param {HTMLElement} element - The carousel container element
     */
    constructor(element) {
        this.element = element;
        this.items = Array.from(element.getElementsByClassName('carousel-item'));
        this.currentIndex = 0;
        this.interval = 5000; // Transition every 5 seconds
        this.isTransitioning = false;
        
        this.init();
    }
    
    /**
     * Initializes the carousel
     * Shows first slide and starts autoplay
     */
    init() {
        this.items[0].classList.remove('hidden');
        this.startAutoPlay();
    }
    
    /**
     * Transitions to the next slide with fade effect
     * Handles opacity transitions and timing
     */
    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const current = this.items[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        const next = this.items[this.currentIndex];
        
        // Fade transition logic
        current.style.opacity = '1';
        next.classList.remove('hidden');
        next.style.opacity = '0';
        
        requestAnimationFrame(() => {
            current.style.opacity = '0';
            next.style.opacity = '1';
            
            setTimeout(() => {
                current.classList.add('hidden');
                this.isTransitioning = false;
            }, 500); // 500ms transition duration
        });
    }
    
    /**
     * Starts automatic slideshow
     * Cycles through slides at set interval
     */
    startAutoPlay() {
        setInterval(() => this.next(), this.interval);
    }
}

/**
 * Image Preloader
 * Improves performance by preloading carousel images
 * Loads both WebP and JPEG formats in multiple sizes
 */
function preloadCarouselImages() {
    const heroImages = [
        // Large WebP versions
        'img/hero/hero-1_large.webp',
        'img/hero/hero-2_large.webp',
        'img/hero/hero-3_large.webp',
        // Large JPEG fallbacks
        'img/hero/hero-1_large.jpg',
        'img/hero/hero-2_large.jpg',
        'img/hero/hero-3_large.jpg',
        // Medium WebP versions
        'img/hero/hero-1_medium.webp',
        'img/hero/hero-2_medium.webp',
        'img/hero/hero-3_medium.webp',
        // Medium JPEG fallbacks
        'img/hero/hero-1_medium.jpg',
        'img/hero/hero-2_medium.jpg',
        'img/hero/hero-3_medium.jpg'
    ];

    // Create new Image objects to trigger preload
    heroImages.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

/**
 * Animated Background
 * Creates parallax wave effect in the background
 * Responds to scroll position for dynamic movement
 */
function initScrollBackground() {
    const waves = document.querySelectorAll('.scroll-bg path');
    let scrollPos = 0;
    let ticking = false;

    /**
     * Updates wave positions based on scroll
     * @param {number} scrollPos - Current scroll position
     */
    function updateWaves(scrollPos) {
        const moveAmount = scrollPos * 0.1;
        waves.forEach((wave, index) => {
            const offset = (index + 1) * 20;
            wave.style.transform = `translate3d(${Math.sin(moveAmount * 0.05) * offset}px, ${Math.cos(moveAmount * 0.05) * offset}px, 0)`;
        });
    }

    // Scroll event handler with requestAnimationFrame for performance
    window.addEventListener('scroll', function() {
        scrollPos = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateWaves(scrollPos);
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Document Ready Handler
 * Initializes all main functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image preloading
    preloadCarouselImages();
    
    // Initialize Bootstrap carousel
    const carousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 5000,
        ride: 'carousel'
    });

    // Initialize animated background
    initScrollBackground();
    
    /**
     * Smooth Scrolling
     * Handles smooth scroll behavior for navigation links
     * Includes mobile menu handling
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    });

    /**
     * Contact Form Handler
     * Manages form validation and submission
     * Displays success message and resets form
     */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            if (!form.checkValidity()) {
                event.stopPropagation();
            } else {
                // Form data handling
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                console.log('Form submitted:', data);
                
                // Success message display
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success mt-3 alert-dismissible fade show';
                alertDiv.innerHTML = `
                    Gracias por tu mensaje! Te contactaremos pronto.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                form.insertAdjacentElement('beforebegin', alertDiv);
                
                this.reset();
                
                // Auto-remove alert after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }
            
            form.classList.add('was-validated');
        });
    }

    /**
     * Navbar Scroll Effect
     * Changes navbar appearance on scroll
     * Adds transparency and shadow effects
     */
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

    /**
     * Stats Counter Animation
     * Animates number counting in stats section
     * Uses Intersection Observer for scroll-based triggering
     */
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    /**
     * Animates the stats numbers
     * Counts up from 0 to target number
     */
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds animation
            const start = 0;
            const increment = target / (duration / 16); // 60fps
            
            let current = start;
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (stat.getAttribute('data-suffix') || '');
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current) + (stat.getAttribute('data-suffix') || '');
                }
            }, 16);
        });
        animated = true;
    }

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe stats section
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

/**
 * Custom Pointer Effect
 * Creates an interactive custom mouse pointer
 * Changes appearance based on background and hover states
 */

// Create pointer elements
const pointer = document.createElement('div');
pointer.id = 'custom-pointer';
pointer.innerHTML = '<div class="pointer-core"></div>';
document.body.appendChild(pointer);

/**
 * Pointer Styles
 * Defines the appearance and behavior of the custom pointer
 * Includes variations for different backgrounds and states
 */
const style = document.createElement('style');
style.textContent = `
    #custom-pointer {
        width: 20px;
        height: 20px;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.2s ease;
        mix-blend-mode: difference;
    }

    .pointer-core {
        width: 100%;
        height: 100%;
        background: rgba(0, 64, 128, 0.3);
        border: 2px solid #004080;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    /* Style variations for different backgrounds */
    .bg-white ~ #custom-pointer .pointer-core {
        background: rgba(0, 64, 128, 0.2);
        border-color: #004080;
    }

    .bg-dark ~ #custom-pointer .pointer-core {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.8);
    }

    .page-header ~ #custom-pointer .pointer-core {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.9);
    }

    /* Interactive element hover effects */
    a:hover ~ #custom-pointer,
    button:hover ~ #custom-pointer,
    [role="button"]:hover ~ #custom-pointer {
        transform: translate(-50%, -50%) scale(1.5);
    }

    a:hover ~ #custom-pointer .pointer-core,
    button:hover ~ #custom-pointer .pointer-core,
    [role="button"]:hover ~ #custom-pointer .pointer-core {
        background: rgba(0, 31, 64, 0.4);
        border-color: #001f40;
        box-shadow: 0 0 10px rgba(0, 64, 128, 0.3);
    }

    .bg-dark a:hover ~ #custom-pointer .pointer-core,
    .bg-dark button:hover ~ #custom-pointer .pointer-core {
        background: rgba(255, 255, 255, 0.4);
        border-color: rgba(255, 255, 255, 0.9);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }

    body {
        cursor: none;
    }

    a, button, [role="button"] {
        cursor: none;
    }
`;
document.head.appendChild(style);

/**
 * Pointer Movement Handler
 * Manages smooth pointer movement and color adaptation
 */
let mouseX = 0;
let mouseY = 0;
let pointerX = 0;
let pointerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dynamic color adaptation
    const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
    if (elementUnderPointer) {
        const backgroundColor = window.getComputedStyle(elementUnderPointer).backgroundColor;
        const isOverDark = isDarkColor(backgroundColor);
        
        const pointerCore = pointer.querySelector('.pointer-core');
        if (isOverDark) {
            pointerCore.style.background = 'rgba(255, 255, 255, 0.3)';
            pointerCore.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        } else {
            pointerCore.style.background = 'rgba(0, 64, 128, 0.2)';
            pointerCore.style.borderColor = '#004080';
        }
    }
});

/**
 * Color Detection Helper
 * Determines if a background color is dark
 * Used for dynamic pointer color adaptation
 * @param {string} color - CSS color value
 * @returns {boolean} True if color is dark
 */
function isDarkColor(color) {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return false;
    
    const rgb = color.match(/\d+/g);
    if (!rgb) return false;
    
    // Calculate relative luminance using perceived brightness formula
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance < 0.5;
}

/**
 * Smooth Pointer Animation
 * Updates pointer position with smooth interpolation
 * Uses requestAnimationFrame for optimal performance
 */
function updatePointer() {
    // Smooth interpolation with easing
    pointerX += (mouseX - pointerX) * 0.2;
    pointerY += (mouseY - pointerY) * 0.2;

    pointer.style.left = `${pointerX}px`;
    pointer.style.top = `${pointerY}px`;

    requestAnimationFrame(updatePointer);
}
updatePointer();

/**
 * Pointer Visibility Handlers
 * Manage pointer visibility when entering/leaving window
 */
document.addEventListener('mouseleave', () => {
    pointer.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    pointer.style.opacity = '1';
}); 