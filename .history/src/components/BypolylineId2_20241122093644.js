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
    const [comments, setComments] = useState([]); // 댓글 리스트
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
    const [author, setAuthor] = useState(""); // 댓글 작성자
    const [likes, setLikes] = useState(0); // 추천수 상태 추가
    const navigate = useNavigate(); // useNavigate 훅 사용
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

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.getcomment2(polylineId); // 특정 polylineId의 댓글 가져오기
                setComments(response.data || []);
            } catch (error) {
                console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
            }
        };

        if (polylineId) {
            fetchComments();
        }
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

    const handleAddComment = async () => {
        if (!newComment.trim() || !author.trim()) {
            alert("댓글과 작성자를 입력해주세요.");
            return;
        }

        try {
            const response = await api.postcomment2(newComment, author, polylineId);
            setComments([...comments, response.data]); // 댓글 리스트 갱신
            setNewComment(""); // 입력 필드 초기화
            setAuthor(""); // 작성자 필드 초기화
        } catch (error) {
            console.error("댓글 추가 중 오류 발생:", error);
        }
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
                
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button
                        onClick={handleLike}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "24px",
                            color: "red",
                        }}
                    >
                        ❤️
                    </button>
                    <span style={{ marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}>
                        {likes}
                    </span>
                </div>
                {/* 댓글 섹션 */}
                <div>
                    <h3>댓글</h3>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index}>
                                <strong>{comment.author}:</strong> {comment.content}
                                <span style={{ fontSize: "0.8em", color: "gray" }}> ({comment.timestamp})</span>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="작성자"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            style={{ marginRight: "10px" }}
                        />
                        <textarea
                            placeholder="댓글을 입력하세요"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{ display: "block", marginBottom: "10px", width: "100%" }}
                        />
                        <button
                            onClick={handleAddComment}
                            style={{
                                backgroundColor: "#007BFF",
                                color: "white",
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            댓글 추가
                        </button>
                    </div>
                </div>

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
