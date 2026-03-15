import { CENTER, FACE_RADIUS } from './ClockFace';
import './ClockNumbers.css';

// Numbers sit inward from the hour ticks
const NUMBER_RADIUS = FACE_RADIUS - 28; // 110

function polarToCartesian(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function ClockNumbers() {
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angleDeg = num * 30; // 360 / 12
    const { x, y } = polarToCartesian(angleDeg, NUMBER_RADIUS);
    return { num, x, y };
  });

  return (
    <g className="clock-numbers" filter="url(#subtleGlow)">
      {numbers.map(({ num, x, y }) => (
        <text
          key={num}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          className="clock-number"
        >
          {num}
        </text>
      ))}
    </g>
  );
}

export default ClockNumbers;
