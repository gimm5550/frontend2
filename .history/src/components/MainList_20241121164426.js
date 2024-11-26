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
      { id: 1, title: "첫 번째 항목", description: "이것은 첫 번째 항목입니다." },
      { id: 2, title: "두 번째 항목", description: "이것은 두 번째 항목입니다." },
      { id: 3, title: "세 번째 항목", description: "이것은 세 번째 항목입니다." },
    ];

    const handleLike = async () => {
        try {    
            // 서버에서 최신 likes 값 확인 (필요한 경우)
            const response = await api.getAlllike();
            console.log("like response (after update):", response.data);
        } catch (error) {
            console.error("Failed to handle like:", error);
        }
    };
  
    return (
      <div>
        <h1>반복된 리스트</h1>
        {data.map((item) => (
          <Item key={item.id} title={item.title} description={item.description} />
        ))}
      </div>
    );
  }
  