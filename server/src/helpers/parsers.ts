
export const parseBool = (val: string|null|undefined, defaultValue = false) => {
    if (!val) {
        return defaultValue;
    }
    if (typeof val === 'string') {
        val = val.toLocaleLowerCase();
    }
    return JSON.parse(val);
}
