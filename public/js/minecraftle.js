//작업예정

// 변화를 감지할 함수
function handleChange(target, property, value) {
  updateCraft()
}
// Proxy 핸들러 설정
const handler = {
  set(target, property, value) {
    if (!isNaN(property)) {
      debounceHandleChange(target, property, value);
    }

    // 새로운 배열이 설정되면 그 배열에도 Proxy를 적용
    if (Array.isArray(value)) {
      target[property] = new Proxy(value, handler);
    } else {
      target[property] = value;
    }

    return true;
  }
};

// 배열에 Proxy 적용 함수
function createProxyArray(arr) {
  return new Proxy(arr.map(item => (Array.isArray(item) ? createProxyArray(item) : item)), handler);
}

// 초기 배열에 Proxy 적용
let craftTable = createProxyArray([
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
]);

// 디바운스 구현
let debounceTimer;
function debounceHandleChange(target, property, value, delay = 100) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => handleChange(target, property, value), delay);
}

var handItem = "";
var result = "";
var answer = "";

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById("reset").addEventListener('click', function(event){
    if (event.button === 0) {
      parent = document.getElementById("clone")
      parent.replaceChildren()
    }
  })

  document.getElementById('erase').addEventListener('click', function (event){
    if (event.button === 0) {
      eraseTable()
    }

  }); //제작대 지우기

  document.getElementById('reset').addEventListener('click', async (event) => { //새 게임
    if (event.button === 0) {
      startNewGame()
    }
  });

  document.getElementById("result").addEventListener('click', async function(event){
    if (event.button === 0) {
      if (result == "") return

      if (result == jsonRemove(answer)) { //정답
        correctAnswer()
      }

      else { //오답
        let guessColors = await guess()
        saveRecipe(guessColors)

        eraseTable()
      }
    }

  })

  // item-1부터 item-18까지의 요소에 이벤트 핸들러 추가
  for (let i = 1; i <= 18; i++) {
    // 각 요소의 ID를 생성
    let elementId = 'item-' + i;
    
    // 요소를 선택
    let element = document.getElementById(elementId);
    
    // 요소가 존재하면 이벤트 핸들러를 추가
    if (element) {

      element.addEventListener('mousedown', function(event) {

        if (event.button === 0 || event.button === 2) {
          grabTable(i-1);
        }

      });
    }
  }

  // cell-1부터 cell-9까지의 요소에 이벤트 핸들러 추가
  for (let i = 1; i <= 9; i++) {
    // 각 요소의 ID를 생성
    let elementId = 'cell-' + i;
    
    // 요소를 선택
    let element = document.getElementById(elementId);
    
    // 요소가 존재하면 이벤트 핸들러를 추가
    if (element) {
      element.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
          handleMouseDown(i-1);
        }

        if (event.button === 2) {
          putDown(i-1);
        }

      });

      element.addEventListener('mouseup', function(event) {
        if (event.button === 0) {

          if (lastClickedCell == i-1)
            clickCell(i-1);

          else {
            handItem = "";
            changeImageSrc()
          }

          lastClickedCell = null

        }

      });
    }

  }

  document.addEventListener('dragstart', function(event) { //드래그 원활하게 하기 위함
    event.preventDefault();
  });
  document.addEventListener('contextmenu', function(event) { //우클릭 방지
    event.preventDefault(); 
  });
  
  main()

});

function correctAnswer() { //정답 맞출시 작동

  console.log("정답")
  for (let i = 1; i <= 9; i++) {
    document.getElementById('cell-' + i).style.backgroundColor = 'green';
  }

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (craftTable[i][j] !== "") {// 아이템이 있다면
        let block = document.getElementById(`item-${itemList.indexOf(craftTable[i][j])+1}`)
        block.style.backgroundColor = 'green' //초록으로
      }
    }
  }
  
  

  return
}

function eraseTable() { //제작대, 아이템 지우기

  craftTable = createProxyArray([
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
]);

  craftTable[0][0] = "" //요소 변경으로 result 자동 업데이트

  update();

  handItem = "";
  changeImageSrc();
  
  return
}

function grabTable(number) {
  if (handItem == itemList[number]) handItem = ""

  else handItem = itemList[number]
  changeImageSrc()
}
 
