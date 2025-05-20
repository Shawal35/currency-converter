const BaseURL= "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/pkr.json"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg")

for(let select of dropdowns){
    for(currCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name ==="from" && currCode === "USD"){
            newOption.selected = "Selected"
        } else  if(select.name ==="to" && currCode === "PKR"){
            newOption.selected = "Selected"
        }
        select.append(newOption);
    }

    select.addEventListener("change", (e)=>{
        FlagUpdate(e.target);
    })
}

const FlagUpdate = (element)=>{
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

async function convertCurrency(fromCurr, toCurr, amtVal) {
  const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

  // Lowercase currency codes
  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  // Construct URL to fetch fromCurrency json
  const URL = `${BASE_URL}/${from}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();

    // Get rate from nested object
    let rate = data[from][to];
    if (!rate) {
      throw new Error(`Rate not found for ${fromCurr.value} to ${toCurr.value}`);
    }

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(4)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
  }
}


btn.addEventListener("click", async (e) => {
  e.preventDefault();
  let amountInput = document.querySelector(".amount input");
  let AmountVal = amountInput.value;

  if (AmountVal === "" || AmountVal < 1) {
    AmountVal = 1;
    amountInput.value = "1";
  }

  // Call convertCurrency function here
  await convertCurrency(fromCurr, toCurr, Number(AmountVal));
});
