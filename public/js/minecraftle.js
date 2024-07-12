//작업예정

var craftTable = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"]
];

document.addEventListener('DOMContentLoaded', () => {

  main()

  document.getElementById('item-5').addEventListener('click', () => {
    fetch('/run-python')
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(buffer);
      const data = JSON.parse(decodedString);

      itemList = JSON.parse(JSON.stringify(data, null, 2))
      console.log(itemList)

      reset()

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

          reset()
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

function changeImageSrc(newSrc) {
  const followImg = document.getElementById('follow-img');
  followImg.src = newSrc;
}


function reset(){

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

function main() {

  changeImageSrc("./itemimage_a-g/acacia_planks.png")
  showImage()
  hideImage()
  showImage()

  return 0; //장식

}

