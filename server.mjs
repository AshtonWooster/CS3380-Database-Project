import express from 'express';
import bodyParser from 'body-parser';
import Database from 'better-sqlite3';

const PORT = 3000;

function createSig(db, sigName, sigRoom, sigDay, sigTime, sigLead) {
    const roomRow = db.prepare(`SELECT id FROM ROOM WHERE name = ?`).get(sigRoom);
    const leadRow = db.prepare(`SELECT id FROM STUDENT WHERE name = ?`).get(sigLead);

    if (!roomRow || !leadRow) {
        console.log("Error: Room or Student not found.");
        return;
    }

    const sigInserter = db.prepare(`
        INSERT INTO SIG (name, meetingTime, meetingDay, roomId) VALUES (?, ?, ?, ?);
    `);
    const result = sigInserter.run(sigName, sigTime, sigDay, roomRow.id);

    const leadInserter = db.prepare(`
        INSERT INTO LEADS (sigId, leadId) VALUES (?, ?);
    `);
    leadInserter.run(result.lastInsertRowid, leadRow.id);
}

function getSigs(db) {
    const result = db.prepare(`
        SELECT SIG.*, STUDENT.name AS leadName, ROOM.name as room
        FROM SIG
        JOIN LEADS ON SIG.id = LEADS.sigId
        JOIN STUDENT ON LEADS.leadId = STUDENT.id
        JOIN ROOM ON SIG.roomId = ROOM.id;
    `).all();
    return result;
}

function main() {
    const db = new Database('sig-database.db', { verbose: console.debug });
    db.pragma('journal_mode = WAL');

    const app = express();
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.sendFile('static/index.html', { root: '.' });
    });

    app.use('/static', express.static('static'));

    app.get('/api/sigs', (req, res) => {
        const sigs = getSigs(db);
        res.status(200).json({ status: 'success', sigs: sigs });
    });

    app.post('/api/sigs', (req, res) => {
        const { sigName, sigRoom, sigDay, sigTime, sigLead } = req.body;
        
        createSig(db, sigName, sigRoom, sigDay, sigTime, sigLead);
        res.status(200).json({ status: 'success' });
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();
