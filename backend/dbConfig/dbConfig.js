import configProd from './prod.js'
import configDev from './dev.js'

export var dbConfig

if (false && process.env.NODE_ENV === 'production') {
    dbConfig = configProd
} else {
    dbConfig = configDev
}
dbConfig.isGuestMode = true
