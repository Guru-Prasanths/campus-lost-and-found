/* ====================================================
   Campus Lost & Found - Main JavaScript
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // ACTIVE NAV LINK HIGHLIGHT
    // ==========================================
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        } else if (href === '/' && (currentPath === '' || currentPath === '/home' || currentPath === '/index')) {
            link.classList.add('active');
        }
    });

    // ==========================================
    // NAVBAR TOGGLE (Mobile)
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // ==========================================
    // USER DROPDOWN
    // ==========================================
    const userDropBtn = document.getElementById('userDropBtn');
    const userDropMenu = document.getElementById('userDropMenu');

    if (userDropBtn && userDropMenu) {
        userDropBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropMenu.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!userDropBtn.contains(e.target) && !userDropMenu.contains(e.target)) {
                userDropMenu.classList.remove('show');
            }
        });
    }

    // ==========================================
    // AUTO-DISMISS ALERTS
    // ==========================================
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(function () {
                alert.remove();
            }, 300);
        }, 6000);
    });

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 30) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // ==========================================
    // FILTER TYPE TOGGLE
    // ==========================================
    const typeOptions = document.querySelectorAll('.type-option input[type="radio"]');
    typeOptions.forEach(function (radio) {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.type-option').forEach(function (opt) {
                opt.classList.remove('active');
            });
            this.closest('.type-option').classList.add('active');
        });
    });

    // ==========================================
    // FILE UPLOAD DRAG & DROP
    // ==========================================
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');
    fileUploadAreas.forEach(function (area) {
        const input = area.querySelector('.file-input');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
            area.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(function (evt) {
            area.addEventListener(evt, function () {
                area.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(function (evt) {
            area.addEventListener(evt, function () {
                area.classList.remove('drag-over');
            });
        });

        area.addEventListener('drop', function (e) {
            if (input && e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                input.dispatchEvent(new Event('change'));
            }
        });

        area.addEventListener('click', function () {
            if (input) input.click();
        });
    });

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ==========================================
    // ANIMATE STAT NUMBERS
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.textContent) || 0;
                    if (target > 0) {
                        animateNumber(el, 0, target, 1500);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(function (num) {
            observer.observe(num);
        });
    }

    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(start + range * eased);
            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
            }
        }

        requestAnimationFrame(update);
    }

    // ==========================================
    // INLINE DROPDOWN TOGGLE (Admin tables)
    // ==========================================
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.dropdown-toggle-btn');
        if (btn) {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.dropdown-inline-menu.show').forEach(function (m) {
                if (m !== btn.nextElementSibling) m.classList.remove('show');
            });
            btn.nextElementSibling.classList.toggle('show');
        } else {
            document.querySelectorAll('.dropdown-inline-menu.show').forEach(function (m) {
                m.classList.remove('show');
            });
        }
    });
});

