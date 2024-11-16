import React, { useEffect } from "react"
import axios from "axios"
export default function MainList() {

    let id;
    let title;
    let content;
    let admin_id;
    let member_count;
    const handleLogin = () => {
        api.outing(id, title, content, admin_id, member_count)
            .then(response => {
                const { code, message, data } = response.data[0];
                if (code === 0) {
                    console.log("data", data);
                    console.log("로그인 완")
                } else {
                    console.log("오류");
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    };

    return <div>
        <p>커뮤니티 목록</p>
        <div>
            <p>
                커뮤1
            </p>
        </div>
    </div>
}