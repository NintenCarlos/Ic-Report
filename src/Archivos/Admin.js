import { NavbarInicio } from "../Components/NavbarInicio";
import { Container } from "react-bootstrap";
import { Map } from "../Components/Map";

export const Admin = () => {
  return (
    <div className="bg-dark" >
      <NavbarInicio />
      <Container className="mt-3">
        <h2 className="text-light">Bienvenido Administrador</h2>
        <Map/>
      </Container>
    </div>
  );
};
