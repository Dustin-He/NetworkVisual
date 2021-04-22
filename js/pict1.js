/*
data
[{
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
}]
*/
let draw_scatter = draw_pict1();

function draw_pict1() {
    const config = {
        barPadding: 0.2,
        margin: { top: 80, left: 100, bottom: 50, right: 10 },
        width: width / 2,
        height: 500,
        r: 2,
        color: color_set[0],
        title: "散点图",
        xAttr: "counter num",
        yAttr: "size"
    }
    const svg = d3.select("#pict1")
        .append("svg")
        .attr("width", config.width)
        .attr("height", config.height)
    const g_axisX = svg.append("g")
        .attr("transform", `translate(${0}, ${config.height - config.margin.bottom})`)
    const g_axisY = svg.append("g")
        .attr("transform", `translate(${config.margin.left}, ${0})`)
    const g_circle = svg.append("g").attr("id", "g_circle")
    const g_text = svg.append("g")

    let scale_x = null;
    let scale_y = null;
    return (data, max_size = 0) => {
        // const svg
        draw_axis(data, max_size)
        draw_circle(data)
        g_text
            .append("text")
            .attr("x", config.width / 2)
            .attr("y", config.margin.top / 2)
            .text("flow num: " + data.length)
    }
    function draw_axis(data, max_size) {
        if (max_size != 0) {

            max_size = d3.min([max_size, d3.max(data.map(d => d["size"]))]);
        } else {
            max_size = d3.max(data.map(d => d["size"]))
        }
        scale_x = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d["counter"]))])
            .range([config.margin.left, config.width - config.margin.right]);

        scale_y = d3.scaleLinear()
            .domain([0, max_size])
            .range([config.height - config.margin.bottom, config.margin.top]);
        // draw axis
        let axis_x = d3.axisBottom()
            .scale(scale_x)
        g_axisX
            .call(axis_x)
            .attr("font-size", "0.6rem")

        let axis_y = d3.axisLeft()
            .scale(scale_y)
        g_axisY
            .call(axis_y)
            .attr("font-size", "0.6rem")
    }
    function draw_circle(data) {
        let max_ARE = d3.max(data.map(d => d["ARE"]));

        g_circle.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => {
                let num = scale_x(d["counter"]) + Math.random() - 0.5
                // console.log(num)
                return scale_x(d["counter"] + Math.random() / 2 - 0.25);
            })
            .attr("cy", (d) => {
                return scale_y(d["size"]);
            })
            .attr("r", (d) => {
                return 2 + d["ARE"] / max_ARE * 2;
            })
            .attr("fill", color_set[4])
            .classed("ht", (d) => {
                if (!d["htAns"]) {
                    return false;
                }
                return true;
            })
            .classed("hcm", (d) => {
                if (!d["hcmAns"]) {
                    return false;
                }
                return true;
            })
            .classed("lcm", (d) => {
                if (!d["lcmAns"]) {
                    return false;
                }
                return true;
            })
            .classed("flt", (d) => {
                if (!d["fltAns"]) {
                    return false;
                }
                return true;
            })
            .on("mouseover", function (event, d) {
                draw_hist([d]);//画出它的直方图
                console.log(d)
                d3.select(this)
                    .attr("stroke", "red")
                    .attr("stroke-width", 1)

            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .attr("stroke", null)
                    .attr("stroke-width", null)
            })

    }
}
