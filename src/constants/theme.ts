export const Colors = {
  background: '#0D0D0D',
  clockFace: '#1A1A1A',
  clockBorder: '#2E2E2E',
  hourHand: '#E8E8E8',
  minuteHand: '#C0C0C0',
  secondHand: '#FF3B30',
  centerDot: '#FF3B30',
  tickHour: '#FFFFFF',
  tickMinute: '#555555',
  numbers: '#AAAAAA',
} as const;

export const Shadows = {
  clock: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  hand: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
} as const;
