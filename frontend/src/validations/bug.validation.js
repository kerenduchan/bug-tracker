import { object, string } from 'yup'
import { bugService } from '../services/bug.service'

const _title = string()
    .max(100, 'Must be 100 characters or less')
    .required('Required')

const _description = string().required('Required')

const _allSeverities = bugService.getAllSeverities()

const _severity = string()
    .oneOf(_allSeverities, `Must be one of ${_allSeverities.join(', ')}`)
    .required('Required')

// validation for the bug create/edit form
export const bugValidation = object({
    title: _title,
    description: _description,
    severity: _severity,
})
