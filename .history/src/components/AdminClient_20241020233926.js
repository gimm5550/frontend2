import React, { useEffect, useState } from "react";
import api from '../api'; // api 모듈 import
import '../MainList.css'; // 스타일 import

export default function AdminClient() {
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기
    const [approvedClients, setApprovedClients] = useState([]); // 승인된 회원 목록
    const [pendingClients, setPendingClients] = useState([]); // 승인 요청 중인 회원 목록
    const [error, setError] = useState(null); // 오류 메시지 상태

    useEffect(() => {
        fetchApprovedClients(); // 승인된 회원 목록 가져오기
        fetchPendingClients(); // 승인 요청 중인 회원 목록 가져오기
    }, []);

    const fetchApprovedClients = async () => {
        try {
            const response = await api.get_approved_clients(); // 승인된 회원 조회 API 호출
            setApprovedClients(response.data);
        } catch (err) {
            console.error("승인된 회원 조회 중 오류 발생:", err);
            setError("승인된 회원 조회 중 오류가 발생했습니다.");
        }
    };

    const fetchPendingClients = async () => {
        try {
            const response = await api.get_pending_clients(); // 승인 요청 중인 회원 조회 API 호출
            setPendingClients(response.data);
        } catch (err) {
            console.error("승인 요청 중인 회원 조회 중 오류 발생:", err);
            setError("승인 요청 중인 회원 조회 중 오류가 발생했습니다.");
        }
    };

    const handleExpelClient = async (clientId) => {
        if (window.confirm("정말로 이 회원을 방출하시겠습니까?")) {
            try {
                await api.expel_client(clientId); // 방출 API 호출
                fetchApprovedClients(); // 방출 후 승인된 회원 목록 다시 가져오기
            } catch (err) {
                console.error("회원 방출 중 오류 발생:", err);
                setError("회원 방출 중 오류가 발생했습니다.");
            }
        }
    };

    const handleApproveClient = async (clientId) => {
        try {
            await api.approve_client(clientId); // 승인 API 호출
            fetchPendingClients(); // 승인 후 승인 요청 중인 회원 목록 다시 가져오기
        } catch (err) {
            console.error("회원 승인 중 오류 발생:", err);
            setError("회원 승인 중 오류가 발생했습니다.");
        }
    };

    const handleRejectClient = async (clientId) => {
        if (window.confirm("정말로 이 회원을 거절하시겠습니까?")) {
            try {
                await api.reject_client(clientId); // 거절 API 호출
                fetchPendingClients(); // 거절 후 승인 요청 중인 회원 목록 다시 가져오기
            } catch (err) {
                console.error("회원 거절 중 오류 발생:", err);
                setError("회원 거절 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div>
            <h1>회원 관리 페이지</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            
            <h2>승인된 회원</h2>
            <ul>
                {approvedClients.map(client => (
                    <li key={client.id}>
                        {client.nickname} 
                        <button onClick={() => handleExpelClient(client.id)}>방출</button>
                    </li>
                ))}
            </ul>

            <h2>승인 요청 중인 회원</h2>
            <ul>
                {pendingClients.map(client => (
                    <li key={client.id}>
                        {client.nickname} 
                        <button onClick={() => handleApproveClient(client.id)}>승인</button>
                        <button onClick={() => handleRejectClient(client.id)}>거절</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
