import { useState, useEffect } from "react";
import { Card, Container, Form, Button, Alert, ListGroup, Modal } from "react-bootstrap";
import axios from "axios";

// Componente que maneja el formulario de reportes
export const ReportForm = () => {
  // Estados para manejar los valores del formulario y la lógica del componente
  const [reportType, setReportType] = useState(""); // Tipo de reporte seleccionado
  const [manualAddress, setManualAddress] = useState(""); // Dirección ingresada manualmente
  const [suggestions, setSuggestions] = useState([]); // Sugerencias para autocompletar la dirección
  const [useCurrentLocation, setUseCurrentLocation] = useState(false); // Si se usa la ubicación actual o no
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null }); // Coordenadas de la ubicación actual
  const [locationError, setLocationError] = useState(null); // Errores de geolocalización
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(""); // Dirección obtenida de las coordenadas actuales
  const [currentDateTime, setCurrentDateTime] = useState(""); // Fecha y hora actual

  const apiKey = "pk.6273f17ce79d1c44781c0cdf624ffd5e"; // API key para las peticiones de geocodificación

  // Estado para manejar la visibilidad del modal de reportes similares
  const [showModal, setShowModal] = useState(false);
  const [similarReports, setSimilarReports] = useState([]); // Estado para los reportes similares

  const handleClose = () => setShowModal(false); // Función para cerrar el modal
  
  // Simulación de almacenamiento de reportes existentes (para comparación)
  const existingReports = [
    {
      id: 1,
      lat: 21.899815,
      lon: -102.248093,
      address: "Dirección 1",
      reportType: "Pelea Callejera",
      dateTime: "2024-10-10 15:30",
      description: "Estan Golpeando a Manuel",
    },
    {
      id: 2,
      lat: 21.895,
      lon: -102.249,
      address: "Dirección 2",
      reportType: "Accidente Vehicular",
      dateTime: "2024-10-11 12:00",
      description: "Estan atropellando a Manuel",
    },
    {
      id: 3,
      lat: 21.8436,
      lon: -102.2602,
      address: "Dirección 1",
      reportType: "Intento de Violacion",
      dateTime: "2024-10-10 15:30",
      description: "Estan violando a Manuel",
    },
  ];

  // Función para obtener la ubicación actual del usuario
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null); // Reiniciar el error si se obtiene la ubicación
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setLocationError("No se pudo obtener la ubicación actual."); // Manejo de errores
        }
      );
    } else {
      setLocationError("La geolocalización no es compatible con este navegador."); // Error si el navegador no soporta geolocalización
    }
  };

  // Función para hacer una geocodificación inversa (convertir coordenadas en una dirección)
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.display_name;
      setReverseGeocodedAddress(address); // Guardar la dirección obtenida
    } catch (error) {
      console.error("Error en la geocodificación inversa:", error);
      setReverseGeocodedAddress("No se pudo obtener la dirección."); // Manejo de errores
    }
  };

  // Función para obtener sugerencias de autocompletado para la dirección manual
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${query}&format=json`
      );
      setSuggestions(response.data); // Guardar las sugerencias
    } catch (error) {
      console.error("Error obteniendo las sugerencias:", error);
    }
  };

  // useEffect para obtener sugerencias solo si se está ingresando una dirección manual
  useEffect(() => {
    if (manualAddress.length > 2 && !useCurrentLocation) {
      fetchSuggestions(manualAddress);
    } else {
      setSuggestions([]); // Limpiar sugerencias si no hay dirección o se usa la ubicación actual
    }
  }, [manualAddress, useCurrentLocation]);

  // useEffect para obtener la ubicación actual si la opción está habilitada
  useEffect(() => {
    if (useCurrentLocation) {
      handleGetCurrentLocation();
    }
  }, [useCurrentLocation]);

  // useEffect para hacer la geocodificación inversa y buscar reportes similares cuando cambie la ubicación
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      reverseGeocode(currentLocation.lat, currentLocation.lon);
      checkForSimilarReports(currentLocation); // Verificar reportes similares
    }
  }, [currentLocation]);

  // useEffect para obtener la fecha y hora actuales cuando se carga el componente
  useEffect(() => { 
    const date = new Date().toLocaleString();
    setCurrentDateTime(date); // Guardar la fecha y hora actual
  }, []);

  // Función para verificar si ya hay reportes en ubicaciones cercanas
  const checkForSimilarReports = (currentLocation) => {
    const threshold = 0.01; // Umbral de similitud en latitud/longitud
    const foundReports = existingReports.filter(report => {
      return Math.abs(report.lat - currentLocation.lat) < threshold &&
             Math.abs(report.lon - currentLocation.lon) < threshold;
    });
  
    if (foundReports.length > 0) {
      setSimilarReports(foundReports); // Almacenar los reportes similares
      setShowModal(true); // Mostrar el modal si se encuentran reportes similares
    } else {
      setSimilarReports([]); // Limpiar si no hay reportes similares
    }
  };

  // Función para manejar la selección de una sugerencia de dirección
  const handleSuggestionClick = (suggestion) => {
    setManualAddress(suggestion.display_name); // Guardar la dirección seleccionada
    setSuggestions([]); // Limpiar las sugerencias
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    const location = useCurrentLocation ? reverseGeocodedAddress : manualAddress; // Obtener la ubicación

    const reportData = {
      tipoDeReporte: reportType,
      ubicacion: location,
    };

    console.log("Reporte enviado:", reportData); // Mostrar los datos del reporte en consola
    // Aquí puedes hacer una petición para enviar los datos del reporte a tu backend
  };
  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>¡Ya hay un Reporte cerca de tu localización!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>Reportes Similares:</h5>
            {similarReports.length > 0 ? (
              <div>
                {similarReports.map(report => (
                  <Card key={report.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{report.reportType}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{report.dateTime}</Card.Subtitle>
                      <Card.Text>
                        {report.description}
                      </Card.Text>
                      <Card.Text>
                        Dirección: {reverseGeocodedAddress})
                      </Card.Text>
                      <Button variant="primary" href='/Detalles'>
                        Complementar Reporte
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No hay reportes similares encontrados.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Crear nuevo reporte
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="bg-dark min-vh-100">
        <Container className="mt-5 bg-dark ">
          <Card>
            <Card.Body>
              <Card.Title>Registrar una Denuncia</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                <Form.Label>Fecha y Hora del Reporte</Form.Label>
                <Form.Control
                  type="text"
                  value={currentDateTime}
                  readOnly
                />
              </Form.Group>

                {/* Selección del tipo de reporte */}
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Reporte</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="pelea_callejera">Pelea Callejera</option>
                    <option value="accidente_vehicular">Accidente Vehicular</option>
                    <option value="violencia_domestica">Violencia Doméstica</option>
                    <option value="robo_vehiculos">Robo a Vehículos</option>
                    <option value="personas_desaparecidas">Personas Desaparecidas</option>
                    <option value="lesiones">Lesiones</option>
                    <option value="delitos_sexuales">Delitos Sexuales</option>
                  </Form.Select>
                </Form.Group>

                {/* Opción para ingresar manualmente la dirección o usar ubicación actual */}
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Usar mi ubicación actual"
                    checked={useCurrentLocation}
                    onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                  />
                </Form.Group>

                {/* Campo para ingresar la dirección manual */}
                {!useCurrentLocation && (
                  <Form.Group className="mb-3">
                    <Form.Label>Dirección (Manual)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingresa la dirección manualmente"
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      required={!useCurrentLocation}
                    />
                    {/* Mostrar las sugerencias de autocompletado */}
                    {suggestions.length > 0 && (
                      <ListGroup className="mt-2">
                        {suggestions.map((suggestion) => (
                          <ListGroup.Item
                            key={suggestion.place_id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: "pointer" }}
                          >
                            {suggestion.display_name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Form.Group>
                )}

                {/* Mostrar la ubicación actual */}
                {useCurrentLocation && (
                  <Form.Group className="mb-3">
                    <Form.Label>Ubicación Actual</Form.Label>
                    {reverseGeocodedAddress ? (
                      <Alert variant="secondary">{reverseGeocodedAddress}</Alert>
                    ) : (
                      <Alert variant="warning">
                        {locationError ? locationError : "Obteniendo tu ubicación..."}
                      </Alert>
                    )}
                  </Form.Group>
                )}

                <Button variant="primary" type="submit">
                  Enviar Denuncia
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};


