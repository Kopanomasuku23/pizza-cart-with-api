document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            pepperoniPizza:0,
            username: '',
            pizzaTypes: [],
            featuredpizzas: [],
            cart_id: '',
            cart: { total: 0 },
            checkOutMessage: '',
            makePayment: false,
            Amount: 0,
            counter: 0,
            

            init() {
                axios
                  .get('https://pizza-api.projectcodex.net/api/pizzas')
                  .then((result) => {
                    this.pizzaTypes = result.data.pizzas
                  })
                  .then(() => {
                    
                    return this.createCart();
                  })
                  .then((result) => {
                    this.cart_id = result.data.cart_code;
                  });
              },
        
            featuredPizzas() {
                return axios
                  .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
              },
              
              postfeaturedPizzas() {
                return axios
                  .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
              },
        
              createCart() {
                return axios
                  .get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username=' + this.username)
              },
        
              showCartContent() {
                const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cart_id}/get`;
        
                axios
                  .get(url)
                  .then((result) => {
                    this.cart = result.data;
                  });
              },
             
        
              buyPizza(pizza) {
                axios
                  .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    cart_code: this.cart_id,
                    pizza_id: pizza.id
                  })
                  .then(() => {
                    this.counter++
                    this.message = "Pizza added to the cart"
                    this.showCartContent();
                  })
                  .then(() => {
        
                    return this.featuredPizzas();
        
                  })
                  .then(() => {
                    return this.postfeaturedPizzas();
                  })
                  
              },
        
              
              removePizza(pizza) {
    
                axios
                  .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove',  {
                    cart_code: this.cart_id,
                    pizza_id: pizza.id
                  })
                  .then(() => {
                    this.counter--;
                    this.message = "Pizza removed from the cart"
                    this.showCartContent();
                  })
                  
        
              },
              payment(pizza) {

            axios
                .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    cart_code: this.cart_id,
                })
                .then(() => {
                if (this.Amount >= this.cart.total) {
                    this.checkOutMessage = 'Enjoy your pizza';
                    this.change = this.Amount - this.cart.total;
                    setTimeout(() => {
                    this.cart.total = 0;
                    this.cart_count=0;
                    this.checkOutMessage = '';
                    }, 5000);
    
                } else if (this.Amount < this.cart.total) {
                    this.checkOutMessage = 'Sorry, That is not enough money!'
                    setTimeout(() => {
                        this.checkOutMessage = ''
                    }, 5000);
                }
  
            })
  
        }


        }
    })
})