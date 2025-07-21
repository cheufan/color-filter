let imageData
let adjustExposureValue = 1
let invertImg = false

let yellowFilterValue = 0
let magentaFilterValue = 0
let cyanFilterValue = 0

function compute() {
  if (invertImg) {
    invert()
  }
  filter()
  adjustExposure()

  return imageData
}

function setImageData(data) {
  imageData = data
}

function setFiltersValues(yellow, magenta, cyan) {
  yellowFilterValue = agrandisseurValueTo255(yellow)
  magentaFilterValue = agrandisseurValueTo255(magenta)
  cyanFilterValue = agrandisseurValueTo255(cyan)
}

function setAdjustExposureValue(value) {
  adjustExposureValue = value
}

function setInvertImg(value) {
  invertImg = value
}

/**
 * 
 * @returns {Uint8ClampedArray} 
 */
function invert() {
    for (var i = 0; i < imageData.length; i += 4) {
      imageData[i] = 255 - imageData[i];
      imageData[i + 1] = 255 - imageData[i + 1];
      imageData[i + 2] = 255 - imageData[i + 2];
    }
}

function filter() {
    for (var i = 0; i < imageData.length; i += 4) {
      let newBleu = imageData[i + 2] - yellowFilterValue
      imageData[i + 2] = newBleu < 0 ? 0 : newBleu

      let newVert = imageData[i + 1] - magentaFilterValue
      imageData[i + 1] = newVert < 0 ? 0 : newVert

      let newRouge = imageData[i] - cyanFilterValue
      imageData[i] = newRouge < 0 ? 0 : newRouge
    }
}

function oldFilter() {
    //drawMir()
    drawNegative()
    invert()
    const yellowFilterValue = agrandisseurValueTo255(yellowFilter.value)
    const magentaFilterValue = agrandisseurValueTo255(magentaFilter.value)
    const cyanFilterValue = agrandisseurValueTo255(cyanFilter.value)
    console.debug(yellowFilter.value, magentaFilter.value, cyanFilter.value)

    const imgData = ctx.getImageData(0, 0, workingImg.width, workingImg.height)
    const data = imgData.data
    for (var i = 0; i < data.length; i += 4) {
      let newBleu = data[i + 2] - yellowFilterValue
      data[i + 2] = newBleu < 0 ? 0 : newBleu

      let newVert = data[i + 1] - magentaFilterValue
      data[i + 1] = newVert < 0 ? 0 : newVert

      let newRouge = data[i] - cyanFilterValue
      data[i] = newRouge < 0 ? 0 : newRouge
    }
    ctx.putImageData(imgData, 0, 0);
    reExpose(exposureAdjuster.value)
}

/**
 * 
 * @returns {Uint8ClampedArray}
 */
function adjustExposure() {
    for (var i = 0; i < imageData.length; i += 4) {
      imageData[i] *= adjustExposureValue
      imageData[i+1] *= adjustExposureValue
      imageData[i+2] *= adjustExposureValue
    }    
}

function agrandisseurValueTo255(agrandisseurValue) {
  return Math.round(agrandisseurValue / 130 * 255)
}

export {setImageData, setInvertImg, setFiltersValues, setAdjustExposureValue, compute}