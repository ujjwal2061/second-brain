// generta random hasing string
export function random(len:number){
    let options="qwertyuiopasdfghjklzxcvbn123465";
    let length=options.length;
    let ans="";
    for(let i=0; i<len;i++){
        ans +=options[Math.floor(Math.random()*length)]
    }
    return ans;
}