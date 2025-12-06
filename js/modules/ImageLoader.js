export class ImageLoader {
    constructor(fileInput, onImageLoaded) {
        this.fileInput = fileInput
        this.onImageLoaded = onImageLoaded
        this.bindEvents()
    }

    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.loadFile(e))
    }

    loadFile(e) {
        const file = e.target.files[0]
        if (!file || !file.type.startsWith("image/")) {
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                if (this.onImageLoaded) {
                    this.onImageLoaded(img)
                }
            }
            img.src = event.target.result
        }
        reader.readAsDataURL(file)
    }
}
