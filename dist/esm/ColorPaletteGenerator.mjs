import { ColorModel } from './ColorModel.mjs';

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
    minSaturation = 0,
    maxSaturation = 100
  }) {
    if (length < 1) length = 1;
    let randomPalette = [...this.fullPalette];
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
    minSaturation = 0,
    maxSaturation = 100
  }) {
    let returnedPalette = [];
    if (includeBaseColor) {
      returnedPalette.push(this.baseColor);
      length = Math.max(0, length - 1);
    }
    let fullPalette = [...this.fullPalette];
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

export { ColorPaletteGenerator };
