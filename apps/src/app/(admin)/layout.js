export const metadata = {
  title: "Admin Panel | RenoAI",
  description: "RenoAI Administration Panel",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
