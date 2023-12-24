import { object } from 'yup'
import {
    requiredString,
    username,
    password,
    fullname,
} from './shared.validation'

// validation for the login form.
// don't validate password,
// and for the username, only validate that it was supplied, not the length
export const loginValidation = object({ username: requiredString })

// validation for the signup form
export const signupValidation = object({ username, password, fullname })
