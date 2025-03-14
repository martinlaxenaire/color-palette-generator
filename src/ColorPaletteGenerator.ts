import { ColorModel } from './ColorModel.js'

/**
 * Defines a palette of {@link ColorModel}.
 */
export type ColorPalette = ColorModel[]

/**
 * Defines the generated {@link ColorPalette}.
 */
export interface ColorPalettes {
  /**
   * Base {@link ColorPalette} generated.
   */
  base: ColorPalette
  /**
   * Light {@link ColorPalette} generated from the base palette.
   */
  light: ColorPalette
  /**
   * Dark {@link ColorPalette} generated from the base palette.
   */
  dark: ColorPalette
}

export interface ColorPaletteParams {
  /**
   * Custom function to generate a random number between `0` and `1`. Default to `Math.random()`.
   */
  rand?: () => number
  /**
   * Precision of the base palette, i.e. number of colors generated based on hue on each side of the base color. This gives a base color palette of length `precision * 2 + 1`. Default to `4`.
   */
  precision?: number
  /**
   * Hue range to use when generating the base color palette, in degrees. Default to `180`.
   */
  hueRange?: number
  /**
   * Base {@link ColorModel#hex | ColorModel hexadecimal} representation to use to generate a palette. Default to a random color.
   */
  baseColor?: ColorModel['hex']
  /**
   * Base saturation level to use when generating a random color if `baseColor` is not defined. Default to a random number between `20` and `85`.
   */
  baseSaturation?: number
}

