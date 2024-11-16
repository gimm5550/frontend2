import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { REQUEST_URL } from "../url"
import axios from "axios"
export default function EditInfo() {
    const [user, setUser] = useState()
    const {userId} = useParams() // 객체 구조분해 할당
    async function getUserDetail(){
        try{
            const res = await axios.get(`${REQUEST_URL.USERS}/${userId}`)
            setUser(res.data)
        } catch (error){

        }
    }
    useEffect(()=>{
        getUserDetail()
    })
    return <div>
        {user&&<div>
        <p>{`name:${user.name||"익명 사용자"}` }</p>
        <div>
            <p>
                EditInfo 화면입니다.
            </p>
        </div>
    </div>}
    </div>
}