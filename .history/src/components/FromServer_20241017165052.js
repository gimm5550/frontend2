import React, { useEffect, useState } from "react"
import axios from "axios"
import { REQUEST_URL } from "../url"
import { useNavigate } from "react-router-dom"
import api from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";

const tableHeader = ['name', 'email', 'phone', 'website']
export default function FromServer(){
    const [users, setUsers] = useState(null)
    const navigate = useNavigate()

    async function fetchPosts(){
        try{
            const res = await axios.get(REQUEST_URL.POSTS) 
            console.log("res", res.data)
            // 예시로 첫 번째 사용자 ID로 이동
            if (res.data.length > 0) {
                const userId = res.data[0].userId; // 첫 번째 게시글의 사용자 ID를 사용
                navigate(`/user-detail/${userId}`);
            }
        } catch (error){
            console.log(error)
        }
    }

    async function fetchUsers(){
        let userId = await AsyncStorage.getItem('userId') || "";
        api.list(userId)
            .then(response => {
                const { code, message, data } = response.data[0];
                if (code === 0) {
                    console.log("data",data)
                    setUsers(data)
                } else {
                    console.log("오류")
                }
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    }

    async function createPosts(){
        try{
            const postData = {
                userId: 11,
                id: 101,
                body: "test body",
                title: "test title"
            }
            const res = await axios.post(REQUEST_URL.POSTS) 
            console.log("res", res.data)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchUsers()
    },[])

    async function clickUserHandler(e){
        const userId = parseInt(e.currentTarget.dataset.userid)
        navigate(`/user-detail/${userId}`)
    }

    return(
        <div>
            <h1>Axios 테스트</h1>
            <button onClick={fetchPosts}>게시글 정보</button>
            <button onClick={fetchUsers}>사용자 정보</button>
            <button onClick={createPosts}>게시글 작성</button>
            {users ? (
                <table border={1}>
                    <thead>
                        <tr>
                            {tableHeader.map(th => <th key={th}>{th}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} data-userid={user.id} onClick={clickUserHandler}>
                                <td>{user.id}</td>
                                <td>{user.title}</td>
                                <td>{user.content}</td>
                                <td>{user.user_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null}
        </div>
    )
}
