
import { createMuiTheme } from '@material-ui/core/styles';
export default createMuiTheme({
    palette: {
      primary: {
        main: "#AB6098",
      },
      secondary: {
        main: "#CF4367",
      },
      background: {
        light: "#CF4367",
      },
    },
    breakpoints: {
      values: {
        xs: 0, // phones
        sm: 600, // tablets
        md: 900, // small laptops
        lg: 1200, // desktops
        xl: 1500, // large screens
      },
    },
  });