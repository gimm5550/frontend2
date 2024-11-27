import React, { useEffect, useState } from "react";
import axios from "axios";
import { REQUEST_URL } from "../url";
import { useNavigate } from "react-router-dom";
import api from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import KakaoLoginButton from './common/KakaoLoginButton';
import Lottie from "lottie-react";
import animation from "../assets/lottie.json";
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
            if (res.data.length > 0) {
                const userId = res.data[0].userId;
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
        console.log("아이디:", username);
        console.log("비밀번호:", password);
        api.login(username, password)
            .then(response => {
                const { code, message, data } = response.data;
                if (code === 0) {
                    const userData = {
                        id: username
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log("data", data);
                    console.log("로그인 완");
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
        <div className="unique-login-container">
            <div className="lottie-container">
                <Lottie animationData={animation} loop={true} autoplay={true} />
            </div>
            <div className="footer"></div>
            <h1 className="unique-login-title">로그인하세요.</h1>
            <div className="unique-login-input-group">
                <label htmlFor="username" className="unique-login-label">아이디</label>
                <input
                    type="text"
                    id="username"
                    className="unique-login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="unique-login-input-group">
                <label htmlFor="password" className="unique-login-label">비밀번호</label>
                <input
                    type="password"
                    id="password"
                    className="unique-login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="btnContainer">
                <button className="unique-login-button" onClick={handleLogin}>로그인</button>
                <button className="unique-register-button" onClick={register}>회원가입</button>
                <KakaoLoginButton />
            </div>
        </div>
    );
}
