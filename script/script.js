console.log('Well Well We are Here now');

var GameData = null;
var Year = 2007;

// Import csv data change the map
function Dataload()
{
	queue()
	.defer(d3.csv,'data/EU_USA_JP_GDP_With_Game_Sale.csv',parse)
	.await(dataLoaded);
}

Dataload()

function dataLoaded(err,GamingData)
{	
	GameData = GamingData;
    DrawMap(GameData, AddBubbleClick);
//    DrawLineChart(GameData);
}

function parse(d)
{	
	var GamingData = {};
    GamingData.LOCATION = d.LOCATION;
    GamingData.TIME = d.TIME;
    GamingData.Value_Million_USD = d.Value_Million_USD;
    GamingData.GDP_Growth = d.GDP_Growth;
    GamingData.GDP_Growth_Percentage = d.GDP_Growth_Percentage;
    GamingData.Game_Copy_Sales = d.Game_Copy_Sales;
    GamingData.Game_Sales_Growth_Percentage = d.Game_Sales_Growth_Percentage;
    
	return GamingData;
}

function DrawMap(GamingData, callback){
    
    var JPNData, USAData, EUData, GlobalData = null;
    
    JPNData = GetValue(GamingData, "JPN");
    USAData = GetValue(GamingData, "USA");
    EUData = GetValue(GamingData, "EU");
    GlobalData = GetValue(GamingData, "Global");
    
    var JPNFill = GetFillKey(JPNData.GDP_Growth_Percentage),
        USAFill = GetFillKey(USAData.GDP_Growth_Percentage),
        EUFill = GetFillKey(EUData.GDP_Growth_Percentage),
        GlobalFill = GetFillKey(GlobalData.GDP_Growth_Percentage); 
    
    var Worldmap = new Datamap({

        element: document.getElementById('MArea'),
        done: function(datamap) {
            console.log('Map Loading Done');
        },
        fills: {
            HighUp: 'rgb(55,182,136)',
            MediumUp: 'rgb(133,255,216)',            
            LowUp: 'rgb(182,255,232)',
            HighDown: 'rgb(255,0,0)',
            MediumDown: 'rgb(255,82,82)',            
            LowDown: 'rgb(255,190,190)',
            Unknown: 'rgb(0,0,0)',
            Transparent: 'rgba(255,255,255,0.4)',
            defaultFill: 'rgb(255,255,255)'
        },
        data: {
            JPN: {
                fillKey: JPNFill,
                numberOfThings: JPNData.GDP_Growth_Percentage
            },
            USA: {
                fillKey: USAFill,
                numberOfThings: USAData.GDP_Growth_Percentage
            },
            GBR: {
                fillKey: EUFill,
                numberOfThings: EUData.GDP_Growth_Percentage
            },
            FRA: {
                fillKey: EUFill,
                numberOfThings: EUData.GDP_Growth_Percentage
            },
            DEU: {
                fillKey: EUFill,
                numberOfThings: EUData.GDP_Growth_Percentage
            }
        },
        geographyConfig: {
            popupOnHover: false,
            highlightOnHover: false,            
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        'The GDP growth in this year of ' + geo.properties.name,
                        ': ' + data.numberOfThings,
                        '</strong></div>'].join('');
            }
        }
    });

    var bombs = [{
        name: 'Japan Top 100 Game Sales',
        radius: JPNData.Game_Copy_Sales/100000000*100,
        yield: JPNData.Game_Copy_Sales,
        progress: JPNData.GDP_Growth_Percentage,
        country: 'JPN',
        fillKey: 'Transparent',
        date: Year,
        latitude: 37.07,
        longitude: 138.43
    },{
        name: 'USA Top 100 Game Sales',
        radius: USAData.Game_Copy_Sales/100000000*100,
        yield: USAData.Game_Copy_Sales,
        progress: USAData.GDP_Growth_Percentage,
        country: 'USA',
        fillKey: 'Transparent',
        date: Year,
        latitude: 39.07,
        longitude: -98.43

    },{
        name: 'EU Top 100 Game Sales',
        radius: EUData.Game_Copy_Sales/100000000*100,
        yield: EUData.Game_Copy_Sales,
        progress: EUData.GDP_Growth_Percentage,
        country: 'EU',
        fillKey: 'Transparent',
        date: Year,
        latitude: 53.482,
        longitude: 2.5854
    }];

    //draw bubbles for bombs
    Worldmap.bubbles(bombs, {
        popupTemplate: function (geo, data) {
                return ['<div class="hoverinfo">' +  data.name,
                '<br/>Sales: ' +  data.yield + ' copies',
                '<br/>GDP Growth: ' +  data.progress + ' %',   
                '<br/>Country: ' +  data.country + '',
                '<br/>Date: ' +  data.date + '',
                '</div>'].join('');
        },
    });
    
    if(callback) {
        callback();
    }
    
}

