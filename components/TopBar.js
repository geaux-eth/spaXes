import Link from 'next/link';

export default function TopBar({ user }) {
  return (
    <div className="topbar" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#f3f0fa', padding: '12px 24px', borderRadius: 10, marginBottom: 24,
      boxShadow: '0 2px 8px #0001', minHeight: 56
    }}>
      <div style={{ fontWeight: 700, fontSize: 20, color: '#8456EC' }}>
        Welcome to spaXes!
      </div>
      <nav style={{ flex: 1, textAlign: 'center' }}>
        <Link href="/live"><button>Live Spaces</button></Link>{' '}
        <Link href="/hosts"><button>Farcaster Hosts</button></Link>{' '}
        <Link href="/user"><button>User Spaces</button></Link>{' '}
        <Link href="/clip-tool"><button>Clip Tool</button></Link>
      </nav>
      <div style={{ minWidth: 180, textAlign: 'right', fontSize: 15 }}>
        {user ? (
          <span>
            <b>{user.user.display_name || user.user.username}</b><br/>
            <span style={{ color: '#666', fontSize: 13 }}>FID: {user.user.fid}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
