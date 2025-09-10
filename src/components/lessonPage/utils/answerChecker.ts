/**
 * Utility functions for word-by-word answer checking
 * Based on the dailydictation.com methodology
 */

export interface WordMatchResult {
    isCorrect: boolean
    wordResults: WordResult[]
    totalWords: number
    correctWords: number
}

export interface WordResult {
    word: string
    isCorrect: boolean
    isAlmostCorrect?: boolean // gần đúng (Levenshtein = 1)
    expectedVariants: string[]
    userInput: string
}
/**
 * Tính Levenshtein distance giữa hai chuỗi
 */
function levenshtein(a: string, b: string): number {
    const m = a.length,
        n = b.length
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]
            else
                dp[i][j] =
                    1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp[m][n]
}

/**
 * Normalizes text by removing extra spaces, converting to lowercase, and handling punctuation
 */
export function normalizeText(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/[.,!?;:]+$/, "") // Remove trailing punctuation
        .replace(/^[.,!?;:]+/, "") // Remove leading punctuation
}

/**
 * Splits text into words, handling punctuation and spaces
 */
export function splitIntoWords(text: string): string[] {
    const normalized = normalizeText(text)
    return normalized
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.trim())
}

/**
 * Checks if a user word matches any of the expected variants
 */
export function wordMatches(
    userWord: string,
    expectedVariants: string[]
): boolean {
    const normalizedUserWord = normalizeText(userWord)
    return expectedVariants.some(
        variant => normalizeText(variant) === normalizedUserWord
    )
}

/**
 * Performs word-by-word matching between user input and solution
 * @param userInput - The text input from the user
 * @param solution - 2D array where each inner array contains accepted variants for each word
 * @returns WordMatchResult with detailed matching information
 */
export function checkAnswer(
    userInput: string,
    solution: string[][]
): WordMatchResult {
    const userWords = splitIntoWords(userInput)
    const wordResults: WordResult[] = []
    let correctWords = 0
    let correctWordsInOrder = 0

    // Bước 1: Tìm tất cả từ đúng (không quan tâm thứ tự) để hiển thị giao diện đẹp
    const userMatched: boolean[] = new Array(userWords.length).fill(false)
    for (let i = 0; i < solution.length; i++) {
        let isCorrect = false
        let isAlmostCorrect = false
        let matchedUserIdx = -1
        let matchedWord = ""
        
        // Tìm từ user chưa match nào gần nhất (cho giao diện)
        for (let j = 0; j < userWords.length; j++) {
            if (userMatched[j]) continue
            for (const variant of solution[i]) {
                const normUser = normalizeText(userWords[j])
                const normVariant = normalizeText(variant)
                const dist = levenshtein(normUser, normVariant)
                console.log(
                    `So khop dap an[${i}] ('${variant}' norm: '${normVariant}') voi user[${j}] ('${userWords[j]}' norm: '${normUser}'), dist = ${dist}`
                )
                if (dist === 0) {
                    isCorrect = true
                    matchedUserIdx = j
                    matchedWord = userWords[j]
                    break
                } else if (dist === 1 && !isCorrect) {
                    isAlmostCorrect = true
                    matchedUserIdx = j
                    matchedWord = userWords[j]
                }
            }
            if (isCorrect || isAlmostCorrect) break
        }
        
        if (matchedUserIdx !== -1) userMatched[matchedUserIdx] = true
        if (isCorrect) correctWords++
        
        wordResults.push({
            word: isCorrect || isAlmostCorrect ? matchedWord : "",
            isCorrect,
            isAlmostCorrect: !isCorrect && isAlmostCorrect ? true : undefined,
            expectedVariants: solution[i],
            userInput: isCorrect || isAlmostCorrect ? matchedWord : "",
        })
    }

    // Bước 2: Kiểm tra thứ tự để quyết định có cho phép next challenge
    for (let i = 0; i < solution.length; i++) {
        if (i < userWords.length) {
            for (const variant of solution[i]) {
                const normUser = normalizeText(userWords[i])
                const normVariant = normalizeText(variant)
                const dist = levenshtein(normUser, normVariant)
                if (dist === 0) {
                    correctWordsInOrder++
                    break
                }
            }
        }
    }

    return {
        isCorrect: correctWordsInOrder === solution.length, // Chỉ đúng khi thứ tự đúng
        wordResults,
        totalWords: solution.length,
        correctWords, // Số từ đúng (không quan tâm thứ tự) để hiển thị
    }
}

/**
 * Formats the correct answer for display
 */
export function formatCorrectAnswer(solution: string[][]): string {
    return solution.map(wordVariants => wordVariants[0]).join(" ")
}

/**
 * Gets alternative variants for a word position
 */
export function getWordVariants(
    solution: string[][],
    wordIndex: number
): string[] {
    return solution[wordIndex] || []
}

/**
 * Checks if the user input is close to being correct (for hints)
 */
export function isCloseToCorrect(
    userInput: string,
    solution: string[][]
): boolean {
    const result = checkAnswer(userInput, solution)
    return result.correctWords >= solution.length * 0.7 // 70% correct threshold
}
