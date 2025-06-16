import { useEffect, useState } from "react";

export default function Home() {
  const [fid, setFid] = useState("");
  const [username, setUsername] = useState("");
  const [spaces, setSpaces] = useState([]);
  const [state, setState] = useState("live");

  useEffect(() => {
    if (fid) {
      fetch(`/api/user?fid=${fid}`)
        .then((res) => res.json())
        .then((data) => setUsername(data.username));
    }
  }, [fid]);

  useEffect(() => {
    if (username) {
      fetch(`/api/spaces?username=${username}&state=${state}`)
        .then((res) => res.json())
        .then((data) => setSpaces(data.data || []));
    }
  }, [username, state]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎙 X Spaces Explorer (via Farcaster)</h1>
      <input
        placeholder="Enter your Farcaster FID"
        value={fid}
        onChange={(e) => setFid(e.target.value)}
        style={{ padding: "5px 10px", fontSize: 16 }}
      />
      {username && (
        <>
          <h2>Spaces for @{username}</h2>
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setState("live")}>🔴 Live</button>{" "}
            <button onClick={() => setState("scheduled")}>📅 Scheduled</button>
          </div>
          <ul>
            {spaces.length === 0 ? (
              <li>No {state} Spaces found.</li>
            ) : (
              spaces.map((s: any) => (
                <li key={s.id}>
                  <strong>{s.title}</strong><br />
                  <a href={`https://twitter.com/i/spaces/${s.id}`} target="_blank">Join</a>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
