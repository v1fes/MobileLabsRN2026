import React, { createContext, useContext, useReducer, useMemo } from 'react';

const initialState = {
  score: 0,
  tapCount: 0,
  doubleTapCount: 0,
  longPressCount: 0,
  hasDragged: false,
  swipeRightCount: 0,
  swipeLeftCount: 0,
  pinchCount: 0,
  gesturesUsed: {},
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'TAP':
      return {
        ...state,
        score: state.score + 1,
        tapCount: state.tapCount + 1,
        gesturesUsed: { ...state.gesturesUsed, tap: true },
      };
    case 'DOUBLE_TAP':
      return {
        ...state,
        score: state.score + 2,
        doubleTapCount: state.doubleTapCount + 1,
        gesturesUsed: { ...state.gesturesUsed, doubleTap: true },
      };
    case 'LONG_PRESS':
      return {
        ...state,
        score: state.score + 5,
        longPressCount: state.longPressCount + 1,
        gesturesUsed: { ...state.gesturesUsed, longPress: true },
      };
    case 'DRAG':
      return {
        ...state,
        hasDragged: true,
        gesturesUsed: { ...state.gesturesUsed, drag: true },
      };
    case 'FLING':
      return {
        ...state,
        score: state.score + action.points,
        swipeRightCount:
          state.swipeRightCount + (action.direction === 'right' ? 1 : 0),
        swipeLeftCount:
          state.swipeLeftCount + (action.direction === 'left' ? 1 : 0),
        gesturesUsed: { ...state.gesturesUsed, fling: true },
      };
    case 'PINCH':
      return {
        ...state,
        score: state.score + 3,
        pinchCount: state.pinchCount + 1,
        gesturesUsed: { ...state.gesturesUsed, pinch: true },
      };
    case 'RESET_SCORE':
      return { ...state, score: 0 };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}

const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
