import { STATE_ENUM } from '../enums/common.enum'
export interface User {
    phone_number: string
    device_id: string
    id: number
    first_name: string
    last_name: string
    email: string
}

export interface Goal {
    id: string
    category: 'Reading' | 'Sleeping' | 'Exercise' | 'Other'
    target: number
    current: number
    unit: 'hours' | 'sessions'
}

export interface Friend {
    id: number
    first_name: string
    last_name: string
    email: string
    phone_number: string
    friendship_id?: number
    status?: string
    friend_id?: number
    user_id?: number
    icon?: 'accept' | 'pending' | 'add' | 'added'
}

export interface Session {
    id: string
    startTime: Date
    endTime: Date
    duration: number
    category?: string
}

export type IStatus = STATE_ENUM.IDLE | STATE_ENUM.LOADING | STATE_ENUM.FULFILLED | STATE_ENUM.FAILED

export type IBreakPoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
