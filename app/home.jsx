function SigDisplay({sigId, name, leadName, room, meetingDay, meetingTime}) {
    return (
        <div className="sig-display" key={sigId}>
            <div className="sig-name" key={sigId}>{name}</div>
            <p className="sig-info" key={sigId}>
                Lead: {leadName}<br/>
                Room: {room}<br/>
                Meeting Day: {meetingDay}<br/>
                Meeting Time: {meetingTime}
            </p>
        </div>
    );
}

function App() {
    const [sigList, setSigList] = React.useState([]);
    
    const [sigName, setSigName] = React.useState('');
    const [sigRoom, setSigRoom] = React.useState('');
    const [sigTime, setSigTime] = React.useState("16:00");
    const [sigLead, setSigLead] = React.useState('');
    const [sigDay, setSigDay] = React.useState('');

    const [showAddSig, setShowAddSig] = React.useState(false);

    React.useEffect(() => {
        fetchSigs();
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
            {/* <div className="add-attendance">
                <button onClick={() => setShowAddSig(true)}>Add Sig</button>
            </div> */}
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
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App></App>);
