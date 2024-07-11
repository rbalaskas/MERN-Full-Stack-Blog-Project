import React, { useState } from 'react';
import '../css/FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questionsAnswers = [
    {
      question: "How often is new content posted?",
      answer: "The frequency of new posts depends on the users of the O Koutsompolis website. Stories, news, and gossip are written by people like you. We encourage everyone to contribute and share their updates regularly."
    },
    {
      question: "Can I submit a story or tip?",
      answer: "Yes, we welcome story submissions and tips from our readers. You can post anything you like about any topic related to Cyprus or a specific city. However, please be kind and avoid using dirty words or disrespectful language."
    },
    {
      question: "How can I subscribe to your newsletter?",
      answer: "You can subscribe to our newsletter by entering your email address in the subscription form on our homepage."
    },
    {
      question: "Do you have a mobile app?",
      answer: "No, we don't have a mobile app at the moment, but we are planning to develop one in the future. Stay tuned for updates!"
    },
    {
      question: "How can I advertise on your site?",
      answer: "For advertising inquiries, please visit our <a href='/advertisment'>advertising page</a> for more information."
    },
    {
      question: "Can I comment on articles?",
      answer: "Yes, you can comment on articles by creating an account and logging in. We encourage healthy and respectful discussions."
    },
    {
      question: "How do I report an error or correction?",
      answer: "If you find an error in one of our articles, please contact us with the details so we can make the necessary corrections."
    },
    {
      question: "Do you have a social media presence?",
      answer: "Yes, you can follow us on <a href='https://www.facebook.com/profile.php?id=61562139445464'>Facebook</a>, <a href='https://www.instagram.com/o_koutsompolis'>Instagram</a> , TikTok and other social media platforms for the latest updates and behind-the-scenes content."
    },
    {
      question: "How can I contact the editorial team?",
      answer: "You can contact our editorial team through the contact form on our website or by emailing editor@example.com."
    },
    {
      question: "Can I share your articles on my website or social media?",
      answer: "Yes, you can share our articles on your website or social media, but please provide proper attribution and a link back to the original article."
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const renderAnswer = (answer) => {
    return { __html: answer };
  };

  return (
    <div className="faq-container" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <h2>Frequently Asked Questions</h2>
      <ul className="faq-list">
        {questionsAnswers.map((item, index) => (
          <li key={index} className="faq-item">
            <button className="faq-question" onClick={() => toggleAnswer(index)}>
              {item.question}
            </button>
            {activeIndex === index && (
              <div
                className="faq-answer"
                dangerouslySetInnerHTML={renderAnswer(item.answer)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
