return (
    <div className="community-view">
        <h1>커뮤니티 상세</h1>
        <h2>{community.title}</h2>
        <p>{community.content}</p>
        <h3>댓글 목록</h3>
        <ul>
            {community.comment && community.comment.length > 0 ? (
                community.comment.map(comment => (
                    <li key={comment.id}>
                        <strong>{comment.nickname}:</strong> {comment.content}
                    </li>
                ))
            ) : (
                <li>댓글이 없습니다.</li> {/* 댓글이 없을 때 메시지 표시 */}
            )}
        </ul>
        <h3>댓글 작성</h3>
        <input 
            type="text" 
            value={newComment} 
            onChange={e => setNewComment(e.target.value)} 
            placeholder="댓글을 입력하세요" 
        />
        <button onClick={handleCommentSubmit}>댓글 추가</button> {/* 댓글 생성 버튼 */}
    </div>
);
