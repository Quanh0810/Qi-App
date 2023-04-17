import { Button, Col, Form, Input, message, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Contact() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { name, email, subject, message } = state;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please provide value in each input field");
    } else {
      // firebaseDB.child("contacts").push(state);
      setState({ name: "", email: "", subject: "", message: "" });
      toast.success("Form Submitted Successfully");
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <PageTitle title="Send us a message"></PageTitle>
      <div className="divider"></div>

      <section className="contact-section">
      <div className="container">
        <ToastContainer position="top-center" />
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="wrapper">
              <div className="item-center">
                <div className="col-6 item-child">
                  <div className="contact-wrap w-100 p-lg-5 p-4">
                    <h3 className="mb-4"></h3>
                    <br></br> <br></br> <br></br> 
                    <form
                      id="contactForm"
                      className="contactForm"
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              placeholder="Name"
                              onChange={handleInputChange}
                              value={name}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              placeholder="Email"
                              onChange={handleInputChange}
                              value={email}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="subject"
                              placeholder="Subject"
                              onChange={handleInputChange}
                              value={subject}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <textarea
                              type="text"
                              className="form-control w-100 text-a"
                              name="message"
                              placeholder="Message"
                              cols="30"
                              rows="4"
                              onChange={handleInputChange}
                              value={message}
                            ></textarea>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-6 item-child d-flex justify-center">
                  <div className="info-wrap w-100 p-lg-5 p-4 img">
                      <h3 className="title-contact">Contact us</h3>
                    <p className="mb-4">
                      We're open for any feedback or just to have a comment
                    </p>
                    <div className="dbox w-100 d-flex align-items-center">

                        <i class="ri-mail-send-fill"></i>
                      
                        <p>
                        Address: 41 Pho Vong, Hai Ba Trung
                        </p>
                      
                    </div>
                    <div className="dbox w-100 d-flex align-items-center">
                      
                        <i class="ri-phone-fill"></i>
                     
                        <p>
                          <a href="tel://123456789">Phone: +84869 036 124</a>
                        </p>
                     
                    </div>
                    <div className="dbox w-100 d-flex align-items-center">
                     
                       <i class="ri-send-plane-fill"></i>
                      
                        <p>
                          <a href="mailto:nqunhanh35@gmail.com">
                          Email: nqunhanh35@gmail.com
                          </a>
                        </p>
                      
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

export default Contact;
