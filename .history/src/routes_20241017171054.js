import LoginFormLayout from "./components/layout/LoginFormLayout";
import UserDetailLayout from "./components/layout/UserDetailLayout";
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
    }
]
export default routes;