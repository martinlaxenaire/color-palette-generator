import { ColorPaletteGenerator } from '../dist/esm/index.mjs'

const canvas = document.getElementById('canvas')
const rect = canvas.getBoundingClientRect()

const dpr = window.devicePixelRatio || 1
canvas.width = rect.width * dpr
canvas.height = rect.height * dpr

const ctx = canvas.getContext('2d')
ctx.scale(dpr, dpr)

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, rect.width, rect.height)

const params = {
  precision: {
    precision: 4,
    min: 2,
    max: 10,
    step: 1,
  },
  baseColor: {
    baseColor: '#000000',
  },
  baseSaturation: {
    baseSaturation: 0,
    min: 0,
    max: 100,
    step: 1,
  },
  hueRange: {
    hueRange: 180,
    min: 0,
    max: 360,
    step: 1,
  },
}

const randomParams = {
  length: {
    length: 4,
    min: 3,
    max: 7,
    step: 1,
  },
  includeBaseColor: {
    includeBaseColor: false,
  },
  filterPasses: {
    filterPasses: true,
  },
  sortByBrightness: {
    sortByBrightness: true,
  },
  minBrightness: {
    minBrightness: 0,
    min: 0,
    max: 75,
    step: 1,
  },
  maxBrightness: {
    maxBrightness: 100,
    min: 25,
    max: 100,
    step: 1,
  },
  minSaturation: {
    minSaturation: 0,
    min: 0,
    max: 75,
    step: 1,
  },
  maxSaturation: {
    maxSaturation: 100,
    min: 25,
    max: 100,
    step: 1,
  },
}

const distributedParams = {
  length: {
    length: 4,
    min: 3,
    max: 7,
    step: 1,
  },
  includeBaseColor: {
    includeBaseColor: false,
  },
  sortByBrightness: {
    sortByBrightness: true,
  },
  minBrightness: {
    minBrightness: 0,
    min: 0,
    max: 75,
    step: 1,
  },
  maxBrightness: {
    maxBrightness: 100,
    min: 25,
    max: 100,
    step: 1,
  },
  minSaturation: {
    minSaturation: 0,
    min: 0,
    max: 75,
    step: 1,
  },
  maxSaturation: {
    maxSaturation: 100,
    min: 25,
    max: 100,
    step: 1,
  },
}

const postParams = {
  HSV: {
    saturation: {
      saturation: 0,
      min: -100,
      max: 100,
      step: 1,
    },
    brightness: {
      brightness: 0,
      min: -100,
      max: 100,
      step: 1,
    },
  },
  HSL: {
    saturation: {
      saturation: 0,
      min: -100,
      max: 100,
      step: 1,
    },
    lightness: {
      lightness: 0,
      min: -100,
      max: 100,
      step: 1,
    },
  },
}

const paletteGenerator = new ColorPaletteGenerator()

let outputPalette = null

const gui = new lil.GUI()

const addGUI = () => {
  const general = gui.addFolder('Base palette')
  Object.keys(params).forEach((key, index) => {
    let controller

    if (typeof params[key][key] === 'string' && params[key][key].indexOf('#') !== -1) {
      controller = general.addColor(params[key], key)
    } else {
      controller = general.add(params[key], key)
    }

    if (params[key].min !== undefined) controller.min(params[key].min)
    if (params[key].max !== undefined) controller.max(params[key].max)
    if (params[key].step !== undefined) controller.step(params[key].step)

    controller.onFinishChange((value) => {
      paletteGenerator.precision = params.precision.precision

      paletteGenerator.hueRange = params.hueRange.hueRange
      paletteGenerator.setBaseColor(params.baseColor.baseColor, params.baseSaturation.baseSaturation)

      paletteGenerator.generatePalettes()
      generateDistributedPalette()

      draw()
    })
  })

  const random = gui.addFolder('Random palette')

  Object.keys(randomParams).forEach((key, index) => {
    const controller = random.add(randomParams[key], key)

    if (randomParams[key].min !== undefined) controller.min(randomParams[key].min)
    if (randomParams[key].max !== undefined) controller.max(randomParams[key].max)
    if (randomParams[key].step !== undefined) controller.step(randomParams[key].step)

    controller.onFinishChange((value) => {
      randomParams[key][key] = value

      generateRandomPalette()
      draw()
    })
  })

  random
    .add(
      {
        generateRandom: () => {
          generateRandomPalette()
          draw()
        },
      },
      'generateRandom'
    )
    .name('Generate random')

  const distributed = gui.addFolder('Distributed palette')

  Object.keys(distributedParams).forEach((key, index) => {
    const controller = distributed.add(randomParams[key], key)

    if (distributedParams[key].min !== undefined) controller.min(distributedParams[key].min)
    if (distributedParams[key].max !== undefined) controller.max(distributedParams[key].max)
    if (distributedParams[key].step !== undefined) controller.step(distributedParams[key].step)

    controller.onFinishChange((value) => {
      distributedParams[key][key] = value

      generateDistributedPalette()
      draw()
    })
  })

  distributed
    .add(
      {
        generateDistributed: () => {
          generateDistributedPalette()
          draw()
        },
      },
      'generateDistributed'
    )
    .name('Generate distributed')

  const post = gui.addFolder('Post params')
  Object.keys(postParams).forEach((key, index) => {
    const folder = post.addFolder(key)

    Object.keys(postParams[key]).forEach((postParam) => {
      const controller = folder.add(postParams[key][postParam], postParam)

      if (postParams[key][postParam].min !== undefined) controller.min(postParams[key][postParam].min)
      if (postParams[key][postParam].max !== undefined) controller.max(postParams[key][postParam].max)
      if (postParams[key][postParam].step !== undefined) controller.step(postParams[key][postParam].step)

      controller.onFinishChange((value) => {
        draw()
      })
    })
  })
}

