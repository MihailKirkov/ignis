let pending: string | null = null;

export const setScrollIntent = (hash: string) => {
    pending = hash;
};

export const getScrollIntent = () => pending;

export const clearScrollIntent = () => {
    pending = null;
};
