import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/StudentInfo.css";

export default function StudentDetail() {
  const [studentDetail, setStudentDetail] = useState({});
  const { id } = useParams();
  const URL = "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      console.log(id);
      const res = await fetch(`${URL}/student/${id}`);
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setStudentDetail(data);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="student-info">
      <h1>Student Info</h1>
      <div className="content">
        <div className="data">
          <h4>ID:</h4>
          <p>{studentDetail.id ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Name:</h4>
          <p>{studentDetail.name ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Email:</h4>
          <p>{studentDetail.email ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Phone:</h4>
          <p>{studentDetail.tel ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Academic year:</h4>
          <p>{studentDetail.academic_year ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Year of study:</h4>
          <p>{studentDetail.year_of_study ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Status:</h4>
          <p>{studentDetail.status ?? "-"}</p>
        </div>
        <div className="data">
          <h4>Adivsor:</h4>
          <p>
            {studentDetail.advisor ? (
              <Link to={`../${studentDetail.advisor.url}`}>
                {studentDetail.advisor.name}
              </Link>
            ) : (
              "-"
            )}
          </p>
        </div>
      </div>
      <div className="publiccations">
        <h4>Publications:</h4>
        {studentDetail.publications
          ? studentDetail.publications.map((e) => {
              return (
                <div className="row">
                  <a href={e.url}>{e.title}</a>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
