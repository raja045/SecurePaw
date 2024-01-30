import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import styles from "./PetAdmin.module.css";

import axios from "axios";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Button, Tooltip } from "react-bootstrap";
import { Box, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";

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
};

const PetAdmin = () => {
  const [user, setUser] = useState<User>();
  const [pets, setPets] = useState<Pet[]>([]);
  let navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<Pet>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
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
        accessorKey: "status",
        header: "Status",
        size: 150,
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

  const handleNewPet = () => {
    navigate(`/shelter-admin/pet-add`);
  };

  useEffect(() => {
    const _user: User = JSON.parse(localStorage.getItem("petAdopt") || "{}");
    setUser(_user);
    axios
      .post<Pet[]>(
        `https://prod-64.eastus.logic.azure.com:443/workflows/02412a95774c49e89e4995a2b2be976f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=det6uPNwSQB5r6_qdgKdBzIEiGO_XxhfU6RnQNeyAcg`,
        _user
      )
      .then((res) => {
        console.log(res);
        setPets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEdit = (row: any) => {
    console.log(row);
    navigate(`/shelter-admin/pet-update/${row.original.id}`);
  };

  if (user && Object.keys(user).length === 0) return <Navigate to="/" />;
  return (
    <div className={styles["petadmin"]}>
      <h3>{user && user.name}</h3>
      <h5>Pet List</h5>

      <MaterialReactTable
        columns={columns}
        data={pets}
        enableEditing
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <IconButton onClick={() => handleEdit(row)}>
              <Edit />
            </IconButton>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => handleNewPet()}
            variant="primary"
          >
            Create New Pet
          </Button>
        )}
      />
    </div>
  );
};

export default PetAdmin;
