import React, { useState, useEffect } from "react";
import advisor from "../../../server/models/advisor";

export default function AdvisorList() {
  const [advisors, setAdvisors] = useState([{}]);
  const URL = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${URL}/advisos`);
      const data = await res.json();
      setAdvisors(data);
    }
  }, []);

  return (
    <div className="advisors-list">
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
                  <td>{e.name ?? "-"}</td>
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
