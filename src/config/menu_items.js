import React from 'react'
import {
    Dashboard as DashboardIcon,
    FormatTextdirectionRToL as RTLIcon,
    FormatTextdirectionLToR as LTRIcon,
    GetApp,
    SettingsApplications as SettingsIcon,
    Style as StyleIcon,
} from '@material-ui/icons'

import allThemes from './themes'

const getMenuItems = (props) => {
    const {
        intl,
        themeContext,
        a2HSContext,
    } = props
    const {themeID, setThemeID, isRTL, toggleThis} = themeContext
    const {isAppInstallable, isAppInstalled, deferredPrompt} = a2HSContext

    const themeItems = allThemes.map((t) => {
        return {
            value: undefined,
            visible: true,
            primaryText: intl.formatMessage({id: t.id}),
            onClick: () => {
                setThemeID(t.id)
            },
            leftIcon: <StyleIcon style={{color: t.color}}/>,
        }
    })

    return [
        {
            value: '/dashboard',
            visible: true,
            primaryText: intl.formatMessage({id: 'home'}),
            leftIcon: <DashboardIcon/>,
        },
        {divider: true},
        {
            primaryText: intl.formatMessage({id: 'settings'}),
            primaryTogglesNestedList: true,
            leftIcon: <SettingsIcon/>,
            nestedItems: [
                {
                    primaryText: intl.formatMessage({id: 'theme'}),
                    secondaryText: intl.formatMessage({id: themeID}),
                    primaryTogglesNestedList: true,
                    leftIcon: <StyleIcon/>,
                    nestedItems: themeItems,
                },
                {
                    visible: true,
                    onClick: () => {
                        toggleThis('isRTL')
                    },
                    primaryText: `${isRTL ? 'LTR' : 'RTL'} mode`,
                    leftIcon: isRTL ? <LTRIcon/> : <RTLIcon/>,
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
            leftIcon: <GetApp/>,
        },
    ]
}
export default getMenuItems
