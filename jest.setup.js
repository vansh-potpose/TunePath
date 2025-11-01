import '@testing-library/jest-dom';

// Polyfill IntersectionObserver
class MockIntersectionObserver {
  constructor() {}
  observe() { }
  unobserve() { }
  disconnect() { }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Polyfill RAF/CANCEL RAF if missing
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

// Relaxed HTMLMediaElement methods for tests
// eslint-disable-next-line no-undef
if (typeof jest !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn(),
  });
}
