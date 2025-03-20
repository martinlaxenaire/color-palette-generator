import { ColorModel } from './ColorModel.js';
/**
 * Defines a palette of {@link ColorModel}.
 */
export type ColorPalette = ColorModel[];
/**
 * Defines the generated {@link ColorPalette}.
 */
export interface ColorPalettes {
    /**
     * Base {@link ColorPalette} generated.
     */
    base: ColorPalette;
    /**
     * Light {@link ColorPalette} generated from the base palette.
     */
    light: ColorPalette;
    /**
     * Dark {@link ColorPalette} generated from the base palette.
     */
    dark: ColorPalette;
}
export interface ColorPaletteParams {
    /**
     * Custom function to generate a random number between `0` and `1`. Default to `Math.random()`.
     */
    rand?: () => number;
    /**
     * Precision of the base palette, i.e. number of colors generated based on hue on each side of the base color. This gives a base color palette of length `precision * 2 + 1`. Default to `4`.
     */
    precision?: number;
    /**
     * Hue range to use when generating the base color palette, in degrees. Default to `180`.
     */
    hueRange?: number;
    /**
     * Base {@link ColorModel} or {@link ColorModel#hex | ColorModel hexadecimal} representation to use to generate a palette. Default to a random color.
     */
    baseColor?: ColorModel | ColorModel['hex'];
    /**
     * Base saturation level to use when generating a random color if `baseColor` is not defined. Default to a random number between `20` and `85`.
     */
    baseSaturation?: number;
}
/**
 * Generate a color palette based on a base {@link ColorModel}, a hue range and a precision level.
 *
 * Based on the theory explained in this {@link https://www.youtube.com/watch?v=u5AnzLg1HxY | video}, which is to generate a base palette as a set of colors around the given base color by shifting its hue increasingly, then creates additional lighter and darker palettes by manipulating the base palette colors saturation and brightness.
 *
 * @example
 * ```javascript
 * // create a palette from a random color
 * const palette = new ColorPaletteGenerator()
 *
 * // get a distributed palette of 6 colors based on 'palette'
 * const distributedPalette = palette.getDistributedPalette({
 *  length: 6,
 * })
 *
 * // create another palette from a green color
 * const paletteFromColor = new ColorPaletteGenerator({
 *  precision: 6,
 *  baseColor: '#3459c7',
 * })
 *
 * // get a random palette of 4 colors based on 'paletteFromColor'
 * const randomPaletteFromColor = paletteFromColor.getRandomPalette()
 * ```
 */
