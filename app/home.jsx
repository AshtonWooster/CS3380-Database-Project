function sigDisplay({id, name, leadName, room, meetingTime}) {
    return (
        <div className="sig-display" key={id}>
            <div className="sig-name" key={id}>{name}</div>
            <div className="sig-info" key={id}>
                Lead: {leadName}<br/>
                Room: {room}<br/>
                Meeting Time: {meetingTime}
            </div>
        </div>
    );
}

function App() {
    const [sigList, setSigList] = React.useState([]);

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

    return (
        <div>
            <div className="header">SIG Management Tool</div>
            <div className="sig-list">
                {sigList.map((sigItem) => (
                    <sigDisplay 
                        id={sigItem.id}
                        name={sigItem.name}
                        leadName={sigItem.leadName}
                        room={sigItem.room}
                        meetingTime={sigItem.meetingTime}
                    />
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App></App>);