function GetValue(dataArray, keyLocation){
    var FinalData = null;
    for(var i = 0; i < dataArray.length; i++){
        if(dataArray[i].LOCATION == keyLocation){
            if(dataArray[i].TIME == Year){
                FinalData = dataArray[i];
                break;
            }
        }
    }
    return FinalData;
}

function GetFillKey(GrowthData) {
    var FillKey = '';
    
    if(GrowthData > 4){
        FillKey = 'HighUp';
    } else
    if(GrowthData > 2) {
       FillKey = 'MediumUp';
    } else
    if(GrowthData > 0) {
        FillKey = 'LowUp';
    } else
    if(GrowthData > -2){
        FillKey = 'LowDown';
    } else
    if(GrowthData > -4){
        FillKey = 'MediumDown';
    } else
    if(GrowthData < -4) {
       FillKey = 'HighDown';
    }else {
        FillKey = 'Unknown';
    }
    
    return FillKey;
}

// Click function part
function changeYear(e){
    Year = e.target.innerText;
    var selectedId = this.id;
    var selectedChange = document.getElementsByClassName("Tslected");
    selectedChange[0].className = "timeline";
    document.getElementById(selectedId).className = "Tslected";
    clearBox('MArea',null);
    var bubbles = document.getElementsByClassName("datamaps-bubble");
    DrawMap(GameData,AddBubbleClick);
}

var timelineC = document.getElementsByClassName("timeline");

var defaultSelected = document.getElementsByClassName("Tslected");


function AddListener(timelineC, clickFunction){
    
    console.log('Adding some click functions');
    console.log(timelineC);
    
    for(var i = 0; i<timelineC.length; i++){
        timelineC[i].addEventListener("click", clickFunction);
    }
    
    return null;
}

function RemoveTimeListener(timelineC) {
    
    for(var i = 0; i<timelineC.length; i++){
        timelineC[i].removeEventListener("click", null);
    }
    
    return null;
}

function clearBox(elementID, callback) {
    document.getElementById(elementID).innerHTML = "";
    if(callback){
        callback();
    }
}

AddListener(timelineC, changeYear);
AddListener(defaultSelected, changeYear);

function drawLineChart(GamingData) {
    var JPNData, USAData, EUData, GlobalData = null;
    
    JPNData = GetValue(GamingData, "JPN");
    USAData = GetValue(GamingData, "USA");
    EUData = GetValue(GamingData, "EU");
    GlobalData = GetValue(GamingData, "Global");
    
    
}

$('#title_part').vegas({
    slides: [
        { src:'images/preview/bg-1.jpg', fade:4000 },
		{ src:'images/preview/bg-2.jpg', fade:4000 },
		{ src:'images/preview/bg-3.jpg', fade:4000 },
		{ src:'images/preview/bg-4.jpg', fade:4000 },
        { src:'images/preview/bg-5.jpg', fade:4000 },
        { src:'images/preview/bg-6.jpg', fade:4000 },
        { src:'images/preview/bg-7.jpg', fade:4000 },
        { src:'images/preview/bg-8.jpg', fade:4000 },
        { src:'images/preview/bg-9.jpg', fade:4000 },
    ],
    delay: 7000,
    timer: false,
    shuffle: true,
    });

