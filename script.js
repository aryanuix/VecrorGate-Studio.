document.addEventListener('DOMContentLoaded', () => {
    
    // --- BASIC SITE LOGIC ---
    const container = document.getElementById('floating-icons');
    if (container) {
        const icons = ['fa-figma', 'fa-html5', 'fa-css3-alt', 'fa-react', 'fa-pen-nib', 'fa-vector-square'];
        for (let i = 0; i < 20; i++) {
            const icon = document.createElement('i');
            const randomIcon = icons[Math.floor(Math.random() * icons.length)];
            icon.classList.add('fa-brands', 'fa-solid', randomIcon, 'floating-icon');
            if(randomIcon === 'fa-pen-nib' || randomIcon === 'fa-vector-square') icon.classList.remove('fa-brands');
            
            icon.style.left = `${Math.random() * 100}vw`;
            icon.style.fontSize = `${Math.random() * 4 + 2}rem`;
            icon.style.animationDuration = `${Math.random() * 10 + 10}s`;
            icon.style.animationDelay = `-${Math.random() * 5}s`;
            container.appendChild(icon);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            navLinks.classList.contains('active') ? 
                (icon.classList.remove('fa-bars'), icon.classList.add('fa-times')) : 
                (icon.classList.remove('fa-times'), icon.classList.add('fa-bars'));
        });
    }

    // --- WAITLIST LOGIC (EmailJS) ---
    const waitlistForm = document.getElementById('waitlistForm');
    const wlSuccess = document.getElementById('wlSuccess');
    const wlSubmit = document.getElementById('wlSubmit');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            wlSubmit.innerText = "Sending...";
            wlSubmit.disabled = true;
            emailjs.sendForm('service_63y1zc8', 'template_hpf7ddm', this)
                .then(() => {
                    waitlistForm.style.display = 'none';
                    wlSuccess.style.display = 'block';
                }, (err) => {
                    console.error('EmailJS Error:', err);
                    alert("Failed to join waitlist. Please try again.");
                    wlSubmit.innerText = "Notify Me";
                    wlSubmit.disabled = false;
                });
        });
    }

    // --- ROCKET LAUNCH CONTACT LOGIC ---
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const contactBtn = document.getElementById('contactBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 1. ANIMATION START: Turn button into rocket
            const originalWidth = contactBtn.offsetWidth; 
            contactBtn.style.width = originalWidth + 'px'; 
            void contactBtn.offsetWidth; 
            
            contactBtn.classList.add('rocket-mode');
            contactBtn.disabled = true;

            // 2. Fly Away
            setTimeout(() => {
                contactBtn.classList.add('fly-away');
            }, 600);

            try {
                // 3. Send Data to Formspree
                const response = await fetch("https://formspree.io/f/xrbnrlkg", {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // 4. TRIGGER FULL SCREEN OVERLAY
                    setTimeout(() => {
                        contactSuccess.style.display = 'flex'; // This is now outside the form, so it works perfectly
                        document.body.style.overflow = 'hidden'; // Lock scroll
                    }, 1600);
                } else {
                    alert("Formspree Error. Please check your settings.");
                    resetButton();
                }
            } catch (error) {
                // Fallback
                contactForm.submit();
            }
        });

        function resetButton() {
            contactBtn.classList.remove('rocket-mode', 'fly-away');
            contactBtn.style.width = '';
            contactBtn.innerText = "Launch Project";
            contactBtn.disabled = false;
        }
    }
});