import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api';
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일을 불러옵니다.

export default function community_detail() {
    const [detail, setDetail] = useState("");
    const show = () => {
        api.detail_show(id, title, content)
        .then(response => {
            const { code, message, data } = response.data[0];
            if (code === 0) {
                console.log("api.detail_show 실행 성공")
                console.log("data:", data)
                const { data } = response.data[0]; // 적절한 데이터 구조에 맞춰 수정 필요
                setDetail(data); // 데이터를 상태에 저장
            } else {
                console.log("오류");
            }
        })
        .catch(err => {
            console.log(JSON.stringify(err));
        });
    }

    return (
        <div>안녕</div>
    );
}
