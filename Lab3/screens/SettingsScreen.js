import React from 'react';
import { Switch, Alert } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeToggle } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

// ─── Styled Components ──────────────────────────────────────────────────────

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.bg};
`;

const Section = styled.View`
  margin: 16px 16px 0;
`;

const SectionTitle = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  margin-left: 4px;
`;

const Card = styled.View`
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cardBorder};
  overflow: hidden;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: ${({ $last }) => ($last ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.cardBorder};
`;

const RowIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: ${({ $bg }) => $bg || 'transparent'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const RowBody = styled.View`
  flex: 1;
`;

const RowTitle = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.text};
`;

const RowSub = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 1px;
`;

const DangerRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: ${({ $last }) => ($last ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => theme.cardBorder};
`;

const DangerText = styled.Text`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.danger};
`;

const InfoCard = styled.View`
  margin: 24px 16px 40px;
  padding: 24px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.cardBorder};
  align-items: center;
`;

const InfoName = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-top: 12px;
  text-align: center;
`;

const InfoGroup = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 4px;
`;

const InfoLab = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 8px;
  font-style: italic;
`;

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeToggle();
  const { state, dispatch } = useGame();

  const handleResetScore = () => {
    Alert.alert('Скинути рахунок?', 'Рахунок буде скинуто до 0.', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Скинути',
        style: 'destructive',
        onPress: () => dispatch({ type: 'RESET_SCORE' }),
      },
    ]);
  };

  const handleResetAll = () => {
    Alert.alert('Скинути все?', 'Рахунок та всі завдання буде скинуто.', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Скинути',
        style: 'destructive',
        onPress: () => dispatch({ type: 'RESET_ALL' }),
      },
    ]);
  };

  return (
    <Container>
      {/* ── Appearance ── */}
      <Section>
        <SectionTitle>Зовнішній вигляд</SectionTitle>
        <Card>
          <Row $last>
            <RowIcon $bg={theme.accentSoft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={17}
                color={theme.accent}
              />
            </RowIcon>
            <RowBody>
              <RowTitle>Темна тема</RowTitle>
            </RowBody>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#ccc', true: theme.accent + '77' }}
              thumbColor={isDark ? theme.accent : '#f4f3f4'}
            />
          </Row>
        </Card>
      </Section>

      {/* ── Stats ── */}
      <Section>
        <SectionTitle>Статистика</SectionTitle>
        <Card>
          <Row>
            <RowIcon $bg={theme.accentSoft}>
              <Ionicons
                name="trending-up-outline"
                size={17}
                color={theme.accent}
              />
            </RowIcon>
            <RowBody>
              <RowTitle>Поточний рахунок</RowTitle>
              <RowSub>{state.score} очок</RowSub>
            </RowBody>
          </Row>
          <Row>
            <RowIcon $bg={theme.successSoft}>
              <Ionicons
                name="checkmark-done-outline"
                size={17}
                color={theme.success}
              />
            </RowIcon>
            <RowBody>
              <RowTitle>Жести використано</RowTitle>
              <RowSub>{Object.keys(state.gesturesUsed).length} з 6</RowSub>
            </RowBody>
          </Row>
          <Row $last>
            <RowIcon $bg={theme.warningSoft}>
              <Ionicons
                name="finger-print-outline"
                size={17}
                color={theme.warning}
              />
            </RowIcon>
            <RowBody>
              <RowTitle>Всього натискань</RowTitle>
              <RowSub>{state.tapCount + state.doubleTapCount * 2}</RowSub>
            </RowBody>
          </Row>
        </Card>
      </Section>

      {/* ── Danger zone ── */}
      <Section>
        <SectionTitle>Небезпечна зона</SectionTitle>
        <Card>
          <DangerRow onPress={handleResetScore}>
            <RowIcon $bg={theme.dangerSoft}>
              <Ionicons
                name="refresh-outline"
                size={17}
                color={theme.danger}
              />
            </RowIcon>
            <DangerText>Скинути рахунок</DangerText>
          </DangerRow>
          <DangerRow onPress={handleResetAll} $last>
            <RowIcon $bg={theme.dangerSoft}>
              <Ionicons
                name="trash-outline"
                size={17}
                color={theme.danger}
              />
            </RowIcon>
            <DangerText>Скинути все</DangerText>
          </DangerRow>
        </Card>
      </Section>

      {/* ── Student info ── */}
      <InfoCard>
        <Ionicons name="school-outline" size={32} color={theme.accent} />
        <InfoName>Фесенко Вікторія Володимирівна</InfoName>
        <InfoGroup>Група ВТ-22-1</InfoGroup>
        <InfoLab>Лабораторна робота №3</InfoLab>
      </InfoCard>
    </Container>
  );
}
