// ✅ spaXes Upgrade — Neynar Auth, Multi-User Support, Branding, Filtering, Tailwind UI

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
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <Head>
        <title>spaXes</title>
      </Head>
      <header className="text-center mb-8">
        <img src="/IMG_6172.jpeg" alt="spaXes logo" className="mx-auto w-24 h-24 mb-4" />
        <img src="/IMG_6173.jpeg" alt="spaXes banner" className="mx-auto w-full max-w-lg mb-4" />
        <h1 className="text-4xl font-bold">🎙 spaXes</h1>
        <p className="text-sm text-gray-600">Your Farcaster-powered X Spaces dashboard</p>
      </header>

      {!fid ? (
        <div className="text-center space-y-4">
          <p className="text-lg">Connect with your Farcaster account</p>
          <button
            onClick={redirectToNeynarLogin}
            className="px-6 py-2 bg-purple-600 text-white rounded shadow"
          >
            Sign in with Farcaster
          </button>
        </div>
      ) : (
        <main className="max-w-xl mx-auto">
          <h2 className="text-xl mb-2">Linked Twitter: @{username}</h2>

          <div className="flex gap-4 mb-4">
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