/**
 * Generate a color palette based on a base {@link ColorModel}, a hue range and a precision level.
 *
 * Based on the theory explained in this {@link https://www.youtube.com/watch?v=u5AnzLg1HxY | video}, which generates a base palette as a set of colors around the base color by shifting its hue, then creates additional lighter and darker palettes by manipulating the saturation and brightness.
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
export class ColorPaletteGenerator {
  /**
   * Custom function to generate a random number between `0` and `1`. Default to `Math.random()`.
   */
  rand: ColorPaletteParams['rand']
  /**
   * Precision of the base palette, i.e. number of colors generated based on hue on each side of the base color. This gives a base color palette of length `precision * 2 + 1`. Default to `4`.
   */
  precision: ColorPaletteParams['precision']
  /**
   * Hue range to use when generating the base color palette, in degrees. Default to `180`.
   */
  hueRange: ColorPaletteParams['hueRange']
  /**
   * Base {@link ColorModel#hex | ColorModel hexadecimal} representation to use to generate a palette. Default to a random color.
   */
  baseColor: ColorModel

  /**
   * Generated {@link ColorPalettes}.
   */
  palettes: ColorPalettes

  /**
   * Creates a new {@link ColorPaletteGenerator} instance from the given parameters.
   * @param param {@link ColorPaletteParams} used to generate the palette.
   */
  constructor(
    {
      rand = () => Math.random(),
      precision = 4,
      hueRange = 180, // in degrees
      baseColor, // hex code
      baseSaturation,
    } = {} as ColorPaletteParams
  ) {
    this.rand = rand
    this.precision = precision
    this.hueRange = hueRange

    if (baseColor) {
      this.setBaseColor(baseColor, baseSaturation)
    } else {
      this.setBaseColor()
      this.baseColor.hsv = {
        h: Math.round(this.rand() * 100 * 3.6),
        s: baseSaturation !== undefined ? baseSaturation : Math.round(this.rand() * 20 + 65),
        v: Math.round(this.rand() * 20 + 65),
      }
    }

    this.generatePalettes()
  }

  /**
   * Sets the {@link baseColor} to use to generate the {@link palettes}.
   * @param baseColor {@link ColorModel#hex | ColorModel hexadecimal} representation to use. Default to `#000000`.
   * @param baseSaturation Saturation level to use if any.
   */
  setBaseColor(baseColor: ColorModel['hex'] = '#000000', baseSaturation: number | null = null) {
    this.baseColor = new ColorModel(baseColor)
    if (baseSaturation !== undefined) {
      this.baseColor.saturate(baseSaturation)
    }
  }

  /**
   * Generates the {@link palettes}.
   */
  generatePalettes() {
    this.palettes = {
      base: [],
      light: [],
      dark: [],
    }

    this.generateBasePalette()
    this.generateLightPalette()
    this.generateDarkPalette()
  }

  /**
   * Generates the {@link palettes#base | base palette}.
   *
   * Use the {@link baseColor} to generate `n * 2` colors (where `n` is the {@link precision}) by shifting the hue around the {@link baseColor} by the {@link hueRange}.
   */
  generateBasePalette() {
    this.palettes.base.push(this.baseColor)

    // first n (precision) colors
    const hueStep = (this.hueRange * 0.5) / this.precision

    let endSaturation = this.rand() * 5 + 22.5
    let endValue = this.rand() * 7.5 + 90

    for (let i = 1; i <= this.precision; i++) {
      const color = new ColorModel()

      const h = color.addToHue(this.baseColor.hsv.h, hueStep * i)
      const s = Math.max(
        0,
        Math.min(100, this.baseColor.hsv.s - (i * (this.baseColor.hsv.s - endSaturation)) / this.precision)
      )
      const v = Math.max(
        0,
        Math.min(100, this.baseColor.hsv.v + (i * (endValue - this.baseColor.hsv.v)) / this.precision)
      )

      color.hsv = {
        h,
        s,
        v,
      }

      this.palettes.base.unshift(color)
    }

    // second set of n (precision) colors
    endSaturation = this.rand() * 7.5 + 90
    endValue = this.rand() * 5 + 22.5

    for (let i = 1; i <= this.precision; i++) {
      const color = new ColorModel()

      const h = color.addToHue(this.baseColor.hsv.h, -hueStep * i)
      const s = Math.max(
        0,
        Math.min(100, this.baseColor.hsv.s + (i * (endSaturation - this.baseColor.hsv.s)) / this.precision)
      )
      const v = Math.max(
        0,
        Math.min(100, this.baseColor.hsv.v - (i * (this.baseColor.hsv.v - endValue)) / this.precision)
      )

      color.hsv = {
        h,
        s,
        v,
      }

      this.palettes.base.push(color)
    }
  }

  /**
   * Generates the {@link palettes#light | light palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
   */
  generateLightPalette() {
    const hue = this.rand() * 5 + 7.5
    const saturation = this.rand() * 7.5 + 22.5
    const value = this.rand() * 7.5 + 27.5

    for (let i = 0; i < this.palettes.base.length; i++) {
      const color = new ColorModel(this.palettes.base[i].hex)
      color.hsv = {
        h: color.addToHue(color.hsv.h, -hue),
        s: Math.max(0, Math.min(100, color.hsv.s - saturation)),
        v: Math.max(0, Math.min(100, color.hsv.v + value)),
      }

      this.palettes.light.push(color)
    }
  }

  /**
   * Generates the {@link palettes#dark | dark palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
   */
  generateDarkPalette() {
    const hue = this.rand() * 5 + 7.5
    const saturation = this.rand() * 7.5 + 22.5
    const value = this.rand() * 7.5 + 27.5

    for (let i = 0; i < this.palettes.base.length; i++) {
      const color = new ColorModel(this.palettes.base[i].hex)
      color.hsv = {
        h: color.addToHue(color.hsv.h, hue),
        s: Math.max(0, Math.min(100, color.hsv.s + saturation)),
        v: Math.max(0, Math.min(100, color.hsv.v - value)),
      }

      this.palettes.dark.push(color)
    }
  }

  /**
   * Get our {@link palettes#base | base palette}.
   * @readonly
   */
  get basePalette() {
    return this.palettes.base
  }

  /**
   * Get our {@link palettes#light | light palette}.
   * @readonly
   */
  get lightPalette() {
    return this.palettes.light
  }

  /**
   * Get our {@link palettes#dark | dark palette}.
   * @readonly
   */
  get darkPalette() {
    return this.palettes.dark
  }

  /**
   * Get all the palettes as an array, in the {@link palettes#light | light palette}, {@link palettes#base | base palette}, and {@link palettes#dark | dark palette} order.
   * @readonly
   */
  get fullPalette(): ColorPalette {
    return [...this.palettes.light, ...this.palettes.base, ...this.palettes.dark]
  }

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
  getRandomPalette({
    length = 4,
    includeBaseColor = false,
    filterPasses = true,
    sortByBrightness = true,
    minSaturation = 0,
    maxSaturation = 100,
  }: {
    /** Number of {@link ColorModel} returned. Default to `4`. */
    length?: number
    /** Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`. */
    includeBaseColor?: boolean
    /** Whether to remove every other colors before generating the random palette. Used to avoid getting 2 colors too close. Default to `true`. */
    filterPasses?: boolean
    /** Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`. */
    sortByBrightness?: boolean
    /** Minimum saturation level of the random returned {@link ColorModel}. Default to `0`. */
    minSaturation?: number
    /** Maximum saturation level of the random returned {@link ColorModel}. Default to `100`. */
    maxSaturation?: number
  }): ColorPalette {
    if (length < 1) length = 1

    // get all generated colors
    let randomPalette: ColorPalette = [...this.fullPalette]

    // saturation filters
    randomPalette = randomPalette.filter((c) => c.hsv.s >= minSaturation)
    randomPalette = randomPalette.filter((c) => c.hsv.s <= maxSaturation)

    // filterPasses means we're going to remove every other colors (one out of 2)
    // this is used to avoid getting 2 colors too close
    // also useful to removed first and last values (usually white and black respectively)
    if (filterPasses && this.precision > 2) {
      for (let i = 0; i < 2; i++) {
        randomPalette = randomPalette.filter((c, index) => index % 2 === 1)
      }
    }

    // shuffle it
    randomPalette.sort(() => this.rand() - 0.5)
    // get the first X elements
    randomPalette = randomPalette.slice(0, length)

    if (includeBaseColor) {
      const hasBaseColor = randomPalette.find((c) => c.equals(this.baseColor))

      if (!hasBaseColor) {
        randomPalette[0] = this.baseColor
      }
    }

    // sort by brightness (value in fact)
    // from dark to light
    if (sortByBrightness) {
      randomPalette.sort((a, b) => a.hsv.v - b.hsv.v)
    }

    return randomPalette
  }

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
  getDistributedPalette({
    length = 4,
    includeBaseColor = false,
    sortByBrightness = true,
    minSaturation = 0,
    maxSaturation = 100,
  }: {
    /** Number of {@link ColorModel} returned. Default to `4`. */
    length?: number
    /** Whether to include the {@link baseColor} in the returned {@link ColorPalette}. Default to `false`. */
    includeBaseColor?: boolean
    /** Whether to sort the returned {@link ColorModel} by brightness/value, from dark to light. Default to `true`. */
    sortByBrightness?: boolean
    /** Minimum saturation level of the returned {@link ColorModel}. Default to `0`. */
    minSaturation?: number
    /** Maximum saturation level of the returned {@link ColorModel}. Default to `100`. */
    maxSaturation?: number
  }): ColorPalette {
    let returnedPalette: ColorPalette = []

    if (includeBaseColor) {
      returnedPalette.push(this.baseColor)
      length = Math.max(0, length - 1)
    }

    let fullPalette = [...this.fullPalette]

    // saturation filters
    fullPalette = fullPalette.filter((c) => c.hsv.s >= minSaturation)
    fullPalette = fullPalette.filter((c) => c.hsv.s <= maxSaturation)

    // if there's not enough element we might get a timeout with our recursive loops
    // just return first randomized colors
    if (fullPalette.length <= length + 1) {
      fullPalette.sort(() => this.rand() - 0.5)
      // get the first X elements
      fullPalette = fullPalette.slice(0, length)

      return fullPalette
    }

    const darkPalette = fullPalette.filter((c) => c.hsv.v <= 37.5)
    const lightPalette = fullPalette.filter((c) => c.hsv.v >= 87.5)
    const basePalette = fullPalette.filter((c) => c.hsv.v > 37.5 && c.hsv.v < 87.5)

    const getRandomIndex = (array: ColorPalette): number => {
      return Math.floor(this.rand() * array.length)
    }

    const darkColorIndexes = []
    const lightColorIndexes = []
    const baseColorIndexes = []

    let nbColors = 0

    // dark colors
    if (darkPalette.length) {
      const darkIterations = Math.min(darkPalette.length, Math.floor(length / 4))
      for (let i = 0; i < darkIterations; i++) {
        let index: number | null = null

        while (
          index === null ||
          darkColorIndexes.includes(index) ||
          (includeBaseColor && darkPalette[index].equals(this.baseColor))
        ) {
          index = getRandomIndex(darkPalette)
        }

        darkColorIndexes.push(index)
        nbColors++
        returnedPalette.push(darkPalette[index])
      }
    }

    // light colors
    if (lightPalette.length) {
      const lightIterations = Math.min(lightPalette.length, Math.floor(length / 4))
      for (let i = 0; i < lightIterations; i++) {
        let index: number | null = null

        while (
          index === null ||
          lightColorIndexes.includes(index) ||
          (includeBaseColor && lightPalette[index].equals(this.baseColor))
        ) {
          index = getRandomIndex(lightPalette)
        }

        lightColorIndexes.push(index)
        nbColors++
        returnedPalette.push(lightPalette[index])
      }
    }

    // base colors
    const baseIterations = Math.min(basePalette.length, length - nbColors)
    for (let i = 0; i < baseIterations; i++) {
      let index: number | null = null

      while (
        index === null ||
        baseColorIndexes.includes(index) ||
        (includeBaseColor && basePalette[index].equals(this.baseColor))
      ) {
        index = getRandomIndex(basePalette)
      }

      baseColorIndexes.push(index)
      returnedPalette.push(basePalette[index])
    }

    // sort by brightness (value in fact)
    // from dark to light
    if (sortByBrightness) {
      returnedPalette.sort((a, b) => a.hsv.v - b.hsv.v)
    }

    return returnedPalette
  }
}
