import React, { useEffect, useState } from "react";
import axios from "axios";
import { REQUEST_URL } from "../url";
import { useNavigate } from "react-router-dom";
import api from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import KakaoLoginButton from './common/KakaoLoginButton';
export default function GoogleMap() {

    return (
        <div>
            <h1>구글맵 페이지</h1>
        </div>
    );
}