const generateRandomPalette = () => {
  outputPalette = paletteGenerator.getRandomPalette({
    length: randomParams.length.length,
    includeBaseColor: randomParams.includeBaseColor.includeBaseColor,
    filterPasses: randomParams.filterPasses.filterPasses,
    sortByBrightness: randomParams.sortByBrightness.sortByBrightness,
    minBrightness: randomParams.minBrightness.minBrightness,
    maxBrightness: randomParams.maxBrightness.maxBrightness,
    minSaturation: randomParams.minSaturation.minSaturation,
    maxSaturation: randomParams.maxSaturation.maxSaturation,
  })
}

const generateDistributedPalette = () => {
  outputPalette = paletteGenerator.getDistributedPalette({
    length: distributedParams.length.length,
    includeBaseColor: distributedParams.includeBaseColor.includeBaseColor,
    sortByBrightness: distributedParams.sortByBrightness.sortByBrightness,
    minBrightness: distributedParams.minBrightness.minBrightness,
    maxBrightness: distributedParams.maxBrightness.maxBrightness,
    minSaturation: distributedParams.minSaturation.minSaturation,
    maxSaturation: distributedParams.maxSaturation.maxSaturation,
  })
}

const draw = () => {
  const paletteSize = 0.2

  for (let i = 0; i < paletteGenerator.lightPalette.length; i++) {
    ctx.fillStyle = paletteGenerator.lightPalette[i].hex
    ctx.fillRect(
      (i * rect.width * paletteSize) / paletteGenerator.lightPalette.length,
      0,
      (rect.width * paletteSize) / paletteGenerator.lightPalette.length,
      (rect.height * paletteSize) / 3
    )
  }

  for (let i = 0; i < paletteGenerator.basePalette.length; i++) {
    ctx.fillStyle = paletteGenerator.basePalette[i].hex
    ctx.fillRect(
      (i * rect.width * paletteSize) / paletteGenerator.basePalette.length,
      (rect.height * paletteSize) / 3,
      (rect.width * paletteSize) / paletteGenerator.basePalette.length,
      (rect.height * paletteSize) / 3
    )
  }

  for (let i = 0; i < paletteGenerator.darkPalette.length; i++) {
    ctx.fillStyle = paletteGenerator.darkPalette[i].hex
    ctx.fillRect(
      (i * rect.width * paletteSize) / paletteGenerator.darkPalette.length,
      (rect.height * paletteSize * 2) / 3,
      (rect.width * paletteSize) / paletteGenerator.darkPalette.length,
      (rect.height * paletteSize) / 3
    )
  }

  if (outputPalette) {
    for (let i = 0; i < outputPalette.length; i++) {
      const color = outputPalette[i].clone()

      color
        .saturateHsv(postParams.HSV.saturation.saturation)
        .brighten(postParams.HSV.brightness.brightness)
        .saturateHsl(postParams.HSL.saturation.saturation)
        .lighten(postParams.HSL.lightness.lightness)

      ctx.fillStyle = color.hex
      ctx.fillRect(
        (i * rect.width) / outputPalette.length,
        rect.height / 2,
        rect.width / outputPalette.length,
        rect.height / 2
      )
    }
  }
}

addGUI()

gui.folders[0].controllers[1].setValue(paletteGenerator.baseColor.hex)

generateDistributedPalette()

draw()
