import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
export default function UserDetail() {
    const [user, setUser] = useState()
    const {userId} = useParams() // 객체 구조분해 할당

    return <div>
        <p>커뮤니티 목록</p>
        <div>
            <p>
                커뮤1
            </p>
        </div>
    </div>
}