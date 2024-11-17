import React, { useEffect, useState } from "react";
import axios from "axios";
import { REQUEST_URL } from "../url";
import { useNavigate } from "react-router-dom";
import api from '../api';
import KakaoLoginButton from './common/KakaoLoginButton';

export default function GoogleMap() {
    const [callList, setCallList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchCallList = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId') || "";
            const response = await api.list(userId);
            const { code, message, data } = response.data[0];
            if (code === 0) {
                setCallList(data);
            } else {
                alert(`오류: ${message}`);
            }
        } catch (err) {
            console.error("데이터 요청 중 오류 발생:", err);
        } finally {
            setLoading(false);
        }
    };

    const createCommunity = async () => {
        setModalVisible(true);
    };

    const submitCommunity = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId') || "";
            await api.createCommunity({ title, content, user_id: userId });
            setModalVisible(false);
            setTitle("");
            setContent("");
            fetchCallList(); // 새로고침
        } catch (err) {
            console.error("커뮤니티 생성 중 오류:", err);
        }
    };

    useEffect(() => {
        fetchCallList();
    }, []);

    return (
        <div>
            <h1>구글맵 페이지</h1>
            <button onClick={fetchCallList}>새로고침</button>
            <button onClick={createCommunity}>커뮤니티 생성</button>

            {loading && <div>Loading...</div>}

            <ul>
                {callList.map(item => (
                    <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                        <button>입장</button>
                    </li>
                ))}
            </ul>

            {modalVisible && (
                <div>
                    <h2>커뮤니티 생성</h2>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button onClick={submitCommunity}>생성</button>
                    <button onClick={() => setModalVisible(false)}>취소</button>
                </div>
            )}
        </div>
    );
}
