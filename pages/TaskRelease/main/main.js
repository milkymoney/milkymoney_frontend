// pages/taskRelease/main/main.js


//submit task函数可用于后台调试


//发布方，state对应为[4,5,6]

var states = ['pending', 'doing', 'finished']
var types = ['questionnaire', 'errand']

var task1 = {
  taskReward: 5,
  taskInfo: "地点广州大学城，时间在2.29，先到先得",
  taskName: "跑腿任务",
  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
  tags: ["跑腿", "广州", '进行中'],
  state: states[1],
  taskID: '100000'
}
var task2 = {
  taskReward: 3,
  taskInfo: "调查问卷，关于奶牛APP的用户体验调查",
  taskName: "问卷任务",
  imageURL: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116589263&di=4ee6608f899a109627f89361a708c231&imgtype=0&src=http%3A%2F%2Fuploads.5068.com%2Fallimg%2F171124%2F1-1G124163233.jpg",
  tags: ["问卷", "调查", '进行中'],
  state: states[1],
  taskID: '100001'
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
    selection:3,
    //底部图标
    active: 3,

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

    //发布的任务类型，0-问卷，1-跑腿
    taskTypeSelection:'0',
    taskDDL:'',

    taskReward:1,
    taskName:'',
    taskInfo:'',
    tags:'',
    taskMaxAccept:1,


    isModifyTask:false,
    

    currentDate: new Date().getTime(),
    show: {
      middle: false,
      top: false,
      bottom: false,
      right: false,
      right2: false
    },
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
      selectedInfo: this.data.areaSelected + " " + this.data.taskTypeSelected + " " + this.data.sortOrderSelected,
    });
  },
  toggleBottomPopup() {
    this.toggle('bottom');
  },
  onCancel() {
    this.toggleBottomPopup()
  },
  onConfirmDDL(event) {
    const { detail, currentTarget } = event;
    const date = new Date(detail);
    const dataStr = date.toLocaleString()
    this.setData({
      taskDDL: dataStr
    })
    this.toggleBottomPopup()
  },

  /**
   * 提交审核，这里也可调试
   * 
   * 提交之后跳转到已发布任务界面，发布者可以查看自己发布的任务情况
   */
  submitTask() {

    
    //异常处理
    if (this.data.taskName.length==0){
      wx.showToast({
        title: '任务名不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.tags.length == 0) {
      wx.showToast({
        title: '标签不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.taskInfo.length == 0) {
      wx.showToast({
        title: '任务描述不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.taskDDL.length == 0) {
      wx.showToast({
        title: '任务时间不能空!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    

    /////////////////////////
    //
    //这里可以发布新任务，也是修改任务的地方
    //可用的变量：使用例子：this.data.taskTypeSelection
    //taskTypeSelection:'0',
    //taskDDL:'',
    //taskReward:0,
    //taskName:'',
    //taskInfo:'',
    //tags:'',
    //taskMaxAccept:0,
    //

    if (!this.data.isModifyTask) {
      console.log('POST /task/publisher')
      console.log(this.data)
      wx.request({
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher?userId=2',
        method: 'POST',
        header: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        data: {
          'type': types[Number(this.data.taskTypeSelection)],
          'description': this.data.taskInfo,
          'reward': this.data.taskReward,
          'deadline': this.data.taskDDL,
          'label': this.data.tags,

          'state': 5, // 发布方doing

          'priority': 0,
          'maxAccept': this.data.taskMaxAccept,
          'hasAccept': 0,
          'publisher': getApp().globalData.userInfo['nickName']
        },
        success(res) {
          console.log(res)
        }
      })
    } 
    else {
      
      console.log('PUT /task/publisher{taskId}')
      console.log(this.data)
      wx.request({
        // url: 'https://www.wtysysu.cn:10443/v1/task/publisher/' + this.data.taskID + '?userId=2',
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher/5?userId=2',
        method: 'PUT',
        header: {
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: {
          'tid': Number(this.data.taskID),
          'type': types[Number(this.data.taskTypeSelection)],
          'description': this.data.taskInfo,
          'reward': this.data.taskReward,
          'deadline': this.data.taskDDL,
          'labels': this.data.tags,
          // 'state': this.data.state, // pending
          'priority': 0,
          'maxAccept': this.data.taskMaxAccept,
          // 'hasAccept': this.data.hasAccept,
          'publisher': getApp().globalData.userInfo['nickName']
        },
        success(res) {
          console.log(res)
        }
      })
    }
    /////////////////////////
    
    //完成发布或者修改
    wx.showToast({
      title: '已发布成功/修改',
      icon: 'success',
      duration: 2000,
      success:()=>{
        //跳转界面
        this.setData({
          selection: 3,
          active:3
        });
      }
    })
    

    console.log('提交审核')
  },

  /**
   * 跳转到任务详情界面
   */

  navToTaskDetail(event){
    //console.log(event.target)
    wx.navigateTo({
      url: '../task_datail/task_detail?taskID=' + event.target.id,
    })
  },

  /**
   * 选择时间
   */
  chooseTime() {
    this.toggleBottomPopup()
  },

  /**
   * 选择参与人数
   */
  onChangeMaxAccept(event){
    this.setData({
      taskMaxAccept:event.detail
    })
    console.log(this.data.taskMaxAccept)
  },

  /**
   * 选择人均报酬
   */
  onChangeReward(event){
    this.setData({
      taskReward:event.detail
    })
  },

  /**
   * 选择发布的任务类型
   */
  onClickReleaseTaskType(event){
    const { value } = event.currentTarget.dataset;
    this.setData({
      taskTypeSelection: value
    });
  },

  /**
   * 输入发布任务名
   */
  onChangeTaskName({ detail }){
    this.setData({
      taskName:detail
    })
  },

  /**
   * 输入任务描述
   */
  onChangeTaskInfo({ detail }) {
    this.setData({
      taskInfo:detail
    })
  },

  /**
   * 输入任务标签
   */
  onChangeTaskTags({ detail }) {
    this.setData({
      tags: detail
    })
  },





  /**
   * 底部页面选择
   */
  onChange: function(event) {
    this.setData({
      selection:event.detail,
      active: event.detail
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
      if (task.state == states[1] || !task.state) {
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
   * 将获取到的任务装入taskListPre
   */
  onLoad: function (options) {
    //处理修改任务的跳转
    if (options.info) {
      let info=JSON.parse(options.info)
      this.setData({
        taskTypeSelection: info.taskTypeSelection,
        taskDDL: info.taskDDL,
        taskReward: info.taskReward,
        taskName: info.taskName,
        taskInfo: info.taskInfo,
        tags: info.tags,
        taskMaxAccept: info.taskMaxAccept,
        selection: 1,
        active: 1,
        taskID: info.taskID,
        isModifyTask:true
      })

    }else{
      let taskListPre = this.data.taskList
      ///////////////////////////////////////
      //
      //将获取到的任务装入taskListPre
      //
      console.log('GET /task/publisher')
      wx.request({
        // pageid: integer, keyword: string
        url: 'https://www.wtysysu.cn:10443/v1/task/publisher?page=0&keyword=' + this.data.search_value + '&userId=2',
        method: 'GET',
        header: {
          'accept': 'application/json'
        },
        success(res) {
          console.log(res)
          console.log(res.data.length)
          res.data.forEach(function (atask) {
            let _atask = {
              taskReward: atask.reward,
              taskInfo: atask.description,
              taskName: atask.type == '' ? '跑腿任务' : '问卷任务',//默认为跑腿
              imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
              tags: atask.label.length == 0 ? ['无'] : atask.label.split(" "),
              state: states[atask.state-4],//这里
              taskID: atask.tid
            }
            
            taskListPre.push(_atask)
          })
        }
      })
      //
      ////////////////////////////////////////
      taskListPre.push(task1)
      taskListPre.push(task2)

      this.setData({
        taskList: taskListPre,
        userInfo: getApp().globalData.userInfo,
        myPendingTasks: [],
        myDoingTasks: [],
        myFinishedTasks: [],
        isModifyTask: false
      })

      this.preparePendingTasks()
      this.prepareDoingTasks()
      this.prepareCheckingTasks()
    }

    
    
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
   * 用户下拉，进行刷新
   */
  onPullDownRefresh: function () {
    
    //当用户在已发布的任务界面时  
    //下拉，刷新用户的已发布列表
    if (this.data.selection==3){
      //在标题栏中显示加载
      wx.showNavigationBarLoading()

      //这里增加刷新函数
      let taskList=[]

      ///////////////////////////
      //
      //将获取到的push到taskList
      //
      console.log('GET /task/publisher')
      console.log('search_value: ' + this.data.search_value)


      let taskPromise=new Promise((resolve,reject)=>{
        wx.request({
          url: 'https://www.wtysysu.cn:10443/v1/task/publisher?page=0&keyword=' + this.data.search_value + '&userId=2',
          method: 'GET',
          header: {
            'accept': 'application/json',
          },
          success(res) {
            console.log(res)
            if (Array.isArray(res.data)){
              res.data.forEach(function (atask) {
                let _atask={
                  taskReward: atask.reward,
                  taskInfo:atask.description,
                  taskName: atask.type==''?'跑腿任务':'问卷任务',//默认为跑腿
                  imageURL: "//timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556116323349&di=6be5283ffd7a6358d50df808562a0c5d&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fdesign%2F01%2F11%2F96%2F52%2F59608df330036.png",
                  tags: atask.label.length==0? ['无']:atask.label.split(" "),
                  state: states[atask.state-4],//这里
                  taskID:atask.tid
                }
                taskList.push(_atask)
              })
            }
            
            resolve('ok')
          }
        })
      })
      
      // 
      ///////////////////////////
      taskPromise.then((res)=>{
        taskList.push(task1)
        taskList.push(task2)
        this.setData({
          taskList: taskList,
          myPendingTasks: [],
          myDoingTasks: [],
          myFinishedTasks: [],
        })
        console.log(this.data.taskList)

        this.preparePendingTasks()
        this.prepareDoingTasks()
        this.prepareCheckingTasks()

        //加载完成
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
      
      

    }
    
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