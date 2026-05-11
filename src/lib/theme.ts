import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  fontFamily: '"Hepta Slab", serif',
  fontFamilyMonospace: "monospace",
  headings: {
    fontFamily: '"Clash Grotesk", sans-serif',
    fontWeight: "700",
  },
  primaryColor: "dark",
  defaultRadius: "md",
  fontSizes: {
    xs: rem(11),
    sm: rem(13),
    md: rem(15),
    lg: rem(17),
    xl: rem(20),
  },
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
      },
      styles: {
        root: {
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 700,
          letterSpacing: "0.02em",
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: "md",
        radius: "md",
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "md",
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        size: "md",
        radius: "md",
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        overlayProps: { blur: 4, backgroundOpacity: 0.6 },
      },
    },
    Accordion: {
      styles: {
        item: {
          borderBottom: "1px solid rgba(0,0,0,0.2)",
        },
        control: {
          fontFamily: '"Clash Grotesk", sans-serif',
          fontWeight: 500,
          padding: "1.5rem 0",
          "&:hover": { backgroundColor: "transparent" },
        },
        content: {
          fontFamily: '"Hepta Slab", serif',
          color: "#374151",
          paddingBottom: "1rem",
        },
      },
    },
  },
});
