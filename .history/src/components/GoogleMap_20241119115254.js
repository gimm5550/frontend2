import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker, InfoWindow } from "@react-google-maps/api";
import api from "../api"; // API 호출을 위한 모듈

const libraries = ["places"];
const types = ["restaurant", "park", "museum"]; // 명소 타입

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]); // Polyline 경로
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 중심
    const [title, setTitle] = useState(""); // 제목
    const [userId, setUserId] = useState(null); // 사용자 ID
    const [markers, setMarkers] = useState([]); // 마커 저장
    const [activeMarker, setActiveMarker] = useState(null); // 현재 활성화된 마커
    const [markerMemo, setMarkerMemo] = useState(""); // 마커 메모
    const [places, setPlaces] = useState([]); // 명소 저장
    const [selectedTypes, setSelectedTypes] = useState(new Set(types)); // 선택된 명소 타입
    const [selectedPlace, setSelectedPlace] = useState(null); // 클릭된 명소 정보
    const polylineRef = useRef(null); // Polyline 참조
    const mapRef = useRef(null); // Google Map 참조 // areacode, sigungucode2
    const [areacode, setareacode] = useState(""); // 지역 코드
    const [sigungucode2, setsigungucode2] = useState(""); // 시군구 코드

    // 로컬 스토리지에서 사용자 ID 가져오기
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUserId(userData.id.toString()); // ID를 문자열로 변환
        }
    }, []);

    // 지도 확대/축소 변경 이벤트
    const handleZoomChanged = async () => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            const zoom = mapRef.current.getZoom();

            // Zoom level이 16 이상일 때만 명소 가져오기
            if (zoom >= 16) {
                const placesService = new window.google.maps.places.PlacesService(mapRef.current);
                const request = {
                    bounds,
                    type: Array.from(selectedTypes), // 선택된 타입 필터링
                };

                placesService.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setPlaces(results.map(place => ({
                            id: place.place_id,
                            name: place.name,
                            position: place.geometry.location,
                            type: place.types,
                            photoUrl: place.photos ? place.photos[0].getUrl() : null, // 명소 이미지 URL
                            address: place.vicinity, // 명소 주소
                            rating: place.rating, // 명소 평점
                        })));
                    }
                });
            } else {
                setPlaces([]); // Zoom level이 낮으면 명소 비우기
            }
        }
    };

    // 체크박스 변경 핸들러
    const handleTypeChange = (type) => {
        setSelectedTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    // 명소 마커 클릭 핸들러
    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
    };

    // 기타 기존 함수들 (출발지/도착지 선택, 경로 추가, 메모 관리 등)
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? prevPath.slice(1) : [])]);
                setMapCenter(latLng);
            }
        }
    };

    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [prevPath[0], latLng].filter(Boolean));
            }
        }
    };

    const handleMapClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setPath((prevPath) => [...prevPath, latLng]);
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

    

    const handlePolylineDoubleClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkers((prevMarkers) => [...prevMarkers, { position: latLng, memo: "" }]);
    };

    const handleMarkerClick = (markerIndex) => {
        setActiveMarker(markerIndex);
        setMarkerMemo(markers[markerIndex].memo);
    };

    const handleMemoChange = (event) => {
        setMarkerMemo(event.target.value);
    };

    const handleMemoSave = () => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker, index) =>
                index === activeMarker ? { ...marker, memo: markerMemo } : marker
            )
        );
        setActiveMarker(null);
    };
    const fetchTouristInfo = async (lat, lng) => {
        const baseURL = "http://apis.data.go.kr/B551011/KorService1/locationBasedList1";
        const params = new URLSearchParams({
            numOfRows: 10,
            pageNo: 1,
            MobileOS: "WIN",
            MobileApp: "app",
            serviceKey: "B6yoGtpONP7teTz9XRQHgw2WyPG3EipHt/hWAGbHZ5j9Jgl0rOt4LEAW+AnCxu8zmyLc0y00dCpBzXgesBG2Wg==",
            mapX: lng,
            mapY: lat,
            radius: 1000,
            _type: "json",
        });
    
        try {
            const response = await fetch(`${baseURL}?${params}`);
            const data = await response.json();
            if (data.response && data.response.body) {
                const items = data.response.body.items.item;
                if (items.length > 0) {
                    const addr1 = items[0].addr1; // 첫 번째 item의 addr1 값
                    const parts = addr1.split(" "); // 띄어쓰기로 분리
                    const region = parts[1]; // 두 번째 인덱스 (지역 이름)
                    const sigunguCode = sigunguMap[region]; // 시군구 코드 조회
                    const sigunguCodePrefix = sigunguCode.toString().slice(0, 2); // 시군구 코드의 앞 두 자리 추출
                    setareacode(sigunguCodePrefix);
                    setsigungucode2(sigunguCode);
                }
            } else {
                console.error("No data received: ", data);
            }
        } catch (error) {
            console.error("Error fetching tourist info: ", error);
        }
    };

    const fetchTouristConcentrationInfo = async (areaCd, sigunguCd, tAtsNm) => {
        console.log("fetchTouristConcentrationInfo 실행됨")
        const baseURL = "http://apis.data.go.kr/B551011/TatsCnctrRateService/tatsCnctrRateList";
        const params = new URLSearchParams({
            numOfRows: 10, // 한 페이지 결과 수
            pageNo: 1, // 현재 페이지 번호
            MobileOS: "WIN", // OS 구분
            MobileApp: "app", // 앱 이름
            serviceKey: "B6yoGtpONP7teTz9XRQHgw2WyPG3EipHt/hWAGbHZ5j9Jgl0rOt4LEAW+AnCxu8zmyLc0y00dCpBzXgesBG2Wg==", // 인증키
            _type: "json", // 응답 메시지 형식
            areaCd, // 지역 코드
            sigunguCd, // 시군구 코드
            tAtsNm, // 관광지명
        });
    
        try {
            //const response = await fetch(`${baseURL}?${params}`, { mode: "no-cors" });
            const response = await fetch(`${baseURL}?${params}`);
            const data = await response.json();
            if (data.response && data.response.body) {
                console.log("Tourist Concentration Info: ", data.response.body.items.item);
            } else {
                console.error("No data received: ", data);
            }
        } catch (error) {
            console.error("Error fetching tourist concentration info: ", error);
        }
    };
    
    
    
    const sigunguMap = {
        "종로구": 11110,
        "중구": 11140,
        "용산구": 11170,
        "성동구": 11200,
        "광진구": 11215,
        "동대문구": 11230,
        "중랑구": 11260,
        "성북구": 11290,
        "강북구": 11305,
        "도봉구": 11320,
        "노원구": 11350,
        "은평구": 11380,
        "서대문구": 11410,
        "마포구": 11440,
        "양천구": 11470,
        "강서구": 11500,
        "구로구": 11530,
        "금천구": 11545,
        "영등포구": 11560,
        "동작구": 11590,
        "관악구": 11620,
        "서초구": 11650,
        "강남구": 11680,
        "송파구": 11710,
        "강동구": 11740,
        "부산 중구": 26110,
        "부산 서구": 26140,
        "부산 동구": 26170,
        "영도구": 26200,
        "부산진구": 26230,
        "동래구": 26260,
        "부산 남구": 26290,
        "부산 북구": 26320,
        "해운대구": 26350,
        "사하구": 26380,
        "금정구": 26410,
        "부산 강서구": 26440,
        "연제구": 26470,
        "수영구": 26500,
        "사상구": 26530,
        "기장군": 26710,
        "대구 중구": 27110,
        "대구 동구": 27140,
        "대구 서구": 27170,
        "대구 남구": 27200,
        "대구 북구": 27230,
        "수성구": 27260,
        "달서구": 27290,
        "달성군": 27710,
        "군위군": 27720,
        "인천 중구": 28110,
        "인천 동구": 28140,
        "미추홀구": 28177,
        "연수구": 28185,
        "남동구": 28200,
        "부평구": 28237,
        "계양구": 28245,
        "인천 서구": 28260,
        "강화군": 28710,
        "옹진군": 28720,
        "광주 동구": 29110,
        "광주 서구": 29140,
        "광주 남구": 29155,
        "광주 북구": 29170,
        "광산구": 29200,
        "대전 동구": 30110,
        "대전 중구": 30140,
        "대전 서구": 30170,
        "유성구": 30200,
        "대덕구": 30230,
        "울산 중구": 31110,
        "울산 남구": 31140,
        "울산 동구": 31170,
        "울산 북구": 31200,
        "울주군": 31710,
        "세종특별자치시": 36110,
        "수원시 장안구": 41111,
        "수원시 권선구": 41113,
        "수원시 팔달구": 41115,
        "수원시 영통구": 41117,
        "성남시 수정구": 41131,
        "성남시 중원구": 41133,
        "성남시 분당구": 41135,
        "의정부시": 41150,
        "안양시 만안구": 41171,
        "안양시 동안구": 41173,
        "부천시 원미구": 41192,
        "부천시 소사구": 41194,
        "부천시 오정구": 41196,
        "광명시": 41210,
        "평택시": 41220,
        "동두천시": 41250,
        "안산시 상록구": 41271,
        "안산시 단원구": 41273,
        "고양시 덕양구": 41281,
        "고양시 일산동구": 41285,
        "고양시 일산서구": 41287,
        "과천시": 41290,
        "구리시": 41310,
        "남양주시": 41360,
        "오산시": 41370,
        "시흥시": 41390,
        "군포시": 41410,
        "의왕시": 41430,
        "하남시": 41450,
        "용인시 처인구": 41461,
        "용인시 기흥구": 41463,
        "용인시 수지구": 41465,
        "파주시": 41480,
        "이천시": 41500,
        "안성시": 41550,
        "김포시": 41570,
        "화성시": 41590,
        "광주시": 41610,
        "양주시": 41630,
        "포천시": 41650,
        "여주시": 41670,
        "연천군": 41800,
        "가평군": 41820,
        "양평군": 41830,
        "청주시 상당구": 43111,
        "청주시 서원구": 43112,
        "청주시 흥덕구": 43113,
        "청주시 청원구": 43114,
        "충주시": 43130,
        "제천시": 43150,
        "보은군": 43720,
        "옥천군": 43730,
        "영동군": 43740,
        "증평군": 43745,
        "진천군": 43750,
        "괴산군": 43760,
        "음성군": 43770,
        "단양군": 43800,
        "천안시 동남구": 44131,
        "천안시 서북구": 44133,
        "공주시": 44150,
        "보령시": 44180,
        "아산시": 44200,
        "서산시": 44210,
        "논산시": 44230,
        "계룡시": 44250,
        "당진시": 44270,
        "금산군": 44710,
        "부여군": 44760,
        "서천군": 44770,
        "청양군": 44790,
        "홍성군": 44800,
        "예산군": 44810,
        "태안군": 44825,
        "목포시": 46110,
        "여수시": 46130,
        "순천시": 46150,
        "나주시": 46170,
        "광양시": 46230,
        "담양군": 46710,
        "곡성군": 46720,
        "구례군": 46730,
        "고흥군": 46770,
        "보성군": 46780,
        "화순군": 46790,
        "장흥군": 46800,
        "강진군": 46810,
        "해남군": 46820,
        "영암군": 46830,
        "무안군": 46840,
        "함평군": 46860,
        "영광군": 46870,
        "장성군": 46880,
        "완도군": 46890,
        "진도군": 46900,
        "신안군": 46910,
        "포항시 남구": 47111,
        "포항시 북구": 47113,
        "경주시": 47130,
        "김천시": 47150,
        "안동시": 47170,
        "구미시": 47190,
        "영주시": 47210,
        "영천시": 47230,
        "상주시": 47250,
        "문경시": 47280,
        "경산시": 47290,
        "의성군": 47730,
        "청송군": 47750,
        "영양군": 47760,
        "영덕군": 47770,
        "청도군": 47820,
        "고령군": 47830,
        "성주군": 47840,
        "칠곡군": 47850,
        "예천군": 47900,
        "봉화군": 47920,
        "울진군": 47930,
        "울릉군": 47940,
        "창원시 의창구": 48121,
        "창원시 성산구": 48123,
        "창원시 마산합포구": 48125,
        "창원시 마산회원구": 48127,
        "창원시 진해구": 48129,
        "진주시": 48170,
        "통영시": 48220,
        "사천시": 48240,
        "김해시": 48250,
        "밀양시": 48270,
        "거제시": 48310,
        "양산시": 48330,
        "의령군": 48720,
        "함안군": 48730,
        "창녕군": 48740,
        "고성군": 48820,
        "남해군": 48840,
        "하동군": 48850,
        "산청군": 48860,
        "함양군": 48870,
        "거창군": 48880,
        "합천군": 48890,
        "제주시": 50110,
        "서귀포시": 50130,
        "춘천시": 51110,
        "원주시": 51130,
        "강릉시": 51150,
        "동해시": 51170,
        "태백시": 51190,
        "속초시": 51210,
        "삼척시": 51230,
        "홍천군": 51720,
        "횡성군": 51730,
        "영월군": 51750,
        "평창군": 51760,
        "정선군": 51770,
        "철원군": 51780,
        "화천군": 51790,
        "양구군": 51800,
        "인제군": 51810,
        "고성군": 51820,
        "양양군": 51830,
        "전주시 완산구": 52111,
        "전주시 덕진구": 52113,
        "군산시": 52130,
        "익산시": 52140,
        "정읍시": 52180,
        "남원시": 52190,
        "김제시": 52210,
        "완주군": 52710,
        "진안군": 52720,
        "무주군": 52730,
        "장수군": 52740,
        "임실군": 52750,
        "순창군": 52770,
        "고창군": 52790,
        "부안군": 52800,
    };
    
    const sendPathToServer = async () => {
        if (!userId || !title || path.length < 2) {
            alert("유효한 사용자 ID, 제목 및 경로를 입력하세요.");
            return;
        }

        const payload = {
            pathData: path,
            markersData: markers.map(marker => ({
                lat: marker.position.lat,
                lng: marker.position.lng,
                memo: marker.memo,
            })),
            title,
            userId,
        };

        try {
            console.log("서버로 전송할 데이터:", payload);
            const response = await api.PostPolyLine(payload);
            console.log("서버 응답:", response.data);
            alert("Polyline 및 마커 정보가 성공적으로 전송되었습니다!");
        } catch (error) {
            console.error("Polyline 정보 전송 실패:", error);
            alert("Polyline 정보 전송 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ" libraries={libraries}>
                <div style={{ padding: "10px", backgroundColor: "#f1f1f1", display: "flex", flexWrap: "wrap" }}>
                    {types.map(type => (
                        <label key={type} style={{ marginRight: "10px" }}>
                            <input
                                type="checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => handleTypeChange(type)}
                            />
                            {type}
                        </label>
                    ))}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="여행 제목을 입력하세요"
                        style={{ padding: "10px", marginLeft: "10px", width: "200px" }}
                    />
                    <button
                        onClick={sendPathToServer}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginLeft: "10px",
                        }}
                    >
                        서버로 전송
                    </button>
                </div>
                <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onClick={handleMapClick}
                    onRightClick={handlePolylineDoubleClick}
                    onZoomChanged={handleZoomChanged}
                    onLoad={(map) => (mapRef.current = map)}
                >
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
                            onLoad={(polyline) => (polylineRef.current = polyline)}
                            onMouseUp={handlePolylineEdit}
                        />
                    )}
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker.position}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                            onClick={() => handleMarkerClick(index)}
                        />
                    ))}
                    {places.map(place => (
                        <Marker
                            key={place.id}
                            position={place.position}
                            onClick={() => handlePlaceClick(place)}
                        />
                    ))}
                    {selectedPlace && (
                        <InfoWindow
                            position={selectedPlace.position}
                            onLoad={() => {
                                const lat = selectedPlace.position.lat();
                                const lng = selectedPlace.position.lng();
                                fetchTouristInfo(lat, lng); // 위치 기반 관광 정보 검색 호출
                                console.log("areacode: ", areacode);
                                console.log("sigungucode2: ", sigungucode2);
                                console.log("selectedPlace.name: ", selectedPlace.name);
                                fetchTouristConcentrationInfo(areacode, sigungucode2, selectedPlace.name); // fetchTouristConcentrationInfo("11", "11110", "종로구");
                            }}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div>
                                <h3>{selectedPlace.name}</h3>
                                {selectedPlace.photoUrl && (
                                    <img
                                        src={selectedPlace.photoUrl}
                                        alt={selectedPlace.name}
                                        style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                    />
                                )}
                                <p>{selectedPlace.address}</p>
                                <p>Rating: {selectedPlace.rating || "N/A"}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
            {activeMarker !== null && (
                <div style={{ position: "absolute", bottom: "20px", left: "20px", backgroundColor: "white", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                    <textarea
                        value={markerMemo}
                        onChange={handleMemoChange}
                        placeholder="메모를 입력하세요"
                        style={{ width: "300px", height: "100px" }}
                    />
                    <button
                        onClick={handleMemoSave}
                        style={{
                            marginTop: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        저장
                    </button>
                </div>
            )}
        </div>
    );
}
