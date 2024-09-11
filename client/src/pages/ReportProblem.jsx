import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';
import '../css/ReportProblem.css'; // Import the CSS file

const ReportProblem = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const postId = params.get('postId');
  const commentId = params.get('commentId'); // Extract commentId from the query params
  console.log(commentId);
  const [reportContent, setReportContent] = useState('');
  const [reportReason, setReportReason] = useState(''); // New state for the reason
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      post_id: postId,
      comment_id: commentId, // Include the commentId in the templateParams
      reason: reportReason,
      message: reportContent,
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID_SUPPORT,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID_SUPPORT,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID_SUPPORT
    )
    .then(() => {
      setEmailSent(true);
      setReportContent('');
      setReportReason(''); // Reset the reason selection
    })
    .catch((error) => {
      console.error('Email send error:', error);
      alert('There was an error sending your report. Please try again later.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="report-a-problem" style={{ marginTop: '10rem', marginBottom: '5rem' }}>
      <h2>Report a Problem</h2>
      {emailSent ? (
        <p>Thank you for your report. We will look into this issue.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            required
          >
            <option value="" disabled>Select a reason...</option>
            <option value="spam">Spam or irrelevant content</option>
            <option value="abuse">Abusive or harmful content</option>
            <option value="misinformation">Misinformation or false information</option>
            <option value="copyright">Copyright infringement</option>
            <option value="other">Other</option>
          </select>
          <textarea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder="Provide additional details..."
            rows="5"
            required
          />
          <button type="submit" className="btn submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportProblem;
