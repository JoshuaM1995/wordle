(function() {
  const stored = localStorage.getItem('wordle.joshuamcnabb.darkMode');
  const value = stored && JSON.parse(stored);
  const isDark = typeof value === 'boolean' ? value : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
})();

