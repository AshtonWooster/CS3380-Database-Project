import Database from 'better-sqlite3';

function initializeSchema(db) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS SIG (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            meetingTime TIME NOT NULL,
            meetingDay VARCHAR(255) NOT NULL,
            roomId INT NOT NULL,
            FOREIGN KEY (roomId) REFERENCES ROOM(id)
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS ROOM (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            maxCapacity INT
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS STUDENT (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS EVENT (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            eventDate DATETIME NOT NULL,
            sigId INT,
            roomId INT,
            FOREIGN KEY (roomId) REFERENCES ROOM(id),
            FOREIGN KEY (sigId) REFERENCES SIG(id)
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS MEMBER_OF (
            sigId INT,
            memberId INT,
            PRIMARY KEY (sigId, memberId),
            FOREIGN KEY (sigId) REFERENCES SIG(id),
            FOREIGN KEY (memberId) REFERENCES STUDENT(id)
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS LEADS (
            sigId INT,
            leadId INT,
            PRIMARY KEY (sigId, leadId),
            FOREIGN KEY (sigId) REFERENCES SIG(id),
            FOREIGN KEY (leadId) REFERENCES STUDENT(id)
        );
    `).run();
    db.prepare(`
        CREATE TABLE IF NOT EXISTS ATTENDS (
            eventId INT,
            studentId INT,
            PRIMARY KEY (eventId, studentId),
            FOREIGN KEY (eventId) REFERENCES EVENT(id),
            FOREIGN KEY (studentId) REFERENCES STUDENT(id)
        );
    `).run();
}

function startDB() {
    const db = new Database('sig-database.db', { verbose: console.debug });
    db.pragma('journal_mode = WAL');
    initializeSchema(db);
}

startDB();
