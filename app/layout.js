import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export const metadata = {
  title: "Cartes de la nation",
  description: "Chicken Nation",
  icons: {
		icon: "/favicon.png",
		apple: "/favicon.png",
	},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body
        className='antialiased font-roboto'
      >
        {children}
        <Toaster
					position="bottom-right"
				/>
      </body>
    </html>
  );
}
