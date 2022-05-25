let arr = [12, 3, 6, 7, 8]
let min = arr[0]
for (let i=0; i<arr.length; i++){
    if(arr[i] < min){
        min=arr[i]
    }
}
console.log(min)