import * as compute from './modules/compute.js'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('js/service-worker.js')
}

const imgSelector = document.getElementById('img-selector')
const originImg = document.getElementById('origin-img')
const workingImg = document.getElementById('working-img')
const workingImgCtx = workingImg.getContext('2d')

const invertCheckbox = document.getElementById('invert-checkbox')
const yellowFilter = document.getElementById('yellow-filter')
const magentaFilter = document.getElementById('magenta-filter')
const cyanFilter = document.getElementById('cyan-filter')
const exposureAdjuster = document.getElementById('exposition')


imgSelector.addEventListener('change', loadOriginImg)
originImg.addEventListener('load', invertOriginImg)
originImg.addEventListener('load', updateWorkingImg)
invertCheckbox.addEventListener('click', invertOriginImg)
originImg.addEventListener('load', showControls)
document.querySelectorAll('.img-control').forEach((elt) => elt.addEventListener('input', updateWorkingImg))

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

function showControls()
{
  document.querySelectorAll('.img-controls-container').forEach((elt) => elt.style.display = 'block')
}

function invertOriginImg() {
  if (invertCheckbox.checked) {
    originImg.classList.add('inverted')
    return
  }

  originImg.classList.remove('inverted')
}

function updateWorkingImg() {
  createWorkingImg()
  computeWorkingImg()
}

function createWorkingImg() {
  const newImg = new Image()
  newImg.src = originImg.src
  workingImg.width = originImg.width
  workingImg.height = originImg.height
  workingImgCtx.drawImage(newImg, 0, 0, originImg.width, originImg.height)
}

function computeWorkingImg() {
  const imgData = workingImgCtx.getImageData(0, 0, workingImg.width, workingImg.height)
  compute.setImageData(imgData.data)
  compute.setInvertImg(invertCheckbox.checked)
  compute.setFiltersValues(yellowFilter.value, magentaFilter.value, cyanFilter.value)
  compute.setAdjustExposureValue(exposureAdjuster.value)
  compute.compute()
  workingImgCtx.putImageData(imgData, 0, 0)
}
