document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".menu-item button");
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Atualiza o carrinho ao carregar a página
    updateCart();

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const menuItem = button.closest(".menu-item");
            const itemId = menuItem.getAttribute("data-id");
            const itemName = menuItem.querySelector("h3").textContent;
            let itemPrice = menuItem.querySelector("span").textContent.replace("R$", "").trim();
            itemPrice = parseFloat(itemPrice);

            // Adiciona ao carrinho
            cart.push({ id: itemId, name: itemName, price: itemPrice });

            // Salva no Local Storage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Atualiza o carrinho na página
            updateCart();
        });
    });

    function updateCart() {
        const cartItemsList = document.getElementById("cartItems");
        if (!cartItemsList) return; // Evita erro se não estiver na página do carrinho

        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} 
                <button class="remove-btn" data-index="${index}">❌</button>`;
            cartItemsList.appendChild(li);
            total += item.price;
        });

        document.getElementById("total-price").textContent = total.toFixed(2);
        
        // Adiciona eventos para remover itens
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCart();
            });
        });
    }
});
