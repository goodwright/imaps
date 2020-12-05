import React, { useState } from "react";
import PropTypes from "prop-types";
import Base from "./Base";

const NewGroupPage = props => {

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const formSubmit = e => {
    e.preventDefault();
  }



  return (
    <Base className="new-group-page">
      <div className="page-content">     
        <h1>Create a group</h1>

        <form onSubmit={formSubmit}>
          <div className={errors.name ? "input error-input" : "input"}>
            <label htmlFor="name">group name</label>
            <div className="error-container">
              {errors.name && <div className="error">{errors.name}</div>}
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={errors.name ? "input error-input" : "input"}>
            <label htmlFor="slug">group URL</label>
            <div className="error-container">
              {errors.slug && <div className="error">{errors.slug}</div>}
              <div className="url-container">
                <div className="url">{window.location.origin}/<span className="at">@</span></div>
                <input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className={errors.name ? "input error-input" : "input"}>
            <label htmlFor="description">description</label>
            <div className="error-container">
              {errors.description && <div className="error">{errors.description}</div>}
              <input
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-button">Create Group</button>
        </form>
      </div>
    </Base>
  );
};

NewGroupPage.propTypes = {
  
};

export default NewGroupPage;