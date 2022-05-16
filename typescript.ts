const resultsContainer:HTMLElement|null = document.getElementById('results');
const numbersKeys:string = "0123456789.";
const operationKeys:string[] = ["*", "/", "-", "+"];
const bracketsKeys:string[] = ["(",  ")"];
const memoryKeys:string[] = ["MC",  "MS", "MR", "M+", "M-"];
let operation:string = "";
let prevOperation:string = "";
let memory:string = "0";
let results:string = "";
let rvt:boolean = false;
 
const handleClickedEvent:any = (e:any):void => {
    const pressedKey:string = e.target.id ;
    let operationLen:number = operation.toString().length;
    if(operation.toString().includes("Infinity" || "NaN")){operation = "";}
    if(pressedKey ==='C'){operation = operation.slice(0, operationLen - 1);}
    else if(pressedKey ==='AC'){operation = '';}
    else if(pressedKey ==='+/-'){switchSigns();}
    else if(pressedKey === "="){Results();}
    else if(pressedKey ==='Rvt' && rvt ){operation = prevOperation;}
    else if(operationKeys.includes(pressedKey) || bracketsKeys.includes(pressedKey)){operation+= pressedKey;rvt = false}
    else if(numbersKeys.includes(pressedKey)){rvt = false; operation = validateLength(operation, pressedKey);}
    else if(memoryKeys.includes(pressedKey)){handleMemory(pressedKey);}
    RVT();
    Outputs(); 
}
const Results = (returnValue:boolean=false):void|string => {
    prevOperation = operation;
    if(validateInput()){
        rvt = true;
        operation = eval(operation || "0").toString();
        operation = validateLength(operation);
    }
    if(returnValue)return operation.toString();
}

const Outputs = ():void => {
    results = operation.toString();
    if(resultsContainer)resultsContainer.innerText = results;
} 
const validateLength = (Num:string, AddedNum?:string):string => {
    if(AddedNum){Num += AddedNum;}
    const convertStringToArray = ():string[]=> {
        let arr:string[] = [], currentNum:string = "";
        let tempArr:string[] = Num.split('');
        tempArr.forEach(item => {
            if(numbersKeys.includes(item)){
                currentNum += item;
            }else if(bracketsKeys.includes(item) || operation.includes(item)){
                arr.push(currentNum);
                arr.push(item);
                currentNum = "";
            }
        });
        if(currentNum.length > 0){arr.push(currentNum);}
        return arr;
    }
    const validateEveryNumber = (Arr:string[]):string => {
        for (let i =0; i < Arr.length; i++){
            if(Arr[i].includes('.')){
                let decimalPos:number = Arr[i].indexOf(".");
                let numAfterDecimal:number = Arr[i].length - (decimalPos + 1);
                if(numAfterDecimal > 8){
                    Arr[i] = Arr[i].slice(0, decimalPos) + Arr[i].slice(decimalPos, 9 + decimalPos); 
                }
            }else if (!Arr[i].includes(".")){
                if(Arr[i].length > 12){
                    Arr[i] = Arr[i].slice(0, 12);
                }
            }
        }
        let ArrString:string = "";
        Arr.forEach(value => {ArrString += value; })
        return ArrString;
    }
  
    const validatedResults = validateEveryNumber(convertStringToArray());
    return validatedResults;
}
const handleMemory = (key:string):void => {
    
    if(key === 'MS'){
        if(validateInput()){
            memory = Results(true)|| memory;
        }
    }else if(key === 'MC'){
        //MC memory clear, sets memory to 0
        memory = "0";
    }else if(key === "MR"){
        // MR: memory recall, recalls the memory to the display
        operation = memory;
    }else if(key === "M+"){
        // M+: adds the number on display to the memory and puts the result into the memory  
            if(validateInput()){
                memory = (parseFloat(memory || "0") + parseFloat(Results(true) || "0")).toString();
                operation = validateLength(memory) ;
            }     
    }else if(key === "M-"){
        //M-:  aubtracts the currenty value from value in the memory and puts the results into the memory  
        if(validateInput()){
            memory = (parseFloat(memory) - parseFloat(Results(true) || "0") ).toString();
            operation = memory;
        }     
    }
}
const switchSigns = ():void => {
    let temp:string = "";
    for(let i=0; i< operation.length; i++){
        if(i === 0 ){
            if(operation[i] === "+"){temp += "-";}
            else if(operation[i] === "-"){temp += "";}
            else if(parseInt(operation[i]) > 0){temp += `-${operation[i]}`;}
        }
        else if(operation[i] === "-"){ 
            temp += "+";
        }
        else if(operation[i] === "+"){
            temp += "-";
        }
        else {temp += operation[i];}
    }
    operation = temp;
}
const RVT = ():void => {
    const rvtBtn:any  = document.getElementById('Rvt');
    if(rvt){
        rvtBtn.classList.remove('disabled');
    }
    else{
        rvtBtn.classList.add('disabled');
    }
}
const validateInput = ():boolean => {
    let count = 0, operationLen  = operation.length;
    for(let i=0; i < operation.length; i++){
        if(bracketsKeys.includes(operation[i]) ){
            count++;
        }
    }
    const checkBrackets = ():boolean => {if(count%2 === 0){return true;}else{return false;}}
    for(let i=0; i<operation.length; i++){
        for(let j=0; j<operation.length; j++){
            if((numbersKeys.includes(operation[i]) && operation[i+1] ==="(") || (operation[i] === ")" && numbersKeys.includes(operation[i+1]) )){return false;}
            else if(!checkBrackets()){return false;}
            else if(operationKeys.includes(operation[i]) && operationKeys.includes(operation[i+1])){return false;}
            else if(operationKeys.includes(operation[i]) && operation[i+1] === ")"){return false;}
            else if(['/', '*'].includes(operation[i]) && i === 0){return false;}
            else if(operationKeys.includes(operation[i]) && i === operationLen - 1 ){return false;}
            else if(operation[i] === ")" && i === 0){return false;}
        }
    }
    return true;
}