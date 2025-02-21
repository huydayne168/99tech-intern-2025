import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Token from "../../models/Token";

interface TokenSlice {
    fromToken?: Token;
    toToken?: Token;
    tokens: Token[];
}

const initialState: TokenSlice = { tokens: [] };

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Token[]>) => {
            return { ...state, tokens: action.payload };
        },
        setFromToken: (state, action) => {
            state.fromToken = action.payload.fromToken;
        },
        setToToken: (state, action) => {
            state.toToken = action.payload.toToken;
        },
    },
});

export const tokenActions = tokenSlice.actions;
export default tokenSlice;
