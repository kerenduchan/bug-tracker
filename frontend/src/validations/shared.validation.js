import { string } from 'yup'

export { username, password, fullname }

const username = string()
    .max(20, 'Must be 20 characters or less')
    .required('Required')

const password = string()
    .min(4, 'Must be at least 4 characters')
    .required('Required')

const fullname = string()
    .max(40, 'Must be 40 characters or less')
    .required('Required')