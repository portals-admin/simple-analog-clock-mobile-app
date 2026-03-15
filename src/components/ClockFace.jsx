import ClockNumbers from './ClockNumbers';
import ClockTicks from './ClockTicks';
import './ClockFace.css';

// SVG coordinate system
export const CLOCK_SIZE = 300;
export const CENTER = CLOCK_SIZE / 2; // 150

// Radii
export const BEZEL_RADIUS = 145;
export const FACE_RADIUS = 138;
export const INNER_RING_RADIUS = 133;

function ClockFace({ children }) {
  return (
    <div className="clock-wrapper" role="img" aria-label="Analog clock">
      <div className="clock-outer-ring">
        <svg
          viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
          className="clock-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer decorative bezel gradient */}
          <defs>
            <radialGradient id="faceGradient" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#23234a" />
              <stop offset="100%" stopColor="#0f0f1e" />
            </radialGradient>

            <radialGradient id="bezelGradient" cx="30%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#e8d090" />
              <stop offset="45%" stopColor="#c9a84c" />
              <stop offset="100%" stopColor="#6b5420" />
            </radialGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outermost bezel ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={BEZEL_RADIUS}
            fill="url(#bezelGradient)"
            className="clock-bezel"
          />

          {/* Clock face background */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={FACE_RADIUS}
            fill="url(#faceGradient)"
            className="clock-face-bg"
          />

          {/* Subtle inner ring accent */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RING_RADIUS}
            fill="none"
            stroke="#2e2e55"
            strokeWidth="1"
          />

          {/* Tick marks */}
          <ClockTicks />

          {/* Hour numbers */}
          <ClockNumbers />

          {/* Hands slot — children render on top */}
          {children}

          {/* Center pivot cap */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={6}
            fill="url(#bezelGradient)"
            filter="url(#subtleGlow)"
            className="clock-center-cap"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={2.5}
            fill="#0f0f1e"
          />
        </svg>
      </div>
    </div>
  );
}

export default ClockFace;
