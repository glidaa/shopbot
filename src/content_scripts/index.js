import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

console.log('Content scripts has loaded');

Amplify.configure(awsconfig);
console.log('AWS CONFIG',Amplify.configure(awsconfig));
