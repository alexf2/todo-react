export const getCodeByError = (err: any) => {
    if (err instanceof SyntaxError) {
        return 400;
    }
    if (typeof err.getHttpCode === 'function') {
        return err.getHttpCode();
    }
    return 500;
}
