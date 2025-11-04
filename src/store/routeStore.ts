import { create } from 'zustand';

interface RouteStore {
    stack: string[];
    
    // Actions
    pushRoute: (route: string) => void;
    popRoute: () => string | undefined;
    clearStack: () => void;
    getCurrentRoute: () => string | undefined;
    getStackSize: () => number;
    replaceCurrentRoute: (route: string) => void;
    goBack: (steps?: number) => void;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
    stack: [],

    // Agregar una nueva ruta al stack
    pushRoute: (route: string) => {
        console.log('📍 [RouteStore] Agregando ruta:', route);
        set((state) => {
            const newStack = [...state.stack, route];
            console.log('📚 [RouteStore] Stack actualizado:', newStack);
            return { stack: newStack };
        });
    },

    // Quitar la última ruta del stack
    popRoute: () => {
        const { stack } = get();
        if (stack.length === 0) {
            console.warn('⚠️ [RouteStore] No hay rutas para quitar');
            return undefined;
        }

        const removedRoute = stack[stack.length - 1];
        console.log('🔙 [RouteStore] Quitando ruta:', removedRoute);
        
        set((state) => {
            const newStack = state.stack.slice(0, -1);
            console.log('📚 [RouteStore] Stack después de quitar:', newStack);
            return { stack: newStack };
        });

        return removedRoute;
    },

    // Limpiar todo el stack
    clearStack: () => {
        console.log('🧹 [RouteStore] Limpiando stack completo');
        set({ stack: [] });
    },

    // Obtener la ruta actual (última en el stack)
    getCurrentRoute: () => {
        const { stack } = get();
        const currentRoute = stack.length > 0 ? stack[stack.length - 1] : undefined;
        console.log('🔍 [RouteStore] Ruta actual:', currentRoute);
        return currentRoute;
    },

    // Obtener el tamaño del stack
    getStackSize: () => {
        const { stack } = get();
        console.log('📏 [RouteStore] Tamaño del stack:', stack.length);
        return stack.length;
    },

    // Reemplazar la ruta actual sin agregar una nueva
    replaceCurrentRoute: (route: string) => {
        console.log('🔄 [RouteStore] Reemplazando ruta actual con:', route);
        set((state) => {
            if (state.stack.length === 0) {
                // Si no hay rutas, simplemente agregar
                console.log('📍 [RouteStore] Stack vacío, agregando primera ruta');
                return { stack: [route] };
            }
            
            const newStack = [...state.stack];
            newStack[newStack.length - 1] = route;
            console.log('📚 [RouteStore] Stack después de reemplazar:', newStack);
            return { stack: newStack };
        });
    },

    // Ir hacia atrás un número específico de pasos
    goBack: (steps: number = 1) => {
        const { stack } = get();
        console.log(`🔙 [RouteStore] Yendo ${steps} paso(s) atrás`);
        
        if (steps <= 0) {
            console.warn('⚠️ [RouteStore] Número de pasos debe ser mayor a 0');
            return;
        }

        if (steps >= stack.length) {
            console.log('🧹 [RouteStore] Pasos exceden el stack, limpiando todo');
            set({ stack: [] });
            return;
        }

        set((state) => {
            const newStack = state.stack.slice(0, -steps);
            console.log('📚 [RouteStore] Stack después de ir atrás:', newStack);
            return { stack: newStack };
        });
    },
}));
