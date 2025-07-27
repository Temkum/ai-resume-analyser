import { Link, useLocation } from 'react-router';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight hover:text-indigo-400 transition-colors"
        >
          Resumaid
        </Link>

        {/* Upload CTA */}
        {location.pathname !== '/upload' && (
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-white font-medium shadow-sm"
          >
            Upload Resume
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
