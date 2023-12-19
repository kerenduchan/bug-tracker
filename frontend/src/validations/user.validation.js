import { object } from 'yup'
import { username, password, fullname, score } from './shared.validation'

// validation for create user form. Password here is required.
export const createUserValidation = object({
    username,
    password,
    fullname,
    score,
})

// validation for edit user form. Password here is optional.
export const editUserValidation = object({
    username,
    fullname,
    score,
})
