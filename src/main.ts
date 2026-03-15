import './style.css';
import { AnalogClock } from './clock';

const canvas = document.getElementById('clock') as HTMLCanvasElement | null;
const digitalDisplay = document.getElementById('digital-time') as HTMLElement | null;

if (!canvas) throw new Error('Canvas element #clock not found');

const clock = new AnalogClock(
  canvas,
  undefined, // use default theme
  (timeStr) => {
    if (digitalDisplay) digitalDisplay.textContent = timeStr;
  },
);

// Size the canvas to its CSS display box on first load and on every resize.
clock.resize();

const resizeObserver = new ResizeObserver(() => {
  clock.resize();
});
resizeObserver.observe(canvas);

// Pause the RAF loop while the tab is not visible to save battery.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop();
  } else {
    clock.start();
  }
});

clock.start();
