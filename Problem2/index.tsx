/**
 * What I changed:
 * 1. Added to interface WalletBallance 'blockchain' property with type string. Because it is used in the sortedBalances function.
 * 2. Change the type of the argument in the getPriority function from 'any' to 'string'.
 * 3. Change interface FormattedWalletBalance to extend WalletBalance.
 * 4. Refactor the sort and filter functions in the useMemo function.
 */

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // added blockchain property
}
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const getPriority = (blockchain: string): number => {
        // blockchain type any -> string
        switch (blockchain) {
            case "Osmosis":
                return 100;
            case "Ethereum":
                return 50;
            case "Arbitrum":
                return 30;
            case "Zilliqa":
                return 20;
            case "Neo":
                return 20;
            default:
                return -99;
        }
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // if (lhsPriority > -99) {
                //    if (balance.amount <= 0) {
                //      return true;
                //    }
                // }
                // return false;
                return balancePriority > -99 && balance.amount <= 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // if (leftPriority > rightPriority) {
                //     return -1;
                //   } else if (rightPriority > leftPriority) {
                //     return 1;
                //   }
                return rightPriority - leftPriority;
            });
    }, [balances, prices]);

    const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
        (balance: WalletBalance) => {
            return {
                ...balance,
                formatted: balance.amount.toFixed(),
            };
        }
    );

    const rows = sortedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            );
        }
    );

    return <div {...rest}>{rows}</div>;
};
