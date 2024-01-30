import React, { FormEvent, ReactNode, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import styles from "./ShelterLogin.module.css";
import axios from "axios";
import Message from "./Interfaces/Message";
import { useNavigate } from "react-router";

interface Login {
  email?: string;
  password?: string;
}
interface Props {
  children: ReactNode;
  header: string;
  show: boolean;
  handleClose: () => void;
  handleSave: () => void;
}
interface PropsNoShow {
  header?: string;
  message?: string;
  show: boolean;
  handleClose: () => void;
}
const ConfirmAddress = ({
  children,
  header,
  show,
  handleClose,
  handleSave,
}: Props) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        We found the following address on internet:
        <br />
        <br />
        <b>{children}</b>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No, please fix it.
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Yes, register my shelter.
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NoAddress = ({
  show,
  handleClose,
  header = "Invalid Credentials",
  message = "The email and password entered are not correct.",
}: PropsNoShow) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ShelterLogin = () => {
  const [validated, setValidated] = useState(false);
  const [credentials, setCredentials] = useState<Login>();
  const [message, setMessage] = useState<Message>({ show: false });

  const handleOnChange = (e: any) => {
    let cloneCredentials: Login = { ...credentials };
    if (e.target.name === "email") {
      cloneCredentials.email = e.target.value;
    } else if (e.target.name === "password") {
      cloneCredentials.password = e.target.value;
    }
    setCredentials(cloneCredentials);
  };

  let navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      //setShowSpinner(true);
      event.preventDefault();
      const credentialsClone = { ...credentials };

      axios
        .post(
          `https://prod-86.eastus.logic.azure.com:443/workflows/c0c1c17d74e04da2aad5052bc2f210a5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4q4g2f2m1w7FY0VRouKvVc1Yo6aDJvdFu1TQmBp_gC4`,
          credentialsClone
        )
        .then((res) => {
          console.log(res);
          localStorage.setItem(
            "petAdopt",
            JSON.stringify(res?.data?.ResultSets?.Table1[0])
          );
          navigate(`/shelter-admin`);
        })
        .catch((err) => {
          console.log(err);
          let cloneMessage = { ...message };

          //cloneMessage.header = "Error";
          //cloneMessage.message = err?.response?.data?.error?.message;
          cloneMessage.show = true;
          setMessage(cloneMessage);
        });
    }

    setValidated(true);
  };

  return (
    <div className={styles.shelterlogin}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h1>Shelter Login</h1>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={handleOnChange}
            name="email"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            onChange={handleOnChange}
            name="password"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ShelterLogin;
