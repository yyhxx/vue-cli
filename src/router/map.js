const MainPage = r => require.ensure([],() => r(require('@/views/')))
const HomePage = r => require.ensure([], () => r(require('@/views/home')))
/*登录页面*/
//const LoginPage = r => require.ensure([], () => r(require('@/views/user/login')))



/*error页面*/
const NotFoundPage = r => require.ensure([], () => r(require('@/views/error/404')))


const routes = [{
        path:"*",
        redirect:"/error/404"
    },
    {
        path:'/',
        component:MainPage,
        redirect:'/home',
        children:[{
            path:'home',
            component:HomePage,
            meta:{title:"首页"}
        }]

    }
]
export default routes



































