import { object } from 'yup'
import { username, password, fullname } from './shared.validation'

// validation for the login form (don't validate password)
export const loginValidation = object({ username })

// validation for the signup form
export const signupValidation = object({ username, password, fullname })
