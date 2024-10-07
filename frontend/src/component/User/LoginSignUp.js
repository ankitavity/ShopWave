import React, { Fragment,useRef,useState,useEffect } from 'react';
import "./LoginSignUp.css";
import Loader from '../layout/Loader/Loader';
import {Link, useNavigate} from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import {useDispatch,useSelector} from "react-redux";
import {clearErrors,login,register} from "./../../actions/userAction";
import {useAlert} from "react-alert";
import { useLocation } from 'react-router-dom';


const LoginSignUp = () => {
    

    const dispatch = useDispatch();
    const alert = useAlert();
    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);
    const location = useLocation();
    const {error,loading,isAuthenticated} = useSelector(state=>state.user)
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    
    const [user,setUser] = useState({
        name : "",
        email : "",
        password : ""
    })

    const {name,email,password} = user;

    const [avatar,setAvatar] = useState()
    const [avatarPreview,setAvatarPreview] = useState("/Profile.png")

    const loginSubmit = (e)=>{
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
    }

    const registerSubmit = (e) =>{
        e.preventDefault();
        const myForm =new FormData();
        if(name.length<4)
        {
            alert.error('Name should be more than 4 characters');
            return;
        }

        if(name.length>30)
        {
            alert.error('Name should be more than 30 characters');
            return;
        }
        if(password.length<8)
        {
            alert.error('Password should be more than 7 characters');
            return;
        }
        if(!avatar)
        {
            alert.error('Please select image');
            return;
        }
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("password",password);
        myForm.set("avatar",avatar);
        dispatch(register(myForm))
}

const registerDataChange = (e)=>{
    if(e.target.name==="avatar")
    {
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState===2)
            {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
    else{
        setUser({...user,[e.target.name]:e.target.value})
    }
}


        const redirect=location.search ? location.search.split("=")[1] : "/account";
        // const redirect = location.pathname.includes("?") ? location.pathname.split("=")[1] : "/account";
        // const redirect = [...searchParam][0] ? (/${[...searchParam][0][1]}) : ('/account');
        useEffect(() => {
            if (error) {
                alert.error(error);
                dispatch(clearErrors());
            }
    
            if(isAuthenticated){
                navigate(redirect);
            }
        }, [dispatch, error, alert,navigate,isAuthenticated,redirect]);
        

    const switchTabs = (e,tab)=>{
        if(tab==="login")
        {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");


            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        else if(tab==="register"){
            switcherTab.current.classList.remove("shiftToNeutral");
            switcherTab.current.classList.add("shiftToRight");


            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    }


  return (
    <>
        {loading ? <Loader /> : (<Fragment>
        <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
                <div>
                    <div className="login_signUp_toggle">
                    <p onClick={(e)=>switchTabs(e,"login")}>Login</p>
                    <p onClick={(e)=>switchTabs(e,"register")}>Register</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form action="" className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                    <MailOutlineIcon />
                    <input type="email" name="email" value={loginEmail} placeholder="Email" required onChange={(e)=>setLoginEmail(e.target.value)}/>
                </div>
                <div className="loginPassword">
                    <LockOpenIcon />
                    <input type="password" placeholder='Password' required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                <input type="submit" value="Login" className='loginBtn'/>
                </form>

                <form action="" className='signUpForm' ref={registerTab} encType='multipart/form-data' onSubmit={registerSubmit}>
                <div className="signUpName">
                    <FaceIcon />
                    <input type="text" name="name" value={name} placeholder="Name" required onChange={registerDataChange}/>
                </div>
                <div className="signUpEmail">
                    <MailOutlineIcon />
                    <input type="email" name="email" value={email}  placeholder="Email" required onChange={registerDataChange}/>
                </div>
                <div className="signUpPassword">
                    <LockOpenIcon />
                    <input type="password" name="password" value={password} placeholder="password" required onChange={registerDataChange}/>
                </div>
                <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Revie" />
                    <input type="file" name='avatar' accept="image/" onChange={registerDataChange} />
                </div>
                <input type="submit" value="Register" className='signUpBtn' />
                </form>
            </div>
        </div>
    </Fragment>)}
    </>
  )
}

export default LoginSignUp
