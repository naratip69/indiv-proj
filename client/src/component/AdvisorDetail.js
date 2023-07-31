import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AdvisorDetail() {
  const [advisorDetail, setAdvisorDetail] = useState({});
  const [students, setStudents] = useState([]);
  const { id } = useParams();
  const URL = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${URL}/advisor/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAdvisorDetail(data.advisor);
        console.log(data.students);
        setStudents(data.students);
        console.log(students);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="advisor-info">
      <h1>Advisor Info</h1>
      <div className="content">
        <div className="data">
          <h4>Name:</h4>
          <p>{advisorDetail.name ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Email:</h4>
          <p>{advisorDetail.email ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Academic title:</h4>
          <p>{advisorDetail.academic_title ?? "-"}</p>
        </div>
      </div>
      <div className="students">
        <h4>Students in advised:</h4>
        {students ? (
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Academic year</th>
              <th>Year of study</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
            {students.map((e) => {
              return (
                <tr>
                  <td>{<Link to={`..${e.url}`}>{e.id}</Link> ?? "-"}</td>
                  <td>{e.name ?? "-"}</td>
                  <td>{e.academic_year ?? "-"}</td>
                  <td>{e.year_of_study ?? "-"}</td>
                  <td>{e.email ?? "-"}</td>
                  <td>{e.tel ?? "-"}</td>
                  <td>{e.status ?? "-"}</td>
                </tr>
              );
            })}
          </table>
        ) : null}
      </div>
    </div>
  );
}
