const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent.trim();

    if (buttonText === 'Zomato') {
      window.open('https://www.zomato.com/ahmedabad/nutan-restaurant-lal-darwaja/order', '_blank');
    } else if (buttonText === 'Swiggy') {
      window.open('https://www.swiggy.com/city/ahmedabad/nutan-restaurant-lal-darwaja-rest126693', '_blank');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const header = document.querySelector('.site-header');
  const yearEl = document.getElementById('year');

  // Set current year in footer (only runs if the element exists)
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Function to update CSS var for header height
  function updateHeaderHeight() {
    // We only proceed if the header element exists
    if (header) {
      const h = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', h + 'px');
    }
  }

  // Initial set and update on resize (debounced)
  updateHeaderHeight();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateHeaderHeight, 80);
  });

  function openDrawer() {
    // Ensure drawer and overlay exist before manipulating classes
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  // Toggle on hamburger click
  menuBtn.addEventListener('click', () => {
    if (drawer && drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // close on ESC keydown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
      menuBtn.focus();
    }
  });

  // Close drawer when a navigation link is clicked (good for mobile)
  if (drawer) {
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });
  }
});
