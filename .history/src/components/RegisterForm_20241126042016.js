import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api'; // API 호출을 위한 모듈
import AsyncStorage from "@react-native-async-storage/async-storage";
import '../App.css'; // CSS 파일 import
export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);

            const response = await api.register(username, password);
            const { code, message } = response.data;

            if (code === 0) {
                alert("회원가입이 완료되었습니다.");
                navigate('/login');
            } else {
                alert("회원가입 중 오류가 발생했습니다: " + message);
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <div id="unique-register-container">
            <h1 id="unique-register-title">회원가입</h1>
            <div>
                <label className="unique-register-label" htmlFor="unique-username">아이디:</label>
                <input 
                    type="text" 
                    id="unique-username" 
                    className="unique-register-input" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div>
                <label className="unique-register-label" htmlFor="unique-password">비밀번호:</label>
                <input 
                    type="password" 
                    id="unique-password" 
                    className="unique-register-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <div>
                <label className="unique-register-label" htmlFor="unique-confirm-password">비밀번호 확인:</label>
                <input 
                    type="password" 
                    id="unique-confirm-password" 
                    className="unique-register-input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
            </div>
            <button id="unique-register-button" onClick={handleRegister}>회원가입</button>
        </div>
    );
}
