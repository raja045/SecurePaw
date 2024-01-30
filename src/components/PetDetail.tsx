import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import styles from "./PetDetail.module.css";
import { Gallery } from "react-grid-gallery";
import { Typeahead } from "react-bootstrap-typeahead";
import states, { State } from "./data/States";

type Pet = {
  id: number;
  name: string;
  type: string;
  breed: string;
  dob: string;
  sex: string;
  size: string;
  weight: number;
  neuter: boolean;
  status: string;
  created_at: string;
  images: string[];
  shelter_id: number;
  shelter_name: string;
  shelter_address: string;
  shelter_city: string;
  shelter_state: string;
  shelter_zip: string;
  description: string;
};

const PetDetail = () => {
  const [pet, setPet] = useState<Pet>();
  const [inquiry, setInquiry] = useState<any>({});
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const params = useParams();
  const id = params.id;
  let navigate = useNavigate();

  useEffect(() => {
    loadPet();
  }, []);

  const loadPet = () => {
    let petFilterRequest = {
      id: id,
    };
    axios
      .post<Pet>(
        `https://prod-88.eastus.logic.azure.com:443/workflows/6db0aa99ce814a858e708315e007431b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JcHaD5JXsvSNU0w0sZ9pX6tOEWN2y3fLrUu48e8DIPA`,
        petFilterRequest
      )
      .then((res) => {
        console.log(res);
        setPet(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      let cloneInquiry = { ...inquiry };
      cloneInquiry.shelter_id = pet?.shelter_id;
      cloneInquiry.pet_id = pet?.id;
      axios
        .post(
          `https://prod-37.eastus.logic.azure.com:443/workflows/eae62fb020914f2e93c04700646db77c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gZUCgN7hS1l-5AC3mBbkoMfYY4T-ilHYWG8XwOvDNyI`,
          cloneInquiry
        )
        .then((res) => {
          console.log(res);
          setSubmitted(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setValidated(true);
  };

  const handleOnClose = () => {
    navigate("/");
  };

  const handleOnChange = (e: any) => {
    let cloneInquiry = { ...inquiry };
    cloneInquiry[e.target.name] = e.target.value;
    setInquiry(cloneInquiry);
  };

  const handleOnChangeTypeahead = (selected: any, field: any) => {
    let cloneInquiry = { ...inquiry };
    cloneInquiry.selected = cloneInquiry.selected ?? {};
    cloneInquiry.selected[field] = selected;
    cloneInquiry[field] = selected?.length > 0 ? selected[0].name : null;
    setInquiry(cloneInquiry);
  };

  let images: any[] = [];
  pet?.images.forEach((i: any) => {
    images.push({
      src:
        "https://petadoptionstorage.blob.core.windows.net/petimages/" + i.image,
      width: 320,
      height: 174,
    });
  });
  if (submitted) {
    return (
      <div className={styles.petdetail}>
        <h2>
          Thanks for your interest in {pet?.name}.
          <br />
        </h2>
        <h4>
          Your Interest Inquiry was sent to the shelter or rescue group
          successfully.
          <br />
          They will contact you soon.
        </h4>
        <Button variant="danger" type="button" onClick={handleOnClose}>
          Close
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.petdetail}>
      <h1>Pet Detail</h1>
      <Container>
        <Row>
          <Col>Name</Col>
          <Col>{pet?.name}</Col>
        </Row>
        <Row>
          <Col>Type</Col>
          <Col>{pet?.type}</Col>
        </Row>
        <Row>
          <Col>Breed</Col>
          <Col>{pet?.breed}</Col>
        </Row>
        <Row>
          <Col>Sex</Col>
          <Col>{pet?.sex}</Col>
        </Row>
        <Row>
          <Col>Date of Birth</Col>
          <Col>{pet?.dob}</Col>
        </Row>
        <Row>
          <Col>Neuter</Col>
          <Col>{pet?.neuter ? "Yes" : "No"}</Col>
        </Row>
        <Row>
          <Col>Size</Col>
          <Col>{pet?.size}</Col>
        </Row>
        <Row>
          <Col>Weight</Col>
          <Col>{pet?.weight}</Col>
        </Row>
        <Row>
          <Col>Description</Col>
          <Col>{pet?.description}</Col>
        </Row>
        <Row>
          <Col>
            <h3>
              <b>Location</b>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>Shelter Name</Col>
          <Col>{pet?.shelter_name}</Col>
        </Row>
        <Row>
          <Col>Shelter Address</Col>
          <Col>
            {pet?.shelter_address}
            <br />
            {pet?.shelter_city +
              " " +
              pet?.shelter_state +
              " " +
              pet?.shelter_zip}
          </Col>
        </Row>
      </Container>
      <Gallery images={images} />
      <br />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h2>Send Interest Inquiry</h2>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              required
              onChange={handleOnChange}
              name="name"
            />
            <Form.Control.Feedback type="invalid">
              Please enter your name.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            required
            onChange={handleOnChange}
            name="phone"
          />
          <Form.Control.Feedback type="invalid">
            Please enter your phone number.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll share your phone number with the shelter or rescue group{" "}
            {pet?.shelter_name}.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            required
            onChange={handleOnChange}
            name="email"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address.
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll share your email with the shelter or rescue group{" "}
            {pet?.shelter_name}.
          </Form.Text>
        </Form.Group>
        <hr className="hr"></hr>
        <h4>Address Information</h4>
        <Form.Group className="mb-3" controlId="formBasicAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the address"
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
            onChange={(e) => handleOnChangeTypeahead(e, "state")}
            options={states}
            placeholder="Choose a state..."
            selected={inquiry?.selected?.state}
            inputProps={{ required: false }}
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
            onChange={handleOnChange}
            name="zip"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid zip code.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
        &nbsp;&nbsp;
        <Button variant="danger" type="button" onClick={handleOnClose}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default PetDetail;
