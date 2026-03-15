export interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface HandAngles {
  hour: number;
  minute: number;
  second: number;
}

export interface ClockDimensions {
  clockSize: number;
  hourHandLength: number;
  minuteHandLength: number;
  secondHandLength: number;
  hourHandWidth: number;
  minuteHandWidth: number;
  secondHandWidth: number;
  centerDotSize: number;
  tickLength: {
    hour: number;
    minute: number;
  };
}
