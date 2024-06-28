import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/CreatePosts.css';
import '../index.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Nicosia'); // Default value set to 'Nicosia'
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const module = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = ['Nicosia', 'Limassol', 'Paphos', 'Larnaca', 'Ammochostos', 'Cyprus'];

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const postData = new FormData();
      postData.set('title', title);
      postData.set('category', category);
      postData.set('description', description);
      if (thumbnail) {
        postData.set('thumbnail', thumbnail);
      }

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        navigate('/');
      } else {
        console.log('Unexpected response:', response);
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error("Error response:", error); // Log detailed error response
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="create-post" style={{ marginTop: '7rem', marginBottom: '5rem' }}>
      <div className="container">
        <h2>Create Post</h2>
        {error && <div className='form__error-message'>{error}</div>}
        <form className="form create-post__form" onSubmit={createPost}>
          <input
            type="text"
            placeholder='Title of Post'
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ReactQuill modules={module} formats={formats} value={description} onChange={setDescription} />
          <input type='file' onChange={e => setThumbnail(e.target.files[0])} accept='image/png, image/jpeg' />
          <button type="submit" className='btn primary'>Upload Post</button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
