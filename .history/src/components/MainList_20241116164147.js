import React, { useEffect, useState } from "react";
import api from '../api'; // API 모듈 import
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일 import

export default function MainList() {
    const [travelRecords, setTravelRecords] = useState([]); // 여행 기록 상태
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태
    const [newRecord, setNewRecord] = useState({
        title: '',
        description: ''
    }); // 새로운 여행 기록 상태
    const navigate = useNavigate();

    // 여행 기록 가져오기
    const fetchTravelRecords = () => {
        api.list() // 여행 기록 목록을 가져오는 API 호출
            .then(response => {
                console.log("response!!!:", response)
                const { data } = response.data; // 서버에서 반환된 데이터 구조를 맞춤
                setTravelRecords(data); // 데이터를 상태에 저장
            })
            .catch(err => {
                console.error("여행 기록을 가져오는 중 오류 발생:", err);
            });
    };

    useEffect(() => {
        fetchTravelRecords(); // 컴포넌트가 마운트될 때 여행 기록 목록 가져오기
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateSubmit = async () => {
        try {
            // 새로운 여행 기록 생성 API 호출
            await api.createTravelRecord(newRecord.title, newRecord.description);
            alert("여행 기록이 생성되었습니다.");
            setIsPopupOpen(false); // 팝업 닫기
            fetchTravelRecords(); // 여행 기록 목록 새로고침
        } catch (err) {
            console.error("여행 기록 생성 중 오류 발생:", err);
            alert("여행 기록 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h1>여행 기록 목록</h1>
            <button onClick={() => setIsPopupOpen(true)}>여행 기록 생성</button> {/* 여행 기록 생성 버튼 */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>설명</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {travelRecords.map(record => (
                        <tr key={record.id}>
                            <td>{record.id}</td>
                            <td>{record.title}</td>
                            <td>{record.description}</td>
                            <td>{new Date(record.createdDate).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 팝업창 */}
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>여행 기록 생성</h2>
                        <label>
                            제목:
                            <input
                                type="text"
                                name="title"
                                value={newRecord.title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            설명:
                            <textarea
                                name="description"
                                value={newRecord.description}
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
