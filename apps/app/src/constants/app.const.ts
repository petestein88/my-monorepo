// import { STATE_ENUM } from '../enums/common.enum';

// const { IDLE, LOADING, FULFILLED, FAILED } = STATE_ENUM;

const DEFAULT_PAGE_LIMIT = 10

const APP_CONST = {
    NAME: 'Manu-Mission',
    DESCRIPTION: 'Mobile Charging',
    VALUE_NOT_PROVIDED: 'N/A',
    DATE: {
        DATE_FORMAT: 'MMM dd yyyy'
    },
    // STATUS: {
    //   IDLE: IDLE,
    //   LOADING: LOADING,
    //   FULFILLED: FULFILLED,
    //   FAILED: FAILED,
    // },
    BASE_PAGINATION: {
        totalCount: 0,
        page: 1,
        sort: null,
        order: null,
        queryConstraints: [],
        limit: DEFAULT_PAGE_LIMIT
    },
    DEFAULT_PAGE_LIMIT,
    INITIAL_KEY_STATE: {
        // status: LOADING,
        message: null
    }
}

export { APP_CONST }
