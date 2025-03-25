import { getComputedColor } from '@/utils/theme/colors';
import Color from 'color';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
		outline: none;
    
    &::-webkit-scrollbar {
      background-color: ${({ theme }) => theme.palette.background.default};
      width: 1px;
      
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.palette.background.paper};
    }

    &::-webkit-scrollbar-thumb {
      border-radius: ${({ theme }) => `calc(${theme.shape.borderRadius} * 2)`};
      border: 2px solid ${({ theme }) => theme.palette.text.primary};
    }
  }
  
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily}, sans-serif;
    color: ${({ theme }) => theme.palette.text.primary};
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: subpixel-antialiased !important;
    padding-right: 0px !important;
    -webkit-user-select: none;
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
    
  }

  img {
    user-select: none;
		-webkit-user-select: none;
		-webkit-user-drag: none;
	}

  a {
    text-decoration: none !important;
  }

  a:-webkit-any-link {
    text-decoration: none !important;
    color: ${({ theme }) => theme.palette.text.primary};
  }
  
  input {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  *:not(input)::selection {
    -webkit-user-select: transparent !important;
    -moz-user-select: transparent !important;
    -ms-user-select: transparent !important;
    user-select: transparent !important;
  }

  input::selection {
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }

  & .MuiSvgIcon-root {
    color: ${({ theme }) => theme.palette.text.primary}
  }

  & .MuiPickersDay-root.Mui-selected {
    background-color: ${({ theme }) => theme.palette.primary.main} !important;
  }

  & .MuiDateRangePickerDay-rangeIntervalDayHighlight {
    background-color: ${({ theme }) =>
      `${theme.palette.primary.main}`} !important;
  }

  html, body {
    max-width: 100%;
	}
  
  input::-webkit-contacts-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .PrivatePickersSlideTransition-root, .MuiYearPicker-root {
    &::-webkit-scrollbar {
      background-color: ${({ theme }) => theme.palette.background.default};
      width: 3px;
      
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.palette.background.paper};
    }

    &::-webkit-scrollbar-thumb {
      border-radius: ${({ theme }) => `calc(${theme.shape.borderRadius} * 2)`};
      border: 4px solid ${({ theme }) => theme.palette.text.primary};
    }
  }

  & .MuiAutocomplete-listbox {
    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar-track {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      display: none;
    }
  }

  .MuiPaper-root {
    background-color: ${({ theme }) => theme.palette.background.default};
    
    &::-webkit-scrollbar {
      display: none !important;
    }

    &::-webkit-scrollbar-track {
      display: none !important;
    }

    &::-webkit-scrollbar-thumb {
      display: none !important;
    }
  }

  & .MuiButtonBase-root {
    color: ${({ theme }) => theme.palette.text.secondary} !important;
    transition: all 0.25s ease-in-out;
  }

  & .MuiTableContainer-root,
  .MuiTable-root {
    &::-webkit-scrollbar {
      display: none !important;
    }

    &::-webkit-scrollbar-track {
      display: none !important;
    }

    &::-webkit-scrollbar-thumb {
      display: none !important;
    }
  }

  & .MuiTooltip-tooltip {
    background-color: ${({ theme }) => theme.palette.background.paper} !important;
    background: ${({ theme }) => theme.palette.background.paper} !important;
    border: 1px solid ${({ theme }) => Color(getComputedColor(theme.palette.text.secondary)).alpha(0.2).toString()};
    font-family: ${({ theme }) => theme.typography.fontFamily} ,'Inter', sans-serif !important;
    margin: unset !important;
    width: max-content !important;
}

`;
