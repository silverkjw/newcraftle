//작업예정

var craftTable = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

var handItem = "";
var result = "";

document.addEventListener('DOMContentLoaded', () => {

  main();

  document.getElementById('erase').addEventListener('click', function (){
    craftTable = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    update()
  }); //제작대 지우기

  document.getElementById('reset').addEventListener('click', async () => { //새 게임

    filename = "makeitemlist.py";
    params = [18];

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
          const data = JSON.parse(decodedString);
          
          itemList = JSON.parse(data)

          console.log(itemList)

          reset()
        })
        .catch(error => console.error('Error fetching data:', error));
  });

  // item-1부터 item-18까지의 요소에 이벤트 핸들러 추가
  for (let i = 1; i <= 18; i++) {
    // 각 요소의 ID를 생성
    let elementId = 'item-' + i;
    
    // 요소를 선택
    let element = document.getElementById(elementId);
    
    // 요소가 존재하면 이벤트 핸들러를 추가
    if (element) {
        element.addEventListener('click', function() {
            grabTable(i-1);
        });

        element.addEventListener('mousedown', function() {
          grabTable(i-1);
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
      element.addEventListener('mousedown', function() {
        handleMouseDown(i-1);
      });
      element.addEventListener('mouseup', function() {
        clickCell(i-1);
      });
    }
    
  }

  document.addEventListener('dragstart', function(event) { //드래그 원활하게 하기 위함
      event.preventDefault();
  });
});

function grabTable(number) {
  handItem = itemList[number]
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

let isDragging = false;

let lastDownTime = null;
let lastCell = null;

function handleMouseDown(number) {
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


    console.log(number+"드래그 중")

    if (handItem != "" && craftTable[Math.floor(number/3)][number%3] == "") { //손에 아이템이 있고 빈칸을 드래그 중에 지나가면
      craftTable[Math.floor(number/3)][number%3] = handItem
      update()
    }
}


document.addEventListener('mousemove', function(event) {
  const followImg = document.getElementById('follow-img');
  followImg.style.left = `${event.clientX}px`;
  followImg.style.top = `${event.clientY}px`;
});

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


function reset(){
  handItem = ""

  craftTable = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  

  changeImageSrc()
  update()

  for (let i = 0; i < itemList.length; i++) {
    console.log(itemList[i]);
    
    image = document.getElementById(`item-${i+1}`)

    image.style.backgroundImage = `url(${makesrc(itemList[i])})`

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

function update(){

  var number = 0;
  var resultHtml = document.getElementById(`result`)

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

  //서버에 craft.py 요청 보내기

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

        console.log("crafted : "+data);
        
        if (data != "False") { //있는 제작법이라면
          
          
          result = jsonRemove(data)

          console.log(typeof(data),"type")

          resultHtml.style.backgroundImage = `url(${makesrc(result)})`
          //resultHtml.innerText = `url(${makesrc(result)})`

          console.log(`url(${makesrc(result)})`)
        }

        else {
          result = ""

          resultHtml.style.backgroundImage = `url("")`

        }

      })
      .catch(error => console.error('Error fetching data:', error));

}