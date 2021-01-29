import React from 'react'
import {
  AccountBox as AccountBoxIcon,
  ChatBubble,
  ChromeReaderMode,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  FilterList,
  FormatTextdirectionRToL as RTLIcon,
  FormatTextdirectionLToR as LTRIcon,
  GetApp,
  InfoOutlined,
  Language as LanguageIcon,
  Lock as LockIcon,
  MenuOpen as MenuOpenIcon,
  QuestionAnswer,
  SettingsApplications as SettingsIcon,
  Style as StyleIcon,
  Tab,
  ViewList,
  Web,
} from '@material-ui/icons'

import allThemes from './themes'

const getMenuItems = (props) => {
  const {
    intl,
    updateLocale,
    locale,
    menuContext,
    themeContext,
    a2HSContext,
    auth: authData,
  } = props
  const {
    isAuthMenuOpen,
  } = menuContext
  const { themeID, setThemeID, isRTL, toggleThis } = themeContext
  const { auth, setAuth } = authData
  const { isAppInstallable, isAppInstalled, deferredPrompt } = a2HSContext

  // const isAuthorised = auth.isAuthenticated

  const themeItems = allThemes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => {
        setThemeID(t.id)
      },
      leftIcon: <StyleIcon style={{ color: t.color }} />,
    }
  })

  return [
    {
      value: '/home',
      visible: true,
      primaryText: intl.formatMessage({ id: 'home' }),
      leftIcon: <DashboardIcon />,
    },
    {
      primaryText: intl.formatMessage({ id: 'demos', defaultMessage: 'Demos' }),
      primaryTogglesNestedList: true,
      leftIcon: <Web />,
      nestedItems: [
        {
          value: '/dialog_demo',
          visible: true,
          primaryText: intl.formatMessage({
            id: 'dialog_demo',
            defaultMessage: 'Dialog',
          }),
          leftIcon: <ChatBubble />,
        },
        {
          value: '/filter_demo',
          visible: true,
          primaryText: intl.formatMessage({
            id: 'filter_demo',
            defaultMessage: 'Filter',
          }),
          leftIcon: <FilterList />,
        },
        {
          value: '/list_page_demo',
          visible: true,
          primaryText: intl.formatMessage({
            id: 'list_page_demo_menu',
            defaultMessage: 'List Page',
          }),
          leftIcon: <ViewList />,
        },
        {
          value: '/tabs_demo',
          visible: true,
          primaryText: intl.formatMessage({
            id: 'tabs_demo',
            defaultMessage: 'Tabs Page',
          }),
          leftIcon: <Tab />,
        },
      ],
    },
    { divider: true },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primaryTogglesNestedList: true,
      leftIcon: <SettingsIcon />,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: 'theme' }),
          secondaryText: intl.formatMessage({ id: themeID }),
          primaryTogglesNestedList: true,
          leftIcon: <StyleIcon />,
          nestedItems: themeItems,
        },
        {
          visible: true,
          onClick: () => {
            toggleThis('isRTL')
          },
          primaryText: `${isRTL ? 'LTR' : 'RTL'} mode`,
          leftIcon: isRTL ? <LTRIcon /> : <RTLIcon />,
        },
      ],
    },
    {
      value: null,
      visible: isAppInstallable && !isAppInstalled,
      onClick: () => {
        deferredPrompt.prompt()
      },
      primaryText: intl.formatMessage({
        id: 'install',
        defaultMessage: 'Install',
      }),
      leftIcon: <GetApp />,
    },
  ]
}
export default getMenuItems
