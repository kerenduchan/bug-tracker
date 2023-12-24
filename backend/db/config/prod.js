export default {
    baseUrl:
        process.env.DB_URL ||
        'mongodb+srv://theUser:thePass@cluster0-klgzh.mongodb.net/test?retryWrites=true&w=majority',
    dbName: process.env.DB_NAME || 'bug-tracker',
}