function clickCell(number) { //cell 위에서 마우스를 뗄 시, 아이템 사용을 끝냈다고 본다-

  if (handItem != "") { //손에 아이템이 있을 시
    if (lastDownTime && number == lastCell) {
        const currentTime = new Date();
        const timeDiff = currentTime - lastDownTime;

        if (timeDiff < 250) return //250ms 미만의 짧은 입력일시 그냥 들고 있기
    }

    craftTable[Math.floor(number/3)][number%3] = handItem
    update()

    handItem = ""
    changeImageSrc()
  }

  else if (craftTable[Math.floor(number/3)][number%3] != "") { //손에 아이템이 없고 제작대에는 있을 시
    handItem = craftTable[Math.floor(number/3)][number%3]
    craftTable[Math.floor(number/3)][number%3] = ""
    update()
    changeImageSrc()
  }
}

function putDown(number) {

  if (handItem !== "" && craftTable[Math.floor(number/3)][number%3] === "") {
    craftTable[Math.floor(number/3)][number%3] = handItem
    update()
  }
  else if (handItem === "" && craftTable[Math.floor(number/3)][number%3] !== "") {
    handItem = craftTable[Math.floor(number/3)][number%3]
    changeImageSrc()
  }

  if (handItem != "") { //손에 든게 있다면
    isDragging = true;
  }

  // cell-1부터 cell-9까지의 요소에 이벤트 핸들러 추가
  for (let i = 1; i <= 9; i++) {
    let elementId = 'cell-' + i;
    
    let element = document.getElementById(elementId);
    
    if (element) {
      element.addEventListener('mousemove', function() {
        handleMouseMove(i-1);
      });
    }
    
  }
    document.addEventListener('mouseup', handleMouseUp);

}

let isDragging = false;
let lastClickedCell = null

let lastDownTime = null;
let lastCell = null;

function handleMouseDown(number) {

  lastClickedCell = number
  
  if (handItem != "") { //손에 든게 있다면
    isDragging = true;
  
    // cell-1부터 cell-9까지의 요소에 이벤트 핸들러 추가
  for (let i = 1; i <= 9; i++) {
    let elementId = 'cell-' + i;
    
    let element = document.getElementById(elementId);
    
    if (element) {
      element.addEventListener('mousemove', function() {
        handleMouseMove(i-1);
      });
    }
    
  }
    document.addEventListener('mouseup', handleMouseUp);
  }

  else if (craftTable[Math.floor(number/3)][number%3] != "") { //손에 아이템이 없고 제작대에는 있다면
    //아이템 들기
    handItem = craftTable[Math.floor(number/3)][number%3]
    craftTable[Math.floor(number/3)][number%3] = ""
    update()
    changeImageSrc()

    lastCell = number 
    lastDownTime = new Date(); //시간측정 시작
  }

}

function handleMouseMove(number) {
    if (isDragging) dragCell(number)
}

function handleMouseUp(event) {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function dragCell(number) {


    if (handItem != "" && craftTable[Math.floor(number/3)][number%3] == "") { //손에 아이템이 있고 빈칸을 드래그 중에 지나가면
      craftTable[Math.floor(number/3)][number%3] = handItem
      update()
    }
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  updatePosition();
});

document.addEventListener('scroll', function() {
  updatePosition();
});

function updatePosition() {
  const followImg = document.getElementById('follow-img');
  followImg.style.left = `${mouseX+window.scrollX}px`;
  followImg.style.top = `${mouseY+window.scrollY}px`;
}

function showImage() {
  const followImg = document.getElementById('follow-img');
  followImg.style.display = 'block';
}

function hideImage() {
  const followImg = document.getElementById('follow-img');
  followImg.style.display = 'none';
}

function changeImageSrc() { //handItem을 통해 커서 이미지 변경
  const followImg = document.getElementById('follow-img');
  if (handItem == "") hideImage(); //없어요

  else {
    followImg.src = makesrc(handItem)
    showImage()
  };
}

