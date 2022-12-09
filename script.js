var ctx = document.getElementById('myChart').getContext('2d');
var list = document.getElementById('side');
let httpreq=new XMLHttpRequest()

function divclick(e){
    let code = e.target.getAttribute("id");
    httpreq.open("GET","https://api.covid19api.com/dayone/country/"+code,true)
    httpreq.onreadystatechange=function(){
        if(httpreq.readyState==4 && httpreq.status==200){
        let raw= JSON.parse(httpreq.response)
        let labels = raw.map(e=>{
          let d=new Date(e.Date)
          day=d.getDate()
          month=d.getMonth()+1;
          return `${day}/${month}`
        })
        let confirmed = raw.map(e=>e.Confirmed)
        let recovered = raw.map(e=>e.Recovered)
        let deaths = raw.map(e=>e.Deaths)
        let active = raw.map(e=>e.Active)
        let datasets=[{
                label: "Confirmed",
                data:confirmed
                },
                {
                label: "Recovered",
                data:recovered
                },
                {
                label: "Deaths",
                data:deaths
                },
                {
                label: "Active",
                data:active
                    }]
        myChart.data.labels=labels
        myChart.data.datasets=datasets;
        myChart.options.plugins.title.text=raw[0].Country
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
      plugins: {
        title: {
            display: true,
            text: 'Choose your Country'
        }
    },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


const search = document.querySelector("#search");

search.addEventListener("input", () => {
    // Get the search query
    const query = search.value.toLowerCase();
  
    // Loop through the list of items
    for (let item of list.children) {
      // If the item does not match the search query, hide it
      if (!item.textContent.toLowerCase().includes(query)) {
        item.style.display = "none";
      }
      // Otherwise, show it
      else {
        item.style.display = "";
      }
    }
  });


  // TEXT Animation
  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};