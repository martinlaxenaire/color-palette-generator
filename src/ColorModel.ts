/**
 * Represents a hex color in the format `#RRGGBB`.
 */
export type HexColor = `#${string}`

/**
 * Represents an RGB color.
 */
export interface RGBColor {
  /** Red component (0-255). */
  r: number
  /** Green component (0-255). */
  g: number
  /** Blue component (0-255). */
  b: number
}

/**
 * Represents an HSL color.
 */
export interface HSLColor {
  /** Hue (0-360). */
  h: number
  /** Saturation (0-100). */
  s: number
  /** Lightness (0-100). */
  l: number
}

/**
 * Represents an HSV color.
 */
export interface HSVColor {
  /** Hue (0-360). */
  h: number
  /** Saturation (0-100). */
  s: number
  /** Value/Brightness (0-100). */
  v: number
}

/**
 * Represents a CMYK color.
 */
export interface CMYKColor {
  /** Cyan component (0-100). */
  c: number
  /** Magenta component (0-100). */
  m: number
  /** Yellow component (0-100). */
  y: number
  /** Black component (0-100). */
  k: number
}

/**
 * Represents a color in multiple color spaces and provides conversion utilities.
 *
 * @example
 * ```javascript
 * const redColor = new ColorModel('#ff0000')
 * const randomColor = new ColorModel()
 * ```
 */
export class ColorModel {
  /**
   * The hexadecimal representation of the color.
   * @private
   */
  #hex: HexColor
  /**
   * The RGB representation of the color.
   *  @private
   */
  #rgb: RGBColor
  /**
   * The HSL representation of the color.
   * @private
   */
  #hsl: HSLColor
  /**
   * The HSV representation of the color.
   * @private
   */
  #hsv: HSVColor

  /**
   * Creates a new ColorModel instance from a {@link HexColor | hex code}.
   * @param hexCode The hexadecimal color code.
   */
  constructor(hexCode = '#000000' as HexColor) {
    this.hex = hexCode
  }

  // HEX

  /**
   * Gets the hexadecimal representation of the color.
   */
  get hex(): HexColor {
    return this.#hex
  }

  /**
   * Sets the hexadecimal color and updates related color representations.
   */
  set hex(value: HexColor) {
    this.#hex = value
    this.#rgb = this.hexToRgb(value)
    this.#hsl = this.rgbToHsl(this.rgb)
    this.#hsv = this.hslToHsv(this.hsl)
  }

  // RGB

  /**
   * Gets the RGB representation of the color.
   */
  get rgb(): RGBColor {
    return this.#rgb
  }

  /**
   * Sets the RGB color and updates related color representations.
   */
  set rgb(value: RGBColor) {
    this.#rgb = value
    this.#hex = this.rgbToHex(value)
    this.#hsl = this.rgbToHsl(value)
    this.#hsv = this.hslToHsv(this.hsl)
  }

  // HSL

  /**
   * Gets the HSL representation of the color.
   */
  get hsl(): HSLColor {
    return this.#hsl
  }

  /**
   * Sets the HSL color and updates related color representations.
   */
  set hsl(value: HSLColor) {
    this.#hsl = value
    this.#rgb = this.hslToRgb(value)
    this.#hex = this.rgbToHex(this.rgb)
    this.#hsv = this.hslToHsv(value)
  }

  // HSV

  /**
   * Gets the HSV representation of the color.
   */
  get hsv(): HSVColor {
    return this.#hsv
  }

  /**
   * Sets the HSV color and updates related color representations.
   */
  set hsv(value: HSVColor) {
    this.#hsv = value
    this.#hsl = this.hsvToHsl(value)
    this.#rgb = this.hslToRgb(this.hsl)
    this.#hex = this.rgbToHex(this.rgb)
  }

  // HEX & RGB

