import { number, string } from 'yup'

export { requiredString, username, password, fullname, score }

const requiredString = string().required('Required')

const username = string()
    .min(4, 'Must be 4-20 characters long')
    .max(20, 'Must be 4-20 characters long')
    .required('Required')

const password = string()
    .min(4, 'Must be at least 4 characters')
    .required('Required')

const fullname = string()
    .max(40, 'Must be 40 characters or less')
    .required('Required')

const score = number()
    .min(0, 'Must be between 0-100')
    .max(100, 'Must be between 0-100')
    .typeError('Must be a number between 0-100')
    .required('Required')
