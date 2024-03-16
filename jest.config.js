module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/test"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    clearMocks: true,
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/src/utils/singleton.ts"],
};