  /**
   * Converts an RGB color to a hexadecimal string.
   * @param rgb The {@link RGBColor | RGB color}.
   * @returns The {@link HexColor | hex representation}.
   */
  rgbToHex({ r = 0, g = 0, b = 0 }: RGBColor): HexColor {
    const toHex = (x) => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return '#'.concat(toHex(r), '').concat(toHex(g), '').concat(toHex(b), '') as HexColor
  }

  /**
   * Converts a hexadecimal color to an RGB color.
   * @param hexCode The {@link HexColor | hex color code}.
   * @returns The {@link RGBColor | RGB representation}.
   */
  hexToRgb(hexCode: HexColor): RGBColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // RGB & HSL

  /**
   * Converts an RGB color to a HSL color.
   * @param rgb The {@link RGBColor | RGB color}.
   * @returns The {@link HSLColor | HSL representation}.
   */
  rgbToHsl({ r = 0, g = 0, b = 0 }: RGBColor): HSLColor {
    ;(r /= 255), (g /= 255), (b /= 255)
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max == min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) }
  }

  /**
   * Converts an HSL color to an RGB color.
   * @param hsl The {@link HSLColor | HSL color}.
   * @returns The {@link RGBColor | RGB representation}.
   */
  hslToRgb({ h = 0, s = 0, l = 0 }: HSLColor): RGBColor {
    h /= 360
    s /= 100
    l /= 100

    const output = {
      r: 0,
      g: 0,
      b: 0,
    }

    if (s === 0) {
      output.r = output.g = output.b = l // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      output.r = hue2rgb(p, q, h + 1 / 3)
      output.g = hue2rgb(p, q, h)
      output.b = hue2rgb(p, q, h - 1 / 3)
    }

    output.r *= 255
    output.g *= 255
    output.b *= 255

    return output
  }

  // HSL & HSV

  /**
   * Converts a HSL color to a HSV color.
   * @param hsl The {@link HSLColor | HSL color}.
   * @returns The {@link HSVColor | HSV representation}.
   */
  hslToHsv({ h = 0, s = 0, l = 0 }: HSLColor): HSVColor {
    const L = l / 100
    const V = (s / 100) * Math.min(L, 1 - L) + L
    return {
      h,
      s: V ? 100 * (2 - (2 * L) / V) : 0,
      v: V * 100,
    }
  }

  /**
   * Converts a HSV color to a HSL color.
   * @param hsv The {@link HSVColor | HSV color}.
   * @returns The {@link HSLColor | HSL representation}.
   */
  hsvToHsl({ h = 0, s = 0, v = 0 }: HSVColor): HSLColor {
    const V = v / 100
    const L = V - (V * s) / 200
    const m = Math.min(L, 1 - L)
    return {
      h,
      s: m ? (100 * (V - L)) / m : 0,
      l: L * 100,
    }
  }

  // CMYK

  /**
   * Converts an RGB color to a CMYK color.
   * @param hsv The {@link RGBColor | RGB color}.
   * @param normalized Whether to normalize the representation. Default to `false`.
   * @returns The {@link CMYKColor | CMYK representation}.
   */
  rgbToCmyk({ r = 0, g = 0, b = 0 }: RGBColor, normalized = false): CMYKColor {
    let c = 1 - r / 255
    let m = 1 - g / 255
    let y = 1 - b / 255
    let k = Math.min(c, Math.min(m, y))

    c = (c - k) / (1 - k)
    m = (m - k) / (1 - k)
    y = (y - k) / (1 - k)

    if (!normalized) {
      c = Math.round(c * 10000) / 100
      m = Math.round(m * 10000) / 100
      y = Math.round(y * 10000) / 100
      k = Math.round(k * 10000) / 100
    }

    c = isNaN(c) ? 0 : c
    m = isNaN(m) ? 0 : m
    y = isNaN(y) ? 0 : y
    k = isNaN(k) ? 0 : k

    return {
      c,
      m,
      y,
      k,
    }
  }

  /**
   * Converts a CMYK color to an RGB color.
   * @param hsv The {@link CMYKColor | CMYK color}.
   * @param normalized Whether to normalize the representation. Default to `false`.
   * @returns The {@link RGBColor | RGB representation}.
   */
  cmykToRgb({ c = 0, m = 0, y = 0, k = 0 }: CMYKColor, normalized = false): RGBColor {
    c = c / 100
    m = m / 100
    y = y / 100
    k = k / 100

    c = c * (1 - k) + k
    m = m * (1 - k) + k
    y = y * (1 - k) + k

    let r = 1 - c
    let g = 1 - m
    let b = 1 - y

    if (!normalized) {
      r = Math.round(255 * r)
      g = Math.round(255 * g)
      b = Math.round(255 * b)
    }

    return {
      r: r,
      g: g,
      b: b,
    }
  }

  // UTILS

  /**
   * Clones the current color instance.
   * @returns A new {@link ColorModel} instance with the same color values.
   */
  clone(): ColorModel {
    return new ColorModel(this.hex)
  }

  /**
   * Checks whether the given {@link ColorModel} and this {@link ColorModel} are equal.
   * @param color {@link ColorModel} to check against.
   * @returns Whether the colors are equal.
   */
  equals(color: ColorModel): boolean {
    return this.hex === color.hex
  }

  /**
   * Adjusts the saturation of the color in the HSV color space.
   * @param saturation The amount to adjust the saturation.
   * @param max The maximum saturation value.
   * @param min The minimum saturation value.
   * @returns The updated color instance.
   */
  saturate(saturation: number = 0, max: number = 100, min: number = 0): this {
    const currentSat = this.hsv.s
    this.hsv.s = currentSat + saturation > max ? max : currentSat + saturation < min ? min : currentSat + saturation

    this.hsl = this.hsvToHsl(this.hsv)
    return this
  }

  /**
   * Adjusts the brightness of the color.
   * @param brightness The amount to adjust the brightness.
   * @param max The maximum brightness value.
   * @param min The minimum brightness value.
   * @returns The updated color instance.
   */
  brighten(brightness: number = 0, max: number = 100, min: number = 0): this {
    const currentBrightness = this.hsv.v
    this.hsl.l =
      currentBrightness + brightness > max
        ? max
        : currentBrightness + brightness < min
        ? min
        : currentBrightness + brightness

    this.hsl = this.hsvToHsl(this.hsv)

    return this
  }

  /**
   * Adjusts the saturation of the color in the HSL color space.
   * @param saturation The amount to adjust the saturation.
   * @param max The maximum allowed saturation value.
   * @param min The minimum allowed saturation value.
   * @returns The modified color instance.
   */
  saturateHsl(saturation: number = 0, max: number = 100, min: number = 0): this {
    const currentSat = this.hsl.s
    this.hsl.s = currentSat + saturation > max ? max : currentSat + saturation < min ? min : currentSat + saturation

    this.rgb = this.hslToRgb(this.hsl)

    return this
  }

  /**
   * Adjusts the lightness of the color in the HSL color space.
   * @param lightness The amount to adjust the lightness.
   * @param max The maximum allowed lightness value.
   * @param min The minimum allowed lightness value.
   * @returns The modified color instance.
   */
  lighten(lightness: number = 0, max: number = 100, min: number = 0): this {
    const currentLightness = this.hsl.l
    this.hsl.l =
      currentLightness + lightness > max ? max : currentLightness + lightness < min ? min : currentLightness + lightness

    this.rgb = this.hslToRgb(this.hsl)

    return this
  }

  /**
   * Adds a value to the hue, ensuring it remains within the 0-360 degrees range.
   * @param h The original hue value.
   * @param add The amount to add to the hue.
   * @returns The adjusted hue value.
   */
  addToHue(h: number = 0, add: number = 0): number {
    return h + add > 360 ? (h + add) % 360 : h + add < 0 ? 360 + h + add : h + add
  }
}
