import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../js/modules/tools.js';

describe('tools.js', () => {
    it('should debounce function calls', () => {
        vi.useFakeTimers();
        const func = vi.fn();
        const debouncedFunc = debounce(func, 100);

        debouncedFunc();
        debouncedFunc();
        debouncedFunc();

        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
    });
});
