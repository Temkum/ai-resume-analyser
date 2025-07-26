import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <Link to="/" className="text-lg font-bold uppercase">
        Resumaid
      </Link>
      <Link to="/upload" className="text-lg font-bold ml-4 btn btn-primary">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
