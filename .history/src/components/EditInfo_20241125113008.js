import React, { useEffect, useState } from "react";
import api from '../api';

export default function EditInfo() {
    // State to store user information
    const [userId2, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [error, setError] = useState(null);

    // Get userId from localStorage
    const userId = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (userId) {
            console.log("Fetching user data...");
            api.getpassword(userId)
                .then(response => {
                    const { code, message, data } = response.data;
                    if (code === 0) {
                        setUserId(data.userId); // 초기 값 설정
                        setUserPw(data.password); // 초기 값 설정
                    } else {
                        setError(message || "Failed to fetch user data");
                    }
                })
                .catch(err => {
                    setError("Failed to fetch user data");
                });
        } else {
            setError("User ID not found in localStorage");
        }
    }, []); // 빈 배열로 설정하여 초기 렌더링 시에만 실행

    const handleUpdate = () => {
        if (userId2 && userPw) {
            api.updateUser(userId2, userPw) // Update user info via API
                .then(response => {
                    alert("User information updated successfully!");
                })
                .catch(err => {
                    alert("Failed to update user information.");
                });
        } else {
            alert("Please fill in all fields.");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userId2) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="custom-editinfo-container">
            <h1 className="custom-editinfo-title">EditInfo 화면입니다</h1>
            <form
                className="custom-editinfo-form"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="custom-editinfo-field">
                    <label className="custom-editinfo-label">
                        <strong>User ID:</strong>
                        <input
                            type="text"
                            className="custom-editinfo-input"
                            value={userId2}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </label>
                </div>
                <div className="custom-editinfo-field">
                    <label className="custom-editinfo-label">
                        <strong>Password:</strong>
                        <input
                            type="text"
                            className="custom-editinfo-input"
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                        />
                    </label>
                </div>
                <button
                    type="button"
                    className="custom-editinfo-button"
                    onClick={handleUpdate}
                >
                    수정
                </button>
            </form>
        </div>
    );
    
}
