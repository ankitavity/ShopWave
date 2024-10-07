import React, { Fragment, useState, useEffect } from 'react';
import "./UpdateProfile.css";
import Loader from '../layout/Loader/Loader';
// import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, updateProfile } from "./../../actions/userAction";
import { useAlert } from "react-alert";
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE_RESET } from '../../actions/constants/userConstants';
import MetaData from "./../layout/MetaData";



const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { user } = useSelector(state => state.user)
    const { error, isUpdated, loading } = useSelector(state => state.profile)
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png")

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");


    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);
        dispatch(updateProfile(myForm))

    }

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }


    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url)
        }
        if (error) {
            console.log("Hello");
            alert.error(error);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());
            navigate("/account");
            dispatch({
                type: UPDATE_PROFILE_RESET,

            })
        }

    }, [dispatch, error, alert, navigate, user, isUpdated])

    return (
        <>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="Update Profile" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                            <form action="" className='updateProfileForm' encType='multipart/form-data' onSubmit={updateProfileSubmit}>
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input type="text" name="name" value={name} placeholder="Name" required onChange={(e) => (setName(e.target.value))} />
                                </div>
                                <div className="updateProfileEmail">
                                    <MailOutlineIcon />
                                    <input type="email" name="email" value={email} placeholder="<EMAIL>" required onChange={(e) => (setEmail(e.target.value))} />
                                </div>
                                <div id="updateProfileImage">
                                    <img src={avatarPreview} alt="Avatar Revie" />
                                    <input type="file" name='avatar' accept="image/*" onChange={updateProfileDataChange} />
                                </div>
                                <input type="submit" value="Update" className='updateProfileBtn' />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </>
    )
}

export default UpdateProfile
