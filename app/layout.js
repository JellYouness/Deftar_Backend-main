// app/layout.js
export const metadata = {
  title: "Deftar Backend API",
  description: "Deftar Backend API running on Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
