import "./globals.css";
import Header from "@/app/components/header";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'sileo';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Header />
          <Toaster position="top-center" theme="dark" options={{
            fill: "#171717",
            styles: { description: "text-white/75!" },
          }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}