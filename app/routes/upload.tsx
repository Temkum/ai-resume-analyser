import React, { type FormEvent } from 'react';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar';

const upload = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [statusText, setStatusText] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const onFileSelect = (file: File | null) => {
    setFile(file);
  };

  //   const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     setIsProcessing(true);
  //     setStatusText('Processing...');
  //   };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    onFileSelect(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget.closest('form');
    if (!form) return;

    const formData = new FormData(form);
    if (!formData) return;

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    formData.append('file', file as File);
    const companyName = formData.get('company-name');
    const jobTitle = formData.get('job-title');
    const jobDescription = formData.get('job-description');

    console.log({ file, companyName, jobTitle, jobDescription });
  };

  return (
    <main>
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-14">
          <h1 className="text-1xl font-bold mb-4">
            Smart feedback for your dream job!
          </h1>
          {isProcessing ? (
            <>
              <p className="text-lg mb-6 py-3">{statusText}</p>
              <picture>
                <img src="/loading.svg" alt="loading" />
              </picture>
            </>
          ) : (
            <p className="text-lg mb-6 py-3">
              Ready to upload your resume to get ATS score and improvement tips?
            </p>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <div className="form-div">
                <label htmlFor="company-name" className="block mb-2">
                  Company name
                </label>
                <input
                  type="text"
                  id="company-name"
                  className="input"
                  name="company-name"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title" className="block mb-2">
                  Job title
                </label>
                <input
                  type="text"
                  id="job-title"
                  className="input"
                  name="job-title"
                  placeholder="Enter job title"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description" className="block mb-2">
                  Job description
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  id="job-description"
                  className="input"
                  name="job-description"
                  placeholder="Enter job description"
                  required
                ></textarea>
              </div>
              <div className="form-div">
                <label htmlFor="resume-upload" className="block mb-2">
                  Upload your resume (PDF, DOC, DOCX):
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button type="submit" className="primary-button">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
        <div className="info-section p-1.5">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-lg mb-6">
            After uploading your resume, our AI will analyze it and provide
            feedback on how to improve it. You can then make changes and
            re-upload your resume for further analysis.
          </p>
          <p className="text-lg mb-6">
            We support various formats including PDF, DOC, and DOCX. Make sure
            your resume is well-formatted and clear for the best results.
          </p>
        </div>
        <div className="faq-section">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <ul className="faq-list">
            <li className="mb-4">
              <strong>What formats do you support?</strong> We support PDF, DOC,
              and DOCX formats for resume uploads.
            </li>
            <li className="mb-4">
              <strong>How long does it take to get feedback?</strong> Typically,
              you will receive feedback within a few minutes after uploading
              your resume.
            </li>
            <li className="mb-4">
              <strong>Can I re-upload my resume?</strong> Yes, you can make
              changes to your resume and re-upload it for further analysis and
              feedback.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default upload;
