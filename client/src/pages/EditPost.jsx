import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/CreatePosts.css';
import '../index.css';
import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const { id } = useParams(); // Corrected here

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);


  
const module ={
  toolbar: [
    [{'header': [1,2,3,4,5,6,false]}],
    ['bold','italic','underline','strike','blockquote'],
    [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
    ['link','image'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold','italic','underline','strike','blockquote',
  'list','bullet','indent',
  'link','image'
]

const POST_CATEGORIES =['Uncategorized', 'Nicosia', 'Limassol', 'Paphos','Larnaca','Ammochostos', 'Cyprus']

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`); // Changed to GET request

        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
      } catch (error) {
        console.log(error);
      }
    };

    getPost();
  }, [id]); // Added id as a dependency

  const editPost = async (e) => {
    e.preventDefault();

    try {
      const postData = new FormData();
      postData.set('title', title);
      postData.set('category', category);
      postData.set('description', description);
      postData.set('thumbnail', thumbnail);

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        navigate('/');
      } else {
        console.log('Unexpected response:', response);
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (error) {
      console.error('Error response:', error); // Log detailed error response
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <section className="create-post" style={{ marginTop: '7rem', marginBottom: '5rem' }}>
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title of Post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={module} formats={formats} value={description} onChange={setDescription} />
          <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} accept="image/png, image/jpeg" />
          <button type="submit" className="btn primary">
            Update Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;



