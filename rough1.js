let str = "Ashish Yadav Abhishek Rajput Sunil Pundir Prem"
let arr = str.split(" ")
console.log(arr)
let arr1 = []
let arr2 = []
let str1 = ""

for (let i = 0; i < arr.length; i++) {
    if ((arr.length) % 2 == 0) {
        if (i % 2 != 0) {
            arr1.push(arr[i].split("").reverse().join(""))
        }
        else { arr2.push(arr[i]) }
    }
    else {
        if (i % 2 == 0) {
            arr1.push(arr[i].split("").reverse().join(""))
        }
        else { arr2.push(arr[i]) }
    }
}


console.log(arr1.reverse().concat(arr2))




