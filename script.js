var ctx = document.getElementById('myChart').getContext('2d');
var list = document.getElementById('side');
let httpreq=new XMLHttpRequest()

function divclick(e){
    let code = e.target.getAttribute("id");
    httpreq.open("GET","https://api.covid19api.com/dayone/country/"+code,true)
    httpreq.onreadystatechange=function(){
        if(httpreq.readyState==4 && httpreq.status==200){
        let raw= JSON.parse(httpreq.response)
        let labels = raw.map(e=>e.Date)
        let confirmed = raw.map(e=>e.Confirmed)
        let recovered = raw.map(e=>e.Recovered)
        let datasets=[{
                label: "confirmed",
                data:confirmed
                },
                {
                    label: "Recovered",
                    data:recovered
                    }]
        myChart.data.labels=labels
        myChart.data.datasets=datasets;
        myChart.update()
        console.log(confirmed)
    }
}
    httpreq.send()
}

httpreq.open("GET","https://api.covid19api.com/countries",true)
httpreq.onreadystatechange=function(){
    if(httpreq.readyState==4 && httpreq.status==200){
        let raw= JSON.parse(httpreq.response)
        resp=raw.sort((a,b)=>a.Country<b.Country?-1:1)
        resp.forEach(e => {
            let d=document.createElement("div")
            d.setAttribute('id',e.ISO2)
            d.setAttribute('class',"country")
            d.innerHTML=e.Country
            d.addEventListener("click",divclick)
            list.appendChild(d)
});
    }
}
httpreq.send()






// const ctx = document.querySelector("myChart")

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


const search = document.querySelector("#search");

search.addEventListener("input", () => {

    const query = search.value.toLowerCase();
    for (let item of list.children) {
      if (!item.textContent.toLowerCase().includes(query)) {
        item.style.display = "none";
      }
      else {
        item.style.display = "";
      }
    }
  });
