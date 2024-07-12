//작업예정

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('item-5').addEventListener('click', () => {
    fetch('/run-python')
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(buffer);
      const data = JSON.parse(decodedString);

      itemList = JSON.parse(JSON.stringify(data, null, 2))
      console.log(itemList)

      main()
    })

    .catch(error => console.error('Error fetching data:', error));
  });

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

item1 = document.getElementById("item-1")

item1.style.backgroundImage = "url('../itemimage_a-g/acacia_planks.png')"

body = document.querySelector(".body")

const img = new Image(); 

document.body.appendChild(img);
img.src = './itemimage_a-g/acacia_log.png'
img.width = '50'
img.style = "position:absolute; left:0px; top:0px;"


function main(){

  for (let i = 0; i < itemList.length; i++) {
    console.log(itemList[i]);

    const firstChar = itemList[i][0].toLowerCase();

    if (firstChar >= 'a' && firstChar <= 'g') {
      imagePath = "./itemimage_a-g/";
    }
    
    else if (firstChar >= 'h' && firstChar <= 'z') {
      imagePath = "./itemimage_h-z/";
    }
    
    else {
      console.error(); 
      continue;
    }

    //console.log(document.getElementById(`item-${i+1}`))
    //console.log(`${imagePath}${itemList[i]}.png`)
    
    image = document.getElementById(`item-${i+1}`)

    image.style.backgroundImage = `url(${imagePath}${itemList[i]}.png)`

  }
}

// DOM 요소들을 가져오기
const blocks = document.querySelectorAll('.blocks div');
const craftCells = document.querySelectorAll('.craftTable div');

// 각각의 블럭에 클릭 이벤트 추가
blocks.forEach(block => {
    block.addEventListener('click', function() {
        // 클릭한 블럭의 HTML 요소를 가져옴
        const selectedItem = this;

        // 마우스를 따라다니도록 스타일 변경
        selectedItem.style.position = 'fixed'; // 위치를 고정
        selectedItem.style.top = (event.clientY - 15) + 'px'; // 마우스 Y 위치에 맞춰 위쪽으로 15px 정도 이동
        selectedItem.style.left = (event.clientX - 15) + 'px'; // 마우스 X 위치에 맞춰 왼쪽으로 15px 정도 이동

        // 클릭한 블럭을 움직이는 이벤트
        function moveBlock(event) {
            selectedItem.style.top = (event.clientY - 15) + 'px'; // 마우스 Y 위치에 따라 위쪽으로 움직임
            selectedItem.style.left = (event.clientX - 15) + 'px'; // 마우스 X 위치에 따라 왼쪽으로 움직임
        }

        // 마우스 이동 시 블럭이 따라다니도록 이벤트 리스너 추가
        document.addEventListener('mousemove', moveBlock);

        // 마우스 버튼을 놓았을 때 이벤트
        document.addEventListener('mouseup', function() {
            // 마우스 버튼을 놓으면 이동 이벤트 리스너 제거
            document.removeEventListener('mousemove', moveBlock);

            // 위치를 고정 해제하여 초기 위치로 되돌림
            selectedItem.style.position = 'static';
        });
    });
});

