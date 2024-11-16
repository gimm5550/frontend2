import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import api from '../api'; // api 모듈 import
import '../MainList.css'; // 스타일 import

export default function NewCommunity() {
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // 내용 상태
    const [editor, setEditor] = useState(null); // 현재 로그인된 사용자 ID 상태
    const [error, setError] = useState(null); // 오류 상태
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setEditor(userData ? userData.id : null); // 사용자 ID 설정
    }, []);

    const handleSubmit = () => {
        if (!title || !content || !editor) {
            setError("제목, 내용, 작성자를 모두 입력해야 합니다."); // 오류 메시지 설정
            return;
        }
        console.log("현재 id!!", id)
        api.detail_new(title, content, editor, id) // API 호출
            .then(response => {
                console.log("새 커뮤니티 생성 응답:", response.data);
                navigate('/community_detail'); // 커뮤니티 목록으로 이동
            })
            .catch(err => {
                console.error("커뮤니티 생성 중 오류 발생:", JSON.stringify(err));
                setError("커뮤니티 생성 중 오류가 발생했습니다."); // 오류 메시지 설정
            });
    };

    return (
        <div>
            <h1>새 커뮤니티 생성</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            <div>
                <label>
                    제목:
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="제목을 입력하세요" 
                    />
                </label>
            </div>
            <div>
                <label>
                    내용:
                    <textarea 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                        placeholder="내용을 입력하세요" 
                    />
                </label>
            </div>
            <button onClick={handleSubmit}>생성</button> {/* 생성 버튼 */}
        </div>
    );
}
