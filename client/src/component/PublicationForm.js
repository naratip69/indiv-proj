import React, { useState, useEffect } from "react";

export default function PublicationForm() {
  return (
    <form className="publication-form">
      <div className="form-row">
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" type="text"></input>
      </div>
      <div className="form-row">
        <label htmlFor="url">url:</label>
        <input id="url" name="url" type="text"></input>
      </div>
      <div className="form-row">
        <button type="submit">Add</button>
      </div>
    </form>
  );
}
