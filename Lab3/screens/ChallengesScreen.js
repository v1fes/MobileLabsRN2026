import React from 'react';
import { FlatList } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

// ─── Challenge definitions ──────────────────────────────────────────────────

const CHALLENGES = [
  {
    id: 'tap10',
    icon: 'finger-print-outline',
    title: 'Натисни 10 разів',
    desc: 'Натисни на клікер 10 разів',
    color: '#0091EA',
    check: (s) => s.tapCount >= 10,
    progress: (s) => `${Math.min(s.tapCount, 10)}/10`,
  },
  {
    id: 'double5',
    icon: 'copy-outline',
    title: 'Подвійний клік ×5',
    desc: 'Подвійне натискання 5 разів',
    color: '#7C4DFF',
    check: (s) => s.doubleTapCount >= 5,
    progress: (s) => `${Math.min(s.doubleTapCount, 5)}/5`,
  },
  {
    id: 'longpress',
    icon: 'hourglass-outline',
    title: 'Утримання 3 секунди',
    desc: 'Утримуй клікер 3 секунди',
    color: '#FF6D00',
    check: (s) => s.longPressCount >= 1,
    progress: (s) => (s.longPressCount >= 1 ? '✓' : '0/1'),
  },
  {
    id: 'drag',
    icon: 'move-outline',
    title: 'Перетягни об\'єкт',
    desc: 'Перемісти клікер по екрану',
    color: '#8D6E63',
    check: (s) => s.hasDragged,
    progress: (s) => (s.hasDragged ? '✓' : '0/1'),
  },
  {
    id: 'swipeR',
    icon: 'arrow-forward-outline',
    title: 'Свайп вправо',
    desc: 'Зроби швидкий свайп вправо',
    color: '#00BFA5',
    check: (s) => s.swipeRightCount >= 1,
    progress: (s) => (s.swipeRightCount >= 1 ? '✓' : '0/1'),
  },
  {
    id: 'swipeL',
    icon: 'arrow-back-outline',
    title: 'Свайп вліво',
    desc: 'Зроби швидкий свайп вліво',
    color: '#00BFA5',
    check: (s) => s.swipeLeftCount >= 1,
    progress: (s) => (s.swipeLeftCount >= 1 ? '✓' : '0/1'),
  },
  {
    id: 'pinch',
    icon: 'resize-outline',
    title: 'Зміни розмір',
    desc: 'Стисни або розтягни клікер двома пальцями',
    color: '#FF4081',
    check: (s) => s.pinchCount >= 1,
    progress: (s) => (s.pinchCount >= 1 ? '✓' : '0/1'),
  },
  {
    id: 'score100',
    icon: 'trophy-outline',
    title: 'Набери 100 очок',
    desc: 'Досягни 100 очок загалом',
    color: '#FFD740',
    check: (s) => s.score >= 100,
    progress: (s) => `${Math.min(s.score, 100)}/100`,
  },
  {
    id: 'master',
    icon: 'star-outline',
    title: 'Мастер жестів',
    desc: 'Використай усі 6 типів жестів',
    color: '#E040FB',
    check: (s) => Object.keys(s.gesturesUsed).length >= 6,
    progress: (s) => `${Object.keys(s.gesturesUsed).length}/6`,
  },
];

// ─── Styled Components ──────────────────────────────────────────────────────

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.bg};
`;

const HeaderCard = styled.View`
  margin: 16px 16px 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cardBorder};
  flex-direction: row;
  align-items: center;
`;

const HeaderBody = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`;

const HeaderSub = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 2px;
`;

const Badge = styled.View`
  background-color: ${({ theme }) => theme.accentSoft};
  padding: 6px 14px;
  border-radius: 20px;
`;

const BadgeText = styled.Text`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.accent};
`;

const Card = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 0 16px 8px;
  padding: 14px;
  background-color: ${({ $done, theme }) =>
    $done ? theme.successSoft : theme.card};
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ $done, theme }) =>
    $done ? theme.success + '33' : theme.cardBorder};
`;

const IconWrap = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${({ $bg }) => $bg || 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const Info = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
`;

const Desc = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Progress = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $done, theme }) => ($done ? theme.success : theme.textMuted)};
  margin-left: 8px;
`;

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function ChallengesScreen() {
  const { state } = useGame();
  const theme = useTheme();
  const completed = CHALLENGES.filter((c) => c.check(state)).length;

  return (
    <Container>
      <FlatList
        data={CHALLENGES}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HeaderCard>
            <Ionicons name="flag-outline" size={28} color={theme.accent} />
            <HeaderBody>
              <HeaderTitle>Завдання</HeaderTitle>
              <HeaderSub>Виконай всі для перемоги!</HeaderSub>
            </HeaderBody>
            <Badge>
              <BadgeText>
                {completed}/{CHALLENGES.length}
              </BadgeText>
            </Badge>
          </HeaderCard>
        }
        renderItem={({ item }) => {
          const done = item.check(state);
          return (
            <Card $done={done}>
              <IconWrap $bg={item.color + '22'}>
                {done ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.success}
                  />
                ) : (
                  <Ionicons name={item.icon} size={18} color={item.color} />
                )}
              </IconWrap>
              <Info>
                <Title>{item.title}</Title>
                <Desc>{item.desc}</Desc>
              </Info>
              <Progress $done={done}>{item.progress(state)}</Progress>
            </Card>
          );
        }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Container>
  );
}
