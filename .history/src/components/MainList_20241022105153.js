import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api'; // api 모듈 import
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일을 불러옵니다.

export default function MainList() {
    const [communities, setCommunities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 관리
    const [newCommunity, setNewCommunity] = useState({
        title: '',
        content: '',
        region: ''
    });
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const navigate = useNavigate();

    const fetchCommunities = () => {
        api.list() // 커뮤니티 목록을 가져오는 API 호출
        .then(response => {
            const { data } = response.data[0]; // 적절한 데이터 구조에 맞춰 수정 필요
            setCommunities(data); // 데이터를 상태에 저장
        })
        .catch(err => {
            console.log(JSON.stringify(err));
        });
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setUser(userData);
        fetchCommunities(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    const handleLogout = () => {
        console.log('로그아웃 처리');
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
    };

    const handleSearch = () => {
        console.log(`검색어: ${searchTerm}`);
    };

    const handleCreateCommunity = () => {
        setIsPopupOpen(true);
    };

    const handleJoinCommunity = async (id) => {
        console.log("user.id:", user.id)
        try {
            const response = await api.get_pending_clients2(user.id); // user.id를 보내야함. 해당 사용자의 아이디가 포함되어있는지 확인해야하기 때문..
            console.log("response22:", response)
            console.log("승인 요청 ");
            navigate(`/CommunityView/${id}`)
            console.log("여지까지됨1")
            return // 여기서 return을 해야 함.
            
        }   catch (err) {
            console.log("승인 요청 중 오류 발생:");
        }
        console.log("여지까지됨2")
        try {
            console.log("여지까지됨3")
            // 승인 요청 API 호출
            const response = await api.request_join_community(user.id, id); // user.id와 community ID를 보내는 API 호출
            console.log("response:", response)
            console.log("response.data[0]:", response.data[0])
            alert("승인 요청이 완료되었습니다.");
        } catch (err) {
            console.error("승인 요청 중 오류 발생:", err);
            alert("승인 요청 중 오류가 발생했습니다.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCommunity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateSubmit = () => {
        console.log('커뮤니티 생성:', newCommunity);
        setIsPopupOpen(false);
        let id = user.id;
        let title = newCommunity.title
        let content = newCommunity.content
        let region = newCommunity.region
        console.log(id)
        console.log(title)
        console.log(content)
        console.log(region)
        api.newing(id, title, content, region)
            .then(response => {
                console.log("응답 데이터:", response.data); // 응답 데이터 출력
                const { code, message, data } = response.data[0];
                if (code === 0) {
                    console.log("data", data);
                } else {
                    console.log("오류");
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
        setNewCommunity({
            title: '',
            content: '',
            region: ''
        });
    };

    return (
        <div>
            <h1>커뮤니티 목록</h1>
            {user && <p>현재 로그인된 아이디: {user.id}</p>} {/* 로그인된 아이디 표시 */}
            <div>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handleEditProfile}>회원정보 수정</button>
                <button onClick={handleSearch}>지역 검색</button>
                <button onClick={handleCreateCommunity}>커뮤니티 생성</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>관리자 ID</th>
                        <th>회원 수</th>
                        <th>지역</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {communities.map(community => (
                        <tr key={community.id}>
                            <td>{community.id}</td>
                            <td>{community.title}</td>
                            <td>{community.content}</td>
                            <td>{community.admin_id}</td>
                            <td>{community.member_count}</td>
                            <td>{community.region}</td>
                            <td>
                                <button onClick={() => handleJoinCommunity(community.id)}>입장</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 팝업창 */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>커뮤니티 생성</h2>
                        <label>
                            제목:
                            <input
                                type="text"
                                name="title"
                                value={newCommunity.title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            내용:
                            <input
                                type="text"
                                name="content"
                                value={newCommunity.content}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            지역:
                            <input
                                type="text"
                                name="region"
                                value={newCommunity.region}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button onClick={handleCreateSubmit}>생성</button>
                        <button onClick={() => setIsPopupOpen(false)}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
