import { createMuiTheme } from '@material-ui/core/styles'

import {
  roboto300Woff,
  roboto300Woff2,
  roboto500Woff,
  roboto500Woff2,
  roboto700Woff,
  roboto700Woff2,
} from './assets/fonts'

const roboto300 = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 300,
  src: `
    local('Roboto Light'),
    local('Roboto-Light'),
    url(${roboto300Woff2}) format('woff2'),
    url(${roboto300Woff}) format('woff')
  `,
}

const roboto500 = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 500,
  src: `
    local('Roboto Medium'),
    local('Roboto-Medium'),
    url(${roboto500Woff2}) format('woff2'),
    url(${roboto500Woff}) format('woff')
  `,
}

const roboto700 = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 700,
  src: `
    local('Roboto Bold'),
    local('Roboto-Bold'),
    url(${roboto700Woff2}) format('woff2'),
    url(${roboto700Woff}) format('woff')
  `,
}

const white = {
  0: '#fff',
  100: '#FBF6F6'
}

const grey = {
  300: '#d8d8d8',
  400: '#ACB0B3',
  500: '#333333',
  900: '#474955',
}

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: grey[500],
    },
    text: {
      dark: grey[900],
      main: grey[500],
      light: white[100],
      secondary: grey[400],
    },
    chips: {
      low: '#30957B',
      medium: '#80BD3E',
      high: '#F3254D',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'serif'],
  },
  spacing: 16,
    mixins: {
        toolbar: {
            minHeight: '116px',
        },
    },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [roboto300],
      },
    },
  },
})

export default theme
