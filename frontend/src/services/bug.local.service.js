import { storageService } from './async-storage.service'
import { utilService } from './util.service'

export const bugLocalService = {
    query,
    getById,
    remove,
    save,
}

const STORAGE_KEY = 'bugDB'

_createEntities()

async function query() {
    const res = await storageService.query(STORAGE_KEY)
    return { data: res, totalCount: res.length }
}
async function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}
async function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}
async function save(entity) {
    if (entity._id) {
        return storageService.put(STORAGE_KEY, entity)
    } else {
        return storageService.post(STORAGE_KEY, entity)
    }
}

const _fakeData = [
    {
        _id: utilService.makeId(),
        title: 'button does not work',
        severity: 2,
        description: 'I pressed the button several times and it does nothing',
        labels: [],
        createdAt: 1681028787,
    },
    {
        _id: utilService.makeId(),
        title: 'colors look bad',
        severity: 4,
        description: "I don't like the colors of the app",
        labels: [],
        createdAt: 1581028787,
    },
]

function _createEntities() {
    let entities = utilService.loadFromStorage(STORAGE_KEY) || []
    if (entities.length === 0) {
        utilService.saveToStorage(STORAGE_KEY, _fakeData)
    }
}
