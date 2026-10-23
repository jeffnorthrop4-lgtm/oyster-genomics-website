'use strict';
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menuLabel = menuButton.querySelector('.menu-label');
const navigation = document.querySelector('#site-navigation');
const compactLayout = window.matchMedia('(max-width: 800px)');
function closeMenu({ restoreFocus = false } = {}) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Menu';
  navigation.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuLabel.textContent = opening ? 'Close' : 'Menu';
  navigation.classList.toggle('is-open', opening);
});
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  if (compactLayout.matches && link.hash) {
    const destination = document.querySelector(link.hash);
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu({ restoreFocus: true });
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', event => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
});
compactLayout.addEventListener('change', () => closeMenu());
document.querySelector('#year').textContent = String(new Date().getFullYear());
// All navigation and content remain available without JavaScript.
document.documentElement.classList.add('js');
menuButton.hidden = false;
