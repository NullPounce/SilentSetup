// Global variables
let typewriterInterval;
let codeAnimationInterval;
let statsAnimated = false;

// DOM elements
const elements = {
    typedCommand: document.getElementById('typedCommand'),
    terminalOutput: document.getElementById('terminalOutput'),
    demoCode: document.getElementById('demoCode'),
    waitlistForm: document.getElementById('waitlistForm'),
    waitlistFormBottom: document.getElementById('waitlistFormBottom'),
    successMessage: document.getElementById('successMessage'),
    navLinks: document.querySelectorAll('.nav-link'),
    statValues: document.querySelectorAll('.stat-card .stat-value')
};

// Terminal commands for hero section
const heroCommands = [
    'Import-Module SilentInstall',
    'Connect-SilentInstallPortal -Enterprise',
    'Get-TargetMachines | Measure-Object',
    'Start-SilentDeployment -Software "Office365"'
];

// Demo code lines for code demo section
const demoCodeLines = [
    { text: 'PS C:\\> Import-Module SilentInstall', type: 'prompt' },
    { text: 'PS C:\\> Connect-SilentInstallPortal -ApiKey $key', type: 'prompt' },
    { text: 'PS C:\\> $targets = Get-ADComputer -Filter \'OperatingSystem -like "*Windows*"\'', type: 'prompt' },
    { text: 'PS C:\\> New-DeploymentJob -Software \'Microsoft-Office-365\' -Targets $targets -Schedule (Get-Date).AddHours(2)', type: 'prompt' },
    { text: 'PS C:\\> Start-SilentDeployment -JobId $job.Id -Mode Background', type: 'prompt' },
    { text: '✅ Deployment initiated successfully. 247 targets queued for installation.', type: 'success' },
    { text: '⚡ Zero user interruptions. Zero system downtime.', type: 'info' },
    { text: '📊 Monitor progress at https://portal.silentinstall.com/deployments', type: 'info' }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeFormHandlers();
    initializeNavigation();
    initializeScrollAnimations();
    startHeroTerminalAnimation();
});

// Hero terminal typing animation
function startHeroTerminalAnimation() {
    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function typeCommand() {
        const currentCommand = heroCommands[commandIndex];
        
        if (!isDeleting) {
            // Typing
            elements.typedCommand.textContent = currentCommand.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentCommand.length) {
                // Finished typing, wait then start deleting
                delay = 2000;
                isDeleting = true;
            } else {
                delay = Math.random() * 100 + 50;
            }
        } else {
            // Deleting
            elements.typedCommand.textContent = currentCommand.substring(0, charIndex);
            charIndex--;
            
            if (charIndex === 0) {
                // Finished deleting, move to next command
                isDeleting = false;
                commandIndex = (commandIndex + 1) % heroCommands.length;
                delay = 500;
            } else {
                delay = 50;
            }
        }
        
        setTimeout(typeCommand, delay);
    }
    
    // Add some terminal output
    const outputs = [
        'Module imported successfully.',
        'Connected to SilentInstall Enterprise Portal.',
        'Found 247 target machines.',
        'Deployment job created with ID: SI-2025-001'
    ];
    
    outputs.forEach((output, index) => {
        setTimeout(() => {
            const outputLine = document.createElement('div');
            outputLine.className = 'output-line output-success';
            outputLine.textContent = output;
            elements.terminalOutput.appendChild(outputLine);
        }, (index + 1) * 3000);
    });
    
    typeCommand();
}

// Code demo animation
function animateCodeDemo() {
    if (!elements.demoCode) return;
    
    elements.demoCode.innerHTML = '';
    let lineIndex = 0;
    
    function showNextLine() {
        if (lineIndex < demoCodeLines.length) {
            const line = demoCodeLines[lineIndex];
            const lineElement = document.createElement('div');
            lineElement.className = `code-line ${line.type}`;
            lineElement.textContent = line.text;
            lineElement.style.animationDelay = `${lineIndex * 0.1}s`;
            
            elements.demoCode.appendChild(lineElement);
            lineIndex++;
            
            setTimeout(showNextLine, 800);
        }
    }
    
    showNextLine();
}

