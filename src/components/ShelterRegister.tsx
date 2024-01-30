import React, { FormEvent, ReactNode, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import styles from "./ShelterRegister.module.css";
import { Typeahead } from "react-bootstrap-typeahead";
import states, { State } from "./data/States";
import axios from "axios";
import { InputGroup, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import Message from "./Interfaces/Message";

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

interface GeocodeResponse {
  data: GeocodeAddressResponse[];
}

interface GeocodeAddressResponse {
  display_name: string;
  lat: string;
  lon: string;
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
  header = "Address Not Found",
  message = "The address input can not be found. Please write a correct address.",
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

const ShelterRegister = () => {
  const [validated, setValidated] = useState(false);
  const [shelter, setShelter] = useState<any>({});
  const [state, setState] = useState<any>();
  const [showConfirmAddress, setShowConfirmAddress] = useState(false);
  const [showAddressNotFound, setShowAddressNotFound] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [message, setMessage] = useState<Message>({ show: false });

  const handleOnStateChange = (selected: any) => {
    let cloneShelter = { ...shelter };
    cloneShelter.state = selected?.length > 0 ? selected[0].name : null;
    setShelter(cloneShelter);
    setState(selected);
  };

  const handleOnChange = (e: any) => {
    let cloneShelter = { ...shelter };
    if (e.target.name === "name") {
      cloneShelter.name = e.target.value;
    } else if (e.target.name === "phone") {
      cloneShelter.phone = e.target.value;
    } else if (e.target.name === "email") {
      cloneShelter.email = e.target.value;
    } else if (e.target.name === "password") {
      cloneShelter.password = e.target.value;
    } else if (e.target.name === "address") {
      cloneShelter.address = e.target.value;
    } else if (e.target.name === "city") {
      cloneShelter.city = e.target.value;
    } else if (e.target.name === "zip") {
      cloneShelter.zip = e.target.value;
    } else if (e.target.name === "website") {
      cloneShelter.website = e.target.value;
    }
    setShelter(cloneShelter);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      //setShowSpinner(true);
      event.preventDefault();
      const shelterClone = { ...shelter };
      const address = `${shelterClone.address}, ${shelterClone.city}, ${shelterClone.state} ${shelterClone.zip}`;
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      };

      axios
        .get(`https://geocode.maps.co/search?q=${address}`)
        .then((res: GeocodeResponse) => {
          console.log(res);
          const cloneShelter = { ...shelter };
          var addressFound: GeocodeAddressResponse = {
            display_name: "",
            lat: "",
            lon: "",
          };
          if (res.data.length > 0) {
            addressFound = res.data[0];
            cloneShelter.foundAddress = addressFound.display_name;
            cloneShelter.coordinates = {
              lat: addressFound.lat,
              lon: addressFound.lon,
            };
            setShowConfirmAddress(true);
          } else {
            setShowAddressNotFound(true);
          }
          setShelter(cloneShelter);
          //setShowSpinner(false);
        })
        .catch((err) => {
          console.log(err);
          //setShowSpinner(false);
        });
    }

    setValidated(true);
  };
  const handleMessageClose = () => {
    let cloneMessage = { ...message };
    cloneMessage.show = false;
    setMessage(cloneMessage);
  };
  const handleClose = () => setShowConfirmAddress(false);
  const handleCloseNotFound = () => setShowAddressNotFound(false);

  const handleSave = () => {
    setShowSpinner(true);
    setShowConfirmAddress(false);
    const shelterClone = { ...shelter };
    axios
      .post(
        `https://prod-69.eastus.logic.azure.com:443/workflows/dd941d181dc045c78f8782869aa5cf26/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ryfaf2Rlnuhef_KFfKieqEMNjrytx-fUpl7mbH6b3dc`,
        shelterClone
      )
      .then((res) => {
        console.log(res);
        setFormSubmitted(true);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        let cloneMessage = { ...message };
        cloneMessage.header = "Error";
        cloneMessage.message = err?.response?.data?.error?.message;
        cloneMessage.show = true;
        setMessage(cloneMessage);
        setShowSpinner(false);
      });
  };

  let navigate = useNavigate();
  const navigateLogin = () => {
    navigate(`/shelter-login`);
  };

  return (
    <div className={styles.shelterregister}>
      <div style={{ justifyContent: "center" }}>
        <Spinner animation="grow" hidden={!showSpinner} />
      </div>
      <ConfirmAddress
        header="Is this the correct Address?"
        show={showConfirmAddress}
        handleClose={handleClose}
        handleSave={handleSave}
      >
        {shelter.foundAddress}
      </ConfirmAddress>
      <NoAddress show={showAddressNotFound} handleClose={handleCloseNotFound} />
      <NoAddress
        show={message.show}
        handleClose={handleMessageClose}
        header={message.header}
        message={message.message}
      />
      <div hidden={!formSubmitted}>
        <h1>Shelter Registered</h1>
        <p>
          The shelter has been successfully registered. Please go to the login
          page and authenticate with your credentials.
          <br />
          <br />
          <Button onClick={navigateLogin}>Go to Login Page</Button>
        </p>
      </div>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        hidden={showSpinner || formSubmitted}
      >
        <h1>New Shelter</h1>

        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Shelter Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Enter name"
              required
              onChange={handleOnChange}
              name="name"
            />
            <Form.Control.Feedback type="invalid">
              Please enter the shelter name.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            required
            onChange={handleOnChange}
            name="phone"
          />
          <Form.Control.Feedback type="invalid">
            Please enter the phone number.
          </Form.Control.Feedback>
        </Form.Group>

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
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
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

        <hr className="hr"></hr>
        <h4>Address Information</h4>
        <Form.Group className="mb-3" controlId="formBasicAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the address"
            required
            onChange={handleOnChange}
            name="address"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid address.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            required
            onChange={handleOnChange}
            name="city"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicState">
          <Form.Label>State</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={handleOnStateChange}
            options={states}
            placeholder="Choose a state..."
            selected={state}
            inputProps={{ required: true }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicZip">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zip code"
            required
            onChange={handleOnChange}
            name="zip"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid zip code.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicZip">
          <Form.Label>Volunteering Link</Form.Label>
          <Form.Control
            type="text"
            placeholder="URL"
            onChange={handleOnChange}
            name="website"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid zip code.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ShelterRegister;
