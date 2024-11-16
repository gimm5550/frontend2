import React, { useEffect, useState } from "react";
import api from '../api';
import '../MainList.css';

export default function CommunityDetail() {
    const [details, setDetails] = useState([]);
    const [error, setError] = useState(null);

    const show = () => {
        console.log("show 실행됨");
        api.detail_show()
            .then(response => {
                console.log("전체 응답:", response.data); // 전체 응답 로그 출력
                if (response.data.length > 0) {
                    const { data } = response.data[0]; // data를 가져옴
                    if ( data ) {
                        console.log("api.detail_show 실행 성공");
                        setDetails(data); // 데이터를 상태에 저장
                    } else {
                    }
                } else {
                    console.log("응답이 비어 있습니다.");
                }
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", JSON.stringify(err));
                setError("서버 오류가 발생했습니다."); // 오류 상태 업데이트
            });
    };

    useEffect(() => {
        show(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    return (
        <div>
            <h1>공지글</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {details.length > 0 ? ( // 데이터가 있을 때와 없을 때 처리
                        details.map(community => (
                            <tr key={community.id}>
                                <td>{community.id}</td>
                                <td>{community.title}</td>
                                <td>{community.content}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">데이터가 없습니다.</td> {/* 데이터가 없을 때 메시지 표시 */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
