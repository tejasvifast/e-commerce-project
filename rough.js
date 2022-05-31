let s = "606"
let count=0
let arr=[]
for(let i=0;i<s.length;i++){
    for(let j=i;j<s.length;j++){
        if(s.slice(i,j+1)%6==0  ){count++}
        if(s.slice(i,j+1).slice(0,1)==0 && s.slice(i,j+1)!=0 ){count--}
    }
}
console.log(count)

// [int(s[i:j+1]) for i in range(l) for j in range(i,l)]

            
//let reduceProduct = await cartModel.findOneAndUpdate({ "items.productId": productId , userId: userId}, { $inc: { "items.$.quantity": -1,  totalPrice: -reducePrice } }, { new: true })

console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".length)