import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api';
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";
import '../App.css';

export default function BypolylineId() {
    const { polylineId } = useParams();
    const [coordinates, setCoordinates] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [selectedMemo, setSelectedMemo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [author, setAuthor] = useState("");

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
                if (coords.length > 0) {
                    setMapCenter({ lat: coords[0].lat, lng: coords[0].lng });
                }

                const markerResponse = await api.getMarkersByPolylineId(polylineId);
                setMarkers(markerResponse.data);
            } catch (error) {
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchPolylineData();
    }, [polylineId]);

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

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <h1 className="page-title">내 여행기록 상세 페이지</h1>
            <h2 className="subtitle">제목: {title}</h2>
            <h3 className="polyline-id">Polyline ID: {polylineId}</h3>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
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
                                onClick={() => setSelectedMemo(marker.memo)}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                }}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            )}
            {selectedMemo && (
                <div className="memo-container">
                    <h3>메모 내용</h3>
                    <p>{selectedMemo}</p>
                    <button onClick={() => setSelectedMemo(null)} className="close-button">닫기</button>
                </div>
            )}
            <div className="comments-section">
                <h3>댓글</h3>
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
