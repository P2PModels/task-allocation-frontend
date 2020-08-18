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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FF4B63',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'serif'],
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
