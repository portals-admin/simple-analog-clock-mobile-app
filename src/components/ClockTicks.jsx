import { CENTER, FACE_RADIUS } from './ClockFace';

// Tick dimensions
const HOUR_TICK_LENGTH = 14;
const HOUR_TICK_WIDTH = 2.5;
const MINUTE_TICK_LENGTH = 6;
const MINUTE_TICK_WIDTH = 1;

// Ticks sit just inside the inner ring
const TICK_OUTER_R = FACE_RADIUS - 5; // 133

function polarToCartesian(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function ClockTicks() {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const isHour = i % 5 === 0;
    const angleDeg = i * 6; // 360 / 60

    const length = isHour ? HOUR_TICK_LENGTH : MINUTE_TICK_LENGTH;
    const outer = polarToCartesian(angleDeg, TICK_OUTER_R);
    const inner = polarToCartesian(angleDeg, TICK_OUTER_R - length);

    return { outer, inner, isHour, angleDeg };
  });

  return (
    <g className="clock-ticks">
      {ticks.map(({ outer, inner, isHour }, i) => (
        <line
          key={i}
          x1={outer.x}
          y1={outer.y}
          x2={inner.x}
          y2={inner.y}
          stroke={isHour ? '#d4c08a' : '#3a3a5c'}
          strokeWidth={isHour ? HOUR_TICK_WIDTH : MINUTE_TICK_WIDTH}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export default ClockTicks;
