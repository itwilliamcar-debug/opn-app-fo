import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: fs.createReadStream('C:\\Users\\INSPIRON\\.gemini\\antigravity-ide\\brain\\cfb960ed-fe56-4486-bb57-f1344e7d6c58\\.system_generated\\logs\\transcript_full.jsonl'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('"step_index":1499') || line.includes('"step_index":1500') || line.includes('"step_index":1501') || line.includes('"step_index":1629') || line.includes('"step_index":1630') || line.includes('"step_index":1631')) {
    try {
      const obj = JSON.parse(line);
      console.log('====================================');
      console.log('STEP', obj.step_index, 'TYPE:', obj.type, 'SOURCE:', obj.source);
      if (obj.content) console.log('CONTENT:\n', obj.content.slice(0, 1500));
      if (obj.tool_calls) {
        console.log('TOOL CALLS:', JSON.stringify(obj.tool_calls).slice(0, 1500));
      }
    } catch(e) {}
  }
});
