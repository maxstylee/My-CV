/**
 * ==========================================================================
 * George Egnatashvili - Resume Scripts
 * Pure Vanilla JavaScript (ES6+) - Zero Layout Thrashing - GPU Optimized
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Hero Background Slideshow (GPU Crossfade)
     -------------------------------------------------------------------------- */
  const initHeroSlider = () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, slideInterval);
  };

  /* --------------------------------------------------------------------------
     2. Sticky Glassmorphism Header (RAF-Throttled Scroll Performance)
     -------------------------------------------------------------------------- */
  const initStickyHeader = () => {
    const header = document.getElementById('navbar');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 40;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      // Add background blur styling when scrolled
      if (currentScrollY > scrollThreshold) {
        header.classList.add('nav-scrolled');
      } else {
        header.classList.remove('nav-scrolled');
      }

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY && !header.classList.contains('nav-hidden')) {
          header.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY && header.classList.contains('nav-hidden')) {
          header.classList.remove('nav-hidden');
        }
      } else {
        header.classList.remove('nav-hidden');
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  };

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     -------------------------------------------------------------------------- */
  const initMobileNav = () => {
    const mobileBtn = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileBtn || !navMenu) return;

    const toggleMenu = () => {
      navMenu.classList.toggle('open');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    };

    mobileBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  };

  /* --------------------------------------------------------------------------
     4. Viber QR Code Popover Interaction
     -------------------------------------------------------------------------- */
  const initViberPopover = () => {
    const viberBtn = document.getElementById('viber');
    const qrPopover = document.getElementById('slide');
    const closeBtn = document.getElementById('closeQrBtn');

    if (!viberBtn || !qrPopover) return;

    const togglePopover = (e) => {
      e.preventDefault();
      e.stopPropagation();
      qrPopover.classList.toggle('hide');
    };

    const closePopover = () => {
      qrPopover.classList.add('hide');
    };

    viberBtn.addEventListener('click', togglePopover);

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePopover();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!qrPopover.contains(e.target) && !viberBtn.contains(e.target)) {
        closePopover();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !qrPopover.classList.contains('hide')) {
        closePopover();
      }
    });
  };

  /* --------------------------------------------------------------------------
     5. Typewriter Animation for "About Me" Section
     -------------------------------------------------------------------------- */
  const initTypewriter = () => {
    const aboutSection = document.getElementById('about');
    const container = document.querySelector('.for-txt');
    if (!aboutSection || !container) return;

    const aboutMeText = [
      "I won't speak here of my experience or showcase a list of my projects. Instead, let me tell you this:",
      "We all dream. We all live within certain boundaries — shaped by time, by rules, by fear, by comfort. But when I begin to write code, something beautiful happens... Those boundaries dissolve.",
      "In that moment, I no longer feel like just a developer. I become a creator — an artist shaping structure out of thought, beauty out of logic. And as I watch that creation unfold on the screen, I feel grace. A quiet, profound grace — the kind that comes only from building something truly your own."
    ];

    let hasStarted = false;

    const startTypingSequence = () => {
      container.innerHTML = '';
      let paragraphIndex = 0;

      // Cursor element
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';

      const typeParagraph = (pIndex) => {
        if (pIndex >= aboutMeText.length) {
          // Finished typing all paragraphs, remove blinking cursor after brief delay
          setTimeout(() => {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 2000);
          return;
        }

        const p = document.createElement('p');
        p.className = 'typewriter-paragraph';
        container.appendChild(p);
        p.appendChild(cursor);

        const currentText = aboutMeText[pIndex];
        let charIndex = 0;

        const typeNextChar = () => {
          if (charIndex < currentText.length) {
            p.insertBefore(document.createTextNode(currentText.charAt(charIndex)), cursor);
            charIndex++;
            // Dynamic typing speed: fast and natural
            const delay = currentText.charAt(charIndex - 1) === '.' ? 180 : 14;
            setTimeout(typeNextChar, delay);
          } else {
            // Move to next paragraph
            paragraphIndex++;
            setTimeout(() => typeParagraph(paragraphIndex), 300);
          }
        };

        typeNextChar();
      };

      typeParagraph(paragraphIndex);
    };

    // Use IntersectionObserver instead of scroll listener to prevent Layout Thrashing
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasStarted) {
              hasStarted = true;
              aboutSection.classList.add('animate');
              setTimeout(startTypingSequence, 400);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(aboutSection);
    } else {
      // Fallback
      aboutSection.classList.add('animate');
      startTypingSequence();
    }
  };

  /* --------------------------------------------------------------------------
     6. 3D Skills Carousel Intersection Observer
     -------------------------------------------------------------------------- */
  const initSkillsObserver = () => {
    const board = document.querySelector('.skills-board');
    if (!board) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              board.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(board);
    } else {
      board.classList.add('is-visible');
    }
  };

  /* --------------------------------------------------------------------------
     7. Active Nav Link Highlighter
     -------------------------------------------------------------------------- */
  const initActiveNavLinks = () => {
    const sections = document.querySelectorAll('header.hero-section, section, footer');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              if (!id) return;

              navLinks.forEach((link) => {
                if (link.getAttribute('href') === `#${id}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        },
        { threshold: 0.3 }
      );

      sections.forEach((sec) => observer.observe(sec));
    }
  };

  /* Initialize all modules */
  initHeroSlider();
  initStickyHeader();
  initMobileNav();
  initViberPopover();
  initTypewriter();
  initSkillsObserver();
  initActiveNavLinks();
});
