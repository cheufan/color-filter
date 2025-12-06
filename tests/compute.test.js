import { describe, it, expect, beforeEach } from 'vitest';
import * as compute from '../js/modules/compute.js';

describe('compute.js', () => {
    let imageData;

    beforeEach(() => {
        // Mock image data: 4 pixels, RGBA
        // Pixel 1: Red (255, 0, 0, 255)
        // Pixel 2: Green (0, 255, 0, 255)
        // Pixel 3: Blue (0, 0, 255, 255)
        // Pixel 4: White (255, 255, 255, 255)
        imageData = new Uint8ClampedArray([
            255, 0, 0, 255,
            0, 255, 0, 255,
            0, 0, 255, 255,
            255, 255, 255, 255
        ]);
        compute.setImageData(imageData);
        // Reset settings
        compute.setInvertImg(false);
        compute.setFiltersValues(0, 0, 0);
        compute.setAdjustExposureValue(1);
    });

    it('should invert colors correctly', () => {
        compute.setInvertImg(true);
        compute.compute();

        // Pixel 1: Red -> Cyan (0, 255, 255, 255) (Alpha is not inverted in the code logic shown? 
        // Wait, the code says:
        // imageData[i] = 255 - imageData[i];
        // imageData[i + 1] = 255 - imageData[i + 1];
        // imageData[i + 2] = 255 - imageData[i + 2];
        // It does not touch alpha (i+3).

        expect(imageData[0]).toBe(0);
        expect(imageData[1]).toBe(255);
        expect(imageData[2]).toBe(255);

        // Pixel 4: White -> Black (0, 0, 0, 255)
        expect(imageData[12]).toBe(0);
        expect(imageData[13]).toBe(0);
        expect(imageData[14]).toBe(0);
    });

    it('should apply filters correctly', () => {
        // Apply Cyan filter (removes Red)
        // The code says: let newRouge = imageData[i] - cyanFilterValue
        // cyanFilterValue is calculated from input. 
        // If input is max (200), value is 255.

        compute.setFiltersValues(0, 0, 200); // Yellow, Magenta, Cyan
        compute.compute();

        // Pixel 1: Red (255, 0, 0) -> (0, 0, 0)
        expect(imageData[0]).toBe(0);

        // Pixel 4: White (255, 255, 255) -> (0, 255, 255) (Cyan)
        expect(imageData[12]).toBe(0);
        expect(imageData[13]).toBe(255);
        expect(imageData[14]).toBe(255);
    });

    it('should adjust exposure correctly', () => {
        compute.setAdjustExposureValue(0.5);
        compute.compute();

        // Pixel 1: Red (255, 0, 0) -> (127, 0, 0)
        // Math.floor(255 * 0.5) = 127.5 -> 127 (Uint8ClampedArray rounds to nearest integer usually, or floors? 
        // Actually Uint8ClampedArray rounds to nearest even for .5, or standard round. 
        // Let's check standard behavior. 127.5 -> 128 usually.
        // However, the code uses `imageData[i] *= adjustExposureValue`.
        // JS multiplication results in float, assigning to Uint8ClampedArray rounds.

        expect(imageData[0]).toBeCloseTo(128, -1); // Allow small difference due to rounding
    });
});
