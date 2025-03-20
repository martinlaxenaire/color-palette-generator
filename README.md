# Color palette generator

A small, lightweight utility helper to generate color palettes based on a given input color.

Uses the theory explained in this [video](https://www.youtube.com/watch?v=u5AnzLg1HxY), which is to generate a base palette as a set of colors around the given base color by shifting its hue increasingly, then creates additional lighter and darker palettes by manipulating the base palette colors saturation and brightness.

## Installation

#### npm

```
npm i @martinlaxenaire/color-palette-generator
```

#### yarn

```
yarn add @martinlaxenaire/color-palette-generator
```

Or use any other package manager.

## Example

### Creating colors

```javascript
import { ColorModel } from '@martinlaxenaire/color-palette-generator'

const redColor = new ColorModel('#ff0000')
const randomColor = new ColorModel()
const greenColor = new ColorModel('#3459c7')
```

### Creating palette generators

```javascript
import { ColorModel, ColorPaletteGenerator } from '@martinlaxenaire/color-palette-generator'

// create a palette generator from a random color
const palette = new ColorPaletteGenerator()

const greenColor = new ColorModel('#3459c7')

// create another palette generator from a green color
const paletteFromColor = new ColorPaletteGenerator({
  precision: 6,
  baseColor: greenColor, // we could also pass 'greenColor.hex' hexadecimal representation
})
```

### Getting random palettes

A random palette just picks colors randomly from the color palette generator.

```javascript
import { ColorModel, ColorPaletteGenerator } from '@martinlaxenaire/color-palette-generator'

const greenColor = new ColorModel('#3459c7')

// create a palette from a green color
const paletteFromColor = new ColorPaletteGenerator({
  precision: 6,
  baseColor: greenColor, // we could also pass 'greenColor.hex' hexadecimal representation
})

// get a random palette of 4 colors based on 'paletteFromColor'
const randomPaletteFromColor = paletteFromColor.getRandomPalette()
```

### Getting distributed palettes

A distributed palette picks colors based on their brightness/value.
It picks half its colors on a medium brightness range (between `37.5` and `87.5`), a quarter with low brightness (under `37.5`) and the last quarter with high brightness (over `87.5`).

```javascript
import { ColorPaletteGenerator } from '@martinlaxenaire/color-palette-generator'

// create a palette from a random color
const palette = new ColorPaletteGenerator()

// get a distributed palette of 6 colors based on 'palette'
const distributedPalette = palette.getDistributedPalette({
  length: 6,
})

// get a distributed palette based on 'palette', excluding colors too dark or too light
const anotherDistributedPalette = palette.getDistributedPalette({
  minBrightness: 10,
  maxBrightness: 90,
})
```
