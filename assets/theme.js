/**
 * RigFreaks theme main JavaScript file
 * Following Dawn theme principles of "JavaScript-only-as-needed"
 */

(function() {
  // Theme helper functions
  const debounce = (fn, wait) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // DOM elements loaded check
  const isElementLoaded = (elementId) => {
    const element = document.getElementById(elementId);
    return element !== null;
  };

  // Trap focus within container (accessibility)
  const trapFocus = (container, focusable) => {
    const focusableElements = focusable || 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = container.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    container.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        // SHIFT + TAB
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        // TAB
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  };

  // Toggle element visibility
  const toggleElementVisibility = (elementId, isVisible) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.toggle('hidden', !isVisible);
    }
  };

  // Header scroll effects
  const initHeaderScrollEffects = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = debounce(() => {
      if (window.scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, 10);

    window.addEventListener('scroll', handleScroll);
  };

  // Mobile menu functionality
  const initMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('[data-mobile-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      
      if (isExpanded) {
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
        document.body.style.overflow = '';
      } else {
        mobileMenu.style.maxHeight = `${mobileMenu.scrollHeight}px`;
        mobileMenu.style.opacity = '1';
        document.body.style.overflow = 'hidden';
      }
    });
  };

  // Footer accordion for mobile
  const initFooterAccordion = () => {
    const footerBlocks = document.querySelectorAll('.footer-block__details');
    if (!footerBlocks.length) return;

    const mql = window.matchMedia('(min-width: 768px)');

    const toggleAccordion = () => {
      footerBlocks.forEach(block => {
        if (mql.matches) {
          block.setAttribute('open', '');
        } else {
          block.removeAttribute('open');
        }
      });
    };

    // Initial call
    toggleAccordion();
    
    // Listen for screen size changes
    mql.addEventListener('change', toggleAccordion);

    // Handle click events on small screens
    footerBlocks.forEach(block => {
      const summary = block.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', (e) => {
          if (!mql.matches) {
            e.preventDefault();
            const isOpen = block.hasAttribute('open');
            
            if (isOpen) {
              block.removeAttribute('open');
            } else {
              block.setAttribute('open', '');
            }
          }
        });
      }
    });
  };

  // Modal functionality
  const initModals = () => {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('[data-modal]');

    if (!modalTriggers.length) return;

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        
        if (modal) {
          modal.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
          
          const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) {
            firstFocusable.focus();
          }
          
          trapFocus(modal);
        }
      });
    });

    modalCloseButtons.forEach(closeButton => {
      closeButton.addEventListener('click', () => {
        const modal = closeButton.closest('[data-modal]');
        if (modal) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    });

    // Close modal when clicking outside content
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });

      // Close on ESC key
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    });
  };

  // Quantity selector functionality
  const initQuantitySelectors = () => {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    if (!quantityInputs.length) return;

    quantityInputs.forEach(input => {
      const decreaseBtn = input.parentNode.querySelector('.quantity-decrease');
      const increaseBtn = input.parentNode.querySelector('.quantity-increase');

      if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value);
          if (currentValue > 1) {
            input.value = currentValue - 1;
            input.dispatchEvent(new Event('change'));
          }
        });
      }

      if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value);
          input.value = currentValue + 1;
          input.dispatchEvent(new Event('change'));
        });
      }
    });
  };

  // Product image gallery
  const initProductGallery = () => {
    const galleryContainer = document.querySelector('.product__media-gallery');
    if (!galleryContainer) return;

    const thumbnails = galleryContainer.querySelectorAll('[data-thumbnail-id]');
    const mediaItems = galleryContainer.querySelectorAll('[data-media-id]');

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        const mediaId = thumbnail.getAttribute('data-thumbnail-id');
        
        // Update active thumbnail
        thumbnails.forEach(t => {
          t.classList.remove('border-accent');
          t.classList.add('border-gray-700');
          t.removeAttribute('aria-current');
        });
        thumbnail.classList.add('border-accent');
        thumbnail.classList.remove('border-gray-700');
        thumbnail.setAttribute('aria-current', 'true');
        
        // Show selected media
        mediaItems.forEach(item => {
          const itemMediaId = item.getAttribute('data-media-id');
          if (itemMediaId === mediaId) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  };

  // Product tabs functionality
  const initProductTabs = () => {
    const tabButtons = document.querySelectorAll('[role="tab"]');
    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetId);
        const tabsContainer = button.closest('.product__tabs-container');
        
        if (!tabsContainer || !targetPanel) return;
        
        // Update tab buttons state
        tabsContainer.querySelectorAll('[role="tab"]').forEach(btn => {
          const isActive = btn === button;
          btn.setAttribute('aria-selected', isActive);
          btn.classList.toggle('border-primary', isActive);
          btn.classList.toggle('text-primary', isActive);
          btn.classList.toggle('border-transparent', !isActive);
          btn.classList.toggle('text-muted-foreground', !isActive);
        });
        
        // Update tab panels visibility
        tabsContainer.querySelectorAll('[role="tabpanel"]').forEach(panel => {
          panel.classList.toggle('hidden', panel !== targetPanel);
        });
      });
    });
  };

  // PC Builder integration
  const initPCBuilderIntegration = () => {
    const pcBuilderButtons = document.querySelectorAll('.product__pc-builder-button');
    if (!pcBuilderButtons.length) return;

    pcBuilderButtons.forEach(button => {
      button.addEventListener('click', () => {
        const componentId = button.getAttribute('data-component-id');
        const componentType = button.getAttribute('data-component-type');
        
        if (componentId && componentType) {
          // Redirect to PC Builder with component pre-selected
          window.location.href = `/build-your-pc?add=${componentType}:${componentId}`;
        }
      });
    });
  };

  // Initialize all theme functionalities
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScrollEffects();
    initMobileMenu();
    initFooterAccordion();
    initModals();
    initQuantitySelectors();
    initProductGallery();
    initProductTabs();
    initPCBuilderIntegration();
  });
})();