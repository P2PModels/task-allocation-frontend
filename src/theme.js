import { createMuiTheme } from '@material-ui/core/styles'

import {
    roboto100ttf,
    roboto300Woff,
    roboto300Woff2,
    roboto500Woff,
    roboto500Woff2,
    roboto700Woff,
    roboto700Woff2,
} from './assets/fonts'

const roboto100 = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 100,
    src: `
    url(https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgVxIIzI.woff2) format('woff2'),
    url(${roboto100ttf}) format('ttf')`,
}

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

const roboto400 = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    src: `
    url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2')
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
    100: '#FBF6F6',
    300: '#f3f4f6',
}

const grey = {
    300: '#D8DBE4',
    400: '#ACB0B3',
    500: '#333333',
    900: '#474955',
}

const purple = {
    500: '#6E3759',
}

const green = {
    300: '#69C96C',
    500: '#389b3c',
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
        background: {
            primary: white[100],
            secondary: white[300],
            green: green[300],
        },
        translateButton: purple[500],
        info: {
            main: purple[500],
        },
    },
    typography: {
        fontFamily: ['Roboto', 'Arial', 'serif'],
    },
    spacing: 16,
    mixins: {
        toolbar: {
            minHeight: '90px',
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [
                    roboto100,
                    roboto300,
                    roboto400,
                    roboto500,
                    roboto700,
                ],
                body: { backgroundColor: white[0], overflowX: 'hidden' },
            },
        },
    },
})

export default theme
