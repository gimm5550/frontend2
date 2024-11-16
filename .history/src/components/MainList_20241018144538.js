import React, { useEffect } from "react"
import axios from "axios"
export default function MainList() {

    const handleLogin = () => {
        // 로그인 처리 로직 추가
        console.log("아이디:", username);
        console.log("비밀번호:", password);
        // 예를 들어, 로그인 성공 시 특정 페이지로 이동
        // navigate('/home'); >> routes를 만들어야함..
        api.login(username, password)
            .then(response => {
                const { code, message, data } = response.data[0];
                if (code === 0) {
                    console.log("data", data);
                    console.log("로그인 완")
                    navigate('/mainlist');
                } else {
                    console.log("오류");
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    };

    return <div>
        <p>커뮤니티 목록</p>
        <div>
            <p>
                커뮤1
            </p>
        </div>
    </div>
}