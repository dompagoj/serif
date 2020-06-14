import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { MainRouter } from './routers/MainRouter';

export const App = () => {
  return (
    <NavigationContainer>
      <MainRouter />
    </NavigationContainer>
  );
};
