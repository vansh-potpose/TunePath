import { debounce } from '@/lib/performance';

jest.useFakeTimers();

describe('performance utilities', () => {
  test('debounce calls function once after wait', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);

    // Rapid calls
    debounced('a');
    debounced('b');
    debounced('c');

    // Not yet called
    expect(fn).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(199);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });
});
