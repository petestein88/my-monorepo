import { string } from './string'
import { ENV_CONFIG } from '../config/env.config'
import { CONST } from '../constants/index.const'
import { ROUTES } from '../constants/routes.const'
import { LOCAL_STORAGE_ENUM } from '../enums/common.enum'
import { Friend, User } from '../types'

function getValue(value: any): any {
    return value ? value : CONST.APP_CONST.VALUE_NOT_PROVIDED
}

const getRoute = (route: string) => {
    const urlPrefix = ENV_CONFIG.URL_PREFIX
    const route_ = string.removeTrailingSlash(
        `${urlPrefix}/${string.removeTrailingSlash(string.removeLeadingSlash(route))}`
    )
    return route_ ? route_ : !ENV_CONFIG.URL_PREFIX ? '/' : ''
}

const getRouteType = (route: string) => {
    const protectedR = ROUTES.PROTECTED_ROUTES.find((r: { NAME: string; URL: string; REGEX?: string }) => {
        return r.REGEX ? new RegExp(r.REGEX).test(route) : r.URL === route
    })

    const publicR = ROUTES.PUBLIC_ROUTES.find(r => r.URL === route)
    const unprotectedR = ROUTES.UN_PROTECTED_ROUTES.find(r => r.URL === route)
    return {
        protected: protectedR,
        public: publicR,
        unprotected: unprotectedR
    }
}
const getFullName = (args: Omit<User, 'device_id'>) => {
    const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
    const firstName = capitalizeFirstLetter(args?.first_name?.trim() ?? '')
    const lastName = args?.last_name?.trim() ?? ''
    return [firstName, lastName].join(' ').trim()
}

const isUserLoggedIn = () => {
    return Boolean(localStorage.getItem(LOCAL_STORAGE_ENUM.AUTH_TOKEN)?.trim())
}

const getFriendshipStatus = (friendUser: Friend, myId: number): Friend['icon'] => {
    if (!friendUser.friendship_id) return 'add'

    switch (friendUser.status) {
        case '1':
            switch (true) {
                case friendUser.friend_id && parseInt(friendUser.friend_id as unknown as string) === myId:
                    return 'accept'
                case friendUser.user_id && parseInt(friendUser.user_id as unknown as string) === myId:
                    return 'pending'
            }
            break
        case '2':
            return 'added'
    }
}

const helpers = {
    getRouteType,
    getRoute,
    friend: {
        getFriendshipStatus
    },
    auth: { isUserLoggedIn },
    user: { getFullName },
    getValue
}

export { helpers }
