import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow, Polyline } from "@react-google-maps/api";

const libraries = ["places"];
const MIN_ZOOM_FOR_MARKERS = 14; // 명소 마커를 표시하기 위한 최소 줌 레벨

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]); // 현재 화면에 표시된 명소
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 명소 정보
    const [zoom, setZoom] = useState(12); // 현재 줌 레벨
    const mapRef = useRef(null);
    const polylineRef = useRef(null);

    const googleMapsApiKey = "YOUR_API_KEY";

    // 출발지 선택
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [{ lat: location.lat(), lng: location.lng() }, ...prev.slice(1)]);
                setMapCenter({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

    // 도착지 선택
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [prev[0], { lat: location.lat(), lng: location.lng() }]);
            }
        }
    };

    // 현재 화면의 명소 가져오기
    const fetchVisiblePlaces = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            bounds,
            type: ["restaurant", "tourist_attraction"], // 명소와 음식점 필터
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            }
        });
    };

    // 폴리라인 경로 수정
    const handlePolylineEdit = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((coord) => ({
                    lat: coord.lat(),
                    lng: coord.lng(),
                }));
            setPath(updatedPath);
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                <div style={{ padding: "10px", backgroundColor: "#f1f1f1", display: "flex" }}>
                    <Autocomplete
                        onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                        onPlaceChanged={handlePlaceSelectedStart}
                    >
                        <input
                            type="text"
                            placeholder="출발지 검색"
                            style={{ padding: "10px", marginRight: "10px", width: "200px" }}
                        />
                    </Autocomplete>

                    <Autocomplete
                        onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                        onPlaceChanged={handlePlaceSelectedEnd}
                    >
                        <input
                            type="text"
                            placeholder="도착지 검색"
                            style={{ padding: "10px", marginRight: "10px", width: "200px" }}
                        />
                    </Autocomplete>
                </div>
                <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={zoom}
                    onLoad={(map) => {
                        mapRef.current = map;
                        fetchVisiblePlaces();
                    }}
                    onZoomChanged={() => {
                        if (mapRef.current) {
                            const currentZoom = mapRef.current.getZoom();
                            setZoom(currentZoom); // 줌 레벨 업데이트
                            if (currentZoom >= MIN_ZOOM_FOR_MARKERS) {
                                fetchVisiblePlaces();
                            } else {
                                setPlaces([]); // 줌 레벨이 낮으면 명소 제거
                            }
                        }
                    }}
                    onBoundsChanged={() => {
                        if (mapRef.current && zoom >= MIN_ZOOM_FOR_MARKERS) {
                            fetchVisiblePlaces();
                        }
                    }}
                >
                    {/* 명소 마커 */}
                    {zoom >= MIN_ZOOM_FOR_MARKERS &&
                        places.map((place, index) => (
                            <Marker
                                key={index}
                                position={place.geometry.location}
                                title={place.name}
                                onClick={() => setSelectedPlace(place)}
                            />
                        ))}

                    {/* 선택된 명소 정보 */}
                    {selectedPlace && (
                        <InfoWindow
                            position={selectedPlace.geometry.location}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div>
                                <h4>{selectedPlace.name}</h4>
                                <p>{selectedPlace.vicinity}</p>
                                {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                                    <img
                                        src={selectedPlace.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })}
                                        alt={selectedPlace.name}
                                        style={{ width: "100%", borderRadius: "8px" }}
                                    />
                                )}
                            </div>
                        </InfoWindow>
                    )}

                    {/* 폴리라인 */}
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                                draggable: true,
                                editable: true,
                            }}
                            onLoad={(polyline) => {
                                polylineRef.current = polyline;
                            }}
                            onMouseUp={handlePolylineEdit}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
