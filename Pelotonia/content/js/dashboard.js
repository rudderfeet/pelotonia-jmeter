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

    var data = {"OkPercent": 99.84375, "KoPercent": 0.15625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.706875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Pelotonia.org About Leadership"], "isController": false}, {"data": [0.46, 500, 1500, "YourPelotonia.org Rider Registration"], "isController": false}, {"data": [0.49, 500, 1500, "Pelotonia.org Registration Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Extras"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Rider Perks"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Route Specifics"], "isController": false}, {"data": [0.99, 500, 1500, "Shop Pelotonia About Us"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Training Tips"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Virtual Riders"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Partners"], "isController": false}, {"data": [0.97, 500, 1500, "YourPelotonia.org Peloton Profiles"], "isController": false}, {"data": [0.94, 500, 1500, "YourPelotonia.org Ulman Profile"], "isController": false}, {"data": [0.49, 500, 1500, "Pelotonia.org Fundraising High Rollers"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Kids"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Contact Us"], "isController": false}, {"data": [0.85, 500, 1500, "YourPelotonia.org Donate to General Fund"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Volunteer Info"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Cycling Gear"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Fundraising Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Momentum Fund"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Men's Cycling Gear"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org FAQ/Support"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org The Ride Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Community Gallery"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Community Jump-Off"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Profiles Jump-Off"], "isController": false}, {"data": [0.96, 500, 1500, "YourPelotonia.org Team Huntington Profile"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Under Armour"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Donate Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Home Page"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Pulll App Info"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org The Blog"], "isController": false}, {"data": [0.46, 500, 1500, "Pelotonia.org Impact Summary"], "isController": false}, {"data": [0.49, 500, 1500, "Pelotonia.org Community Events"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Women's Collection"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Sale"], "isController": false}, {"data": [0.88, 500, 1500, "Pulll.org in Google Play"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Ride Safety"], "isController": false}, {"data": [1.0, 500, 1500, "YourPelotonia.org Donate to Participant"], "isController": false}, {"data": [0.64, 500, 1500, "YourPelotonia.org Volunteer Profiles"], "isController": false}, {"data": [0.69, 500, 1500, "Pelotonia.org About News"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org How it Works"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Fundraising Tips"], "isController": false}, {"data": [0.99, 500, 1500, "Shop Pelotonia Home Page"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia FAQ"], "isController": false}, {"data": [0.76, 500, 1500, "YourPelotonia.org Virtual Registration"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About The James"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Contact Us"], "isController": false}, {"data": [0.12, 500, 1500, "YourPelotonia.org Rider Profiles"], "isController": false}, {"data": [0.38, 500, 1500, "Pelotonia.org Community Classifieds"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Pelotonia History"], "isController": false}, {"data": [0.71, 500, 1500, "YourPelotonia.org Volunteer Registration"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Short Sleeve"], "isController": false}, {"data": [0.95, 500, 1500, "Pulll.org in iTunes"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org About Jump-Off"], "isController": false}, {"data": [1.0, 500, 1500, "Shop Pelotonia Men's Under Armour"], "isController": false}, {"data": [0.49, 500, 1500, "Pelotonia.org Ride FAQ"], "isController": false}, {"data": [0.5, 500, 1500, "Pelotonia.org Profile Search Page"], "isController": false}, {"data": [0.99, 500, 1500, "Shop Pelotonia Cycling X-tras"], "isController": false}, {"data": [0.96, 500, 1500, "YourPelotonia.org Ulman Search"], "isController": false}, {"data": [0.99, 500, 1500, "Shop Pelotonia Long Sleeve"], "isController": false}, {"data": [1.0, 500, 1500, "Pulll.org Our Roots"], "isController": false}, {"data": [0.59, 500, 1500, "Pelotonia.org Community Event Submission"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 5, 0.15625, 577.5884375000007, 40, 7758, 1005.0, 1174.9499999999998, 1747.9799999999996, 8.307415926354757, 677.5615843994517, 1.1253851103847892], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["Pelotonia.org About Leadership", 50, 0, 0.0, 811.9, 685, 1039, 964.8, 1033.9, 1039.0, 0.14447150877375473, 10.450115206998777, 0.01876436588565369], "isController": false}, {"data": ["YourPelotonia.org Rider Registration", 50, 0, 0.0, 900.9999999999999, 534, 2014, 1475.1, 1907.1999999999994, 2014.0, 0.14494476155137279, 32.98979575290107, 0.02406309517942712], "isController": false}, {"data": ["Pelotonia.org Registration Jump-Off", 50, 0, 0.0, 727.1000000000001, 633, 1905, 861.2999999999998, 949.35, 1905.0, 0.14319057233271762, 6.7426818430774516, 0.017479317911708692], "isController": false}, {"data": ["Shop Pelotonia Extras", 50, 0, 0.0, 140.51999999999998, 113, 323, 173.5, 249.34999999999948, 323.0, 0.14522134637614653, 18.056419446082216, 0.02084720499735697], "isController": false}, {"data": ["Pelotonia.org Ride Rider Perks", 50, 0, 0.0, 746.4400000000002, 636, 1029, 927.9, 988.0999999999998, 1029.0, 0.14338438773432594, 6.510858208433582, 0.018203096099084347], "isController": false}, {"data": ["Pelotonia.org Ride Route Specifics", 50, 0, 0.0, 771.44, 650, 1087, 921.4, 1002.1499999999997, 1087.0, 0.1431688418786043, 6.266956000456709, 0.01775629191267846], "isController": false}, {"data": ["Shop Pelotonia About Us", 50, 0, 0.0, 148.28000000000003, 105, 974, 156.9, 249.84999999999985, 974.0, 0.14484566694187345, 15.420111277683628, 0.01909586429409464], "isController": false}, {"data": ["Pelotonia.org Ride Training Tips", 50, 0, 0.0, 769.48, 685, 1109, 936.6999999999999, 1002.15, 1109.0, 0.14320615671908965, 8.166255568034382, 0.017621070065044236], "isController": false}, {"data": ["Pelotonia.org Virtual Riders", 50, 0, 0.0, 716.98, 646, 867, 774.7, 814.5499999999998, 867.0, 0.1447429365446966, 6.2339058293408405, 0.020213124927628532], "isController": false}, {"data": ["Pelotonia.org About Partners", 50, 0, 0.0, 816.2199999999999, 716, 1121, 985.5999999999999, 1098.7499999999998, 1121.0, 0.14437639503691704, 8.822782283825223, 0.018470027099449348], "isController": false}, {"data": ["YourPelotonia.org Peloton Profiles", 50, 0, 0.0, 296.92000000000013, 202, 716, 430.59999999999997, 597.4499999999997, 716.0, 0.1472342054506103, 15.658587803118419, 0.024011828427980386], "isController": false}, {"data": ["YourPelotonia.org Ulman Profile", 50, 0, 0.0, 251.0400000000001, 121, 888, 623.0999999999999, 793.2999999999998, 888.0, 0.147623701280488, 12.758061222870454, 0.023642858408203155], "isController": false}, {"data": ["Pelotonia.org Fundraising High Rollers", 50, 0, 0.0, 989.6599999999997, 798, 1931, 1155.5, 1281.4499999999996, 1931.0, 0.14458723236903287, 6.583313670975848, 0.019908984144564098], "isController": false}, {"data": ["Shop Pelotonia Kids", 50, 0, 0.0, 135.04, 111, 337, 151.29999999999998, 222.59999999999962, 337.0, 0.14521670689169447, 16.794570252030855, 0.020137473025996694], "isController": false}, {"data": ["Pulll.org Contact Us", 50, 0, 0.0, 46.699999999999996, 40, 69, 56.699999999999996, 63.89999999999999, 69.0, 0.14798591174120224, 1.2969173147216384, 0.01719758154023737], "isController": false}, {"data": ["YourPelotonia.org Donate to General Fund", 50, 0, 0.0, 473.56000000000006, 185, 2557, 1095.7, 1365.0499999999977, 2557.0, 0.14491325492560153, 11.965108194047543, 0.021793594979045545], "isController": false}, {"data": ["Pelotonia.org Ride Volunteer Info", 50, 0, 0.0, 982.1600000000003, 833, 1298, 1152.9, 1255.3, 1298.0, 0.14311720726806426, 7.976581641926472, 0.01830893960167619], "isController": false}, {"data": ["Pelotonia.org Home Page", 50, 0, 0.0, 966.0000000000001, 847, 1271, 1086.0, 1203.3999999999999, 1271.0, 0.14298951028952514, 7.289672260892941, 0.01619803046248527], "isController": false}, {"data": ["Shop Pelotonia Women's Cycling Gear", 50, 0, 0.0, 135.98, 116, 279, 153.8, 199.0499999999997, 279.0, 0.14498174679807813, 16.911234449801523, 0.021379144303232223], "isController": false}, {"data": ["Pelotonia.org Fundraising Jump-Off", 50, 0, 0.0, 688.9000000000001, 624, 917, 774.8, 858.3499999999998, 917.0, 0.14312908812457956, 6.260779409449383, 0.017891136015572445], "isController": false}, {"data": ["Pelotonia.org About Momentum Fund", 50, 0, 0.0, 740.6399999999999, 633, 941, 890.3, 935.8, 941.0, 0.14452370766900602, 6.10533628498919, 0.02032364639095397], "isController": false}, {"data": ["Shop Pelotonia Men's Cycling Gear", 50, 0, 0.0, 133.61999999999998, 113, 182, 167.0, 169.89999999999998, 182.0, 0.14497880409884073, 16.89929289759712, 0.021095548643288352], "isController": false}, {"data": ["Pulll.org FAQ/Support", 50, 0, 0.0, 88.08, 76, 159, 95.0, 98.35, 159.0, 0.14796357728581533, 5.0929496788820465, 0.017194986032238305], "isController": false}, {"data": ["Pelotonia.org The Ride Jump-Off", 50, 0, 0.0, 887.0800000000002, 763, 1131, 1024.7, 1066.35, 1131.0, 0.14297847030194194, 6.859336261770703, 0.016894916900913062], "isController": false}, {"data": ["Pelotonia.org Community Gallery", 50, 0, 0.0, 736.06, 644, 1042, 909.5, 987.5999999999999, 1042.0, 0.14363275975984602, 6.987517752111401, 0.018795693171698602], "isController": false}, {"data": ["Pelotonia.org Community Jump-Off", 50, 0, 0.0, 932.3999999999999, 832, 1190, 1051.0, 1097.3, 1190.0, 0.14305742324969245, 6.49528201088667, 0.017602768876426998], "isController": false}, {"data": ["Pelotonia.org Profiles Jump-Off", 50, 0, 0.0, 951.98, 848, 1161, 1110.2, 1141.1999999999998, 1161.0, 0.1429633441985475, 6.434188164779551, 0.017451580102361752], "isController": false}, {"data": ["YourPelotonia.org Team Huntington Profile", 50, 0, 0.0, 261.12, 144, 662, 476.79999999999995, 553.9, 662.0, 0.1472489479062672, 13.309061645035797, 0.023439041512423396], "isController": false}, {"data": ["Shop Pelotonia Women's Under Armour", 50, 0, 0.0, 140.75999999999996, 106, 359, 175.09999999999997, 327.9, 359.0, 0.14520489863246025, 16.185442696157295, 0.02155385214075582], "isController": false}, {"data": ["Pelotonia.org Donate Jump-Off", 50, 0, 0.0, 780.1599999999999, 690, 1007, 886.5999999999999, 963.1499999999997, 1007.0, 0.14309877536068044, 6.774972390880029, 0.017188622431019235], "isController": false}, {"data": ["Pulll.org Home Page", 50, 0, 0.0, 248.96000000000004, 229, 306, 276.9, 299.59999999999997, 306.0, 0.14785900165602084, 1.0145899869884079, 0.016172078306127276], "isController": false}, {"data": ["Pelotonia.org Pulll App Info", 50, 0, 0.0, 754.94, 661, 1004, 932.1, 975.35, 1004.0, 0.14451159416519987, 7.801819689993728, 0.017217201648588268], "isController": false}, {"data": ["Pelotonia.org The Blog", 50, 0, 0.0, 679.4999999999999, 578, 1011, 868.8, 896.5, 1011.0, 0.14411838460585064, 9.537734989529799, 0.017592576245831375], "isController": false}, {"data": ["Pelotonia.org Impact Summary", 50, 0, 0.0, 1298.2400000000002, 1149, 1801, 1466.5, 1596.0, 1801.0, 0.14437722882346996, 8.76039854431659, 0.017342186665319146], "isController": false}, {"data": ["Pelotonia.org Community Events", 50, 0, 0.0, 836.6799999999998, 651, 1717, 996.3, 1132.1499999999994, 1717.0, 0.14399345693731677, 8.522008072453188, 0.017296089065712852], "isController": false}, {"data": ["Shop Pelotonia Women's Collection", 50, 0, 0.0, 140.54000000000005, 109, 324, 185.29999999999998, 241.94999999999962, 324.0, 0.14511597668856951, 16.6837202503178, 0.020265219400845153], "isController": false}, {"data": ["Shop Pelotonia Sale", 50, 0, 0.0, 168.51999999999998, 114, 393, 321.2, 353.0999999999999, 393.0, 0.1452103807997026, 18.66271324598203, 0.02027840278745847], "isController": false}, {"data": ["Pulll.org in Google Play", 50, 0, 0.0, 453.69999999999993, 326, 892, 530.6, 559.45, 892.0, 0.14805953177653672, 64.23321900207135, 0.023278891226584386], "isController": false}, {"data": ["Pelotonia.org Ride Safety", 50, 0, 0.0, 793.42, 708, 975, 925.1999999999999, 954.7499999999999, 975.0, 0.1431754013206499, 8.29844626054487, 0.017896925165081238], "isController": false}, {"data": ["YourPelotonia.org Donate to Participant", 50, 0, 0.0, 104.33999999999999, 58, 344, 267.4, 299.6999999999999, 344.0, 0.14593469714172302, 7.514924331035347, 0.021519667254297044], "isController": false}, {"data": ["YourPelotonia.org Volunteer Profiles", 50, 0, 0.0, 574.8799999999999, 272, 1386, 793.3, 961.9999999999997, 1386.0, 0.14672437825544712, 15.475123340180472, 0.024215253833174383], "isController": false}, {"data": ["Pelotonia.org About News", 50, 0, 0.0, 543.6, 456, 828, 631.9, 694.7999999999996, 828.0, 0.14443061120146047, 6.419153633910286, 0.017066507768922577], "isController": false}, {"data": ["Pulll.org How it Works", 50, 0, 0.0, 53.25999999999999, 44, 66, 59.9, 62.449999999999996, 66.0, 0.14797014554343516, 1.8273879468328469, 0.01791825981190035], "isController": false}, {"data": ["Pelotonia.org Fundraising Tips", 50, 0, 0.0, 892.14, 776, 1094, 1002.1999999999999, 1036.4999999999998, 1094.0, 0.14471361176232236, 6.5477312975746, 0.01879581090272351], "isController": false}, {"data": ["Shop Pelotonia Home Page", 50, 0, 0.0, 322.76, 207, 728, 353.5, 423.4499999999998, 728.0, 0.14494854326714018, 17.56700755997246, 0.016986157414117988], "isController": false}, {"data": ["Shop Pelotonia FAQ", 50, 0, 0.0, 138.20000000000002, 109, 322, 161.8, 231.89999999999947, 322.0, 0.14489519730379016, 16.444634209357623, 0.018253398879090752], "isController": false}, {"data": ["YourPelotonia.org Virtual Registration", 50, 0, 0.0, 671.98, 389, 1992, 1244.8, 1546.7499999999989, 1992.0, 0.14501959214689902, 21.9643785203506, 0.024358759618424448], "isController": false}, {"data": ["Pelotonia.org About The James", 50, 0, 0.0, 762.7199999999999, 633, 1370, 919.6, 952.5999999999999, 1370.0, 0.14424852289512555, 6.312760503816816, 0.018594536154449778], "isController": false}, {"data": ["Pelotonia.org Contact Us", 50, 0, 0.0, 709.96, 630, 936, 824.2, 866.3499999999999, 936.0, 0.1431422003246465, 6.514228200516457, 0.01817234965058989], "isController": false}, {"data": ["YourPelotonia.org Rider Profiles", 50, 5, 10.0, 2443.1400000000003, 1272, 7758, 5231.499999999998, 7711.8, 7758.0, 0.14451994808843466, 15.350163704971196, 0.023286905697843474], "isController": false}, {"data": ["Pelotonia.org Community Classifieds", 50, 0, 0.0, 1105.3799999999997, 815, 1909, 1685.6, 1791.4499999999994, 1909.0, 0.14366949120886383, 12.235514007236631, 0.017958686401107978], "isController": false}, {"data": ["Pelotonia.org About Pelotonia History", 50, 0, 0.0, 759.2999999999998, 625, 992, 897.6, 971.9, 992.0, 0.14414289750286846, 6.192285972121322, 0.018299391284543845], "isController": false}, {"data": ["YourPelotonia.org Volunteer Registration", 50, 0, 0.0, 727.1400000000003, 360, 1705, 1533.3999999999999, 1577.6999999999998, 1705.0, 0.14533785237162306, 24.578135309903903, 0.024696080383459388], "isController": false}, {"data": ["Shop Pelotonia Short Sleeve", 50, 0, 0.0, 138.45999999999998, 115, 226, 159.0, 179.0999999999999, 226.0, 0.14507766007143624, 18.207597698923234, 0.020401545947545723], "isController": false}, {"data": ["Pulll.org in iTunes", 50, 0, 0.0, 401.4199999999999, 242, 841, 523.6999999999999, 563.9499999999999, 841.0, 0.1478340828521334, 24.589601036464757, 0.022232860116434126], "isController": false}, {"data": ["Pelotonia.org About Jump-Off", 50, 0, 0.0, 706.8199999999998, 626, 1102, 817.1999999999999, 878.1499999999997, 1102.0, 0.14316474253252703, 6.306543921690317, 0.017056736903289352], "isController": false}, {"data": ["Shop Pelotonia Men's Under Armour", 50, 0, 0.0, 151.3800000000001, 106, 386, 268.89999999999986, 316.4, 386.0, 0.14512734924896598, 16.12653971047094, 0.021117163123140558], "isController": false}, {"data": ["Pelotonia.org Ride FAQ", 50, 0, 0.0, 1080.5000000000005, 900, 2397, 1163.7, 1243.35, 2397.0, 0.14304064356846352, 11.496168142309706, 0.01746101606060346], "isController": false}, {"data": ["Pelotonia.org Profile Search Page", 50, 0, 0.0, 966.6800000000001, 780, 1285, 1145.5, 1172.5, 1285.0, 0.14343498092314755, 6.45537536038039, 0.021711349651452997], "isController": false}, {"data": ["Shop Pelotonia Cycling X-tras", 50, 0, 0.0, 159.34000000000006, 111, 514, 288.99999999999994, 371.04999999999995, 514.0, 0.14499225741345412, 16.50077022605743, 0.02067272420152764], "isController": false}, {"data": ["YourPelotonia.org Ulman Search", 50, 0, 0.0, 249.26000000000005, 172, 651, 393.79999999999995, 612.3999999999999, 651.0, 0.14740870242015608, 9.53895532926682, 0.028070993136650818], "isController": false}, {"data": ["Shop Pelotonia Long Sleeve", 50, 0, 0.0, 159.44000000000003, 111, 506, 286.6, 350.39999999999986, 506.0, 0.14508439559291642, 16.526257464592153, 0.02026080915018266], "isController": false}, {"data": ["Pulll.org Our Roots", 50, 0, 0.0, 46.94, 40, 64, 53.9, 56.79999999999998, 64.0, 0.14797408677792345, 1.113672629899052, 0.01748521923840697], "isController": false}, {"data": ["Pelotonia.org Community Event Submission", 50, 0, 0.0, 554.9000000000001, 458, 854, 633.0, 704.4499999999999, 854.0, 0.1441312632240434, 8.284330017533568, 0.018297914276489885], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 7,710 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 20.0, 0.03125], "isController": false}, {"data": ["The operation lasted too long: It took 6,630 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 20.0, 0.03125], "isController": false}, {"data": ["The operation lasted too long: It took 5,332 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 20.0, 0.03125], "isController": false}, {"data": ["The operation lasted too long: It took 7,714 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 20.0, 0.03125], "isController": false}, {"data": ["The operation lasted too long: It took 7,758 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, 20.0, 0.03125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 5, "The operation lasted too long: It took 7,710 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 6,630 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,332 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,714 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,758 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["YourPelotonia.org Rider Profiles", 50, 5, "The operation lasted too long: It took 7,710 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 6,630 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 5,332 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,714 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1, "The operation lasted too long: It took 7,758 milliseconds, but should not have lasted longer than 5,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
