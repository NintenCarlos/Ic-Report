import logo from '../Assets/logo.png'
import { Button, Card, Container, Form } from "react-bootstrap";

export const Login = () => {

  
  return (
    <div className="bg-dark">
      <Container
        className="d-flex justify-content-center align-items-center vh-100"
      >
        <Card
          className="mt-3 d-flex bg-dark text-light"
          style={{
            width: "60%",
          }}
        >
          <Card.Body>
            <Card.Img src={logo}/>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" />
              </Form.Group>

              <Container className="d-flex justify-content-between">
                <Button href="/admin" type='submit' variant="success">
                  Iniciar Sesión
                </Button>
                <Button href="/reportar" variant="outline-success">
                  Hacer Denuncia Anónima
                </Button>
              </Container>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
