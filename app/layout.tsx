import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: 'Inventory Management System',
  description: 'A comprehensive inventory management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
