// ✅ spaXes Upgrade — Clean Login Splash, Mobile-Friendly

import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [fid, setFid] = useState("");
  const [username, setUsername] = useState("");
  const [spaces, setSpaces] = useState([]);
  const [state, setState] = useState("live");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fidParam = urlParams.get("fid");
    if (fidParam) {
      setFid(fidParam);
      localStorage.setItem("fid", fidParam);
    } else {
      const storedFID = localStorage.getItem("fid");
      if (storedFID) setFid(storedFID);
    }
  }, []);

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

  const filteredSpaces = spaces.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.host_ids && s.host_ids.join(",").includes(search))
  );

  const redirectToNeynarLogin = () => {
    const clientId = "spaxes-app";
    const redirectUri = encodeURIComponent(window.location.origin);
    window.location.href = `https://api.neynar.com/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+farcaster`;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Head>
        <title>spaXes</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@1,600&display=swap" rel="stylesheet" />
      </Head>

      {/* Conditional Content */}
      {!fid ? (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg shadow-purple-200 p-6 w-full max-w-xs text-center">
            <img src="/IMG_6172.jpeg" alt="spaXes logo" className="w-16 h-16 mx-auto rounded-full mb-4" />
            <h1
              className="text-xl italic font-semibold mb-4"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
            >
              spaXes
            </h1>
            <button
              onClick={redirectToNeynarLogin}
              className="w-full py-2 bg-purple-200 text-purple-900 font-medium rounded"
            >
              Login with Farcaster
            </button>
          </div>
        </div>
      ) : (
        <main className="max-w-xl mx-auto px-6 pt-8">
          <h2 className="text-xl mb-2">Linked Twitter: @{username}</h2>

          <div className="flex gap-4 mb-4 flex-wrap">
            <button
              onClick={() => setState("live")}
              className={`px-4 py-2 rounded ${state === "live" ? "bg-red-500 text-white" : "bg-white border"}`}
            >🔴 Live</button>
            <button
              onClick={() => setState("scheduled")}
              className={`px-4 py-2 rounded ${state === "scheduled" ? "bg-blue-500 text-white" : "bg-white border"}`}
            >📅 Scheduled</button>
          </div>

          <input
            type="text"
            placeholder="Filter by keyword..."
            className="w-full border p-2 mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ul className="space-y-4">
            {filteredSpaces.length === 0 ? (
              <li>No {state} Spaces found.</li>
            ) : (
              filteredSpaces.map((s) => (
                <li key={s.id} className="border p-4 rounded bg-white shadow">
                  <strong>{s.title}</strong>
                  <div className="text-sm text-gray-600">ID: {s.id}</div>
                  <a
                    href={`https://twitter.com/i/spaces/${s.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-black text-white text-sm rounded"
                  >Join Space</a>
                </li>
              ))
            )}
          </ul>
        </main>
      )}
    </div>
  );
}
