import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>404 – Page Not Found</h1>
      <p>
        Go back to <Link href='/'>home</Link>.
      </p>
    </main>
  );
}
