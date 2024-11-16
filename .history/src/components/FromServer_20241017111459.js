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
                    setCallList(data);
                } else {
                    console.log("오류")
                }
                setLoading(false);
            })
            .catch(err => {
                console.log(JSON.stringify(err));
                setLoading(false);
            });

        // try{
            // const res = await axios.get(REQUEST_URL.USERS) 
            // console.log("res", res.data)
            // setUsers(res.data)
        // } catch (error){
            // console.log(error)
        // }
    }
    async function createPosts(){
        try{
            const postData = {
                userId:11,
                id:101,
                body:"test body",
                title:"test title"
            }
            const res = await axios.post(REQUEST_URL.POSTS) //이 코드가 서버에게 데이터를 요청해서 그 응답을 받는 코드, 아직은 진짜 응답값을 받은건 아님
            console.log("res", res.data)
        } catch (error){
            console.log(error)
        }
    }
    useEffect(
        ()=>{
            fetchUsers()
        },[]
    ) // useEffect에 2개의 인자임.
    async function clickUserHandler(e){
        const userId = parseInt(e.currentTarget.dataset.userid) //반드시 모든 문자를 소문자로
        // router, Link를 이용해서 페이지를 넘어갔는데
        // 2navigator이용
        navigate(`/user-detail/${userId}`)
        
    }
    return(
        <div>
            <h1>Axios 테스트</h1>
            <button onClick={fetchPosts}>게시글 정보</button>
            <button onClick={fetchUsers}>사용자 정보</button>
            <button onClick={createPosts}>게시글 작성</button>
            {users?(<table border={1}>
                <thead>
                    <tr>
                        {tableHeader.map(th=><th>th</th>)}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user=><tr data-userid={user.id} onClick={clickUserHandler}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user.website}</td>
                    </tr>)}
                </tbody>
            </table>):null}

        </div>
    )
}