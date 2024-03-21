// const xValues = [50,60,70,80,90,100,110,120,130,140,150];
// const yValues = [7,8,8,9,9,9,10,11,14,14,15];

// new Chart("myChart", {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [{
//       fill: false,
//       lineTension: 0,
//       backgroundColor: "rgba(0,0,255,1.0)",
//       borderColor: "rgba(0,0,255,0.1)",
//       data: yValues
//     }]
//   },
//   options: {
//     legend: {display: false},
//     scales: {
//       yAxes: [{ticks: {min: 6, max:16}}],
//     }
//   }
// });

let balance, expenditure
let transactions = []
let notes = []

if(sessionStorage.balance){
  balance = Number(sessionStorage.getItem("balance"))
  notes = sessionStorage.getItem("notes").split(",")
  transactions = sessionStorage.getItem("transactions").split(",")
}else{
  sessionStorage.balance = 0
  sessionStorage.notes = ""
  sessionStorage.transactions = ""
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

document.querySelector(".balance-ind").innerHTML = `$${balance}`;
document.querySelector(".expenditure-ind").innerHTML = `$${expenditure}`;

function closeForm(){ 

  depositForm.style.opacity = 0;
  withdrawForm.style.opacity = 0;


  setTimeout(() => {
    depositForm.style.display = "none"
    withdrawForm.style.display = "none"
  },260)
  
}

function openForm(f){
  const form = document.querySelector(f)
  form.style.display = "grid"

  setTimeout(() =>{
    form.style.opacity = 1
  },10)
  
}

// function addAmount(){
//   const form = document.forms["depositForm"]

//   let note = form.deposit-note.value
//   let amt = form.amt.value

//   balance += amt
//   notes.push(note)

//   sessionStorage.setItem("balance", balance)
//   sessionStorage.setItem("notes", notes)  
//   balance = Number(sessionStorage.getItem("balance"))
//   notes = Array(sessionStorage.getItem("notes"))
// }

function addAmount(){
  const form = document.forms["depositForm"]

  let note = document.querySelector(".depNote").value;
  let amt = document.querySelector(".amt").value;

  balance += amt
  transactions.push(amt)
  notes.push(note)
  if(transactions.length>15){
    transactions.splice(0,1)
    notes.splice(0,1)
  }

  console.log(notes)

  sessionStorage.balance = Number(sessionStorage.balance) + Number(amt)
  sessionStorage.transactions = String(transactions)
  sessionStorage.notes = String(notes)
}

function withdrawAmount(){
  const form = document.forms["withdrawForm"]

  let amt = Number(form.amt.value)
  let note = form.withdrawnote.value

  if(amt > balance){
    alert("Insufficient Funds! :( ")
  }else{
    balance -= amt
    transactions.push(amt*-1)
    notes.push(note)
    if(transactions.length>5){
      transactions.splice(0,1)
      notes.splice(0,1)
    }
    sessionStorage.balance = Number(sessionStorage.balance) - Number(amt)
    sessionStorage.transactions = String(transactions)
    sessionStorage.notes = String(notes)
  }
}

function handleSubmit(e){
  e.preventDefault();
}


function showTransactions(){

  const transCont = document.querySelector(".transCont")
  let color
  for(let i = transactions.length-1; i>=0 && i>=transactions.length-6; i--){
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