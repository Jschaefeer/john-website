// Main JavaScript - Armonk-Somers Podiatry

document.addEventListener('DOMContentLoaded', function() {
    initCopyrightYear();

    // Mobile Navigation Menu Toggle
    initMobileMenu();
    
    // Smooth Scrolling for Anchor Links
    initSmoothScroll();
    
    // Insurance Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get the tab to show
                const tabToShow = button.getAttribute('data-tab');
                
                // Show the selected tab content
                document.getElementById(tabToShow).classList.add('active');
            });
        });
    }

    // Testimonial Navigation
    initTestimonialNavigation();
});

function initCopyrightYear() {
    document.querySelectorAll('.copyright-year').forEach(function(el) {
        el.textContent = new Date().getFullYear();
    });
}

/**
 * Initialize the mobile navigation menu
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add class to header when menu is open to adjust its style if needed
            header.classList.toggle('menu-open');
            
            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when scrolling past a threshold
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100 && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                header.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Add scroll event to make header more compact when scrolling down
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    // Select all links with hashes
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip links that don't link to the current page
            if (this.pathname !== window.location.pathname) return;
            
            // Skip if link is just "#"
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if it's open
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                const navLinks = document.querySelector('.nav-links');
                
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Function to handle testimonial navigation
function initTestimonialNavigation() {
    const testimonialCards = document.querySelector('.testimonial-cards');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!testimonialCards || !dots.length) return;
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Update active dot
            document.querySelector('.testimonial-dot.active').classList.remove('active');
            dot.classList.add('active');
            
            // Calculate scroll position
            const cardWidth = testimonialCards.querySelector('.testimonial-card').offsetWidth;
            const gap = parseInt(getComputedStyle(testimonialCards).gap);
            const scrollPosition = index * (cardWidth + gap);
            
            // Smooth scroll to the selected testimonial
            testimonialCards.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Update active dot when scrolling
    testimonialCards.addEventListener('scroll', () => {
        if (testimonialCards.scrollWidth <= testimonialCards.clientWidth) return;
        
        const scrollPosition = testimonialCards.scrollLeft;
        const cardWidth = testimonialCards.querySelector('.testimonial-card').offsetWidth;
        const gap = parseInt(getComputedStyle(testimonialCards).gap);
        
        const activeIndex = Math.round(scrollPosition / (cardWidth + gap));
        
        // Only update if different
        const activeDot = document.querySelector('.testimonial-dot.active');
        if (activeDot && dots[activeIndex] && activeDot !== dots[activeIndex]) {
            activeDot.classList.remove('active');
            dots[activeIndex].classList.add('active');
        }
    });
    
    // Auto-scroll testimonials every 5 seconds
    let currentIndex = 0;
    setInterval(() => {
        currentIndex = (currentIndex + 1) % dots.length;
        dots[currentIndex].click();
    }, 5000);
} 