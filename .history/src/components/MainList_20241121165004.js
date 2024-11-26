import api from '../api'; // API 모듈 import
// 반복되는 항목의 컴포넌트
function Item({ title, description }) {
    return (
      <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    );
}
  
  // 메인 컴포넌트
export default function MainList() {
    const data = [
      { polylineId: 3}
    ];

    const handleLike = async () => {
        try {    
            // 서버에서 최신 likes 값 확인 (필요한 경우)
            const response = await api.getAlllike();
            console.log("like response (after update!!):", response.data);
        } catch (error) {
            console.error("Failed to handle like:", error);
        }
    };
    // <Item key={item.id} polylineId={item.polylineId} description={item.description} />
    return (
      <div>
        <h1>반복된 리스트</h1>
        {data.map((item) => (
          <BypolylineId polylineId={item.polylineId}/>
        ))}
      </div>
    );
  }
  