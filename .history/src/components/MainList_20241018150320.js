import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api';

export default function MainList() {
    const [communities, setCommunities] = useState([]);

    const fetchCommunities = () => {
        api.outing(id, title, content, admin_id, member_count) // API에서 커뮤니티 목록을 가져오는 함수 (예시)
            .then(response => {
                const { data } = response.data[0]; // 적절한 데이터 구조에 맞춰 수정 필요
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
                    {communities.map(community => (
                        <tr key={community.id}>
                            <td>{community.id}</td>
                            <td>{community.title}</td>
                            <td>{community.content}</td>
                            <td>{community.admin_id}</td>
                            <td>{community.member_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
