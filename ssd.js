/**
 * Created by mik on 10/21/15.
 */




var halftime=24,
    totaltime=24*30,
    dosage=20,
    dosage_delay=24;
var data;
var chart;

function update_data() {
    dosage = parseFloat(document.getElementById('dosage').value);
    halftime = parseFloat(document.getElementById('halftime').value);
    dosage_delay = parseFloat(document.getElementById('delay').value);
    totaltime = parseFloat(document.getElementById('chartwidth').value)*24;

    data = [dosage];
    for(i=1; i<totaltime; i++) {
        data.push(data[data.length-1]*Math.pow(2,-1/halftime))
        if(i%dosage_delay == 0) {
            data[data.length-1] += dosage;
        }
    }

    steadydata = data.slice(-37,-1);
    document.getElementById('mean').innerHTML = d3.format('.2f')(d3.mean(steadydata));
    document.getElementById('stddev').innerHTML = d3.format('.2f')(d3.deviation(steadydata));
    document.getElementById('range').innerHTML =
        d3.format('.2f')(d3.min(steadydata))+' - '+d3.format('.2f')(d3.max(steadydata));
}

function change_data() {
    console.log("changing data");
    update_data();
    load_data();
}

function load_data() {
    chart.destroy();
    chart = c3.generate({
            bindto: '#graph',
            tooltip: {
                format: {
                    value: d3.format('.2f'),
                    title: function(value, ratio, id) {
                        var days = Math.floor(value),
                            hours = Math.floor((value-days)*24);
                        return d3.format('d')(days) + 'd' + d3.format('d')(hours) + 'h';
                    }
                }
            },
            data: {
                x: 'x',
                columns: [
                    ['x'].concat(d3.range(0,data.length/24,1/24)),
                    ['concentration'].concat(data)
                ]
            },
            axis: {
                x: {
                    tick: {
                        values: d3.range(0,data.length / 24,1),
                    }
                }
            },
        }
    );
    chart.flush();
}

window.onload = function() {
    update_data();
    chart = c3.generate({
        bindto: '#graph',
        tooltip: {
            format: {
                value: d3.format('.2f'),
                title: function(value, ratio, id) {
                    var days = Math.floor(value),
                        hours = Math.floor((value-days)*24);
                    return d3.format('d')(days) + 'd' + d3.format('d')(hours) + 'h';
                }
            }
        },
        data: {
            x: 'x',
            columns: [
                ['x'].concat(d3.range(0,data.length/24,1/24)),
                ['concentration'].concat(data)
            ]
        },
        axis: {
            x: {
                tick: {
                    values: d3.range(0,data.length / 24,1),
                }
            }
        },
    });
    load_data();
};