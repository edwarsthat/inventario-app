
type propsType = {
    pageState: string;
}

export default function AuthRoutes({ pageState }: propsType) {
    console.log('🚦 [AuthRoutes] Renderizando página para pageState:', pageState);
    switch (pageState) {
        case 'Login':
            const LoginScreen = require('../screens/auth/LoginScreen').default;
            return <LoginScreen />;
        case 'ResetPassword':
            const ChangePass = require('../screens/auth/ChangePass').default;
            return <ChangePass />;
        default:
            const NotFoundScreen = require('../screens/NotFoundScreen').default;
            return <NotFoundScreen />;
    }   
}