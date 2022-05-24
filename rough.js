let s1="cocodedecodecodecocodede"
let s2 ="code"

// let arr1=s1.split("")    //["c","o","c","o","d","e","d","e"]
// let arr2=s2.split("")    //["c","o","d","e"]

let value = "no"
let length = (s1.length)/(s2.length)
console.log(length)
for(let i=0;i<length-1;i++){
    if(s1.includes(s2)){
       s1=s1.replace(s2,"")     
    }
    console.log("----"+s1+"-----")
    if(s1==""){value ="yes"} 
}
console.log(value)




