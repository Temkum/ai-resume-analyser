import { FileUp, X } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from 'utilities/format-size';

// Import your SVG files
import PdfIcon from '/images/pdf.svg';
import DocxIcon from '/images/docx.svg';
import DocIcon from '/images/doc.svg';
import TxtIcon from '/images/txt.svg';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFileSelect(newFiles);
    },
    [files, onFileSelect]
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      onFileSelect(updatedFiles);
    },
    [files, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10000000,
    onDropRejected: () => {
      alert('File size should be less than 10MB');
    },
  });

  // Function to get the appropriate icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return <img src={PdfIcon} alt="PDF" className="w-4 h-4" />;
      case 'docx':
        return <img src={DocxIcon} alt="DOCX" className="w-4 h-4" />;
      case 'doc':
        return <img src={DocIcon} alt="DOC" className="w-4 h-4" />;
      case 'txt':
        return <img src={TxtIcon} alt="TXT" className="w-4 h-4" />;
      default:
        return <FileUp size={16} stroke="#6B7280" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className="w-full border-dashed border-2 border-gray-400 p-4 transition-colors hover:border-gray-500"
      >
        <input {...getInputProps()} />

        <div className="space-y-3 cursor-pointer">
          <div className="mx-auto w-15 flex h-16 items-center justify-center">
            <FileUp
              size={32}
              stroke="#8E97C5"
              className="transition-transform"
            />
          </div>
          <p className="text-center text-gray-600">
            {isDragActive
              ? 'Drop your files here...'
              : 'Drag & drop your resume here, or click to select files (Max 10MB)'}
          </p>
        </div>
        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-2/5"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
