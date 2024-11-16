import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api';
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일을 불러옵니다.

export default function community_detail() {
    const show = () => {
        api.detail_show(id, title, content)
    }

    return (
        <div>안녕</div>
    );
}
