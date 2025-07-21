import * as compute from "/compute.js"

const imgSelector = document.getElementById('img-selector')
const originImg = document.getElementById('origin-img')
const workingImg = document.getElementById('working-img')
const workingImgCtx = workingImg.getContext('2d')

const invertCheckbox = document.getElementById('invert-checkbox')
const yellowFilter = document.getElementById('yellow-filter')
const magentaFilter = document.getElementById('magenta-filter')
const cyanFilter = document.getElementById('cyan-filter')
const exposureAdjuster = document.getElementById('exposition')


imgSelector.onchange = loadOriginImg
originImg.addEventListener('load', createWorkingImgFromOriginImg)
originImg.addEventListener('load', showControls)
invertCheckbox.addEventListener('click', invertOriginImg)
invertCheckbox.addEventListener('click', adjustWorkingImg)
document.querySelectorAll('.img-control').forEach((elt) => elt.addEventListener('change', adjustWorkingImg ))


function loadOriginImg() {
  const file = this.files[0]
  if (!file.type.startsWith("image/")) {
    return
  }
  
  originImg.file = file
  const reader = new FileReader()
  reader.onload = (e) => {
    originImg.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function createWorkingImgFromOriginImg() {
  const newImg = new Image()
  newImg.src = originImg.src
  workingImg.width = originImg.width
  workingImg.height = originImg.height
  workingImgCtx.drawImage(newImg, 0, 0, originImg.width, originImg.height)
}

function showControls()
{
  document.querySelectorAll('.img-controls-container').forEach((elt) => elt.style.display = 'block')
}

function invertOriginImg() {
  // Inversion de l'image d'origine via du CSS
  if (invertCheckbox.checked) {
    originImg.classList.add('inverted')
    return
  }

  originImg.classList.remove('inverted')
}

function adjustWorkingImg() {
  const imgData = getCleanedWorkingImageData()
  compute.setInvertImg(invertCheckbox.checked)
  compute.setImageData(imgData.data)
  compute.setInvertImg(invertCheckbox.checked)
  compute.setFiltersValues(yellowFilter.value, magentaFilter.value, cyanFilter.value)
  compute.setAdjustExposureValue(exposureAdjuster.value)
  compute.compute()
  putWorkingImageData(imgData)
}

function getCleanedWorkingImageData() {
  createWorkingImgFromOriginImg()
  return workingImgCtx.getImageData(0, 0, workingImg.width, workingImg.height)
}

/**
 * @param {Uint8ClampedArray} 
 */
function putWorkingImageData(imgData) {
  workingImgCtx.putImageData(imgData, 0, 0);
}