export class ImageSlider {
    constructor(imgContainer, sliderHandle, originImg, orientationToggle) {
        this.imgContainer = imgContainer
        this.sliderHandle = sliderHandle
        this.originImg = originImg
        this.orientationToggle = orientationToggle
        this.isDragging = false
        this.isHorizontal = false
        this.isSliderVisible = false

        this.bindEvents()
    }

    bindEvents() {
        this.sliderHandle.addEventListener('mousedown', (e) => this.startDrag(e))
        this.sliderHandle.addEventListener('touchstart', (e) => this.startDrag(e))

        document.addEventListener('mouseup', (e) => this.stopDrag(e))
        document.addEventListener('touchend', (e) => this.stopDrag(e))

        document.addEventListener('mousemove', (e) => this.drag(e))
        document.addEventListener('touchmove', (e) => this.drag(e))

        this.imgContainer.addEventListener('click', (e) => this.toggleSliderVisibility(e))
        this.orientationToggle.addEventListener('click', (e) => this.toggleOrientation(e))
    }

    startDrag(e) {
        this.isDragging = true
        e.preventDefault()
    }

    stopDrag(e) {
        this.isDragging = false
    }

    toggleSliderVisibility(e) {
        if (this.isDragging) return
        if (e.target === this.sliderHandle || this.sliderHandle.contains(e.target)) return

        this.isSliderVisible = !this.isSliderVisible
        if (this.isSliderVisible) {
            this.imgContainer.classList.remove('hidden')
        } else {
            this.imgContainer.classList.add('hidden')
        }
    }

    toggleOrientation(e) {
        e.stopPropagation()
        this.isHorizontal = !this.isHorizontal

        if (this.isHorizontal) {
            this.imgContainer.classList.add('horizontal')
            this.originImg.style.clipPath = `inset(0 0 50% 0)`
            this.sliderHandle.style.left = '0'
            this.sliderHandle.style.right = '0'
            this.sliderHandle.style.top = '50%'
            this.sliderHandle.style.transform = 'translateY(-50%)'
            this.sliderHandle.style.width = '100%'
            this.sliderHandle.style.height = '2px'
        } else {
            this.imgContainer.classList.remove('horizontal')
            this.originImg.style.clipPath = `inset(0 50% 0 0)`
            this.sliderHandle.style.top = '0'
            this.sliderHandle.style.bottom = '0'
            this.sliderHandle.style.left = '50%'
            this.sliderHandle.style.transform = 'translateX(-50%)'
            this.sliderHandle.style.width = '2px'
            this.sliderHandle.style.height = '100%'
        }
    }

    drag(e) {
        if (!this.isDragging || !this.isSliderVisible) return

        const rect = this.imgContainer.getBoundingClientRect()

        if (this.isHorizontal) {
            let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
            let y = clientY - rect.top
            if (y < 0) y = 0
            if (y > rect.height) y = rect.height

            const percentage = (y / rect.height) * 100
            this.originImg.style.clipPath = `inset(0 0 ${100 - percentage}% 0)`
            this.sliderHandle.style.top = percentage + '%'
        } else {
            let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
            let x = clientX - rect.left
            if (x < 0) x = 0
            if (x > rect.width) x = rect.width

            const percentage = (x / rect.width) * 100
            this.originImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`
            this.sliderHandle.style.left = percentage + '%'
        }
    }

    reset() {
        this.isSliderVisible = false
        this.imgContainer.classList.add('hidden')
    }
}
