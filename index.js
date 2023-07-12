document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
          openHistory: false,
          pepperoniPizza:0,
          username: 'Kopano',
          userHistory: '',
          pizzaTypes: [],
          featuredpizzas: [],
          cartId: '',
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
                  this.getUserHistory()
                  return this.createCart();
                })
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

              if (!this.username) {
                // this.cartId = "Enter Username to create a cart";
      
                return;
              }
      
              const cartId = localStorage['cartId'];
      
              if (cartId) {
                this.cartId = cartId;
              }
              else {
                return axios
                  .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
                  .then((result) => {
                    this.cartId = result.data.cart_code;
                    console.log(this.cartId)
                    localStorage['cartId'] = this.cartId;
                  });
              }
            },
            
            // get user's cart history
            getUserHistory(){
              axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/username/${this.username}`)
              .then((result)=>{
                this.userHistory = result.data;
                console.log(result.data)
              })
            },

            showCartContent() {
              const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
      
              axios
                .get(url)
                .then((result) => {
                  this.cart = result.data;
                });
            },
           
      
            buyPizza(pizza) {
              axios
                .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                  cart_code: this.cartId,
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
                  cart_code: this.cartId,
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
                  cart_code: this.cartId,
              })
              .then(() => {
              if (this.Amount >= this.cart.total) {
                  this.checkOutMessage = 'Enjoy your pizza';
                  this.change = this.Amount - this.cart.total;
                  setTimeout(() => {
                  this.cart.total = 0;
                  this.cart_count=0;
                  this.checkOutMessage = '';
                  this.cartId = '';
                  localStorage['cartId'] = '';
                  
                  window.location.reload();

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