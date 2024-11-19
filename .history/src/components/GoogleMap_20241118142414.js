import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker, InfoWindow } from "@react-google-maps/api";

const libraries = ["places"];
const MIN_ZOOM_FOR_MARKERS = 14; // 마커를 표시하기 위한 최소 줌 레벨

export default function GoogleMapPage() {
    const [isLoaded, setIsLoaded] = useState(false); // API 로드 상태
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]);
    const [zoom, setZoom] = useState(12); // 현재 줌 레벨 상태 추가
    const [showRestaurants, setShowRestaurants] = useState(true); // 음식점 필터링 상태
    const [showTouristAttractions, setShowTouristAttractions] = useState(true); // 명소 필터링 상태
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태
    const mapRef = useRef(null);
    const polylineRef = useRef(null); // Polyline 참조를 추가
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

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

    // 현재 화면 내 명소 가져오기
    const fetchVisiblePlaces = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const types = [];
        if (showRestaurants) types.push("restaurant");
        if (showTouristAttractions) types.push("tourist_attraction");

        const request = {
            bounds,
            type: types,
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            }
        });
    };

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
            <LoadScript
                googleMapsApiKey={googleMapsApiKey}
                libraries={libraries}
                onLoad={() => setIsLoaded(true)}
            >
                {isLoaded && (
                    <>
                        {/* 검색창 및 필터링 */}
                        <div style={{ padding: "10px", backgroundColor: "#f1f1f1", display: "flex" }}>
                            <Autocomplete
                                onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                                onPlaceChanged={handlePlaceSelectedStart}
                            >
                                <input
                                    type="text"
                                    placeholder="출발지 검색"
                                    style={{
                                        padding: "10px",
                                        margin: "0 10px",
                                        width: "200px",
                                    }}
                                />
                            </Autocomplete>

                            <Autocomplete
                                onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                                onPlaceChanged={handlePlaceSelectedEnd}
                            >
                                <input
                                    type="text"
                                    placeholder="도착지 검색"
                                    style={{
                                        padding: "10px",
                                        margin: "0 10px",
                                        width: "200px",
                                    }}
                                />
                            </Autocomplete>

                            {/* 필터링 체크박스 */}
                            <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={showRestaurants}
                                        onChange={(e) => {
                                            setShowRestaurants(e.target.checked);
                                            fetchVisiblePlaces();
                                        }}
                                    />
                                    음식점
                                </label>
                                <label style={{ marginLeft: "10px" }}>
                                    <input
                                        type="checkbox"
                                        checked={showTouristAttractions}
                                        onChange={(e) => {
                                            setShowTouristAttractions(e.target.checked);
                                            fetchVisiblePlaces();
                                        }}
                                    />
                                    명소
                                </label>
                            </div>
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
                                        setPlaces([]); // 줌 레벨이 낮으면 마커 삭제
                                    }
                                }
                            }}
                            onBoundsChanged={() => {
                                if (mapRef.current && zoom >= MIN_ZOOM_FOR_MARKERS) {
                                    fetchVisiblePlaces();
                                }
                            }}
                            onClick={(event) => {
                                const latLng = {
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                };
                                setPath((prev) => [...prev, latLng]);
                            }}
                        >
                            {/* 명소 마커 및 InfoWindow */}
                            {zoom >= MIN_ZOOM_FOR_MARKERS &&
                                places.map((place, index) => (
                                    <Marker
                                        key={index}
                                        position={place.geometry.location}
                                        title={place.name}
                                        onClick={() => setSelectedPlace(place)} // 마커 클릭 시 선택된 장소 업데이트
                                    />
                                ))}

                            {/* 선택된 InfoWindow */}
                            {selectedPlace && (
                                <InfoWindow
                                    position={selectedPlace.geometry.location}
                                    onCloseClick={() => setSelectedPlace(null)} // InfoWindow 닫기
                                >
                                    <div style={{ width: "150px" }}>
                                        <h4>{selectedPlace.name}</h4>
                                        <p>{selectedPlace.vicinity}</p>
                                        {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                                            <img
                                                src={selectedPlace.photos[0].getUrl()}
                                                alt={selectedPlace.name}
                                                style={{ width: "100%" }}
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
                                        draggable: true, // 폴리라인 드래그 가능
                                        editable: true, // 편집 가능
                                    }}
                                    onLoad={(polyline) => {
                                        if (polylineRef.current) polylineRef.current.setMap(null);
                                        polylineRef.current = polyline; // Polyline 참조 저장
                                    }}
                                    onMouseUp={handlePolylineEdit} // 경로 수정 시 업데이트
                                />
                            )}
                        </GoogleMap>
                    </>
                )}
            </LoadScript>
        </div>
    );
}
