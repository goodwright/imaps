import React from "react";
import { Link } from "react-router-dom";

const MiniLogo = () => {
  return (
    <Link className="mini-logo"  to="/">
      <svg width="19" height="30" viewBox="9 9 19 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)">
        <rect x="13.6719" y="24.2656" width="3.0314" height="16.8105" fill="#7A6ADB"/>
        <rect x="19.5908" y="24.2656" width="3.0314" height="16.8105" fill="#7A6ADB"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M19.8709 27.8495C24.254 27.0676 27.5813 23.2369 27.5813 18.629C27.5813 13.4562 23.3879 9.2627 18.215 9.2627C13.0421 9.2627 8.84863 13.4562 8.84863 18.629C8.84863 23.2369 12.176 27.0676 16.5591 27.8495V24.6155C13.9335 23.8908 12.0053 21.4851 12.0053 18.629C12.0053 15.1995 14.7855 12.4194 18.215 12.4194C21.6445 12.4194 24.4247 15.1995 24.4247 18.629C24.4247 21.4851 22.4965 23.8908 19.8709 24.6155V27.8495Z" fill="#7A6ADB"/>
        </g>
        <defs>
        <clipPath id="clip0">
          <rect width="77" height="47.1935" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    </Link>
  );
};

MiniLogo.propTypes = {
  
};

export default MiniLogo;