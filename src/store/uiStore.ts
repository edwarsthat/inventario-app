import { create } from 'zustand';

type UiStore = {
    loading: boolean;
    setLoading: (value: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
}));