/**
 * byAdkhamov | Video Editor & Colorist Portfolio
 * Interactive Scripts: Before/After Slider, Video Modal, Filters, Form Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Blur on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Smooth Active Navigation on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ==========================================================================
  // 5. Interactive Before / After Color Grading Comparison Slider
  // ==========================================================================
  const viewport = document.getElementById('comparison-viewport');
  const beforeLayer = document.getElementById('comparison-before');
  const handle = document.getElementById('comparison-handle');
  const beforeImg = document.getElementById('before-img');
  const afterImg = document.getElementById('after-img');

  // Specs display elements
  const specCamera = document.getElementById('spec-camera');
  const specColorSpace = document.getElementById('spec-colorspace');
  const specLut = document.getElementById('spec-lut');
  const specContrast = document.getElementById('spec-contrast');

  let isDragging = false;

  function updateSliderPosition(clientX) {
    if (!viewport || !beforeLayer || !handle) return;
    const rect = viewport.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    beforeLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;
  }

  if (viewport && beforeLayer && handle) {
    // Mouse events
    viewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile/tablet
    viewport.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches.length > 0) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Presets Data for Comparison
  const gradingPresets = {
    commercial: {
      before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      filter: 'contrast(0.68) saturate(0.4) brightness(1.15)',
      camera: 'ARRI Alexa Mini LF (ProRes 4444 XQ)',
      colorSpace: 'ARRI LogC3 → Rec.709 DCI-P3',
      lut: 'Custom Film Emulation 2383',
      contrast: '1:12.4 Deep Blacks'
    },
    cinema: {
      before: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80',
      after: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1600&q=80',
      filter: 'contrast(0.72) saturate(0.35) brightness(1.18)',
      camera: 'RED V-Raptor 8K VV (REDCODE RAW)',
      colorSpace: 'REDWideGamutRGB / Log3G10',
      lut: 'Warm Tungsten Moody Noir',
      contrast: '1:18.2 Anamorphic Grade'
    },
    neon: {
      before: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      after: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      filter: 'contrast(0.7) saturate(0.3) brightness(1.1)',
      camera: 'Sony FX6 (S-Log3 / S-Gamut3.Cine)',
      colorSpace: 'S-Gamut3 → Rec.709 High Dynamic',
      lut: 'Cyber Teal & Neon Magenta Glow',
      contrast: '1:16.8 Punchy Highlights'
    },
    fashion: {
      before: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      after: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      filter: 'contrast(0.75) saturate(0.45) brightness(1.12)',
      camera: 'Blackmagic URSA Mini Pro 12K',
      colorSpace: 'Blackmagic Design Film Gen 5',
      lut: 'Soft Pastel Luxury Editorial',
      contrast: '1:10.5 Natural Skin Tone'
    }
  };

  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.dataset.preset;
      const data = gradingPresets[presetKey];
      if (!data) return;

      // Update images
      if (beforeImg) {
        beforeImg.src = data.before;
        beforeImg.style.filter = data.filter;
      }
      if (afterImg) {
        afterImg.src = data.after;
      }

      // Update technical specs
      if (specCamera) specCamera.textContent = data.camera;
      if (specColorSpace) specColorSpace.textContent = data.colorSpace;
      if (specLut) specLut.textContent = data.lut;
      if (specContrast) specContrast.textContent = data.contrast;

      // Reset slider to center (50%)
      if (beforeLayer && handle) {
        beforeLayer.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
        handle.style.left = '50%';
      }
    });
  });

  // ==========================================================================
  // 6. Portfolio Category Filter
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.dataset.filter;

      projectCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ==========================================================================
  // 7. Video Player Modal Dialog
  // ==========================================================================
  const videoModal = document.getElementById('video-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalClient = document.getElementById('modal-client');
  const modalSoftware = document.getElementById('modal-software');
  const modalResolution = document.getElementById('modal-resolution');
  const modalPlayerContainer = document.getElementById('modal-player-container');

  // Video data repository
  const projectVideos = {
    showreel: {
      title: 'Cinematic Showreel 2024-2025',
      tag: 'Main Reel • Commercial & Color',
      client: 'byAdkhamov Studio',
      software: 'DaVinci Resolve Studio, Premiere Pro',
      resolution: '4K DCI (4096x2160) • 24 FPS',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-night-car-lights-in-the-city-43407-large.mp4'
    },
    'diamond-atelier': {
      title: 'Diamond Atelier — Luxury Jewellery',
      tag: 'Commercial • High-End Color',
      client: 'Atelier Jewels Geneva',
      software: 'DaVinci Resolve Studio, Dehancer Pro',
      resolution: '4K UHD • ProRes 4444 XQ',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-jeweler-crafting-a-ring-43098-large.mp4'
    },
    'neon-nights': {
      title: 'Neon Nights — Official Music Video',
      tag: 'Music Video • Dynamic Transitions',
      client: 'Universal / SoundWave Artist',
      software: 'Adobe Premiere Pro, After Effects',
      resolution: 'CinemaScope 2.39:1 • 4K',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-guitarist-performing-on-stage-under-neon-lights-42938-large.mp4'
    },
    'northline': {
      title: 'Northline Expedition — Brand Campaign',
      tag: 'Brand Film • Documentary Color',
      client: 'Northline Outdoor Apparel',
      software: 'DaVinci Resolve, Blackmagic RAW',
      resolution: '4K DCI • HDR10 / Rec.2020',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-waves-crashing-on-a-rocky-shore-43402-large.mp4'
    },
    'aurora-fashion': {
      title: 'Aurora Fashion Week — Runway Film',
      tag: 'Fashion • Soft Film Emulation',
      client: 'Vogue Runway Series',
      software: 'DaVinci Resolve, FilmConvert Nitrate',
      resolution: '4K DCI • Kodak 2383 Print',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-looking-at-the-camera-in-a-field-43187-large.mp4'
    },
    'speed-dynamics': {
      title: 'Apex GT — Supercar Launch Reel',
      tag: 'Automotive • Fast Paced Editing',
      client: 'Motorsport Media',
      software: 'Premiere Pro, Soundly, After Effects',
      resolution: '9:16 Vertical 4K & 16:9 Master',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-luxury-sports-car-at-sunset-43410-large.mp4'
    },
    'tashkent-stories': {
      title: 'Tashkent by Night — Documentary Short',
      tag: 'Documentary • Architectural Grade',
      client: 'Tourism & Culture Series',
      software: 'DaVinci Resolve Studio, ACEScc',
      resolution: '4K UHD • 10-bit 4:2:2',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-at-night-with-fast-traffic-43412-large.mp4'
    }
  };

  function openVideoModal(projectId) {
    if (!videoModal) return;
    const project = projectVideos[projectId] || projectVideos['showreel'];

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalTag) modalTag.textContent = project.tag;
    if (modalClient) modalClient.textContent = project.client;
    if (modalSoftware) modalSoftware.textContent = project.software;
    if (modalResolution) modalResolution.textContent = project.resolution;

    // Load video element
    if (modalPlayerContainer) {
      modalPlayerContainer.innerHTML = `
        <video controls autoplay playsinline loop style="width: 100%; height: 100%; object-fit: cover;">
          <source src="${project.videoUrl}" type="video/mp4">
          Brauzeringiz video ijrosini qo'llab-quvvatlamaydi.
        </video>
      `;
    }

    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (modalPlayerContainer) {
      modalPlayerContainer.innerHTML = ''; // Stops playback immediately
    }
  }

  // Open modal on showreel click
  const showreelCard = document.getElementById('hero-showreel-card');
  if (showreelCard) {
    showreelCard.addEventListener('click', () => openVideoModal('showreel'));
  }

  const viewReelBtn = document.getElementById('view-reel-btn');
  if (viewReelBtn) {
    viewReelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal('showreel');
    });
  }

  // Open modal on project card click
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project || 'showreel';
      openVideoModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // ==========================================================================
  // 8. Contact Form Handling & Toast Notification
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message) {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('client-name');
      const contactInput = document.getElementById('client-contact');
      const typeSelect = document.getElementById('project-type');
      const messageInput = document.getElementById('client-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const contact = contactInput ? contactInput.value.trim() : '';
      const type = typeSelect ? typeSelect.value : '';
      const msg = messageInput ? messageInput.value.trim() : '';

      if (!name || !contact) {
        showToast('Iltimos, ismingiz va bog\'lanish ma\'lumotingizni kiriting.');
        return;
      }

      // Construct Telegram quick share URL
      const telegramText = encodeURIComponent(
        `🎬 Yangi Loyiha So'rovi!\n\nIsm: ${name}\nAloqa: ${contact}\nLoyiha turi: ${type}\nXabar: ${msg}`
      );
      const telegramUrl = `https://t.me/byAdkhamov?text=${telegramText}`;

      showToast(`Rahmat, ${name}! So'rovingiz qabul qilindi. Tez orada siz bilan bog'lanaman.`);
      contactForm.reset();

      // Optionally offer direct opening in Telegram
      console.log('Telegram booking link:', telegramUrl);
    });
  }

  // Quick Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'abdulloxadxamov96@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email nusxalandi: abdulloxadxamov96@gmail.com');
      }).catch(() => {
        showToast('abdulloxadxamov96@gmail.com');
      });
    });
  }
});
