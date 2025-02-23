import React, { useState, useEffect } from 'react';
import PostItem from '../components/PostItem';
import '../index.css';
import '../css/Posts.css'; // Assuming you add the breadcrumb styles here
import Loader from '../components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CategoryPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { category } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
                setPosts(response?.data);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };

        fetchPosts();
    }, [category]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <section className='posts' style={{ marginTop: "10rem", marginBottom: "5rem" }}>
            <h3 className="breadcrumb">
                <Link to='/'>Categories</Link>
                <span className="separator"></span>
                {category}
            </h3>
            {posts.length > 0 ? (
                <div className="container posts__container">
                    {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
                        <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} description={description} authorID={creator} createdAt={createdAt} />
                    ))}
                </div>
            ) : (
                <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>No posts found!</h2>
            )}
        </section>
    );
};

export default CategoryPosts;
