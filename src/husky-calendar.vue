<template>
  <div :style="{ width: width + 'px' }">
    <div class="hc-header">
      <div class="hc-prev-month left" @click="prevMonth">
        <Icon type="ios-arrow-thin-left" size="40" />
      </div>
      <div class="hc-next-month left" @click="nextMonth">
        <Icon type="ios-arrow-thin-right" size="40" />
      </div>
      <div class="hc-current-month left">
        {{ `${year}-${month}` }}
      </div>
    </div>

    <div class="hc-body">
      <transition :name="transitionDirection" @after-enter="inDateChanging = false">
        <div :key="`${year}-${month}`">
          <div class="hc-row-fluid hc-row-head">
            <div class="hc-cell">
              <span class="week-name">Sunday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Monday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Tuesday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Wednesday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Thursday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Friday</span>
            </div>
            <div class="hc-cell">
              <span class="week-name">Saturday</span>
            </div>
          </div>

          <div class="hc-month-box">
            <div class="hc-row-fluid" v-for="week of dayList">
              <div class="hc-cell" v-for="day of week">
                <div v-if="day.inMonth" class="hc-month-day hc-inmonth" :style="acitveDayContextList[day.date-1].styles.container">
                  <Tooltip
                    class="hc-tooltip"
                    :content="acitveDayContextList[day.date-1].content"
                    placement="right"
                    :transfer="true"
                    :disabled="acitveDayContextList[day.date-1].content === null">
                    <span class="hc-day" :style="acitveDayContextList[day.date-1].styles.content">{{ day.date }}</span>
                  </Tooltip>
                </div>
                <div v-else class="hc-month-day hc-outmonth">
                  <span class="hc-day">{{ day.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
const date = new Date();

export default {
  name: 'HuskyCalendar',

  props: ['width', 'grades', 'dataSource'],

  data() {
    return {
      date,
      inDateChanging: false,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      transitionDirection: ''
    };
  },

  computed: {
    dayList() {
      let year = this.year;
      let monthNum = this.month - 1;
      let firstDayOfMonth = new Date(year, monthNum, 1).getDay();
      let dayCountOfMonth = new Date(year, monthNum + 1, 0).getDate();
      let list = [];
      let week;

      week = [];
      if (firstDayOfMonth > 0) {
        let dayCountOfLastMonth = new Date(year, monthNum, 0).getDate();
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
          week.push({
            inMonth: false,
            date: dayCountOfLastMonth - i
          });
        }
      }

      for (let i = 1; i <= dayCountOfMonth; i++) {
        if (week.length === 7) {
          list.push(week);
          week = [];
        }

        week.push({
          inMonth: true,
          date: i
        });
      }

      let leftDays = 7 - week.length;
      if (leftDays) {
        for (let i = 1; i <= leftDays; i++) {
          week.push({
            inMonth: false,
            date: i
          });
        }
      }

      list.push(week);

      let startDay = leftDays;
      while (list.length < 6) {
        week = [];
        for (let i = 1; i <= 7; i++) {
          week.push({
            inMonth: false,
            date: i + startDay
          });
        }

        list.push(week);
        startDay += 7;
      }

      return list;
    },

    // TODO: need a better name
    acitveDayContextList() {
      let list = [];

      if (!this.inDateChanging && this.dataSource && this.dataSource.date === this.date) {
        for (let val of this.dataSource.entries) {
          let styles = {
            container: null,
            content: null
          };

          for (let level of this.grades) {
            let range = level.range;

            if (
              (isNaN(range[0]) || val >= range[0]) &&
              (isNaN(range[1]) || val <= range[1])
            ) {
              styles = {
                container: {
                  backgroundColor: level.bgColor,
                  transition: `background-color ${Math.floor(300 + Math.random() * 700)}ms ease-in`,
                  transitionDelay: `${Math.floor(Math.random() * 400)}ms`
                },
                content: { color: level.fontColor },
              };
            }
          }

          list.push({
            styles,
            content: val,
          });
        }
      } else {
        // TODO: should not calculate every time
        for (let i = 1; i < 32; i++) {
          list.push({
            styles: { container: null, content: null },
            content: null
          });
        }
      }

      return list;
    }
  },

  methods: {
    prevMonth() {
      let date = new Date(this.year, this.month - 2);

      this.date = date;
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;

      this.inDateChanging = true;
      this.transitionDirection = "left";

      this.$nextTick(() => {
        this.$emit("date-change", date);
      });
    },

    nextMonth() {
      let date = new Date(this.year, this.month);

      this.date = date;
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;

      this.inDateChanging = true;
      this.transitionDirection = "right";

      this.$nextTick(() => {
        this.$emit("date-change", date);
      });
    },
  }
};
</script>

<style lang="scss">
.hc-header {
  &:after {
    display: table;
    content: "";
    line-height: 0;
    clear: both;
  }

  .left {
    float: left;
    margin: 0 4px;
  }

  .hc-current-month {
    font-size: 30px;
    line-height: 40px;
    margin-left: 20px;
  }

  .hc-prev-month:hover,
  .hc-next-month:hover {
    cursor: pointer;
  }
}

.hc-body {
  position: relative;

  & > div {
    position: absolute;
    width: 100%;
  }

  .left-enter-to, .right-enter-to {
    opacity: 1;
  }

  .left-leave-to,
  .left-enter,
  .right-leave-to,
  .right.enter {
    opacity: 0;
  }

  .left-leave-to, .right-enter {
    transform: translateX(150px);
  }

  .left-enter, .right-leave-to {
    transform: translateX(-150px);
  }

  .left-leave, .right-leave {
    opacity: 1;
  }

  .left-enter-active,
  .left-leave-active,
  .right-enter-active,
  .right-leave-active {
    transition: all 0.4s ease;
  }
}

.hc-month-box {
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  border-left: 1px solid #e1e1e1;
  border-radius: 2px;
}

.hc-row-head {
  .week-name {
    margin-left: 4px;
    font-size: 16px;
  }
}

.hc-row-fluid {
  width: 100%;
  border-bottom: 1px solid #e1e1e1;
  margin-left: 0px;
  margin-right: 0px;

  &:before,
  &:after {
    display: table;
    content: "";
    line-height: 0;
  }

  &:after {
    clear: both;
  }

  .hc-cell {
    width: 14.285714285714285%;
    display: block;
    float: left;
    box-sizing: border-box;
    border-right: 1px solid #e1e1e1;
    user-select: none;

    &:last-child {
      border-right: 0px;
    }
  }
}

.hc-inmonth {
  transition: transform 150ms;

  // &:hover {
  //   transform: scale(1.05, 1.05);
  //   box-shadow: 0 0 4px #9e9e9e;
  //   background-color: #eeeeee;
  // }
}

.hc-month-day {
  height: 80px;
}

.hc-outmonth {
  background-color: #eeeeee;
}

.hc-day {
  float: right;
  margin-top: 15px;
  margin-right: 15px;
  font-size: 25px;
  color: #777;
}

.hc-outmonth .hc-day {
  color: #e0e0e0;
}

.hc-tooltip {
  width: 100%;
  height: 100%;

  & > div:first-child {
    width: 100%;
    height: 100%;
  }
}
</style>
