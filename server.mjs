import express from 'express';
import bodyParser from 'body-parser';
import Database from 'better-sqlite3';

const PORT = 3000;

function initializeSchema(db) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS SIG (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            meetingTime TIME NOT NULL,
            meetingDay VARCHAR(255) NOT NULL
        );
    `).run();
}

function getSigs(db) {
    const result = db.prepare(`SELECT * FROM SIG`).all();
    return result;
}

function main() {
    let db = new Database('sig-database.db', { verbose: console.debug });
    db.pragma('journal_mode = WAL');
    initializeSchema(db);

    let app = express();
    app.use(bodyParser.json());

    app.get('/', (request, response) => {
        response.sendFile('static/index.html', { root: '.' });
    });

    app.use('/static', express.static('static'));

    app.get('/api/sigs', (request, response) => {
        let sigs = getSigs(db);
        response.status(200);
        response.json({ status: 'success', sigs });
    });

    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

main();