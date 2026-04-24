import { defineBackend } from '@aws-amplify/backend';
import { DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { Repository } from 'aws-cdk-lib/aws-ecr';

const backend = defineBackend({});

const latexRepo = Repository.fromRepositoryName(
  backend.getStack(),
  'latex-generator-image',
  'latex-generator'
);

const generatePDF = backend.addFunction('generatePDF', {
  code: DockerImageCode.fromEcr(latexRepo),
  memorySize: 1024,
  timeout: 60,
  name: 'generatePDF'
});

backend.addOutput({
  api: {
    prefix: '/api',
    routes: {
      '/POST/generate': {
        function: generatePDF,
      },
    },
  },
});