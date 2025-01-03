import LoginFormLayout from "./components/layout/LoginFormLayout";
import UserDetailLayout from "./components/layout/UserDetailLayout";
import RegisterFormLayout from "./components/layout/RegisterFormLayout";
import MainListLayout from "./components/layout/MainListLayout"; // community_detail
import CommunityDetailLauout from "./components/layout/community_detailLayout";
import NewCommunityLayout from "./components/layout/NewCommunityLayout";
import CommunityViewLayout from "./components/layout/CommunityViewLayout"; // AdminClient
import AdminClientLayout from "./components/layout/AdminClientLayout"; 
import EditFormLayout from "./components/layout/EditFormLayout";
import GoogleMapLayout from "./components/layout/GoogleMapLayout"; // MyTravelLayout
import MyTravelLayout from "./components/layout/MyTravelLayout";
import MyTravelLayout_BypolylineIdt from "./components/layout/MyTravelLayout_BypolylineId";
const routes = [
    {
        name:"UserDetail",
        key:"userDetail",
        route:"/user-detail/:userId",
        component:<UserDetailLayout></UserDetailLayout>
    },
    {
        name:"LoginForm",
        key:"loginForm",
        route:"/login",
        component:<LoginFormLayout></LoginFormLayout>
    },
    {
        name:"RegisterForm",
        key:"RegisterForm",
        route:"/register",
        component:<RegisterFormLayout></RegisterFormLayout>
    },
    {
        name:"MainList",
        key:"MainList",
        route:"/mainlist",
        component:<MainListLayout></MainListLayout>
    },
    {
        name:"community_detail",
        key:"community_detail",
        route:"/community_detail",
        component:<CommunityDetailLauout></CommunityDetailLauout>
    },
    {
        name:"new_community",
        key:"new_community",
        route:"/new_community",
        component:<NewCommunityLayout></NewCommunityLayout>
    },
    {
        name:"CommunityView",
        key:"CommunityView",
        route:"/CommunityView",
        component:<CommunityViewLayout></CommunityViewLayout>
    },
    {
        name: "CommunityView",
        key: "communityView",
        route: "/CommunityView/:id", // ID를 URL 매개변수로 받도록 수정
        component: <CommunityViewLayout></CommunityViewLayout>
    },
    {
        name: "AdminClient",
        key: "AdminClient",
        route: "/AdminClient/:id", // ID를 URL 매개변수로 받도록 수정
        component: <AdminClientLayout></AdminClientLayout>
    },
    {
        name: "community_detail",
        key: "community_detail",
        route: '/community_detail/:id', // ID를 URL 매개변수로 받도록 수정
        component: <CommunityDetailLauout></CommunityDetailLauout>
    },
    {
        name: "new_community",
        key: "new_community",
        route: '/new_community/:id', // ID를 URL 매개변수로 받도록 수정 `/CommunityView/${id}/${communityId}`
        component: <NewCommunityLayout></NewCommunityLayout>
    },
    {
        name: "new_community",
        key: "new_community",
        route: '/CommunityView/:id/:communityId',
        component: <CommunityViewLayout></CommunityViewLayout>
    },
    {
        name:"EditForm",
        key:"EditForm",
        route:"/edit_info",
        component:<EditFormLayout></EditFormLayout>
    },
    {
        name:"GoogleMap",
        route: "/GoogleMap",
        component: <GoogleMapLayout />, // GoogleMapLayout 컴포넌트 연결
        key: "google-map",
    },
    {
        name:"MyTravel",
        route: "/MyTravel",
        component: <MyTravelLayout />, // GoogleMapLayout 컴포넌트 연결
        key: "MyTravel",
    },
    {
        name:"MyTravel_BypolylineId",
        route: "/MyTravel/:polylineId",
        component: <MyTravelLayout_BypolylineId />, // GoogleMapLayout 컴포넌트 연결
        key: "MyTravel_BypolylineId",
    },
]
export default routes;