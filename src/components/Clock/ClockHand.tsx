import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Shadows } from '../../constants/theme';

interface ClockHandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  /** Extend the hand behind the center pivot for a balanced look. */
  tailLength?: number;
}

/**
 * A single clock hand rendered as a View.
 *
 * Layout trick: the hand View is positioned so its bottom edge sits at the
 * clock center. We then shift the transform origin to the bottom by applying
 * translateY(+length/2) → rotate → translateY(-length/2), which makes the
 * hand rotate around its bottom pivot point (the clock center).
 */
const ClockHand = memo(function ClockHand({
  angle,
  length,
  width,
  color,
  tailLength = 0,
}: ClockHandProps) {
  const totalLength = length + tailLength;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height: totalLength,
          marginLeft: -width / 2,
          // bottom of hand at clock center; tail extends below
          marginTop: -(length),
          transform: [
            // Shift pivot to bottom of the main hand (clock center)
            { translateY: length / 2 },
            { rotate: `${angle}deg` },
            { translateY: -(length / 2) },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.hand,
          {
            flex: 1,
            backgroundColor: color,
            borderRadius: width / 2,
            ...Shadows.hand,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
  },
  hand: {
    width: '100%',
  },
});

export default ClockHand;
