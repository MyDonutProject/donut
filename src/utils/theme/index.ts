import Color from 'color';

export const theme = {
  light: {
    mode: 'light',
    primaryColor: {
      contrastText: '#ffffff',
      main: '#983EFF',
      ghost: '#983EFF33',
    },
    secondaryColor: {
      contrastText: '#ffffff',
      main: '#6309CA',
    },
    card: {
      main: '#f4f5f7',
    },
    success: {
      contrastText: '#ffffff',
      main: '#06E385',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
      disabled: '#6b778c30',
    },
    warning: {
      contrastText: '#ffffff',
      main: '#ff9800',
    },
    error: {
      contrastText: '#ffffff',
      main: '#FF556C',
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
    severity: {
      main: '#FFFEC8',
      length: '#FFFEC8',
    },
    missionUncrossable: {
      primary: '#0da784',
      secondary: '#313464',
      shadow: '#171c4c',
    },
    customBar: {
      primary: '#00FF90',
    },
    roulette: {
      black: Color('#24262B').lighten(0.25).hex(),
      red: '#FF556C',
    },
    shape: {
      borderRadius: '8px',
      boxHeight: '48px',
    },
    fontFamily: {
      name: 'Lato',
      url: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Changa+One:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
      cssFile: undefined,
    },
  },
  dark: {
    mode: 'dark',
    primaryColor: {
      contrastText: '#2a2a2a',
      main: '#983EFF',
      ghost: '#983EFF33',
    },
    secondaryColor: {
      contrastText: '#2a2a2a',
      main: '#983EFF',
    },
    card: {
      main: '#332E44',
    },
    success: {
      contrastText: '#2a2a2a',
      main: '#06E385',
    },
    text: {
      primary: '#ffffff',
      secondary: '#98a7b5',
      disabled: '#aaa',
    },
    warning: {
      contrastText: '#ffffff',
      main: '#ff9800',
    },
    error: {
      contrastText: '#ffffff',
      main: '#FF556C',
    },
    background: {
      default: '#1c1a28',
      paper: '#272334',
    },
    severity: {
      main: '#FFFEC8',
      length: '#FFFEC8',
    },
    customBar: {
      primary: '#00FF90',
    },
    missionUncrossable: {
      primary: '#0da784',
      secondary: '#313464',
      shadow: '#171c4c',
    },
    roulette: {
      black: Color('#24262B').lighten(0.25).hex(),
      red: '#FF556C',
      white: '#49b356',
    },
    shape: {
      borderRadius: '8px',
      boxHeight: '48px',
    },
    fontFamily: {
      name: 'Lato',
      url: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Changa+One:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
      cssFile: undefined,
    },
  },
  fontFamily: {
    name: 'Lato',
    url: 'https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Changa+One:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
    cssFile: undefined,
  },
  shape: {
    borderRadius: '24px',
    boxHeight: '48px',
  },
};
