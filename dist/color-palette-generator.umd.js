(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.window = global.window || {}));
})(this, (function (exports) { 'use strict';

  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var _hex, _rgb, _hsl, _hsv;
  const _ColorModel = class _ColorModel {
    /**
     * Creates a new ColorModel instance from a {@link HexColor | hex code}.
     * @param hexCode The hexadecimal color code.
     */
    constructor(hexCode = "#000000") {
      /**
       * The hexadecimal representation of the color.
       * @private
       */
      __privateAdd(this, _hex);
      /**
       * The RGB representation of the color.
       *  @private
       */
      __privateAdd(this, _rgb);
      /**
       * The HSL representation of the color.
       * @private
       */
      __privateAdd(this, _hsl);
      /**
       * The HSV representation of the color.
       * @private
       */
      __privateAdd(this, _hsv);
      this.hex = hexCode;
    }
    // HEX
    /**
     * Gets the hexadecimal representation of the color.
     */
    get hex() {
      return __privateGet(this, _hex);
    }
    /**
     * Sets the hexadecimal color and updates related color representations.
     */
    set hex(value) {
      __privateSet(this, _hex, value);
      __privateSet(this, _rgb, this.hexToRgb(value));
      __privateSet(this, _hsl, this.rgbToHsl(this.rgb));
      __privateSet(this, _hsv, this.hslToHsv(this.hsl));
    }
    // RGB
    /**
     * Gets the RGB representation of the color.
     */
    get rgb() {
      return __privateGet(this, _rgb);
    }
    /**
     * Sets the RGB color and updates related color representations.
     */
    set rgb(value) {
      __privateSet(this, _rgb, value);
      __privateSet(this, _hex, this.rgbToHex(value));
      __privateSet(this, _hsl, this.rgbToHsl(value));
      __privateSet(this, _hsv, this.hslToHsv(this.hsl));
    }
    // HSL
    /**
     * Gets the HSL representation of the color.
     */
    get hsl() {
      return __privateGet(this, _hsl);
    }
    /**
     * Sets the HSL color and updates related color representations.
     */
    set hsl(value) {
      __privateSet(this, _hsl, value);
      __privateSet(this, _rgb, this.hslToRgb(value));
      __privateSet(this, _hex, this.rgbToHex(this.rgb));
      __privateSet(this, _hsv, this.hslToHsv(value));
    }
    // HSV
    /**
     * Gets the HSV representation of the color.
     */
    get hsv() {
      return __privateGet(this, _hsv);
    }
    /**
     * Sets the HSV color and updates related color representations.
     */
    set hsv(value) {
      __privateSet(this, _hsv, value);
      __privateSet(this, _hsl, this.hsvToHsl(value));
      __privateSet(this, _rgb, this.hslToRgb(this.hsl));
      __privateSet(this, _hex, this.rgbToHex(this.rgb));
    }
    // HEX & RGB
    /**
     * Converts an RGB color to a hexadecimal string.
     * @param rgb The {@link RGBColor | RGB color}.
     * @returns The {@link HexColor | hex representation}.
     */
    rgbToHex({ r = 0, g = 0, b = 0 }) {
      const toHex = (x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return "#".concat(toHex(r), "").concat(toHex(g), "").concat(toHex(b), "");
    }
    /**
     * Converts a hexadecimal color to an RGB color.
     * @param hexCode The {@link HexColor | hex color code}.
     * @returns The {@link RGBColor | RGB representation}.
     */
    hexToRgb(hexCode) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    }
    // RGB & HSL
    /**
     * Converts an RGB color to a HSL color.
     * @param rgb The {@link RGBColor | RGB color}.
     * @returns The {@link HSLColor | HSL representation}.
     */
    rgbToHsl({ r = 0, g = 0, b = 0 }) {
      r /= 255, g /= 255, b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max == min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return { h: Math.floor(h * 360), s: Math.floor(s * 100), l: Math.floor(l * 100) };
    }
    /**
     * Converts an HSL color to an RGB color.
     * @param hsl The {@link HSLColor | HSL color}.
     * @returns The {@link RGBColor | RGB representation}.
     */
    hslToRgb({ h = 0, s = 0, l = 0 }) {
      h /= 360;
      s /= 100;
      l /= 100;
      const output = {
        r: 0,
        g: 0,
        b: 0
      };
      if (s === 0) {
        output.r = output.g = output.b = l;
      } else {
        const hue2rgb = (p2, q2, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
          if (t < 1 / 2) return q2;
          if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
          return p2;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        output.r = hue2rgb(p, q, h + 1 / 3);
        output.g = hue2rgb(p, q, h);
        output.b = hue2rgb(p, q, h - 1 / 3);
      }
      output.r *= 255;
      output.g *= 255;
      output.b *= 255;
      return output;
    }
    // HSL & HSV
    /**
     * Converts a HSL color to a HSV color.
     * @param hsl The {@link HSLColor | HSL color}.
     * @returns The {@link HSVColor | HSV representation}.
     */
    hslToHsv({ h = 0, s = 0, l = 0 }) {
      const L = l / 100;
      const V = s / 100 * Math.min(L, 1 - L) + L;
      return {
        h,
        s: V ? 100 * (2 - 2 * L / V) : 0,
        v: V * 100
      };
    }
    /**
     * Converts a HSV color to a HSL color.
     * @param hsv The {@link HSVColor | HSV color}.
     * @returns The {@link HSLColor | HSL representation}.
     */
    hsvToHsl({ h = 0, s = 0, v = 0 }) {
      const V = v / 100;
      const L = V - V * s / 200;
      const m = Math.min(L, 1 - L);
      return {
        h,
        s: m ? 100 * (V - L) / m : 0,
        l: L * 100
      };
    }
    // CMYK
    /**
     * Converts an RGB color to a CMYK color.
     * @param hsv The {@link RGBColor | RGB color}.
     * @param normalized Whether to normalize the representation. Default to `false`.
     * @returns The {@link CMYKColor | CMYK representation}.
     */
    rgbToCmyk({ r = 0, g = 0, b = 0 }, normalized = false) {
      let c = 1 - r / 255;
      let m = 1 - g / 255;
      let y = 1 - b / 255;
      let k = Math.min(c, Math.min(m, y));
      c = (c - k) / (1 - k);
      m = (m - k) / (1 - k);
      y = (y - k) / (1 - k);
      if (!normalized) {
        c = Math.round(c * 1e4) / 100;
        m = Math.round(m * 1e4) / 100;
        y = Math.round(y * 1e4) / 100;
        k = Math.round(k * 1e4) / 100;
      }
      c = isNaN(c) ? 0 : c;
      m = isNaN(m) ? 0 : m;
      y = isNaN(y) ? 0 : y;
      k = isNaN(k) ? 0 : k;
      return {
        c,
        m,
        y,
        k
      };
    }
    /**
     * Converts a CMYK color to an RGB color.
     * @param hsv The {@link CMYKColor | CMYK color}.
     * @param normalized Whether to normalize the representation. Default to `false`.
     * @returns The {@link RGBColor | RGB representation}.
     */
    cmykToRgb({ c = 0, m = 0, y = 0, k = 0 }, normalized = false) {
      c = c / 100;
      m = m / 100;
      y = y / 100;
      k = k / 100;
      c = c * (1 - k) + k;
      m = m * (1 - k) + k;
      y = y * (1 - k) + k;
      let r = 1 - c;
      let g = 1 - m;
      let b = 1 - y;
      if (!normalized) {
        r = Math.round(255 * r);
        g = Math.round(255 * g);
        b = Math.round(255 * b);
      }
      return {
        r,
        g,
        b
      };
    }
    // UTILS
    /**
     * Clones the current color instance.
     * @returns A new {@link ColorModel} instance with the same color values.
     */
    clone() {
      return new _ColorModel(this.hex);
    }
    /**
     * Checks whether the given {@link ColorModel} and this {@link ColorModel} are equal.
     * @param color {@link ColorModel} to check against.
     * @returns Whether the colors are equal.
     */
    equals(color) {
      return this.hex === color.hex;
    }
    /**
     * Adjusts the saturation of the color in the HSV color space.
     * @param saturation The amount to adjust the saturation.
     * @param max The maximum saturation value.
     * @param min The minimum saturation value.
     * @returns The updated color instance.
     */
    saturate(saturation = 0, max = 100, min = 0) {
      const currentSat = this.hsv.s;
      this.hsv.s = currentSat + saturation > max ? max : currentSat + saturation < min ? min : currentSat + saturation;
      this.hsl = this.hsvToHsl(this.hsv);
      return this;
    }
    /**
     * Adjusts the brightness of the color.
     * @param brightness The amount to adjust the brightness.
     * @param max The maximum brightness value.
     * @param min The minimum brightness value.
     * @returns The updated color instance.
     */
    brighten(brightness = 0, max = 100, min = 0) {
      const currentBrightness = this.hsv.v;
      this.hsl.l = currentBrightness + brightness > max ? max : currentBrightness + brightness < min ? min : currentBrightness + brightness;
      this.hsl = this.hsvToHsl(this.hsv);
      return this;
    }
    /**
     * Adjusts the saturation of the color in the HSL color space.
     * @param saturation The amount to adjust the saturation.
     * @param max The maximum allowed saturation value.
     * @param min The minimum allowed saturation value.
     * @returns The modified color instance.
     */
    saturateHsl(saturation = 0, max = 100, min = 0) {
      const currentSat = this.hsl.s;
      this.hsl.s = currentSat + saturation > max ? max : currentSat + saturation < min ? min : currentSat + saturation;
      this.rgb = this.hslToRgb(this.hsl);
      return this;
    }
    /**
     * Adjusts the lightness of the color in the HSL color space.
     * @param lightness The amount to adjust the lightness.
     * @param max The maximum allowed lightness value.
     * @param min The minimum allowed lightness value.
     * @returns The modified color instance.
     */
    lighten(lightness = 0, max = 100, min = 0) {
      const currentLightness = this.hsl.l;
      this.hsl.l = currentLightness + lightness > max ? max : currentLightness + lightness < min ? min : currentLightness + lightness;
      this.rgb = this.hslToRgb(this.hsl);
      return this;
    }
    /**
     * Adds a value to the hue, ensuring it remains within the 0-360 degrees range.
     * @param h The original hue value.
     * @param add The amount to add to the hue.
     * @returns The adjusted hue value.
     */
    addToHue(h = 0, add = 0) {
      return h + add > 360 ? (h + add) % 360 : h + add < 0 ? 360 + h + add : h + add;
    }
  };
  _hex = new WeakMap();
  _rgb = new WeakMap();
  _hsl = new WeakMap();
  _hsv = new WeakMap();
  let ColorModel = _ColorModel;

  class ColorPaletteGenerator {
    /**
     * Creates a new {@link ColorPaletteGenerator} instance from the given parameters.
     * @param param {@link ColorPaletteParams} used to generate the palette.
     */
    constructor({
      rand = () => Math.random(),
      precision = 4,
      hueRange = 180,
      // in degrees
      baseColor,
      // hex code or ColorModel
      baseSaturation
    } = {}) {
      this.rand = rand;
      this.precision = precision;
      this.hueRange = hueRange;
      if (baseColor) {
        if (typeof baseColor === "string") {
          this.setBaseColor(baseColor, baseSaturation);
        } else {
          this.baseColor = baseColor;
        }
      } else {
        this.setBaseColor();
        this.baseColor.hsv = {
          h: Math.round(this.rand() * 100 * 3.6),
          s: baseSaturation !== void 0 ? baseSaturation : Math.round(this.rand() * 20 + 65),
          v: Math.round(this.rand() * 20 + 65)
        };
      }
      this.generatePalettes();
    }
    /**
     * Sets the {@link baseColor} to use to generate the {@link palettes}.
     * @param baseColor {@link ColorModel#hex | ColorModel hexadecimal} representation to use. Default to `#000000`.
     * @param baseSaturation Saturation level to use if any.
     */
    setBaseColor(baseColor = "#000000", baseSaturation = null) {
      this.baseColor = new ColorModel(baseColor);
      if (baseSaturation !== void 0) {
        this.baseColor.saturate(baseSaturation);
      }
    }
    /**
     * Generates the {@link palettes}.
     */
    generatePalettes() {
      this.palettes = {
        base: [],
        light: [],
        dark: []
      };
      this.generateBasePalette();
      this.generateLightPalette();
      this.generateDarkPalette();
    }
    /**
     * Generates the {@link palettes#base | base palette}.
     *
     * Use the {@link baseColor} to generate `n * 2` colors (where `n` is the {@link precision}) by shifting the hue around the {@link baseColor} by the {@link hueRange}.
     */
    generateBasePalette() {
      this.palettes.base.push(this.baseColor);
      const hueStep = this.hueRange * 0.5 / this.precision;
      let endSaturation = this.rand() * 5 + 22.5;
      let endValue = this.rand() * 7.5 + 90;
      for (let i = 1; i <= this.precision; i++) {
        const color = new ColorModel();
        const h = color.addToHue(this.baseColor.hsv.h, hueStep * i);
        const s = Math.max(
          0,
          Math.min(100, this.baseColor.hsv.s - i * (this.baseColor.hsv.s - endSaturation) / this.precision)
        );
        const v = Math.max(
          0,
          Math.min(100, this.baseColor.hsv.v + i * (endValue - this.baseColor.hsv.v) / this.precision)
        );
        color.hsv = {
          h,
          s,
          v
        };
        this.palettes.base.unshift(color);
      }
      endSaturation = this.rand() * 7.5 + 90;
      endValue = this.rand() * 5 + 22.5;
      for (let i = 1; i <= this.precision; i++) {
        const color = new ColorModel();
        const h = color.addToHue(this.baseColor.hsv.h, -hueStep * i);
        const s = Math.max(
          0,
          Math.min(100, this.baseColor.hsv.s + i * (endSaturation - this.baseColor.hsv.s) / this.precision)
        );
        const v = Math.max(
          0,
          Math.min(100, this.baseColor.hsv.v - i * (this.baseColor.hsv.v - endValue) / this.precision)
        );
        color.hsv = {
          h,
          s,
          v
        };
        this.palettes.base.push(color);
      }
    }
    /**
     * Generates the {@link palettes#light | light palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
     */
    generateLightPalette() {
      const hue = this.rand() * 5 + 7.5;
      const saturation = this.rand() * 7.5 + 22.5;
      const value = this.rand() * 7.5 + 27.5;
      for (let i = 0; i < this.palettes.base.length; i++) {
        const color = new ColorModel(this.palettes.base[i].hex);
        color.hsv = {
          h: color.addToHue(color.hsv.h, -hue),
          s: Math.max(0, Math.min(100, color.hsv.s - saturation)),
          v: Math.max(0, Math.min(100, color.hsv.v + value))
        };
        this.palettes.light.push(color);
      }
    }
    /**
     * Generates the {@link palettes#dark | dark palette} based on the {@link palettes#base | base palette} by manipulating saturation and brightness.
     */
    generateDarkPalette() {
      const hue = this.rand() * 5 + 7.5;
      const saturation = this.rand() * 7.5 + 22.5;
      const value = this.rand() * 7.5 + 27.5;
      for (let i = 0; i < this.palettes.base.length; i++) {
        const color = new ColorModel(this.palettes.base[i].hex);
        color.hsv = {
          h: color.addToHue(color.hsv.h, hue),
          s: Math.max(0, Math.min(100, color.hsv.s + saturation)),
          v: Math.max(0, Math.min(100, color.hsv.v - value))
        };
        this.palettes.dark.push(color);
      }
    }
    /**
     * Get our {@link palettes#base | base palette}.
     * @readonly
     */
    get basePalette() {
      return this.palettes.base;
    }
    /**
     * Get our {@link palettes#light | light palette}.
     * @readonly
     */
    get lightPalette() {
      return this.palettes.light;
    }
    /**
     * Get our {@link palettes#dark | dark palette}.
     * @readonly
     */
    get darkPalette() {
      return this.palettes.dark;
    }
    /**
     * Get all the palettes as an array, in the {@link palettes#light | light palette}, {@link palettes#base | base palette}, and {@link palettes#dark | dark palette} order.
     * @readonly
     */
    get fullPalette() {
      return [...this.palettes.light, ...this.palettes.base, ...this.palettes.dark];
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
      minBrightness = 0,
      maxBrightness = 100,
      minSaturation = 0,
      maxSaturation = 100
    }) {
      if (length < 1) length = 1;
      let randomPalette = [...this.fullPalette];
      randomPalette = randomPalette.filter((c) => c.hsv.v >= minBrightness);
      randomPalette = randomPalette.filter((c) => c.hsv.v <= maxBrightness);
      randomPalette = randomPalette.filter((c) => c.hsv.s >= minSaturation);
      randomPalette = randomPalette.filter((c) => c.hsv.s <= maxSaturation);
      if (filterPasses && this.precision > 2) {
        for (let i = 0; i < 2; i++) {
          randomPalette = randomPalette.filter((c, index) => index % 2 === 1);
        }
      }
      randomPalette.sort(() => this.rand() - 0.5);
      randomPalette = randomPalette.slice(0, length);
      if (includeBaseColor) {
        const hasBaseColor = randomPalette.find((c) => c.equals(this.baseColor));
        if (!hasBaseColor) {
          randomPalette[0] = this.baseColor;
        }
      }
      if (sortByBrightness) {
        randomPalette.sort((a, b) => a.hsv.v - b.hsv.v);
      }
      return randomPalette;
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
      minBrightness = 0,
      maxBrightness = 100,
      minSaturation = 0,
      maxSaturation = 100
    }) {
      let returnedPalette = [];
      if (includeBaseColor) {
        returnedPalette.push(this.baseColor);
        length = Math.max(0, length - 1);
      }
      let fullPalette = [...this.fullPalette];
      fullPalette = fullPalette.filter((c) => c.hsv.v >= minBrightness);
      fullPalette = fullPalette.filter((c) => c.hsv.v <= maxBrightness);
      fullPalette = fullPalette.filter((c) => c.hsv.s >= minSaturation);
      fullPalette = fullPalette.filter((c) => c.hsv.s <= maxSaturation);
      if (fullPalette.length <= length + 1) {
        fullPalette.sort(() => this.rand() - 0.5);
        fullPalette = fullPalette.slice(0, length);
        return fullPalette;
      }
      const darkPalette = fullPalette.filter((c) => c.hsv.v <= 37.5);
      const lightPalette = fullPalette.filter((c) => c.hsv.v >= 87.5);
      const basePalette = fullPalette.filter((c) => c.hsv.v > 37.5 && c.hsv.v < 87.5);
      const getRandomIndex = (array) => {
        return Math.floor(this.rand() * array.length);
      };
      const darkColorIndexes = [];
      const lightColorIndexes = [];
      const baseColorIndexes = [];
      let nbColors = 0;
      if (darkPalette.length) {
        const darkIterations = Math.min(darkPalette.length, Math.floor(length / 4));
        for (let i = 0; i < darkIterations; i++) {
          let index = null;
          while (index === null || darkColorIndexes.includes(index) || includeBaseColor && darkPalette[index].equals(this.baseColor)) {
            index = getRandomIndex(darkPalette);
          }
          darkColorIndexes.push(index);
          nbColors++;
          returnedPalette.push(darkPalette[index]);
        }
      }
      if (lightPalette.length) {
        const lightIterations = Math.min(lightPalette.length, Math.floor(length / 4));
        for (let i = 0; i < lightIterations; i++) {
          let index = null;
          while (index === null || lightColorIndexes.includes(index) || includeBaseColor && lightPalette[index].equals(this.baseColor)) {
            index = getRandomIndex(lightPalette);
          }
          lightColorIndexes.push(index);
          nbColors++;
          returnedPalette.push(lightPalette[index]);
        }
      }
      const baseIterations = Math.min(basePalette.length, length - nbColors);
      for (let i = 0; i < baseIterations; i++) {
        let index = null;
        while (index === null || baseColorIndexes.includes(index) || includeBaseColor && basePalette[index].equals(this.baseColor)) {
          index = getRandomIndex(basePalette);
        }
        baseColorIndexes.push(index);
        returnedPalette.push(basePalette[index]);
      }
      if (sortByBrightness) {
        returnedPalette.sort((a, b) => a.hsv.v - b.hsv.v);
      }
      return returnedPalette;
    }
  }

  exports.ColorModel = ColorModel;
  exports.ColorPaletteGenerator = ColorPaletteGenerator;

}));
