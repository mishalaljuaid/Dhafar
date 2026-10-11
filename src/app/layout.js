import "./globals.css";

export const metadata = {
  title: "صندوق ظفر | Dhefar Fund",
  description: "صندوق ظفر - صندوق عائلي تأسس بهدف تعزيز التكافل الاجتماعي بين أفراد العائلة والمساهمة في خدمة المجتمع من خلال مجموعة متنوعة من البرامج والمبادرات.",
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
