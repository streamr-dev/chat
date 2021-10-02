import {
  extendTheme,
  ThemeConfig,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: (props: any) => ({
    body: {
      color: 'red'
    },
  }),
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: (props) => ({
        bg: '#0324FF',
        backgroundColor: '#0324FF',
        borderRadius: "4px",
        color: 'white',
        padding: '10px 16px',
        _hover: {
          bg: '#0C009A',
          backgroundColor: '#0C009A',
        },
        _active: {
          bg: '#09006D',
          backgroundColor: '#09006D',
        }
      }),
      variants: {
        primary: (props) => ({
          fontSize: 'md',
          color: 'white',
          backgroundColor: mode('#0324FF', 'red.500')(props),
          _hover: {
            color: mode('white', 'red.500')(props),
            backgroundColor: '#0C009A',
          },
        }),
        secondary: (props: any) => ({
          backgroundColor: mode('#EFEFEF', 'red.500')(props),
          color: mode('#323232', 'white')(props),
          _hover: {
            bg: mode('#E7E7E7', 'red.500')(props),
            backgroundColor: mode('#E7E7E7', 'red.500')(props),
          },
          _active: {
            bg: mode('#D8D8D8', 'red.500')(props),
            backgroundColor: mode('#D8D8D8', 'red.500')(props),
          },
        }),
        ghost: (props: any) => ({
          backgroundColor: "transparent",
          _hover: {
            backgroundColor: "transparent"
          },
          _active: {
            backgroundColor: "transparent"
          },
        })
      }
    }
  }
});
export default theme;
