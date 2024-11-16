import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams import 추가
import api from '../api'; // api 모듈 import
import '../MainList.css'; // 스타일 import

export default function CommunityView() {
    const [community, setCommunity] = useState({}); // 선택한 커뮤니티 정보
    const [comments, setComments] = useState([]); // 댓글 목록
    const [newComment, setNewComment] = useState(""); // 새 댓글 내용
    const [error, setError] = useState(null); // 오류 메시지 상태
    const [user, setUser] = useState(null);
    const { id, communityId } = useParams(); // URL 파라미터에서 communityId와 detailId 가져오기
    console.log("communityId, detailId!!!!!!!!!", communityId, id)
    // 커뮤니티 정보 및 댓글 가져오기
    const fetchCommunityData = async () => {
        try {
            const response = await api.detail_show2(communityId, id); // 상세 커뮤니티 정보 가져오기
            console.log("response.data:", response.data);
            setCommunity(response.data);
            console.log("community:", community)
        } catch (err) {
            console.error("데이터 로딩 중 오류 발생:", err);
            setError("데이터 로딩 중 오류가 발생했습니다.");
        }
    };
    useEffect(() => {
        fetchCommunityData();
    }, [communityId]);

    // community 상태가 업데이트될 때마다 로그 출력
    useEffect(() => {
        console.log("community@@@@@@@@@@@@@@@@", community);
        console.log("community.title:", community.title);
        console.log("community.content:", community.content); // community.comment
        console.log("community.comment:", community.comment);
    }, [community]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setUser(userData);
        console.log("user:", user)
    }, []);

    const handleCommentSubmit = async () => {
        if (!newComment) {
            alert("내용을 적어주세요"); // 내용이 없을 때 경고
            return;
        }
        console.log("user:", user);
        const nickname = user.id;
    
        try {
            // 새 댓글 추가 API 호출
            const response = await api.add_comment(nickname, newComment);
            setNewComment(""); // 입력 필드 초기화
    
            // 댓글 추가 후 댓글 목록 새로고침
            await fetchCommunityData(); // 데이터 다시 가져오기
        } catch (err) {
            console.error("댓글 생성 중 오류 발생:", err);
            setError("댓글 생성 중 오류가 발생했습니다."); // 오류 메시지 설정
        }
    };

    return (
        <div className="community-view"> {/* 여기에 클래스 추가 */}
            <h1>커뮤니티 상세</h1>
            <h2>{community.title}</h2>
            <p>{community.content}</p>
            <h3>댓글 목록</h3>
                    <ul>
                        {community.comment.map(comment => (
                            <li key={community.id}>
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
        </div>
    );
    
}
