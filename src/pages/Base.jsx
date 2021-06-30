import React, { useContext } from "react";
import PropTypes from "prop-types";
import Div100vh, { use100vh } from "react-div-100vh";
import { MoonLoader } from "react-spinners";
import { UserContext } from "../contexts";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import Invitations from "../components/Invitations";
const colors = require("../colors").colors;

const Base = props => {

  const { loading } = props;

  const [user,] = useContext(UserContext);
  const height = use100vh();

  return (
    <Div100vh className="grid grid-rows-base grid-cols-mob-base sm:grid-cols-base">
      <Nav />
      <Sidebar />
      <main className={`bg-white h-fit overflow-scroll p-3 rounded-md mr-3 sm:p-5 shadow md:p-8 md:text-lg ${loading && "flex justify-center items-center py-16 sm:py-py-20 md:py-24 lg:py-28"}`} style={{maxHeight: height - 70}}>
        {user && user.invitations.length > 0 && <Invitations invitations={user.invitations} />}
        {loading ? <MoonLoader size="70px" color={colors.primary[600]} /> : props.children}
      </main>
    </Div100vh>
  )
};

Base.propTypes = {
  className: PropTypes.string,
  blank: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Base;