function GetDataArray(dataArray, keyLocation){
    var FinalData = [];
    for(var i = 0; i < dataArray.length; i++){
        if(dataArray[i].LOCATION == keyLocation){
            FinalData.push(dataArray[i]);
        }
    }
    FinalData.shift()
    return FinalData;
}

function DrawLineChart(GamingData) {
    var JPNData, USAData, EUData, GlobalData = null;
    
    JPNData = GetDataArray(GamingData, "JPN");
    USAData = GetDataArray(GamingData, "USA");
    EUData = GetDataArray(GamingData, "EU");
    GlobalData = GetDataArray(GamingData, "Global");
    
    console.log(JPNData);
}


// Popup window script
var modal = document.getElementById('myModal');

function bubblesClick(e){
    var JSONString = this.getAttribute("data-info")
    var targetObj = JSON.parse(JSONString);
    var targetLocation = targetObj.country;
    modal.style.top = "0px";
    modal.style.opacity = "1";
    modal.style.display = "block";
    
    var addressAreaFolder = "";
    var addressAreaFile = "";
    
    switch (targetLocation) {
        case 'JPN':
            addressAreaFolder = "Japen_Data_Yearly";
            addressAreaFile = "Japan";
            break;
        case 'EU':
            addressAreaFolder = "Europe_Data_Yearly";
            addressAreaFile = "Europe";
            break;
        case 'USA':
            addressAreaFolder = "USA_Data_Yearly";
            addressAreaFile = "USA";
            break;
        default:
            addressAreaFolder = "";
            addressAreaFile = "";
    }
    
    var targetAddress = "../data/"+addressAreaFolder+"/Game_Sales_Data_"+Year+addressAreaFile+".csv";
    console.log(targetAddress);
    d3.csv(targetAddress, function(data){
        var GameYearlyData = data;
        drawPopup(GameYearlyData);
    })
}

function AddBubbleClick() {
    var bubbles = document.getElementsByClassName("datamaps-bubble");
    AddListener(bubbles, bubblesClick);
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.top = "-100px";
  modal.style.opacity = "0";
  modal.style.display = "none";    
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Draw Popup Content
function drawPopup(YearlyData, callback) {
//    console.log(YearlyData);
    d3.select("#MainChartArea").html("");
    var PlatformOBJ = GetPlatformNumber(YearlyData);
    console.log(PlatformOBJ);
    
    var w = 350,
        h = 350,
        r = 130,
        color = d3.scale.category20c();
    
    var vis = d3.select("#MainChartArea")
        .append("svg:svg")
        .data([PlatformOBJ])
            .attr("width", w)
            .attr("height", h)
        .append("svg:g")
            .attr("transform", "translate(" + r + "," + r + ")")
    
    var arc = d3.svg.arc()           
        .outerRadius(r);
    
    var pie = d3.layout.pie()
        .value(function(d) { return d.Value; });
    
     var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
            .append("svg:g")
                .attr("class", "slice");
    
    arcs.append("svg:path")
        .attr("fill",  function(d, i) { return color(i); })
        .attr("d", arc); 
    
    arcs.append("svg:text")
        .attr("transform", function(d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        return "translate(" + arc.centroid(d) + ")"; 
    })
    .attr("text-anchor", "middle")
    .text(function(d, i) { return PlatformOBJ[i].Name + " " + PlatformOBJ[i].Value; });
    
    if(callback){
        callback();
    }
}

function GetPlatformNumber(YearlyData){
    var StaticsNumber = [];
    for(var i=0; i<YearlyData.length; i++){
        if(StaticsNumber.length>0){
            for(var j=0; j<StaticsNumber.length; j++){
                if(YearlyData[i].Platform == StaticsNumber[j].Name){
                    StaticsNumber[j].Value += 1;
                    break;
                } else if(j==StaticsNumber.length-1){
                    var Platformobject = new Object();
                    Platformobject.Name = YearlyData[i].Platform
                    Platformobject.Value = 1;
                    StaticsNumber.push(Platformobject);
                    break;
                }
            }
        } else {
            var Platformobject = new Object();
            Platformobject.Name = YearlyData[i].Platform
            Platformobject.Value = 1;
            StaticsNumber.push(Platformobject);
        }
    }
    return StaticsNumber;
}




       
    