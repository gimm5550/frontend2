import React from 'react';
import KakaoLogin from 'react-kakao-login';
import api from '../../api';
const KakaoLoginButton = () => {
  const handleSuccess = (response) => {
    console.log("카카오 로그인 성공:", response);
    // 필요한 경우 서버로 토큰 전송
    console.log("response가 뭐라고?:", response);
    api.fetch_token(response)
      .then(response => {
        console.log("response:", response)
        const { code, message, data } = response.data;
        if (code === 0) {
            const userData = {
                id: username // 사용자 ID
            };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log("data", data);
            console.log("로그인 완")
            navigate('/mainlist');
        } else {
            console.log("code:", code);
            console.log("오류:", message);
            console.log("오류");
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  const handleFailure = (error) => {
    console.error("카카오 로그인 실패:", error);
  };

  return (
    <KakaoLogin
      token={"629a046bf0fa611328bd69bc1571aa3a"} // JavaScript 키를 입력
      onSuccess={handleSuccess}
      onFail={handleFailure}
      render={(props) => (
        <button onClick={props.onClick} style={{ padding: '10px 20px', backgroundColor: '#FEE500', border: 'none', borderRadius: '5px', color: '#3C1E1E', fontSize: '16px' }}>
          카카오 로그인
        </button>
      )}
    />
  );
};

export default KakaoLoginButton;
