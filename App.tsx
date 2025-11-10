/**
 * InventoryApp - Aplicación de gestión de inventario
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Loading from './src/components/common/Loading';
import NavBar from './src/components/common/NavBar';
import { useUiStore } from './src/store/uiStore';
import { useAuthStore } from './src/store/authStore';
import { useRouteStore } from './src/store/routeStore';
import AppRouter from './src/components/navigation/AppRouter';


function App() {

  const isDarkMode = useColorScheme() === 'dark';
  const { setLoading } = useUiStore();
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { pushRoute, stack } = useRouteStore();

  const currentRoute = stack[stack.length - 1] || 'Auth/Login';
  const showNavBar = isAuthenticated && !currentRoute.startsWith('Auth/');

  useEffect(() => {
    const initialCheck = async () => {
      try {
        setLoading(true);
        await checkAuth();
        console.log('✅ [App] checkAuth completed. isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
          pushRoute('Home');
        } else {
          pushRoute('Auth/Login');
        }
      } catch (error) {
        console.error('Error during initial check:', error);
      } finally {
        setLoading(false);
      }
    }
    initialCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      pushRoute('Home');
    } else {
      pushRoute('Auth/Login');
    }
  }, [isAuthenticated, pushRoute]);




  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Loading />
      {showNavBar && <NavBar />}
      <AppRouter pageState={stack[stack.length - 1] || 'Auth/Login'} />
    </SafeAreaProvider>
  );
}



export default App;
