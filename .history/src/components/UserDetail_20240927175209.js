import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
export default function UserDetail() {
    const [user, setUser] = useState()
    const {userId} = useParams() // 객체 구조분해 할당
    async function getUserDetail(){
        try{

        } catch (error){

        }
    }
    useEffect(()=>{
        console.log("userId", userId)
    })
    return <div>

    </div>
}