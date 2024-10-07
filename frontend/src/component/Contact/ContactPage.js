import React, { useEffect, useState } from 'react'
import "./ContactPage.css"
import { clearErrors, contactAdmin } from '../../actions/userAction'
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';

const ContactPage = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const { loading, isSent, error } = useSelector((state) => state.contactuser)
    const alert = useAlert();

    const contactSubmit = async (e) => {
        e.preventDefault();
        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("subject", subject);
        myForm.set("phoneNo", phoneNo);
        myForm.set("message", message);
        dispatch(contactAdmin(myForm));
    }

    useEffect(() => {
        if (isSent) {
            alert.success("Message Sent Successfully");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setPhoneNo("");
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }


    }, [isSent, error, dispatch])



    return (loading ?
        <Loader /> : <>
            <section className="contact" id="contact">
                <h2 className="heading">Contact <span>Me</span></h2>

                <form onSubmit={contactSubmit}>
                    <div className="input-box">
                        <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-box">
                        <input type="number" placeholder="Mobile Number" required value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                        <input type="text" placeholder="Email Subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>

                    <textarea name="" id="" cols="30" rows="10" placeholder="Your Message" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

                    <input type="submit" value="Send Message" className="btn" />
                </form>
            </section>
        </>);

}

export default ContactPage;
