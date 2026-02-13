import { CONST } from '../constants/index.const'
import { crypto } from './crypto'
import { error } from './error'
import { helpers } from './helpers'
import { json } from './json'
import { object } from './object'
import { string } from './string'
import { toast } from './toast'
import { debounce } from './debounce'

export const utils = {
    json,
    crypto,
    object,
    CONST,
    helpers,
    toast,
    error,
    string,
    debounce
}
