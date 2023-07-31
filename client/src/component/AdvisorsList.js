import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdvisorsList() {
  const [advisors, setAdvisors] = useState([{}]);
  const URL = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${URL}/advisors`);
      // console.log(res);
      const data = await res.json();
      setAdvisors(data.advisors);
    }
    fetchData();
  }, []);

  return (
    <div className="advisors-list">
      <h1>Advisors</h1>
      <table>
        <tr>
          <th>Name</th>
          <th>Academic Title</th>
          <th>Email</th>
        </tr>
        {advisors.length
          ? advisors.map((e) => {
              return (
                <tr>
                  <td>{<Link to={`..${e.url}`}>{e.name}</Link> ?? "-"}</td>
                  <td>{e.academic_title ?? "-"}</td>
                  <td>{e.email ?? "-"}</td>
                </tr>
              );
            })
          : null}
      </table>
    </div>
  );
}
