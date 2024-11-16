import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { REQUEST_URL } from "../url";

export default function EditInfo() {
    // State to store user information
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // Get userId from localStorage
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (userId) {
            // Fetch user data from the Spring server
            axios
                .get(`${REQUEST_URL}/users/${userId}`) // Adjust the URL to match your Spring endpoint
                .then((response) => {
                    setUser(response.data); // Assuming the response contains user data
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setError("Failed to fetch user data");
                });
        } else {
            setError("User ID not found in localStorage");
        }
    }, [userId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div>
            <h1>EditInfo 화면입니다</h1>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Password:</strong> {user.password}</p>
        </div>
    );
}
