import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import TopBar from '../components/TopBar';

const FarcasterLogin = dynamic(() => import('../components/FarcasterLogin'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: 24 }}>
      <TopBar user={user} />
      <FarcasterLogin onLogin={setUser} />
      <p style={{ textAlign: 'center' }}>Welcome! Use the navigation above to explore Twitter Spaces and use the Clip Tool.</p>
    </div>
  );
}
// trigger redeploy
//force redeploy
// force redeploy
// force redeploy