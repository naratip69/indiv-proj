import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <Link to="/students">Students list</Link>
      <Link to="/advisors">Advisors list</Link>
    </nav>
  );
}
