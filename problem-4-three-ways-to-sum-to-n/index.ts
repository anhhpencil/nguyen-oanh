/**
 * The first way is internation loop with time complexity is O(n) and space complexity is O(1)
 * @param n: the number need to sum
 * @return sum of n
 */
function sum_to_n_a(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

/**
 * The second way is using the math: sum = (n * n(+1)) / 2 with time complexity is O(1) and space complexity is O(1)
 * @param n: the number need to sum
 * @return sum of n
 */
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}


/**
 * The third way is using recursion with time complexity is O(1) and space complexity is O(n) and can cause stack overflow if n is too large
 * @param n: the number need to sum
 * @return sum of n
 */
function sum_to_n_c(n: number): number {
    if (n === 1) return n;
    return n + sum_to_n_c(n - 1);
}
