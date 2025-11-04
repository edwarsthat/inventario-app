
type propsType = {
    pageState: string;
}

export default function AppRouter({ pageState }: propsType) {
    console.log('🚦 [AppRouter] Renderizando página para pageState:', pageState);
    switch (pageState) {
        case 'Login':
            const LoginScreen = require('../screens/LoginScreen').default;
            return <LoginScreen />;
        case 'Home':
            const HomeScreen = require('../screens/Home').default;
            return <HomeScreen />;
        default:
            const NotFoundScreen = require('../screens/NotFoundScreen').default;
            return <NotFoundScreen />;
    }   
}