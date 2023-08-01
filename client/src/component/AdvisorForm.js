import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function AdvisorForm() {
  const [advisor, setAdvisor] = useState({});
  const [inputStatus, setInputStatus] = useState("");
  const [postData, setPostData] = useState({});
  const [onSend, setOnSend] = useState(false);
  const [firstName, setFirstName] = useState();
  const [familyName, setFamilyName] = useState();
  const [email, setEmail] = useState();

  const URL = "http://localhost:5000";
  const path = window.location.pathname;
  const pathArray = path.split("/");
  const status = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
  ];

  useEffect(() => {
    // console.log(path);
    async function fetchData() {
      const res = await fetch(`${URL}${path}`);
      if (res.ok) {
        const data = await res.json();
        setAdvisor(data.advisor);
      }
    }
    if (pathArray.length === 4) fetchData();
  }, []);

  useEffect(() => {
    if (advisor) {
      setFirstName(advisor.first_name);
      setFamilyName(advisor.family_name);
      setEmail(advisor.email);
    }
  }, [advisor]);

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
      setPostData(resData.advisor);
    }
  }

  return (
    <div className="advisor-form">
      {postData.url ? <Navigate to={`..${postData.url}`} /> : null}
      <h1>
        {pathArray.length === 3
          ? `Create ${pathArray[1]}`
          : `Update ${pathArray[1]}`}
      </h1>
      <form className="form-data" onSubmit={post}>
        <div className="form-row" onSubmit={post}>
          <label htmlFor="first-name">First name</label>
          <input
            id="first-name"
            type="text"
            name="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            onChange={(e) => setFamilyName(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <div className="form-row">
          <label htmlFor="academic-title">Academic title</label>
          <select id="academic-title" name="academic_title">
            {advisor.academic_title
              ? status.map((e) => (
                  <option value={e} selected={advisor.academic_title === e}>
                    {e}
                  </option>
                ))
              : status.map((e) => <option value={e}>{e}</option>)}
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
