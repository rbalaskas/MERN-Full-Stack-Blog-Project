import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../css/CreatePosts.css'
import '../index.css'

const CreatePost = () => {

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')

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

  const POST_CATEGORIES =['Nicosia', 'Limassol', 'Paphos','Larnaca','Ammochostos', 'Cyprus']

  return (
    <section className="create-post" style={{marginTop:'7rem',marginBottom:'5rem'}}>
      <div className="container">
        <h2>Create Post</h2>
        <p className="form__error-message">
          Something went wrong
        </p>
        <form className="form create-post__form">
          <input 
            type="text" 
            placeholder='Title of Post'
            value={title} 
            onChange={e => setTitle(e.target.value)} // Corrected here
            autoFocus
          />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={module} formats={formats} value={description} onChange={setDescription}/>
          <input type='file' onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg'/>
          <button type="submit" className='btn primary'>Upload Post</button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost
