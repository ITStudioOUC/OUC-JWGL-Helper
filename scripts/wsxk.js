let chart_modal = null;
let myChart = null;
let fullChart = null;
let full_modal = null;
let teacher_modal = null;
let teacher_charts = null;
let option = {
    title: {
        text: '分数总览'
    },
    tooltip: {},
    legend: {
        data: []
    },
    xAxis: {
        data: ['2020秋', '2021春', '2021夏', '2021秋', '2022春', '2022夏', '2022秋', '2023春', '2023夏']
    },
    yAxis: {
        min: 100,
        max: 0,
        axisLabel:{
            formatter: function(value, index){
                return value.toFixed(2);
            }
        }
    },
    series: []
};

let full_option = {
    xAxis: {
        type: "value",
    },
    yAxis: {
        type: "category",
        data: ["ss","ss1","ss2"],
    },
    series: [
        {
            data: [1,2,3],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
                color: "rgba(180, 180, 180, 0.2)",
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{c}' // 使用 {c} 显示数值
            }
        },
    ]
}

function init_echart() {
    let div = document.createElement("div");
    div.innerHTML = `
        <style>
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                bottom: 0;
                right: 0;
            }
            /* 模态框内容样式 */
            .modal-content {
                background-color: #fefefe;
                padding: 20px;
                border: 1px solid #888;
                width: 1200px;
                height: 600px;
            }

            /* 关闭按钮样式 */
            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                z-index: 999;
            }

            .close:hover,
            .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            }
        </style>
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="chart" style="height: 600px;width: 1160px;"></div>
            </div>
        </div>
    `;
    document.body.prepend(div);
    let chart = $("#chart")[0];
    myChart = echarts.init(chart);
    myChart.setOption(option);
    var modal = $(".modal");
    chart_modal = modal;
    // 点击 <span> (x), 关闭模态框
    modal.find(".close").click(function () {
        modal.hide();
    });

    // 拖动功能
    var modalHeader = modal.find(".modal-content");
    modalHeader.on("mousedown", function (e) {
        var $drag = $(this).addClass("draggable"),
            dragX = e.clientX - $drag.offset().left,
            dragY = e.clientY - $drag.offset().top;

        $(document)
            .on("mousemove", function (e) {
                $(".draggable")
                    .offset({
                        top: e.clientY - dragY,
                        left: e.clientX - dragX,
                    })
                    .on("mouseup", function () {
                        $(this).removeClass("draggable");
                    });
            })
            .on("mouseup", function () {
                $(this).off("mousemove");
            });
    });
    return myChart;
}

function add_search_button() {
    var iframe = $("#frmReport");
    iframe.on('load', () => {
        _add_search_button(iframe.contents());
    });
}

function init_full_screen_result_modal() {
    let div = document.createElement("div");
    div.innerHTML = `
    <style>
      .full-modal {
        /* display: none; /* 默认隐藏 */
        position: fixed; /* 固定位置 */
        z-index: 999; /* 位于最上层 */
        left: 0;
        top: 0;
        width: 100%; /* 全宽 */
        height: 100%; /* 全高 */
        overflow: hidden; /* 如果内容溢出，则显示滚动条 */
        background-color: rgb(0, 0, 0); /* 背景色 */
        background-color: rgba(0, 0, 0, 0.4); /* 半透明 */
      }

      /* 模态框内容样式 */
      .full-modal-content {
        background-color: #fefefe;
        margin: 5% auto; /* 上下左右居中 */
        padding: 20px;
        border: 1px solid #888;
        width: 100%; /* 初始宽度 */
        max-width: 2000px; /* 最大宽度 */
        height: 80%; /* 初始高度 */
        max-height: 900px; /* 最大高度 */
      }
    </style>
    <div class="full-modal">
      <div class="full-modal-content">
        <div style="display:flex;flex:1;align-items:center;justify-content:space-between;padding: 20px;">
            <h2 style="font-size: large;">如果选择的课程中没有老师，请先点击查询老师</h2>
            <span class="close">&times;</span>
        </div>
        <div id="full-chart" style="height: 100%;width: calc(100% - 40px);"></div>
      </div>
    </div>
    `;
    document.body.prepend(div);
    full_modal = $(".full-modal");

    let chart = $("#full-chart")[0];
    fullChart = echarts.init(chart);
    let modal = $(".full-modal");
    modal.find(".close").click(function () {
        modal.hide();
    });
    fullChart.setOption(full_option);
    modal.hide();
}

function init_teacher_modal(){
    let div = document.createElement("div");
    div.innerHTML = `
    <style>
      .teacher-modal {
        /* display: none; /* 默认隐藏 */
        position: fixed; /* 固定位置 */
        z-index: 999; /* 位于最上层 */
        left: 0;
        top: 0;
        width: 100%; /* 全宽 */
        height: 100%; /* 全高 */
        overflow: auto; /* 如果内容溢出，则显示滚动条 */
        background-color: rgb(0, 0, 0); /* 背景色 */
        background-color: rgba(0, 0, 0, 0.4); /* 半透明 */
      }

      /* 模态框内容样式 */
      .teacher-modal-content {
        background-color: #fefefe;
        margin: 5% auto; /* 上下左右居中 */
        padding: 20px;
        border: 1px solid #888;
        width: 100%; /* 初始宽度 */
        max-width: 2000px; /* 最大宽度 */
        height: 90%; /* 初始高度 */
        max-height: 900px; /* 最大高度 */
      }
    </style>
    <div class="teacher-modal">
      <div class="teacher-modal-content">
        <div style="display:flex;flex:1;align-items:center;justify-content:space-between;padding: 20px;">
            <h2 style="font-size: large;">老师详细</h2>
            <span class="close">&times;</span>
        </div>
        <div id="teacher-charts" style="width:100%">

        </div>
      </div>
    </div>
    `;
    document.body.prepend(div);
    teacher_modal = $(".teacher-modal");
    teacher_charts = $("#teacher-charts");
    teacher_modal.find(".close").click(function () {
        teacher_modal.hide();
    });
    teacher_modal.hide();
}

function wsxk() {
    init_echart();
    add_search_button();
    init_full_screen_result_modal();
    init_teacher_modal();
}