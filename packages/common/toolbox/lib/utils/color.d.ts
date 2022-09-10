export function rgbToHex(rgb: Color): string;
export function setAlpha(color: Color, alpha?: number): any;
export function isDarkColor(color?: Color): boolean;
export function getDominantColor(imageURL: string): Promise<any>;
export function genColorsGradient(colorsCount?: number, gradientRange?: Array<number>, palette?: Array<string>): Array<string>;
export function genColorPair(bg?: Color, darkOnly?: boolean, lightOnly?: boolean): string;
export function genColorsPalette(options?: {
    colorsCount: number;
    gradientRange: Array<number>;
    palette: Array<string>;
}): Array<any>;
export type Color = string | any | number | Array<number>;
