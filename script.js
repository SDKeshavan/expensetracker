
function refreshGraph(){
  const xValues = dates;

  if(window.innerWidth<1000){
    new Chart("myChart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{ 
          data: depositSumArr,
          borderColor: "green",
          fill: false
        }, { 
          data: expenditurSumArr,
          borderColor: "red",
          fill: false
        }]
      },
      options: {
        legend: {display: false}
  
  
      }
    });
  }else{

    document.querySelector(".main").innerHTML = "<h2 style='text-align:center;position:absolute;width:100%'>Please visit through Mobile<h2>"
  //   new Chart("myChart", {
  //     type: "line",
  //     data: {
  //       labels: xValues,
  //       datasets: [{ 
  //         data: depositSumArr,
  //         borderColor: "green",
  //         fill: false
  //       }, { 
  //         data: expenditurSumArr,
  //         borderColor: "red",
  //         fill: false
  //       }]
  //     },
  //     options: {
  //       legend: {display: false},
  //       responsive: false
  
  
  //     }
  //   });
  }

  
}

let balance, expenditure
let transactions = []
let nooftrans = []
let notes = []
let dates = []

let expenditurSumArr = []
let depositSumArr = []

let d = new Date()
let today = `${d.getDate()+2}/${d.getMonth()+1}/${d.getFullYear()}`

if(localStorage.balance){
  balance = Number(localStorage.getItem("balance"))

    notes = localStorage.getItem("notes").split(",")
    transactions = localStorage.getItem("transactions").split(",")
    dates = localStorage.getItem("dates").split(",")
    nooftrans = localStorage.getItem("nooftrans").split(",")

}else{
  localStorage.balance = 0
  localStorage.notes = ""
  localStorage.transactions = ""
  localStorage.dates = ""
  localStorage.nooftrans = ""
  balance = Number(localStorage.getItem("balance"))

  notes.splice(0,1)
  transactions.splice(0,1)
  dates.splice(0,1)
  nooftrans.splice(0,1)

}
expenditure = 0



{
  for(let i = 0; i<transactions.length; i++){
    if(Number(transactions[i])<0){
      expenditure += (Number(transactions[i])*-1)
    }
  }
}

const depositForm = document.querySelector(".deposit-cont")
const withdrawForm = document.querySelector(".withdraw-cont")
const main = document.querySelector(".main")


document.querySelector(".balance-ind").innerHTML = `$${balance}`;
document.querySelector(".expenditure-ind").innerHTML = `$${expenditure}`;

calcDaily()
refreshGraph()


function closeForm(){ 

  depositForm.style.opacity = 0;
  withdrawForm.style.opacity = 0;
  main.style.filter = "blur(0px)"
  document.body.style.overflow ="scroll";
  setTimeout(() => {
    depositForm.style.display = "none"
    withdrawForm.style.display = "none"
  },260)
  
}

function openForm(f){
  const form = document.querySelector(f)
  form.style.display = "grid"
  main.style.filter = "blur(5px)"
  document.body.style.overflow ="hidden";

  setTimeout(() =>{
    form.style.opacity = 1
  },10)
  
}

showTransactions()

function addAmount(){
  const form = document.forms["depositForm"]
  let ind
  let note = document.querySelector(".depNote").value;
  let amt = document.querySelector(".amt").value;

  balance += amt


  if(dates.indexOf(today) > -1){
    ind = dates.indexOf(today)
    nooftrans[ind] = parseInt(nooftrans[ind]) + 1
  }else{
    dates.push(today)
    nooftrans.push(1)
  }

  transactions.push(amt)
  notes.push(note)

  if(dates.length>15){
    dates.splice(0,1)
    nooftrans.splice(0,1)
    transactions.splice(0,1)
    notes.splice(0,1)
  }

  console.log(notes)

  localStorage.dates = String(dates)
  localStorage.nooftrans = String(nooftrans)
  localStorage.balance = Number(localStorage.balance) + Number(amt)
  localStorage.transactions = String(transactions)
  localStorage.notes = String(notes)
  showTransactions()
  calcDaily()
  refreshGraph()
}

