import axios from 'axios';
//114.204.175.6
//172.30.126.174
const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000
});

export default {


    login(id, pw) {
        console.log("login api 실행됨")
        return instance.post('/api/users/login', { userId: id, userPw: pw});
    },

    register(id, pw) {
        return instance.post('/api/users/register', { userId: id, userPw: pw});
    },

    list() {
        return instance.get('/api/list');
    },

    createCommunity(data) {
        return instance.post('/taxi/community', data);
    },

    call(id, startLat, startLng, startAddr, endLat, endLng, endAddr) {
        return instance.post('/taxi/call', {
            userId: id,
            startLat: startLat,
            startLng: startLng,
            startAddr: startAddr,
            endLat: endLat,
            endLng: endLng,
            endAddr: endAddr
        });
    },

    geoCoding(coords, key) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json";
        let lat = coords.latitude;
        let lng = coords.longitude;

        return axios.get(`${url}?latlng=${lat},${lng}&key=${key}&language=ko`);
    },

    // 커뮤니티 상세보기 API
    getCommunityDetail(communityId) {
        console.log("communityId:", communityId);
        return instance.get(`/community/${communityId}`);
    },

    // 커뮤니티 삭제 API
    deleteCommunity(communityId) {
        console.log("communityId:", communityId);
        return instance.delete(`/community/${communityId}`);
    },

    editCommunity(communityId, updatedData) {
        console.log("communityId:", communityId);
        console.log("updatedData:", updatedData);  // 수정할 데이터를 콘솔에 출력
        return instance.put(`/community/${communityId}`, updatedData);
    },

    outing(id, title, content, admin_id, member_count){
        console.log("outring함수실행")
        return instance.post('/community', {
            id: id,
            title: title,
            content: content,
            admin_id: admin_id,
            member_count: member_count
        });
    },

    newing(id, title, content, region){
        return instance.post('/new', {
            region: region,
            title: title,
            content: content,
            admin_id: id,
            member_count: 0
        });
    },

    detail_show(id){
        return instance.get(`/detail3/${id}`, {
            id: id
        });
    },

    detail_show2(id, id2){
        console.log("detail_show2실행")
        console.log("id:", id)
        return instance.get(`/detail4/${id}/${id2}`, {
        });
    },

    detail_new(title, content, editor, communityid){
        return instance.post('/detail2', {
            title: title,
            content: content,
            editor: editor,
            communityid: communityid
        });
    },

    detail_delete(id, detail_id) {
        return instance.delete(`/detail2/${id}/${detail_id}`); // URL에 detail_id를 포함시킴
    },

    add_comment(id, communityId, nickname, newComment){
        console.log("add_comment 실행!!")
        return instance.post(`/Comments/${id}/${communityId}`, {
            nickname: nickname,
            content: newComment
        });
    },
    // '/client/:id'
    get_approved_clients(id){
        return instance.get(`/client/${id}`, {
        });
    },
    
    get_pending_clients(id){
        return instance.get(`/client2/${id}`, {
        });
    },

    reject_client(clientId){
        return instance.delete(`/client2/${clientId}`, {
        });
    },

    expel_client(clientId){
        return instance.delete(`/client/${clientId}`, {
        });
    },

    approve_client(clientId, nickname){
        console.log("approve_client 발동")
        console.log("nickname2:", nickname)
        return instance.post(`/client/${clientId}`, {
            nickname: nickname
        });
    },

    request_join_community(nickname, communityId){
        return instance.post('/client2', {
            nickname: nickname
        });
    },

    get_pending_clients2(user_id){
        return instance.get(`/client3/${user_id}`, {
            user_id : user_id
        });
    },

    edit_info(userId){
        return instance.post('/edit', {
            userId: userId
        });
    },

    fetch_token(response){
        console.log("1")
        return instance.post('/login/success', {response: response});
    },

    getpassword(userId) {
        console.log("Sending userId as query parameter. userId:", userId);
    
        // userId가 객체일 경우 'id' 값을 추출, 그렇지 않으면 그대로 사용
        const extractedUserId = typeof userId === 'object' && userId.id ? userId.id : userId;
    
        // 추출된 userId를 URL 인코딩
        const encodedUserId = encodeURIComponent(extractedUserId);
    
        console.log("Encoded userId:", encodedUserId);
    
        // 인코딩된 userId를 URL에 포함
        return instance.get(`/api/edit/EditInfo?userId=${encodedUserId}`);
    },
    updateUser(userId2, userPw) {
        return instance.post('/api/edit/realedit', 
        {
            userId2: userId2,
            userPw: userPw
        });
    },

    deleteUser(user) {
        return instance.post('/api/edit/delete', 
        {
            user: user
        });
    },
    createTravelRecord(title, description) {
        return instance.post('/api/travel-records', { title : title, description : description });
    },
    addComment(travelRecordId, content, commentId) {
        console.log("commentId!!!!!!!:", commentId)
        return instance.post(`/api/comments`, {
            travelRecordId: travelRecordId,
            content: content,
            author: commentId.id // 작성자 이름을 적절히 설정
        });
    },
    // 댓글 데이터 가져오기
    getCommentsByTravelRecordId(travelRecordId) {
        return instance.get(`/api/comments/${travelRecordId}`);
    },

    PostPolyLine(formData) {
        console.log("PostPolyLine!!!!!!", formData);
        return instance.post('/api/polyline', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    getMyTreavel(userId){
        console.log("userId:", userId)
        return instance.get(`/api/travel/${userId}`);
    },
    getMyTreavelMyPolylineId(polylineId){
        console.log("polylineId!!!!:", polylineId)
        return instance.get(`/api/travel/detail/${polylineId}`);
    },
    getAllTreavel(){
        return instance.get('/api/travel/all');
    },
    // 여행 기록 삭제 API
    deleteTravelRecord(polylineId) {
        return instance.delete(`/api/travel/${polylineId}`);
    },
    getMarkersByPolylineId(polylineId) {
        return instance.get(`/api/polyline/${polylineId}/markers`);
    }, // `/api/polyline/${polylineId}/comments`
    postcomment2(comment, author, polylineId) {
        return instance.post(`/api/polyline/${polylineId}/comments`, { comment : comment, author : author });
    },
    getcomment2(polylineId) {
        console.log("polylineId을 출력:", polylineId)
        return instance.get(`/api/polyline/${polylineId}/comments`);
    },
}