export declare class ColorPaletteGenerator {
    /**
     * Custom function to generate a random number between `0` and `1`. Default to `Math.random()`.
     */
    rand: ColorPaletteParams['rand'];
    /**
     * Precision of the base palette, i.e. number of colors generated based on hue on each side of the base color. This gives a base color palette of length `precision * 2 + 1`. Default to `4`.
     */
    precision: ColorPaletteParams['precision'];
    /**
     * Hue range to use when generating the base color palette, in degrees. Default to `180`.
     */
    hueRange: ColorPaletteParams['hueRange'];
    /**
     * Base {@link ColorModel#hex | ColorModel hexadecimal} representation to use to generate a palette. Default to a random color.
     */
    baseColor: ColorModel;
    /**
     * Generated {@link ColorPalettes}.
     */
    palettes: ColorPalettes;
    /**
     * Creates a new {@link ColorPaletteGenerator} instance from the given parameters.
     * @param param {@link ColorPaletteParams} used to generate the palette.
     */
    constructor({ rand, precision, hueRange, // in degrees
    baseColor, // hex code or ColorModel
    baseSaturation, }?: ColorPaletteParams);
    /**
     * Sets the {@link baseColor} to use to generate the {@link palettes}.
     * @param baseColor {@link ColorModel#hex | ColorModel hexadecimal} representation to use. Default to `#000000`.
     * @param baseSaturation Saturation level to use if any.
     */
    setBaseColor(baseColor?: ColorModel['hex'], baseSaturation?: number | null): void;
    /**
     * Generates the {@link palettes}.
     */
    generatePalettes(): void;
    /**
     * Generates the {@link palettes#base | base palette}.
     *
     * Use the {@link baseColor} to generate `n * 2` colors (where `n` is the {@link precision}) by shifting the hue around the {@link baseColor} by the {@link hueRange}.
     */
    generateBasePalette(): void;
    /**
     * Generates the {@link palettes#light | light palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
     */
    generateLightPalette(): void;
    /**
     * Generates the {@link palettes#dark | dark palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
     */
    generateDarkPalette(): void;
    /**
     * Get our {@link palettes#base | base palette}.
     * @readonly
     */
    get basePalette(): ColorPalette;
    /**
     * Get our {@link palettes#light | light palette}.
     * @readonly
     */
    get lightPalette(): ColorPalette;
    /**
     * Get our {@link palettes#dark | dark palette}.
     * @readonly
     */
    get darkPalette(): ColorPalette;
    /**
     * Get all the palettes as an array, in the {@link palettes#light | light palette}, {@link palettes#base | base palette}, and {@link palettes#dark | dark palette} order.
     * @readonly
     */
    get fullPalette(): ColorPalette;
    /**
     * Generates a random {@link ColorPalette} from our generated {@link palettes}.
     * @param param Parameters used to generate the random {@link ColorPalette}.
     * @param param.length Number of {@link ColorModel} returned. Default to `4`.
     * @param param.includeBaseColor Number of {@link ColorModel} Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`.
     * @param param.filterPasses Whether to remove every other colors before generating the random palette. Used to avoid getting 2 colors too close. Default to `true`.
     * @param param.sortByBrightness Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`.
     * @param param.minSaturation Minimum saturation level of the random returned {@link ColorModel}. Default to `0`.
     * @param param.maxSaturation Maximum saturation level of the random returned {@link ColorModel}. Default to `100`.
     * @returns Random {@link ColorPalette}.
     */
    getRandomPalette({ length, includeBaseColor, filterPasses, sortByBrightness, minBrightness, maxBrightness, minSaturation, maxSaturation, }: {
        /** Number of {@link ColorModel} returned. Default to `4`. */
        length?: number;
        /** Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`. */
        includeBaseColor?: boolean;
        /** Whether to remove every other colors before generating the random palette. Used to avoid getting 2 colors too close. Default to `true`. */
        filterPasses?: boolean;
        /** Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`. */
        sortByBrightness?: boolean;
        /** Minimum brightness/value level of the returned {@link ColorModel}. Default to `0`. */
        minBrightness?: number;
        /** Maximum brightness/value level of the returned {@link ColorModel}. Default to `100`. */
        maxBrightness?: number;
        /** Minimum saturation level of the random returned {@link ColorModel}. Default to `0`. */
        minSaturation?: number;
        /** Maximum saturation level of the random returned {@link ColorModel}. Default to `100`. */
        maxSaturation?: number;
    }): ColorPalette;
    /**
     * Generates a distributed {@link ColorPalette} from our generated {@link palettes}, which is an attempt at get evenly/clever distributed colors.
     * @param param Parameters used to generate the distributed {@link ColorPalette}.
     * @param param.length Number of {@link ColorModel} returned. Default to `4`.
     * @param param.includeBaseColor Number of {@link ColorModel} Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`.
     * @param param.sortByBrightness Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`.
     * @param param.minSaturation Minimum saturation level of the returned {@link ColorModel}. Default to `0`.
     * @param param.maxSaturation Maximum saturation level of the returned {@link ColorModel}. Default to `100`.
     * @returns Distributed {@link ColorPalette}.
     */
    getDistributedPalette({ length, includeBaseColor, sortByBrightness, minBrightness, maxBrightness, minSaturation, maxSaturation, }: {
        /** Number of {@link ColorModel} returned. Default to `4`. */
        length?: number;
        /** Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`. */
        includeBaseColor?: boolean;
        /** Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`. */
        sortByBrightness?: boolean;
        /** Minimum brightness/value level of the returned {@link ColorModel}. Default to `0`. */
        minBrightness?: number;
        /** Maximum brightness/value level of the returned {@link ColorModel}. Default to `100`. */
        maxBrightness?: number;
        /** Minimum saturation level of the returned {@link ColorModel}. Default to `0`. */
        minSaturation?: number;
        /** Maximum saturation level of the returned {@link ColorModel}. Default to `100`. */
        maxSaturation?: number;
    }): ColorPalette;
}
