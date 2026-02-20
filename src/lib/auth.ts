// NextAuth 비활성화를 위한 Mock 파일
export const auth = async () => null;
export const signIn = async () => { };
export const signOut = async () => { };
export const handlers = {
    GET: async () => new Response("OK"),
    POST: async () => new Response("OK"),
};
