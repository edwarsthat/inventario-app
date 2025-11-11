
type propsType = {
    pageState: string;
}

export default function AppRouter({ pageState }: propsType) {
    console.log('🚦 [AppRouter] Renderizando página para pageState:', pageState);
    const rutas = pageState.split('/');
    switch (rutas[0]) {
        case 'Auth':
            const AuthRoutes = require('./AuthRoutes').default;
            return <AuthRoutes pageState={rutas[1]} />;
        case 'Home':
            const HomeScreen = require('../screens/Home').default;
            return <HomeScreen />;
        case 'Scanner':
            const ScannerScreen = require('../screens/scanner/ScannerScreen').default;
            return <ScannerScreen />;
        default:
            const NotFoundScreen = require('../screens/NotFoundScreen').default;
            return <NotFoundScreen />;
    }   
}