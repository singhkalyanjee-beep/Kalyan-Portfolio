// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = 'light'; // Start with light theme
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.currentTheme = theme;
        
        // Force a repaint to ensure theme changes are visible
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupScrollTracking();
        this.setupActiveNavigation();
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = this.navbar.offsetHeight;
                    const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    this.setActiveLink(link);
                }
            });
        });
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    setupScrollTracking() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollProgress();
                    this.updateActiveNavigation();
                    this.handleNavbarBackground();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
        this.scrollProgress.style.width = `${scrollPercentage}%`;
    }
    
    updateActiveNavigation() {
        const scrollPosition = window.scrollY + 150; // Adjusted offset for better detection
        
        let currentSection = null;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const sectionId = currentSection.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    }
    
    handleNavbarBackground() {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 50) {
            this.navbar.style.background = 'rgba(252, 252, 249, 0.95)';
            this.navbar.style.boxShadow = 'var(--shadow-sm)';
        } else {
            this.navbar.style.background = 'rgba(252, 252, 249, 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }
    
    setupActiveNavigation() {
        // Set initial active state
        if (window.scrollY < 100) {
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) {
                this.setActiveLink(homeLink);
            }
        } else {
            this.updateActiveNavigation();
        }
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateSkillBars();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.timeline-item, .service-card, .achievement-card, .portfolio-card, .skill-category'
        );
        
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    }
}

// Contact Form Management
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation();
        }
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        this.clearError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = 'var(--color-error)';
            errorElement.style.fontSize = 'var(--font-size-sm)';
            errorElement.style.marginTop = 'var(--space-4)';
            errorElement.style.display = 'block';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            this.submitForm();
        } else {
            this.showFormError('Please correct the errors above');
        }
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccess('Thank you for your message! I will get back to you within 24 hours.');
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    showFormError(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.style.padding = 'var(--space-12)';
        messageElement.style.borderRadius = 'var(--radius-base)';
        messageElement.style.marginBottom = 'var(--space-16)';
        messageElement.style.fontWeight = 'var(--font-weight-medium)';
        
        if (type === 'success') {
            messageElement.style.backgroundColor = 'rgba(33, 128, 141, 0.1)';
            messageElement.style.color = 'var(--color-success)';
            messageElement.style.border = '1px solid rgba(33, 128, 141, 0.3)';
        } else {
            messageElement.style.backgroundColor = 'rgba(192, 21, 47, 0.1)';
            messageElement.style.color = 'var(--color-error)';
            messageElement.style.border = '1px solid rgba(192, 21, 47, 0.3)';
        }
        
        messageElement.textContent = message;
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const criticalResources = [
            'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
}

// Utility Functions
class Utils {
    static throttle(func, wait) {
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
    
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
}

// Add CSS for animations and interactions
const animationStyles = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(192, 21, 47, 0.1);
    }
    
    /* Smooth transitions for theme switching */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    
    /* Navigation hover effects */
    .nav-link {
        position: relative;
        transition: color 0.3s ease;
    }
    
    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--color-primary);
        transition: width 0.3s ease;
    }
    
    .nav-link:hover::after,
    .nav-link.active::after {
        width: 100%;
    }
    
    /* Button hover effects */
    .btn {
        transition: all 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-2px);
    }
    
    /* Card hover effects */
    .service-card:hover,
    .achievement-card:hover,
    .portfolio-card:hover {
        transform: translateY(-8px);
    }
    
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize all managers with error handling
    try {
        new ThemeManager();
    } catch (error) {
        console.warn('Theme manager failed to initialize:', error);
    }
    
    try {
        new NavigationManager();
    } catch (error) {
        console.warn('Navigation manager failed to initialize:', error);
    }
    
    try {
        new ScrollAnimations();
    } catch (error) {
        console.warn('Scroll animations failed to initialize:', error);
    }
    
    try {
        new ContactFormManager();
    } catch (error) {
        console.warn('Contact form manager failed to initialize:', error);
    }
    
    try {
        new PerformanceOptimizer();
    } catch (error) {
        console.warn('Performance optimizer failed to initialize:', error);
    }
    
    // Add loading class removal
    document.body.classList.add('loaded');
    
    // Console greeting
    console.log(`
    🚀 Kalyan Jee Singh - Professional Portfolio
    
    Strategic Business Professional | Content Creator | Finance Enthusiast
    
    Built with modern web technologies for optimal performance and user experience.
    
    Contact: +91 7488250498
    Email: kalyan.professional@gmail.com
    `);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        document.body.classList.remove('page-hidden');
    } else {
        document.body.classList.add('page-hidden');
    }
});

// Handle resize events
window.addEventListener('resize', Utils.throttle(() => {
    // Recalculate positions on resize
    const event = new CustomEvent('recalculate-positions');
    document.dispatchEvent(event);
}, 250));