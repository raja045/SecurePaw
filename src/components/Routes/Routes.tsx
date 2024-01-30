import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import PetSearch from "../PetSearch";
import ShelterRegister from "../ShelterRegister";
import ShelterLogin from "../ShelterLogin";
import Volunteering from "../Volunteering";
import PetAdmin from "../ShelterAdmin/PetAdmin";
import PetAdminAdd from "../ShelterAdmin/PetAdminAdd";
import PetDetail from "../PetDetail";
import PetAdminUpdate from "../ShelterAdmin/PetAdminUpdate";
import { Education } from "../Education";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <PetSearch /> },
      { path: "shelter-register", element: <ShelterRegister /> },
      { path: "shelter-login", element: <ShelterLogin /> },
      { path: "volunteering", element: <Volunteering /> },
      { path: "shelter-admin", element: <PetAdmin /> },
      { path: "shelter-admin/pet-add", element: <PetAdminAdd /> },
      { path: "shelter-admin/pet-update/:id", element: <PetAdminUpdate /> },
      { path: "pet-detail/:id", element: <PetDetail /> },
      { path: "education", element: <Education /> },
    ],
  },
]);
