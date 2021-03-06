import React, { useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_GROUP } from "../mutations";
import { UserContext } from "../contexts";
import Button from "./Button";
import { createErrorObject } from "../forms";
const colors = require("../colors").colors;

const GroupInfo = props => {

  const { group, isAdmin, editing } = props;

  const nameEl = useRef(null);
  const slugEl = useRef(null);
  const descriptionEl = useRef(null);
  const [errors, setErrors] = useState({});
  const [,setUser] = useContext(UserContext);
  const history = useHistory();

  const [updateGroup, updateGroupMutation] = useMutation(UPDATE_GROUP, {
    onCompleted: data => {
      setUser(data.updateGroup.user);
      setErrors({});
      history.push(`/@${slugEl.current.innerHTML}/`);
    },
    onError: ({graphQLErrors}) => {
      setErrors(createErrorObject(errors, graphQLErrors))
    }
  });

  const updateClick = () => {
    updateGroup({
      variables: {
        id: group.id, name: nameEl.current.innerText,
        slug: slugEl.current.innerText,
        description: descriptionEl.current.innerText
      }
    })
  };

  const buttonClass = "py-0 px-2 sm:px-3 ml-2 text-xs sm:text-sm flex items-center hover:no-underline";

  return (
    <div className={`mb-8 md:mb-12 ${props.className || ""}`} onSubmit={updateClick}>
      {errors.name && <div className="text-red-800 text-sm mt-2">{errors.name}</div>}
      <h1
        className={`border-b border-opacity-0 ${editing && "outline-none w-max border-opacity-100 border-primary-200 max-w-full"} ${errors.name ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
        contentEditable={editing} suppressContentEditableWarning={editing}
        ref={nameEl}
      >{group.name}</h1>

      {errors.slug && <div className="text-red-800 text-sm -mt-2 mb-2">{errors.slug.replace("Slug", "ID")}</div>}
      <div className={`flex -mt-2 mb-2 ${editing && ""}`}>
        <div className="text-xl mr-1 text-primary-400">{group.userCount}</div>
        <svg width="30" height="30" viewBox="0 0 30 30" fill={colors.primary[200]} className="w-6">
          <path d="M14.2013 18.0578C14.1103 18.1407 14.0366 18.2407 13.9843 18.3521C13.932 18.4636 13.9022 18.5842 13.8965 18.7071C13.8909 18.8301 13.9095 18.9529 13.9514 19.0687C13.9932 19.1844 14.0575 19.2908 14.1404 19.3817C15.1636 20.5268 15.7211 22.0135 15.7032 23.5491C15.7032 24.1708 13.7454 25.3125 10.547 25.3125C7.34862 25.3125 5.39074 24.1699 5.39074 23.5483C5.38172 22.0245 5.93041 20.55 6.9334 19.4028C7.09999 19.2181 7.1864 18.9748 7.17363 18.7265C7.16086 18.4781 7.04994 18.245 6.86529 18.0784C6.68064 17.9118 6.43737 17.8254 6.18901 17.8382C5.94064 17.8509 5.70752 17.9619 5.54093 18.1465C4.22015 19.6344 3.49856 21.5596 3.51593 23.549C3.51574 25.6237 6.53834 27.1875 10.547 27.1875C14.5557 27.1875 17.5782 25.6237 17.5782 23.5491C17.5969 21.5459 16.8645 19.6084 15.5256 18.1183C15.4427 18.0272 15.3426 17.9535 15.2311 17.9011C15.1197 17.8488 14.999 17.819 14.876 17.8134C14.753 17.8078 14.6301 17.8265 14.5143 17.8684C14.3985 17.9104 14.2921 17.9747 14.2013 18.0578Z"/>
          <path d="M24.4317 12.4933C24.3494 12.4001 24.2493 12.3242 24.1374 12.2701C24.0254 12.216 23.9038 12.1847 23.7797 12.178C23.6555 12.1713 23.5313 12.1894 23.4141 12.2312C23.297 12.273 23.1894 12.3377 23.0976 12.4215C23.0057 12.5053 22.9314 12.6065 22.879 12.7193C22.8267 12.8321 22.7972 12.9541 22.7925 13.0784C22.7878 13.2026 22.8078 13.3266 22.8514 13.443C22.895 13.5595 22.9614 13.6661 23.0466 13.7566C24.0696 14.9019 24.6271 16.3885 24.6094 17.9241C24.6094 18.5458 22.6515 19.6874 19.4531 19.6874C19.2045 19.6874 18.966 19.7862 18.7902 19.962C18.6144 20.1378 18.5156 20.3763 18.5156 20.6249C18.5156 20.8736 18.6144 21.112 18.7902 21.2879C18.966 21.4637 19.2045 21.5624 19.4531 21.5624C23.4618 21.5624 26.4844 19.9987 26.4844 17.9241C26.5028 15.9209 25.7705 13.9835 24.4317 12.4933Z"/>
          <path d="M10.5469 17.8124C11.474 17.8124 12.3802 17.5375 13.1511 17.0225C13.922 16.5074 14.5228 15.7753 14.8775 14.9188C15.2323 14.0622 15.3252 13.1198 15.1443 12.2105C14.9634 11.3012 14.517 10.4659 13.8614 9.81039C13.2059 9.15483 12.3706 8.70839 11.4614 8.52753C10.5521 8.34666 9.60957 8.43949 8.75304 8.79427C7.89651 9.14906 7.16443 9.74986 6.64936 10.5207C6.13429 11.2916 5.85938 12.1979 5.85938 13.1249C5.86084 14.3677 6.35517 15.5591 7.23393 16.4379C8.11268 17.3166 9.30412 17.811 10.5469 17.8124ZM10.5469 10.3125C11.1031 10.3125 11.6469 10.4774 12.1094 10.7864C12.5719 11.0955 12.9324 11.5347 13.1453 12.0487C13.3581 12.5626 13.4138 13.1281 13.3053 13.6736C13.1968 14.2192 12.9289 14.7204 12.5356 15.1137C12.1423 15.507 11.6411 15.7749 11.0956 15.8834C10.55 15.9919 9.98449 15.9362 9.47057 15.7234C8.95666 15.5105 8.5174 15.15 8.20836 14.6875C7.89932 14.225 7.73437 13.6812 7.73437 13.1249C7.73519 12.3793 8.03177 11.6644 8.55904 11.1371C9.08631 10.6099 9.8012 10.3133 10.5469 10.3125Z"/>
          <path d="M19.4531 12.1875C20.3802 12.1875 21.2865 11.9126 22.0573 11.3975C22.8282 10.8824 23.429 10.1503 23.7838 9.2938C24.1386 8.43727 24.2314 7.49477 24.0505 6.58549C23.8697 5.6762 23.4232 4.84097 22.7677 4.18541C22.1121 3.52985 21.2769 3.08341 20.3676 2.90254C19.4583 2.72167 18.5158 2.8145 17.6593 3.16929C16.8028 3.52407 16.0707 4.12488 15.5556 4.89574C15.0405 5.66659 14.7656 6.57287 14.7656 7.49997C14.7671 8.74272 15.2614 9.93416 16.1402 10.8129C17.0189 11.6917 18.2104 12.186 19.4531 12.1875ZM19.4531 4.68747C20.0094 4.68747 20.5531 4.85242 21.0157 5.16146C21.4782 5.4705 21.8387 5.90976 22.0515 6.42367C22.2644 6.93759 22.3201 7.50309 22.2116 8.04866C22.1031 8.59423 21.8352 9.09537 21.4419 9.48871C21.0485 9.88205 20.5474 10.1499 20.0018 10.2584C19.4562 10.367 18.8907 10.3113 18.3768 10.0984C17.8629 9.88551 17.4237 9.52503 17.1146 9.06251C16.8056 8.6 16.6406 8.05623 16.6406 7.49997C16.6414 6.7543 16.938 6.03941 17.4653 5.51214C17.9926 4.98487 18.7074 4.68829 19.4531 4.68747Z"/>
        </svg>
        {isAdmin && !editing && (
          <Link
            className={`btn-tertiary text-primary-500 ${buttonClass}`}
            to={`/@${group.slug}/edit/`}
          >Edit Group</Link>
        )}
        {editing && (
          <Button onClick={updateClick} className={`btn-primary text-white ${buttonClass}`} loading={updateGroupMutation.loading}>Save Changes</Button>
        )}
        {editing && (
          <div
            className={`ml-2 text-xs sm:text-sm flex items-center border-b flex-wrap border-primary-200 ${errors.slug ? "bg-red-100" : "bg-gray-100"}`}
          >@<span className="outline-none" contentEditable={true} suppressContentEditableWarning={true} ref={slugEl}>{group.slug}</span></div>
        )}
      </div>
      
      {errors.description && <div className="text-red-800 text-sm mt-2">{errors.description}</div>}
      <p
        className={`text-sm font-light md:text-base max-w-5xl border-b border-opacity-0 ${editing && "w-max border-opacity-100 border-primary-200 outline-none max-w-full"} ${errors.description ? "bg-red-100" : editing ? "bg-gray-100" : ""}`}
        contentEditable={editing} suppressContentEditableWarning={editing}
        ref={descriptionEl}
      >{group.description}</p>
    </div>
  );
};

GroupInfo.propTypes = {
  group: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  editing: PropTypes.bool.isRequired,
};

export default GroupInfo;