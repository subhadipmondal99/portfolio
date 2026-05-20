// --- Initialize AOS (Animate On Scroll) ---
AOS.init({
    duration: 800, // Animation duration
    offset: 100,   // Trigger animation earlier or later
    once: true     // Whether animation should happen only once while scrolling down
});

// --- Particle Canvas Animation ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
        
        this.baseX += (Math.random() - 0.5) * 0.5;
        this.baseY += (Math.random() - 0.5) * 0.5;
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 8000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        for (let j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(188, 19, 254, ${0.15 - distance/800})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();

// --- Smooth Scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// --- Modern Background Contact Form Handler ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const buttonText = document.getElementById('buttonText');
        const originalText = buttonText.innerText;
        
        // Show sending state
        buttonText.innerText = 'Sending...';

        const formData = new FormData(contactForm);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            if (response.status === 200) {
                // Change button to show success temporarily
                buttonText.innerText = 'Message Sent! ✓';
                contactForm.reset(); 
                
                // Reset button text after 3 seconds
                setTimeout(() => {
                    buttonText.innerText = originalText;
                }, 3000);
            } else {
                alert('Oops! Something went wrong. Please try again.');
                buttonText.innerText = originalText;
            }
        })
        .catch((error) => {
            alert('Oops! Something went wrong. Please check your internet connection.');
            buttonText.innerText = originalText;
        });
    });
}

// --- Stats Counter Animation ---
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const targets = [5, 10, 3, 1];
    const symbols = ['+', '+', '+', '+'];
    
    statNumbers.forEach((num, index) => {
        let currentValue = 0;
        const target = targets[index];
        const duration = 1500;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= target) {
                currentValue = target;
                clearInterval(counter);
            }
            num.textContent = Math.floor(currentValue) + symbols[index];
        }, 16);
    });
}

// Trigger counter animation when stats section is visible
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-container');
if (statsSection) {
    observer.observe(statsSection);
}