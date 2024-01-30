import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import styles from "./Volunteering.module.css";
import { Button, Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Box, IconButton, Link } from "@mui/material";
import { OpenInNew, Visibility } from "@mui/icons-material";
import axios from "axios";

const Volunteering = () => {
  const [sheltersFilter, setSheltersFilter] = useState<any>({
    name: "",
    address: "",
  });
  const [shelters, setShelters] = useState<any[]>([]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Shelter",
        size: 150,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 200,
      },
      {
        accessorKey: "address_city",
        header: "City",
        size: 200,
      },
      {
        accessorKey: "address_state",
        header: "State",
        size: 200,
      },
      {
        accessorKey: "address_zip",
        header: "Zip Code",
        size: 200,
      },
    ],
    []
  );

  useEffect(() => {
    loadShelters();
  }, []);

  const handleOnChange = (e: any) => {
    let cloneSheltersFilter = { ...sheltersFilter };
    cloneSheltersFilter[e.target.name] = e.target.value;
    setSheltersFilter(cloneSheltersFilter);
  };

  const loadShelters = () => {
    axios
      .post<any[]>(
        `https://prod-46.eastus.logic.azure.com:443/workflows/88253f4dcd8d45b783ae67f2b070d2e5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=trI3aYm9BwvV6Jy0HhLis1SthL6XiLF834SMgX7WtSM`,
        sheltersFilter
      )
      .then((res) => {
        console.log(res);
        setShelters(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnSearch = () => {
    loadShelters();
  };

  const handleView = (row: any) => {
    console.log(row);
    window.open(row.original.website);
  };

  return (
    <div className={styles["volunteering"]}>
      <h3>Shelters or Rescue Groups Search</h3>
      <h5>Filters</h5>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                name="name"
                onChange={(e) => handleOnChange(e)}
              />
            </td>
            <td>
              <input
                type="text"
                name="address"
                onChange={(e) => handleOnChange(e)}
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
        data={shelters}
        enableEditing
        enableColumnFilters={false}
        enableColumnActions={false}
        enableTopToolbar={false}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <IconButton
              disabled={!row.original.website}
              onClick={() => handleView(row)}
            >
              <OpenInNew />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

export default Volunteering;
