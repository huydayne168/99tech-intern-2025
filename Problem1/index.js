var sum_to_n_a = function (n) {
    const r = (n * (n + 1)) / 2;
    return r;
};

var sum_to_n_b = function (n) {
    let r = 0;
    for (let i = 1; i <= n; i++) {
        r += i;
    }
    return r;
};

var sum_to_n_c = function (n) {
    return n === 1 ? 1 : n + sum_to_n_c(n - 1);
};
