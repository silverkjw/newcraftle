//작업예정

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('item-5').addEventListener('click', () => {
    fetch('/run-python?param=test')
      .then(response => response.text())
      .then(data => {
        console.log("데이터 획득")
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
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