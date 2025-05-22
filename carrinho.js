document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cartItems");
    let totalPrice = 0;

    // Agrupar itens iguais
    let groupedCart = {};
    cart.forEach(item => {
        let key = item.name + "|" + item.price;
        if (!groupedCart[key]) {
            groupedCart[key] = { ...item, quantity: 1 };
        } else {
            groupedCart[key].quantity++;
        }
    });

    let groupedItems = Object.values(groupedCart);

    if (groupedItems.length === 0) {
        cartContainer.innerHTML = "<p>🛒 O carrinho está vazio.</p>";
    } else {
        cartContainer.innerHTML = "";
        groupedItems.forEach((item, index) => {
            let listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";

            listItem.innerHTML = `
                <span>${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger remove-btn" data-name="${item.name}" data-price="${item.price}">❌</button>
            `;

            cartContainer.appendChild(listItem);
            totalPrice += item.price * item.quantity;
        });
        document.getElementById("total-price").textContent = totalPrice.toFixed(2);
    }

    // Limpar o carrinho
    document.getElementById("clear-cart").addEventListener("click", function () {
        localStorage.removeItem("cart");
        location.reload();
    });

    // Remover item individual (1 unidade de cada vez)
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const name = e.target.getAttribute("data-name");
            const price = e.target.getAttribute("data-price");

            const index = cart.findIndex(item => item.name === name && item.price == price);
            if (index > -1) {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
        });
    });

    // Finalizar compra
    const checkoutBtn = document.getElementById("checkoutBtn");
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            let emptyModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
            emptyModal.show();
            return;
        }

        let confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmModal.show();

        // Limpa o carrinho após um pequeno tempo para o usuário ver o modal
        setTimeout(() => {
            localStorage.removeItem("cart");
            location.reload();
        }, 2000);
    });
});
