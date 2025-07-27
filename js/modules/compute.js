const maxFiltersValue = 200

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

/**
 * 
 * @param {Uint8ClampedArray} data 
 */
function setImageData(data) {
  imageData = data
}

/**
 * 
 * @param {int} yellow 
 * @param {int} magenta 
 * @param {int} cyan 
 */
function setFiltersValues(yellow, magenta, cyan) {
  yellowFilterValue = agrandisseurValueTo255(yellow)
  magentaFilterValue = agrandisseurValueTo255(magenta)
  cyanFilterValue = agrandisseurValueTo255(cyan)
}

function setAdjustExposureValue(value) {
  adjustExposureValue = value
}

/**
 * 
 * @param {boolean} value 
 */
function setInvertImg(value) {
  invertImg = value
}

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

function adjustExposure() {
    for (var i = 0; i < imageData.length; i += 4) {
      imageData[i] *= adjustExposureValue
      imageData[i+1] *= adjustExposureValue
      imageData[i+2] *= adjustExposureValue
    }    
}

/**
 * 
 * @param {int} agrandisseurValue 
 * @returns {int}
 */
function agrandisseurValueTo255(agrandisseurValue) {
  return Math.round(agrandisseurValue / maxFiltersValue * 255)
}

export {setImageData, setInvertImg, setFiltersValues, setAdjustExposureValue, compute}