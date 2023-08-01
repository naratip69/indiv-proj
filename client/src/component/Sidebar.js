import { Link, Outlet } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="page">
      <nav className="sidebar">
        <ul>
          <li>
            <h4>Data</h4>
          </li>
          <li>
            <Link to="/students">Students list</Link>
          </li>
          <li>
            <Link to="/advisors">Advisors list</Link>
          </li>
          <li>
            <Link to="/student/create">Add Student</Link>
          </li>
          <li>
            <Link to="/advisor/create">Add Advisor</Link>
          </li>
          <br />
          <li>
            <h4>Stat</h4>
          </li>
          <li>
            <Link to="/stat/enroll">#Enroll</Link>
          </li>
          <li>
            <Link to="/stat/graduated">#Graduated</Link>
          </li>
          <li>
            <Link to="/stat/notGraduatedIn2Y">#Not Graduated In Two Year</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
