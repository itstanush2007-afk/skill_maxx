import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillMaxx - Student Skill Swapping & Project Collaboration',
  description:
    'Swap technical and creative skills with peers on campus. Form hackathon teams and learn through peer mentorship.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
