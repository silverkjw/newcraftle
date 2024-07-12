//작업예정

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('item-5').addEventListener('click', () => {
    fetch('/run-python')
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const decoder = new TextDecoder('utf-8');
      const decodedString = decoder.decode(buffer);
      const data = JSON.parse(decodedString);

      console.log(JSON.stringify(data, null, 2))
      
    })

    .catch(error => console.error('Error fetching data:', error));
  });

  document.getElementById('item-6').addEventListener('click', async () => {

    filename = "makeitemlist.py";
    params = [30];

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
          
          console.log(data)

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