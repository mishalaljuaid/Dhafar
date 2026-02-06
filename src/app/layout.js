import "./globals.css";

export const metadata = {
  title: "صندوق ظفر | Dhafar Fund",
  description: "صندوق ظفر الخيري العائلي - إقامة الزواج الجماعي ورعاية الأيتام والأعمال الخيرية",
  keywords: "صندوق ظفر, خيري, زواج جماعي, رعاية أيتام, تبرع",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
