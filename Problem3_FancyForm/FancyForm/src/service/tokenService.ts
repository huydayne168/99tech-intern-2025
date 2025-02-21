import http from "../lib/axios";

async function getTokens() {
    try {
        const result = await http.get("/tokens");
        return result.data;
    } catch (error) {
        console.log(error);
    }
}

export default { getTokens };
