import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    cursor: none !important; /* Hide default cursor on ALL elements */
  }

  body {
    background-color: #FFF0F5; 
    color: #800000; 
    font-family: 'Lora', serif;
    overflow-x: hidden;
  }

  h1, h2, h3, .script-font {
    font-family: 'Dancing Script', cursive;
  }

  a, button, input {
    cursor: none !important; /* Ensure hover targets also hide cursor */
  }
`;

export const theme = {
  colors: {
    primary: '#FF69B4', 
    secondary: '#FFC0CB', 
    accent: '#800000', 
    background: '#FFF0F5',
    text: '#800000', 
    white: '#FFFFFF',
    cream: '#FFFDD0', 
    maroon: '#800000', 
    pink: '#FFb6c1',
    red: '#DC143C', // Crimson red for better contrast
    lightPink: '#FFE4E1',
  },
};

export default GlobalStyle;
