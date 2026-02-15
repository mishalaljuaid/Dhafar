import "./globals.css";

export const metadata = {
  title: "صندوق ظفر | Dhefar Fund",
  description: "صندوق ظفر - إقامة الزواج الجماعي ورعاية الأيتام والأعمال الاجتماعية",
  keywords: "صندوق ظفر, عائلي, زواج جماعي, رعاية أيتام, تبرع",
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
