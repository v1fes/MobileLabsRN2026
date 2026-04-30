import React, { useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

const { width: SW } = Dimensions.get('window');
const CLICKER_SIZE = SW * 0.36;

// ─── Styled Components ─────────────────────────────────────────────────────

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.bg};
`;

const ScoreSection = styled.View`
  align-items: center;
  padding-top: 20px;
  padding-bottom: 4px;
`;

const ScoreLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const ScoreValue = styled.Text`
  font-size: 60px;
  font-weight: 900;
  color: ${({ theme }) => theme.accent};
  margin-top: -4px;
`;

const ClickerArea = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ClickerLabel = styled.Text`
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 2px;
  margin-top: 6px;
`;

const RulesCard = styled.View`
  margin: 0 16px 16px;
  padding: 14px 16px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cardBorder};
`;

const RulesTitle = styled.Text`
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
`;

const RuleRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
`;

const RuleIconWrap = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background-color: ${({ $bg }) => $bg || 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const RuleLabel = styled.Text`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const RulePoints = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

// ─── Rules data ─────────────────────────────────────────────────────────────

const RULES = [
  { icon: 'finger-print-outline', label: 'Натискання', pts: '+1', c: '#0091EA' },
  { icon: 'copy-outline', label: 'Подвійне натискання', pts: '+2', c: '#7C4DFF' },
  { icon: 'hourglass-outline', label: 'Утримання (3 с)', pts: '+5', c: '#FF6D00' },
  { icon: 'swap-horizontal-outline', label: 'Свайп', pts: '+1~10', c: '#00BFA5' },
  { icon: 'resize-outline', label: 'Масштабування', pts: '+3', c: '#FF4081' },
  { icon: 'move-outline', label: 'Перетягування', pts: '—', c: '#8D6E63' },
];

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const theme = useTheme();

  // Shared values for clicker animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pinchScale = useSharedValue(1);
  const tapScale = useSharedValue(1);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);

  // ── JS callbacks (called from worklets via runOnJS) ──

  const onTap = useCallback(() => dispatch({ type: 'TAP' }), [dispatch]);
  const onDoubleTap = useCallback(() => dispatch({ type: 'DOUBLE_TAP' }), [dispatch]);
  const onLongPress = useCallback(() => dispatch({ type: 'LONG_PRESS' }), [dispatch]);
  const onDrag = useCallback(() => dispatch({ type: 'DRAG' }), [dispatch]);
  const onFling = useCallback(
    (dir) => {
      const pts = Math.floor(Math.random() * 10) + 1;
      dispatch({ type: 'FLING', direction: dir, points: pts });
    },
    [dispatch],
  );
  const onPinchDone = useCallback(() => dispatch({ type: 'PINCH' }), [dispatch]);

  // ────────────────────────────────────────────────────
  // TapGestureHandler — single tap (+1 point)
  // ────────────────────────────────────────────────────
  const singleTap = Gesture.Tap()
    .maxDuration(400)
    .onStart(() => {
      'worklet';
      tapScale.value = withSequence(
        withTiming(0.88, { duration: 70 }),
        withSpring(1, { damping: 12, stiffness: 200 }),
      );
    })
    .onEnd(() => {
      'worklet';
      runOnJS(onTap)();
    });

  // ────────────────────────────────────────────────────
  // TapGestureHandler — double tap (+2 points)
  // ────────────────────────────────────────────────────
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(400)
    .onStart(() => {
      'worklet';
      tapScale.value = withSequence(
        withTiming(0.8, { duration: 60 }),
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 12 }),
      );
    })
    .onEnd(() => {
      'worklet';
      runOnJS(onDoubleTap)();
    });

  // ────────────────────────────────────────────────────
  // LongPressGestureHandler — hold 3 sec (+5 points)
  // ────────────────────────────────────────────────────
  const longPress = Gesture.LongPress()
    .minDuration(3000)
    .onEnd((_e, success) => {
      'worklet';
      if (success) {
        tapScale.value = withSequence(
          withTiming(1.3, { duration: 200 }),
          withSpring(1, { damping: 10 }),
        );
        runOnJS(onLongPress)();
      }
    });

  // ────────────────────────────────────────────────────
  // PanGestureHandler — drag object around screen
  // ────────────────────────────────────────────────────
  const pan = Gesture.Pan()
    .minDistance(20)
    .onStart(() => {
      'worklet';
      panStartX.value = translateX.value;
      panStartY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      translateX.value = panStartX.value + e.translationX;
      translateY.value = panStartY.value + e.translationY;
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0, { damping: 14 });
      translateY.value = withSpring(0, { damping: 14 });
      runOnJS(onDrag)();
    });

  // ────────────────────────────────────────────────────
  // FlingGestureHandler — swipe right (+1-10 random)
  // ────────────────────────────────────────────────────
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      'worklet';
      translateX.value = withSequence(
        withTiming(60, { duration: 120 }),
        withSpring(0, { damping: 14 }),
      );
      runOnJS(onFling)('right');
    });

  // ────────────────────────────────────────────────────
  // FlingGestureHandler — swipe left (+1-10 random)
  // ────────────────────────────────────────────────────
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      'worklet';
      translateX.value = withSequence(
        withTiming(-60, { duration: 120 }),
        withSpring(0, { damping: 14 }),
      );
      runOnJS(onFling)('left');
    });

  // ────────────────────────────────────────────────────
  // PinchGestureHandler — resize clicker (+3 points)
  // ────────────────────────────────────────────────────
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      'worklet';
      pinchScale.value = Math.max(0.5, Math.min(e.scale, 2.0));
    })
    .onEnd(() => {
      'worklet';
      pinchScale.value = withSpring(1, { damping: 12 });
      runOnJS(onPinchDone)();
    });

  // ── Compose all gestures ──
  const composed = Gesture.Simultaneous(
    Gesture.Exclusive(doubleTap, singleTap),
    longPress,
    Gesture.Exclusive(flingRight, flingLeft, pan),
    pinch,
  );

  // ── Animated style for clicker orb ──
  const clickerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: pinchScale.value * tapScale.value },
    ],
  }));

  return (
    <Container>
      <ScoreSection>
        <ScoreLabel>РАХУНОК</ScoreLabel>
        <ScoreValue>{state.score}</ScoreValue>
      </ScoreSection>

      <ClickerArea>
        <GestureDetector gesture={composed}>
          <Animated.View
            style={[
              {
                width: CLICKER_SIZE,
                height: CLICKER_SIZE,
                borderRadius: CLICKER_SIZE / 2,
                backgroundColor: theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: theme.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 28,
                elevation: 12,
              },
              clickerStyle,
            ]}
          >
            <Ionicons name="hand-left-outline" size={36} color="#fff" />
            <ClickerLabel>TAP ME</ClickerLabel>
          </Animated.View>
        </GestureDetector>
      </ClickerArea>

      <RulesCard>
        <RulesTitle>Правила</RulesTitle>
        {RULES.map((r, i) => (
          <RuleRow key={i}>
            <RuleIconWrap $bg={r.c + '22'}>
              <Ionicons name={r.icon} size={14} color={r.c} />
            </RuleIconWrap>
            <RuleLabel>{r.label}</RuleLabel>
            <RulePoints>{r.pts}</RulePoints>
          </RuleRow>
        ))}
      </RulesCard>
    </Container>
  );
}
