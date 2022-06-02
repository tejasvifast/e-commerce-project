// let s = "606"
// let count=0
// let arr=[]
// for(let i=0;i<s.length;i++){
//     for(let j=i;j<s.length;j++){
//         if(s.slice(i,j+1)%6==0  ){count++}
//         if(s.slice(i,j+1).slice(0,1)==0 && s.slice(i,j+1)!=0 ){count--}
//     }
// }
// console.log(count)

// [int(s[i:j+1]) for i in range(l) for j in range(i,l)]


//let reduceProduct = await cartModel.findOneAndUpdate({ "items.productId": productId , userId: userId}, { $inc: { "items.$.quantity": -1,  totalPrice: -reducePrice } }, { new: true })

//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa".length)


//ridnuP tupjaR vadaY Ashish Abhishek Sunil

// Input:Ashish Yadav Abhishek Rajput Sunil Pundir Prem
// Output:merP linuS kehsihbA hsihsA Yadav Rajput Pundir

let arr = ['Ashish', 'Yadav', 'Abhishek', 'Rajput', 'Sunil', 'Pundir']
let arr2 = []
let arr3 = []
if (arr.length % 2 == 0) {
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 != 0) {
            let arrReverse = arr[i].split("").reverse().join("")
            arr2.push(arrReverse)
            arr2.unshift(arr2.pop())

        }
        else {
            arr3.push(arr[i])
        }
    }
    console.log(arr2.concat(arr3));
}
else {
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 == 0) {
            let arrReverse = arr[i].split("").reverse().join("")
            arr2.push(arrReverse)
            arr2.unshift(arr2.pop())
        }
        else {
            arr3.push(arr[i])
        }
    }
    console.log(arr2.concat(arr3));
}