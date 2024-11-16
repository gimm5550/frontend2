import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../api'; // API 호출을 위한 모듈
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        // 비밀번호 확인
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 알림
            return;
        }

        try {
            // AsyncStorage에 아이디와 비밀번호 저장
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            
            // API 호출하여 사용자 등록
            const response = await api.register(username, password);
            const { code, message, data } = response.data;
            
            if (code === 0) {
                alert("회원가입이 완료되었습니다."); // 회원가입 성공 알림
                navigate('/login'); // 로그인 페이지로 이동
            } else {
                alert("회원가입 중 오류가 발생했습니다: " + message); // 오류 알림
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            alert("회원가입에 실패했습니다."); // 오류 발생 알림
        }
    };

    return (
        <div>
            <h1>회원가입</h1>
            <div>
                <label htmlFor="username">아이디:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="password">비밀번호:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="confirmPassword">비밀번호 확인:</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
            </div>
            <button onClick={handleRegister}>생성</button>
        </div>
    );
}
