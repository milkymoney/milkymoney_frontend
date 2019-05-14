// pages/taskRelease/main/main.js
var states = ['pending', 'doing', 'finished']

var task1 = {
  taskReward: 5,
  taskInfo: "地点广州大学城，时间在2.29，先到先得",
  taskName: "跑腿任务",
  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
  tags: ["跑腿", "广州", '进行中'],
  state: states[1]
}
var task2 = {
  taskReward: 3,
  taskInfo: "调查问卷，关于奶牛APP的用户体验调查",
  taskName: "问卷任务",
  imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg",
  tags: ["问卷", "调查", '进行中'],
  state: states[1]
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    location_city: '广州',
    /*默认停留在主页
      0:主页
      1:查询
      3：任务
      4：账户
    */
    selection:0,

    //搜索框输入
    search_value:'',

    //待审核，进行中，已完成
    taskList: [],
    myPendingTasks: [],
    myDoingTasks: [],
    myFinishedTasks: [],

    userInfo: null,

    //msgNumber表示个人信息通知数量
    msgNumber: 0,
  },

  /**
   * 底部页面选择
   */
  onChange: function(event) {
    this.setData({
      selection:event.detail
    });

    //跳转到接受任务界面
    if(this.data.selection==2){
      wx.redirectTo({
        url: '../../TaskAccept/main/main',
      })
    }

  },
  
  /**
   * 切换任务袋的tab
   */
  onChangeTab(event) {
    //这里未完成，以后需要从服务端获取对应的个人任务
    this.setData({
      myPendingTasks: [],
      myDoingTasks: [],
      myFinishedTasks: [],
    })

    if (event.detail.index == 0) {
      //待审核
      this.preparePendingTasks()
    } else if (event.detail.index == 1) {
      //进行中
      this.prepareDoingTasks()
    } else if (event.detail.index == 2) {
      //已完成
      this.prepareCheckingTasks()
    } 
  },

  preparePendingTasks() {
    let listTemp = this.data.myPendingTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[0]) {
        listTemp.push(task)
        this.setData({
          myPendingTasks: listTemp
        })
      }
    })
  },
  prepareDoingTasks() {
    let listTemp = this.data.myDoingTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[1]) {
        listTemp.push(task)
        this.setData({
          myDoingTasks: listTemp
        })
      }
    })
  },
  prepareCheckingTasks(){
    let listTemp = this.data.myCheckingTasks
    this.data.taskList.forEach(task => {
      if (task.state == states[2]) {
        listTemp.push(task)
        this.setData({
          myCheckingTasks: listTemp
        })
      }
    })
  },




  /**
   * 搜索页面
   */
  onSearchChange:function(input){
    this.setData({
      search_value:input.detail
    })
  },
  onSearch:function(){
    if(this.data.search_value){
      wx.showToast({
        title:'搜索:'+this.data.search_value
      });
    }
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let taskListPre = this.data.taskList
    taskListPre.push(task1)
    taskListPre.push(task2)

    this.setData({
      taskList: taskListPre,
      userInfo: getApp().globalData.userInfo,
      myPendingTasks: [],
      myDoingTasks: [],
      myFinishedTasks: [],
    })

    this.preparePendingTasks()
    this.prepareDoingTasks()
    this.prepareCheckingTasks()
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