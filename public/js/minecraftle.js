//작업예정

var craftTable = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

var handItem = "";

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

          main()
        })
        .catch(error => console.error('Error fetching data:', error));
  });

});

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

function changeImageSrc(newSrc) { //handItem을 통해 커서 이미지 변경
  const followImg = document.getElementById('follow-img');
  if (handItem == "") hideImage(); //없어요

  else {
    followImg.src = newSrc //임시, handItem의 src로 수정 예정
    showImage()
  };
}


function reset(){

  for (let i = 0; i < itemList.length; i++) {
    console.log(itemList[i]);

    makesrc(itemList[i])

    //console.log(document.getElementById(`item-${i+1}`))
    //console.log(`${imagePath}${itemList[i]}.png`)
    
    image = document.getElementById(`item-${i+1}`)

    image.style.backgroundImage = `url(${makesrc(itemList[i])})`

  }
}

function makesrc(item){
  const firstChar = itemList[i][0].toLowerCase();

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
      cell.style.backgroundImage = `url(${makesrc(craftTable[i][j])})`
      number++;
    }
  }

  for (let i = 0; i < 9; i++){
    
    
  }
  
}