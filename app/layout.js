import './globals.css'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'] })

export const metadata = {
  title: 'إتجاه القبلة',
  description: 'اتجاه قبلة المسلمين في الصلاة',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className={cairo.className}>{children}</body>
    </html>
  )
}
