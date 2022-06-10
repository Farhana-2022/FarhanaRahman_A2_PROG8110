const Order = require("./assignment1Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    SECOND_ITEM: Symbol("second-item"),
    SECOND_ITEM_SIZE: Symbol("second_item_size"),
    SECOND_ITEM_TOPPINGS: Symbol("second_item_toppings"),
    DRINKS:  Symbol("drinks"),
    DESSERT: Symbol("dessert"),
    PAYMENT: Symbol("payment")
});

module.exports = class FoodOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sItem = "Shawarama";
        this.sSecond_item_size="";
        this.sSecond_item_toppings="";
        this.sItem_second ="Poutine";
        this.sDrinks = "";
        this.sDessert = "";
        this.sTotal_cost = 0;
        this.sTax = 0.13;
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Welcome to Farhana's Shawarma Kitchen!");
                aReturn.push("What size of shawarma would you like: large / medium / small?");
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.TOPPINGS;
                this.sSize = sInput;
                if(this.sSize=="large"){
                    this.sTotal_cost=this.sTotal_cost +15;
                }
                else if(this.sSize=="medium"){
                    this.sTotal_cost=this.sTotal_cost +11;
                }
                else if (this.sSize=="small"){
                    this.sTotal_cost=this.sTotal_cost +8;
                }
                else{
                    aReturn.push("What size of shawarma would you like: large / medium / small?");  
                    this.stateCur = OrderState.SIZE;
                    break;
                }
                aReturn.push("What toppings would you like?");
                console.log(this.sTotal_cost);
                break;
            case OrderState.TOPPINGS:
                this.stateCur = OrderState.SECOND_ITEM;
                this.sToppings = sInput;
                aReturn.push(`Would you like to try ${this.sItem_second} as a second item?`);
                break;  
            case OrderState.SECOND_ITEM:
              this.stateCur = OrderState.SECOND_ITEM_SIZE;
              if(sInput.toLowerCase() == "yes"){
                aReturn.push(`What size would you like for your ${this.sItem_second}: large / medium / small?`);
                break;
              }
              else if(sInput.toLowerCase() == "no"){
                this.stateCur = OrderState.DRINKS;
                aReturn.push("Would you like drinks?");
                break;
              } 
              else{
                aReturn.push(`Would you like to try ${this.sItem_second} as a second item?`);
                this.stateCur = OrderState.SECOND_ITEM;
              }             
            case OrderState.SECOND_ITEM_SIZE:
                this.stateCur = OrderState.SECOND_ITEM_TOPPINGS;
                this.sSecond_item_size = sInput;

                if(this.sSecond_item_size=="large"){
                    this.sTotal_cost=this.sTotal_cost +10;
                }
                else if(this.sSecond_item_size=="medium"){
                    this.sTotal_cost=this.sTotal_cost +7;
                }
                else if (this.sSecond_item_size=="small"){
                    this.sTotal_cost=this.sTotal_cost +5;
                }
                else{
                    aReturn.push(`What size would you like for your ${this.sItem_second}: large / medium / small?`);
                    this.stateCur = OrderState.SECOND_ITEM_SIZE;
                break;              
                }
                aReturn.push(`What toppings would you like in your ${this.sItem_second}?`);
                console.log(this.sTotal_cost);
                break;
            case OrderState.SECOND_ITEM_TOPPINGS:
                this.stateCur = OrderState.DRINKS;
                this.sSecond_item_toppings = sInput;
                aReturn.push("Would you like soft drinks with that?");
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.DESSERT;
                if(sInput.toLowerCase() == "yes"){
                  this.sDrinks = "a";
                    this.sTotal_cost=this.sTotal_cost +1.5;
                    aReturn.push("Would you like anything for dessert?");
                    console.log(this.sTotal_cost);
                    break;
                }
                else if(sInput.toLowerCase() == "no"){
                  //this.sDrinks = sInput;
                  aReturn.push("Would you like anything for dessert?");
                  break;
                }
                else{
                  this.sDrinks = sInput;
                    this.sTotal_cost=this.sTotal_cost +1.5;
                    aReturn.push("Would you like anything for dessert?");
                    console.log(this.sTotal_cost);
                  break;
                }
               
            case OrderState.DESSERT:
                this.stateCur = OrderState.PAYMENT;
                if(sInput == "yes"){
                  this.sDessert="a";
                    this.sTotal_cost=this.sTotal_cost +3;
                    console.log(this.sTotal_cost);
                }
                else if(sInput == "no"){
                  this.sDessert=sInput;
                }
                else{
                  this.sDessert=sInput;
                  this.sTotal_cost=this.sTotal_cost +3;
                  console.log(this.sTotal_cost);
                }
                
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
                if(this.sItem_second){
                  aReturn.push(`${this.sSecond_item_size} ${this.sSecond_item_toppings} ${this.sItem_second}`);
                }
                if(this.sDrinks){
                    aReturn.push(`with ${this.sDrinks} drink `);
                }
                if(this.sDessert){
                    aReturn.push(`and ${this.sDessert} dessert`);
                }
                aReturn.push("Your total bill amount (including HST) is:");
                aReturn.push(`$${(this.sTotal_cost*(1+this.sTax)).toFixed(2)}`);
                console.log(this.sTotal_cost);
                console.log(this.sTotal_cost*(1+this.sTax));
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                console.log(sInput.purchase_units[0]);
              
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                aReturn.push(`Delivery Location: ${sInput.purchase_units[0].shipping.address.address_line_1}, ${sInput.purchase_units[0].shipping.address.admin_area_2}, ${sInput.purchase_units[0].shipping.address.admin_area_1}, ${sInput.purchase_units[0].shipping.address.postal_code}, ${sInput.purchase_units[0].shipping.address.country_code}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
        // your client id should be kept private
        if(sTitle != "-1"){
          this.sItem = sTitle;
          this.sItem_second = sTitle;
        }
        if(sAmount != "-1"){
          this.sTotal_cost = sAmount;
        }
        const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
        return(`
        <!DOCTYPE html>
    
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        </head>
        
        <body>
          <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          <script
            src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
          </script>
          Thank you ${this.sNumber} for your ${this.sItem} and / or ${this.sItem_second} order of $${(this.sTotal_cost*(1+this.sTax)).toFixed(2)}.
          <div id="paypal-button-container"></div>
    
          <script>
            paypal.Buttons({
                createOrder: function(data, actions) {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: '${(this.sTotal_cost*(1+this.sTax)).toFixed(2)}'
                      }
                    }]
                  });
                },
                onApprove: function(data, actions) {
                  // This function captures the funds from the transaction.
                  return actions.order.capture().then(function(details) {
                    // This function shows a transaction success message to your buyer.
                    $.post(".", details, ()=>{
                      window.open("", "_self");
                      window.close(); 
                    });
                  });
                }
            
              }).render('#paypal-button-container');
            // This function displays Smart Payment Buttons on your web page.
          </script>
        
        </body>
            
        `);
    
      }
}