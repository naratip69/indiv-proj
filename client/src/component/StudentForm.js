import React, { useState, useEffect } from "react";
import "../styles/StudentForm.css";
import { Navigate } from "react-router-dom";

export default function StudentForm() {
  const [advisors, setAdvisors] = useState([]);
  const [student, setStudent] = useState({});
  const [inputStatus, setInputStatus] = useState("have Advisor");
  const [postData, setPostData] = useState({});
  const [onSend, setOnSend] = useState(false);
  const [resp, setResp] = useState({});
  const [firstName, setFirstName] = useState();
  const [familyName, setFamilyName] = useState();
  const [academicYear, setAcademicYear] = useState();
  const [email, setEmail] = useState();
  const [tel, setTel] = useState();

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
      try {
        const res = await fetch(`${URL}${path}`);
        const data = await res.json();
        setAdvisors((e) => data["advisors"]);
        setStudent((current) => data["student"]);
        // console.log(data["advisors"], data.student);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (student) {
      setInputStatus(student.status);
      setFirstName(student.first_name);
      setFamilyName(student.family_name);
      setAcademicYear(student.academic_year);
      setEmail(student.email);
      setTel(student.tel);
    }
  }, [student]);

  async function post(e) {
    e.preventDefault();
    const form = document.querySelector(".form-data");
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    setOnSend(true);
    // console.log("data", formData);
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
            value={student ? student.id : null}
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
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="family-name">Family name</label>
          <input
            id="family-name"
            type="text"
            name="family_name"
            value={familyName}
            onChange={(e) => {
              setFamilyName(e.target.value);
            }}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="academic-year">Academic year</label>
          <input
            id="academic-year"
            type="number"
            name="academic_year"
            value={academicYear}
            onChange={(e) => {
              setAcademicYear(e.target.value);
            }}
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="tel">Phone Number</label>
          <input
            id="tel"
            type="tel"
            name="tel"
            value={tel}
            onChange={(e) => {
              setTel(e.target.value);
            }}
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
          <label htmlFor="advisor">Adivsor</label>
          <select
            id="advisor"
            name="advisor"
            disabled={inputStatus === "no Advisor"}
          >
            {student
              ? advisors.map((e) => (
                  <option
                    value={e._id}
                    selected={"" + student.advisor === "" + e._id}
                    disabled={inputStatus === "no Advisor"}
                  >
                    {e.name}
                  </option>
                ))
              : advisors.map((e) => (
                  <option value={e._id} disabled={inputStatus === "no Advisor"}>
                    {e.name}
                  </option>
                ))}
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
