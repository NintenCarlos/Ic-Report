import { useState, useEffect } from "react";
import { Card, Container, Form, Button, Alert, ListGroup } from "react-bootstrap";
import axios from "axios";

export const ReportForm = () => {
  const [reportType, setReportType] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);  // Sugerencias para autocompletar
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lon: null,
  });
  const [locationError, setLocationError] = useState(null);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState("");  // Almacenará la dirección obtenida
  const apiKey = "pk.6273f17ce79d1c44781c0cdf624ffd5e";  // Tu clave API de LocationIQ

  // Función para obtener la ubicación actual
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);  // Limpiar cualquier error previo
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setLocationError("No se pudo obtener la ubicación actual.");
        }
      );
    } else {
      setLocationError(
        "La geolocalización no es compatible con este navegador."
      );
    }
  };

  // Geocodificación inversa: convierte latitud/longitud en una dirección
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.display_name;
      setReverseGeocodedAddress(address);  // Guardar la dirección obtenida
    } catch (error) {
      console.error("Error en la geocodificación inversa:", error);
      setReverseGeocodedAddress("No se pudo obtener la dirección.");
    }
  };

  // Autocompletado: buscar sugerencias basadas en la entrada de la dirección manual
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${query}&format=json`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error obteniendo las sugerencias:", error);
    }
  };

  // Actualizar las sugerencias mientras el usuario escribe la dirección
  useEffect(() => {
    if (manualAddress.length > 2 && !useCurrentLocation) {
      fetchSuggestions(manualAddress);
    } else {
      setSuggestions([]);  // Limpiar sugerencias si el input es corto
    }
  }, [manualAddress, useCurrentLocation]);

  // Usar el efecto para obtener la ubicación automáticamente si está activado
  useEffect(() => {
    if (useCurrentLocation) {
      handleGetCurrentLocation();
    }
  }, [useCurrentLocation]);

  // Llamar a la geocodificación inversa cada vez que la ubicación actual cambia
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      reverseGeocode(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation]);

  // Manejar la selección de una sugerencia de autocompletado
  const handleSuggestionClick = (suggestion) => {
    setManualAddress(suggestion.display_name);
    setSuggestions([]);  // Limpiar las sugerencias después de seleccionar una
  };

  // Enviar el reporte
  const handleSubmit = (e) => {
    e.preventDefault();
    const location = useCurrentLocation
      ? reverseGeocodedAddress
      : manualAddress;

    const reportData = {
      tipoDeReporte: reportType,
      ubicacion: location,
    };

    console.log("Reporte enviado:", reportData);
    // Aquí puedes hacer una petición para enviar los datos del reporte a tu backend
  };

  return (
    <div className="bg-dark min-vh-100">
      <Container className="mt-5 bg-dark ">
        <Card>
          <Card.Body>
            <Card.Title>Registrar una Denuncia</Card.Title>
            <Form onSubmit={handleSubmit}>
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
  );
};
