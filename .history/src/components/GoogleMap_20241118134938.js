import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function GoogleMapWithPlaces() {
    const [map, setMap] = useState(null); // Google Map 객체
    const [places, setPlaces] = useState([]); // 음식점 및 명소 정보

    const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";

    const fetchNearbyPlaces = () => {
        if (map) {
            const service = new window.google.maps.places.PlacesService(map);

            const request = {
                location: map.getCenter(), // 현재 지도 중심 위치
                radius: 5000, // 검색 반경 (단위: 미터)
                type: ["restaurant"], // 검색 유형 (예: restaurant, tourist_attraction 등)
            };

            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPlaces(results);
                } else {
                    console.error("Places API 요청 실패:", status);
                }
            });
        }
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
            <GoogleMap
                mapContainerStyle={{ height: "100vh", width: "100%" }}
                center={{ lat: 37.5665, lng: 126.9780 }}
                zoom={14}
                onLoad={(map) => {
                    setMap(map);
                    fetchNearbyPlaces(); // 지도 로드 시 음식점 정보 요청
                }}
            >
                {places.map((place, index) => (
                    <Marker
                        key={index}
                        position={place.geometry.location}
                        title={place.name}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
}
