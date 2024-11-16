import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { REQUEST_URL } from "../url"
import axios from "axios"
export default function UserDetail() {
    const [user, setUser] = useState()
    const {userId} = useParams() // 객체 구조분해 할당
    async function getUserDetail(){
        try{
            const res = await axios.get(`${REQUEST_URL.USERS}/${userId}`)
            console.log("res", res)
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
                company name:{user.company? user.company.name:"익명 회사"}
            </p>
        </div>
    </div>}
    </div>
}