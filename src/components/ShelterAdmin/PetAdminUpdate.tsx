import React, { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import styles from "./PetAdminAdd.module.css";
import Form from "react-bootstrap/esm/Form";
import { Button, InputGroup, ListGroup } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import pettypes, { PetType } from "../data/PetTypes";
import dogs, { Dog } from "../data/Dogs";
import cats, { Cat } from "../data/Cats";
import sexs, { Sex } from "../data/Sex";
import sizes, { Size } from "../data/Sizes";
import petstatus, { PetStatus } from "../data/PetStatus";
import yesnos, { YesNo } from "../data/YesNo";
import axios from "axios";

import { BlobServiceClient } from "@azure/storage-blob";
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
  images: any[];
  shelter_id: number;
  shelter_name: string;
  shelter_address: string;
  shelter_city: string;
  shelter_state: string;
  shelter_zip: string;
  description: string;
  selected: any;
};

async function uploadImage(containerName: any, files: any, folder: any) {
  const blobServiceClient = new BlobServiceClient(
    "https://petadoptionstorage.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwlaciytfx&se=2024-01-01T00:27:23Z&st=2023-11-21T16:27:23Z&spr=https&sig=51DpaY0GJ7P5JLcIshqdeZDafUebGkGAVP4Lbh0hq2Y%3D"
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  Array.prototype.forEach.call(files, function (file) {
    const blobClient = containerClient.getBlobClient(folder + "/" + file.name);
    const blockBlobClient = blobClient.getBlockBlobClient();
    const result = blockBlobClient.uploadBrowserData(file, {
      blockSize: 4 * 1024 * 1024,
      concurrency: 20,
      onProgress: (ev) => console.log(ev),
    });
    console.log(`Upload of file '${file.name}' completed`);
  });
}

const PetAdminUpdate = () => {
  const [pet, setPet] = useState<any>({ images: [] });
  //const [user, setUser] = useState<any>(null);
  const [validated, setValidated] = useState(false);
  const [files, setFiles] = useState([]);
  const [petRegistered, setPetRegistered] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    loadPet();
  }, []);

  const handleFileChange = (event: any) => {
    setFiles(event.target.files);
  };

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
        let cloneResponse = { ...res.data };

        cloneResponse.selected = {
          type: [],
          breed: [],
          sex: [],
          size: [],
          neuter: [],
          status: [],
        };

        let filteredType = pettypes.filter(
          (t) => t.name === cloneResponse.type
        );
        cloneResponse.selected.type.push(
          filteredType.length > 0 ? filteredType[0] : null
        );

        let filteredBreed = null;
        if (cloneResponse.type === "Dogs") {
          filteredBreed = dogs.filter((t) => t.name === cloneResponse.breed);
        } else {
          filteredBreed = cats.filter((t) => t.name === cloneResponse.breed);
        }
        cloneResponse.selected.breed.push(
          filteredBreed.length > 0 ? filteredBreed[0] : null
        );

        let filteredSex = sexs.filter((t) => t.name === cloneResponse.sex);
        cloneResponse.selected.sex.push(
          filteredSex.length > 0 ? filteredSex[0] : null
        );

        let filteredSize = sizes.filter((t) => t.name === cloneResponse.size);
        cloneResponse.selected.size.push(
          filteredSize.length > 0 ? filteredSize[0] : null
        );

        let filteredNeuter = yesnos.filter(
          (t) => t.name === (cloneResponse.neuter ? "Yes" : "No")
        );
        cloneResponse.selected.neuter.push(
          filteredNeuter.length > 0 ? filteredNeuter[0] : null
        );

        let filteredStatus = petstatus.filter(
          (t) => t.name === cloneResponse.status
        );
        cloneResponse.selected.status.push(
          filteredStatus.length > 0 ? filteredStatus[0] : null
        );

        setPet(cloneResponse);
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

      const petClone = { ...pet };
      //let imagesClone: any[] = [];
      let id = crypto.randomUUID();
      Array.prototype.forEach.call(files, function (image) {
        let fileName = id + "/" + image.name;
        petClone.images.push({
          id: id,
          image: fileName,
        });
        /*
        imagesClone.push({
          id: id,
          image: fileName,
        });
        */
      });

      uploadImage("petimages", files, id);
      //const userClone = { ...user };
      const auth = localStorage.getItem("petAdopt");
      let user = auth == null ? null : JSON.parse(auth.replace(/\\"/g, '"'));

      petClone.neuter = petClone.neuter === "Yes" ? 1 : 0;
      petClone.shelterId = user?.id;
      //petClone.images.push(imagesClone);
      axios
        .post(
          `https://prod-77.eastus.logic.azure.com:443/workflows/e775bdbc84c249d183878dadaaa355a6/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QOXiAuS8BBPnOh-zQzVthjM7VsQjTgbdY7A5yykMeLs`,
          petClone
        )
        .then((res) => {
          console.log(res);
          setPetRegistered(true);
          // setFormSubmitted(true);
          // setShowSpinner(false);
        })
        .catch((err) => {
          console.log(err);
          // let cloneMessage = { ...message };
          // cloneMessage.header = "Error";
          // cloneMessage.message = err?.response?.data?.error?.message;
          // cloneMessage.show = true;
          // setMessage(cloneMessage);
          // setShowSpinner(false);
        });
    }
    setValidated(true);
  };

  const handleOnChangeTypeahead = (selected: any, field: any) => {
    let clonePet = { ...pet };
    clonePet.selected = clonePet.selected ?? {};
    clonePet.selected[field] = selected;
    clonePet[field] = selected?.length > 0 ? selected[0].name : null;
    setPet(clonePet);
  };

  const handleOnDeleteImage = (e: any, image: any, i: any) => {
    e.preventDefault();
    console.log(image);
    let clonePet = { ...pet };
    clonePet.images.splice(i, 1);
    setPet(clonePet);
  };

  const handleOnChange = (e: any) => {
    let clonePet = { ...pet };
    clonePet[e.target.name] = e.target.value;
    setPet(clonePet);
  };

  const handleOnClose = () => {
    setPetRegistered(true);
  };

  const isValid = (value: string | null): value is string =>
    [null, undefined, ""].includes(value);

  const isAdmin = () => {
    const auth = localStorage.getItem("petAdopt");
    //if (isValid(auth)) setUser(JSON.parse(auth));
    return auth === null ? false : true;
  };
  if (petRegistered) {
    return <Navigate to="/shelter-admin" />;
  }
  if (!isAdmin) return <Navigate to="/" />;
  return (
    <div className={styles.petadminadd}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <h1>Update Pet</h1>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Enter name"
              required
              onChange={handleOnChange}
              name="name"
              value={pet.name}
            />
            <Form.Control.Feedback type="invalid">
              Please enter the pet name.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicType">
          <Form.Label>Type</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "type")}
            options={pettypes}
            placeholder="Choose the pet's type..."
            inputProps={{ required: true }}
            selected={pet.selected?.type}
          />
          <Form.Control.Feedback type="invalid">
            Please select a Pet Type.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicBreed">
          <Form.Label>Breed</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "breed")}
            options={
              pet.type === "Dogs" ? dogs : pet.type === "Cats" ? cats : []
            }
            placeholder="Choose the pet's breed..."
            inputProps={{ required: true }}
            selected={pet.selected?.breed}
          />
          <Form.Control.Feedback type="invalid">
            Please select a Pet Type.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicDOB">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the pet's date of birth"
            required
            onChange={handleOnChange}
            name="dob"
            value={pet.dob}
          />
          <Form.Control.Feedback type="invalid">
            Please enter the phone number.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicSex">
          <Form.Label>Sex</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "sex")}
            options={sexs}
            placeholder="Choose the pet's sex..."
            inputProps={{ required: true }}
            selected={pet.selected?.sex}
          />
          <Form.Control.Feedback type="invalid">
            Please select a Pet Sex.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicSize">
          <Form.Label>Size</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "size")}
            options={sizes}
            placeholder="Choose a pet size..."
            inputProps={{ required: true }}
            selected={pet.selected?.size}
          />
          <Form.Control.Feedback type="invalid">
            Please select a Pet Size.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicWeight">
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the pet's weight"
            required
            onChange={handleOnChange}
            name="weight"
            value={pet.weight}
          />
          <Form.Control.Feedback type="invalid">
            Please enter the pet weight.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicNeuter">
          <Form.Label>Neuter</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "neuter")}
            options={yesnos}
            placeholder="Is the pet neuter?"
            inputProps={{ required: true }}
            selected={pet.selected?.neuter}
          />
          <Form.Control.Feedback type="invalid">
            Please select a Yes or No.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicStatus">
          <Form.Label>Status</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={(e) => handleOnChangeTypeahead(e, "status")}
            options={petstatus}
            placeholder="Choose the pet's status"
            inputProps={{ required: true }}
            selected={pet.selected?.status}
          />
          <Form.Control.Feedback type="invalid">
            Please select the Pet's current status.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter the a pet's description"
            required
            onChange={handleOnChange}
            name="description"
            value={pet.description}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a brief pet's description.
          </Form.Control.Feedback>
        </Form.Group>
        <ListGroup defaultActiveKey="#link1">
          <ListGroup.Item action href="#link1">
            Images
          </ListGroup.Item>
          {pet?.images.map((image: any, i: any) => {
            return (
              <ListGroup.Item
                action
                onClick={(e) => handleOnDeleteImage(e, image, i)}
                key={i}
              >
                {image.image}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <br />
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
        <br />
        <br />
        <Button variant="primary" type="submit">
          Submit
        </Button>
        &nbsp;&nbsp;
        <Button variant="danger" type="button" onClick={handleOnClose}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default PetAdminUpdate;
