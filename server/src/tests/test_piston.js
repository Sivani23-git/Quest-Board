import axios from 'axios';
import { startPistonServer } from '../piston-service/index.js';

async function testPiston() {
  console.log('--- Starting Piston Test ---');
  try {
    await startPistonServer(2000);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log('Port 2000 already running, testing existing instance...');
    } else {
      throw err;
    }
  }

  // 1. Test Runtimes
  const runtimesRes = await axios.get('http://localhost:2000/api/v2/runtimes');
  console.log('Available Runtimes:', runtimesRes.data.map((r) => r.language).join(', '));

  // 2. Test Python Two Sum Correct
  const pyCorrect = `import sys
import json

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    input_data = sys.stdin.read().splitlines()
    nums = json.loads(input_data[0])
    target = int(input_data[1])
    result = two_sum(nums, target)
    print(json.dumps(result))
`;

  const pyRes1 = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'python',
    version: '3.10.0',
    files: [{ content: pyCorrect }],
    stdin: '[2,7,11,15]\n9',
  });
  console.log('Python Two Sum Case 1 Output:', pyRes1.data.run.stdout.trim());

  const pyRes2 = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'python',
    version: '3.10.0',
    files: [{ content: pyCorrect }],
    stdin: '[3,2,4]\n6',
  });
  console.log('Python Two Sum Case 2 Output:', pyRes2.data.run.stdout.trim());

  // 3. Test Python Incorrect Solution
  const pyIncorrect = `print("[999,999]")`;
  const pyRes3 = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'python',
    version: '3.10.0',
    files: [{ content: pyIncorrect }],
    stdin: '[2,7,11,15]\n9',
  });
  console.log('Python Incorrect Output:', pyRes3.data.run.stdout.trim());

  // 4. Test JavaScript Hello World
  const jsRes = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'javascript',
    version: '18.15.0',
    files: [{ content: 'console.log("Hello from JavaScript!");' }],
  });
  console.log('JavaScript Output:', jsRes.data.run.stdout.trim());

  // 5. Test Java Hello World
  const javaRes = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'java',
    version: '15.0.2',
    files: [{ content: 'public class Main { public static void main(String[] args) { System.out.println("Hello from Java!"); } }' }],
  });
  console.log('Java Output:', javaRes.data.run.stdout.trim());

  // 6. Test C++ Hello World
  const cppRes = await axios.post('http://localhost:2000/api/v2/execute', {
    language: 'c++',
    version: '10.2.0',
    files: [{ content: '#include <iostream>\nusing namespace std;\nint main() { cout << "Hello from C++!" << endl; return 0; }' }],
  });
  console.log('C++ Output:', cppRes.data.run.stdout.trim());

  console.log('--- All Piston Tests Completed Successfully ---');
  process.exit(0);
}

testPiston().catch((err) => {
  console.error('Piston test failed:', err);
  process.exit(1);
});
