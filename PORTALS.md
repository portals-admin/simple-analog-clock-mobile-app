# PORTALS.md — Project Context

## Project
Simple Analog Clock — a minimalist React Native (Expo) mobile app displaying a real-time analog clock.

## Stack
- Expo SDK ~52.0.0
- React Native 0.76.5
- TypeScript (strict mode)
- No third-party UI libraries (pure RN View-based rendering)

## Architecture

### Entry point
- `App.tsx` — full-screen dark background + `<Clock />`

### Source layout
```
src/
├── components/
│   └── Clock/
│       ├── index.tsx       # Composed clock: face + hands + center dot
│       ├── ClockFace.tsx   # Static layer: bezel, tick marks, numbers (never re-renders on tick)
│       └── ClockHand.tsx   # Single animated hand (memo'd)
├── constants/
│   └── theme.ts            # Color palette + shadow presets
├── hooks/
│   └── useClock.ts         # Tick-aligned 1s interval → HandAngles
├── types/
│   └── index.ts            # ClockTime, HandAngles, ClockDimensions
└── utils/
    ├── clockUtils.ts       # getClockTime, getHandAngles, getClockDimensions
    └── responsive.ts       # scale, normalize, getClockSize (Dimensions-based)
```

## Key Design Decisions
- **Static/dynamic split**: `ClockFace` is memo'd and never re-renders on tick. Only `ClockHand` components re-render.
- **Responsive sizing**: Clock occupies 80% of `min(screenWidth, screenHeight)` so it fits on any device.
- **Hand pivot trick**: `translateY(+L/2) → rotate → translateY(-L/2)` rotates a View around its bottom edge without needing `transformOrigin`.
- **Tick alignment**: `useClock` aligns the first tick to the start of the next second to avoid drift.
- **Path alias**: `@/` maps to `src/` via both `tsconfig.json` (paths) and `babel-plugin-module-resolver`.
