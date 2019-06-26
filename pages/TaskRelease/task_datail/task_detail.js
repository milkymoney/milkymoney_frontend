// pages/task_datail/task_detail.js

import Dialog from '../../../dist/dialog/dialog';

var states = ['pending', 'doing', 'finished']

var checkState = ['unchecked', 'passed', 'unpassed']
var types = ['questionnaire', 'errand']



/*此数据代表用户的验收情况，现已通过后端获取，无需本地
var user1_data = {

  state: checkState[0],
  userID: 123,
  imagesURL: [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558469542018&di=8208af6eb1a987d9dc431509aa7ad91d&imgtype=0&src=http%3A%2F%2Fi3.hexun.com%2F2018-06-23%2F193257855.jpg',
    'http://img3.imgtn.bdimg.com/it/u=2932025398,934944233&fm=26&gp=0.jpg',
    'http://img4.imgtn.bdimg.com/it/u=3475521849,1650563933&fm=26&gp=0.jpg']
}
*/


Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskID: '',
    taskReward: '',
    taskTypeSelection: '',
    taskDDL: '',
    taskMaxAccept: 10,
    taskInfo: "",
    taskName: "",
    //任务的描述图片
    imageURL: "",
    state: '',
    tags: [],
    questionnairePath: null,
    type: '',

    //任务审核时用户上传的资料
    usersData: [],

    //下面是状态栏的显示
    active: 0,
    steps: [
      {
        text: '待审核阶段',
        desc: '审核中，请等待milky money后台审核'
      },
      {
        text: '进行阶段',
        desc: '进行中，请尽快审核用户提交情况'
      },
      {
        text: '已完成',
        desc: '您已经通过milky money完成本次活动'
      }
    ],

    //勾选全部的情况
    checked_all: false,


    /**
     * 验收列表的验收情况
     * 每一项的数据结构：
     * {  
     *  userID:
     *  checkState:
     * }
     */
    checks: [],

    //下面的用于显示复选框
    isPass: [],
    isUnPass: [],

    //支付的对话框
    showDialog: false,
    password: '',
    titleDialog: '您需要输入确认支付密码'
  },

  /**
   * 支付窗口点击确认按钮时，会返回获取到的用户信息
   */
  getUserInfo(event) {
    //console.log(event.detail);
  },

  /**
   * 删除当前任务
   */
  deleteTask() {
    let taskPromise = new Promise((resolve, reject) => {
      console.log('DELETE /task/publisher/{taskId}')
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher/' + this.data.taskID + '?userId=2',
        method: 'DELETE',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          resolve(res.data)
        }
      })
    })

    taskPromise.then((resolve) => {
      if (resolve.success) {
        wx.navigateTo({
          url: '../main/main',
          success: () => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
            })
          }
        })
      } else {
        wx.showToast({
          title: resolve.message,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  /**
   * 开启支付对话框
   */
  showCustomDialog() {
    this.setData({ showDialog: true });
  },

  /**
   * 
   */
  changeTask() {
    let info = {
      taskTypeSelection: this.data.taskTypeSelection,
      taskDDL: this.data.taskDDL,
      taskReward: this.data.taskReward,
      taskName: this.data.taskName,
      taskInfo: this.data.taskInfo,
      tags: this.data.tags,
      taskMaxAccept: this.data.taskMaxAccept,
      taskID: this.data.taskID
    }
    wx.redirectTo({
      url: '../../TaskRelease/main/main?info=' + JSON.stringify(info),
    })
  },

  /**
   * 输入密码 
   */
  onChangePassword(event) {
    //console.log(event.detail)
  },

  /**
   * 关闭支付的对话窗口
   */
  onCloseDialog(event) {
    if (event.detail === 'confirm') {
      setTimeout(() => {
        this.setData({
          showDialog: false
        });
        wx.showToast({
          title: '支付成功',
          icon: 'success',
        })

      }, 1000);
    } else {
      this.setData({
        showDialog: false
      });
    }
  },


  /**
   * 验收单个
   */
  onChangeChecked(event) {

    const userID = event.target.dataset.userid
    const checkType = event.target.dataset.checktype
    const index = event.target.dataset.idx

    if (checkType == 'passed') {
      let isPassTemp = this.data.isPass
      let isUnPassTemp = this.data.isUnPass
      isPassTemp[index] = event.detail
      isUnPassTemp[index] = !event.detail

      this.setData({
        isPass: isPassTemp,
        isUnPass: isUnPassTemp
      })

    } else {
      //unPassed
      let isUnPassTemp = this.data.isUnPass
      let isPassTemp = this.data.isPass
      isUnPassTemp[index] = event.detail
      isPassTemp[index] = !event.detail

      this.setData({
        isUnPass: isUnPassTemp,
        isPass: isPassTemp,
        checked_all: 0
      })
    }

  },

  /**
   * 勾选全部通过
   */
  onChangeCheckedAll(event) {

    let isPassTemp = this.data.isPass
    let isUnPassTemp = this.data.isUnPass

    if (event.detail) {
      for (let i = 0; i < isPassTemp.length; i++) {
        isPassTemp[i] = true
        isUnPassTemp[i] = false
      }
    } else {
      for (let i = 0; i < isPassTemp.length; i++) {
        isPassTemp[i] = false
      }
    }

    this.setData({
      checked_all: event.detail,
      isPass: isPassTemp,
      isUnPass: isUnPassTemp
    });
  },

  /**
   * 处理点击图片预览
   */
  handleImagePreview(e) {

    const url = e.target.dataset.url
    wx.previewImage({
      current: url,
      urls: [url],
    })

  },

  /**
   * 提交验收评价
   */
  submitChecked() {
    //支付
    this.showCustomDialog({
      success: () => {
        console.log('asd')
      }
    })

    console.log('验收提交')
    let passedUsers = []
    let unpassedUsers = []

    let usersDataTemp = this.data.usersData
    //提交之后刷新页面
    for (let i = 0; i < usersDataTemp.length; i++) {
      //对之前未验收的进行验收
      if (usersDataTemp[i].state == checkState[0]) {
        if (this.data.isPass[i]) {
          usersDataTemp[i].state = checkState[1]
          passedUsers.push(usersDataTemp[i].userID)
        } else if (this.data.isUnPass[i]) {
          usersDataTemp[i].state = checkState[2]
          unpassedUsers.push(usersDataTemp[i].userID)
        } 
      } else if (usersDataTemp[i].state == checkState[1]) {
        passedUsers.push(usersDataTemp[i].userID)
      } else if (usersDataTemp[i].state == checkState[2]) {
        unpassedUsers.push(usersDataTemp[i].userID)
      }
    }

    console.log(usersDataTemp)


    //验收的提交内容为usersDataTemp,
    //usersDataTemp是一个列表，单个的数据结构为 
    //{  userID: 用户ID,
    //   checkState: 该用户的验收情况'unchecked','passed','unpassed'
    // }

    if (passedUsers.length == 0 && unpassedUsers.length == 0) {
      wx.showToast({
        title: '未验收任何用户',
        icon: 'none',
        duration: 2000
      })
      return
    }

    
    let confirmTimes = 2
    if (passedUsers.length == 0) {
      confirmTimes -= 1
    }
    if (unpassedUsers.length == 0) {
      confirmTimes -= 1
    }

    let taskPromise = new Promise((resolve, reject) => {
      console.log('POST /task/publisher/confirm/{taskId}')
      let confirms = []
      if (passedUsers.length != 0) {
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher/confirm/' + this.data.taskID + '?userId=2',
          method: 'POST',
          header: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          data: {
            'checkState': "passed",
            'users': passedUsers
          },
          success(res) {
            console.log(res)
            confirms.push(res.data)
            if (confirms.length == confirmTimes) {
              resolve(confirms)
            }
          }
        })
      }
      if (unpassedUsers.length != 0) {
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher/confirm/' + this.data.taskID + '?userId=2',
          method: 'POST',
          header: {
            'accept': 'application/json',
            'content-type': 'application/json'
          },
          data: {
            'checkState': "unpassed",
            'users': unpassedUsers
          },
          success(res) {
            console.log(res)
            confirms.push(res.data)
            if (confirms.length == confirmTimes) {
              resolve(confirms)
            }
          }
        })
      }

    })

    taskPromise.then((resolve) => {
      if(resolve.length == 1 && resolve[0].success) {
        wx.navigateTo({
          url: '../main/main',
          success: () => {
            wx.showToast({
              title: '验收成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else if (resolve.length == 2 && resolve[0].success && resolve[1].success) {
        wx.navigateTo({
          url: '../main/main',
          success: () => {
            wx.showToast({
              title: '验收成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          title: '验收失败',
          icon: 'none',
          duration: 2000
        })
      }
    })

    this.setData({
      usersData: usersDataTemp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //这里需要根据taskID获取对应的信息
    //将获取到的待验收信息push进usersDataTemp

    let taskPromise1 = new Promise((resolve, reject) => {
      console.log('GET /task/publisher/confirm/{taskId}')
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher/confirm/' + options.taskID + '?userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          resolve(res.data)
        }
      })
    })

    taskPromise1.then((resolve) => {
      let usersDataTemp = []

      if (Array.isArray(resolve)) {
        resolve.forEach(function(user_info) {
          let user_data = {
            state: user_info.checkState,
            userID: user_info.id,
            imagesURL: []
          }

          if (Array.isArray(user_info.proves)) {
            user_info.proves.forEach(function(img) {
              user_data.imagesURL.push('https://www.wtysysu.cn:10443/image/' + img)
            })
          }

          usersDataTemp.push(user_data)
        })
      }



      console.log(usersDataTemp)

      // 简单排序等待验收的接受者，其中unchecked的排在前面，其次是passed，最后是unpassed
      let checkState2i = { "unchecked": 0, "passed": 1, "unpassed": 2}
      usersDataTemp.sort(function(a, b) {
        return checkState2i[a.state] - checkState2i[b.state]
      })

      //这个是用于存储验收状态的
      let checkTemp = []
      for (let i = 0; i < usersDataTemp.length; i++) {
        let check = {
          userID: usersDataTemp[i],
          checkState: usersDataTemp[i]
        }
        checkTemp.push(check)
      }

      let isPassedTemp = new Array(checkTemp.length)
      let isUnpassedTemp = new Array(checkTemp.length)

      for (let i = 0; i < checkTemp.length; i++) {
        isPassedTemp[i] = false
        isUnpassedTemp[i] = false
      }

      this.setData({
        taskID: options.taskID,
        usersData: usersDataTemp,
        checks: checkTemp,
        isPass: isPassedTemp,
        isUnPass: isUnpassedTemp
      })
    })

    //根据taskID获取本页面的任务内容（不包括验收内容）
    let taskPromise2 = new Promise((resolve, reject) => {
      console.log('GET /task/publisher/{taskId}')
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher/' + options.taskID + '?userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'          
        },
        success(res) {
          console.log(res)
          resolve(res.data)
        }
      })
    })

    taskPromise2.then((resolve) => {

     
      this.setData({
        taskReward: resolve.reward,
        taskInfo: resolve.description,
        taskName: (resolve.type == types[0]) ? "问卷任务" : "跑腿任务",
        imageURL: (resolve.type == types[0]) ? "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg" : "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
        tags: resolve.label.split(/\s+/),
        state: states[resolve.state - 4],
        type: resolve.type,
        taskTypeSelection: (resolve.type == types[0] ? "0" : "1"),
        taskDDL: resolve.deadline,
        taskMaxAccept: resolve.maxAccept
      })
      

      switch (this.data.state) {
        case states[0]: {
          this.setData({
            active: 0
          })
          break
        }
        case states[1]: {
          this.setData({
            active: 1
          })
          break
        }
        case states[2]: {
          this.setData({
            active: 2
          })
          break
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})