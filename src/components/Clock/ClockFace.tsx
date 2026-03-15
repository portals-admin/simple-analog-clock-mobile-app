import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import { normalize } from '../../utils/responsive';
import type { ClockDimensions } from '../../types';

interface ClockFaceProps {
  dimensions: ClockDimensions;
}

const HOUR_LABELS = ['12', '3', '6', '9'] as const;

/**
 * The static clock face: bezel, tick marks, and cardinal hour numbers.
 * Separated from the animated hands so React can skip re-rendering it on
 * every tick — only the hands layer re-renders each second.
 */
const ClockFace = memo(function ClockFace({ dimensions }: ClockFaceProps) {
  const { clockSize, tickLength } = dimensions;
  const radius = clockSize / 2;

  return (
    <View
      style={[
        styles.face,
        {
          width: clockSize,
          height: clockSize,
          borderRadius: radius,
          ...Shadows.clock,
        },
      ]}
    >
      {/* Tick marks */}
      {Array.from({ length: 60 }, (_, i) => {
        const isHour = i % 5 === 0;
        const tickLen = isHour ? tickLength.hour : tickLength.minute;
        const angle = i * 6; // 360 / 60

        return (
          <View
            key={i}
            style={[
              styles.tickContainer,
              {
                width: 2,
                height: radius,
                marginLeft: -1,
                transform: [
                  { translateY: -radius },
                  { rotate: `${angle}deg` },
                  { translateY: radius },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.tick,
                {
                  height: tickLen,
                  backgroundColor: isHour ? Colors.tickHour : Colors.tickMinute,
                  width: isHour ? 2 : 1,
                },
              ]}
            />
          </View>
        );
      })}

      {/* Cardinal hour numbers */}
      {HOUR_LABELS.map((label, i) => {
        const angle = i * 90; // 0, 90, 180, 270
        const rad = (angle - 90) * (Math.PI / 180);
        const numberRadius = radius * 0.72;
        const x = radius + numberRadius * Math.cos(rad);
        const y = radius + numberRadius * Math.sin(rad);
        const fontSize = normalize(clockSize * 0.055);

        return (
          <Text
            key={label}
            style={[
              styles.number,
              {
                fontSize,
                left: x - fontSize,
                top: y - fontSize / 1.5,
                width: fontSize * 2,
                lineHeight: fontSize * 1.5,
              },
            ]}
          >
            {label}
          </Text>
        );
      })}

      {/* Inner bezel ring */}
      <View
        style={[
          styles.innerBezel,
          {
            width: clockSize * 0.94,
            height: clockSize * 0.94,
            borderRadius: clockSize * 0.47,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  face: {
    backgroundColor: Colors.clockFace,
    borderWidth: 2,
    borderColor: Colors.clockBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tickContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tick: {
    borderRadius: 1,
  },
  number: {
    position: 'absolute',
    color: Colors.numbers,
    fontWeight: '300',
    textAlign: 'center',
  },
  innerBezel: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
});

export default ClockFace;
