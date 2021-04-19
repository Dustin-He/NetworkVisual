/*
data
[{
    "id": xxx,
    "realAns": [],
    "estiAns": [],
    "size": xxx,
    "counter" xxx,
    "ARE": xxx,
    
}]
*/
function draw_pict1(data) {
    const config = {
        barPadding: 0.2,
        margin: { top: 80, left: 80, bottom: 50, right: 80 },
        width: 640,
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
    const g_circle = svg.append("g")

    let scale_x = null;
    let scale_y = null;
    return () => {
        // const svg
        draw_axis(data)
        draw_circle(data)
    }
    function draw_axis(data) {
        scale_x = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d["counter"]))])
            .range([config.margin.left, config.width - config.margin.right]);

        scale_y = d3.scaleLinear()
            .domain([0, d3.max(data.map(d => d["size"]))])
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
                return scale_x(d["counter"]);
            })
            .attr("cy", (d) => {
                return scale_y(d["size"]);
            })
            .attr("r", (d) => {
                return 1 + d["ARE"] / max_ARE * 2;
            })
            .attr("fill", color_set[0])
            .on("mouseover", (event, d) => {

            })

    }
}
