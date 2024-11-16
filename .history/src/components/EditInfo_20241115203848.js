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
            console.log("1");
            // Fetch user data from the Spring server
            api.getpassword(userId)
                .then(response => {
                    console.log("2");
                    const { code, message, data } = response.data;
                    console.log("3");
                    if (code === 0) {
                        console.log("data", data);
                        setUserId(data.userId);
                        setUserPw(data.password);
                    } else {
                        console.log("오류");
                        setError(message || "Failed to fetch user data");
                    }
                    console.log("4");
                })
                .catch(err => {
                    console.log(JSON.stringify(err));
                    setError("Failed to fetch user data");
                });
        } else {
            setError("User ID not found in localStorage");
        }
    }, [userId]);

    // Function to handle form submission
    const handleUpdate = () => {
        if (userId2 && userPw) {
            api.updateUser(userId2, userPw) // Update user info via API
                .then(response => {
                    console.log("User updated successfully:", response.data);
                    alert("User information updated successfully!");
                })
                .catch(err => {
                    console.log("Error updating user:", err);
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
        <div>
            <h1>EditInfo 화면입니다</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>
                        <strong>User ID:</strong>
                        <input
                            type="text"
                            value={userId2}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <strong>Password:</strong>
                        <input
                            type="text"
                            value={userPw}
                            onChange={(e) => setUserPw(e.target.value)}
                        />
                    </label>
                </div>
                <button type="button" onClick={handleUpdate}>
                    수정
                </button>
            </form>
        </div>
    );
}
