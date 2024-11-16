import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api';
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일을 불러옵니다.

export default function community_detail() {
    const [details, setDetails] = useState("");
    const show = () => {
        api.detail_show(id, title, content)
        .then(response => {
            const { code, message, data } = response.data[0];
            if (code === 0) {
                console.log("api.detail_show 실행 성공")
                console.log("data:", data)
                const { data } = response.data[0]; // 적절한 데이터 구조에 맞춰 수정 필요
                setDetails(data); // 데이터를 상태에 저장
            } else {
                console.log("오류");
            }
        })
        .catch(err => {
            console.log(JSON.stringify(err));
        });
    }
    useEffect(() => {
        show(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);
    return (
        <div>
            <h1>공지글</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>관리자 ID</th>
                        <th>회원 수</th>
                        <th>지역</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(community => (
                        <tr key={community.id}>
                            <td>{community.id}</td>
                            <td>{community.title}</td>
                            <td>{community.content}</td>
                            <td>{community.admin_id}</td>
                            <td>{community.member_count}</td>
                            <td>{community.region}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
