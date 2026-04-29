import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle, { theme } from './styles/globalStyles';
import CustomCursor from './components/CustomCursor';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import LettersPage from './pages/LettersPage';
import EndingPage from './pages/EndingPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <CustomCursor />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/letters" element={<LettersPage />} />
          <Route path="/ending" element={<EndingPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
