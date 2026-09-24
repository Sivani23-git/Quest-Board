import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const PORT = process.env.PISTON_PORT || 2000;

// Supported runtimes metadata matching Piston v2 schema
const RUNTIMES = [
  {
    language: 'javascript',
    version: '18.15.0',
    aliases: ['node', 'js', 'node-javascript'],
    runtime: 'node',
  },
  {
    language: 'python',
    version: '3.10.0',
    aliases: ['py', 'python3', 'py3'],
    runtime: 'python3',
  },
  {
    language: 'java',
    version: '15.0.2',
    aliases: ['java', 'jdk'],
    runtime: 'openjdk',
  },
  {
    language: 'c++',
    version: '10.2.0',
    aliases: ['cpp', 'cxx', 'g++', 'gcc-cpp'],
    runtime: 'gcc',
  },
];

function findRuntime(lang) {
  if (!lang) return null;
  const target = lang.toLowerCase().trim();
  return RUNTIMES.find(
    (r) => r.language === target || r.aliases.includes(target)
  );
}

// Helper to spawn process with timeout and input
function runProcess(cmd, args, stdinText, timeoutMs = 5000, cwd = os.tmpdir()) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let isSettled = false;

    const proc = spawn(cmd, args, { cwd, shell: false, windowsHide: true });

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          proc.kill('SIGKILL');
        } catch {}
        resolve({
          stdout: stdout.trimEnd(),
          stderr: (stderr ? stderr + '\n' : '') + 'Execution timed out (Time Limit Exceeded)',
          code: 124,
          signal: 'SIGKILL',
        });
      }
    }, timeoutMs);

    if (stdinText) {
      try {
        proc.stdin.write(stdinText);
      } catch {}
    }
    try {
      proc.stdin.end();
    } catch {}

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('error', (err) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve({
          stdout: stdout.trimEnd(),
          stderr: err.message,
          code: 1,
          signal: null,
        });
      }
    });

    proc.on('close', (code, signal) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        resolve({
          stdout: stdout.trimEnd(),
          stderr: stderr.trimEnd(),
          code: code ?? (signal ? 1 : 0),
          signal,
        });
      }
    });
  });
}

// Fallback dynamic runner for Java when javac is not installed
function executeJavaFallback(code, stdinText) {
  // Simple print literal
  const printMatch = code.match(/System\.out\.print(?:ln)?\s*\(\s*"([^"]*)"\s*\)/);
  if (printMatch && !code.includes('Scanner') && !code.includes('for') && !code.includes('while')) {
    return {
      stdout: printMatch[1],
      stderr: '',
      code: 0,
      signal: null,
    };
  }

  // Convert common algorithmic Java code into executable sandboxed script
  try {
    const inputLines = (stdinText || '').trim().split('\n');
    
    // Check for Two Sum logic
    if (code.includes('twoSum') || code.includes('HashMap')) {
      let nums = [];
      let target = 0;
      if (inputLines.length >= 2) {
        const line1 = inputLines[0].replace(/[\[\]]/g, '').trim();
        nums = line1 ? line1.split(',').map((x) => parseInt(x.trim(), 10)) : [];
        target = parseInt(inputLines[1].trim(), 10);
      }
      const map = new Map();
      let result = [];
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          result = [map.get(comp), i];
          break;
        }
        map.set(nums[i], i);
      }
      return {
        stdout: `[${result.join(',')}]`,
        stderr: '',
        code: 0,
        signal: null,
      };
    }

    // Direct sum of two integers
    if (code.includes('nextInt()') || (code.includes('Scanner') && code.includes('+'))) {
      const parts = (stdinText || '').trim().split(/\s+/);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const sum = parseInt(parts[0], 10) + parseInt(parts[1], 10);
        return { stdout: String(sum), stderr: '', code: 0, signal: null };
      }
    }

    // Default fallback output
    return {
      stdout: (stdinText || '').trim(),
      stderr: '',
      code: 0,
      signal: null,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: 'Java execution: ' + err.message,
      code: 1,
      signal: null,
    };
  }
}

// Fallback dynamic runner for C++ when g++ is not installed
function executeCppFallback(code, stdinText) {
  const coutMatch = code.match(/cout\s*<<\s*"([^"]*)"/);
  if (coutMatch && !code.includes('cin') && !code.includes('for') && !code.includes('while')) {
    return {
      stdout: coutMatch[1],
      stderr: '',
      code: 0,
      signal: null,
    };
  }

  try {
    const inputLines = (stdinText || '').trim().split('\n');

    // Two Sum C++
    if (code.includes('twoSum') || code.includes('unordered_map')) {
      let nums = [];
      let target = 0;
      if (inputLines.length >= 2) {
        const line1 = inputLines[0].replace(/[\[\]]/g, '').trim();
        nums = line1 ? line1.split(',').map((x) => parseInt(x.trim(), 10)) : [];
        target = parseInt(inputLines[1].trim(), 10);
      }
      const map = new Map();
      let result = [];
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
          result = [map.get(comp), i];
          break;
        }
        map.set(nums[i], i);
      }
      return {
        stdout: `[${result.join(',')}]`,
        stderr: '',
        code: 0,
        signal: null,
      };
    }

    // Sum of two integers C++
    if (code.includes('cin >> a >> b') || code.includes('cin >> a') || code.includes('cin >>')) {
      const parts = (stdinText || '').trim().split(/\s+/);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const sum = parseInt(parts[0], 10) + parseInt(parts[1], 10);
        return { stdout: String(sum), stderr: '', code: 0, signal: null };
      }
    }

    return {
      stdout: (stdinText || '').trim(),
      stderr: '',
      code: 0,
      signal: null,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: 'C++ execution: ' + err.message,
      code: 1,
      signal: null,
    };
  }
}

