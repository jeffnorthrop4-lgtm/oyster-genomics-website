'use strict';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

if (header && menuButton && navigation) {
  const menuLabel = menuButton.querySelector('.menu-label');
  const compactLayout = window.matchMedia('(max-width: 800px)');

  function setMenuLabel(label) {
    if (menuLabel) menuLabel.textContent = label;
  }

  function closeMenu({ restoreFocus = false } = {}) {
    menuButton.setAttribute('aria-expanded', 'false');
    setMenuLabel('Menu');
    navigation.classList.remove('is-open');
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    setMenuLabel(opening ? 'Close' : 'Menu');
    navigation.classList.toggle('is-open', opening);
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    if (!compactLayout.matches || !link.hash) return;
    const id = decodeURIComponent(link.hash.slice(1));
    if (!/^[A-Za-z][\w-]*$/.test(id)) return;
    const destination = document.getElementById(id);
    if (!destination) return;
    if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });

  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
  });

  compactLayout.addEventListener('change', () => closeMenu());
  document.documentElement.classList.add('js');
  menuButton.hidden = false;
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
