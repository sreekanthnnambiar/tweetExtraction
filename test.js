



hello();

function hello(){
    objArray = [ { foo: 1, bar: 2}, { foo: 3, bar: 4}, { foo: 5, bar: 6} ];
var result = objArray.map(function(a) {return a.foo;});
console.log(result);

}