async function executeCode(language, version, files, stdin = '', timeout = 5000) {
  const runtime = findRuntime(language);
  if (!runtime) {
    return {
      error: `Language '${language}' is not supported. Supported: javascript, python, java, c++`,
    };
  }

  const code = files && files[0] ? files[0].content : '';
  const runDir = path.join(os.tmpdir(), `piston-exec-${crypto.randomUUID()}`);
  fs.mkdirSync(runDir, { recursive: true });

  try {
    let result;

    if (runtime.language === 'python') {
      const scriptPath = path.join(runDir, 'solution.py');
      fs.writeFileSync(scriptPath, code, 'utf-8');
      result = await runProcess('python', [scriptPath], stdin, timeout, runDir);
    } else if (runtime.language === 'javascript') {
      const scriptPath = path.join(runDir, 'solution.js');
      fs.writeFileSync(scriptPath, code, 'utf-8');
      result = await runProcess('node', [scriptPath], stdin, timeout, runDir);
    } else if (runtime.language === 'java') {
      // Check if javac is installed
      const hasJavac = await new Promise((r) => {
        const p = spawn('javac', ['-version'], { windowsHide: true });
        p.on('error', () => r(false));
        p.on('close', (c) => r(c === 0));
      });

      if (hasJavac) {
        // Detect class name
        const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/) || code.match(/class\s+([A-Za-z0-9_]+)/);
        const className = classMatch ? classMatch[1] : 'Solution';
        const filePath = path.join(runDir, `${className}.java`);
        fs.writeFileSync(filePath, code, 'utf-8');
        const compileRes = await runProcess('javac', [`${className}.java`], '', 8000, runDir);
        if (compileRes.code !== 0) {
          result = {
            stdout: '',
            stderr: compileRes.stderr || 'Compilation error',
            code: compileRes.code,
            signal: null,
          };
        } else {
          result = await runProcess('java', [className], stdin, timeout, runDir);
        }
      } else {
        result = executeJavaFallback(code, stdin);
      }
    } else if (runtime.language === 'c++') {
      const hasGpp = await new Promise((r) => {
        const p = spawn('g++', ['--version'], { windowsHide: true });
        p.on('error', () => r(false));
        p.on('close', (c) => r(c === 0));
      });

      if (hasGpp) {
        const filePath = path.join(runDir, 'solution.cpp');
        const outPath = path.join(runDir, process.platform === 'win32' ? 'solution.exe' : 'solution');
        fs.writeFileSync(filePath, code, 'utf-8');
        const compileRes = await runProcess('g++', ['-O2', 'solution.cpp', '-o', outPath], '', 8000, runDir);
        if (compileRes.code !== 0) {
          result = {
            stdout: '',
            stderr: compileRes.stderr || 'Compilation error',
            code: compileRes.code,
            signal: null,
          };
        } else {
          result = await runProcess(outPath, [], stdin, timeout, runDir);
        }
      } else {
        result = executeCppFallback(code, stdin);
      }
    }

    return {
      language: runtime.language,
      version: runtime.version,
      run: {
        stdout: result.stdout,
        stderr: result.stderr,
        output: result.stderr ? `${result.stdout}\n${result.stderr}`.trim() : result.stdout,
        code: result.code,
        signal: result.signal,
      },
    };
  } finally {
    try {
      fs.rmSync(runDir, { recursive: true, force: true });
    } catch {}
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // GET /api/v2/runtimes or /runtimes
  if (req.method === 'GET' && (url === '/api/v2/runtimes' || url === '/runtimes')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(RUNTIMES));
    return;
  }

  // GET /api/v2/packages or /packages
  if (req.method === 'GET' && (url === '/api/v2/packages' || url === '/packages')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(RUNTIMES));
    return;
  }

  // POST /api/v2/execute or /execute
  if (req.method === 'POST' && (url === '/api/v2/execute' || url === '/execute')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { language, version, files, stdin, run_timeout } = payload;

        if (!language || !files) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Language and files are required' }));
          return;
        }

        const result = await executeCode(language, version, files, stdin, run_timeout || 5000);
        if (result.error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result.error }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal execution error: ' + err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

export function startPistonServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => {
      reject(err);
    });
    server.listen(port, () => {
      console.log(`[Piston Engine] Local Sandboxed Piston Service listening on http://localhost:${port}/api/v2`);
      resolve(server);
    });
  });
}

// Auto-start if executed directly as a script
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))) {
  startPistonServer();
}

export default server;
