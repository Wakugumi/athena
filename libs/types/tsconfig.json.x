{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS", // or "ESNext" if your app supports it
    "declaration": true, // generate .d.ts files for TS consumers
    "outDir": "../../dist/libs/types/", // compiled files go here
    "rootDir": "src", // source folder
    "composite": true, // required for project references
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "types": [
      "node"
    ]
  },
  "include": [
    "src"
  ]
}
