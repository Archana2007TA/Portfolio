document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. Theme Management (Light / Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn.querySelector("i");
    const htmlElement = document.documentElement;

    // Check saved theme or system preferences
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const setLocalTheme = (theme) => {
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem("portfolio-theme", theme);

        if (theme === "light") {
            themeIcon.className = "fa-solid fa-sun";
        } else {
            themeIcon.className = "fa-solid fa-moon";
        }
    };

    // Apply starting theme
    if (savedTheme) {
        setLocalTheme(savedTheme);
    } else {
        setLocalTheme(systemPrefersDark ? "dark" : "light");
    }

    // Click Handler for Toggle button
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        setLocalTheme(currentTheme === "light" ? "dark" : "light");
    });


    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const menuIcon = mobileMenuToggle.querySelector("i");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    const toggleMobileMenu = () => {
        mobileNav.classList.toggle("open");
        const isOpen = mobileNav.classList.contains("open");
        menuIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    };

    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

    // Close mobile menu on clicking any navigation link
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNav.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });


    // ==========================================
    // 3. Typing Text Animation
    // ==========================================
    const typingSpan = document.getElementById("typing-text");
    const phrases = ["AIML Student", "Python Developer", "Machine Learning Enthusiast", "Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeAnimation = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting speed
        } else {
            typingSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        // Handling transition points
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(typeAnimation, typingSpeed);
    };

    // Start the typing animation loop
    if (typingSpan) {
        setTimeout(typeAnimation, 800);
    }


    // ==========================================
    // 4. Header Effects & Scroll to Top Active
    // ==========================================
    const header = document.querySelector(".navbar-header");
    const scrollTopBtn = document.getElementById("scroll-top");

    window.addEventListener("scroll", () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Scroll To Top button visibility toggle
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // ==========================================
    // 5. Scroll Reveals & Skill Fill Animations
    // ==========================================
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const skillBars = document.querySelectorAll(".skill-bar-fill");

    // Intersection Observer for scroll reveal elements
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                elementObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => elementObserver.observe(el));

    // Observer specifically to trigger Skills animation when visible
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute("data-percent");
                bar.style.width = percent;
                skillsObserver.unobserve(bar); // Animate once
            }
        });
    }, {
        threshold: 0.2
    });

    skillBars.forEach(bar => skillsObserver.observe(bar));


    // ==========================================
    // 6. Navigation Link Active Section Tracking
    // ==========================================
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Account for navbar height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });

        mobileLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });


    // ==========================================
    // 7. Contact Form Handling & Validations
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    const toast = document.getElementById("toast");

    const validateField = (field, errorElId) => {
        const errorEl = document.getElementById(errorElId);
        let isValid = true;

        if (field.value.trim() === "") {
            isValid = false;
        } else if (field.type === "email") {
            // Basic RFC 5322 Email regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            isValid = emailRegex.test(field.value);
        }

        const parent = field.parentElement;
        if (!isValid) {
            parent.classList.add("invalid");
        } else {
            parent.classList.remove("invalid");
        }

        return isValid;
    };

    // Attach blur (focus lost) listeners for live validation
    const nameField = document.getElementById("form-name");
    const emailField = document.getElementById("form-email");
    const subjectField = document.getElementById("form-subject");
    const messageField = document.getElementById("form-message");

    nameField.addEventListener("blur", () => validateField(nameField, "name-error"));
    emailField.addEventListener("blur", () => validateField(emailField, "email-error"));
    subjectField.addEventListener("blur", () => validateField(subjectField, "subject-error"));
    messageField.addEventListener("blur", () => validateField(messageField, "message-error"));

    // Submit Handler
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameField, "name-error");
        const isEmailValid = validateField(emailField, "email-error");
        const isSubjectValid = validateField(subjectField, "subject-error");
        const isMessageValid = validateField(messageField, "message-error");

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Collect Form Data
            const formData = {
                name: nameField.value,
                email: emailField.value,
                subject: subjectField.value,
                message: messageField.value
            };

            // Simulating API submit success
            const submitBtn = document.getElementById("submit-btn");
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin icon-right"></i>';

            setTimeout(() => {
                // Show Success Toast
                toast.classList.remove("hidden");

                // Reset form fields and validation classes
                contactForm.reset();
                document.querySelectorAll(".form-group").forEach(group => {
                    group.classList.remove("invalid");
                });

                // Restore submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane icon-right"></i>';

                // Hide Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.add("hidden");
                }, 4000);

            }, 1200); // 1.2s realistic submission delay
        }
    });
});
