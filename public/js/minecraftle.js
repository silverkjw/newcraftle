//작업예정

var craftTable = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

var handItem = "zombie_head";

document.addEventListener('DOMContentLoaded', () => {

  main();

  document.getElementById('reset').addEventListener('click', async () => {

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
          grabTable(i);
      });
  }
}

});

  function grabTable(parameter) {
    handItem = itemList[parameter-1]
    changeImageSrc()
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
  changeImageSrc()
  for (let i = 0; i < itemList.length; i++) {
    console.log(itemList[i]);
    
    image = document.getElementById(`item-${i+1}`)

    image.style.backgroundImage = `url(${makesrc(itemList[i])})`

  }
}

function main(){
  changeImageSrc()
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

function update(craftTable){

  var number = 1;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {

      cell = document.getElementById(`cell-${number}`)

      if (craftTable[i][j]==""){
        cell.style.backgroundImage = 'url("")'
        continue
      }

      cell.style.backgroundImage = `url(${makesrc(craftTable[i][j])})`
      number++;
    }
  }
}