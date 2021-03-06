// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import HuskyCalendar from './husky-calendar.vue';

Vue.use(iView);
Vue.config.productionTip = false;

let template = `<husky-calendar
class="husky-calendar"
:size="{ width: 800, height: 500 }"
:dataSource="expenses"
:grades="grades"
@date-change="getExpenses" />`;

new Vue({
  el: '#app',
  template,
  components: { HuskyCalendar },

  data: {
    grades: [
      {range: [1, 10], bgColor: '#80d8ff', fontColor: '#777' },
      {range: [11, 50], bgColor: '#40c4ff', fontColor: '#777' },
      {range: [51, 100], bgColor: '#00b0ff', fontColor: '#777' },
      {range: [101, NaN], bgColor: '#0091ea', fontColor: '#eee' }
    ],

    expenses: null
  },

  methods: {
    getExpenses(date: Date) {
      let dayCount = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      let entries: any[] = [];
      for (let i = 0; i < dayCount; i++) {
        entries.push(Math.floor(Math.random() * 110));
      }

      setTimeout(() => {
        this.expenses = {date, entries};
      }, 50);
    }
  }
});