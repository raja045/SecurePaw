import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import styles from "./PetSearch.module.css";

import axios from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Button, Table, Tooltip } from "react-bootstrap";
import { Box, IconButton } from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { Typeahead } from "react-bootstrap-typeahead";
import pettypes, { PetType } from "./data/PetTypes";
import dogs, { Dog } from "./data/Dogs";
import cats, { Cat } from "./data/Cats";
import sexs, { Sex } from "./data/Sex";
import sizes, { Size } from "./data/Sizes";
import petstatus, { PetStatus } from "./data/PetStatus";
import yesnos, { YesNo } from "./data/YesNo";

type User = {
  name: string;
  id: number;
  password: string;
};

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
  image: string;
};

const PetSearch = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsFilter, setPetsFilter] = useState<any>({});
  let navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<Pet>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={
                "https://petadoptionstorage.blob.core.windows.net/petimages/" +
                row.original.image
              }
              loading="lazy"
              style={{
                verticalAlign: "middle",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
              }}
            />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 150,
      },
      {
        accessorKey: "breed",
        header: "Breed",
        size: 200,
      },
      {
        accessorKey: "dob",
        header: "DOB",
        size: 150,
      },
      {
        accessorKey: "size",
        header: "Size",
        size: 150,
      },
      {
        accessorKey: "neuter",
        header: "Neuter",
        size: 150,
        accessorFn: (row) => (row.neuter ? "Yes" : "No"),
      },
      {
        accessorKey: "created_at",
        id: "created_at",
        header: "Registered",
        size: 150,
      },
    ],
    []
  );

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = () => {
    let petFilterRequest = {
      type:
        petsFilter.hasOwnProperty("type") && petsFilter.type.length > 0
          ? petsFilter.type[0].name
          : "",
      breed:
        petsFilter.hasOwnProperty("breed") && petsFilter.breed.length > 0
          ? petsFilter.breed[0].name
          : "",
      size:
        petsFilter.hasOwnProperty("size") && petsFilter.size.length > 0
          ? petsFilter.size[0].name
          : "",
      sex:
        petsFilter.hasOwnProperty("sex") && petsFilter.sex.length > 0
          ? petsFilter.sex[0].name
          : "",
      neuter:
        petsFilter.hasOwnProperty("neuter") && petsFilter.neuter.length > 0
          ? petsFilter.neuter[0].name
          : "",
      address:
        petsFilter.hasOwnProperty("address") && petsFilter.address
          ? petsFilter.address
          : null,
    };
    axios
      .post<Pet[]>(
        `https://prod-16.eastus.logic.azure.com:443/workflows/2c925cb2fe0c4fc1a074c6afdd7760cb/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zVh_yuIJEgqdmeYQg-FOalO-sQoe3mcII-4hQkiBpB0`,
        petFilterRequest
      )
      .then((res) => {
        console.log(res);
        setPets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleView = (row: any) => {
    console.log(row);
    navigate("pet-detail/" + row.original.id);
  };

  const handleOnChangeTypeahead = (selected: any, field: any) => {
    let clonePetsFilter = { ...petsFilter };
    clonePetsFilter = clonePetsFilter ?? {};
    switch (field) {
      case "address": {
        clonePetsFilter[field] = selected.target.value;
        break;
      }
      default: {
        clonePetsFilter[field] = selected;
        break;
      }
    }

    setPetsFilter(clonePetsFilter);
  };

  const handleOnSearch = () => {
    loadPets();
  };

  return (
    <div className={styles["petadmin"]}>
      <h3>Pet Search</h3>
      <h5>Filters</h5>
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Breed</th>
            <th>Size</th>
            <th>Sex</th>
            <th>Neuter</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {" "}
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(e) => handleOnChangeTypeahead(e, "type")}
                options={pettypes}
                placeholder="Choose the pet's type..."
                inputProps={{ required: true }}
                selected={petsFilter.type}
              />
            </td>
            <td>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(e) => handleOnChangeTypeahead(e, "breed")}
                options={
                  petsFilter.type &&
                  petsFilter.type.length > 0 &&
                  petsFilter.type[0].name === "Dogs"
                    ? dogs
                    : petsFilter.type &&
                      petsFilter.type.length > 0 &&
                      petsFilter.type[0].name === "Cats"
                    ? cats
                    : []
                }
                placeholder="Choose the pet's breed..."
                inputProps={{ required: true }}
                selected={petsFilter.breed}
              />
            </td>
            <td>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(e) => handleOnChangeTypeahead(e, "size")}
                options={sizes}
                placeholder="Choose a pet size..."
                inputProps={{ required: true }}
                selected={petsFilter.size}
              />
            </td>
            <td>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(e) => handleOnChangeTypeahead(e, "sex")}
                options={sexs}
                placeholder="Choose the pet's sex..."
                inputProps={{ required: true }}
                selected={petsFilter.sex}
              />
            </td>
            <td>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(e) => handleOnChangeTypeahead(e, "neuter")}
                options={yesnos}
                placeholder="Is the pet neuter?"
                inputProps={{ required: true }}
                selected={petsFilter.selected?.neuter}
              />
            </td>
            <td>
              <input
                type="text"
                onChange={(e) => handleOnChangeTypeahead(e, "address")}
              />
            </td>
            <td>
              <Button onClick={handleOnSearch}>Search</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <MaterialReactTable
        columns={columns}
        data={pets}
        enableEditing
        enableColumnFilters={false}
        enableColumnActions={false}
        enableTopToolbar={false}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <IconButton onClick={() => handleView(row)}>
              <Visibility />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

export default PetSearch;
