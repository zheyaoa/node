function asyncFunction(callback){
    setTimeout(callback,2000)
}
let color = 'red';
(function(color){
    asyncFunction(function(){
        console.log(color)
    })
})(color)

color = 'green'

setTimeout(function(){
    console.log('first')
    setTimeout(function(){
        console.log('next')
        setTimeout(function(){
            console.log('last')
        },100)
    },500)
},1000)