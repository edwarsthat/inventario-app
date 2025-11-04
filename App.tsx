/**
 * InventoryApp - Aplicación de gestión de inventario
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Loading from './src/components/common/Loading';
import { useUiStore } from './src/store/uiStore';
import { useAuthStore } from './src/store/authStore';
import { useRouteStore } from './src/store/routeStore';
import AppRouter from './src/components/navigation/AppRouter';


function App() {

  const isDarkMode = useColorScheme() === 'dark';
  const { setLoading } = useUiStore();
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { pushRoute } = useRouteStore();
  const [ pageState, setPageState ] = useState<string>("");

  useEffect(() => {
    const initialCheck = async () => {
      try {
        setLoading(true);
        await checkAuth();
        console.log('✅ [App] checkAuth completed. isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
          pushRoute('Home');
          setPageState('Home');
        } else {
          pushRoute('Login');
          setPageState('Login');
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



  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Loading />
      <AppRouter pageState={pageState} />
    </SafeAreaProvider>
  );
}



export default App;
