<template>
    <div class="main" ref="chartVisit"></div>
</template>
<script setup>

    import { ref, reactive, onMounted } from "vue";
    // 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
    import * as echarts from "echarts/core";
    // 引入柱状图图表，图表后缀都为 Chart
    import { BarChart } from "echarts/charts";
    // 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
    import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent } from "echarts/components";
    // 标签自动布局、全局过渡动画等特性
    import { LabelLayout, UniversalTransition } from "echarts/features";
    // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
    import { CanvasRenderer } from "echarts/renderers";

    // 注册必须的组件
    echarts.use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        BarChart,
        LabelLayout,
        UniversalTransition,
        CanvasRenderer,
    ]);

    // 创建echarts容器
    const chartVisit = ref(null);

    // 指定图表的配置项和数据
    const option = reactive({
        color: ['#2378F7'],
        // 提示框组件
        tooltip: {},
        // x 轴
        xAxis: {
            data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        },
        // y 轴
        yAxis: {},
        // 系列列表
        series: [
            {
                // 该系列表示的信息
                name: "销量",
                // 图标类型
                type: "bar",
                // 该 data 中数组长度要与 xAxis 中的 data 中的数组长度一致
                data: [1199, 500, 1000, 1500, 2500, 4500, 5000, 6500, 7500, 9000,6700,4050],
            },
        ],
    });

    // echarts初始化函数
    const init = () => {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(chartVisit.value);
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        //监听页面的 resize 事件获取浏览器大小改变的事件，调用 echartsInstance.resize 改变图表的大小
        window.addEventListener("resize", () => {
            // 调用 echartsInstance.resize 改变图表的大小
            myChart.resize();
        });
    };

    // 页面加载完成时，初始化echarts实例
    onMounted(() => {
        init();
    });
</script>

<style lang="scss" scoped>
    .main {
        width: 100%;
        height: 400px;
    }
</style>
