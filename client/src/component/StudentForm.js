import React, { useState, useEffect } from "react";
import "../styles/StudentForm.css";
import { Navigate } from "react-router-dom";

export default function StudentForm() {
  const [advisors, setAdvisors] = useState([]);
  const [student, setStudent] = useState([]);
  const [inputStatus, setInputStatus] = useState("");
  const [postData, setPostData] = useState({});
  const [onSend, setOnSend] = useState(false);

  const URL = "http://localhost:5000";
  const path = window.location.pathname;
  const pathArray = path.split("/");
  const status = [
    "no Advisor",
    "have Advisor",
    "done proposal exam",
    "finished exam",
    "graduated",
  ];

  useEffect(() => {
    // console.log(path);
    async function fetchData() {
      const res = await fetch(`${URL}${path}`);
      if (res.ok) {
        const data = await res.json();
        setAdvisors(data.advisors);
        setStudent(data.student);
        // console.log(advisors, student);
      }
    }
    fetchData();
  }, []);

  async function post(e) {
    e.preventDefault();
    const form = document.querySelector(".form-data");
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    setOnSend(true);
    const res = await fetch(`${URL}${path}`, { method: "POST", body: data });
    // console.log(res);
    const resData = await res.json();
    await setOnSend(false);
    if (resData.errors) {
      resData.errors.map(console.log);
    } else {
      setPostData(resData);
    }
  }

  return (
    <div className="student-form">
      {postData.url ? <Navigate to={`..${postData.url}`} /> : null}
      <h1>
        {pathArray.length === 3
          ? `Create ${pathArray[1]}`
          : `Update ${pathArray[1]}`}
      </h1>
      <form className="form-data" onSubmit={post}>
        <div className="form-row">
          <label htmlFor="id">Student ID</label>
          <input
            id="id"
            type="text"
            name="id"
            value={student ? student._id : null}
            disabled={student}
            minLength={10}
            maxLength={10}
            required
          ></input>
        </div>
        <div className="form-row" onSubmit={post}>
          <label htmlFor="first-name">First name</label>
          <input
            id="first-name"
            type="text"
            name="first_name"
            value={student ? student.first_name : null}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="family-name">Family name</label>
          <input
            id="family-name"
            type="text"
            name="family_name"
            value={student ? student.family_name : null}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="academic-year">Academic year</label>
          <input
            id="academic-year"
            type="number"
            name="academic_year"
            value={student ? student.academic_year : null}
            min={0}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={student ? student.email : null}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="tel">Phone Number</label>
          <input
            id="tel"
            type="tel"
            name="tel"
            value={student ? student.tel : null}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            onChange={(e) => {
              setInputStatus(e.target.value);
            }}
          >
            {student
              ? status.map((e) => (
                  <option value={e} selected={student.status === e}>
                    {e}
                  </option>
                ))
              : status.map((e) => (
                  <option value={e} selected={e === "have Advisor"}>
                    {e}
                  </option>
                ))}
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="status">Adivsor</label>
          <select
            id="advisor"
            name="advisor"
            disabled={inputStatus === "no Advisor"}
          >
            {student
              ? advisors.map((e) => (
                  <option
                    value={e._id}
                    selected={student.advisor.toSting() === e.toSting()}
                  >
                    {e.name}
                  </option>
                ))
              : advisors.map((e) => <option value={e._id}>{e.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <button type="submit" disabled={onSend}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}