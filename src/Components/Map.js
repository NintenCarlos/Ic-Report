import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Card, Container } from "react-bootstrap";
import L from "leaflet";
import { useEffect, useState } from "react";

// Simulación de reportes existentes
const existingReports = [
  {
    id: 1,
    lat: 21.899815,
    lon: -102.248093,
    address: "Dirección 1",
    reportType: "Pelea Callejera",
    dateTime: "2024-10-10 15:30",
    description: "Aui",
  },
  {
    id: 2,
    lat: 21.895,
    lon: -102.249,
    address: "Dirección 2",
    reportType: "Accidente Vehicular",
    dateTime: "2024-10-11 12:00",
    description: "Descripción del reporte 2",
  },
  {
    id: 3,
    lat: 21.8436,
    lon: -102.2602,
    address: "Dirección 1",
    reportType: "Pelea Callejera",
    dateTime: "2024-10-10 15:30",
    description: "Si",
  },
];

export const Map = () => {
  // Marcador Bonito 7u7
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  const key = "pk.6273f17ce79d1c44781c0cdf624ffd5e"; // Reemplaza con tu clave API de LocationIQ

  const [position, setPosition] = useState([21.880487, -102.2967195]); // Posición predeterminada
  const [address, setAddress] = useState(""); // Para almacenar la dirección
  const [error, setError] = useState(""); // Para manejar errores

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        fetchAddressFromCoordinates(latitude, longitude); // Llama a la función para obtener la dirección
        console.log(position)
      },
      (err) => {
        console.error("Error al obtener la ubicación: ", err);
        setError("No se pudo obtener la ubicación.");
      }
    );
  }, []); // El array vacío hace que se ejecute solo una vez, cuando el componente se monta

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${key}&lat=${latitude}&lon=${longitude}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name); // Guarda la dirección obtenida
      } else {
        setError("No se encontraron resultados para estas coordenadas.");
      }
    } catch (error) {
      console.error("Error al obtener la dirección: ", error);
      setError("Error de conexión con la API.");
    }
  };

  return (
    <>
      <Container>
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <MapContainer
              center={position} // Usar la posición actual
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "75vh", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>{address}</Popup>
              </Marker>

              {/* Muestra los reportes existentes como círculos */}
              {existingReports.map(report => (
                <Circle
                  key={report.id}
                  center={[report.lat, report.lon]}
                  radius={200} // Puedes ajustar el radio según sea necesario
                  pathOptions={{ color: 'purple' }}
                >
                  <Popup>
                    <strong>{report.reportType}</strong><br />
                    {report.dateTime}<br />
                    {report.description}<br />
                    Dirección: {report.address}
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
            <Card.Text>
              {error ? (
                <span style={{ color: "red" }}>
                  <strong>{error}</strong>
                </span>
              ) : (
                <span>Usted está en: {address}</span>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
