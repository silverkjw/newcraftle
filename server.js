const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 'public' 폴더를 정적 파일 제공 폴더로 설정
app.use(express.static(path.join(__dirname, 'public')));

app.get('/run-python', (req, res) => {

    const spawn = require('child_process').spawn;
    const result_02 = spawn('python', ['makeitemlist.py', '18']);

    result_02.stdout.on('data', (result)=>{
        console.log(result.toString());
        res.send(result);
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});