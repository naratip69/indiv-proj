import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PublicationForm() {
  const [onSend, setOnSend] = useState(false);
  const URL = "http://localhost:5000";
  const { id } = useParams();

  async function submit(e) {
    e.preventDefault();
    const form = document.querySelector(".publication-form");
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    setOnSend(true);
    const res = await fetch(`${URL}/student/${id}/addPublication`, {
      method: "POST",
      body: data,
    });
    if (res.ok) {
      const resData = await res.json();
      setOnSend(false);
    }
  }
  return (
    <form className="publication-form" onSubmit={submit}>
      <div className="form-row">
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" type="text"></input>
      </div>
      <div className="form-row">
        <label htmlFor="url">url:</label>
        <input id="url" name="url" type="url"></input>
      </div>
      <div className="form-row">
        <button type="submit" disabled={onSend}>
          Add
        </button>
      </div>
    </form>
  );
}
