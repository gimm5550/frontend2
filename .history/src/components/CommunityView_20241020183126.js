import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams import 추가
import api from '../api'; // api 모듈 import
import '../MainList.css'; // 스타일 import

export default function CommunityView() {
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기
    const [community, setCommunity] = useState(null); // 선택한 커뮤니티 정보
    const [comments, setComments] = useState([]); // 댓글 목록
    const [newComment, setNewComment] = useState(""); // 새 댓글 내용
    const [error, setError] = useState(null); // 오류 메시지 상태

    useEffect(() => {
        // 커뮤니티 정보 및 댓글 가져오기
        const fetchCommunityData = async () => {
            try {
                const response = await api.detail_show(id); // 상세 커뮤니티 정보 가져오기
                setCommunity(response.data);
                const commentsResponse = await api.get_comments(id); // 댓글 목록 가져오기
                // setComments(commentsResponse.data);
            } catch (err) {
                console.error("데이터 로딩 중 오류 발생:", err);
                setError("데이터 로딩 중 오류가 발생했습니다.");
            }
        };

        fetchCommunityData();
    }, [id]);

    const handleCommentSubmit = () => {
        if (!newComment) {
            alert("내용을 적어주세요"); // 내용이 없을 때 경고
            return;
        }

        // 새 댓글 추가 API 호출
        api.add_comment(id, newComment)
            .then(response => {
                setComments([...comments, response.data]); // 새로운 댓글 추가
                setNewComment(""); // 입력 필드 초기화
            })
            .catch(err => {
                console.error("댓글 생성 중 오류 발생:", err);
                setError("댓글 생성 중 오류가 발생했습니다."); // 오류 메시지 설정
            });
    };

    return (
        <div>
            <h1>커뮤니티 상세</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            {community ? (
                <>
                    <h2>{community.title}</h2>
                    <p>{community.content}</p>

                    <h3>댓글 목록</h3>
                    <ul>
                        {comments.map(comment => (
                            <li key={comment.id}>
                                <strong>{comment.nickname}:</strong> {comment.content}
                            </li>
                        ))}
                    </ul>

                    <h3>댓글 작성</h3>
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)} 
                        placeholder="댓글을 입력하세요" 
                    />
                    <button onClick={handleCommentSubmit}>댓글 추가</button> {/* 댓글 생성 버튼 */}
                </>
            ) : (
                <p>커뮤니티 정보를 불러오는 중...</p>
            )}
        </div>
    );
}
