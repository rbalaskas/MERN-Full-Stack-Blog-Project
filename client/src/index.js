import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import AuthorPosts from './pages/AuthorPosts';
import CategoryPosts from './pages/CategoryPosts';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import Logout from './pages/Logout';
import DeletePost from './pages/DeletePost';
import UserProvider from './context/userContext';
import Advertisement from './pages/Advertisement';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import VerifyEmailComponent from './pages/VerifyEmailComponent';
import TermsAndConditions from './pages/TermsAndConditions';
import ReportProblem from './pages/ReportProblem';

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children:[
      {index: true, element:<Home/>},
      {path: "posts/:id", element:<PostDetail/>},
      {path: "register", element:<Register/>},
      {path: "login", element:<Login/>},
      {path: "profile/:id", element:<UserProfile/>},
      {path: "authors", element:<Authors/>},
      {path: "create", element:<CreatePost/>},
      {path: "posts/categories/:category", element:<CategoryPosts/>},
      {path: "posts/users/:id", element:<AuthorPosts/>},
      {path: "myposts/:id", element:<Dashboard/>},
      {path: "posts/:id/edit", element:<EditPost/>},
      {path: "posts/:id/delete", element:<DeletePost/>},
      {path: "logout", element:<Logout/>},
      {path: "register", element:<Register/>},
      {path: "advertisment", element:<Advertisement/>},
      {path: "FAQ", element:<FAQ/>},
      {path: "Support", element:<Support/>},
      {path: "verify-email", element:<VerifyEmailComponent/>},
      {path: "termsandconditions", element:<TermsAndConditions/>},
      {path: "report-a-problem", element:<ReportProblem/>}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

