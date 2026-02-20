// 의존성 없는 Mock 인증 시스템
export const auth = async () => null;
export const signIn = async () => { };
export const signOut = async () => { };
export const handlers = {
    GET: () => new Response("OK"),
    POST: () => new Response("OK"),
};