function withdrawAmount(){
  const form = document.forms["withdrawForm"]

  let amt = Number(form.amt.value)
  let note = form.withdrawnote.value
  let ind
  if(amt > balance){
    alert("Insufficient Funds! :( ")
  }else{
    balance -= amt

    if(dates.indexOf(today) > -1){
      ind = dates.indexOf(today)
      nooftrans[ind] = parseInt(nooftrans[ind]) + 1
    }else{
      dates.push(today)
      nooftrans.push(1)
    }

    transactions.push(amt*-1)
    notes.push(note)

    if(dates.length>15){
      dates.splice(0,1)
      nooftrans.splice(0,1)
      transactions.splice(0,1)
      notes.splice(0,1)
    }

    localStorage.dates = String(dates)
    localStorage.nooftrans = String(nooftrans)
    localStorage.balance = Number(localStorage.balance) - Number(amt)
    localStorage.transactions = String(transactions)
    localStorage.notes = String(notes)
  }

  showTransactions()
  calcDaily()
  refreshGraph()
}


function calcDaily(){
  let pointer=0, j, expenditureSum, depositSum, t

  for(let n = nooftrans.length-1; n>=0 && n>nooftrans.length-5; n--){
    expenditureSum = 0
    depositSum = 0
    for(j = pointer; j < pointer+nooftrans[n]; j++){
      // console.log(pointer+n)  
      // console.log(transactions[j]) 
      t = Number(transactions[j])
      if(t<0){
        expenditureSum = expenditureSum + (-1*t)
      }else{
        // console.log(t)
        depositSum += t
      }
    }
    depositSumArr.push(depositSum)
    expenditurSumArr.push(expenditureSum)
    pointer += Number(n)

  }

  refreshGraph()
}



function handleSubmit(e){
  e.preventDefault();
}


function showTransactions(){

  const transCont = document.querySelector(".transCont")
  let color
  for(let i = transactions.length-1; i>=0 && i>=transactions.length-4; i--){
    color = "green"
    if(transactions[i] < 0){
      color = "red"
    }
    transCont.innerHTML += `<div class="transaction">
      <p class="desc">${notes[i]}</p>
      <p class="price" style="color:${color}">$${transactions[i]}</p>
    </div>`
  }

}

function showAllTransactions(){

  const allTransactions = document.querySelector(".all-transaction-cont")

  const transCont = document.querySelector(".all-transaction-inner-cont")
  transCont.innerHTML = ""
  let color
  for(let i = transactions.length-1; i>=0; i--){
    color = "green"
    if(transactions[i] < 0){
      color = "red"
    }
    transCont.innerHTML += `<div class="transaction">
      <p class="desc">${notes[i]}</p>
      <p class="price" style="color:${color}">$${transactions[i]}</p>
    </div>`
  }

  if(allTransactions.style.opacity == 0){
    allTransactions.style.display = "grid"
    setTimeout(() =>{
      allTransactions.style.opacity = 1
    },10)
  }else{
    allTransactions.style.opacity = 0
    setTimeout(() =>{
      allTransactions.style.display = "none"

    },250)
  }

}

function toggleInfo(){

  const infoCont = document.querySelector(".info-info-cont");

  if(infoCont.style.display == "none"){
    infoCont.style.display = "grid"
    main.style.filter = "blur(7px)"
    setTimeout(()=>{
      infoCont.style.opacity = 1
    }, 10)
  }else{
    infoCont.style.opacity = 0
    main.style.filter = "blur(0px)"
    setTimeout(()=>{
      infoCont.style.display = "none"
    },250)
  }

}

function clearData(){
  localStorage.removeItem("nooftrans")
  localStorage.removeItem("notes")
  localStorage.removeItem("transactions")
  localStorage.removeItem("dates")
  localStorage.removeItem("balance")
  location.reload()
}
