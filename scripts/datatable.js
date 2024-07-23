async function get_course_score(course_name) {
    var intervalId = setInterval(function () {
        $.ajax({
            url: `${BASE_URL}/course/${course_name}/`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success === 1) {
                    clearInterval(intervalId);
                    console.log('Success! Stopping the requests.');
                    console.log(response.data);
                    get_pic_data(course_name);
                } else {
                    console.log('Request not successful, trying again...');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX request failed:', error);
            }
        });
    }, 2000);
}


async function get_pic_data(course_name) {
    $.ajax({
        url: `${BASE_URL}/pic_data/${course_name}/`,
        type: 'GET',
        dataType: 'json',
        success: function (rep) {
            console.log(rep);
            if (rep.success) {
                if (rep.msg == '暂无数据') return;
                if (rep.data.filter(item => item !== null).length == 0) return;
                option.legend.data.push(course_name);
                option.series.push({
                    name: course_name,
                    type: 'line',
                    data: rep.data,
                    smooth: true,
                    connectNulls: true
                })
                option.yAxis.min = Math.max(Math.min(option.yAxis.min, Math.min(...rep.data.filter(x => x !== null)) - 5), 0);
                option.yAxis.max = Math.min(Math.max(option.yAxis.max, Math.max(...rep.data) + 5), 100);
                myChart.setOption(option);
                // chart.style.position = 'fixed';
            } else {
                get_course_score(course_name);
            }
        }
    })
}

async function get_teacher_score(teacher_name) {
    var intervalId = setInterval(function () {
        $.ajax({
            url: `${BASE_URL}/teacher/${teacher_name}/`,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.success === 1) {
                    clearInterval(intervalId);
                    console.log('Success! Stopping the requests.');
                    console.log(response.data);
                    get_teacher_course_score(teacher_name);
                } else {
                    console.log('Request not successful, trying again...');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX request failed:', error);
            }
        });
    }, 2000);
}

async function get_course_teacher_score(course_name) {
    $.ajax({
        url: `${BASE_URL}/course_teacher/${course_name}/`,
        type: 'GET',
        dataType: 'json',
        success: function (rep) {
            console.log(rep);
            if (rep.success) {
                if (rep.msg == '暂无数据') return;
                full_option.yAxis.data = rep.data.teacher_semester_list;
                full_option.series[0].data = rep.data.combined_scores_list;
                fullChart.setOption(full_option);
                // chart.style.position = 'fixed';
            } else {
                // get_course_score(course_name);
                alert('暂无数据');
            }
        }
    })
}

async function get_teacher_course_score(teacher_names) {
    console.log(teacher_names.split(' '));
    teacher_names.split(' ').filter((item) => item !== '').forEach(teacher_name => {
        $.ajax({
            url: `${BASE_URL}/teacher_course/${teacher_name}/`,
            type: 'GET',
            dataType: 'json',
            success: function (rep) {
                console.log(rep);
                if (rep.success) {
                    if (rep.msg == '暂无数据') return;
                    let div = document.createElement('div');
                    teacher_modal.show();
                    div.style.width = teacher_charts.innerWidth();
                    div.style.height = '400px';
                    teacher_chart = echarts.init(div);
                    let teacher_option = {
                        title: {
                            text: teacher_name
                        },
                        tooltip: {},
                        legend: {
                            data: rep.data.course_list
                        },
                        xAxis: {
                            data: rep.data.semester_list
                        },
                        yAxis: {
                            min: 100,
                            max: 0,
                        },
                        series: rep.data.score.map((item, index) => {
                            return {
                                name: rep.data.course_list[index],
                                type: 'line',
                                data: item,
                                smooth: true,
                                connectNulls: true
                            }
                        })
                    };
                    teacher_chart.setOption(teacher_option);
                    teacher_charts[0].appendChild(div);
                    
                } else {
                    get_teacher_score(teacher_name);
                    // alert('暂无数据');
                }
            }
        })
    });
}

// 添加搜索按钮
function _add_search_button(iframe) {
    let style = document.createElement('style')
    style.innerHTML = `
        .get-score {
            cursor: pointer;
            border: solid 1px #4e4e4e;
            border-radius: 3px;
            padding: 2px;
        }
        .get-score:hover {
            background-color: #cecece;
            color: white;
        }
        .course-score {
            display: block;
            width: 100%;
            white-space: break-spaces;
            word-wrap: break-word;
        }
        [name=kc] {
            position: relative;
        }
    `
    iframe[0].head.appendChild(style);
    let kc = iframe.find('[name=kc]');
    kc.each((index, element) => {
        let e = $(element);
        if (e.html() == '') return
        let course_name = e.find('a').text().split(']')[1];
        // 添加搜索按钮
        let div1 = document.createElement('span');
        div1.innerHTML = '🔍';
        div1.classList.add('get-score');
        div1.onclick = () => {
            get_course_teacher_score(course_name);
            full_modal.show();
            fullChart.setOption(full_option);
        }
        e.prepend(div1);
        // 添加加入图表
        let div = document.createElement('span')
        div.innerHTML = '✔️'
        div.classList.add('get-score')
        console.log(course_name);
        div.onclick = () => {
            get_pic_data(course_name);
            chart_modal.show();
        };
        e.prepend(div)
    })
    let rkjs = iframe.find('[name=rkjs]');
    rkjs.each((index, element) => {
        let e = $(element);
        if (e.html() == '') return
        let div = document.createElement('span')
        div.innerHTML = '🔍'
        div.classList.add('get-score')
        div.onclick = () => {
            teacher_charts[0].innerHTML = '';
            console.log(e.text().replace('🔍', ''));
            get_teacher_course_score(e.text().replace('🔍', ''));
            teacher_modal.show();
        }
        e.prepend(div)
    })
}