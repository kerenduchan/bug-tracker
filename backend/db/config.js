const DB_NAME = 'bug-tracker'

export function getDbUrl() {
    if (process.env.NODE_ENV === 'production') {
        // something like:
        // mongodb+srv://<username>:<password>@cluster0.3srfdf9.mongodb.net/bug-tracker?retryWrites=true&w=majority
        return process.env.DB_URL
    }
    // local development db
    return `mongodb://127.0.0.1:27017/${DB_NAME}`
}
