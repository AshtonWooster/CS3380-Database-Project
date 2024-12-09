function SigDisplay({sigId, name, leadName, room, meetingDay, meetingTime}) {
    return (
        <div className="sig-display" key={sigId}>
            <h2 className="sig-name">{name}</h2>
            <p className="sig-info">
                Lead: {leadName}<br/>
                Room: {room}<br/>
                Meeting Day: {meetingDay}<br/>
                Meeting Time: {meetingTime}
            </p>
        </div>
    );
}

function StudentDisplay({studentId, studentName}) {
    const [eventList, setEventList] = React.useState([]);

    const [attendancePoints, setAttendancePoints] = React.useState(0);

    React.useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        let attendanceCount = 0;

        const response = await fetch(`/api/events/${studentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setEventList(data.events);

        data.events.map((eventItem) => {
            if (eventItem.hosted == "Hosted") {
                attendanceCount = attendanceCount + 3;
            }
            else {
                attendanceCount = attendanceCount + 1;
            }
        });

        setAttendancePoints(attendanceCount);
    };

    const formatDate = (unformattedDate) => {
        const date = new Date(unformattedDate);
        return date.toDateString();
    }

    return (
        <div className="student-display" key={studentId}>
            <h2 className="student-name" >{studentName}</h2>
            <p className="attendance-points">Attendance Points: {attendancePoints}</p>
            <div className="student-attendance">
                {eventList.map((eventItem) => (
                    <p key={`${studentId}-${eventItem.id}`}>{eventItem.name}: {formatDate(eventItem.eventDate)}, {eventItem.hosted}</p>   
                ))}
            </div>
        </div>
    )
}

function App() {
    const [sigList, setSigList] = React.useState([]);
    const [studentList, setStudentList] = React.useState([]);
    
    const [sigName, setSigName] = React.useState('');
    const [sigRoom, setSigRoom] = React.useState('');
    const [sigTime, setSigTime] = React.useState("16:00");
    const [sigLead, setSigLead] = React.useState('');
    const [sigDay, setSigDay] = React.useState('');
    const [eventName, setEventName] = React.useState('');
    const [studentName, setStudentName] = React.useState('');
    const [eventSigName, setEventSigName] = React.useState('');

    const [showAddSig, setShowAddSig] = React.useState(false);
    const [showAddAttendance, setShowAddAttendance] = React.useState(false);

    React.useEffect(() => {
        fetchSigs();
        fetchStudents();
    }, []);

    const fetchSigs = async () => {
        const response = await fetch("/api/sigs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setSigList(data.sigs);
    };

    const fetchStudents = async () => {
        const response = await fetch("/api/students", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        setStudentList(data.students);
    }

    const handleSigFormSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/sigs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sigName: sigName,
                sigRoom: sigRoom,
                sigDay: sigDay,
                sigTime: sigTime,
                sigLead: sigLead
            }),
        });
        await fetchSigs();
    };

    const handleAttendanceFormSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                eventName: eventName,
                studentName: studentName,
                eventSigName: eventSigName
            }),
        });
        
        setStudentList([]);
        await fetchStudents();
    };

    return (
        <div>
            <div className="header">SIG Management Tool</div>
            <div className="sig-list">
                {sigList.map((sigItem) => (
                    <SigDisplay 
                        key={sigItem.id}
                        sigId={sigItem.id}
                        name={sigItem.name}
                        leadName={sigItem.leadName}
                        room={sigItem.room}
                        meetingDay={sigItem.meetingDay}
                        meetingTime={sigItem.meetingTime}
                    />
                ))}
            </div>
            <div className="add-sig">
                <button onClick={() => setShowAddSig(true)}>Add Sig</button>
            </div>
            {showAddSig && (
                <form onSubmit={handleSigFormSubmit}>
                    <h2>Add Sig</h2>
                    <div>
                        <label htmlFor="sig-name">SIG Name:</label>
                        <input
                            id="sig-name"
                            value={sigName}
                            onChange={(e) => setSigName(e.target.value)}
                            required
                        />
                        <label htmlFor="sig-room">SIG Room:</label>
                        <input
                            id="sig-room"
                            value={sigRoom}
                            onChange={(e) => setSigRoom(e.target.value)}
                            required
                        />
                        <label htmlFor="sig-day">Day of the week:</label>
                        <select 
                            id="sig-day"
                            value={sigDay} 
                            onChange={(e) => setSigDay(e.target.value)}
                            required
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                        <label htmlFor="sig-time">SIG Time:</label>
                        <input
                            id="sig-time"
                            type="time"
                            value={sigTime}
                            onChange={(e) => setSigTime(e.target.value)}
                            required
                        />
                        <label htmlFor="sig-lead">SIG Lead:</label>
                        <input
                            id="sig-lead"
                            value={sigLead}
                            onChange={(e) => setSigLead(e.target.value)}
                            required
                        />
                        <button type="submit">Save SIG</button>
                        <button className="hide-button" onClick={() => setShowAddSig(false)}>Hide</button>
                    </div>
                </form>
            )}
            <div className="attendance-list">
                {studentList.map((studentItem) => (
                    <StudentDisplay 
                        key={studentItem.id}
                        studentId={studentItem.id}
                        studentName={studentItem.name}
                    />
                ))}
            </div>
            <div className="add-attendance">
                <button onClick={() => setShowAddAttendance(true)}>Attendance</button>
            </div>
            {showAddAttendance && (
                <form onSubmit={handleAttendanceFormSubmit}>
                    <h2>Add Attendance</h2>
                    <div>
                        <label htmlFor="event-name">Event Name:</label>
                        <input
                            id="event-name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                        <label htmlFor="student-name">Student Name:</label>
                        <input
                            id="student-name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                        />
                        <label htmlFor="event-sig-name">SIG Name:</label>
                        <input
                            id="event-sig-name"
                            value={eventSigName}
                            onChange={(e) => setEventSigName(e.target.value)}
                            required
                        />
                        <button type="submit">Save Attendance</button>
                        <button className="hide-button" onClick={() => setShowAddAttendance(false)}>Hide</button>
                    </div>
                </form>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App></App>);
