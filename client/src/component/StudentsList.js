import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/StudentList.css";

export default function StudentsList() {
  const [students, setStudents] = useState([{}]);
  const URL = "http://localhost:5000";
  const status = [
    "no Advisor",
    "have Advisor",
    "done proposal exam",
    "finished exam",
    "graduated",
  ];

  async function fetchData() {
    const res = await fetch(`${URL}/students`);
    // console.log(res);
    const data = await res.json();
    // console.log(data);
    setStudents(data.students);
    // console.log(students);
  }

  async function applyFilter(e) {
    e.preventDefault();
    const form = document.querySelector(".filter");
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const res = await fetch(`${URL}/students`, { method: "POST", body: data });
    // console.log(res);
    const resData = await res.json();
    // console.log(resData);
    setStudents((e) => resData.students);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="students-list">
      <h1>Students</h1>
      <form className="filter" onSubmit={applyFilter}>
        <div className="form-row">
          <label htmlFor="status">Status:</label>
          <select
            type="select"
            placeholder="Select Status"
            name="status"
            id="status"
          >
            {status.map((e) => (
              <option value={e}>{e}</option>
            ))}
            <option value={"undefined"} selected>
              None
            </option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="yearOfStudy">Year of Study:</label>
          <input
            id="yearOfStudy"
            name="year_of_study"
            type="number"
            min={0}
            value={undefined}
          ></input>
        </div>
        <div className="form-row">
          <button type="submit">Apply</button>
        </div>
      </form>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Academic Year</th>
          <th>Year of Study</th>
          <th>Email</th>
          <th>Phone</th>
          <th>status</th>
        </tr>
        {students.length
          ? students.map((e) => {
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
            })
          : null}
      </table>
    </div>
  );
}
