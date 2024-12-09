import Database from 'better-sqlite3';

function populateDB() {
    let db = new Database('sig-database.db', { verbose: console.debug });
    db.pragma('journal_mode = WAL');

    const insertRoom = db.prepare(`
        INSERT INTO ROOM (name, maxCapacity) VALUES (?, ?);
    `);

    const insertStudent = db.prepare(`
        INSERT INTO STUDENT (name) VALUES (?);
    `);

    const insertEvent = db.prepare(`
        INSERT INTO EVENT (name, eventDate, sigId, roomId) VALUES (?, ?, ?, ?);
    `);

    const insertSig = db.prepare(`
        INSERT INTO SIG (name, meetingTime, meetingDay, roomId) VALUES (?, ?, ?, ?);
    `);

    const insertLeads = db.prepare(`
        INSERT INTO LEADS (sigId, leadId) VALUES (?, ?);
    `);

    const rooms = [
        { name: 'Room 101', maxCapacity: 30 },
        { name: 'Room 102', maxCapacity: 40 },
        { name: 'Room 103', maxCapacity: 50 },
        { name: 'Room 104', maxCapacity: 25 },
        { name: 'Room 105', maxCapacity: 35 },
        { name: 'Room 106', maxCapacity: 60 },
        { name: 'Room 107', maxCapacity: 45 },
        { name: 'Room 108', maxCapacity: 55 },
        { name: 'Room 109', maxCapacity: 20 },
        { name: 'Room 110', maxCapacity: 60 }
    ];

    rooms.forEach(room => {
        insertRoom.run(room.name, room.maxCapacity);
    });

    const students = [
        'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis',
        'Eva White', 'George Miller', 'Hannah Clark', 'Ian Wilson', 'Jack Taylor'
    ];

    students.forEach(student => {
        insertStudent.run(student);
    });

    const sigs = [
        { name: 'SIG A', meetingTime: '10:00', meetingDay: 'Monday', roomId: 1 },
        { name: 'SIG B', meetingTime: '11:00', meetingDay: 'Tuesday', roomId: 2 },
        { name: 'SIG C', meetingTime: '12:00', meetingDay: 'Wednesday', roomId: 3 },
        { name: 'SIG D', meetingTime: '13:00', meetingDay: 'Thursday', roomId: 4 },
        { name: 'SIG E', meetingTime: '14:00', meetingDay: 'Friday', roomId: 5 }
    ];

    sigs.forEach(sig => {
        const i = sig.roomId;
        insertSig.run(sig.name, sig.meetingTime, sig.meetingDay, i);
        insertLeads.run(i, i)
    });
    const events = [
        { name: 'Event 1', eventDate: '2024-12-10 10:00:00', sigId: 1, roomId: 1 },
        { name: 'Event 2', eventDate: '2024-12-10 11:00:00', sigId: 2, roomId: 2 },
        { name: 'Event 3', eventDate: '2024-12-11 12:00:00', sigId: 3, roomId: 3 },
        { name: 'Event 4', eventDate: '2024-12-11 13:00:00', sigId: 4, roomId: 4 },
        { name: 'Event 5', eventDate: '2024-12-12 14:00:00', sigId: 5, roomId: 5 }
    ];

    events.forEach(event => {
        insertEvent.run(event.name, event.eventDate, event.sigId, event.roomId);
    });

    db.close();
}

populateDB();
