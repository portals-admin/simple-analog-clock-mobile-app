import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import ClockFace from './ClockFace';
import ClockHand from './ClockHand';
import { Colors } from '../../constants/theme';
import { getClockDimensions } from '../../utils/clockUtils';
import { getClockSize } from '../../utils/responsive';
import { useClock } from '../../hooks/useClock';

interface ClockProps {
  /** Override the default responsive clock size (in logical pixels). */
  size?: number;
}

const Clock = memo(function Clock({ size }: ClockProps) {
  const clockSize = size ?? getClockSize(0.8);
  const dimensions = useMemo(() => getClockDimensions(clockSize), [clockSize]);
  const { angles } = useClock();

  const {
    hourHandLength,
    minuteHandLength,
    secondHandLength,
    hourHandWidth,
    minuteHandWidth,
    secondHandWidth,
    centerDotSize,
  } = dimensions;

  return (
    <View style={styles.wrapper}>
      {/* Static face layer — never re-renders on tick */}
      <ClockFace dimensions={dimensions} />

      {/* Dynamic hands layer */}
      <View
        style={[
          styles.handsLayer,
          { width: clockSize, height: clockSize, borderRadius: clockSize / 2 },
        ]}
      >
        <ClockHand
          angle={angles.hour}
          length={hourHandLength}
          width={hourHandWidth}
          color={Colors.hourHand}
          tailLength={hourHandLength * 0.15}
        />
        <ClockHand
          angle={angles.minute}
          length={minuteHandLength}
          width={minuteHandWidth}
          color={Colors.minuteHand}
          tailLength={minuteHandLength * 0.12}
        />
        <ClockHand
          angle={angles.second}
          length={secondHandLength}
          width={secondHandWidth}
          color={Colors.secondHand}
          tailLength={secondHandLength * 0.25}
        />

        {/* Center pivot dot */}
        <View
          style={[
            styles.centerDot,
            {
              width: centerDotSize,
              height: centerDotSize,
              borderRadius: centerDotSize / 2,
              marginLeft: -centerDotSize / 2,
              marginTop: -centerDotSize / 2,
            },
          ]}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  handsLayer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: Colors.centerDot,
    zIndex: 10,
  },
});

export default Clock;
