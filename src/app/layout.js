import "../style/globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { ModalProvider } from "../context/modalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}