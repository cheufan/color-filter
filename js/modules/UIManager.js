import * as tools from './tools.js'

export class UIManager {
    constructor(elements, onUpdate) {
        this.invertCheckbox = elements.invertCheckbox
        this.yellowFilter = elements.yellowFilter
        this.magentaFilter = elements.magentaFilter
        this.cyanFilter = elements.cyanFilter
        this.exposureAdjuster = elements.exposureAdjuster
        this.controlsContainer = elements.controlsContainer

        this.onUpdate = onUpdate

        this.bindEvents()
    }

    bindEvents() {
        this.invertCheckbox.addEventListener('change', () => this.onUpdate())
        this.invertCheckbox.addEventListener('click', () => this.onUpdate()) // Handle click specifically if needed, but change should cover it. 
        // app.js had: invertCheckbox.addEventListener('click', invertOriginImg) AND document.getElementById('invert-checkbox').addEventListener('change', updateWorkingImg)
        // invertOriginImg toggles class 'inverted' on originImg.
        // updateWorkingImg re-computes.

        // We need to handle both.
        // Let's assume onUpdate handles everything for now, or we separate them.
        // The original code had separate listeners.

        const inputs = [this.yellowFilter, this.magentaFilter, this.cyanFilter, this.exposureAdjuster]
        inputs.forEach(input => {
            input.addEventListener('input', tools.debounce(() => this.onUpdate()))
        })
    }

    get filterValues() {
        return {
            yellow: this.yellowFilter.value,
            magenta: this.magentaFilter.value,
            cyan: this.cyanFilter.value,
            exposure: this.exposureAdjuster.value,
            invert: this.invertCheckbox.checked
        }
    }

    showControls() {
        this.controlsContainer.forEach(elt => elt.style.display = 'block')
    }

    setFilterMaxValues(max) {
        [this.yellowFilter, this.magentaFilter, this.cyanFilter].forEach(elt => elt.max = max)
    }
}
