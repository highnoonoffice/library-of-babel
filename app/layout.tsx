import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Library of Babel',
  description: 'Every text that has ever been written — or ever will be — already exists at a fixed address.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#060402', height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}