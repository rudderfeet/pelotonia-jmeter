/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.721875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "Pelotonia.org About Leadership"], "isController": false}, {"data": [0.5, 500, 1500, "YourPelotonia.org Rider Registration"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Registration Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Extras"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Rider Perks"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Route Specifics"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia About Us"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Training Tips"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Virtual Riders"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Partners"], "isController": false}, {"data": [0.9, 500, 1500, "YourPelotonia.org Peloton Profiles"], "isController": false}, {"data": [1.0, 500, 1500, "YourPelotonia.org Ulman Profile"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Fundraising High Rollers"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Kids"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Contact Us"], "isController": false}, {"data": [1.0, 500, 1500, "YourPelotonia.org Donate to General Fund"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Volunteer Info"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Cycling Gear"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Fundraising Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Momentum Fund"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Men's Cycling Gear"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org FAQ/Support"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org The Ride Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Community Gallery"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Community Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Profiles Jump-Off"], "isController": false}, {"data": [0.95, 500, 1500, "YourPelotonia.org Team Huntington Profile"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Under Armour"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Donate Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Home Page"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Pulll App Info"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org The Blog"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Impact Summary"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Community Events"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Collection"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Sale"], "isController": false}, {"data": [0.9, 500, 1500, "Pulll.org in Google Play"], "isController": false}, {"data": [0.45, 500, 1500, "Pelotonia.org Ride Safety"], "isController": false}, {"data": [1.0, 500, 1500, "YourPelotonia.org Donate to Participant"], "isController": false}, {"data": [0.75, 500, 1500, "YourPelotonia.org Volunteer Profiles"], "isController": false}, {"data": [1.0, 500, 1500, "Pelotonia.org About News"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org How it Works"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Fundraising Tips"], "isController": false}, {"data": [0.95, 500, 1500, "Shop Pelotonia Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia FAQ"], "isController": false}, {"data": [0.85, 500, 1500, "YourPelotonia.org Virtual Registration"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About The James"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Contact Us"], "isController": false}, {"data": [0.25, 500, 1500, "YourPelotonia.org Rider Profiles"], "isController": false}, {"data": [0.3, 500, 1500, "Pelotonia.org Community Classifieds"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Pelotonia History"], "isController": false}, {"data": [0.8, 500, 1500, "YourPelotonia.org Volunteer Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Short Sleeve"], "isController": false}, {"data": [0.95, 500, 1500, "Pulll.org in iTunes"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Men's Under Armour"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride FAQ"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Profile Search Page"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Cycling X-tras"], "isController": false}, {"data": [0.95, 500, 1500, "YourPelotonia.org Ulman Search"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Long Sleeve"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Our Roots"], "isController": false}, {"data": [0.75, 500, 1500, "Pelotonia.org Community Event Submission"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 533.5890624999993, 41, 2117, 924.5999999999999, 1075.5499999999993, 1899.2500000000055, 1.8709292671803928, 152.65169851692312, 0.2534501653141407], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Pelotonia.org About Leadership", 10, 0, 0.0, 845.2999999999998, 689, 1742, 1663.9000000000003, 1742.0, 1742.0, 0.03225130214632416, 2.3328368396545884, 0.0041888898295518685], "isController": false}, {"data": ["YourPelotonia.org Rider Registration", 10, 0, 0.0, 788.3, 667, 975, 974.3, 975.0, 975.0, 0.03232270993600103, 7.356730850814532, 0.005366074891718922], "isController": false}, {"data": ["Pelotonia.org Registration Jump-Off", 10, 0, 0.0, 660.6, 638, 718, 713.6, 718.0, 718.0, 0.03222376180195276, 1.5173804397737893, 0.003933564673089937], "isController": false}, {"data": ["Shop Pelotonia Extras", 10, 0, 0.0, 135.09999999999997, 124, 148, 148.0, 148.0, 148.0, 0.03241953471483777, 4.030963897606141, 0.004653976174883938], "isController": false}, {"data": ["Pelotonia.org Ride Rider Perks", 10, 0, 0.0, 699.6999999999999, 653, 800, 799.8, 800.0, 800.0, 0.03222926610738147, 1.4634793567521924, 0.0040916060487886634], "isController": false}, {"data": ["Pelotonia.org Ride Route Specifics", 10, 0, 0.0, 706.8000000000001, 644, 735, 734.8, 735.0, 735.0, 0.03222158137077052, 1.410443085006976, 0.003996231283288921], "isController": false}, {"data": ["Shop Pelotonia About Us", 10, 0, 0.0, 129.0, 115, 147, 146.6, 147.0, 147.0, 0.03240083723763423, 3.4493665535067426, 0.004271594753008418], "isController": false}, {"data": ["Pelotonia.org Ride Training Tips", 10, 0, 0.0, 707.5999999999999, 690, 743, 740.7, 743.0, 743.0, 0.032223450293716746, 1.837523372071291, 0.003964994860359678], "isController": false}, {"data": ["Pelotonia.org Virtual Riders", 10, 0, 0.0, 678.0, 635, 746, 745.2, 746.0, 746.0, 0.0322815988430275, 1.3903218051708666, 0.0045080748384305975], "isController": false}, {"data": ["Pelotonia.org About Partners", 10, 0, 0.0, 744.6, 722, 810, 804.4, 810.0, 810.0, 0.03224859799220229, 1.9706948172068843, 0.004125553063455566], "isController": false}, {"data": ["YourPelotonia.org Peloton Profiles", 10, 0, 0.0, 331.0, 213, 691, 681.8000000000001, 691.0, 691.0, 0.03238446840895107, 3.444138816023835, 0.005281451390912918], "isController": false}, {"data": ["YourPelotonia.org Ulman Profile", 10, 0, 0.0, 176.0, 130, 274, 266.8, 274.0, 274.0, 0.032398212914575626, 2.7999459456066402, 0.0051887762871000035], "isController": false}, {"data": ["Pelotonia.org Fundraising High Rollers", 10, 0, 0.0, 911.9, 790, 1102, 1092.9, 1102.0, 1102.0, 0.03226045803398316, 1.4688841833426352, 0.004442113850382448], "isController": false}, {"data": ["Shop Pelotonia Kids", 10, 0, 0.0, 150.2, 117, 264, 254.50000000000003, 264.0, 264.0, 0.032420690884922755, 3.749506724253919, 0.004495837993807648], "isController": false}, {"data": ["Pulll.org Contact Us", 10, 0, 0.0, 50.5, 43, 68, 67.6, 68.0, 68.0, 0.0324163819427786, 0.3041853246581693, 0.003767138135928373], "isController": false}, {"data": ["YourPelotonia.org Donate to General Fund", 10, 0, 0.0, 209.60000000000002, 188, 270, 265.5, 270.0, 270.0, 0.032388768870506464, 2.67425587815669, 0.004870967193416011], "isController": false}, {"data": ["Pelotonia.org Ride Volunteer Info", 10, 0, 0.0, 931.0, 837, 1067, 1066.5, 1067.0, 1067.0, 0.03220809002805324, 1.7951040582998639, 0.004120370892260718], "isController": false}, {"data": ["Pelotonia.org Home Page", 10, 0, 0.0, 951.1, 872, 1102, 1094.0, 1102.0, 1102.0, 0.03219098266193674, 1.6411113856286577, 0.003646634754672521], "isController": false}, {"data": ["Shop Pelotonia Women's Cycling Gear", 10, 0, 0.0, 137.2, 124, 165, 163.5, 165.0, 165.0, 0.032396638524786664, 3.778865404925585, 0.0047772386887136595], "isController": false}, {"data": ["Pelotonia.org Fundraising Jump-Off", 10, 0, 0.0, 651.4, 635, 686, 683.8, 686.0, 686.0, 0.03222282729531255, 1.4094969533316792, 0.0040278534119140685], "isController": false}, {"data": ["Pelotonia.org About Momentum Fund", 10, 0, 0.0, 705.2, 650, 853, 839.2, 853.0, 853.0, 0.03227961897137766, 1.3636499816006171, 0.004539321417849984], "isController": false}, {"data": ["Shop Pelotonia Men's Cycling Gear", 10, 0, 0.0, 138.59999999999997, 123, 201, 195.20000000000002, 201.0, 201.0, 0.032398212914575626, 3.7764578233989616, 0.0047141930901091495], "isController": false}, {"data": ["Pulll.org FAQ/Support", 10, 0, 0.0, 90.6, 80, 116, 114.5, 116.0, 116.0, 0.032412074145860816, 1.1187641448317327, 0.0037666375228099973], "isController": false}, {"data": ["Pelotonia.org The Ride Jump-Off", 10, 0, 0.0, 854.1, 791, 960, 955.7, 960.0, 960.0, 0.032206741515133946, 1.5451058434301466, 0.0038056794173156323], "isController": false}, {"data": ["Pelotonia.org Community Gallery", 10, 0, 0.0, 674.1, 656, 718, 716.0, 718.0, 718.0, 0.03222864288407679, 1.5678731190558295, 0.004217420064908487], "isController": false}, {"data": ["Pelotonia.org Community Jump-Off", 10, 0, 0.0, 923.9, 848, 1076, 1067.6, 1076.0, 1076.0, 0.03220497824553719, 1.4622129429392194, 0.003962721932556334], "isController": false}, {"data": ["Pelotonia.org Profiles Jump-Off", 10, 0, 0.0, 934.4, 882, 1147, 1127.3000000000002, 1147.0, 1147.0, 0.03220165967353957, 1.4492633669089305, 0.003930866659367624], "isController": false}, {"data": ["YourPelotonia.org Team Huntington Profile", 10, 0, 0.0, 232.9, 155, 524, 511.40000000000003, 524.0, 524.0, 0.03239139166375144, 2.927688343795753, 0.00515605160272606], "isController": false}, {"data": ["Shop Pelotonia Women's Under Armour", 10, 0, 0.0, 153.0, 120, 340, 322.4000000000001, 340.0, 340.0, 0.0324011521849717, 3.6116336640680946, 0.004809546027456737], "isController": false}, {"data": ["Pelotonia.org Donate Jump-Off", 10, 0, 0.0, 725.0999999999999, 692, 742, 741.9, 742.0, 742.0, 0.03221711759892266, 1.5253106233529, 0.0038698295553393426], "isController": false}, {"data": ["Pulll.org Home Page", 10, 0, 0.0, 280.8, 242, 320, 319.2, 320.0, 320.0, 0.032388454163859666, 0.23161856542629683, 0.003542487174172151], "isController": false}, {"data": ["Pelotonia.org Pulll App Info", 10, 0, 0.0, 709.9999999999999, 675, 774, 772.1, 774.0, 774.0, 0.03227524327464618, 1.742456544410735, 0.0038452926557683933], "isController": false}, {"data": ["Pelotonia.org The Blog", 10, 0, 0.0, 605.8, 588, 673, 666.7, 673.0, 673.0, 0.03226170696691562, 2.13507283584437, 0.0039381966512348175], "isController": false}, {"data": ["Pelotonia.org Impact Summary", 10, 0, 0.0, 1181.8, 1162, 1222, 1219.7, 1222.0, 1222.0, 0.03222521558669227, 1.9553247486030372, 0.0038708022628546387], "isController": false}, {"data": ["Pelotonia.org Community Events", 10, 0, 0.0, 810.5, 751, 983, 974.7, 983.0, 983.0, 0.03222261963453105, 1.9070472832706602, 0.0038704904443821473], "isController": false}, {"data": ["Shop Pelotonia Women's Collection", 10, 0, 0.0, 136.79999999999998, 120, 162, 160.20000000000002, 162.0, 162.0, 0.03239800298709588, 3.7247357588503243, 0.004524330495268272], "isController": false}, {"data": ["Shop Pelotonia Sale", 10, 0, 0.0, 231.89999999999998, 123, 442, 432.40000000000003, 442.0, 442.0, 0.032385726962413125, 4.1622490510981995, 0.004522616167602614], "isController": false}, {"data": ["Pulll.org in Google Play", 10, 0, 0.0, 451.4, 363, 567, 564.3, 567.0, 567.0, 0.03241816843831957, 14.070045455337489, 0.00509699718610298], "isController": false}, {"data": ["Pelotonia.org Ride Safety", 10, 0, 0.0, 837.3, 716, 1740, 1642.4000000000003, 1740.0, 1740.0, 0.0322199202879172, 1.867465321297045, 0.00402749003598965], "isController": false}, {"data": ["YourPelotonia.org Donate to Participant", 10, 0, 0.0, 110.2, 61, 283, 282.8, 283.0, 283.0, 0.03240461700983156, 1.668679550337332, 0.004778415203598209], "isController": false}, {"data": ["YourPelotonia.org Volunteer Profiles", 10, 0, 0.0, 438.1, 288, 555, 554.3, 555.0, 555.0, 0.03235198964736331, 3.412187095600129, 0.005339342041410546], "isController": false}, {"data": ["Pelotonia.org About News", 10, 0, 0.0, 479.29999999999995, 471, 494, 493.4, 494.0, 494.0, 0.03227305587111432, 1.4343545368655117, 0.003813515391020345], "isController": false}, {"data": ["Pulll.org How it Works", 10, 0, 0.0, 55.4, 49, 62, 61.8, 62.0, 62.0, 0.032413860166607245, 0.40030800764156754, 0.003925115879550096], "isController": false}, {"data": ["Pelotonia.org Fundraising Tips", 10, 0, 0.0, 847.8000000000001, 783, 976, 975.3, 976.0, 976.0, 0.03225848075459038, 1.4595702444547674, 0.004189822207383322], "isController": false}, {"data": ["Shop Pelotonia Home Page", 10, 0, 0.0, 384.1, 226, 893, 850.7000000000002, 893.0, 893.0, 0.03232229203837302, 3.9172818760423938, 0.0037877685982468387], "isController": false}, {"data": ["Shop Pelotonia FAQ", 10, 0, 0.0, 141.8, 113, 270, 257.00000000000006, 270.0, 270.0, 0.032400207361327114, 3.6772083778836184, 0.004081666747667185], "isController": false}, {"data": ["YourPelotonia.org Virtual Registration", 10, 0, 0.0, 565.5999999999999, 398, 1235, 1192.5000000000002, 1235.0, 1235.0, 0.032364659086863506, 4.901886788827072, 0.005436251330996606], "isController": false}, {"data": ["Pelotonia.org About The James", 10, 0, 0.0, 706.7000000000002, 652, 734, 733.4, 734.0, 734.0, 0.03225296646659077, 1.4115019420317434, 0.004157608958583966], "isController": false}, {"data": ["Pelotonia.org Contact Us", 10, 0, 0.0, 666.6999999999999, 646, 733, 728.1, 733.0, 733.0, 0.03222583867745158, 1.466558894734298, 0.004091170925848345], "isController": false}, {"data": ["YourPelotonia.org Rider Profiles", 10, 0, 0.0, 1611.1999999999998, 1359, 2014, 2009.7, 2014.0, 2014.0, 0.03226712012726152, 3.4272471225795624, 0.005199291817381007], "isController": false}, {"data": ["Pelotonia.org Community Classifieds", 10, 0, 0.0, 1341.1000000000001, 830, 2117, 2111.4, 2117.0, 2117.0, 0.032213588980375484, 2.7434495428489054, 0.0040266986225469354], "isController": false}, {"data": ["Pelotonia.org About Pelotonia History", 10, 0, 0.0, 658.9, 638, 715, 710.9, 715.0, 715.0, 0.03225296646659077, 1.3855578321894282, 0.004094614883453906], "isController": false}, {"data": ["YourPelotonia.org Volunteer Registration", 10, 0, 0.0, 549.5999999999999, 421, 855, 838.4000000000001, 855.0, 855.0, 0.032363087956400444, 5.472933181954989, 0.005499196586341482], "isController": false}, {"data": ["Shop Pelotonia Short Sleeve", 10, 0, 0.0, 135.99999999999997, 125, 144, 143.8, 144.0, 144.0, 0.03239810795049569, 4.0660384808527175, 0.004555983930538457], "isController": false}, {"data": ["Pulll.org in iTunes", 10, 0, 0.0, 434.70000000000005, 276, 804, 771.2, 804.0, 804.0, 0.03238237103720734, 5.391784946650044, 0.0048700050192675105], "isController": false}, {"data": ["Pelotonia.org About Jump-Off", 10, 0, 0.0, 661.2, 641, 734, 729.0, 734.0, 734.0, 0.0322222043209976, 1.4194164206367106, 0.003838973561681354], "isController": false}, {"data": ["Shop Pelotonia Men's Under Armour", 10, 0, 0.0, 136.70000000000002, 116, 158, 156.70000000000002, 158.0, 158.0, 0.032399577509509274, 3.6002575057671247, 0.004714391649332892], "isController": false}, {"data": ["Pelotonia.org Ride FAQ", 10, 0, 0.0, 972.3000000000001, 908, 1059, 1057.9, 1059.0, 1059.0, 0.032191189915144025, 2.5872065622143032, 0.003929588612688479], "isController": false}, {"data": ["Pelotonia.org Profile Search Page", 10, 0, 0.0, 918.8, 780, 1320, 1285.1000000000001, 1320.0, 1320.0, 0.0322040448280304, 1.4493644229840268, 0.004874635691742883], "isController": false}, {"data": ["Shop Pelotonia Cycling X-tras", 10, 0, 0.0, 129.8, 119, 146, 145.8, 146.0, 146.0, 0.03239894768217928, 3.6871679360979357, 0.004619381212498218], "isController": false}, {"data": ["YourPelotonia.org Ulman Search", 10, 0, 0.0, 245.0, 177, 511, 507.3, 511.0, 511.0, 0.03239485440132689, 2.0963013984858647, 0.00616894200025268], "isController": false}, {"data": ["Shop Pelotonia Long Sleeve", 10, 0, 0.0, 131.4, 117, 169, 165.5, 169.0, 169.0, 0.03239926259278339, 3.690551276490447, 0.004524506397234399], "isController": false}, {"data": ["Pulll.org Our Roots", 10, 0, 0.0, 50.7, 41, 77, 75.2, 77.0, 77.0, 0.03241554130712429, 0.2627589849802589, 0.0038303520489863657], "isController": false}, {"data": ["Pelotonia.org Community Event Submission", 10, 0, 0.0, 503.5, 487, 523, 522.7, 523.0, 523.0, 0.03227295171643694, 1.8549698429436803, 0.004097152073375783], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 640, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
