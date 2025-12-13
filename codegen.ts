import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql', // URL Gateway để lấy Schema
  documents: ['src/**/*.tsx', 'src/**/*.ts', 'src/graphql/**/*.graphql'], // Nơi chứa query
  ignoreNoDocuments: true,
  generates: {
    './src/generated/': { // Folder chứa code sinh ra
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    }
  }
};

export default config;