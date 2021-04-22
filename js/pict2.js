
/*
data
{
    "id": xxx,
    "realAns": [],
    "estiAns": [],
    "size": xxx,
    "counter" xxx,
    "ARE": xxx,
    "realAns": ,
    "estiAns": undefined,
    "htAns": undefined,
    "fltAns": undefined,
    "hcmAns": undefined,
    "lcmAns": undefined,
    
}
*/
let draw_hist = draw_pict2();
function draw_pict2() {
    const config = {
        barPadding: 0.2,
        margin: { top: 80, left: 50, bottom: 50, right: 70 },
        textColor: 'black',
        gridColor: 'gray',
        tickShowGrid: [60, 120, 180],
        title: '堆叠直方图',
        hoverColor: 'white',
        animateDuration: 1000,
        width: width / 2,
        height: 500,
        barWidth: 10,
        offsetX: 10,

    };
    const svg = d3.select("#pict2")
        .append("svg")
        .attr("width", config.width)
        .attr("height", config.height);
    // const g_estiBars = svg.append("g");
    const g_realBars = svg.append("g");
    const g_hcmBars = svg.append("g");
    const g_lcmBars = svg.append("g");
    const g_htBars = svg.append("g");
    const g_fltBars = svg.append("g");
    const g_axisX = svg.append("g")
        .attr("transform", `translate(${0}, ${config.height - config.margin.bottom})`)
    const g_axisY = svg.append("g")
        .attr('transform', `translate(${config.margin.left}, ${0})`)

    let scale_x = null;
    let scale_y = null;
    const color_map = {
        "lcm": 0,
        "hcm": 1,
        "flt": 2,
        "ht": 3,
        "real": 4
    };
    return (data) => {
        // let [esti_hist, real_hist] = process_data(data);
        let hist = process_data(data);
        let hist_num = hist["real"].length
        draw_axis(hist)
        draw_bar(g_realBars, hist["real"], config.offsetX, Array(hist_num).fill(0), color_set[4])
        let total_height = Array(hist_num).fill(0);
        // console.log(total_height)
        console.log(hist)
        draw_bar(g_lcmBars, hist["lcm"], 0, total_height, color_set[0]);
        draw_bar(g_hcmBars, hist["hcm"], 0, total_height, color_set[1]);
        draw_bar(g_fltBars, hist["flt"], 0, total_height, color_set[2]);
        draw_bar(g_htBars, hist["ht"], 0, total_height, color_set[3]);
        draw_label()
        // draw_bar(g_hcmBars)
    }
    function process_data(data) {
        let hist_num = data[0]["realAns"].length;
        let esti_hist = new Array(hist_num).fill(0)
        let real_hist = new Array(hist_num).fill(0)
        let hist = {
            "real": new Array(hist_num).fill(0),
            "esti": new Array(hist_num).fill(0),
            "hcm": new Array(hist_num).fill(0),
            "lcm": new Array(hist_num).fill(0),
            "ht": new Array(hist_num).fill(0),
            "flt": new Array(hist_num).fill(0)
        }
        // 构造每一个部分的直方图数组
        data.forEach((ele) => {
            ele["realAns"].forEach((item, index) => {
                hist["real"][index] += item;
            });
            ele["estiAns"].forEach((item, index) => {
                hist["esti"][index] += item;
            });
            if (ele["htAns"]) {
                ele["htAns"].forEach((item, index) => {
                    hist["ht"][index] += item;
                })
            }
            if (ele["fltAns"]) {
                ele["fltAns"].forEach((item, index) => {
                    hist["flt"][index] += item;
                })
            }
            if (ele["hcmAns"]) {
                ele["hcmAns"].forEach((item, index) => {
                    hist["hcm"][index] += item;
                })
            }
            if (ele["lcmAns"]) {
                ele["lcmAns"].forEach((item, index) => {
                    hist["lcm"][index] += item;
                })
            }
        });
        // 取平均
        let num = data.length;
        for (let key in hist) {
            hist[key].forEach((item, index, array) => {
                array[index] = item / num;
            })
        }
        return hist;
    }
    function draw_axis(hist) {
        let hist_num = hist["real"].length;

        scale_x = d3.scaleBand()
            .domain(Array.from({ length: hist_num }).map((v, k) => k))//生成元素是0到hist_num-1的数组
            .range([config.margin.left, config.width - config.margin.right])
            .padding(config.barPadding);
        scale_y = d3.scaleLinear()
            .domain([0, d3.max([d3.max(hist["real"]), d3.max(hist["esti"])])])
            .range([config.height - config.margin.bottom - config.margin.top, 0])
        let axis_y = d3.axisLeft(scale_y)
        g_axisY
            .call(axis_y)
            .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`)
            .attr("font-size", "0.6rem")


        let axis_x = d3.axisBottom(scale_x)
        g_axisX
            .call(axis_x)
            .attr("font-size", "0.6rem")
    }
    function draw_bar(g_bar, data, offsetX, total_height, color) {

        g_bar.selectAll("rect")
            .data(data)
            .join((enter) => {
                return enter.append("rect");
            },
                (update) => {
                    update.selectAll("rect")
                        .remove();
                    return update;
                }, (exit) => {
                    exit.selectAll("rect")
                        .remove();
                }
            )
            .attr("x", (d, idx) => {
                return scale_x(idx) + offsetX;
            })
            .attr("y", (d, idx) => {
                // console.log("y: ", scale_y(total_height[idx]))

                return scale_y(total_height[idx] + d) + config.margin.top;
            })
            .attr("width", config.barWidth)
            .attr("height", (d, idx) => {
                // let height = config.height - config.margin.bottom - scale_y(d + total_height[idx]);
                let height = scale_y(total_height[idx]) - scale_y(total_height[idx] + d);
                total_height[idx] = total_height[idx] + d;
                return height;
            })
            .attr("fill", color)

    }
    function draw_label() {
        let name = ["lcm", "hcm", "flt", "ht", "real"]
        svg.append("g")
            .selectAll("rect")
            .data(name)
            .join("rect")
            .attr("x", 0
            )
            .attr("y", (d, idx) => {
                return config.height / 2 + idx * 30;
            })
            .attr("width", 10)
            .attr("height", 16)
            .attr("fill", (d, idx) => {
                return color_set[idx];
            })
            .on("click", (event, d) => {
                if (d === "real") {
                    d3.select("#pict1")
                        .selectAll("circle")
                        .attr("fill", color_set[color_map["real"]])
                    return
                }
                d3.select("#pict1")
                    .selectAll("." + d)
                    .attr("fill", color_set[color_map[d]])

            })
            .on("dblclick", (event, d) => {
                d3.select("#pict1")
                    .selectAll("." + d)
                    .attr("fill", color_set[color_map["real"]])
            })


        svg.append("g")
            .selectAll("text")
            .data(name)
            .join("text")
            .text((d) => {
                return d;
            })
            .attr("x", 0)
            .attr("y", (d, idx) => {
                return config.height / 2 + idx * 30 + 24;
            })
            .attr("text-anchor", "start")
            .attr("font-size", "0.6rem")
    }
}