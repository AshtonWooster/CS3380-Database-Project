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

function createAttendance(db, eventName, studentName, eventSigName) {
    const sigRow = db.prepare(`SELECT id FROM SIG WHERE name = ?`).get(eventSigName);
    const sigId = sigRow.id;
    const eventRow = db.prepare(`SELECT id FROM EVENT WHERE name = ? AND sigId = ?`).get(eventName, sigId);
    const eventId = eventRow.id;
    const studentRow = db.prepare(`SELECT id FROM STUDENT WHERE name = ?`).get(studentName);
    const studentId = studentRow.id;

    db.prepare(`INSERT INTO ATTENDS (eventId, studentId) VALUES (?, ?);`).run(eventId, studentId);
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

function getEvents(db, studentId) {
    const result = db.prepare(`
        SELECT Event.id, EVENT.name, EVENT.eventDate,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM LEADS 
                    WHERE LEADS.sigId = EVENT.sigId AND LEADS.leadId = @studentId
                ) THEN 'Hosted'
                ELSE 'Attended'
            END AS hosted
        FROM EVENT, SIG, ATTENDS
        WHERE EVENT.sigId = SIG.id AND ATTENDS.eventId = EVENT.id AND ATTENDS.studentId = @studentId;
    `).all({studentId});

    return result;
}

function getStudents(db) {
    const result = db.prepare(`SELECT * FROM STUDENT`).all();

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

    app.post('/api/events', (req, res) => {
        const { eventName, studentName, eventSigName } = req.body;
        
        createAttendance(db, eventName, studentName, eventSigName);
   
        res.status(200).json({ status: 'success' });
    });

    app.get('/api/events/:studentId', (req, res) => {
        const { studentId } = req.params;
        const events = getEvents(db, studentId);

        res.status(200).json({status: 'success', events: events});
    });

    app.get('/api/students', (req, res) => {
        const students = getStudents(db);
        res.status(200).json({status: 'success', students: students});
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main();
