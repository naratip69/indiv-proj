import { Link, Outlet } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="page">
      <nav className="sidebar">
        <ul>
          <li>
            <Link to="/students">Students list</Link>
          </li>
          <li>
            <Link to="/advisors">Advisors list</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
