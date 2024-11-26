import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import

export default function BypolylineId2({ polylineId }) {
    const [title, setTitle] = useState(""); // 제목 상태 추가
    const [error, setError] = useState(null); // 에러 상태
    const [postContent, setPostContent] = useState(""); // 본문 내용 상태 추가
    const [photos, setPhotos] = useState([]); // 여러 사진 경로 상태 추가
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // 슬라이더 현재 사진 인덱스

    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        if (!polylineId) {
            return;
        }

        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                setTitle(response.data.title);
                setPostContent(response.data.postContent); // 본문 내용 설정
                setPhotos(response.data.photoPaths || []); // 여러 사진 경로 설정
            } catch (error) {
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchPolylineData();
    }, [polylineId]);

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

    const handleNavigate = () => {
        navigate(`/MyTravel/${polylineId}`); // 상세 페이지로 이동
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <div style={{ padding: "20px", overflow: "auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h2>

                <div style={{ margin: "20px 0" }}>
                    <p>{postContent}</p>
                </div>

                {/* 여러 사진 슬라이더 */}
                {photos.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: "20px", position: "relative" }}>
                        <button
                            onClick={handlePrevPhoto}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                border: "none",
                                padding: "10px",
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                        >
                            {"<"}
                        </button>
                        <img
                            src={photos[currentPhotoIndex].startsWith("http")
                                ? photos[currentPhotoIndex]
                                : `http://localhost:8080${photos[currentPhotoIndex]}`}
                            alt={`Uploaded ${currentPhotoIndex + 1}`}
                            style={{
                                width: "100%",
                                maxWidth: "600px",
                                minHeight: "400px",
                                maxHeight: "400px",
                                height: "auto",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                objectFit: "contain",
                            }}
                        />
                        <button
                            onClick={handleNextPhoto}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                background: "rgba(0,0,0,0.5)",
                                color: "white",
                                border: "none",
                                padding: "10px",
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                        >
                            {">"}
                        </button>
                    </div>
                )}

                

                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

                {/* 상세 페이지 이동 버튼 */}
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button
                        onClick={handleNavigate}
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "10px 20px",
                            fontSize: "16px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        상세 페이지 이동
                    </button>
                </div>
            </div>
        </div>
    );
}
