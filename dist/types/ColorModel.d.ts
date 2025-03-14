/**
 * Represents a hex color in the format `#RRGGBB`.
 */
export type HexColor = `#${string}`;
/**
 * Represents an RGB color.
 */
export interface RGBColor {
    /** Red component (0-255). */
    r: number;
    /** Green component (0-255). */
    g: number;
    /** Blue component (0-255). */
    b: number;
}
/**
 * Represents an HSL color.
 */
export interface HSLColor {
    /** Hue (0-360). */
    h: number;
    /** Saturation (0-100). */
    s: number;
    /** Lightness (0-100). */
    l: number;
}
/**
 * Represents an HSV color.
 */
export interface HSVColor {
    /** Hue (0-360). */
    h: number;
    /** Saturation (0-100). */
    s: number;
    /** Value/Brightness (0-100). */
    v: number;
}
/**
 * Represents a CMYK color.
 */
export interface CMYKColor {
    /** Cyan component (0-100). */
    c: number;
    /** Magenta component (0-100). */
    m: number;
    /** Yellow component (0-100). */
    y: number;
    /** Black component (0-100). */
    k: number;
}
/**
 * Represents a color in multiple color spaces and provides conversion utilities.
 *
 * @example
 * ```javascript
 * const redColor = new Color('#ff0000')
 * const randomColor = new Color()
 * ```
 */
export declare class ColorModel {
    #private;
    /**
     * Creates a new Color instance from a {@link HexColor | hex code}.
     * @param hexCode The hexadecimal color code.
     */
    constructor(hexCode?: HexColor);
    /**
     * Gets the hexadecimal representation of the color.
     */
    get hex(): HexColor;
    /**
     * Sets the hexadecimal color and updates related color representations.
     */
    set hex(value: HexColor);
    /**
     * Gets the RGB representation of the color.
     */
    get rgb(): RGBColor;
    /**
     * Sets the RGB color and updates related color representations.
     */
    set rgb(value: RGBColor);
    /**
     * Gets the HSL representation of the color.
     */
    get hsl(): HSLColor;
    /**
     * Sets the HSL color and updates related color representations.
     */
    set hsl(value: HSLColor);
    /**
     * Gets the HSV representation of the color.
     */
    get hsv(): HSVColor;
    /**
     * Sets the HSV color and updates related color representations.
     */
    set hsv(value: HSVColor);
    /**
     * Converts an RGB color to a hexadecimal string.
     * @param rgb The {@link RGBColor | RGB color}.
     * @returns The {@link HexColor | hex representation}.
     */
    rgbToHex({ r, g, b }: RGBColor): HexColor;
    /**
     * Converts a hexadecimal color to an RGB color.
     * @param hexCode The {@link HexColor | hex color code}.
     * @returns The {@link RGBColor | RGB representation}.
     */
    hexToRgb(hexCode: HexColor): RGBColor;
    /**
     * Converts an RGB color to a HSL color.
     * @param rgb The {@link RGBColor | RGB color}.
     * @returns The {@link HSLColor | HSL representation}.
     */
    rgbToHsl({ r, g, b }: RGBColor): HSLColor;
    /**
     * Converts an HSL color to an RGB color.
     * @param hsl The {@link HSLColor | HSL color}.
     * @returns The {@link RGBColor | RGB representation}.
     */
    hslToRgb({ h, s, l }: HSLColor): RGBColor;
    /**
     * Converts a HSL color to a HSV color.
     * @param hsl The {@link HSLColor | HSL color}.
     * @returns The {@link HSVColor | HSV representation}.
     */
    hslToHsv({ h, s, l }: HSLColor): HSVColor;
    /**
     * Converts a HSV color to a HSL color.
     * @param hsv The {@link HSVColor | HSV color}.
     * @returns The {@link HSLColor | HSL representation}.
     */
    hsvToHsl({ h, s, v }: HSVColor): HSLColor;
    /**
     * Converts an RGB color to a CMYK color.
     * @param hsv The {@link RGBColor | RGB color}.
     * @param normalized Whether to normalize the representation. Default to `false`.
     * @returns The {@link CMYKColor | CMYK representation}.
     */
    rgbToCmyk({ r, g, b }: RGBColor, normalized?: boolean): CMYKColor;
    /**
     * Converts a CMYK color to an RGB color.
     * @param hsv The {@link CMYKColor | CMYK color}.
     * @param normalized Whether to normalize the representation. Default to `false`.
     * @returns The {@link RGBColor | RGB representation}.
     */
    cmykToRgb({ c, m, y, k }: CMYKColor, normalized?: boolean): RGBColor;
    /**
     * Clones the current color instance.
     * @returns A new {@link ColorModel} instance with the same color values.
     */
    clone(): ColorModel;
    /**
     * Checks whether the given {@link ColorModel} and this {@link ColorModel} are equal.
     * @param color {@link ColorModel} to check against.
     * @returns Whether the colors are equal.
     */
    equals(color: ColorModel): boolean;
    /**
     * Adjusts the saturation of the color in the HSV color space.
     * @param saturation The amount to adjust the saturation.
     * @param max The maximum saturation value.
     * @param min The minimum saturation value.
     * @returns The updated color instance.
     */
    saturate(saturation?: number, max?: number, min?: number): this;
    /**
     * Adjusts the brightness of the color.
     * @param brightness The amount to adjust the brightness.
     * @param max The maximum brightness value.
     * @param min The minimum brightness value.
     * @returns The updated color instance.
     */
    brighten(brightness?: number, max?: number, min?: number): this;
    /**
     * Adjusts the saturation of the color in the HSL color space.
     * @param saturation The amount to adjust the saturation.
     * @param max The maximum allowed saturation value.
     * @param min The minimum allowed saturation value.
     * @returns The modified color instance.
     */
    saturateHsl(saturation?: number, max?: number, min?: number): this;
    /**
     * Adjusts the lightness of the color in the HSL color space.
     * @param lightness The amount to adjust the lightness.
     * @param max The maximum allowed lightness value.
     * @param min The minimum allowed lightness value.
     * @returns The modified color instance.
     */
    lighten(lightness?: number, max?: number, min?: number): this;
    /**
     * Adds a value to the hue, ensuring it remains within the 0-360 degrees range.
     * @param h The original hue value.
     * @param add The amount to add to the hue.
     * @returns The adjusted hue value.
     */
    addToHue(h?: number, add?: number): number;
}
