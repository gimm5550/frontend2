import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api"; // API 모듈 import
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api"; // 구글 맵 컴포넌트 import
import "../MainList.css"; // CSS 파일 import

export default function BypolylineId2({ polylineId }) {
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
    const [showMap, setShowMap] = useState(false); // GoogleMap 렌더링 상태 추가

    useEffect(() => {
        if (!polylineId) {
            return;
        }

        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                const coords = response.data.coordinates;
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
            const updatedLikes = likes + 1;
            setLikes(updatedLikes);
            await api.likeupdate(polylineId, updatedLikes);
            const response = await api.getlike(polylineId);
            console.log("like response (after update):", response.data);
        } catch (error) {
            console.error("Failed to handle like:", error);
        }
    };

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await api.getlike(polylineId);
                setLikes(response.data);
            } catch (error) {
                console.error("Failed to fetch likes:", error);
            }
        };

        if (polylineId) {
            fetchLikes();
        }
    }, [polylineId]);

    const handleAddComment = async () => {
        if (!polylineId) {
            console.error("polylineId is undefined");
            return;
        }
        try {
            const response = await api.postcomment2(newComment, author, polylineId);
            setComments([...comments, response.data]);
            setNewComment("");
            setAuthor("");
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

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            <div style={{ flex: "1", padding: "20px", overflow: "auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h2>
                <div style={{ margin: "20px 0" }}>
                    <p>{postContent}</p>
                </div>

                {photos.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: "20px", position: "relative" }}>
                        <button onClick={handlePrevPhoto}>{"<"}</button>
                        <img
                            src={photos[currentPhotoIndex]}
                            alt={`Uploaded ${currentPhotoIndex + 1}`}
                            style={{
                                width: "100%",
                                maxWidth: "600px",
                                minHeight: "400px",
                                maxHeight: "400px",
                                height: "auto",
                                objectFit: "contain",
                            }}
                        />
                        <button onClick={handleNextPhoto}>{">"}</button>
                    </div>
                )}

                {error ? (
                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                ) : (
                    <button onClick={() => setShowMap(!showMap)}>
                        {showMap ? "지도 숨기기" : "지도 보기"}
                    </button>
                )}

                {showMap && (
                    <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ">
                        <GoogleMap
                            mapContainerStyle={{ height: "80%", width: "100%" }}
                            center={mapCenter}
                            zoom={12}
                        >
                            {coordinates.length > 1 && (
                                <Polyline
                                    path={coordinates}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 4,
                                    }}
                                />
                            )}
                            {markers.map((marker, index) => (
                                <Marker
                                    key={index}
                                    position={{ lat: marker.lat, lng: marker.lng }}
                                    onClick={() => handleMarkerClick(marker)}
                                />
                            ))}
                        </GoogleMap>
                    </LoadScript>
                )}

                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button onClick={handleLike}>❤️</button>
                    <span>{likes}</span>
                </div>

                <div>
                    <h3>댓글</h3>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index}>
                                <strong>{comment.author}:</strong> {comment.content}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="작성자"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                        <textarea
                            placeholder="댓글을 입력하세요"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={handleAddComment}>댓글 추가</button>
                    </div>
                </div>
            </div>

            <div className="place_info2" style={{ width: "150px", padding: "20px" }}>
                <h3>메모 정보</h3>
                {selectedMemo ? <p>{selectedMemo}</p> : <p>선택된 메모가 없습니다.</p>}
            </div>
        </div>
    );
}
