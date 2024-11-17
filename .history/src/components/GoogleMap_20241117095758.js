import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import KakaoLoginButton from './common/KakaoLoginButton';

export default function GoogleMap() {
    const [callList, setCallList] = useState([]); // 호출 리스트
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();

    // 호출 리스트 요청
    const requestCallList = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId') || "";
            const response = await api.list(userId);
    
            // 서버 응답 출력
            console.log("Server Response:", response);
    
            const { code, message, data } = response.data[0];
            if (code === 0) {
                setCallList(data);
            } else {
                alert(`오류: ${message}`);
            }
        } catch (err) {
            console.error("리스트 요청 중 오류 발생:", err);
        } finally {
            setLoading(false);
        }
    };
    

    // 수락 버튼 클릭 핸들러
    const onAccept = async (item) => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('userId') || "";
            const response = await api.accept(userId, item.id, item.user_id);
            const { code, message } = response.data[0];
            if (code === 0) {
                requestCallList(); // 리스트 다시 요청
            } else {
                alert(`오류: ${message}`);
            }
        } catch (err) {
            console.error("수락 중 오류 발생:", err);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 호출 리스트 요청
    useEffect(() => {
        requestCallList();
    }, []);

    return (
        <div style={styles.container}>
            <h1>구글맵 페이지</h1>
            <button onClick={requestCallList} style={styles.refreshButton}>
                새로고침
            </button>
            {loading && <div style={styles.loading}>로딩 중...</div>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>출발지</th>
                        <th>도착지</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {callList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.start_addr}</td>
                            <td>{item.end_addr}</td>
                            <td>
                                {item.call_state === "REQ" ? (
                                    <button
                                        style={styles.acceptButton}
                                        onClick={() => onAccept(item)}
                                    >
                                        수락
                                    </button>
                                ) : (
                                    item.call_state
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// 간단한 스타일 객체
const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    refreshButton: {
        backgroundColor: "#3498db",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
    },
    loading: {
        margin: "20px 0",
        color: "#3498db",
        fontSize: "16px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    tableHeader: {
        backgroundColor: "#3498db",
        color: "white",
        textAlign: "left",
        padding: "10px",
    },
    acceptButton: {
        backgroundColor: "#27ae60",
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};
