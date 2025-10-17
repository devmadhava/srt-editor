// // const { createDefaultPreset } = require("ts-jest");

// // const tsJestTransformCfg = createDefaultPreset().transform;

// // /** @type {import("jest").Config} **/
// // export default {
// //   testEnvironment: "node",
// //   transform: {
// //     ...tsJestTransformCfg,
// //   },
// // };

// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };

const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.jest.json",
        },
    },
};
