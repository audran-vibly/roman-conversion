#!/usr/bin/env node

/**
 * Test Runner Script for Roman Numeral Converter
 * 
 * This script provides different ways to run the test suite
 * and generates reports for the project evaluation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Roman Numeral Converter - Test Runner');
console.log('==========================================\n');

// Function to run command and display output
function runCommand(command, description) {
  console.log(`📋 ${description}`);
  console.log(`💻 Running: ${command}\n`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Success!\n');
    return true;
  } catch (error) {
    console.log('❌ Failed!\n');
    return false;
  }
}

// Main test execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  switch (command) {
    case 'all':
      console.log('🚀 Running Complete Test Suite\n');
      runCommand('npm run test:run', 'Running all tests');
      break;
      
    case 'coverage':
      console.log('📊 Running Tests with Coverage Report\n');
      runCommand('npm run test:coverage', 'Generating coverage report');
      break;
      
    case 'watch':
      console.log('👀 Running Tests in Watch Mode\n');
      runCommand('npm run test', 'Starting watch mode');
      break;
      
    case 'ui':
      console.log('🖥️  Opening Test UI\n');
      runCommand('npm run test:ui', 'Opening test UI');
      break;
      
    case 'unit':
      console.log('🔧 Running Unit Tests Only\n');
      runCommand('npm run test:run -- src/utils/__tests__/', 'Running unit tests');
      break;
      
    case 'components':
      console.log('🧩 Running Component Tests Only\n');
      runCommand('npm run test:run -- src/components/__tests__/', 'Running component tests');
      break;
      
    case 'integration':
      console.log('🔗 Running Integration Tests Only\n');
      runCommand('npm run test:run -- src/__tests__/integration.test.tsx', 'Running integration tests');
      break;
      
    case 'performance':
      console.log('⚡ Running Performance Tests Only\n');
      runCommand('npm run test:run -- src/utils/__tests__/performance.test.ts', 'Running performance tests');
      break;
      
    case 'help':
    default:
      console.log('📖 Available Commands:\n');
      console.log('  all          - Run complete test suite');
      console.log('  coverage     - Run tests with coverage report');
      console.log('  watch        - Run tests in watch mode');
      console.log('  ui           - Open test UI');
      console.log('  unit         - Run unit tests only');
      console.log('  components   - Run component tests only');
      console.log('  integration  - Run integration tests only');
      console.log('  performance  - Run performance tests only');
      console.log('  help         - Show this help message\n');
      console.log('Usage: node scripts/run-tests.js [command]\n');
      break;
  }
}

main();
