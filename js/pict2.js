
/*
data
{
    "id": xxx,
    "realAns": [],
    "estiAns": [],
    "size": xxx,
    "counter" xxx,
    "ARE": xxx,
    
}
*/
function draw_pict2() {
    const config = {
        barPadding: 0.2,
        margin: { top: 80, left: 80, bottom: 50, right: 80 },
        textColor: 'black',
        gridColor: 'gray',
        tickShowGrid: [60, 120, 180],
        title: '堆叠直方图',
        hoverColor: 'white',
        animateDuration: 1000,
        width: 640,
        height: 500,
        barWidth: 10,
        offsetX: 10,
    };
    const svg = d3.select("#pict2")
        .append("svg")
        .attr("width", config.width)
        .attr("height", config.height);
    const g_estiBars = svg.append("g");
    const g_realBars = svg.append("g");
    const g_axisX = svg.append("g")
        .attr("transform", `translate(${0}, ${config.height - config.margin.bottom})`)
    const g_axisY = svg.append("g")
        .attr('transform', `translate(${config.margin.left}, ${0})`)

    let scale_x = null;
    let scale_y = null;

    return (data) => {
        let [esti_hist, real_hist] = process_data(data);
        draw_graph(esti_hist, real_hist);
    }
    function process_data(data) {
        let hist_num = data[0]["realAns"].length;
        let esti_hist = new Array(hist_num).fill(0)
        let real_hist = new Array(hist_num).fill(0)
        data.forEach((ele) => {
            ele["estiAns"].forEach((item, index) => {
                esti_hist[index] += item;
            });
            ele["realAns"].forEach((item, index) => {
                real_hist[index] += item;
            });
        });
        let num = data.length;
        esti_hist.forEach((item, index, array) => {
            array[index] = item / num;
        });
        real_hist.forEach((item, index, array) => {
            array[index] = item / num;
        });
        return [esti_hist, real_hist];
    }
    function draw_graph(esti_hist, real_hist) {
        let hist_num = esti_hist.length;
        scale_x = d3.scaleBand()
            .domain(Array.from({ length: hist_num }).map((v, k) => k))//生成元素是0到hist_num-1的数组
            .range([config.margin.left, config.width - config.margin.right])
            .padding(config.barPadding);
        scale_y = d3.scaleLinear()
            .domain([0, d3.max([d3.max(esti_hist), d3.max(esti_hist)])])
            .range([config.height - config.margin.bottom, config.margin.top])

        const esti_bars = g_estiBars
            .selectAll("rect")
            .data(esti_hist)
            .join((enter) => {
                return enter.append("rect")
            },
                (update) => {
                    update.selectAll("rect").remove()
                    return update;
                },
                (exit) => {
                    exit.selectAll("rect").remove()
                    exit.remove();
                }
            )
            .attr("x", (d, idx) => {
                return scale_x(idx);
            })
            .attr("y", (d) => {
                return scale_y(d);
            })
            .attr("width", config.barWidth)
            .attr("height", (d) => {
                return config.height - config.margin.bottom - scale_y(d);
            })
            .attr("fill", color_set[4])

        const real_bars = g_realBars
            .selectAll("rect")
            .data(real_hist)
            .join((enter) => {
                return enter.append("rect")
            },
                (update) => {
                    update.selectAll("rect").remove()
                    return update;
                },
                (exit) => {
                    exit.selectAll("rect").remove()
                    exit.remove();
                }
            )
            .attr("x", (d, idx) => {
                return scale_x(idx) + config.offsetX;
            })
            .attr("y", (d) => {
                return scale_y(d);
            })
            .attr("width", config.barWidth)
            .attr("height", (d) => {
                return config.height - config.margin.bottom - scale_y(d);
            })
            .attr("fill", color_set[6])

        const axis_left = d3.axisLeft(scale_y);
        g_axisY
            .call(axis_left);

        const axis_bottom = d3.axisBottom(scale_x);
        // svg.append("g")
        g_axisX
            .call(axis_bottom)
    }
}