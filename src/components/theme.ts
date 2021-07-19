import {
  extendTheme,
  ThemeConfig,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: (props: any) => ({
    "html, body": {
      backgroundColor: props.colorMode !== "dark" ? "white" : "gray.800",
    },
  }),
};

const theme = extendTheme({ config });
export default theme;
