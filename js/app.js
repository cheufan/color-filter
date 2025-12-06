import * as compute from './modules/compute.js'
import { ImageSlider } from './modules/ImageSlider.js'
import { ImageLoader } from './modules/ImageLoader.js'
import { UIManager } from './modules/UIManager.js'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('js/service-worker.js')
}

// DOM Elements
const container = document.getElementById('container')
const imgContainer = document.getElementById('img-container')
const originImg = document.getElementById('origin-img')
const originImgCtx = originImg.getContext('2d')
const workingImg = document.getElementById('working-img')
const workingImgCtx = workingImg.getContext('2d')
const sliderHandle = document.getElementById('slider-handle')
const orientationToggle = document.getElementById('orientation-toggle')

// UI Elements
const uiElements = {
  invertCheckbox: document.getElementById('invert-checkbox'),
  yellowFilter: document.getElementById('yellow-filter'),
  magentaFilter: document.getElementById('magenta-filter'),
  cyanFilter: document.getElementById('cyan-filter'),
  exposureAdjuster: document.getElementById('exposition'),
  controlsContainer: document.querySelectorAll('.img-controls-container')
}

// Modules Initialization
const slider = new ImageSlider(imgContainer, sliderHandle, originImg, orientationToggle)

const uiManager = new UIManager(uiElements, () => {
  updateVisuals()
})

const imageLoader = new ImageLoader(document.getElementById('img-selector'), (img) => {
  onImageLoaded(img)
})

// Set max values for filters
uiManager.setFilterMaxValues(compute.maxFiltersValue)

function onImageLoaded(img) {
  originImg.width = container.offsetWidth
  originImg.height = container.offsetWidth * img.height / img.width
  originImgCtx.drawImage(img, 0, 0, originImg.width, originImg.height)

  // Resize container to match image
  imgContainer.style.width = originImg.width + 'px'
  imgContainer.style.height = originImg.height + 'px'

  slider.reset()
  updateVisuals()
  uiManager.showControls()
}

function updateVisuals() {
  updateInvertClass()
  updateWorkingImg()
}

function updateInvertClass() {
  const { invert } = uiManager.filterValues
  if (invert) {
    originImg.classList.add('inverted')
  } else {
    originImg.classList.remove('inverted')
  }
}

function updateWorkingImg() {
  // Resize working canvas to match origin
  workingImg.width = originImg.width
  workingImg.height = originImg.height
  workingImgCtx.drawImage(originImg, 0, 0)

  const imgData = workingImgCtx.getImageData(0, 0, workingImg.width, workingImg.height)
  const values = uiManager.filterValues

  compute.setImageData(imgData.data)
  compute.setInvertImg(values.invert)
  compute.setFiltersValues(values.yellow, values.magenta, values.cyan)
  compute.setAdjustExposureValue(values.exposure)
  compute.compute()

  workingImgCtx.putImageData(imgData, 0, 0)
}