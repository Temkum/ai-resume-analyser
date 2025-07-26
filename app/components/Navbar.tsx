import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex">
      <div className="flex-1">
        <Link to="/" className="text-lg font-bold uppercase">
          Resumaid
        </Link>
      </div>
      <div className="flex-1 text-right">
        <Link to="/upload" className="text-lg font-bold ml-4 primary-button">
          Upload Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
