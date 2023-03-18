let content_area = document.querySelector("#main_content");
let cartBtn = document.querySelector('.cart-btn');
let cartWrapper = document.querySelector('.cart-wrapper');
cartBtn.addEventListener("click", () => cartWrapper.classList.toggle("cart-on"));

fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
        console.log(data[0])
        for (i = 0; i < data.length; i++) {
            content_area.innerHTML += `<div class="col-md-3">
            <div class="box">
                <span class="discount">${data[i].discount}</span>
                <div class="image">
                    <img src= ${data[i].img_url} alt="">
                    <div class="icons">
                        <a href="#" class="fas fa-heart"></a>
                        <a href="#" class="cart-btn">add to cart</a>
                        <a href="#" class="fas fa-share"></a>
                    </div>
                </div>

                <div class="content">
                    <h3>${data[i].name}</h3>
                    <div class="price">${data[i].price_after_discount}<span>${data[i].price}</span>
                    </div>
                </div>
            </div>  
        </div>`
        }
    });



function addToCart(el) {
    let product = {
        "id": el.getAttribute("id"),
        "name": el.getAttribute("name"),
        "price": el.getAttribute("price_after_discount")
    }
    let cart = [];
    if (localStorage.getItem("cart").length > 0) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    let count = product.count;
    let existingItem = false;
    cart.forEach((item) => {
        if (item.id == product.id) {
            item.count += product.count;
            count = item.count;
            existingItem = true;
        }
    })
    if (!existingItem) {
        cart.push(product);
    }
    // update card on page
    updateCart(cart);
    // send cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// cập nhật giỏ hàng sau khi thêm sản phẩm
function updateCart(cart) {
    let cartBtn = document.querySelector('.cart-btn .badge');
    cartBtn.innerText = cart.length;
    if (cart.length > 0) {
        cart.forEach((item) => {
            let itemBadge = document.querySelector(`.product-${item.id} .badge`);
            let itemAlert = document.querySelector(`.product-${item.id} .bought`);
            itemAlert.style.display = "block";
            itemBadge.innerText = item.count;
        })
    }
    let tbody = document.querySelector('tbody');
    let tfooter = document.querySelector('tfoot .total');
    let output = '';
    let total = 0;
    cart.forEach((item, i) => {
        total += (item.price * item.count);
        output += `<tr class="cart-item">
            <th scope="row">${i + 1}</th>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.count} <button onclick="removeCart(event)" class="remove"><i class="fa fa-trash"></i></button></td>
          </tr>`;
    })
    tbody.innerHTML = output;
    tfooter.innerText = total.toLocaleString();
} 