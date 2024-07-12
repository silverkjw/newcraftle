const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const { spawn } = require('child_process');

// 'public' 폴더를 정적 파일 제공 폴더로 설정
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/run-python', (req, res) => {

  const { filename, params } = req.body;
  

  if (!filename) {
    return res.status(400).send('Filename is required');
  }

  // 파이썬 스크립트를 실행

  console.log(filename)
  console.log(params)

  const pythonProcess = spawn('python', [filename, ...params]);

  let scriptOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    scriptOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {

      const bufferData = Buffer.from(JSON.stringify(scriptOutput));
      res.send(bufferData);
      
    } else {
      res.status(500).send(`Python script exited with code ${code}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});