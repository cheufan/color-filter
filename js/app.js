import * as compute from './modules/compute.js'
import * as tools from './modules/tools.js'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('js/service-worker.js')
}

const container = document.getElementById('container')

const imgSelector = document.getElementById('img-selector')
const originImg = document.getElementById('origin-img')
const originImgCtx = originImg.getContext('2d')
const workingImg = document.getElementById('working-img')
const workingImgCtx = workingImg.getContext('2d')

const invertCheckbox = document.getElementById('invert-checkbox')
const yellowFilter = document.getElementById('yellow-filter')
const magentaFilter = document.getElementById('magenta-filter')
const cyanFilter = document.getElementById('cyan-filter')
const exposureAdjuster = document.getElementById('exposition')


imgSelector.addEventListener('change', loadOriginImg)
invertCheckbox.addEventListener('click', invertOriginImg)
document.getElementById('invert-checkbox').addEventListener('change', updateWorkingImg)
document.querySelectorAll('input[type=range]').forEach((elt) => elt.addEventListener('input', tools.debounce(updateWorkingImg)))

function loadOriginImg() {
  const file = this.files[0]
  if (!file.type.startsWith("image/")) {
    return
  }
  const temporaryImg = new Image()
  temporaryImg.file = file
  const reader = new FileReader()
  reader.onload = (e) => {
    temporaryImg.src = e.target.result
    temporaryImg.onload = (e) => {
      originImg.width = container.offsetWidth
      originImg.height = container.offsetWidth *  e.target.height / e.target.width
      originImgCtx.drawImage(temporaryImg, 0, 0, originImg.width, originImg.height)
      updateWorkingImg()
      invertOriginImg()
      showControls()
    }
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
  workingImg.width = originImg.width
  workingImg.height = originImg.height
  workingImgCtx.drawImage(originImg, 0, 0)
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

document.querySelectorAll('.filter').forEach((elt) => elt.max = compute.maxFiltersValue)