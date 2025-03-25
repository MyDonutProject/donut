const baseURL = process.env.NEXT_PUBLIC_S3_BUCKET_BASE_URL;

export const platformAssets = {
  app: 'Donut',
  logo: {
    icon: `${baseURL}/logos/icon.svg`,
    iconWithBackground: `${baseURL}/logos/icon.svg`,
    web: {
      dark: `${baseURL}/logos/light.svg`,
    },
  },
  theme: {
    light: {
      palette: {
        mode: 'light',
        primary: {
          contrastText: 'var(--primary-contrast-color)',
          main: 'var(--primary-color)',
          ghost: 'var(--primary-ghost-color)',
        },
        secondary: {
          contrastText: 'var(--secondary-contrast-color)',
          main: 'var(--secondary-color)',
        },
        card: {
          main: 'var(--card-color)',
        },
        success: {
          main: 'var(--success-color)',
          contrastText: 'var(--success-contrast-color)',
        },
        text: {
          primary: 'var(--text-primary-color)',
          secondary: 'var(--text-secondary-color)',
          disabled: 'var(--text-secondary-color)',
        },
        warning: {
          contrastText: 'var(--warning-contrast-color)',
          main: 'var(--warning-color)',
        },
        error: {
          contrastText: 'var(--error-contrast-color)',
          main: 'var(--error-color)',
        },
        background: {
          default: 'var(--background-default-color)',
          paper: 'var(--background-paper-color)',
        },
        severity: {
          main: 'var(--severity-color)',
          length: 'var(--severity-color)',
        },
        missionUncrossable: {
          primary: 'var(--missionUncrossable-primary-color)',
          secondary: 'var(--missionUncrossable-secondary-color)',
          shadow: 'var(--missionUncrossable-shadow-color)',
        },
        shape: {
          borderRadius: 'var(--shape-borderRadius)',
          boxHeight: 'var(--shape-boxHeight)',
        },
        customBar: {
          primary: '#00FF90',
        },
        roulette: {
          black: 'var(--roulette-black)',
          red: 'var(--roulette-red)',
        },
      },
      shape: {
        borderRadius: 'var(--shape-borderRadius)',
        boxHeight: 'var(--shape-boxHeight)',
      },
    },
    dark: {
      palette: {
        mode: 'light',
        primary: {
          contrastText: 'var(--primary-contrast-color)',
          main: 'var(--primary-color)',
          ghost: 'var(--primary-ghost-color)',
        },
        secondary: {
          contrastText: 'var(--secondary-contrast-color)',
          main: 'var(--secondary-color)',
        },
        card: {
          main: 'var(--card-color)',
        },
        success: {
          main: 'var(--success-color)',
          contrastText: 'var(--success-contrast-color)',
        },
        text: {
          primary: 'var(--text-primary-color)',
          light: 'var(--text-primary-color)',
          dark: 'var(--text-primary-color)',
          secondary: 'var(--text-secondary-color)',
          disabled: 'var(--text-secondary-color)',
        },
        warning: {
          contrastText: 'var(--warning-contrast-color)',
          main: 'var(--warning-color)',
        },
        error: {
          contrastText: 'var(--error-contrast-color)',
          main: 'var(--error-color)',
        },
        background: {
          default: 'var(--background-default-color)',
          paper: 'var(--background-paper-color)',
        },
        severity: {
          main: 'var(--severity-color)',
          length: 'var(--severity-color)',
        },
        missionUncrossable: {
          primary: 'var(--missionUncrossable-primary-color)',
          secondary: 'var(--missionUncrossable-secondary-color)',
          shadow: 'var(--missionUncrossable-shadow-color)',
        },
        shape: {
          borderRadius: 'var(--shape-borderRadius)',
          boxHeight: 'var(--shape-boxHeight)',
        },
        customBar: {
          primary: '#00FF90',
        },
        roulette: {
          black: 'var(--roulette-black)',
          red: 'var(--roulette-red)',
        },
      },
      shape: {
        borderRadius: 'var(--shape-borderRadius)',
        boxHeight: 'var(--shape-boxHeight)',
      },
    },
  },
  fontFamily: {
    name: 'var(--font-family)',
    fontUrls: [
      {
        url: `${baseURL}/fonts/GeoGrotesk/geogrotesque-wide-regular.woff2`,
        weight: [300, 400, 500],
      },
      {
        url: `${baseURL}/fonts/GeoGrotesk/geogrotesque-wide-medium.woff2`,
        weight: 600,
      },
      {
        url: `${baseURL}/fonts/GeoGrotesk/geogrotesque-wide-bold.woff2`,
        weight: [700, 800, 900],
      },
    ],
    css: 'https://icegames-s3.s3.amazonaws.com/fonts/GTWalsheimPro/fontFamily.css',
  },
};
