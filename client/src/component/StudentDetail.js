import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/StudentInfo.css";

import PublicationForm from "./PublicationForm";

export default function StudentDetail() {
  const [studentDetail, setStudentDetail] = useState({});
  const [isOpen, setOpen] = useState(false);
  const { id } = useParams();
  const URL = "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      // console.log(id);
      const res = await fetch(`${URL}/student/${id}`);
      // console.log(res);
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setStudentDetail(data);
      }
    }
    fetchData();
  }, []);

  async function onDelete(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/student/${id}/delete`, {
        method: "POST",
      });
      const data = await res.json();
      if (data) navigate("/students");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="student-info">
      <div className="edit-delete">
        <h1>Student Info</h1>
        <div className="butt-box">
          <button
            className="edit"
            onClick={() => {
              navigate("./update");
            }}
          >
            Edit
          </button>
          <button className="delete" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
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
      <div className="publications">
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
        {isOpen ? <PublicationForm /> : null}
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpen((e) => !e);
          }}
          className={isOpen ? "open" : null}
        >
          {isOpen ? "x" : "+"}
        </button>
      </div>
    </div>
  );
}
