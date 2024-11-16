import LoginFormLayout from "./components/layout/LoginFormLayout";
import UserDetailLayout from "./components/layout/UserDetailLayout";
import RegisterFormLayout from "./components/layout/RegisterFormLayout";
import MainListLayout from "./components/layout/MainListLayout"; // community_detail
import CommunityDetailLauout from "./components/layout/community_detailLayout";
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
]
export default routes;