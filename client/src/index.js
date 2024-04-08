import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// eslint-disable-next-line
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout'; 
import ErrorPage from './pages/ErrorPage.jsx';
import Home from './pages/Home.jsx';
import PostDetails from './pages/PostDetails.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Author from './pages/Author.jsx';
import CreatePosts from './pages/CreatePosts.jsx';
import EditPost from './pages/EditPost.jsx';
import Category from './pages/Category.jsx';
import AuthorPosts from './pages/AuthorPosts.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Logout from './pages/Logout.jsx';
import DeletePost from './pages/DeletePost.jsx';
import UserProvider from './context/UserContext.js';
const router = createBrowserRouter([
  {
    path:"/",
    element :<UserProvider> <Layout/> </UserProvider> ,
    errorElement: <ErrorPage/>,
    children:[
      {index:true , element : <Home/>},
      {path:"posts/:id" , element : <PostDetails/>},
      {path:"register" , element : <Register/>},
      {path:"login" , element : <Login/>},
      {path:"profile/:id" , element : <UserProfile/>},
      {path:"authors" , element : <Author/>},
      {path:"create" , element : <CreatePosts/>},
      {path:"posts/categories/:category" , element : <Category/>},
      {path:"posts/users/:id" , element : <AuthorPosts/>},
      {path:"myposts/:id" , element : <Dashboard/>},
      {path:"posts/:id/edit" , element : <EditPost/>},
      {path:"posts/:id/delete" , element : <DeletePost/>},
      {path:"logout" , element : <Logout/>},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    {/* <h1></h1> */}
  </React.StrictMode>
);
