import { useEffect, useMemo } from 'react';

export const useDeferredStyles = (url: string) => {
  const links = useMemo(
    () => [
      { href: '/favicon.png' },
      {
        href:
          url ||
          'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      },
      {
        href: `${process.env.NEXT_PUBLIC_CF_DISTRIBUTION}/fonts/FontAwesome/all.css`,
        preload: true,
      },
      {
        href: `${process.env.NEXT_PUBLIC_CF_DISTRIBUTION}/fonts/casino-icons.css`,
        preload: true,
      },
    ],
    [url],
  );

  useEffect(() => {
    const loadDeferredStyles = () => {
      links.forEach(({ href, preload }) => {
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) return;

        const linkElement = document.createElement('link');
        linkElement.href = href;

        if (preload) {
          linkElement.rel = 'preload';
          linkElement.as = 'style';
          linkElement.setAttribute('data-preload', 'true');
        } else {
          linkElement.rel = 'stylesheet';
        }

        linkElement.onload = () => {
          if (preload) {
            linkElement.rel = 'stylesheet';
            linkElement.removeAttribute('as');
            linkElement.removeAttribute('data-preload');
          }
        };

        document.head.appendChild(linkElement);
      });
    };

    loadDeferredStyles();
  }, [links]);
};
