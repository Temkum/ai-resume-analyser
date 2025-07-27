import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Clean = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadFiles = async () => {
    try {
      const files = (await fs.readDir('./')) as FSItem[];
      setFiles(files);
    } catch (err) {
      toast.error('Failed to load files');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/clean');
    }
  }, [isLoading]);

  const handleDelete = async () => {
    try {
      for (const file of files) {
        await fs.delete(file.path);
      }
      await kv.flush();
      toast.success('App data wiped');
      setShowConfirm(false);
      await loadFiles();
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete data');
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-10">
        <img src="/images/loading.svg" alt="Loading" />
      </div>
    );
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl space-y-6 border border-gray-200 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">
            Authenticated as:{' '}
            <span className="font-medium text-indigo-600">
              {auth.user?.username}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={() => navigate(-1)}
            title="Back"
          >
            <X size={20} />
          </button>
        </div>

        {/* File List */}
        <div>
          <h2 className="text-md font-medium text-gray-700 mb-2">
            Existing Files
          </h2>
          {files.length === 0 ? (
            <p className="text-sm text-gray-500">No files found.</p>
          ) : (
            <ul className="space-y-2">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.li
                    key={file.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-700"
                  >
                    {file.name}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Delete Button */}
        <div>
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 cursor-pointer"
            onClick={() => setShowConfirm(true)}
          >
            Wipe App Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full space-y-4 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Wipe
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete all app files? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                Yes, Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clean;
