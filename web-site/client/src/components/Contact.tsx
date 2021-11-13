import React from "react";
import emailjs from "emailjs-com";

export default function ContactUs() {
  function sendEmail(e: any) {
    e.preventDefault();

    emailjs
      .sendForm(
        "xgn-bot-emails",
        "template_91izyni",
        e.target,
        "user_ylh20WaOFL8OMsDD8ttQ9"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <>
      <h3>
        Suggenstions? Problems with the bot or the website? Let us know by
        compiling the form below:
      </h3>
      <form className="contact-form" onSubmit={sendEmail}>
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Insert your name!"
          className="form-control"
          style={{
            color: "var(--text-color)",
            background: "#2c2f33",
          }}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Insert a valid email!"
          style={{
            color: "var(--text-color)",
            background: "#2c2f33",
          }}
          className="form-control"
        />
        <label>Suggestions / Problems</label>
        <input
          type="text"
          name="subject"
          placeholder="What type of problem do you have?"
          className="form-control"
          style={{
            color: "var(--text-color)",
            background: "#2c2f33",
            marginBottom: 10,
          }}
        />

        <textarea
          name="message"
          placeholder="Let us know so we can fix it!"
          style={{
            color: "var(--text-color)",
            background: "#2c2f33",
          }}
          className="form-control form-control-sm"
          rows={5}
        />
        {/*send*/}
        <input
          type="submit"
          value="Send"
          className="btn btn-primary shadow-none"
          style={{
            margin: 5,
            backgroundColor: "var(--background)",
            borderColor: "var(--background)",
            borderRadius: 10,
          }}
        />
      </form>
    </>
  );
}
