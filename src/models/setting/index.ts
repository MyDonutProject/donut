import { SettingLayoutComponentTypeMapping } from './layout/component/type/mapping';
import { ThemeMode } from './mode';
import { BaseEntity } from '../base-entity';

export class PaletteProps {
  contrastText: string;
  main: string;
  ghost?: string;
}

export class FontFamilyProps {
  name: string;
  url: string;
  cssFile?: string;
}

export class TextPaletteProps {
  primary: string;
  secondary: string;
  disabled: string;
}

export class BackgroundPaletteProps {
  default: string;
  paper: string;
}

export class ShapeProps {
  borderRadius: string;
  boxHeight: string;
}

export class RouletteProps {
  black: string;
  red: string;
  white?: string;
}

export class PaletteOptions {
  primaryColor: PaletteProps;
  secondaryColor: PaletteProps;
  success: PaletteProps;
  warning: PaletteProps;
  error: PaletteProps;
  background: BackgroundPaletteProps;
  text: TextPaletteProps;
  roulette: RouletteProps;
  preferStaticImages?: boolean;
  missionUncrossable: {
    primary: string;
    secondary: string;
    shadow: string;
  };
  customBar: {
    primary: string;
  };
  severity: {
    main: string;
    length: string;
  };
  card: {
    main: string;
  };
}

export type ThemeOptions = {
  [key in ThemeMode]: PaletteOptions;
};

export class Setting extends BaseEntity {
  light: ThemeOptions;
  dark: ThemeOptions;
  fontFamily: FontFamilyProps;
  shape: ShapeProps;
  components: SettingLayoutComponentTypeMapping[];
  vpnRestriction: boolean;
  preferStaticImages: boolean;
}

export type { SettingLayoutComponentTypeMapping };
