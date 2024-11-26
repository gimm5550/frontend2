import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api'; // API 모듈 import
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api"; // 구글 맵 컴포넌트 import
import '../MainList.css'; // CSS 파일 import

export default function BypolylineId() {
    const { polylineId } = useParams(); // URL에서 polylineId 추출
    const [coordinates, setCoordinates] = useState([]); // 해당 polylineId의 좌표 데이터를 저장
    const [markers, setMarkers] = useState([]); // 마커 데이터를 저장
    const [title, setTitle] = useState(""); // 제목 상태 추가
    const [error, setError] = useState(null); // 에러 상태
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 초기 중심 좌표
    const [selectedMemo, setSelectedMemo] = useState(null); // 선택된 메모 상태
    const [comments, setComments] = useState([]); // 댓글 상태
    const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태
    const [author, setAuthor] = useState(""); // 작성자 상태
    const [postContent, setPostContent] = useState(""); // 본문 내용 상태 추가
    const [photos, setPhotos] = useState([]); // 여러 사진 경로 상태 추가
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // 슬라이더 현재 사진 인덱스
    const [likes, setLikes] = useState(0); // 추천수 상태 추가
    useEffect(() => {
        if (!polylineId) {
            return;
        }

        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                const coords = response.data.coordinates.map(coord => ({
                    lat: parseFloat(coord.lat || coord.latitude),
                    lng: parseFloat(coord.lng || coord.longitude),
                }));
                console.log("coords:", coords);
                setCoordinates(coords);
                setTitle(response.data.title);
                setPostContent(response.data.postContent); // 본문 내용 설정
                setPhotos(response.data.photoPaths || []); // 여러 사진 경로 설정

                // 첫 좌표를 지도 중심으로 설정
                if (coords.length > 0) {
                    setMapCenter({ lat: coords[0].lat, lng: coords[0].lng });
                }

                // 마커 데이터 가져오기
                const markerResponse = await api.getMarkersByPolylineId(polylineId);
                setMarkers(markerResponse.data); // 마커 데이터를 상태에 저장
            } catch (error) {
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchPolylineData();
    }, [polylineId]); // polylineId가 변경될 때마다 데이터 요청

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.getcomment2(polylineId);
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };
        fetchComments();
    }, [polylineId]);
    const handleLike = async () => {
        try {
            // 증가된 likes 계산
            const updatedLikes = likes + 1;
    
            // 상태 업데이트
            setLikes(updatedLikes);
    
            // 서버에 증가된 likes 전송
            await api.likeupdate(polylineId, updatedLikes);
    
            // 서버에서 최신 likes 값 확인 (필요한 경우)
            const response = await api.getlike(polylineId);
            console.log("like response (after update):", response.data);
        } catch (error) {
            console.error("Failed to handle like:", error);
        }
    };
    
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await api.getlike(polylineId); // 서버에서 likes 값 가져오기
                setLikes(response.data); // likes 상태 업데이트
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };
    
        if (polylineId) {
            fetchLikes();
        }
    }, [polylineId]); // polylineId가 변경될 때마다 실행
    const handleAddComment = async () => {
        if (!polylineId) {
            console.error("polylineId is undefined");
            return;
        }
        try {
            const response = await api.postcomment2(newComment, author, polylineId); // polylineId 추가
            setComments([...comments, response.data]); // 댓글 목록 갱신
            setNewComment(""); // 입력 필드 초기화
            setAuthor(""); // 작성자 필드 초기화
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const handleMarkerClick = (marker) => {
        setSelectedMemo(marker.memo);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };
    const handleMapLoad = (mapInstance) => {
        if (coordinates.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            console.log("coordinates!!!!", coordinates)
            coordinates.forEach(coord => bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng)));
            mapInstance.fitBounds(bounds);
        }
    };
    
    useEffect(() => {
        if (coordinates.length > 0) {
            const timer = setTimeout(() => {
                setMapCenter({ lat: coordinates[0].lat, lng: coordinates[0].lng });
            }, 100); // 약간의 지연을 추가
            return () => clearTimeout(timer);
        }
    }, [coordinates]);
    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* 본문 영역 */}
            <div style={{ flex: "1", padding: "10px", overflow: "auto" }}>
                <h2 style={{ textAlign: "center", fontSize: "16px", marginBottom: "5px" }}>{title}</h2>
    
                <div style={{ margin: "10px 0" }}>
                    <p style={{ fontSize: "12px", lineHeight: "1.4" }}>{postContent}</p>
                </div>
    
                {/* 구글 맵으로 채운 영역 */}
                {error ? (
                    <p style={{ color: "red", textAlign: "center", fontSize: "12px" }}>{error}</p>
                ) : (
                    <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ">
                        <GoogleMap
                            mapContainerStyle={{ height: "500px", width: "100%" }}
                            center={mapCenter}
                            zoom={12}
                            onLoad={handleMapLoad}
                        >
                            {coordinates.length > 1 && (
                                <Polyline
                                    path={coordinates}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                    }}
                                />
                            )}
                            {markers.map((marker, index) => (
                                <Marker
                                    key={index}
                                    position={{ lat: marker.lat, lng: marker.lng }}
                                    onClick={() => handleMarkerClick(marker)}
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                    }}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                )}
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "red",
                        }}
                    >
                        ❤️
                    </button>
                    <span style={{ marginLeft: "5px", fontSize: "14px", fontWeight: "bold" }}>
                        {likes}
                    </span>
                </div>
    
                <div>
    <h3 style={{ fontSize: "14px", marginBottom: "5px", textAlign: "center", color: "#333", fontWeight: "bold" }}>댓글</h3>
    <ul style={{ padding: "0", margin: "0", listStyle: "none", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", padding: "10px" }}>
        {comments.map((comment, index) => (
            <li 
                key={index} 
                style={{ 
                    fontSize: "12px", 
                    marginBottom: "10px", 
                    padding: "10px", 
                    borderRadius: "5px", 
                    backgroundColor: "#f7f7f7", 
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" 
                }}
            >
                <strong style={{ color: "#007bff" }}>{comment.author}:</strong> {comment.content}
                <span style={{ fontSize: "10px", color: "gray", marginLeft: "5px" }}> ({comment.timestamp})</span>
            </li>
        ))}
    </ul>
    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
                fontSize: "12px",
                padding: "8px",
                width: "80%",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
        />
        <div style={{ display: "flex", width: "80%" }}>
            <textarea
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                    fontSize: "12px",
                    padding: "8px",
                    width: "75%",
                    height: "50px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)"
                }}
            />
            <button
                onClick={handleAddComment}
                style={{
                    fontSize: "12px",
                    padding: "8px 15px",
                    marginLeft: "10px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
            >
                댓글 추가
            </button>
        </div>
    </div>
</div>

            </div>
    
            {/* 오른쪽 정보 영역 */}
            <div
                style={{
                    width: "200px",
                    backgroundColor: "#f9f9f9",
                    padding: "10px",
                    borderLeft: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <h3>메모 정보</h3>
                {selectedMemo ? <p>{selectedMemo}</p> : <p>선택된 메모가 없습니다.</p>}
            </div>
        </div>
    );
    
}