// Form handlers
function initializeFormHandlers() {
    // Hero form handler
    if (elements.waitlistForm) {
        elements.waitlistForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Bottom form handler
    if (elements.waitlistFormBottom) {
        elements.waitlistFormBottom.addEventListener('submit', handleFormSubmission);
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Validate email
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
        showFormError(form, 'Please enter a valid email address');
        return;
    }
    
    // Show loading state
    submitButton.innerHTML = '<span class="btn-text">Joining...</span>';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        if (form.id === 'waitlistForm' && elements.successMessage) {
            elements.successMessage.classList.remove('hidden');
            form.style.display = 'none';
        } else {
            showFormSuccess(form, 'Successfully joined the waitlist! Check your email.');
        }
        
        // Track conversion (in real app, this would be actual analytics)
        console.log('Waitlist signup:', emailInput.value);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormError(form, message) {
    // Remove existing error messages
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.style.color = '#f85149';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.5rem';
    errorElement.textContent = message;
    
    form.appendChild(errorElement);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

function showFormSuccess(form, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-success-temp');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successElement = document.createElement('div');
    successElement.className = 'form-success-temp';
    successElement.style.color = '#3fb950';
    successElement.style.fontSize = '0.875rem';
    successElement.style.marginTop = '0.5rem';
    successElement.style.display = 'flex';
    successElement.style.alignItems = 'center';
    successElement.style.gap = '0.5rem';
    successElement.innerHTML = `<span>✅</span><span>${message}</span>`;
    
    form.appendChild(successElement);
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for navigation links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // CTA buttons scroll to waitlist
    const ctaButtons = document.querySelectorAll('.nav-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const waitlistSection = document.querySelector('.waitlist-benefits');
            if (waitlistSection) {
                const offsetTop = waitlistSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150; // Offset for better detection
    
    let activeSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if current scroll position is within this section
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            activeSection = sectionId;
        }
    });
    
    // Update nav links
    elements.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const linkSectionId = href.substring(1);
            
            if (linkSectionId === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animate feature cards
                if (element.classList.contains('feature-card')) {
                    animateFeatureCard(element);
                }
                
                // Animate steps
                if (element.classList.contains('step')) {
                    animateStep(element);
                }
                
                // Animate code demo
                if (element.classList.contains('code-demo') && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                    setTimeout(() => animateCodeDemo(), 500);
                }
                
                // Animate stats
                if (element.classList.contains('stats') && !statsAnimated) {
                    statsAnimated = true;
                    animateStats();
                }
                
                // Animate testimonials
                if (element.classList.contains('testimonial-card')) {
                    animateTestimonial(element);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.feature-card, .step, .code-demo, .stats, .testimonial-card');
    animatableElements.forEach(el => observer.observe(el));
}

function animateFeatureCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
}

function animateStep(step) {
    const stepNumber = step.querySelector('.step-number');
    const stepContent = step.querySelector('.step-content');
    
    stepNumber.style.opacity = '0';
    stepNumber.style.transform = 'scale(0.5)';
    stepContent.style.opacity = '0';
    stepContent.style.transform = 'translateY(20px)';
    
    stepNumber.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    stepContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        stepNumber.style.opacity = '1';
        stepNumber.style.transform = 'scale(1)';
    }, 100);
    
    setTimeout(() => {
        stepContent.style.opacity = '1';
        stepContent.style.transform = 'translateY(0)';
    }, 300);
}

function animateStats() {
    elements.statValues.forEach((statValue, index) => {
        const target = parseFloat(statValue.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        
        setTimeout(() => {
            animateCounter(statValue, 0, target, 2000, isDecimal);
        }, index * 200);
    });
}

function animateCounter(element, start, end, duration, isDecimal = false) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const current = start + (end - start) * easeOutQuad;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = isDecimal ? end.toFixed(1) : end;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateTestimonial(testimonial) {
    testimonial.style.opacity = '0';
    testimonial.style.transform = 'translateY(30px) scale(0.95)';
    testimonial.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        testimonial.style.opacity = '1';
        testimonial.style.transform = 'translateY(0) scale(1)';
    }, 200);
}

// Initialize animations
function initializeAnimations() {
    // Add CSS animations to particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        // Random positioning and animation delays
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    });
    
    // Add hover effects to interactive elements
    addHoverEffects();
}

function addHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.boxShadow = '0 30px 60px rgba(88, 166, 255, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Utility functions
function debounce(func, wait) {
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

// Performance optimization
const debouncedScrollHandler = debounce(updateActiveNavLink, 10);
window.addEventListener('scroll', debouncedScrollHandler);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate positions if needed
    console.log('Window resized');
}, 250));

// Easter egg for IT professionals
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        showEasterEgg();
        konamiCode = [];
    }
});

function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(33, 38, 45, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid #58a6ff;
        border-radius: 12px;
        padding: 2rem;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 25px 50px rgba(88, 166, 255, 0.3);
    `;
    
    easterEgg.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <h3 style="color: #58a6ff; margin-bottom: 1rem;">IT Professional Detected!</h3>
        <p style="color: #f0f6fc; margin-bottom: 1rem;">You found the Konami Code!</p>
        <p style="color: #7d8590; font-size: 0.875rem;">Extra credit: You're clearly the type of admin we built this for.</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 1rem;
            background: linear-gradient(135deg, #58a6ff 0%, #3fb950 100%);
            color: #0d1117;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        ">Close</button>
    `;
    
    document.body.appendChild(easterEgg);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (easterEgg.parentElement) {
            easterEgg.remove();
        }
    }, 10000);
}

// Console message for developers
console.log(`
%c⚡ SilentInstall.com Developer Console
%cLooks like you're inspecting our code! 
We appreciate attention to detail - that's exactly what enterprise IT needs.

Interested in joining our team? 
Email: careers@silentinstall.com

%cBuilt with: HTML5, CSS3, JavaScript (ES6+)
No frameworks needed - just clean, efficient code.
`, 
'color: #58a6ff; font-size: 16px; font-weight: bold;',
'color: #f0f6fc; font-size: 12px;',
'color: #7d8590; font-size: 10px;'
);

// Export functions for potential testing (in real app)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        animateCounter,
        debounce
    };
}