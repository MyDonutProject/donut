import { Setting } from '@/models/setting';
export function getComputedColor(variable: string): string {
  if (typeof document == 'undefined' || typeof window == 'undefined') {
    return '#ffffff00' as string;
  }

  if (variable?.includes('#')) {
    return variable as string;
  }

  if (variable?.includes('mui')) {
    const isolatedVars = variable
      ?.substring(4, variable?.length - 1)
      ?.split(',');
    const muiResolvedVariable = getComputedDocumentStyle(isolatedVars?.[0]);
    const themeResolvedVariable = getComputedDocumentStyle(isolatedVars?.[1]);

    return muiResolvedVariable ?? themeResolvedVariable;
  }

  return getComputedDocumentStyle(variable);
}

function getComputedDocumentStyle(item: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(item?.replace('var(', '')?.replace(')', ''))
    .trim() as string;
}

export function generateServerVariables(setting: Setting) {
  let cssVariables = '';

  cssVariables += generatePaletteVariables(setting);

  return cssVariables;
}

function generatePaletteVariables(setting: Setting) {
  let cssVariables = '';

  function generateVariables(obj: any, prefix: string = ''): void {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newPrefix = prefix ? `${prefix}-${key}` : key;

      if (typeof value === 'string') {
        cssVariables += `--${newPrefix}: ${value};\n`;
      } else if (typeof value === 'object' && value !== null) {
        generateVariables(value, newPrefix);
      }
    });
  }

  generateVariables(setting);

  return cssVariables;
}
