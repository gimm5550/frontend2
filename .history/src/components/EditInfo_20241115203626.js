import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { REQUEST_URL } from "../url";
import api from '../api';
export default function EditInfo() {
    // State to store user information
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [userId2, setUserId] = useState(null);
    const [userPw, setUserPw] = useState(null);
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
                        setUserPw(data.password)
                        setUserId(data.userId)
                    } else {
                        console.log("오류");
                    }
                    console.log("4");
                })
                .catch(err => {
                    console.log(JSON.stringify(err));
                });
            } else {
                setError("User ID not found in localStorage");
            }
        }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userId2) {
        return <div>Loading user data...</div>;
    }


    return (
        <div>
            <h1>EditInfo 화면입니다</h1>
            <p><strong>User ID:</strong> {userId2}</p>
            <p><strong>Password:</strong> {userPw}</p>
        </div>
    );
}
