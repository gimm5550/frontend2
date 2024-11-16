import React, { useEffect, useState } from "react";
import api from '../api';

export default function MainList() {
    const [communities, setCommunities] = useState([]);

    const fetchCommunities = () => {
        api.list() // 커뮤니티 목록을 가져오는 API 호출
            .then(response => {
                const data = response.data; // API 응답에서 데이터를 가져옵니다.
                setCommunities(data); // 데이터를 상태에 저장
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    };

    useEffect(() => {
        fetchCommunities(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    return (
        <div>
            <h1>커뮤니티 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>관리자 ID</th>
                        <th>회원 수</th>
                    </tr>
                </thead>
                <tbody>
                    {communities.length > 0 ? (
                        communities.map(community => (
                            <tr key={community.id}>
                                <td>{community.id}</td>
                                <td>{community.title}</td>
                                <td>{community.content}</td>
                                <td>{community.admin_id}</td>
                                <td>{community.member_count}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">커뮤니티가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
