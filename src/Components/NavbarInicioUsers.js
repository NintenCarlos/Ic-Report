import { Container, Nav, Navbar } from "react-bootstrap";
import logo from '../Assets/logo.png'

export const NavbarInicioUsers = () => {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light" >
        <Container>
          <Nav variant="underline" defaultActiveKey="/admin">
            <Navbar.Brand href="/">
            <img
              src={logo}
              height="40"
              className="d-inline-block align-top"
              alt="Ic-report"
            />
            </Navbar.Brand>
            <Nav.Item>
              <Nav.Link href="/admin">Reportar</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
