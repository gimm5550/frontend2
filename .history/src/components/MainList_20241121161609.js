import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

export default function MainList() {
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
    const [postContent, setPostContent] = useState("");
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                const coords = response.data.coordinates;
                setCoordinates(coords);
                setTitle(response.data.title);
                setPostContent(response.data.postContent);
                setPhotos(response.data.photoPaths || []);

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

    const handleLike = async () => {
        try {
            setLikes((prev) => prev + 1);
            await api.likeupdate(polylineId, likes + 1);
        } catch (error) {
            console.error("Failed to update likes:", error);
        }
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

    const handleAddComment = async () => {
        try {
            const response = await api.postcomment2(newComment, author, polylineId);
            setComments((prev) => [...prev, response.data]);
            setNewComment("");
            setAuthor("");
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
            <h3 style={{ textAlign: "center", fontSize: "16px" }}>{title}</h3>

            <p style={{ fontSize: "12px", margin: "10px 0" }}>{postContent}</p>

            {photos.length > 0 && (
                <div style={{ position: "relative", textAlign: "center", margin: "10px 0" }}>
                    <button
                        onClick={handlePrevPhoto}
                        style={{ position: "absolute", left: "5px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}
                    >
                        {"<"}
                    </button>
                    <img
                        src={photos[currentPhotoIndex]}
                        alt={`Photo ${currentPhotoIndex + 1}`}
                        style={{ width: "100%", maxWidth: "200px", borderRadius: "8px" }}
                    />
                    <button
                        onClick={handleNextPhoto}
                        style={{ position: "absolute", right: "5px", top: "50%", transform: "translateY(-50%)", fontSize: "12px" }}
                    >
                        {">"}
                    </button>
                </div>
            )}

            {error ? (
                <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
            ) : (
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                        mapContainerStyle={{ height: "200px", width: "100%" }}
                        center={mapCenter}
                        zoom={12}
                    >
                        {coordinates.length > 1 && (
                            <Polyline path={coordinates} options={{ strokeColor: "#FF0000", strokeWeight: 2 }} />
                        )}
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                onClick={() => setSelectedMemo(marker.memo)}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            )}

            <div style={{ textAlign: "center", margin: "10px 0" }}>
                <button onClick={handleLike} style={{ fontSize: "20px", background: "none", border: "none", color: "red" }}>
                    ❤️
                </button>
                <span style={{ fontSize: "14px", marginLeft: "5px" }}>{likes}</span>
            </div>

            <div style={{ fontSize: "12px", margin: "10px 0" }}>
                <h4>댓글</h4>
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
                        style={{ fontSize: "12px", marginRight: "5px" }}
                    />
                    <textarea
                        placeholder="댓글 입력"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ fontSize: "12px", width: "100%" }}
                    />
                    <button onClick={handleAddComment} style={{ fontSize: "12px" }}>
                        추가
                    </button>
                </div>
            </div>

            {selectedMemo && <p style={{ fontSize: "12px" }}>메모: {selectedMemo}</p>}
        </div>
    );
}
