import { useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import tokenService from "./service/tokenService";
import { tokenActions } from "./lib/redux/tokenSlice";
import {
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

function App() {
    const dispatch = useAppDispatch();
    const tokenSlice = useAppSelector((state) => state.tokenSlice);
    const [fromCurrency, setFromCurrency] = useState("");
    const [toCurrency, setToCurrency] = useState("");
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [rate, setRate] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount(fromAmount);
        handleSelectToken(toCurrency, fromCurrency);
    };

    const handleConvert = () => {
        setIsLoading(true);
        // Simulating API call
        setTimeout(() => {
            setToAmount((Number.parseFloat(fromAmount) * rate).toFixed(4)); // Mock conversion
            setIsLoading(false);
        }, 1000);
    };

    const handleSelectToken = (
        fromToken: string | null,
        toToken: string | null
    ) => {
        tokenSlice.tokens?.forEach((token) => {
            if (fromToken && token.currency === fromToken) {
                dispatch(tokenActions.setFromToken({ fromToken: token }));
                return;
            }
            if (toToken && token.currency === toToken) {
                dispatch(tokenActions.setToToken({ toToken: token }));
                return;
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await tokenService.getTokens();

            dispatch(tokenActions.setTokens(data));
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (tokenSlice.fromToken?.price && tokenSlice?.toToken?.price) {
            const tokenRate =
                tokenSlice.fromToken?.price / tokenSlice.toToken?.price;
            setRate(tokenRate);
        }
    }, [tokenSlice.fromToken, tokenSlice.toToken]);
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[80%]">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Token Exchange
                </h1>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Input
                            type="number"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            placeholder="0.00"
                            className="flex-4/5 p-2 border rounded"
                        />
                        <FormControl className="w-[200px] flex-1/5">
                            <InputLabel
                                id="fromCurrency-label"
                                sx={{ color: "gray" }}
                            >
                                From Currency
                            </InputLabel>
                            <Select
                                labelId="fromCurrency-label"
                                id="fromCurrency"
                                value={fromCurrency}
                                label="From Currency"
                                onChange={(e) => {
                                    handleSelectToken(e.target.value, null);
                                    setFromCurrency(e.target.value);
                                }}
                                fullWidth
                            >
                                {tokenSlice.tokens?.map((token) => (
                                    <MenuItem
                                        key={token.currency}
                                        value={token.currency}
                                    >
                                        {token.currency}
                                        <img
                                            src={token.image}
                                            alt={token.currency}
                                            className="w-5 h-5 inline-block ml-2"
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <button onClick={handleSwap} className="mx-auto block">
                        <FontAwesomeIcon
                            icon={faArrowRightArrowLeft}
                            className="text-gray-500 hover:text-gray-700"
                        />
                    </button>

                    <div className="flex items-center space-x-4">
                        <Input
                            type="number"
                            value={toAmount}
                            readOnly
                            placeholder="0.00"
                            className="flex-4/5 p-2 border rounded bg-gray-100"
                        />
                        <FormControl className="flex-1/5">
                            <InputLabel
                                id="toCurrency-label"
                                sx={{ color: "gray" }}
                            >
                                To Currency
                            </InputLabel>
                            <Select
                                labelId="toCurrency-label"
                                id="toCurrency"
                                value={toCurrency}
                                label="To Currency"
                                onChange={(e) => {
                                    handleSelectToken(null, e.target.value);
                                    setToCurrency(e.target.value);
                                }}
                                fullWidth
                                className="flex items-center"
                            >
                                {tokenSlice.tokens?.map((token) => (
                                    <MenuItem
                                        key={token.currency}
                                        value={token.currency}
                                        className="flex items-center"
                                    >
                                        {token.currency}
                                        <img
                                            src={token.image}
                                            alt={token.currency}
                                            className="w-5 h-5 inline-block ml-2"
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        1 {tokenSlice.fromToken?.currency} = {rate}{" "}
                        {tokenSlice.toToken?.currency}
                    </div>

                    <button
                        onClick={handleConvert}
                        disabled={isLoading || !fromAmount}
                        className={`w-full p-2 rounded text-white flex items-center justify-center ${
                            isLoading || !fromAmount
                                ? "bg-gray-400"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                            <>
                                Convert
                                {
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="ml-2"
                                    />
                                }
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
