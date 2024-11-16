import axios from 'axios';
//114.204.175.6
//172.30.126.174
const instance = axios.create({
    baseURL: 'http://172.30.126.174:3000',
    timeout: 1000
});

export default {
    test() {
        return instance.post('/taxi/test');
    },

    login(id, pw) {
        return instance.post('/taxi/login', { userId: id, userPw: pw});
    },

    register(id, pw) {
        return instance.post('/taxi/register', { userId: id, userPw: pw});
    },

    list(id) {
        return instance.post('/taxi/list', { userId: id });
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

    detail_show(){
        return instance.get('/detail2', {
            id: id,
            title: title,
            content: content
        });
    }
}
