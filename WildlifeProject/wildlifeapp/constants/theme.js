const COLORS = {
  primary: "#4CAF50",  
  secondary: "#2E7D32",
  tertiary: "#81C784",
  white: "#FFFFFF",
  lightGray: "#D3D3D3",
  gray: "#808080",
  darkGray: "#4B4B4B",
  black: "#000000",
  lightBlue: "#B3E5FC",
  forestGreen: "#1b4013", 
  darkGreen: "#365928",
  lightWhite: "#e2fade",
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
