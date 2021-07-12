import React, { useState } from "react";
import { useHistory } from "react-router";
import { useMutation } from "@apollo/client";
import { useDocumentTitle } from "../hooks";
import { CREATE_GROUP } from "../mutations";
import { USER } from "../queries";
import { useContext } from "react";
import { UserContext } from "../contexts";
import { createErrorObject } from "../forms";
import Base from "./Base";
import Button from "../components/Button";

const NewGroupPage = () => {

  useDocumentTitle("iMaps - New Group");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);

  const [createGroup, createGroupMutation] = useMutation(CREATE_GROUP, {
    refetchQueries: [{query: USER}, {query: USER, variables: {username: user.username}}],
    onCompleted: data => {
      setUser(data.createGroup.user);
      history.push(`/@${data.createGroup.group.slug}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const formSubmit = e => {
    e.preventDefault();
    createGroup({
      variables: {name, slug, description}
    })
  }

  const rowClass = "flex items-center mb-8 w-full"
  const offset = "ml-16 pl-2 sm:ml-20";
  const labelClass = "mr-2 block w-16 whitespace-nowrap text-xs block text-right md:text-sm md:w-20";
  const inputClass = "bg-gray-100 flex-grow";
  const errorClass = `${offset} text-red-800 text-sm mb-1`;

  return (
    <Base>
      <div className="max-w-2xl">
        <h1>Create a group</h1>
        <p className="font-light mb-8">
          Groups are how you organise the members of your lab or organisation.
          You can make data available to just members of your group if you like,
          as well as make it your public profile for showing your previous research.
        </p>  

        <form onSubmit={formSubmit}>

          {errors.name && <div className={errorClass}>{errors.name}</div>}
          <div className={rowClass}>
            <label htmlFor="name" className={labelClass}>group name</label>
            <input
              id="name"
              className={`${inputClass} ${errors.name && "error"}`}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {errors.slug && <div className={errorClass}>{errors.slug.replace("Slug", "ID")}</div>}
          <div className={rowClass}>
            <label htmlFor="slug" className={labelClass}>group URL</label>
            <div className={`${inputClass} ${errors.slug && "bg-red-100 text-red-700"} flex items-center rounded relative`}>
              <div className="absolute left-0 -top-7 text-xs opacity-50 sm:pl-2 sm:static relative z-10">{window.location.origin}/<span className="at">@</span></div>
              <input
                id="slug"
                className={`${inputClass} ${errors.slug && "bg-red-100 text-red-700"} absolute w-full sm:-ml-2 sm:static`}
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          {errors.description && <div className={errorClass}>{errors.description}</div>}
          <div className={rowClass}>
            <label htmlFor="description" className={labelClass}>description</label>
            <input
              id="description"
              className={`${inputClass} ${errors.description && "error"}`}
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div className={offset}>
            <Button type="submit" className="btn-primary py-2 sm:py-3" loading={createGroupMutation.loading}>
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </Base>
  );
};

NewGroupPage.propTypes = {
  
};

export default NewGroupPage;