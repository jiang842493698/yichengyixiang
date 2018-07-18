const conf = {
	getThisMonthDays(year, month) {
		return new Date(year, month, 0).getDate();
	},
	getFirstDayOfWeek(year, month) {
		return new Date(Date.UTC(year, month - 1, 1)).getDay();
	},
	calculateEmptyGrids(year, month) {
		const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
		let empytGrids = [];
		if (firstDayOfWeek > 0) {
			for (let i = 0; i < firstDayOfWeek; i++) {
				empytGrids.push(i);
			}
			this.setData({
				'calendar.hasEmptyGrid': true,
				'calendar.empytGrids': empytGrids,
			});
		} else {
			this.setData({
				'calendar.hasEmptyGrid': false,
				'calendar.empytGrids': [],
			});
		}
	},
  //显示天数
	calculateDays(year, month,dayc) {
		let days = [];
    let newdate = new Date();
    //判断是否是当前月份
    if (newdate.getFullYear() == year && newdate.getMonth()+1 == month){
      //获得当前月份的最大天数
      const thisMonthDays = conf.getThisMonthDays(year, month);
      //循环当前月份
      for (let i = 1; i <= thisMonthDays; i++) {
          //判断当前月份的天数是否是当前天数
          if (i < newdate.getDate()) {
            //如果小于当前天数isSelecyDay为false就置灰
            days.push({
              isSelecyDay: false,
              day: i,
              choosed: dayc == i ? true : false
            });
          } else {
            //反之则不置灰
            days.push({
              isSelecyDay: true,
              day: i,
              choosed: dayc == i ? true : false
            });
          }
        
        
        
      }

      this.setData({
        'calendar.days': days,
      });
      return
    }else{
      //如果不是当前月的话，则判断月份是否刚满3个月，如果满3个月的话日期就不能超过3个月的今天
      const thisMonthDays = conf.getThisMonthDays(year, month);
      let endMonth = this.data.calendar.curMonth

      for (let i = 1; i <= thisMonthDays; i++) {

        if (endMonth == newdate.getMonth() + 3) {

          if (i >= newdate.getDate()) {
            days.push({
              isSelecyDay: false,
              day: i,
              choosed: dayc == i ? true : false
            });
          } else {
            days.push({
              isSelecyDay: true,
              day: i,
              choosed: dayc == i ? true : false
            });
          }
        } else {
          days.push({
            isSelecyDay: true,
            day: i,
            choosed: dayc == i ? true : false
          });
        }
      }
    }
		this.setData({
			'calendar.days': days,
		});
	},
  /**
   * 增加减少月份
   */
	handleCalendar(e) {
		const handle = e.currentTarget.dataset.handle;
		const curYear = this.data.calendar.curYear;
		const curMonth = this.data.calendar.curMonth;
    let newDate = new Date()
		if (handle === 'prev') {
      if (curMonth <= newDate.getMonth()+1){
        wx.showToast({
          title: '不可预约',
          icon: "loading"
        })
        this.setData({
          'calendar.isSelect': false
        });
      }else{
        let newMonth = curMonth - 1;
        let newYear = curYear;
        if (newMonth < 1) {
          newYear = curYear - 1;
          newMonth = 12;
        }

        conf.calculateDays.call(this, newYear, newMonth);
        conf.calculateEmptyGrids.call(this, newYear, newMonth);
        if (newMonth == newDate.getMonth()+1) {
          this.setData({
            'calendar.isSelect': false
          });
        }
        this.setData({
          'calendar.isyouSelect': true,
          'calendar.curYear': newYear,
          'calendar.curMonth': newMonth,
        });
      }
		} else {
      let newMonth = curMonth + 1;
      let endMonth = newDate.getMonth() + 4
			let newYear = curYear;
			if (newMonth > 12) {
				newYear = curYear + 1;
				newMonth = 1;
			}
      
			conf.calculateDays.call(this, newYear, newMonth);
			conf.calculateEmptyGrids.call(this, newYear, newMonth);
     
			this.setData({
        // 'calendar.isyouSelect': true,
        'calendar.isSelect': true,
				'calendar.curYear': newYear,
				'calendar.curMonth': newMonth
			});
      if (newMonth == newDate.getMonth() + 4) {
        this.setData({
          'calendar.isyouSelect': false,
        })
        return
      }
		}
	},
  /**
   * 选择预约的天数
   */
	tapDayItem(e) {
		const idx = e.currentTarget.dataset.idx;
		const days = this.data.calendar.days;
    let curMonth = this.data.calendar.curMonth
    // console.log(curMonth)
		days[ idx ].choosed = !days[ idx ].choosed;
    //单选
    
    if(this.data.isone)

    for(var i=0;i<days.length;i++){
      if(i!=idx){
        days[i].choosed=false;
      }
    }
    // console.log(days)
		this.setData({
			'calendar.days': days,
		});
	},
	chooseYearAndMonth() {
		let pickerYear = [];
		let pickerMonth = [];
		for (let i = 1900; i <= 2100; i++) {
			pickerYear.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			pickerMonth.push(i);
		}
		this.setData({
			'calendar.showPicker': true,
		});
	},
};

function _getCurrentPage() {
	const pages = getCurrentPages();
	const last = pages.length - 1;
	return pages[ last ];
}

export default (isone, price, self) => {
	// const self = _getCurrentPage();
	const date = new Date();
	const curYear = date.getFullYear();
	const curMonth = date.getMonth() + 1;
  const day=date.getDate();
	const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
  
	self.setData({
		calendar: {
			curYear,
			curMonth,
			weeksCh,
			hasEmptyGrid: false,
      isSelect : false
		},
    price:price,
    isone:isone
	});
	conf.calculateEmptyGrids.call(self, curYear, curMonth);
  conf.calculateDays.call(self, curYear, curMonth, day);
	self.tapDayItem = conf.tapDayItem.bind(self);
	self.handleCalendar = conf.handleCalendar.bind(self);
	self.chooseYearAndMonth = conf.chooseYearAndMonth.bind(self);
};
