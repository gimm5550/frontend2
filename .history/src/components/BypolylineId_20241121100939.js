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
    useEffect(() => {
        if (!polylineId) {
            return;
        }
    
        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
    
                // 받아온 좌표를 확인
                console.log("Fetched coordinates:", response.data.coordinates);
                const coords = response.data.coordinates;
                // 좌표 데이터 변환 (Google Maps API 형식에 맞게 변환)
                // const coords = response.data.coordinates.map(coord => ({
                    // lat: coord.lat, // lat은 그대로 사용
                    // lng: coord.lng, // lng은 그대로 사용
                // }));
    
                // 좌표 배열 상태 업데이트
                setCoordinates(coords);
                setTitle(response.data.title);
    
                // 지도 중심점 설정
                if (coords.length > 0) {
                    setMapCenter({ lat: coords[0].lat, lng: coords[0].lng });
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };
    
        fetchPolylineData();
    }, [polylineId]);
    
    useEffect(() => {
        const fetchComments = async () => {
            try {
                console.log("by화면에서 polylineId 출력:", polylineId);
                const response = await api.getcomment2(polylineId);
                console.log("댓글 데이터:", response.data); // 응답 데이터 확인
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };
        fetchComments();
    }, [polylineId]);

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
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h2> {/* 제목 출력 */}
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ">
                    <GoogleMap
                        mapContainerStyle={{ height: "80%", width: "100%" }}
                        center={mapCenter}
                        zoom={12}
                    >
                        {/* Polyline 렌더링 */}
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
                        {/* 마커 렌더링 */}
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                onClick={() => setSelectedMemo(marker.memo)} // 마커 클릭 시 메모 표시
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                }}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            )}
            {/* 선택된 메모 표시 */}
            {selectedMemo && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        backgroundColor: "white",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <h3>메모 내용</h3>
                    <p>{selectedMemo}</p>
                    <button
                        onClick={() => setSelectedMemo(null)}
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
                        닫기
                    </button>
                </div>
            )}
            <div className="comments-section">
    
    <ul className="comments-list">
        {comments.map((comment, index) => (
            <li key={index} className="comment-item">
                <div className="comment-header">
                    <strong className="comment-author">{comment.author}</strong>
                    <span className="comment-timestamp">{comment.timestamp}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
            </li>
        ))}
    </ul>
    <div className="comment-form">
        <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="comment-input"
        />
        <textarea
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-textarea"
        />
        <button onClick={handleAddComment} className="comment-submit-button">댓글 추가</button>
    </div>
</div>

        </div>
    );
}