async function startNewGame() {
  answer = await generateAnswer();
  console.log(answer);

  const filename = "makeitemlist.py";
  const params = [18, answer];

  try {
      const response = await fetch('http://localhost:3000/run-python', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ filename, params })
      });

      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(buffer);
      const data = JSON.parse(decodedString);

      itemList = JSON.parse(data);

      console.log(itemList);

      for (let i = 1; i <= 9; i++) {
        document.getElementById('cell-' + i).style.backgroundColor = '';
      }
    
      for (let i = 1; i <= 18; i++) {
        document.getElementById('item-' + i).style.backgroundColor = '';
      }
     
      eraseTable()
    
      for (let i = 0; i < itemList.length; i++) {
        //console.log(itemList[i]);
        
        image = document.getElementById(`item-${i+1}`)
    
        image.style.backgroundImage = `url(${makesrc(itemList[i])})`
    
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

function main(){
  
  changeImageSrc()

}

function jsonRemove(input) {
  // .json 확장자 제거
  let result = input.replace('.json', '');

  // 'from'이 포함된 경우 'from' 이후의 모든 내용을 제거

  const fromIndex = result.indexOf('_from');
  if (fromIndex !== -1) {
    result = result.substring(0, fromIndex);
  } 

  result = result.replace(/"/g, '')
  result = result.replace("\n","")

  return result;
}

function makesrc(item){
  const firstChar = item[0];

  if (firstChar >= 'a' && firstChar <= 'g') {
    imagePath = "./itemimage_a-g/";
  }
  
  else if (firstChar >= 'h' && firstChar <= 'z') {
    imagePath = "./itemimage_h-z/";
  }
  
  else {
    console.error();
  }
  
  return `${imagePath}${item}.png`
}

function updateCraft() {

  //console.log("업데이트됨")

  //서버에 craft.py 요청 보내기 

  var resultHtml = document.getElementById(`result`)

  filename = "craft.py";
  params = [JSON.stringify(craftTable)];

  fetch('http://localhost:3000/run-python', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filename, params })

  })
  .then(response => response.arrayBuffer())
      .then(buffer => {
        const decoder = new TextDecoder('utf-8');
        const decodedString = decoder.decode(buffer);
        var data = JSON.parse(decodedString);

        //data = data.replace(/[\r\n]/g, '');

        //console.log("crafted : "+data);
        //console.log(craftTable,"updated",data)
        
        if (data != "False") { //있는 제작법이라면
          
          result = jsonRemove(data)

          resultHtml.style.backgroundImage = `url(${makesrc(result)})`
          //resultHtml.innerText = `url(${makesrc(result)})`
        }

        else {
          result = ""
          resultHtml.style.backgroundImage = `url("")`
        }

      })
      .catch(error => console.error('Error fetching data:', error));
}

function update(){

  var number = 0;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {

      number++;

      cell = document.getElementById(`cell-${number}`)

      if (craftTable[i][j]==""){
        cell.style.backgroundImage = 'url("")'
        continue
      }

      cell.style.backgroundImage = `url(${makesrc(craftTable[i][j])})`
      
    }
  }

  //craftUpdate()
}

async function generateAnswer() {
  // 서버에 generateAnswer.py 요청 보내기
  const filename = "generateAnswer.py";
  const params = [];

  try {
    const response = await fetch('http://localhost:3000/run-python', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename, params })
    });
    
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const decodedString = decoder.decode(buffer);
    let data = JSON.parse(decodedString);
    
    data = data.replace(/[\r\n]/g, '');

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // 에러를 호출자에게 전달
  }
}

async function guess(){
  
    //서버에 guess.py 요청 보내기
    const filename = "guess.py";
    const params = [JSON.stringify(craftTable), answer];
  
    try {
      const response = await fetch('http://localhost:3000/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename, params })
      });
      
      const buffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(buffer);
      var data = JSON.parse(decodedString);
      
      var newdata = JSON.parse(data)
      //data = data.replace(/[\r\n]/g, '');
  
      return newdata;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // 에러를 호출자에게 전달
    }

}

function saveRecipe(guess){

  reicpe = document.getElementById("recipe")

  clone = reicpe.cloneNode(true) //깊은복사


  cloneCells = clone.children

  var number = 0

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {

      number++
      cloneCells[number-1].style.backgroundColor = guess[i][j]
      
      if (craftTable[i][j] !== "") {

        if (guess[i][j] == "green"){
          let block = document.getElementById(`item-${itemList.indexOf(craftTable[i][j])+1}`)
          block.style.backgroundColor = 'green'
        }

        else if(guess[i][j] == "yellow"){
          let block = document.getElementById(`item-${itemList.indexOf(craftTable[i][j])+1}`)
          if (block.style.backgroundColor !== 'green')
            block.style.backgroundColor = 'yellow'
        }

        else if(guess[i][j] == "gray"){
          let block = document.getElementById(`item-${itemList.indexOf(craftTable[i][j])+1}`)

          if (block.style.backgroundColor == '')
            block.style.backgroundColor = 'gray'
        }

      }

      
    }
  }
  
  cloneContainer = document.getElementById("clone") 




  cloneContainer.appendChild(clone) //컨테이너에 추가


}