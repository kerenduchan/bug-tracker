import { object } from 'yup'
import { username, password, fullname, score } from './shared.validation'

// validation for the user create/edit form
export const userValidation = object({ username, password, fullname, score })
