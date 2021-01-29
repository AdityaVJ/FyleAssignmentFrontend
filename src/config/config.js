import { lazy } from 'react'
import locales from './locales'
import routes from './routes'
import getMenuItems from './menuItems'
import themes from './themes'
import Home from '../pages/Home/Home'
import parseLanguages from 'base-shell/lib/utils/locale'

const config = {
  server: {
    url: 'http://localhost:8080/api',
    get banksUrl() {return `${this.url}/bank`},
    get branchURL() {return `${this.url}/branches`},
    get autocompleteURL() {return `${this.branchURL}/autocomplete`},
    get searchURL() {return `${this.branchURL}/search`},
  },
  routes,
  locale: {
    locales,
    defaultLocale: parseLanguages(['en', 'de', 'ru'], 'en'),
    onError: (e) => {
      //console.warn(e)
      return 
    },
  },
  menu: {
    getMenuItems,
  },
  theme: {
    themes,
    defaultThemeID: 'default',
    defaultType: 'light',
    defaultIsRTL: false //change this to true for Right to Left Language support
  },
  pages: {
    LandingPage: lazy(() => import('../pages/LandingPage/LandingPage')),
    PageNotFound: lazy(() => import('../pages/PageNotFound/PageNotFound')),
  },
}

export default config
