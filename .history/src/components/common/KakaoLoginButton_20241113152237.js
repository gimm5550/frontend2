import React from 'react';
import KakaoLogin from 'react-kakao-login';

const KakaoLoginButton = () => {
  const handleSuccess = (response) => {
    console.log("카카오 로그인 성공:", response);
    // 필요한 경우 서버로 토큰 전송
    fetch("http://localhost:8080/login/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.access_token }), // 백엔드로 토큰 전달
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
