import React from "react";
import * as yup from "yup";
import { useState, useEffect } from "react";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Sorry bucko, name is required"),
  email: yup
    .string()
    .email("Sorry bucko, valid email needed")
    .required("Sorry bucko, you need an email in there"),
  terms: yup.boolean().oneOf([true], "please agree to terms of use"),
  password: yup
    .string()

    .required("Sorry bud you need a password")
});

export default function Form() {
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    terms: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    terms: "",
    password: ""
  });
  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data);
        setUser(res.data);
        console.log("good job bucko", post);

        setFormState({
          name: "",
          email: "",
          terms: "",
          password: ""
        });
      })
      .catch(err => console.log(err.response));
  };

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        });
      });
  };

  const inputChange = e => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    validateChange(e);
    setFormState(newFormData);
  };

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={inputChange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>
      <label htmlFor="email">
        Email
        <input
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}
      </label>
      <label htmlFor="password">
        Password
        <input
          type="text"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errors.password.length > 0 ? (
          <p className="error">{errors.password}</p>
        ) : null}
      </label>
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms & Conditions
      </label>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <pre>{JSON.stringify(user.name, null, 2)}</pre>
      <button disabled={buttonDisabled}>Submit</button>
    </form>
  );
}
