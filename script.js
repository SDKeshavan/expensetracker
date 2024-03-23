
function refreshGraph(){
  const xValues = dates;

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

if(sessionStorage.balance){
  balance = Number(sessionStorage.getItem("balance"))
  notes = sessionStorage.getItem("notes").split(",")
  transactions = sessionStorage.getItem("transactions").split(",")
  dates = sessionStorage.getItem("dates").split(",")
  nooftrans = sessionStorage.getItem("nooftrans").split(",")
}else{
  sessionStorage.balance = 0
  sessionStorage.notes = ""
  sessionStorage.transactions = ""
  sessionStorage.dates = ""
  sessionStorage.nooftrans = ""
  balance = Number(sessionStorage.getItem("balance"))
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

  sessionStorage.dates = String(dates)
  sessionStorage.nooftrans = String(nooftrans)
  sessionStorage.balance = Number(sessionStorage.balance) + Number(amt)
  sessionStorage.transactions = String(transactions)
  sessionStorage.notes = String(notes)
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

    sessionStorage.dates = String(dates)
    sessionStorage.nooftrans = String(nooftrans)
    sessionStorage.balance = Number(sessionStorage.balance) - Number(amt)
    sessionStorage.transactions = String(transactions)
    sessionStorage.notes = String(notes)
  }

  showTransactions()
  calcDaily()
  refreshGraph()
}


function calcDaily(){
  let pointer=0, j, expenditureSum, depositSum, t

  nooftrans.forEach(n =>{
    expenditureSum = 0
    depositSum = 0
    for(j = pointer; j < pointer+Number(n); j++){
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

  })

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
