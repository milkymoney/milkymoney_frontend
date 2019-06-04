// pages/TaskAccept/main/main.js
var states=['pending','doing','checking','other']

var task1 = {
  taskReward: 5,
  taskInfo: "地点广州大学城，时间在2.29，先到先得",
  taskName: "跑腿任务",
  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
  tags: ["跑腿", "广州",'待审核'],
  state:states[0],
  taskID:'1'
}
var task2 = {
  taskReward: 3,
  taskInfo: "调查问卷，关于奶牛APP的用户体验调查",
  taskName: "问卷任务",
  imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg",
  tags: ["问卷", "调查",'待完成'],
  state:states[1],
  taskID:'2'
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value_main:'',
    search_value_personal: '',

    selection: 0,
    location_city:'广州',
    taskList:[],
    //找任务筛选显示
    seletcedTaskList:[],

    //msgNumber表示个人信息通知数量
    msgNumber:0,

    show: {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false
    },
    areas: ["所有",'广州', "深圳", "佛山", "东莞", "珠海", "澳门", "香港", "中山"],
    taskType:["不限类型","数据调研","数据采集","跑腿服务"],
    sortOrder:["不限排序","最新发布","离我最近","报酬最高"],

    areaSelected:'所有',
    taskTypeSelected:'不限类型',
    sortOrderSelected:'不限排序',

    selectedToogle:'areas',
    selectedInfo:'所有 不限类型 不限排序',

    myTasks:[],
    myPendingTasks:[],
    myDoingTasks:[],
    myCheckingTasks:[],
    myOtherTasks:[],

    userInfo:null
  },

  /**
   * 任务详情跳转函数
   */
  navToTaskDetail(event) {
    //console.log(event)
    wx.navigateTo({
      url: '../task_datail/task_detail?taskID='+event.target.id,
    })
  },

  /**
   * 底部弹出选择
   */
  onTransitionEnd() {
    //console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type],
      selectedInfo:this.data.areaSelected+" "+this.data.taskTypeSelected+" "+this.data.sortOrderSelected,
    });
  },

  toggleBottomPopup(){
    this.toggle('bottom');
  },

  toggleBottomPopupArea() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'areas'
    })
  },
  
  toggleBottomPopupTaskType() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'taskType'
    })
  },

  toggleBottomPopupSortOrder() {
    this.toggle('bottom');
    this.setData({
      selectedToogle:'sortOrder'
    })
  },


  onCancel() {
    this.toggleBottomPopup()
  },

  onConfirmArea(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      areaSelected:value
    })
    console.log("onConfirmArea:" + this.data.areaSelected)
    this.toggleBottomPopup()
    this.selectTaskBasedOnSelectedInfo()
  },
  
  onConfirmTaskType(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      taskTypeSelected: value
    });
    console.log("onConfirmTaskType:"+this.data.taskTypeSelected);
    this.toggleBottomPopup()
    this.selectTaskBasedOnSelectedInfo()
  },

  onConfirmSortOrder(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      sortOrderSelected: value
    });
    console.log("onConfirmSortOrder:"+this.data.sortOrderSelected)
    this.toggleBottomPopup()
    this.selectTaskBasedOnSelectedInfo()
  },
  
  /**
   * 根据筛选标准排序 
   */
  selectTaskBasedOnSelectedInfo(){
    //发送区域和类型到服务器后端，然后根据返回结果进行排序，暂时未做完

    //暂定seletcedTaskListTemp为从后端获取到的数据
    let seletcedTaskListTemp=this.data.taskList
    this.setData({
      seletcedTaskList:seletcedTaskListTemp
    })
    //对上面的进行排序
    if (this.sortOrderSelected =='最新发布'){

    } else if (this.sortOrderSelected == '离我最近'){

    } else if (this.sortOrderSelected == '报酬最高'){

    }else{
      //无需排序

    }



  },

  /**
   * 底部页面选择
   */
  onChange: function (event) {
    this.setData({
      selection: event.detail
    });

    //跳转到发布任务界面
    if (this.data.selection == 2) {
      wx.redirectTo({
        url: '../../TaskRelease/main/main',
      })
    }

  },




  /**
   * 搜索函数
   */
  onChangeMain(event){
    this.setData({
      search_value_main:event.detail
    })
  },

  onSearchMain(){
    console.log("onSearchMain:"+this.data.search_value_main)
  },

  onChangePersonalTask(event){
    this.setData({
      search_value_personal: event.detail
    })
  },

  onSearchPersonalTask(){
    console.log("onSearchPersonalTask:" + this.data.search_value_personal)
    
  },

  /**
   * 切换任务袋的tab
   */
  onChangeTab(event){
    //这里未完成，以后需要从服务端获取对应的个人任务
    this.setData({
      myTasks:this.data.taskList,
      myPendingTasks: [],
      myDoingTasks: [],
      myCheckingTasks: [],
      myOtherTasks: []
    })

    if (event.detail.index==0){
      //待审核
      this.preparePendingTasks()
    } else if (event.detail.index==1){
      //待完成
      this.prepareDoingTasks()
    } else if (event.detail.index == 2) {
      //待验收
      this.prepareCheckingTasks()
    }else{
      //其他
      this.prepareOtherTasks() 
    }
  },
  preparePendingTasks(){
    let listTemp = this.data.myPendingTasks
    this.data.myTasks.forEach(task => {
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
    this.data.myTasks.forEach(task => {
      if (task.state == states[1]) {
        listTemp.push(task)
        this.setData({
          myDoingTasks: listTemp
        })
      }
    })
  },
  prepareCheckingTasks() {
    let listTemp = this.data.myCheckingTasks
    this.data.myTasks.forEach(task => {
      if (task.state == states[2]) {
        listTemp.push(task)
        this.setData({
          myCheckingTasks: listTemp
        })
      }
    })
  },
  prepareOtherTasks() {
    let listTemp = this.data.myOtherTasks
    this.data.myTasks.forEach(task => {
      if (task.state == states[3]) {
        listTemp.push(task)
        this.setData({
          myOtherTasks: listTemp
        })
      }
    })
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
      myTasks: taskListPre,
      myPendingTasks: [],
      myDoingTasks: [],
      myCheckingTasks: [],
      myOtherTasks: []
    })

    this.preparePendingTasks()
    this.prepareDoingTasks()
    this.prepareCheckingTasks()
    this.prepareOtherTasks()
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
    //在标题栏中显示加载
    wx.showNavigationBarLoading()

    //这里增加刷新函数
    if(this.data.selection==0||this.data.selection==1){
      //下拉刷新所有的可见已发布任务

    }else if(this.data.selection==3){
      //下拉刷新自己的任务袋

    }

    //加载完成
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
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