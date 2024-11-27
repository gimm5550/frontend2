import React, { useEffect, useState } from "react";
import axios from "axios";
import { REQUEST_URL } from "../url";
import { useNavigate } from "react-router-dom";
import api from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import KakaoLoginButton from './common/KakaoLoginButton';
import '../login.css'; // CSS 파일 import
export default function FromServer() {
    const [users, setUsers] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function fetchPosts() {
        try {
            const res = await axios.get(REQUEST_URL.POSTS);
            console.log("res", res.data);
            // 예시로 첫 번째 사용자 ID로 이동
            if (res.data.length > 0) {
                const userId = res.data[0].userId; // 첫 번째 게시글의 사용자 ID를 사용
                navigate(`/user-detail/${userId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUsers() {
        let userId = await AsyncStorage.getItem('userId') || "";
        api.list(userId)
            .then(response => {
                const { code, message, data } = response.data[0];
                if (code === 0) {
                    console.log("data", data);
                    setUsers(data);
                } else {
                    console.log("오류");
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const register = () => {
        navigate('/register');
    }
    const handleLogin = () => {
        // 로그인 처리 로직 추가
        console.log("아이디:", username);
        console.log("비밀번호:", password);
        // 예를 들어, 로그인 성공 시 특정 페이지로 이동
        // navigate('/home'); >> routes를 만들어야함..
        api.login(username, password)
            .then(response => {
                const { code, message, data } = response.data;
                if (code === 0) {
                    const userData = {
                        id: username // 사용자 ID
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
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

    return (
        <div>
            <h1>로그인 페이지</h1>
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
            <button onClick={handleLogin}>로그인</button>
            <button onClick={register}>회원가입</button>
            {/* 카카오 로그인 버튼 추가 */}
            <KakaoLoginButton />
        </div>
    );
}
