import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const SuccessAlert = ({ message }) => {
    return (
        <div className="alert alert-success" role="alert">
            {message}
        </div>
    );
};

const UserProfile = () => {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmNewpassword, setconfirmNewPassword] = useState('');
    const [isAvatarTouched, setIsAvatarTouched] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${currentUser.id}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
                const { name, email, avatar } = response.data;
                setName(name);
                setEmail(email);
                setAvatar(avatar);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [currentUser.id, token]);

    const changeAvatarHandler = async () => {
        setIsAvatarTouched(false);
        try {
            const postData = new FormData();
            postData.set('avatar', avatar);
            const response = await axios.post(`http://localhost:5000/api/user/change-avatar`, postData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
            setAvatar(response?.data.avatar);
            setSuccessMessage('Avatar updated successfully');
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserDetails = async (e) => {
        e.preventDefault();
        try {
            const UserData = new FormData();
            UserData.set('name', name);
            UserData.set('email', email);
            UserData.set('CurrentPassword', currentPassword);
            UserData.set("NewPassword", newpassword);
            UserData.set("ConfirmPassword", confirmNewpassword);
            const response = await axios.patch("http://localhost:5000/api/user/edit-user", UserData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 200) {
                setSuccessMessage('Credentials updated successfully');
                setTimeout(() => {
                    navigate('/logout');
                }, 3000);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <section className="profile">
            <div className="container profile__container">
                <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>
                {successMessage &&  <p className="form__error-message">{successMessage}</p>}
                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile__avatar">
                            <img src={`http://localhost:5000/uploads/${avatar}`} alt="" />
                        </div>
                        <form className="avatar__form">
                            <input type="file" name='avatar' id='avatar' onChange={e => setAvatar(e.target.files[0])} accept='png , jpg , jpeg' />
                            <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
                        </form>
                        {isAvatarTouched && <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck /></button>}
                    </div>
                    <h1>{currentUser.name}</h1>
                    <form className="form profile__info" onSubmit={updateUserDetails}>
                        {error && <p className="form__error-message">{error}</p>}
                        <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
                        <input type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="password" placeholder='Current Password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <input type="password" placeholder='New Password' value={newpassword} onChange={e => setNewPassword(e.target.value)} />
                        <input type="password" placeholder='Confirm new password' value={confirmNewpassword} onChange={e => setconfirmNewPassword(e.target.value)} />
                        <button type='submit' className='btn primary'>Update details</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;
