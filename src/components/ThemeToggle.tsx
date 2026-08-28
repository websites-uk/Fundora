import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('fundora-theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('fundora-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return <button type="button" className="theme-toggle" onClick={() => setDark(v => !v)} aria-label="Switch theme">
    {dark ? 'Light mode' : 'Dark mode'}
  </button>;
}
