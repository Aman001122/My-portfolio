document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Navbar Active Section Highlighting on Scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar a");

    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // Back-to-Top Button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'backToTop';
    backToTopButton.textContent = '↑';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Contact Form Validation and AJAX Submission
    const contactForm = document.getElementById("contactForm");
    const loadingSpinner = document.getElementById("loadingSpinner");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !validateEmail(email) || !message) {
            displayMessage("Please fill out all fields correctly.", "error");
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'block';

        // Prepare form data for AJAX submission
        const formData = new FormData(this);
        fetch('submitform.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                loadingSpinner.style.display = 'none';
                if (data.status === 'success') {
                    displayMessage("Form submitted successfully!", "success");
                    contactForm.reset();
                } else {
                    displayMessage(data.message, "error");
                }
            })
            .catch(error => {
                loadingSpinner.style.display = 'none';
                displayMessage("Submission failed. Please try again.", "error");
                console.error('Error:', error);
            });
    });

    // Display Success/Error Message
    function displayMessage(message, type) {
        const messageContainer = document.getElementById("messageContainer");
        messageContainer.textContent = message;
        messageContainer.className = type;
        messageContainer.style.display = "block";
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 5000);
    }

    // Email Validation Function
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Element Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const options = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    fadeElements.forEach(element => observer.observe(element));
});
