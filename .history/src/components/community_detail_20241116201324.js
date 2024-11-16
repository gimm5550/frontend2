import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../api';
import '../MainList.css';

export default function CommunityDetail() {
    const [details, setDetails] = useState(null); // 게시글 데이터
    const [comments, setComments] = useState([]); // 댓글 데이터
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // 게시글 ID 가져오기
    const [commentId, setcommentId] = useState(null);
    // 게시글 데이터 가져오기
    const fetchDetails = () => {
        api.detail_show(id) // 게시글 데이터 가져오기
            .then(response => {
                const { data } = response.data;
                setDetails(data);
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", err);
                setError("게시글 데이터를 가져오는 중 오류가 발생했습니다.");
            });
    };

    // 댓글 데이터 가져오기
    const fetchComments = () => {
        api.getCommentsByTravelRecordId(id) // 댓글 데이터 가져오기
            .then(response => {
                const { data } = response.data;
                setComments(data);
            })
            .catch(err => {
                console.error("댓글 데이터를 가져오는 중 오류 발생:", err);
                setError("댓글 데이터를 가져오는 중 오류가 발생했습니다.");
            });
    };

    // 댓글 추가
    const handleAddComment = () => {
        if (!newComment.trim()) {
            alert("댓글 내용을 입력하세요.");
            return;
        }

        api.addComment(id, newComment, commentId) // 댓글 추가 API 호출
            .then(() => {
                alert("댓글이 추가되었습니다.");
                setNewComment(""); // 입력창 초기화
                fetchComments(); // 댓글 목록 새로고침
            })
            .catch(err => {
                console.error("댓글 추가 중 오류 발생:", err);
                alert("댓글 추가 중 오류가 발생했습니다.");
            });
    };

    useEffect(() => {
        fetchDetails();
        fetchComments();
    }, [id]);
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setcommentId(userData);
        console.log("commentId", commentId.id)
    }, []);
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>커뮤니티 상세 페이지</h1>
            <p><strong>ID:</strong> {details.id}</p>
            <p><strong>제목:</strong> {details.title}</p>
            <p><strong>내용:</strong> {details.description}</p>
            <p><strong>작성일:</strong> {new Date(details.createdDate).toLocaleString()}</p>

            {/* 댓글 목록 */}
            <h2>댓글</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        <p><strong>{comment.author}:</strong> {comment.content}</p>
                        <p>{new Date(comment.createdDate).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            {/* 댓글 입력 */}
            <div>
                <h3>댓글 추가</h3>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={handleAddComment}>추가</button>
            </div>

            <button onClick={() => navigate('/')}>목록으로 돌아가기</button>
        </div>
    );
}
